import type { PondPanelKind } from './room'

/** The woodland entrance shares the costume-gallery door's scale and interaction. */
export const FOREST_GATE = { x: -5.6, arrivalX: -4.85, reach: 0.6 } as const

export interface PondLandmark {
  kind: PondPanelKind | 'exit'
  /** World position of the sprite and the place the visitor approaches it from. */
  x: number
  standX: number
  width: number
  baseY: number
  aspect: number
  /** Leave room for the visitor beside a wider prop on phones. */
  frameX?: number
  title: string
  description: string
  image: string
}

/** Door → notices → fisherman → water → the journal's quieter woodland nook. */
export const POND_LANDMARKS: readonly PondLandmark[] = [
  {
    kind: 'exit',
    x: FOREST_GATE.x,
    standX: FOREST_GATE.arrivalX,
    width: 1.95,
    baseY: 0,
    aspect: 1076 / 1461,
    title: 'Back to the museum',
    description: 'The forest gate',
    image: '/assets/pond/forest-door.webp',
  },
  {
    kind: 'bounties',
    x: -2.7,
    standX: -3.7,
    width: 1.45,
    baseY: 0.12,
    aspect: 1122 / 1402,
    title: 'Noticeboard',
    description: 'Today’s bounties & pond records',
    image: '/assets/pond/forest-noticeboard-signed.webp',
  },
  {
    kind: 'fishmonger',
    x: 0.75,
    standX: 0.6,
    width: 2.25,
    baseY: 0,
    aspect: 1,
    title: 'Bait shop',
    description: 'Buy bait & trade pearls',
    image: '/assets/pond/forest-bait-shop-signed.webp',
  },
  {
    kind: 'fishdex',
    x: 12.5,
    standX: 11.2,
    width: 1.25 * 1536 / 1024,
    baseY: 0,
    aspect: 1536 / 1024,
    frameX: 0.5,
    title: 'Fish journal',
    description: 'Your catches & discoveries',
    image: '/assets/pond/forest-journal-signed.webp',
  },
]
