import * as THREE from 'three'
import { outfit } from '@tiny/core/slots'
import { getWalletSnapshot, subscribeWallet } from '@/features/economy/store'
import { followOutfit, lookOf, ownedLook } from '@/features/hall/scene/wardrobe'
import { defaultStore } from '@/shared/lib/slots'
import type { Item } from '@tiny/core/presence/wire'
import { CONFIG } from '@/features/hall/scene/config'
import { placeLabel, writeStyle } from '@/features/hall/scene/overlay'
import type { Room } from '@/features/presence/lib/join-room'
import layout from '../../../../public/assets/pond/layout.json'
import { FOREST_GATE, POND_LANDMARKS, type PondLandmark } from './landmarks'
import { FAR_LIFT, depthAtLift, liftAt, pathX, scaleAt } from './depth'
import { MAX_DEPTH, Walker, depthOf, pondFloor, toFloor } from './walk'
import { pathSprite } from './paths'
import { createShopkeeper } from './shopkeeper'
import { EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, type PondArt } from './art'
import type { RoomDef } from '../types'

/**
 * The garden is one painting, drawn 8 world units tall so a visitor (1.36 units) stands
 * at about a sixth of the bank. The pond-free edges continue into a crisp, walkable forest.
 */
const IMAGE_WIDTH = layout.scene.width
const IMAGE_HEIGHT = layout.scene.height
const SCENE_HEIGHT = 8
export const SCENE_WIDTH = SCENE_HEIGHT * (IMAGE_WIDTH / IMAGE_HEIGHT)

/** The visitor's feet line, the same as the other strips. */
const GROUND_Y = CONFIG.character.centerY - CONFIG.character.height / 2
/** The visitor stands on the near bank at 0.895 of the picture, just in front of the water (0.875). */
const FEET_FRACTION_FROM_TOP = layout.scene.feet
const IMAGE_BOTTOM_Y = GROUND_Y - (1 - FEET_FRACTION_FROM_TOP) * SCENE_HEIGHT
const IMAGE_CENTER_Y = IMAGE_BOTTOM_Y + SCENE_HEIGHT / 2
const yAt = (fractionFromTop: number) => IMAGE_BOTTOM_Y + (1 - fractionFromTop) * SCENE_HEIGHT

const EDGE_WIDTH = SCENE_WIDTH * EDGE_BAND * (EDGE_BANDS + EDGE_OVERLAP)
const EDGE_REACH = SCENE_WIDTH * EDGE_BAND * EDGE_OVERLAP

const MIN_X = FOREST_GATE.x
// End the bank just beyond the journal's path, instead of continuing into empty woodland.
const MAX_X = 13
/** The path back to the museum leaves from the left end of the bank. */
const EXIT_X = FOREST_GATE.x
const ARRIVE_X = FOREST_GATE.arrivalX
const EXIT_REACH = FOREST_GATE.reach
const SPOT_REACH = 0.65
const PATH_REACH = 0.6
/** How deep the visitor stands to use a prop, just short of the treeline it stands on. */
const STAND_DEPTH = 0.86
/** Below this the visitor is on the bank, where the fishing spots and the gate are. */
const BANK_DEPTH = 0.1
const KEY_SPEED = 3
const FLOOR = pondFloor(SCENE_WIDTH, MIN_X, MAX_X, EXIT_X + 1.25)
const MOVE_KEYS: Record<string, [number, number]> = {
  arrowleft: [-1, 0], a: [-1, 0], arrowright: [1, 0], d: [1, 0],
  arrowup: [0, 1], w: [0, 1], arrowdown: [0, -1], s: [0, -1],
}

/** Where a landmark's sprite sits once its depth has shrunk and raised it. */
function placement(landmark: PondLandmark) {
  const scale = scaleAt(landmark.depth)
  const width = landmark.width * scale
  return { scale, width, height: width / landmark.aspect, bottom: GROUND_Y + liftAt(landmark.depth) + landmark.baseY * scale }
}

/** The sprite's extent across the screen in world units, with Marlow beside the bait counter. */
function extent(landmark: PondLandmark): { left: number; right: number } {
  const { width } = placement(landmark)
  return { left: landmark.x - width * (landmark.kind === 'fishmonger' ? 0.75 : 0.5), right: landmark.x + width / 2 }
}

const VIEW_LEFT = Math.min(...POND_LANDMARKS.map((landmark) => extent(landmark).left)) - 0.15
const VIEW_RIGHT = Math.max(...POND_LANDMARKS.map((landmark) => extent(landmark).right)) + 0.15

export const POND_SPOTS = [0.3, 0.5, 0.68].map((fraction) => ({
  x: fraction * SCENE_WIDTH,
  /** Offset into the water so the visitor never covers their own fishing ripple. */
  waterX: fraction * SCENE_WIDTH + 0.75,
  waterY: yAt(layout.rippleY),
}))

export type PondPanelKind = 'leaderboard' | 'bounties' | 'fishmonger' | 'fishdex'

export interface PondCallbacks {
  /** A free spot was claimed and the visitor is standing on it; open the fishing view. */
  onFish(spot: number): void
  /** A pondside object asked for a panel. */
  onPanel(kind: PondPanelKind): void
  /** A spot was taken while this visitor was disconnected. */
  onSpotLost?(): void
}

/** The React page calls this when the fishing view closes, so the room can let the spot go. */
export interface PondControl {
  release(): void
  setBountyReady(ready: boolean): void
}

const POND_ITEMS = ['pond-spot-1', 'pond-spot-2', 'pond-spot-3'] as const

/** The three claimable items, one per fishing spot. */
const itemFor = (index: number): Item => POND_ITEMS[index]

const RIPPLE_SVG = `<svg viewBox="0 0 120 44" aria-hidden="true">
  <path class="pond-room-ripple-arc is-a" d="M14 26 C 30 40, 90 40, 106 26" />
  <path class="pond-room-ripple-arc is-b" d="M30 20 C 44 30, 76 30, 90 20" />
  <path class="pond-room-ripple-arc is-c" d="M44 16 C 54 22, 66 22, 76 16" />
  <g class="pond-room-ripple-bobber">
    <path d="M60 -6 L60 4" stroke="#50291d" stroke-width="2.4" stroke-linecap="round" />
    <path d="M50 14 C 50 6, 70 6, 70 14 Z" fill="#fff8ea" />
    <path d="M50 14 C 50 24, 70 24, 70 14 Z" fill="#e0564f" />
    <ellipse cx="60" cy="14" rx="10" ry="9.5" fill="none" stroke="#50291d" stroke-width="2.6" />
    <path d="M50.5 14 L69.5 14" stroke="#50291d" stroke-width="1.8" />
  </g>
</svg>`


type Target = { kind: 'spot'; index: number } | { kind: 'exit' }


interface PlaneOptions {
  width: number
  height: number
  material: THREE.Material
  x: number
  y: number
  z: number
}

const projected = new THREE.Vector3()

function disposeGroup(group: THREE.Group, scene: THREE.Scene): void {
  scene.remove(group)
  group.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return
    object.geometry.dispose()
    const material = object.material as THREE.Material
    material.dispose()
  })
}

/**
 * The ground below the painting, for screens taller than its crop: grass under the painting,
 * darkening only at the distant boundary of the surrounding woodland.
 */
function groundFill(grass: string, reach: number): THREE.Texture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1
  const context = canvas.getContext('2d')
  if (context) {
    const total = SCENE_WIDTH + reach * 2
    const at = (x: number) => (x + reach) / total
    context.fillStyle = grass
    context.fillRect(0, 0, canvas.width, 1)
    const shade = context.createLinearGradient(0, 0, canvas.width, 0)
    const forestEnd = SCENE_WIDTH * EDGE_BAND * EDGE_BANDS
    shade.addColorStop(0, 'rgba(32, 69, 35, 1)')
    shade.addColorStop(at(-forestEnd), 'rgba(32, 69, 35, 1)')
    shade.addColorStop(at(-forestEnd * 0.6), 'rgba(32, 69, 35, 0)')
    shade.addColorStop(at(SCENE_WIDTH + forestEnd * 0.6), 'rgba(32, 69, 35, 0)')
    shade.addColorStop(at(SCENE_WIDTH + forestEnd), 'rgba(32, 69, 35, 1)')
    shade.addColorStop(1, 'rgba(32, 69, 35, 1)')
    context.fillStyle = shade
    context.fillRect(0, 0, canvas.width, 1)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable)
  )
}

export function createPondRoom({
  callbacks,
  control,
}: {
  callbacks: PondCallbacks
  control: PondControl
}): RoomDef<PondArt> {
  return {
    id: 'pond',
    className: 'pond',
    clearColor: '#38592c',
    minLoadingMs: 900,
    doors: {
      hall: { x: EXIT_X, clearX: ARRIVE_X, label: 'To the museum' },
    },

    // Visitors only ever wear characters and clothes they own, as in the hall.
    initialLook() {
      return ownedLook(lookOf(defaultStore().getSlot(outfit).snapshot()), getWalletSnapshot())
    },

    build(ctx, art) {
      const group = new THREE.Group()
      const add = ({ width, height, material, x, y, z }: PlaneOptions): THREE.Mesh => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), material)
        mesh.position.set(x, y, z)
        group.add(mesh)
        return mesh
      }

      const reach = SCENE_WIDTH * 3
      const ground = groundFill(art.grass, reach)
      add({
        width: SCENE_WIDTH + reach * 2,
        height: 40,
        material: new THREE.MeshBasicMaterial({ color: art.grass }),
        x: SCENE_WIDTH / 2,
        y: IMAGE_CENTER_Y,
        z: -0.98,
      })
      add({
        width: SCENE_WIDTH,
        height: 24,
        material: new THREE.MeshBasicMaterial({ color: art.sky }),
        x: SCENE_WIDTH / 2,
        y: IMAGE_BOTTOM_Y + SCENE_HEIGHT + 12,
        z: -0.95,
      })
      add({
        width: SCENE_WIDTH + reach * 2,
        height: 12,
        material: new THREE.MeshBasicMaterial({ map: ground }),
        x: SCENE_WIDTH / 2,
        y: IMAGE_BOTTOM_Y - 6,
        z: -0.95,
      })
      add({
        width: SCENE_WIDTH,
        height: SCENE_HEIGHT,
        material: new THREE.MeshBasicMaterial({ map: art.scene }),
        x: SCENE_WIDTH / 2,
        y: IMAGE_CENTER_Y,
        z: -0.6,
      })
      add({
        width: EDGE_WIDTH,
        height: SCENE_HEIGHT,
        material: new THREE.MeshBasicMaterial({ map: art.edges.left, transparent: true, depthWrite: false }),
        x: EDGE_REACH - EDGE_WIDTH / 2,
        y: IMAGE_CENTER_Y,
        z: -0.55,
      })
      add({
        width: EDGE_WIDTH,
        height: SCENE_HEIGHT,
        material: new THREE.MeshBasicMaterial({ map: art.edges.right, transparent: true, depthWrite: false }),
        x: SCENE_WIDTH - EDGE_REACH + EDGE_WIDTH / 2,
        y: IMAGE_CENTER_Y,
        z: -0.55,
      })
      add({
        width: layout.lily.w * SCENE_WIDTH,
        height: layout.lily.h * SCENE_HEIGHT,
        material: new THREE.MeshBasicMaterial({ map: art.lily, transparent: true, depthWrite: false }),
        x: (layout.lily.x + layout.lily.w / 2) * SCENE_WIDTH,
        y: yAt(layout.lily.y + layout.lily.h / 2),
        z: -0.35,
      })
      const pathTextures: THREE.Texture[] = []
      const sparkleMaterial = new THREE.MeshBasicMaterial({ map: art.sparkles, transparent: true, depthWrite: false, opacity: 0.75 })
      add({
        width: layout.sparkles.w * SCENE_WIDTH,
        height: layout.sparkles.h * SCENE_HEIGHT,
        material: sparkleMaterial,
        x: (layout.sparkles.x + layout.sparkles.w / 2) * SCENE_WIDTH,
        y: yAt(layout.sparkles.y + layout.sparkles.h / 2),
        z: -0.34,
      })
      for (const landmark of POND_LANDMARKS) {
        if (!landmark.path) continue
        const sprite = pathSprite(landmark.path, art.grass)
        pathTextures.push(sprite.texture)
        add({
          width: sprite.width,
          height: sprite.height,
          material: new THREE.MeshBasicMaterial({ map: sprite.texture, transparent: true, depthWrite: false }),
          x: sprite.x,
          y: GROUND_Y + sprite.lift,
          z: -0.3,
        })
      }
      const landmarkMaterials = new Map<string, THREE.MeshBasicMaterial>()
      for (const landmark of POND_LANDMARKS) {
        const { width, height, bottom } = placement(landmark)
        const material = new THREE.MeshBasicMaterial({
          map: art.landmarks[landmark.kind], transparent: true, depthWrite: false, alphaTest: 0.01,
        })
        landmarkMaterials.set(landmark.kind, material)
        add({ width, height, material, x: landmark.x, y: bottom + height / 2, z: -0.2 })
      }
      ctx.scene.add(group)

      const follower = followOutfit(
        ctx.character,
        defaultStore().getSlot(outfit),
        () => false,
        () => {},
        (look) => ownedLook(look, getWalletSnapshot()),
      )
      const stopWallet = subscribeWallet(follower.sync)

      let framingX = 0
      let glow = 0
      const white = new THREE.Color('#ffffff')
      const lamplight = new THREE.Color('#ffe2b0')
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const landmarks = POND_LANDMARKS.map((landmark) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = `pond-landmark is-${landmark.kind}`
        button.dataset.destination = landmark.kind
        if (landmark.kind !== 'exit') button.setAttribute('aria-haspopup', 'dialog')
        button.setAttribute('aria-label', `${landmark.title}: ${landmark.description}`)
        const hitArea = document.createElement('span')
        hitArea.className = 'pond-landmark-art'
        hitArea.style.aspectRatio = String(landmark.aspect)
        hitArea.setAttribute('aria-hidden', 'true')
        button.append(hitArea)
        button.addEventListener('click', () => {
          if (ctx.isQuiet() || activeSpot !== null || pendingSpot !== null) return
          if (landmark.kind === 'exit') leave()
          else approach(landmark)
        })
        ctx.overlay.append(button)
        return { button, landmark }
      })

      const shop = landmarks.find(({ landmark }) => landmark.kind === 'fishmonger')!
      const shopkeeper = createShopkeeper(shop.button)

      const setBountyReady = (ready: boolean) => {
        const board = landmarks.find(({ landmark }) => landmark.kind === 'bounties')?.button
        if (!board) return
        board.classList.toggle('has-reward', ready)
        board.setAttribute('aria-label', ready ? 'Noticeboard: a bounty reward is ready' : 'Noticeboard: bounties and pond records')
      }
      control.setBountyReady = setBountyReady

      const ripples = POND_SPOTS.map((spot, index) => {
        const button = document.createElement('button')
        button.type = 'button'
        button.className = 'pond-room-ripple'
        button.dataset.spot = String(index + 1)
        button.style.setProperty('--ripple-delay', `${-index * 0.85}s`)
        button.innerHTML = RIPPLE_SVG
        button.setAttribute('aria-label', `Fish at spot ${index + 1}`)
        button.addEventListener('click', () => goTo({ kind: 'spot', index }))
        return { button, spot, index }
      })

      ctx.overlay.append(...ripples.map(({ button }) => button))

      let presence: Room | null = null
      let activeSpot: number | null = null
      let pendingSpot: number | null = null
      let claimingSpot: number | null = null
      let current: Target | null = null
      const walker = new Walker(FLOOR, ctx.traversal.x)
      const held = new Map<string, [number, number]>()
      /** What happens at the end of the walk, and the prop being walked to. */
      let arrival: (() => void) | null = null
      let heading: PondLandmark | null = null
      let following = true
      let cameraWas = ctx.traversal.cameraX
      const mark = document.createElement('span')
      mark.className = 'pond-step-mark'
      mark.setAttribute('aria-hidden', 'true')
      ctx.overlay.append(mark)
      let markAt: { x: number; depth: number; age: number } | null = null
      const bankPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const pointer = new THREE.Vector3()

      function spotFree(index: number): boolean {
        return !(presence?.taken(itemFor(index)) ?? false)
      }

      function releaseSpot(): void {
        if (activeSpot !== null) presence?.want(itemFor(activeSpot), false)
        if (claimingSpot !== null) presence?.want(itemFor(claimingSpot), false)
        activeSpot = null
        claimingSpot = null
        pendingSpot = null
        ctx.traversal.hold(null)
      }

      function busy(): boolean {
        return ctx.isQuiet() || activeSpot !== null
      }

      /** Walk across the grass to a point, then do whatever arriving there means. */
      function walkTo(x: number, depth: number, then: (() => void) | null = null, to: PondLandmark | null = null, via = [] as ReturnType<typeof toFloor>[]): void {
        if (busy()) return
        if (claimingSpot !== null) {
          presence?.want(itemFor(claimingSpot), false)
          claimingSpot = null
          ctx.traversal.hold(null)
        }
        pendingSpot = null
        walker.walkTo(x, depth, via)
        arrival = then
        heading = to
        following = true
        if (!walker.walking) finishWalk()
      }

      function finishWalk(): void {
        const then = arrival
        arrival = null
        heading = null
        then?.()
      }

      function openPanel(landmark: PondLandmark): void {
        if (busy() || pendingSpot !== null) return
        callbacks.onPanel(landmark.kind as PondPanelKind)
      }

      /** Go to a prop to use it: up its path from the bank, or straight across the grass when already back there. */
      function approach(landmark: PondLandmark): void {
        const { path, standX } = landmark
        if (!path || standX === undefined) return
        const via = walker.depth < 0.35
          ? [0.04, 0.2, 0.4, 0.6, 0.76].map((d) => toFloor(pathX(path, d), d))
          : []
        walkTo(standX, STAND_DEPTH, () => openPanel(landmark), landmark, via)
      }

      function leave(): void {
        if (walker.depth > BANK_DEPTH || Math.abs(walker.x - EXIT_X) > 2.5) walkTo(ARRIVE_X, 0, () => ctx.leave('hall'))
        else if (!busy()) ctx.leave('hall')
      }

      /** Move the visitor for this frame: along a tapped route, with the keys, or after the camera's pull. */
      function move(dt: number, quiet: boolean): void {
        const traversal = ctx.traversal
        if (quiet || activeSpot !== null) {
          // Doors and the fishing view move the visitor along the bank themselves.
          if (Math.abs(traversal.x - walker.x) > 1e-3) walker.place(traversal.x)
          walker.stride = 0
          cameraWas = traversal.cameraX
          return
        }
        let across = 0
        let into = 0
        for (const [x, d] of held.values()) {
          across += x
          into += d
        }
        let moved: boolean
        if (across !== 0 || into !== 0) {
          arrival = null
          heading = null
          pendingSpot = null
          following = true
          moved = walker.steer(dt, Math.sign(across), Math.sign(into), KEY_SPEED * traversal.jumpSpeedMultiplier)
        } else if (walker.walking) {
          // A drag during a walk lets the view go where the visitor drags it.
          if (Math.abs(traversal.cameraX - cameraWas) > 0.02) following = false
          moved = walker.step(dt, CONFIG.move.maxSpeed * traversal.jumpSpeedMultiplier)
          if (!walker.walking) finishWalk()
        } else {
          following = false
          moved = walker.follow(traversal.x, dt)
        }
        traversal.x = walker.x
        if (following) {
          traversal.cameraX = walker.x
          traversal.velocity = 0
        }
        if (moved) traversal.idleSeconds = 0
        cameraWas = traversal.cameraX
      }

      function goTo(target: Target): void {
        if (busy() || pendingSpot !== null) return
        if (target.kind === 'exit') {
          leave()
          return
        }
        const index = target.index
        if (!spotFree(index)) return
        // Step onto the spot before opening the fishing view, so the visitor is visibly there.
        walkTo(POND_SPOTS[index].x, 0, () => {
          if (!spotFree(index) || busy()) { pendingSpot = null; return }
          presence?.want(itemFor(index), true)
          claimingSpot = index
          ctx.traversal.hold(POND_SPOTS[index].x, true)
        })
        pendingSpot = index
      }

      function nearest(): Target | null {
        if (walker.depth > BANK_DEPTH) return null
        const x = walker.x
        if (Math.abs(x - EXIT_X) < EXIT_REACH) return { kind: 'exit' }
        let best: Target | null = null
        let bestGap = SPOT_REACH
        POND_SPOTS.forEach((spot, index) => {
          const gap = Math.abs(spot.x - x)
          if (gap < bestGap && spotFree(index)) {
            best = { kind: 'spot', index }
            bestGap = gap
          }
        })
        return best
      }

      /** The prop the visitor stands beside, or at the foot of whose path they wait. */
      function nearbyLandmark() {
        const { x, depth } = walker
        return landmarks.find(({ landmark }) => {
          if (!landmark.path || landmark.standX === undefined) {
            return depth < BANK_DEPTH && Math.abs(x - landmark.x) < landmark.width / 2 + 0.15
          }
          const beside = depth > STAND_DEPTH - 0.2 && Math.abs(x - landmark.standX) < 0.75
          const atFoot = depth < BANK_DEPTH && Math.abs(x - landmark.path.foot) < PATH_REACH
          return beside || atFoot
        })
      }


      const keydown = (event: KeyboardEvent) => {
        if (event.repeat || isTyping(event.target) || document.querySelector('[aria-modal="true"]')) return
        const key = event.key.toLowerCase()
        if (key !== 'enter' && key !== 'e') return
        if (event.target instanceof Element && event.target.closest('button, a, [role="button"]')) return
        const nearby = nearbyLandmark()
        if (nearby && !ctx.isQuiet()) {
          event.preventDefault()
          nearby.button.focus({ preventScroll: true })
          nearby.button.click()
        } else if (current) {
          event.preventDefault()
          goTo(current)
        }
      }
      window.addEventListener('keydown', keydown)

      // The arrows and WASD walk the visitor about the grass, so the stage's own keys (and W's jump) give way.
      const moveKeys = (event: KeyboardEvent) => {
        const key = event.key.toLowerCase()
        const step = MOVE_KEYS[key]
        if (!step) return
        if (event.type === 'keyup') {
          held.delete(key)
          return
        }
        if (isTyping(event.target) || document.querySelector('[aria-modal="true"]') || busy()) return
        event.preventDefault()
        event.stopImmediatePropagation()
        held.set(key, step)
      }
      const letGo = () => held.clear()
      window.addEventListener('keydown', moveKeys, { capture: true })
      window.addEventListener('keyup', moveKeys, { capture: true })
      window.addEventListener('blur', letGo)

      control.release = releaseSpot

      return {
        floor: { kind: 'strip', minX: MIN_X, maxX: () => MAX_X },
        isCovered: () => activeSpot !== null,
        cameraBounds: {
          minX: VIEW_LEFT,
          maxX: () => VIEW_RIGHT,
        },

        // Others see the visitor at their depth, walking and facing as they do here.
        presence: {
          key: 'pond',
          pose: () => ({ sit: false, helm: false, cup: false, d: walker.depth, vx: walker.stride, facing: walker.facing }),
          scenery: () => ({ depth: { self: walker.depth, place: (d: number) => ({ lift: liftAt(d), scale: scaleAt(d) }) } }),
        },

        stance() {
          return { lift: liftAt(walker.depth), scale: scaleAt(walker.depth), walk: walker.stride }
        },

        beforeCharacterUpdate(frame) {
          sparkleMaterial.opacity = reducedMotion ? 0.75 : 0.7 + 0.2 * Math.sin(frame.now / 1700)
          move(frame.dt, frame.quiet)
          const viewWidth = frame.camera.right - frame.camera.left
          const wide = viewWidth > 7.5
          // Ease out the wide-screen offset near the entrance so the whole gate remains visible.
          let target = wide ? Math.min(1.35, Math.max(0, frame.camera.position.x - VIEW_LEFT - viewWidth / 2)) : 0
          // On a narrow screen, keep the prop the visitor is walking to, or standing at, in the picture with them.
          const focus = heading ?? (walker.depth > 0.5 ? nearbyLandmark()?.landmark : undefined)
          if (!wide && focus?.path) {
            const halfView = (frame.camera.right - frame.camera.left) / 2
            const center = frame.camera.position.x
            const { left, right } = extent(focus)
            const keepLeft = Math.min(left, walker.x - 0.4) - 0.1 - (center - halfView)
            const keepRight = Math.max(right, walker.x + 0.4) + 0.1 - (center + halfView)
            target = keepRight > 0 ? keepRight : Math.min(0, keepLeft)
          }
          framingX = reducedMotion ? target : framingX + (target - framingX) * (1 - Math.exp(-frame.dt * 8))
          frame.camera.position.x += framingX
          frame.camera.updateMatrixWorld()
        },

        onShown() {
          if (ctx.arrival.kind === 'opening') {
            ctx.traversal.reset(ARRIVE_X)
            walker.place(ARRIVE_X, 0)
            return true
          }
        },

        onJoined(room) {
          presence = room
          if (activeSpot !== null) room.want(itemFor(activeSpot), true)
        },

        hitTest(raycaster, phase) {
          // Let the stage distinguish a tap from a pan, including gestures starting on props.
          // DOM counterparts remain native buttons for keyboard and assistive technology.
          const at = raycaster.ray.intersectPlane(bankPlane, pointer)
          const object = at ? landmarks.find(({ landmark }) => {
            const { width, height, bottom } = placement(landmark)
            const inProp = Math.abs(at.x - landmark.x) <= width / 2
              && at.y >= bottom && at.y <= bottom + height
            const inOtter = landmark.kind === 'fishmonger'
              && at.x >= landmark.x - width * 0.75
              && at.x <= landmark.x - width * 0.25
              && at.y >= bottom && at.y <= bottom + width * 0.67
            return inProp || inOtter
          }) : undefined
          for (const { button } of landmarks) button.classList.toggle('is-hovered', button === object?.button)
          const ripple = at && !object ? ripples.find(({ spot, index }) => spotFree(index)
            && Math.abs(at.x - spot.waterX) < 0.575 && Math.abs(at.y - spot.waterY) < 0.25) : undefined
          for (const { button } of ripples) button.classList.toggle('is-hovered', button === ripple?.button)
          if (object) return { activate: () => {
            object.button.focus({ preventScroll: true })
            object.button.click()
          } }
          if (ripple) return { activate: () => ripple.button.click() }
          // A tap anywhere on the ground walks there; the water and treeline send the visitor to the nearest grass.
          if (phase !== 'tap' || !at || busy() || at.y > GROUND_Y + FAR_LIFT + 0.25) return null
          const depth = Math.min(MAX_DEPTH, Math.max(0, depthAtLift(at.y - GROUND_Y)))
          return {
            silent: true,
            activate: () => {
              walkTo(at.x, depth)
              const end = walker.route[walker.route.length - 1]
              if (end) markAt = { x: end.x, depth: depthOf(end), age: 0 }
            },
          }
        },

        update(frame) {
          if (activeSpot !== null && !spotFree(activeSpot)) {
            releaseSpot()
            callbacks.onSpotLost?.()
          }
          if (claimingSpot !== null) {
            const index = claimingSpot
            if (!spotFree(index)) {
              presence?.want(itemFor(index), false)
              claimingSpot = null
              pendingSpot = null
              ctx.traversal.hold(null)
            } else if (!presence || presence.owns(itemFor(index))) {
              claimingSpot = null
              pendingSpot = null
              activeSpot = index
              callbacks.onFish(index)
            }
          }
          const settled = Math.abs(walker.stride) < 0.4 && !walker.walking
          const ready = !frame.quiet && activeSpot === null && pendingSpot === null
          current = ready && settled ? nearest() : null

          // Whatever the visitor walks up to warms in the lamplight; there is no UI to read.
          const near = ready && settled ? nearbyLandmark()?.landmark : undefined
          glow = reducedMotion ? 1 : (glow + frame.dt * 2.2) % (Math.PI * 2)
          const warmth = reducedMotion ? 0.6 : 0.45 + 0.35 * Math.sin(glow)

          const perUnit = frame.viewport.width / (frame.camera.right - frame.camera.left)
          landmarks.forEach(({ button, landmark }) => {
            const material = landmarkMaterials.get(landmark.kind)
            if (!frame.quiet && (button.classList.contains('is-hovered') || button.matches(':focus-visible'))) material?.color.set('#ffe4ba')
            else if (landmark === near) material?.color.copy(white).lerp(lamplight, warmth)
            else material?.color.set('#ffffff')
            const placed = placement(landmark)
            projected.set(landmark.x, placed.bottom, 0.03).project(frame.camera)
            const width = placed.width * perUnit
            if (landmark.kind === 'fishmonger') {
              const onStage = projected.x > -1.6 && projected.x < 1.6
              // Marlow greets whoever comes up to his stall, but only where he can be seen saying it.
              const otterX = landmark.x - placed.width / 2
              const otterShown = Math.abs(projected.x - (placed.width / 2) * (2 / (frame.camera.right - frame.camera.left))) < 0.9
              const offset = walker.x - otterX
              const coming = otterShown && !frame.quiet && walker.depth > 0.45 && Math.abs(offset) < 1.9
              const visitor = coming ? Math.sign(offset) * Math.min(1, Math.abs(offset)) : null
              shopkeeper.update(width, frame.quiet ? 0 : frame.dt, onStage, reducedMotion, visitor)
            }
            const sx = frame.viewport.left + (projected.x * 0.5 + 0.5) * frame.viewport.width
            const sy = frame.viewport.top + (-projected.y * 0.5 + 0.5) * frame.viewport.height
            // Include the otter standing to the left of the counter in visibility and focus bounds.
            const left = sx - width * (landmark.kind === 'fishmonger' ? 0.75 : 0.5)
            const right = sx + width * 0.5
            const visible = right > frame.viewport.left && left < frame.viewport.left + frame.viewport.width
            const fullyVisible = left >= frame.viewport.left && right <= frame.viewport.left + frame.viewport.width
            writeStyle(button, 'width', `${width.toFixed(1)}px`)
            writeStyle(button, 'transform', `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -100%)`)
            button.style.visibility = visible ? 'visible' : 'hidden'
            button.setAttribute('aria-disabled', String(frame.quiet))
            button.tabIndex = fullyVisible && !frame.quiet ? 0 : -1
          })
          // A brief ring in the grass where a tap sent the visitor.
          if (markAt && (markAt.age += frame.dt) < 0.7 && walker.walking) {
            const scale = scaleAt(markAt.depth)
            projected.set(markAt.x, GROUND_Y + liftAt(markAt.depth), 0).project(frame.camera)
            const sx = frame.viewport.left + (projected.x * 0.5 + 0.5) * frame.viewport.width
            const sy = frame.viewport.top + (-projected.y * 0.5 + 0.5) * frame.viewport.height
            writeStyle(mark, 'width', `${(0.55 * scale * perUnit).toFixed(1)}px`)
            writeStyle(mark, 'transform', `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`)
            mark.style.setProperty('--age', (markAt.age / 0.7).toFixed(3))
            mark.hidden = false
          } else {
            markAt = null
            mark.hidden = true
          }
          for (const { button, spot, index } of ripples) {
            const free = activeSpot !== index && spotFree(index)
            button.classList.toggle('is-taken', !free)
            button.disabled = !free
            const visible = placeLabel(button, { x: spot.waterX, y: spot.waterY, width: 1.15 }, perUnit, frame.camera, frame.viewport, 0.1)
            button.tabIndex = visible && !frame.quiet ? 0 : -1
            button.classList.toggle('is-near', !near && current?.kind === 'spot' && current.index === index)
          }
        },


        dispose() {
          stopWallet()
          follower.dispose()
          window.removeEventListener('keydown', keydown)
          window.removeEventListener('keydown', moveKeys, { capture: true })
          window.removeEventListener('keyup', moveKeys, { capture: true })
          window.removeEventListener('blur', letGo)
          mark.remove()
          for (const texture of pathTextures) texture.dispose()
          if (control.release === releaseSpot) control.release = () => {}
          if (control.setBountyReady === setBountyReady) control.setBountyReady = () => {}
          if (activeSpot !== null) presence?.want(itemFor(activeSpot), false)
          activeSpot = null
          pendingSpot = null
          for (const { button } of ripples) button.remove()
          shopkeeper.dispose()
          for (const { button } of landmarks) button.remove()
          disposeGroup(group, ctx.scene)
          ground.dispose()
        },
      }
    },
  }
}
