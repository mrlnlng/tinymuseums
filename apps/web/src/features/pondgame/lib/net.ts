import type { FishPoint } from './machine.ts'
import type { ShadowSize } from './tables.ts'

/**
 * The net's little game: small fish shadows drift past the bank and one tap
 * decides whether the scoop lands. Kept as pure numbers so the drawing and the
 * hit test can share exactly the same positions.
 */

/** Where the net dips, just off the bank in front of the angler, in world fractions. */
export const SCOOP_SPOT: FishPoint = { x: 0.302, y: 0.802 }

/** A shadow's centre must be inside this oval; the oval is wider than a shadow so the edge counts. */
export const SCOOP_REACH = { x: 0.04, y: 0.022 }

/** The server enforces the same gap between scoops, so the button waits with it. */
export const NET_COOLDOWN_MS = 2500
/** A beat between pressing Scoop and the reveal, so the dip reads as a dip. */
export const NET_DIP_MS = 260

export interface NetShadowSpec {
  id: number
  /** How far either side of the scoop spot the shadow swims, in world x. */
  span: number
  /** Seconds for one full there-and-back drift. */
  period: number
  phase: number
  /** Each fish keeps its own lane near the scoop spot. */
  yOffset: number
  size: Extract<ShadowSize, 'tiny' | 'small'>
}

export const NET_SHADOWS: readonly NetShadowSpec[] = [
  { id: 0, span: 0.085, period: 15, phase: 0.2, yOffset: -0.006, size: 'small' },
  { id: 1, span: 0.105, period: 18, phase: 2.1, yOffset: 0.006, size: 'tiny' },
  { id: 2, span: 0.07, period: 21, phase: 4.4, yOffset: 0.001, size: 'small' },
]

/** The shadow's position at `seconds` since the net came out. */
export function netShadowPoint(spec: NetShadowSpec, seconds: number): FishPoint {
  const spot = SCOOP_SPOT
  const sway = Math.sin((seconds / spec.period) * Math.PI * 2 + spec.phase)
  // A slower second wave keeps the lanes from looking like ruled lines.
  const bob = Math.sin((seconds / (spec.period * 0.6)) * Math.PI * 2 + spec.phase * 1.7)
  return {
    x: spot.x + sway * spec.span,
    y: spot.y + spec.yOffset + bob * 0.0025,
  }
}

/** True when a shadow's centre is over the marked scoop spot. */
export function netShadowHits(point: FishPoint): boolean {
  const spot = SCOOP_SPOT
  return Math.abs(point.x - spot.x) <= SCOOP_REACH.x && Math.abs(point.y - spot.y) <= SCOOP_REACH.y
}

/**
 * Which shadow, if any, is under the net at `seconds`. When two overlap the
 * nearest centre wins, so the reveal names the fish that looked caught.
 */
export function scoopHit(seconds: number): number | null {
  const spot = SCOOP_SPOT
  let best: number | null = null
  let bestDistance = Infinity
  for (const spec of NET_SHADOWS) {
    const point = netShadowPoint(spec, seconds)
    if (!netShadowHits(point)) continue
    const distance = ((point.x - spot.x) / SCOOP_REACH.x) ** 2 + ((point.y - spot.y) / SCOOP_REACH.y) ** 2
    if (distance < bestDistance) {
      bestDistance = distance
      best = spec.id
    }
  }
  return best
}
