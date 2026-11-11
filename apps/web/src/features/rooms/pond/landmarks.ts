import type { PondPanelKind } from './room'
import type { PondPath } from './depth'
import type { AssetName } from '@/shared/lib/assets'

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
  /** Built through the asset manifest, so it is served from the CDN with the rest of the art. */
  image: AssetName
}

/** Door → notices → Marlow's stall → water → the journal's quieter woodland nook. */
export const POND_LANDMARKS: readonly PondLandmark[] = [
  {
    kind: 'exit',
    x: FOREST_GATE.x,
    depth: 0,
    width: 1.95,
    baseY: 0,
    aspect: 920 / 1369,
    title: 'Back to the museum',
    description: 'The forest gate',
    image: 'pond/forest-door',
  },
  {
    kind: 'bounties',
    x: -2.7,
    depth: 1,
    width: 2.05,
    baseY: 0,
    aspect: 1304 / 1266,
    path: { foot: -1.55, end: -2.7, sway: 0.28, width: 0.95 },
    standX: -1.8,
    title: 'Noticeboard',
    description: 'Today’s bounties & pond records',
    image: 'pond/notice-sign',
  },
  {
    kind: 'fishmonger',
    x: 0.6,
    depth: 1,
    width: 3.7,
    baseY: 0,
    aspect: 1747 / 1388,
    path: { foot: 1.9, end: 0.6, sway: 0.24, width: 0.95 },
    standX: 2,
    title: 'Bait shop',
    description: 'Buy bait & trade pearls',
    image: 'pond/bait-shop',
  },
  {
    kind: 'fishdex',
    x: 12.6,
    depth: 1,
    width: 2.8,
    baseY: 0,
    aspect: 1380 / 770,
    path: { foot: 11.4, end: 12.6, sway: -0.28, width: 0.95 },
    standX: 11.5,
    title: 'Fish journal',
    description: 'Your catches & discoveries',
    image: 'pond/forest-journal-signed',
  },
]
