import { CONFIG } from './config'

/* Positions paintings and pedestals along the hall's single axis: a flat list of piece widths spaced with a constant gap; widths come from each piece's framed image. */

export interface HallLayout {
  /** Per-piece horizontal centres, left to right, in world units. */
  centerX: number[]
  /** pedestalX[i] stands mid-gap after piece i, between it and piece i + 1. */
  pedestalX: number[]
  totalLength: number
  /** Number of pieces laid out so far. */
  known: number
}

/*  Slices always extend the run rather than landing ahead of it, so gaps are impossible. */
export function computeLayout(widths: number[]): HallLayout {
  const centerX: number[] = []
  const pedestalX: number[] = []

  /*  The run starts past the visitor centre rather than at the origin: the
      hall's left end is the visitor centre's door, and the first wall hangs
      after it. */
  let cursor = CONFIG.lobby.length
  widths.forEach((w, i) => {
    centerX.push(cursor + w / 2)
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
    pedestalX,
    // A gap's worth of room past the last piece, so the hall does not end
    // abruptly at a wall while more is still loading.
    totalLength: cursor + CONFIG.piece.gap,
    known: widths.length,
  }
}

/* Whether a pedestal stands in the gap after piece `index` — pseudo-random rather than random, so a rebuilt layout deals the same hall every time. */
function hasPedestal(index: number): boolean {
  const noise = Math.sin((index + 1) * 12.9898) * 43758.5453
  return noise - Math.floor(noise) < CONFIG.pedestal.frequency
}
