import type { CharacterKind } from './rig.ts'

// The fashion area as a row of rooms joined wall to wall, in the mocks' pixels (mock 7's).
// The entrance is mock 7; every collection room is laid out like bruce_mock_scene.png.

/** One swag of the curtain. Each room hangs its own, starting SWAG_START into the room, so every tag hangs alike. */
export const SWAG_STEP = 560
export const SWAG_START = 195
/** The entrance runs from the far left wall to where the first collection begins. */
export const ENTRANCE = { startX: -1683, endX: 760 }

export type FormBase = 'mannequin' | 'floralMannequin'

export interface FormSpot {
  costume: string
  base: FormBase
  /** Its dressed overlay. */
  image: string
  broom?: boolean
}

export interface HeadpieceSpot {
  id: string
  image: string
  dx: number
  y: number
  width: number
  rotation: number
}

export interface CollectionRoom {
  key: string
  title: string
  /** Bruce's tag carries its own lettering; the rest are written on the blank tag. */
  tagImage: 'bruceTag' | 'tagBlank'
  /** One form, or two standing side by side in a room a swag wider. */
  forms: readonly [FormSpot] | readonly [FormSpot, FormSpot]
  /** The left wall: a painting in the blue frame, or one that has its own frame. */
  left: { painting: string; framed?: { width: number; y: number } }
  /** The right wall: a painting in the cream frame. */
  right: { painting: string }
  /** A character to become, or a portrait that only hangs there. */
  portrait: { own: CharacterKind; image: string; width: number } | { own: null; image: string; width: number }
  ribbon: 'ribbon' | 'ribbonBlue'
  fish?: boolean
  /** Flowers around the form's platform: Jazlyn's own touch for Bruce's booth. */
  flowers?: boolean
  pillar: {
    pillow: { image: 'pillowBlue' | 'pillowRed'; y: number; width: number }
    pieces: readonly HeadpieceSpot[]
    fishBag?: boolean
  }
}

/** Bruce's booth, as offsets from its form, which every collection room follows. */
export const ROOM_TEMPLATE = {
  tag: { dx: -27, y: -46, width: 406, z: 0.2 },
  /** The tag's board, where a room's name is written. */
  tagText: { dy: 113, width: 270 },
  spotlight: { dx: -27, top: -165 },
  leftFrame: { dx: -371, y: 209, width: 350, fill: 0.73 },
  rightFrame: { dx: 336, y: 148, width: 201, fill: 0.68 },
  portrait: { dx: 148, y: 211, z: 0.2 },
  ribbon: { dx: 151, y: 282, width: 60, z: 0.21 },
  fish: { dx: 155, y: 306, width: 118, z: 0.21 },
  pillar: { dx: 324 },
  /** A two-form room's walls move out by this, its forms stand this far either side, keeping the template's gaps. */
  pair: { spread: 140, formDx: 150 },
}

export const COLLECTIONS: readonly CollectionRoom[] = [
  {
    key: 'kiki',
    title: 'The Kiki Collection',
    tagImage: 'tagBlank',
    forms: [{ costume: 'kiki', base: 'mannequin', image: 'mannequinDress', broom: true }],
    left: { painting: 'painting', framed: { width: 381, y: 230 } },
    right: { painting: 'placeholderPainting' },
    portrait: { own: 'cat', image: 'portraitJiji', width: 127 },
    ribbon: 'ribbon',
    pillar: {
      pillow: { image: 'pillowBlue', y: 447, width: 233 },
      pieces: [{ id: 'kiki', image: 'bow', dx: -6, y: 383, width: 216, rotation: 0 }],
    },
  },
  {
    key: 'floral',
    title: 'The Floral Collection',
    tagImage: 'tagBlank',
    forms: [
      { costume: 'blue-floral', base: 'floralMannequin', image: 'blueFloral' },
      { costume: 'floral-cardigan', base: 'floralMannequin', image: 'floralCardigan' },
    ],
    left: { painting: 'placeholderPainting' },
    right: { painting: 'placeholderPainting' },
    portrait: { own: 'otter', image: 'portraitOtter', width: 107 },
    ribbon: 'ribbon',
    pillar: {
      pillow: { image: 'pillowBlue', y: 445, width: 210 },
      pieces: [{ id: 'flower-crown', image: 'flowerCrown', dx: 0, y: 405, width: 165, rotation: -Math.PI / 10 }],
    },
  },
  {
    key: 'gold',
    title: 'The Gold Collection',
    tagImage: 'tagBlank',
    forms: [
      { costume: 'gold-sequin', base: 'floralMannequin', image: 'goldSequin' },
      { costume: 'gold-cape', base: 'floralMannequin', image: 'goldCape' },
    ],
    left: { painting: 'placeholderPainting' },
    right: { painting: 'placeholderPainting' },
    portrait: { own: null, image: 'portraitBunny', width: 110 },
    ribbon: 'ribbon',
    pillar: {
      pillow: { image: 'pillowBlue', y: 445, width: 210 },
      pieces: [
        { id: 'hibiscus-blue', image: 'hibiscusBlue', dx: -62, y: 410, width: 78, rotation: 0.2 },
        { id: 'hibiscus-yellow', image: 'hibiscusYellow', dx: 0, y: 398, width: 78, rotation: 0 },
        { id: 'hibiscus-pink', image: 'hibiscusPink', dx: 62, y: 410, width: 78, rotation: -0.2 },
      ],
    },
  },
  {
    key: 'bruce',
    title: "Bruce's Chronicles",
    tagImage: 'bruceTag',
    forms: [{ costume: 'tutu', base: 'mannequin', image: 'tutu' }],
    left: { painting: 'brucePaintingGarden' },
    right: { painting: 'brucePaintingPond' },
    portrait: { own: 'bruce', image: 'portraitBruce', width: 116 },
    ribbon: 'ribbonBlue',
    fish: true,
    flowers: true,
    pillar: {
      pillow: { image: 'pillowRed', y: 433, width: 210 },
      pieces: [],
      fishBag: true,
    },
  },
]

export interface PlacedRoom {
  key: string
  startX: number
  endX: number
  /** The middle of the room's forms; null for the entrance. */
  centerX: number | null
  /** How far its walls stand out from the template's, for a two-form room. */
  spread: number
  collection: CollectionRoom | null
}

function place(): PlacedRoom[] {
  const rooms: PlacedRoom[] = [{ key: 'entrance', startX: ENTRANCE.startX, endX: ENTRANCE.endX, centerX: null, spread: 0, collection: null }]
  let startX = ENTRANCE.endX
  for (const collection of COLLECTIONS) {
    const spread = collection.forms.length === 2 ? ROOM_TEMPLATE.pair.spread : 0
    const width = 2 * SWAG_STEP + 2 * spread
    rooms.push({ key: collection.key, startX, endX: startX + width, centerX: startX + width / 2, spread, collection })
    startX += width
  }
  return rooms
}

export const ATELIER_ROOMS: readonly PlacedRoom[] = place()

/** The camera stops where the last room's column ends. */
export const ATELIER_END_X = ATELIER_ROOMS[ATELIER_ROOMS.length - 1].endX - 120
