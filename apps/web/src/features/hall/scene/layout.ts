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
  /*  Where the camera parks in the gift shop at the far end, or null while the
      hall is still growing: the shop stands past the last painting, so until
      there is a last painting it has nowhere to be. */
  giftShopX: number | null
  /*  Where the cafe room is centred, or null while the hall does not yet know
      where it goes. It is a rest stop, not a terminus: it occupies corridor
      between the tenth painting and the eleventh when the hall has more than
      ten works, and sits after the last painting (the gift shop past it) when
      it has ten or fewer — so it needs either the eleventh wall to exist or
      the hall to be complete. */
  cafeX: number | null
}

/*  The cafe's home in piece indices, or null when the hall has not laid out
    enough to know where it goes. More than ten pieces: it is a rest stop after
    the tenth, which the eleventh piece makes known even while the hall is
    still growing. Ten or fewer: it is the last thing before the gift shop,
    which only a complete hall can say. */
function cafeAfterIndex(widths: number[], isComplete: boolean): number | null {
  if (widths.length > 10) return 9
  if (isComplete && widths.length > 0) return widths.length - 1
  return null
}

/*  Slices always extend the run rather than landing ahead of it, so gaps are impossible. */
export function computeLayout(widths: number[], isComplete = false): HallLayout {
  const centerX: number[] = []
  const pedestalX: number[] = []
  /*  The cafe room is added to the cursor exactly where it stands, so every
      wall past it shifts with it and the room is never laid twice. */
  let cafeX: number | null = null

  /*  The run starts past the visitor centre rather than at the origin: the
      hall's left end is the visitor centre's door, and the first wall hangs
      after it. */
  let cursor = CONFIG.lobby.length
  const after = cafeAfterIndex(widths, isComplete)
  widths.forEach((w, i) => {
    centerX.push(cursor + w / 2)
    cursor += w
    if (i >= widths.length - 1) return

    if (after === i) {
      /*  The cafe replaces this gap — no 1.2 metres of empty wall and no
          pedestal; the room itself is the gap, centred between the two walls
          that stand on either side of it. */
      cafeX = cursor + CONFIG.cafe.length / 2
      cursor += CONFIG.cafe.length
    } else {
      // The gap is constant whether or not something stands in it, so the
      // planes stay evenly spaced and only the pedestals come and go.
      if (hasPedestal(i)) pedestalX.push(cursor + CONFIG.piece.gap / 2)
      cursor += CONFIG.piece.gap
    }
  })

  /*  Ten or fewer paintings: the cafe sits after the last one, a room between
      the exhibition and the shop, and the shop's park moves out to stand past
      it. (Mid-hall, above, the room is already in the cursor.) */
  if (isComplete && after === widths.length - 1) {
    cafeX = cursor + CONFIG.cafe.length / 2
    cursor += CONFIG.cafe.length
  }

  /*  Once every painting is laid out, the hall ends at the gift shop rather
      than at the last wall, and the camera's right-hand stop moves out to
      where it parks in front of the counter. Until then it ends a gap past the
      last piece, so the hall does not stop abruptly at a wall while more of it
      is still on its way. */
  const giftShopX = isComplete ? cursor + CONFIG.giftShop.length : null

  return {
    centerX,
    pedestalX,
    totalLength: giftShopX ?? cursor + CONFIG.piece.gap,
    known: widths.length,
    giftShopX,
    cafeX,
  }
}

/* Whether a pedestal stands in the gap after piece `index` — pseudo-random rather than random, so a rebuilt layout deals the same hall every time. */
function hasPedestal(index: number): boolean {
  const noise = Math.sin((index + 1) * 12.9898) * 43758.5453
  return noise - Math.floor(noise) < CONFIG.pedestal.frequency
}
