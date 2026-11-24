/** While nothing moves, the whole stage ticks at about this interval instead of every display frame. */
export const RESTING_TICK_MS = 1000 / 30
/** The longest step movement takes at once, so collisions and jumps behave as they do at 60fps. */
export const MAX_STEP_SECONDS = 0.05
/** Longer than this between ticks is a pause (a hidden tab, a stall), and is not caught up. */
export const MAX_CATCH_UP_SECONDS = 0.25

/**
 * Whether this display frame runs the stage. Judged on time, not frame parity, so a 120Hz display
 * rests at 30Hz too and a display already at 30Hz or slower is never halved again.
 */
export function shouldTick(resting: boolean, sinceTickMs: number, frameMs: number): boolean {
  return !resting || sinceTickMs + frameMs / 2 >= RESTING_TICK_MS
}

/**
 * How to move the visitor across `elapsedSeconds`: in equal steps of at most MAX_STEP_SECONDS, so
 * slow frames cover the same ground as fast ones. A pause moves one step, as if no time had passed.
 */
export function movementSteps(elapsedSeconds: number): { count: number; dt: number } {
  if (!(elapsedSeconds > 0)) return { count: 1, dt: 0 }
  if (elapsedSeconds > MAX_CATCH_UP_SECONDS) return { count: 1, dt: MAX_STEP_SECONDS }
  const count = Math.ceil(elapsedSeconds / MAX_STEP_SECONDS - 1e-9)
  return { count, dt: elapsedSeconds / count }
}
