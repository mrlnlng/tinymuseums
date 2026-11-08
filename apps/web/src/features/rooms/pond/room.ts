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
import { FOREST_GATE, POND_LANDMARKS } from './landmarks'
import { createShopkeeper } from './shopkeeper'
import { EDGE_BAND, EDGE_BANDS, EDGE_OVERLAP, type PondArt } from './art'
import type { RoomDef } from '../types'

/**
 * The moonlit pond is one painting, drawn 8 world units tall so a visitor (1.36 units) stands
 * at about a sixth of the bank. The pond-free edges continue into a crisp, walkable forest.
 */
const IMAGE_WIDTH = 2388
const IMAGE_HEIGHT = 1668
const SCENE_HEIGHT = 8
export const SCENE_WIDTH = SCENE_HEIGHT * (IMAGE_WIDTH / IMAGE_HEIGHT)

/** The visitor's feet line, the same as the other strips. */
const GROUND_Y = CONFIG.character.centerY - CONFIG.character.height / 2
/** The visitor stands on the near bank at 0.895 of the picture, just in front of the water (0.875). */
const FEET_FRACTION_FROM_TOP = 0.895
const IMAGE_BOTTOM_Y = GROUND_Y - (1 - FEET_FRACTION_FROM_TOP) * SCENE_HEIGHT
const IMAGE_CENTER_Y = IMAGE_BOTTOM_Y + SCENE_HEIGHT / 2
const yAt = (fractionFromTop: number) => IMAGE_BOTTOM_Y + (1 - fractionFromTop) * SCENE_HEIGHT

const EDGE_WIDTH = SCENE_WIDTH * EDGE_BAND * (EDGE_BANDS + EDGE_OVERLAP)
const EDGE_REACH = SCENE_WIDTH * EDGE_BAND * EDGE_OVERLAP

const MIN_X = -6.5
const MAX_X = SCENE_WIDTH + 2.6
/** The path back to the museum leaves from the left end of the bank. */
const EXIT_X = FOREST_GATE.x
const ARRIVE_X = FOREST_GATE.arrivalX
const EXIT_REACH = FOREST_GATE.reach
const SPOT_REACH = 0.65

export const POND_SPOTS = [0.3, 0.5, 0.68].map((fraction) => ({
  x: fraction * SCENE_WIDTH,
  /** Offset into the water so the visitor never covers their own fishing ripple. */
  waterX: fraction * SCENE_WIDTH + 0.75,
  waterY: yAt(0.715),
}))

export type PondPanelKind = 'leaderboard' | 'bounties' | 'fishmonger' | 'fishdex'

export interface PondCallbacks {
  /** A free spot was claimed and the visitor is standing on it; open the fishing view. */
  onFish(spot: number): void
  /** A pondside object asked for a panel. */
  onPanel(kind: PondPanelKind): void
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
    const night = context.createLinearGradient(0, 0, canvas.width, 0)
    const forestEnd = SCENE_WIDTH * EDGE_BAND * EDGE_BANDS
    night.addColorStop(0, 'rgba(13, 20, 46, 1)')
    night.addColorStop(at(-forestEnd), 'rgba(13, 20, 46, 1)')
    night.addColorStop(at(-forestEnd * 0.6), 'rgba(13, 20, 46, 0)')
    night.addColorStop(at(SCENE_WIDTH + forestEnd * 0.6), 'rgba(13, 20, 46, 0)')
    night.addColorStop(at(SCENE_WIDTH + forestEnd), 'rgba(13, 20, 46, 1)')
    night.addColorStop(1, 'rgba(13, 20, 46, 1)')
    context.fillStyle = night
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
    clearColor: '#0d142e',
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
        material: new THREE.MeshBasicMaterial({ color: '#0d142e' }),
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
      const landmarkMaterials = new Map<string, THREE.MeshBasicMaterial>()
      for (const landmark of POND_LANDMARKS) {
        const height = landmark.width / landmark.aspect
        const material = new THREE.MeshBasicMaterial({
          map: art.landmarks[landmark.kind], transparent: true, depthWrite: false, alphaTest: 0.01,
        })
        landmarkMaterials.set(landmark.kind, material)
        add({
          width: landmark.width,
          height,
          material,
          x: landmark.x,
          y: GROUND_Y + landmark.baseY + height / 2,
          z: -0.2,
        })
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
          if (landmark.kind === 'exit') ctx.leave('hall')
          else callbacks.onPanel(landmark.kind)
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
      let nudgeTo: number | null = null
      let current: Target | null = null
      const bankPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
      const pointer = new THREE.Vector3()

      function spotFree(index: number): boolean {
        return !(presence?.taken(itemFor(index)) ?? false)
      }

      function releaseSpot(): void {
        if (activeSpot !== null) presence?.want(itemFor(activeSpot), false)
        activeSpot = null
        pendingSpot = null
        ctx.traversal.hold(null)
      }

      function goTo(target: Target): void {
        if (ctx.isQuiet() || activeSpot !== null || pendingSpot !== null) return
        if (target.kind === 'exit') {
          ctx.leave('hall')
          return
        }
        if (!spotFree(target.index)) return
        pendingSpot = target.index
        ctx.traversal.hold(POND_SPOTS[target.index].x, true)
      }

      function nearest(): Target | null {
        const x = ctx.traversal.x
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

      /** Anything the visitor stands in front of, or at its approach point. */
      function nearbyLandmark() {
        const x = ctx.traversal.x
        return landmarks.find(({ landmark }) => Math.abs(x - landmark.standX) < 0.75
          || Math.abs(x - landmark.x) < landmark.width / 2 + 0.15
          || (landmark.kind === 'fishmonger' && Math.abs(x - (landmark.x - landmark.width * 0.5)) < 0.7))
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

      control.release = releaseSpot

      return {
        floor: { kind: 'strip', minX: MIN_X, maxX: () => MAX_X },

        presence: { key: 'pond' },

        beforeCharacterUpdate(frame) {
          const stop = POND_LANDMARKS.find((landmark) => landmark.frameX !== undefined
            && Math.abs(ctx.traversal.x - landmark.standX) < 0.3
            && Math.abs(ctx.traversal.walkVelocity) < 0.4)
          const wide = frame.camera.right - frame.camera.left > 7.5
          let target = wide ? 1.35 : stop?.frameX ?? 0
          // On a narrow screen the camera follows the visitor past the stall; ease it back so
          // Marlow, who stands to the stall's left, stays in the picture.
          const shop = POND_LANDMARKS.find((landmark) => landmark.kind === 'fishmonger')!
          const halfView = (frame.camera.right - frame.camera.left) / 2
          if (!wide && Math.abs(ctx.traversal.x - shop.x) < shop.width / 2 + 0.8) {
            const center = frame.camera.position.x
            const otterLeft = shop.x - shop.width * 0.75
            const keepOtter = otterLeft - 0.1 - (center - halfView)
            const keepVisitor = ctx.traversal.x + 0.55 - (center + halfView)
            target = Math.max(keepVisitor, Math.min(0, keepOtter))
          }
          framingX = reducedMotion ? target : framingX + (target - framingX) * (1 - Math.exp(-frame.dt * 8))
          frame.camera.position.x += framingX
          frame.camera.updateMatrixWorld()
        },

        onShown() {
          if (ctx.arrival.kind === 'opening') {
            ctx.traversal.reset(ARRIVE_X)
            return true
          }
        },

        onJoined(room) {
          presence = room
          if (activeSpot !== null) room.want(itemFor(activeSpot), true)
        },

        hitTest(raycaster) {
          // Let the stage distinguish a tap from a pan, including gestures starting on props.
          // DOM counterparts remain native buttons for keyboard and assistive technology.
          const at = raycaster.ray.intersectPlane(bankPlane, pointer)
          const object = at ? landmarks.find(({ landmark }) => {
            const bottom = GROUND_Y + landmark.baseY
            const inProp = Math.abs(at.x - landmark.x) <= landmark.width / 2
              && at.y >= bottom && at.y <= bottom + landmark.width / landmark.aspect
            const inOtter = landmark.kind === 'fishmonger'
              && at.x >= landmark.x - landmark.width * 0.75
              && at.x <= landmark.x - landmark.width * 0.25
              && at.y >= GROUND_Y && at.y <= GROUND_Y + 1.5
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
          return null
        },

        update(frame) {
          // Step onto the spot before opening the fishing view, so the visitor is visibly there.
          if (pendingSpot !== null) {
            const index = pendingSpot
            if (Math.abs(ctx.traversal.x - POND_SPOTS[index].x) < 0.05) {
              pendingSpot = null
              if (!spotFree(index)) {
                ctx.traversal.hold(null)
              } else {
                presence?.want(itemFor(index), true)
                activeSpot = index
                callbacks.onFish(index)
              }
            }
          }

          const settled = Math.abs(ctx.traversal.walkVelocity) < 0.4
          const ready = !frame.quiet && activeSpot === null && pendingSpot === null
          current = ready && settled ? nearest() : null

          // Nobody gets to stand inside Marlow: a visitor who stops on him steps to whichever side is nearer.
          const stall = POND_LANDMARKS.find((landmark) => landmark.kind === 'fishmonger')!
          const otterX = stall.x - stall.width / 2
          if (nudgeTo !== null && (ctx.traversal.isSteered || frame.quiet || pendingSpot !== null)) {
            if (!frame.quiet && pendingSpot === null) ctx.traversal.hold(null)
            nudgeTo = null
          } else if (nudgeTo !== null && Math.abs(ctx.traversal.x - nudgeTo) < 0.02) {
            ctx.traversal.hold(null)
            nudgeTo = null
          } else if (nudgeTo === null && ready && settled && !ctx.traversal.isSteered && Math.abs(ctx.traversal.x - otterX) < 0.5) {
            nudgeTo = ctx.traversal.x >= otterX ? otterX + 0.75 : otterX - 0.75
            ctx.traversal.hold(nudgeTo, true)
          }
          // Whatever the visitor walks up to warms in the lamplight; there is no UI to read.
          const near = ready ? nearbyLandmark()?.landmark : undefined
          glow = reducedMotion ? 1 : (glow + frame.dt * 2.2) % (Math.PI * 2)
          const warmth = reducedMotion ? 0.6 : 0.45 + 0.35 * Math.sin(glow)

          const perUnit = frame.viewport.width / (frame.camera.right - frame.camera.left)
          landmarks.forEach(({ button, landmark }) => {
            const material = landmarkMaterials.get(landmark.kind)
            if (!frame.quiet && (button.classList.contains('is-hovered') || button.matches(':focus-visible'))) material?.color.set('#ffe4ba')
            else if (landmark === near) material?.color.copy(white).lerp(lamplight, warmth)
            else material?.color.set('#ffffff')
            projected.set(landmark.x, GROUND_Y + landmark.baseY, 0.03).project(frame.camera)
            const width = landmark.width * perUnit
            if (landmark.kind === 'fishmonger') {
              const onStage = projected.x > -1.6 && projected.x < 1.6
              const visitor = onStage && !frame.quiet ? ctx.traversal.x - (landmark.x - landmark.width / 2) : null
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
