const PIXEL_RATIO_STEPS = [3, 2.5, 2, 1.5, 1.25, 1]
const WINDOW_FRAMES = 60
const SLOW_RATIO = 1.3
const MIN_SLOW_FRAME_MS = 22
const IGNORE_FRAME_MS = 100
/** Longer than this is a pause (a hidden tab, a stall, a resume), never a slow frame. */
const PAUSE_MS = 400
/** Frames this slow are well past a 30fps cap, so most of a short run of them is overload by any measure. */
const OVERLOAD_MS = 50
const OVERLOAD_FRAMES = 12
const OVERLOAD_SHARE = 0.75
/** The frame time an overloaded device is stepped down towards. */
const TARGET_MS = 33.4
/** Frames passed over after a pause or reset, while the page catches up. */
const SETTLE_FRAMES = 3

interface Renderer {
  setPixelRatio(ratio: number): void
}

/** The world ratios to try, from the device's own (at most 3) down to 1. */
export function pixelRatioSteps(devicePixelRatio: number): number[] {
  const top = Math.min(PIXEL_RATIO_STEPS[0], devicePixelRatio > 0 ? devicePixelRatio : 1)
  return [top, ...PIXEL_RATIO_STEPS.filter((ratio) => ratio < top)]
}

/**
 * Lowers the world canvas's resolution when frames run slow. Two rules: a frame mean well above the
 * fastest interval the display has delivered (so a 30fps cap, as in iOS Low Power Mode, is not
 * mistaken for overload), and a run of frames far past any display cap, which jumps straight to the
 * ratio expected to fit the budget, since drawing cost goes with the square of the ratio.
 */
export function createPixelRatioGovernor(renderer: Renderer, devicePixelRatio: number) {
  const steps = pixelRatioSteps(devicePixelRatio)
  let step = 0
  renderer.setPixelRatio(steps[0])

  let displayFrameMs = Infinity
  let window: number[] = []
  let overload: number[] = []
  let passOver = 0

  function stepTo(next: number): void {
    step = Math.min(steps.length - 1, next)
    renderer.setPixelRatio(steps[step])
    reset()
  }

  function reset(): void {
    window = []
    overload = []
    passOver = SETTLE_FRAMES
  }

  return {
    get ratio(): number {
      return steps[step]
    },
    /** Forget the frames so far: after a resize, a hidden tab or a deliberate pause. */
    reset,
    sample(frameMs: number, isSettled: boolean): void {
      if (frameMs <= 0) return
      if (frameMs > PAUSE_MS || !isSettled) {
        reset()
        return
      }
      if (passOver > 0) {
        passOver -= 1
        return
      }
      if (step === steps.length - 1) return

      overload.push(frameMs)
      if (overload.length >= OVERLOAD_FRAMES) {
        const slow = overload.filter((ms) => ms > OVERLOAD_MS)
        const typical = [...overload].sort((a, b) => a - b)[Math.floor(overload.length / 2)]
        overload = []
        if (slow.length >= OVERLOAD_FRAMES * OVERLOAD_SHARE) {
          const fits = steps[step] * Math.sqrt(TARGET_MS / typical)
          const next = steps.findIndex((ratio, index) => index > step && ratio <= fits)
          stepTo(next === -1 ? steps.length - 1 : Math.max(step + 1, next))
          return
        }
      }

      if (frameMs > IGNORE_FRAME_MS) return
      window.push(frameMs)
      if (window.length < WINDOW_FRAMES) return
      const sorted = [...window].sort((a, b) => a - b)
      displayFrameMs = Math.min(displayFrameMs, sorted[Math.floor(sorted.length * 0.1)])
      const mean = window.reduce((sum, ms) => sum + ms, 0) / window.length
      window = []
      if (mean > Math.max(displayFrameMs * SLOW_RATIO, MIN_SLOW_FRAME_MS)) stepTo(step + 1)
    },
  }
}
