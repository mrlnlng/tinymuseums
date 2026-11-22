/** How far up, how fast and how near the character a press must go to count as a flick. */
export const FLICK = { minUpPx: 30, maxMs: 350, steepness: 1.5, reach: 1.6, sidewaysPx: 12 }

/**
 * An upward flick: the touch way to jump, since tapping a walking character is a moving target.
 * Mostly vertical, so a sideways swipe across the scene still only scrolls.
 */
export function isUpwardFlick(dx: number, dy: number, ms: number): boolean {
  const up = -dy
  return up >= FLICK.minUpPx && up > Math.abs(dx) * FLICK.steepness && ms <= FLICK.maxMs
}

/** Which way a flick hops: up-and-right walks right, up-and-left walks left, straight up stays put. */
export function flickDirection(dx: number): -1 | 0 | 1 {
  return Math.abs(dx) < FLICK.sidewaysPx ? 0 : dx > 0 ? 1 : -1
}
