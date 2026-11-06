import * as THREE from 'three'
import { outfit } from '@tiny/core/slots'
import { revealFloorTransition } from '@/features/hall/lib/floor-transition'
import { loadCharacterSprites, type CharacterSprites } from '@/features/hall/scene/assets'
import { CameraRig } from '@/features/hall/scene/cameras'
import { createCharacter, type Character } from '@/features/hall/scene/character'
import type { Viewport } from '@/features/hall/scene/overlay'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { createRoomPassage } from '@/features/hall/scene/room-passage'
import { Traversal } from '@/features/hall/scene/traversal'
import { lookOf } from '@/features/hall/scene/wardrobe'
import { joinRoom, type Room } from '@/features/presence/lib/join-room'
import { defaultStore } from '@/shared/lib/slots'
import { linkedDoor } from './links'
import type { Arrival, DoorRef, Frame, RoomContents, RoomContext, RoomDef, RoomSound } from './types'

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600
const WALKING_SPEED = 0.12
const MAX_RIG_WAIT_MS = 8000
const QUIET_AFTER_SECONDS = 2

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
  presence: Room | null
  art: unknown
  hasArt: boolean
  disposed: boolean
  frameCount: number
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
    entry.contents?.dispose()
    if (entry.hasArt) {
      entry.room.unload?.(entry.art)
      entry.hasArt = false
    }
    entry.presence?.dispose()
    entry.presence = null
    entry.contents = null
    entry.scene = null
    if (runtime) runtime.renderer.domElement.style.cursor = ''
  }

  async function open(entry: Entry): Promise<void> {
    const loading = entry.room.load(renderer).then(
      (art) => ({ ok: true as const, art }),
      (error: unknown) => ({ ok: false as const, error }),
    )
    let stage: Runtime
    try {
      stage = await initPromise
    } catch (error) {
      void loading.then((result) => { if (result.ok) entry.room.unload?.(result.art) })
      if (isCurrent(entry)) {
        entry.handlers.onError(String(error))
        revealFloorTransition()
        current = null
        closeEntry(entry)
      }
      return
    }
    if (!isCurrent(entry)) {
      void loading.then((result) => { if (result.ok) entry.room.unload?.(result.art) })
      return
    }

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
    if (!isCurrent(entry)) {
      entry.room.unload?.(art)
      return
    }
    entry.art = art
    entry.hasArt = true

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
      leave(door) {
        const at = entry.room.doors[door]
        if (!at) return
        stage.passage.leave(() => {
          const to = linkedDoor({ room: entry.room.id, door })
          if (to) entry.handlers.onExit(to)
        }, at)
      },
      isQuiet: () => isQuiet(entry),
    }

    try {
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
      presence: null,
      art: undefined,
      hasArt: false,
      disposed: false,
      frameCount: 0,
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
      traversal.setWorldPerPixel(rig.viewWidth / width)
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
      current?.contents?.pointerDown?.(raycaster)
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
      const contents = current?.contents
      if (!contents) return
      const interaction = contents.hitTest(raycaster, 'tap')
      if (!interaction) return
      if (!interaction.silent) sound().play('click')
      interaction.activate()
    }

    function handlePointerMove(event: PointerEvent): void {
      if (event.pointerType !== 'mouse' || event.buttons !== 0) return
      aim(event)
      const contents = current?.contents
      const live = !isQuiet() && contents !== null && contents !== undefined && contents.hitTest(raycaster) !== null
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

    function renderFrame(now: number): void {
      frameHandle = requestAnimationFrame(renderFrame)
      const entry = current
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
          waited >= (entry.room.minLoadingMs ?? 0) &&
          (!entry.contents.isReady || entry.contents.isReady(now))
        ) {
          entry.ready = true
          entry.readyAt = now
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
      }

      passage.update(dt)
      rig.sync(traversal.cameraX, entry.contents.cameraRise?.() ?? 0)
      const frame: Frame = { now, dt, camera: rig.camera, viewport, quiet: isQuiet(entry) }
      entry.contents.beforeCharacterUpdate?.(frame)
      character.update(dt, traversal.x, traversal.walkVelocity, rig.camera, viewport)
      entry.presence?.update(dt, rig.camera, viewport)
      entry.contents.update(frame)
      sound().setWalking(Math.abs(traversal.walkVelocity) > WALKING_SPEED)
      entry.frameCount += 1
      const idle = entry.handlers.isSuspended() || traversal.idleSeconds > QUIET_AFTER_SECONDS
      if (idle && entry.frameCount % 2 === 1) return
      renderer.render(entry.scene, rig.camera)
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
      runtime?.dispose()
      runtime = null
    },
  }
}
