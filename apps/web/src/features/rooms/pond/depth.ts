/**
 * The pond's ground recedes from the bank (depth 0) to the treeline (depth 1). Depth is distance
 * over the ground, so a steady walk slows on screen as it nears the trees, as it would in a picture.
 */
export const FAR_LIFT = 1.75
export const FAR_SCALE = 0.6
const K = 1 / FAR_SCALE - 1

export function scaleAt(d: number): number {
  return 1 / (1 + K * d)
}

/** How far above the bank's feet line a point at depth d is drawn, in world units. */
export function liftAt(d: number): number {
  return (FAR_LIFT * (1 - scaleAt(d))) / (1 - FAR_SCALE)
}

export function depthAtLift(lift: number): number {
  const scale = 1 - (lift * (1 - FAR_SCALE)) / FAR_LIFT
  if (scale <= 0) return Infinity
  return (1 / scale - 1) / K
}

export interface PondPath {
  /** Where the path leaves the bank. */
  foot: number
  /** Where it meets the prop at the treeline: under the middle of its base. */
  end: number
  /** A sideways sway through the middle of the path, in world units. */
  sway: number
  /** Full width of the path at the bank. */
  width: number
}

export function pathX(path: PondPath, d: number): number {
  const t = Math.min(1, Math.max(0, d))
  const eased = t * t * (3 - 2 * t)
  return path.foot + (path.end - path.foot) * eased + path.sway * Math.sin(Math.PI * t)
}

export function pathHalfWidth(path: PondPath, d: number): number {
  return (path.width / 2) * scaleAt(Math.max(-0.4, d))
}
