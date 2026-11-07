import * as THREE from 'three'
import { outfit } from '@tiny/core/slots'
import { revealFloorTransition } from '@/features/hall/lib/floor-transition'
import { loadCharacterSprites, type CharacterSprites } from '@/features/hall/scene/assets'
import { CameraRig } from '@/features/hall/scene/cameras'
import { CONFIG } from '@/features/hall/scene/config'
import { createCharacter, type Character } from '@/features/hall/scene/character'
import type { Viewport } from '@/features/hall/scene/overlay'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { createRoomPassage } from '@/features/hall/scene/room-passage'
import { Traversal } from '@/features/hall/scene/traversal'
import { lookOf } from '@/features/hall/scene/wardrobe'
import { joinRoom, type Room } from '@/features/presence/lib/join-room'
import { defaultStore } from '@/shared/lib/slots'
import { ROOM_ART, type RoomArt } from './art'
import { createArtCache } from './art-cache'
import { linkedDoor } from './links'
import { createNearby, type Nearby } from './nearby'
import { createPerfMeter } from './perf'
import type { Arrival, DoorRef, Frame, JoinedContents, RoomContents, RoomContext, RoomDef, RoomId, RoomSound } from './types'

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600
const WALKING_SPEED = 0.12
const MAX_RIG_WAIT_MS = 8000
const QUIET_AFTER_SECONDS = 2
/** How long a room's art stays loaded after the visitor leaves it or walks away from its door. */
const KEEP_ART_MS = 60_000
/** Start loading the next room once the visitor is this many screen widths from its door. */
const PREFETCH_SCREENS = 1.5
/** Wait this long after a room shows before loading the next one, so it doesn't compete with this room's own loading. */
const PREFETCH_AFTER_READY_MS = 1500
const PREFETCH_CHECK_MS = 250
/** Joined rooms are built within one view width beyond the screen's edge and removed beyond two. */
const JOINED_REACH = { loadScreens: 1, unloadScreens: 2 }

export interface StageHosts {
  canvas: HTMLElement
  overlay: HTMLElement
  character: HTMLElement
}

export interface StageHandlers {
  isSuspended(): boolean
  onReady(): void
  onError(message: string): void
  onExit(to: DoorRef): void
  /** The visitor is close to a door; the page can prefetch the route behind it. */
  onApproach?(to: DoorRef): void
}

export interface StageRoom {
  dispose(): void
}

export interface Stage {
  enter<Art>(room: RoomDef<Art>, arrival: Arrival, handlers: StageHandlers): StageRoom
  dispose(): void
}

interface StageOptions {
  hosts: StageHosts
  sound: () => RoomSound
}

interface Entry {
  room: RoomDef<unknown>
  arrival: Arrival
  handlers: StageHandlers
  startedAt: number
  ready: boolean
  readyAt: number
  scene: THREE.Scene | null
  contents: RoomContents | null
  ctx: RoomContext | null
  joined: Map<string, JoinedContents>
  nearby: Nearby
  presence: Room | null
  holdsArt: boolean
  warm: boolean
  disposed: boolean
  frameCount: number
  approached: Set<string>
  prefetchCheckAt: number
}



interface Runtime {
  renderer: THREE.WebGLRenderer
  pixelRatio: ReturnType<typeof createPixelRatioGovernor>
  rig: CameraRig
  traversal: Traversal
  character: Character
  passage: ReturnType<typeof createRoomPassage>
  viewport: Viewport
  dispose(): void
}

export function createStage({ hosts, sound }: StageOptions): Stage {
  let isDisposed = false
  let runtime: Runtime | null = null
  let current: Entry | null = null
  let frameHandle = 0
  let doorStartedAt: number | null = null
  const artCache = createArtCache<RoomId, unknown>({
    load: (id) => (ROOM_ART[id] as RoomArt<unknown>).load(renderer),
    unload: (id, loaded) => (ROOM_ART[id] as RoomArt<unknown>).unload(loaded),
    keepMs: KEEP_ART_MS,
  })
  const perf = createPerfMeter(hosts.overlay)

  const renderer = new THREE.WebGLRenderer({ antialias: false })
  const initPromise = initialize().then((value) => {
    if (isDisposed) {
      value.dispose()
      throw new Error('Stage disposed')
    }
    runtime = value
    return value
  })
  initPromise.catch(() => {})

  /** The entered room and the joined rooms built around it, in that order. */
  function partsOf(entry: Entry | null): (RoomContents | JoinedContents)[] {
    if (!entry?.contents) return []
    return [entry.contents, ...entry.joined.values()]
  }

  function syncJoined(entry: Entry, cameraX: number, viewWidth: number): void {
    const rooms = entry.contents?.joined?.()
    if (!rooms || !entry.ctx) return
    entry.nearby.update(rooms, cameraX, viewWidth)
    for (const [key, joined] of entry.joined) {
      if (entry.nearby.isLoaded(key)) continue
      joined.dispose()
      entry.joined.delete(key)
    }
    for (const room of rooms) {
      if (entry.nearby.isLoaded(room.key) && !entry.joined.has(room.key)) entry.joined.set(room.key, room.build(entry.ctx))
    }
  }

  function isCurrent(entry: Entry): boolean {
    return !isDisposed && current === entry && !entry.disposed
  }

  function isQuiet(entry: Entry | null = current): boolean {
    if (!entry || !entry.ready || !runtime) return true
    return (
      runtime.passage.busy ||
      entry.handlers.isSuspended() ||
      document.querySelector('[aria-modal="true"]') !== null
    )
  }

  function closeEntry(entry: Entry): void {
    if (entry.disposed) return
    entry.disposed = true
    for (const joined of entry.joined.values()) joined.dispose()
    entry.joined.clear()
    entry.contents?.dispose()
    entry.ctx = null
    if (entry.holdsArt) {
      artCache.release(entry.room.id)
      entry.holdsArt = false
    }
    entry.presence?.dispose()
    entry.presence = null
    entry.contents = null
    entry.scene = null
    if (runtime) runtime.renderer.domElement.style.cursor = ''
  }

  async function open(entry: Entry): Promise<void> {
    const heldArt = artCache.acquire(entry.room.id)
    entry.holdsArt = true
    entry.warm = heldArt.loaded
    const loading = heldArt.loading
    let stage: Runtime
    try {
      stage = await initPromise
    } catch (error) {
      if (isCurrent(entry)) {
        entry.handlers.onError(String(error))
        revealFloorTransition()
        current = null
        closeEntry(entry)
      }
      return
    }
    if (!isCurrent(entry)) return

    stage.passage.reset()
    stage.traversal.reset(0)
    stage.traversal.setSuspended(false)
    stage.traversal.idleSeconds = 0
    stage.character.setOpacity(1)
    stage.character.perch(null)
    entry.readyAt = Infinity

    const result = await loading
    if (!result.ok) {
      if (!isCurrent(entry)) return
      entry.handlers.onError((result.error as Error).message)
      revealFloorTransition()
      current = null
      closeEntry(entry)
      return
    }
    const { art } = result
    if (!isCurrent(entry)) return

    const look = entry.room.initialLook?.()
    if (look) void stage.character.wear(look).catch(() => {})

    stage.renderer.setClearColor(new THREE.Color(entry.room.clearColor))
    const scene = new THREE.Scene()
    entry.scene = scene
    const ctx: RoomContext = {
      scene,
      overlay: hosts.overlay,
      characterHost: hosts.character,
      character: stage.character,
      traversal: stage.traversal,
      rig: stage.rig,
      sound: {
        play: (name) => sound().play(name),
        prepare: (name) => sound().prepare(name),
        setWalking: (walking) => sound().setWalking(walking),
      },
      arrival: entry.arrival,
      warm: entry.warm,
      leave(door) {
        const at = entry.room.doors[door]
        if (!at) return
        const to = linkedDoor({ room: entry.room.id, door })
        if (to) artCache.prefetch(to.room)
        stage.passage.leave(() => {
          if (!to) return
          doorStartedAt = performance.now()
          entry.handlers.onExit(to)
        }, at)
      },
      isQuiet: () => isQuiet(entry),
    }

    try {
      entry.ctx = ctx
      entry.contents = entry.room.build(ctx, art)
    } catch (error) {
      if (isCurrent(entry)) {
        entry.handlers.onError(String(error))
        revealFloorTransition()
        current = null
      }
      closeEntry(entry)
    }
  }

  function enter<Art>(room: RoomDef<Art>, arrival: Arrival, handlers: StageHandlers): StageRoom {
    const entry: Entry = {
      room: room as RoomDef<unknown>,
      arrival,
      handlers,
      startedAt: performance.now(),
      ready: false,
      readyAt: Infinity,
      scene: null,
      contents: null,
      ctx: null,
      joined: new Map(),
      nearby: createNearby(JOINED_REACH),
      presence: null,
      holdsArt: false,
      warm: false,
      disposed: false,
      frameCount: 0,
      approached: new Set(),
      prefetchCheckAt: 0,
    }
    const previous = current
    current = entry
    if (previous) closeEntry(previous)
    void open(entry)
    return {
      dispose() {
        if (entry.disposed) return
        if (current === entry) current = null
        closeEntry(entry)
      },
    }
  }

  async function initialize(): Promise<Runtime> {
    const pixelRatio = createPixelRatioGovernor(renderer, window.devicePixelRatio)
    renderer.domElement.className = 'hall-canvas'
    hosts.canvas.appendChild(renderer.domElement)

    const viewport: Viewport = { width: 1, height: 1, left: 0, top: 0 }
    const rig = new CameraRig(1, 1)
    function applyViewport(): void {
      const rect = hosts.canvas.getBoundingClientRect()
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      if (width === viewport.width && height === viewport.height) return
      viewport.width = width
      viewport.height = height
      renderer.setSize(width, height)
      rig.resize(width, height)
      traversal.setView(rig.viewWidth / width, rig.viewWidth)
    }

    const traversal = new Traversal()
    traversal.attach(renderer.domElement)

    applyViewport()
    const resizeObserver = new ResizeObserver(applyViewport)
    resizeObserver.observe(hosts.canvas)

    const dip = document.createElement('div')
    dip.className = 'floor-dip'
    dip.hidden = true
    hosts.canvas.parentElement?.appendChild(dip)

    const passage = createRoomPassage({ traversal, doorX: 0, clearX: 0, dip })

    let sprites: CharacterSprites
    try {
      sprites = await loadCharacterSprites()
    } catch (error) {
      resizeObserver.disconnect()
      traversal.detach()
      passage.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      throw error
    }
    if (isDisposed) {
      resizeObserver.disconnect()
      traversal.detach()
      passage.dispose()
      renderer.dispose()
      renderer.forceContextLoss()
      renderer.domElement.remove()
      throw new Error('Stage disposed')
    }

    const character = createCharacter(sprites, hosts.character, lookOf(defaultStore().getSlot(outfit).snapshot()))
    let rigSettled = false
    void character.ready.finally(() => {
      rigSettled = true
    })
    let fontsReady = false
    void document.fonts.ready.then(() => {
      fontsReady = true
    })

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()
    let pressX = 0
    let pressY = 0
    let pressedAt = 0
    let isTap = false

    function aim(event: MouseEvent): void {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, rig.camera)
    }

    function handlePointerDown(event: PointerEvent): void {
      isTap = false
      pressX = event.clientX
      pressY = event.clientY
      pressedAt = performance.now()
      aim(event)
      for (const part of partsOf(current)) part.pointerDown?.(raycaster)
    }

    function handlePointerUp(event: PointerEvent): void {
      const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
      const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
      isTap = !(moved > slop || performance.now() - pressedAt > TAP_TIMEOUT_MS || isQuiet())
    }

    function handleClick(event: MouseEvent): void {
      if (!isTap) return
      isTap = false
      aim(event)
      const parts = partsOf(current)
      if (parts.length === 0) return
      // A tap on the character itself jumps, ahead of whatever stands behind it.
      const rect = renderer.domElement.getBoundingClientRect()
      if (character.isUnder(event.clientX - rect.left, event.clientY - rect.top) && traversal.jump()) return
      for (const part of parts) {
        const interaction = part.hitTest(raycaster, 'tap')
        if (!interaction) continue
        if (!interaction.silent) sound().play('click')
        if (interaction.activate() !== false) return
      }
    }

    function handlePointerMove(event: PointerEvent): void {
      if (event.pointerType !== 'mouse' || event.buttons !== 0) return
      aim(event)
      const live = !isQuiet() && partsOf(current).some((part) => part.hitTest(raycaster) !== null)
      renderer.domElement.style.cursor = live ? 'pointer' : ''
    }

    renderer.domElement.addEventListener('pointerdown', handlePointerDown)
    renderer.domElement.addEventListener('pointerup', handlePointerUp)
    renderer.domElement.addEventListener('pointermove', handlePointerMove)
    renderer.domElement.addEventListener('click', handleClick)

    let lastFrameAt = performance.now()
    let isCharacterShown = true

    // The character layer floats over the page, loading screens included, so it shows only
    // while a room is ready; otherwise the last room's bunny would hang over the next one's loading.
    function showCharacter(shown: boolean): void {
      if (shown === isCharacterShown) return
      isCharacterShown = shown
      hosts.character.style.visibility = shown ? '' : 'hidden'
    }

    /** Loads the art behind any door the visitor is near, so walking through it is quick. */
    function prefetchNearDoors(entry: Entry, now: number): void {
      if (now < entry.prefetchCheckAt || now - entry.readyAt < PREFETCH_AFTER_READY_MS) return
      entry.prefetchCheckAt = now + PREFETCH_CHECK_MS
      const reach = rig.viewWidth * PREFETCH_SCREENS
      for (const [name, door] of Object.entries(entry.room.doors)) {
        if (Math.abs(traversal.x - door.x) > reach) continue
        const to = linkedDoor({ room: entry.room.id, door: name })
        if (!to) continue
        artCache.prefetch(to.room)
        if (!entry.approached.has(name)) {
          entry.approached.add(name)
          entry.handlers.onApproach?.(to)
        }
      }
    }

    function renderFrame(now: number): void {
      frameHandle = requestAnimationFrame(renderFrame)
      const frameMs = now - lastFrameAt
      const entry = current
      try {
        drawFrame(now, entry)
      } finally {
        perf.frame(frameMs, performance.now() - now, entry?.ready ? entry.room.id : null, traversal.cameraX)
      }
    }

    function drawFrame(now: number, entry: Entry | null): void {
      pixelRatio.sample(now - lastFrameAt, now - (entry?.readyAt ?? Infinity) > 3000)
      const dt = Math.min(0.05, Math.max(0, (now - lastFrameAt) / 1000))
      lastFrameAt = now
      showCharacter(entry !== null && entry.ready && entry.contents !== null)

      if (!entry || !entry.contents || !entry.scene) {
        sound().setWalking(false)
        return
      }

      if (!entry.ready) {
        const waited = now - entry.startedAt
        if (
          (entry.room.gatesItself || (fontsReady && (rigSettled || waited >= MAX_RIG_WAIT_MS))) &&
          waited >= (entry.warm ? 0 : entry.room.minLoadingMs ?? 0) &&
          (!entry.contents.isReady || entry.contents.isReady(now))
        ) {
          entry.ready = true
          entry.readyAt = now
          const viaDoor = doorStartedAt !== null
          perf.opened(entry.room.id, now - (doorStartedAt ?? entry.startedAt), entry.warm, viaDoor)
          doorStartedAt = null
          entry.handlers.onReady()
          revealFloorTransition()
          const placed = entry.contents.onShown?.()
          const presence = joinRoom({
            room: entry.contents.presence.key,
            key: entry.contents.presence.ticketKey,
            host: hosts.character,
            character,
            traversal,
            pose: entry.contents.presence.pose,
            scenery: entry.contents.presence.scenery,
          })
          entry.presence = presence
          entry.contents.onJoined?.(presence)
          if (entry.arrival.kind === 'door' && placed !== true) {
            const door = entry.room.doors[entry.arrival.door]
            if (door) passage.arrive(door)
          }
        }
      } else {
        traversal.setSuspended(
          passage.locked ||
            entry.handlers.isSuspended() ||
            document.querySelector('[aria-modal="true"]') !== null,
        )
        traversal.update(dt, entry.contents.floor.minX, entry.contents.floor.maxX())
        prefetchNearDoors(entry, now)
      }

      passage.update(dt)
      rig.sync(traversal.cameraX, entry.contents.cameraRise?.() ?? 0)
      syncJoined(entry, traversal.cameraX, rig.viewWidth)
      const frame: Frame = { now, dt, camera: rig.camera, viewport, quiet: isQuiet(entry) }
      for (const part of partsOf(entry)) part.beforeCharacterUpdate?.(frame)
      if (traversal.takeJump()) {
        sound().prepare('jump')
        sound().play('jump')
      }
      character.update(
        dt,
        traversal.x,
        traversal.walkVelocity,
        rig.camera,
        viewport,
        CONFIG.character.centerY + traversal.height,
        traversal.jumpPose,
      )
      entry.presence?.update(dt, rig.camera, viewport)
      for (const part of partsOf(entry)) part.update(frame)
      sound().setWalking(!traversal.isAirborne && Math.abs(traversal.walkVelocity) > WALKING_SPEED)
      entry.frameCount += 1
      const idle = entry.handlers.isSuspended() || traversal.idleSeconds > QUIET_AFTER_SECONDS
      if (idle && entry.frameCount % 2 === 1) return
      renderer.render(entry.scene, rig.camera)
      perf.rendered(renderer.info)
    }
    frameHandle = requestAnimationFrame(renderFrame)

    return {
      renderer,
      pixelRatio,
      rig,
      traversal,
      character,
      passage,
      viewport,
      dispose() {
        cancelAnimationFrame(frameHandle)
        hosts.character.style.visibility = ''
        sound().setWalking(false)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
        renderer.domElement.removeEventListener('pointerup', handlePointerUp)
        renderer.domElement.removeEventListener('pointermove', handlePointerMove)
        renderer.domElement.removeEventListener('click', handleClick)
        traversal.detach()
        character.dispose()
        passage.dispose()
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      },
    }
  }

  return {
    enter,
    dispose() {
      isDisposed = true
      const entry = current
      current = null
      if (entry) closeEntry(entry)
      artCache.clear()
      perf.dispose()
      runtime?.dispose()
      runtime = null
    },
  }
}
