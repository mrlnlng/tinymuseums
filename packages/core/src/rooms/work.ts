import type { Placement } from './placements.ts'
import { THEMES } from './themes.ts'

/**
 * The junk a new closet starts with. Each piece is cleared once, for stamps, as its own catalog
 * item (`clean:<placement id>`), so the server can tell a paid clear from a free one.
 */
export const CLOSET_MESSES: readonly Placement[] = [
  { id: 'mess-cobweb-door', kind: 'mess', ref: 'cobweb', zone: 'wall', x: 0.6, y: 2.85 },
  { id: 'mess-cobweb-corner', kind: 'mess', ref: 'cobweb', zone: 'wall', x: 5.4, y: 2.85, flip: true },
  { id: 'mess-peeling', kind: 'mess', ref: 'peeling-paper', zone: 'wall', x: 3.25, y: 1.3 },
  { id: 'mess-stain', kind: 'mess', ref: 'stain', zone: 'wall', x: 2.3, y: 2.25 },
  { id: 'mess-canvases', kind: 'mess', ref: 'old-canvases', zone: 'floor', x: 4.95 },
  { id: 'mess-paint', kind: 'mess', ref: 'old-paint', zone: 'floor', x: 3.85 },
  { id: 'mess-dust', kind: 'mess', ref: 'dust', zone: 'floor', x: 3.35 },
  { id: 'mess-boards', kind: 'mess', ref: 'boards', zone: 'wall', x: 5.0, y: 0.1 },
  { id: 'mess-wall-wear', kind: 'mess', ref: 'wall-wear', zone: 'wall', x: 3, y: 1 },
  { id: 'mess-floor-wear', kind: 'mess', ref: 'floor-wear', zone: 'floor', x: 3 },
]

/** Wear spread over a whole surface: tapping anywhere on it offers to fix all of it at once. */
export const WEAR: Record<string, 'wall' | 'floor'> = { 'wall-wear': 'wall', 'floor-wear': 'floor' }

/** Damage is repaired; everything else is junk to clean up. */
const DAMAGE = new Set(['stain', 'peeling-paper', 'wall-wear', 'floor-wear'])

export function isRepair(ref: string): boolean {
  return DAMAGE.has(ref)
}

/** Work whose price and time aren't simply its size. */
const SET_WORK: Record<string, { price: number; seconds: number }> = {
  boards: { price: 40, seconds: 16 },
  'wall-wear': { price: 30, seconds: 15 },
  'floor-wear': { price: 30, seconds: 15 },
}

export function cleanItemId(placementId: string): string {
  return `clean:${placementId}`
}

function areaOf(spec: { width: number; height: number } | undefined): number {
  return spec ? spec.width * spec.height : 1
}

/** What clearing a piece of junk costs, and how long it takes: both grow with its size. */
export function cleanupFor(ref: string): { price: number; seconds: number } {
  const set = SET_WORK[ref]
  if (set) return set
  const area = areaOf(THEMES.cozy.messes?.[ref])
  return { price: 5 * Math.max(1, Math.round(area * 4)), seconds: Math.round(3 + area * 6) }
}

/** How long a new thing takes to put together where it was set down, from 2 to 8 seconds. */
export function buildSecondsFor(ref: string): number {
  return Math.max(2, Math.min(8, Math.round(2 + areaOf(THEMES.cozy.props[ref]) * 1.5)))
}
