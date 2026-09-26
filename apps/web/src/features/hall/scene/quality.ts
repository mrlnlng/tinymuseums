import type * as THREE from 'three'

const PIXEL_RATIO_STEPS = [2, 1.5, 1.25, 1]
const WINDOW_FRAMES = 60
const SLOW_FRAME_MS = 22
const IGNORE_FRAME_MS = 100

// Only ever steps down: stepping back up on a phone that has just cooled makes the
// ratio flip-flop, and the drop from 2x is rarely noticeable on a small screen.
export function createPixelRatioGovernor(renderer: THREE.WebGLRenderer, devicePixelRatio: number) {
  let step = PIXEL_RATIO_STEPS.findIndex((ratio) => ratio <= devicePixelRatio)
  if (step === -1) step = PIXEL_RATIO_STEPS.length - 1
  renderer.setPixelRatio(PIXEL_RATIO_STEPS[step])

  let frames = 0
  let total = 0

  return {
    sample(frameMs: number): void {
      if (frameMs > IGNORE_FRAME_MS || step === PIXEL_RATIO_STEPS.length - 1) return
      frames += 1
      total += frameMs
      if (frames < WINDOW_FRAMES) return
      if (total / frames > SLOW_FRAME_MS) {
        step += 1
        renderer.setPixelRatio(PIXEL_RATIO_STEPS[step])
      }
      frames = 0
      total = 0
    },
  }
}
