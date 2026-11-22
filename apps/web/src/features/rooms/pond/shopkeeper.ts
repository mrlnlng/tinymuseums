import { loadRig, type Rig, type RigPiece } from '@/features/hall/scene/rig'
import { createRigState, stepRigState } from '@/features/hall/scene/rig-motion'
import manifest from '@/generated/asset-manifest.json'
import { assetUrl, builtUrl } from '@/shared/lib/assets'

export const SHOPKEEPER_NAME = 'Marlow'

/** Painted for the otter rig's rest pose, so the hat follows the head and the apron the chest. */
const OUTFIT: readonly RigPiece[] = [
  { bone: 'chest', image: assetUrl('pond/shopkeeper-apron'), x: 630, y: 1249, width: 623, height: 655, drawOrder: 3.1 },
  { bone: 'arm_R', image: assetUrl('pond/rod-upright', { density: 3 }), x: 1300, y: 290, width: 283, height: 1340, drawOrder: 3.9 },
  { bone: 'head', image: assetUrl('pond/fishing-hat', { density: 3 }), x: 218, y: 250, width: 1133, height: 743, drawOrder: 12, hides: ['otter_star'] },
]

// Marlow's silver coat is baked into the otter's textures by tooling/bake-shopkeeper.mjs, and
// only used with the model it was baked from: a re-exported otter needs a fresh bake.
const COAT = manifest.shopkeeper.model === manifest.models.otterRig.src
  ? Object.fromEntries(Object.entries(manifest.shopkeeper.maps).map(([name, file]) => [name, builtUrl(file)]))
  : null

const GREETINGS = [
  'Evening! Worms are on the house.',
  'The puffers have been biting on berries.',
  'Cupcakes for the blobfish, if you can believe it.',
  'Lovely night for a cast.',
]

/** The bait shop's otter: the visitor's otter model, dressed and named so it reads as the shopkeeper. */
export function createShopkeeper(host: HTMLElement) {
  const figure = document.createElement('span')
  figure.className = 'pond-shopkeeper'
  figure.setAttribute('aria-hidden', 'true')
  const canvas = document.createElement('canvas')
  const bubble = document.createElement('span')
  bubble.className = 'pond-shopkeeper-bubble'
  const name = document.createElement('strong')
  name.textContent = SHOPKEEPER_NAME
  const line = document.createElement('span')
  bubble.append(name, line)
  figure.append(canvas, bubble)
  host.append(figure)

  const motion = createRigState('left')
  let rig: Rig | null = null
  let disposed = false
  let drawnWidth = 0
  let wasNear = false
  let greeting = 0
  let facing: 'left' | 'right' = 'left'
  let bubbleShift = 0
  // Marlow's own idle, layered over the shared rig motion so the shopkeeper never moves like a visitor.
  let clock = Math.random() * 10
  let waveAt = -1
  let nextJig = 2 + Math.random() * 3
  let jigAt = -1
  let lean = 0
  const bend = { head: 0, armBack: 0, armFront: 0, tail: 0 }
  motion.bend = bend

  void loadRig(canvas, 'otter').then(async (loaded) => {
    if (disposed) { loaded.dispose(); return }
    loaded.setCostume(null)
    if (COAT) await loaded.paintWith(COAT)
    else console.warn('[pond] the shopkeeper coat was baked from an older otter; rerun tooling/bake-shopkeeper.mjs')
    if (disposed) { loaded.dispose(); return }
    await loaded.wear(OUTFIT)
    if (disposed) { loaded.dispose(); return }
    rig = loaded
    figure.dataset.ready = 'true'
  }).catch((error: unknown) => console.warn('Could not load the otter shopkeeper', error))

  /** A slow look about, a lazy tail, the rod jigged now and then, and a wave for each visitor. */
  function animate(dt: number, near: boolean): void {
    clock += dt
    lean += ((near ? -9 : 0) - lean) * (1 - Math.exp(-dt * 4))
    bend.head = lean + (near ? 3 : 8) * Math.sin(clock * 0.7)
    bend.tail = 7 * Math.sin(clock * 1.15)

    if (clock >= nextJig) {
      jigAt = clock
      nextJig = clock + 3.5 + Math.random() * 4
    }
    const jig = clock - jigAt
    bend.armFront = jigAt >= 0 && jig < 0.7 ? 7 * Math.sin(jig * Math.PI * 4.3) * (1 - jig / 0.7) : 1.5 * Math.sin(clock * 0.9)

    const wave = clock - waveAt
    if (waveAt >= 0 && wave < 1.8) {
      const envelope = Math.sin(Math.PI * Math.min(1, wave / 1.8))
      bend.armBack = envelope * (26 + 24 * Math.sin(wave * Math.PI * 2 * 1.7))
      // A small happy bob on the first beat of the wave.
      motion.squash = wave < 0.35 ? -0.035 * Math.sin((Math.PI * wave) / 0.35) : 0
    } else {
      bend.armBack = 2 * Math.sin(clock * 0.8 + 1)
      motion.squash = 0
    }
  }

  return {
    /** `visitor` is the visitor's offset from the otter in world units, or null when off stage. */
    update(width: number, dt: number, visible: boolean, reducedMotion: boolean, visitor: number | null) {
      const near = visitor !== null && Math.abs(visitor) < 1.5
      if (near && !wasNear) {
        line.textContent = GREETINGS[greeting % GREETINGS.length]
        greeting += 1
        waveAt = clock
      }
      wasNear = near
      bubble.classList.toggle('is-shown', near)
      if (near) {
        // Slide the bubble inside a narrow screen; its tail keeps pointing at Marlow.
        const box = bubble.getBoundingClientRect()
        const left = box.left - bubbleShift
        const right = box.right - bubbleShift
        const next = Math.max(10 - left, Math.min(0, window.innerWidth - 10 - right))
        if (Math.abs(next - bubbleShift) > 0.5) {
          bubbleShift = next
          bubble.style.setProperty('--shift', `${next.toFixed(1)}px`)
        }
      }
      if (visitor !== null && Math.abs(visitor) > 0.2) facing = visitor < 0 ? 'left' : 'right'

      if (!rig || !visible) return
      const turning = motion.turn !== (facing === 'right' ? 1 : -1)
      if (reducedMotion && drawnWidth === width && !turning) return
      stepRigState(motion, reducedMotion ? 1 : dt, false, facing, 0, rig.cycleSeconds)
      if (reducedMotion) {
        bend.head = bend.armBack = bend.armFront = bend.tail = 0
      } else {
        animate(dt, near)
      }
      const height = width * 0.5 / rig.aspect
      rig.render(motion, reducedMotion ? 0 : dt, height, window.devicePixelRatio)
      drawnWidth = width
    },
    dispose() {
      disposed = true
      rig?.dispose()
      figure.remove()
    },
  }
}
