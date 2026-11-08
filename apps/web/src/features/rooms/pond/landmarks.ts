import type { PondPanelKind } from './room'
import type { PondPath } from './depth'

/** The woodland entrance shares the costume-gallery door's scale and interaction. */
export const FOREST_GATE = { x: -5.6, arrivalX: -4.85, reach: 0.6 } as const

export interface PondLandmark {
  kind: PondPanelKind | 'exit'
  /** World position of the sprite's foot; the gate stands on the bank, the rest at the treeline. */
  x: number
  depth: number
  /** Width as drawn on the bank; it shrinks with depth. */
  width: number
  baseY: number
  aspect: number
  /** The way up from the bank, for props set back from it. */
  path?: PondPath
  /** Where the visitor stands beside the prop to use it, clear of the sprite. */
  standX?: number
  title: string
  description: string
  image: string
}

/** Door → notices → Marlow's stall → water → the journal's quieter woodland nook. */
export const POND_LANDMARKS: readonly PondLandmark[] = [
  {
    kind: 'exit',
    x: FOREST_GATE.x,
    depth: 0,
    width: 1.95,
    baseY: 0,
    aspect: 1076 / 1461,
    title: 'Back to the museum',
    description: 'The forest gate',
    image: '/assets/pond/forest-door.webp',
  },
  {
    kind: 'bounties',
    x: -3.05,
    depth: 1,
    width: 1.6,
    baseY: 0.12,
    aspect: 1122 / 1402,
    path: { foot: -1.9, end: -3.05, sway: 0.28, width: 0.95 },
    standX: -2.3,
    title: 'Noticeboard',
    description: 'Today’s bounties & pond records',
    image: '/assets/pond/forest-noticeboard-signed.webp',
  },
  {
    kind: 'fishmonger',
    x: 0.55,
    depth: 1,
    width: 2.45,
    baseY: 0,
    aspect: 1,
    path: { foot: 1.55, end: 0.55, sway: 0.24, width: 0.95 },
    standX: 1.55,
    title: 'Bait shop',
    description: 'Buy bait & trade pearls',
    image: '/assets/pond/forest-bait-shop-signed.webp',
  },
  {
    kind: 'fishdex',
    x: 12.6,
    depth: 1,
    width: 1.65 * 1536 / 1024,
    baseY: 0,
    aspect: 1536 / 1024,
    path: { foot: 11.45, end: 12.6, sway: -0.28, width: 0.95 },
    standX: 11.6,
    title: 'Fish journal',
    description: 'Your catches & discoveries',
    image: '/assets/pond/forest-journal-signed.webp',
  },
]
