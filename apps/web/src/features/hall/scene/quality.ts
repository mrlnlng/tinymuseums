const PIXEL_RATIO_STEPS = [3, 2.5, 2, 1.5, 1.25, 1]
const WINDOW_FRAMES = 60
const SLOW_RATIO = 1.3
const MIN_SLOW_FRAME_MS = 22
const IGNORE_FRAME_MS = 100

interface PixelRatioTarget {
  setPixelRatio(ratio: number): void
}

// Judged against the fastest interval the display has delivered, so a 30fps cap
// (iOS Low Power Mode) is not mistaken for an overloaded GPU.
export function createPixelRatioGovernor(renderer: PixelRatioTarget, devicePixelRatio: number) {
  let step = PIXEL_RATIO_STEPS.findIndex((ratio) => ratio <= devicePixelRatio)
  if (step === -1) step = PIXEL_RATIO_STEPS.length - 1
  renderer.setPixelRatio(Math.min(devicePixelRatio, PIXEL_RATIO_STEPS[step]))

  let displayFrameMs = Infinity
  let window: number[] = []

  return {
    sample(frameMs: number, isSettled: boolean): void {
      if (frameMs <= 0 || frameMs > IGNORE_FRAME_MS) return
      window.push(frameMs)
      if (window.length < WINDOW_FRAMES) return

      const sorted = [...window].sort((a, b) => a - b)
      displayFrameMs = Math.min(displayFrameMs, sorted[Math.floor(sorted.length * 0.1)])
      const mean = window.reduce((sum, ms) => sum + ms, 0) / window.length
      window = []

      if (!isSettled || step === PIXEL_RATIO_STEPS.length - 1) return
      if (mean > Math.max(displayFrameMs * SLOW_RATIO, MIN_SLOW_FRAME_MS)) {
        step += 1
        renderer.setPixelRatio(PIXEL_RATIO_STEPS[step])
      }
    },
  }
}
