import { CARDIGANS, HIBISCUS } from './wardrobe.ts'

/** What the closet offers to flip through, in order; null is wearing nothing in that place. */
export const OUTFITS: readonly (string | null)[] = [
  null, 'kiki', ...CARDIGANS, 'blue-floral', 'floral-cardigan', 'gold-sequin', 'gold-cape', 'tutu',
]
export const HEADPIECES: readonly (string | null)[] = [
  null, 'kiki', 'flower-crown', ...HIBISCUS, 'blue-cap', 'daisy-clip',
]

export const choiceAt = (list: readonly (string | null)[], position: number) =>
  list[((position % list.length) + list.length) % list.length]

/** Where a choice sits on its wheel; something not on the list sits at nothing. */
export const positionOf = (list: readonly (string | null)[], id: string | null) => Math.max(0, list.indexOf(id))
