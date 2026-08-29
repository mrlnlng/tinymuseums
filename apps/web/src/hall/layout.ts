import { CONFIG } from './config'

/**
 * Positions displays and pedestals along the hall's single axis.
 *
 * Unlike the prototype, display widths are not fixed: the layout template an
 * artist chose decides how wide their canvas is, and that arrives from the
 * API. So the layout is rebuilt as slices load rather than computed once.
 */

export interface HallLayout {
  centerX: number[]
  width: number[]
  /** pedestalX[i] sits between display i and display i + 1. */
  pedestalX: number[]
  totalLength: number
  /** Highest slot index laid out so far. */
  known: number
}

export interface SlotSize {
  index: number
  width: number
}

/**
 * Builds positions for a contiguous run of slots starting at index 0.
 * Gaps are impossible: the hall is walked in order, so slices always extend
 * the run rather than landing somewhere ahead of it.
 */
export function computeLayout(sizes: SlotSize[]): HallLayout {
  const centerX: number[] = []
  const width: number[] = []
  const pedestalX: number[] = []

  let cursor = 0
  sizes.forEach((slot, i) => {
    centerX.push(cursor + slot.width / 2)
    width.push(slot.width)
    cursor += slot.width
    if (i < sizes.length - 1) {
      pedestalX.push(cursor + CONFIG.statueSpan / 2)
      cursor += CONFIG.statueSpan
    }
  })

  return {
    centerX,
    width,
    pedestalX,
    // Leave a pedestal's worth of room past the last display so the hall does
    // not end abruptly at a wall while more is still loading.
    totalLength: cursor + CONFIG.statueSpan,
    known: sizes.length,
  }
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
