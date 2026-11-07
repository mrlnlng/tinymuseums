// Every place the owner can hang a painting, by location. A location is a shared room row; the
// studio lists these so a painting can be placed in any of them. Frames that do something other
// than show a painting (a portrait that changes your character, the Kiki painting fixed in its own
// frame) are not spots.

export interface SpotSpec {
  id: string
  label: string
  /** The frame opening's width over its height; a painting is cropped to fill it. */
  aspect: number
}

export interface LocationSpec {
  /** The room row's slug. */
  id: string
  label: string
  /** Fixed spots hold one painting each; a row is an ordered line of paintings. */
  kind: 'spots' | 'row'
  spots: readonly SpotSpec[]
}

/** The blue frame on a collection room's left wall and the cream one on its right. */
export const FRAME_ASPECT = { left: 762 / 1090, right: 91 / 129 }

const roomFrames = (room: string, name: string, sides: readonly ('left' | 'right')[]): SpotSpec[] =>
  sides.map((side) => ({ id: `${room}.${side}`, label: `${name} · ${side} frame`, aspect: FRAME_ASPECT[side] }))

export const ATELIER_SPOTS: readonly SpotSpec[] = [
  ...roomFrames('kiki', 'The Kiki Collection', ['right']),
  ...roomFrames('floral', 'The Floral Collection', ['left', 'right']),
  ...roomFrames('gold', 'The Gold Collection', ['left', 'right']),
  ...roomFrames('bruce', "Bruce's Chronicles", ['left', 'right']),
]

export const LOCATIONS: readonly LocationSpec[] = [
  { id: 'hall', label: 'The hall', kind: 'row', spots: [] },
  { id: 'atelier', label: 'The fashion area', kind: 'spots', spots: ATELIER_SPOTS },
]

export function locationById(id: string): LocationSpec | null {
  return LOCATIONS.find((location) => location.id === id) ?? null
}

/** A fixed spot's placement id, stable so a draft and its published copy compare equal. */
export function spotPlacementId(spot: string): string {
  return `s-${spot.replace(/[^A-Za-z0-9_-]/g, '-')}`
}
