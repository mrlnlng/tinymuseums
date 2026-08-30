import { CONFIG } from './config'

/**
 * Positions paintings and pedestals along the hall's single axis.
 *
 * Every slot is now one painting on its own wall, so the layout is a flat list
 * of piece widths, spaced with a constant gap between them. Widths come from
 * each piece's own framed image (`canvas.w` from the API) — decided by the
 * scene — and this module only spaces them out.
 */

export interface HallLayout {
  /** Per-piece horizontal centres, left to right, in world units. */
  centerX: number[]
  /** Per-piece plane widths, parallel to centerX. */
  width: number[]
  /** pedestalX[i] stands mid-gap after piece i, between it and piece i + 1. */
  pedestalX: number[]
  totalLength: number
  /** Number of pieces laid out so far. */
  known: number
}

/**
 * Builds positions for a contiguous run of pieces. Gaps are impossible: the
 * hall is walked in order, so slices always extend the run rather than landing
 * somewhere ahead of it.
 */
export function computeLayout(widths: number[]): HallLayout {
  const centerX: number[] = []
  const width: number[] = []
  const pedestalX: number[] = []

  let cursor = 0
  widths.forEach((w, i) => {
    centerX.push(cursor + w / 2)
    width.push(w)
    cursor += w
    if (i < widths.length - 1) {
      // The gap is constant whether or not something stands in it, so the
      // planes stay evenly spaced and only the pedestals come and go.
      if (hasPedestal(i)) pedestalX.push(cursor + CONFIG.piece.gap / 2)
      cursor += CONFIG.piece.gap
    }
  })

  return {
    centerX,
    width,
    pedestalX,
    // Leave a gap's worth of room past the last piece so the hall does not end
    // abruptly at a wall while more is still loading.
    totalLength: cursor + CONFIG.piece.gap,
    known: widths.length,
  }
}

/**
 * Whether a pedestal stands in the gap after piece `index`.
 *
 * Pseudo-random rather than random: the layout is rebuilt from scratch every
 * time a slice arrives, and a real `Math.random()` would deal a different hall
 * each time — pedestals appearing and vanishing as you walked. Hashing the
 * index gives the same answer for the same gap forever, which is what makes it
 * scenery rather than noise.
 */
function hasPedestal(index: number): boolean {
  const noise = Math.sin((index + 1) * 12.9898) * 43758.5453
  return noise - Math.floor(noise) < CONFIG.pedestal.frequency
}

export function nearestSlot(layout: HallLayout, x: number): number {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < layout.centerX.length; i++) {
    const d = Math.abs(layout.centerX[i] - x)
    if (d < bestDist) {
      bestDist = d
      best = i
    }
  }
  return best
}
