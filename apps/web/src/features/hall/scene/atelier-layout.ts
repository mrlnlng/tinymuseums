import type { CharacterKind } from './rig.ts'

// The fashion area as a row of rooms joined wall to wall, in the mocks' pixels (mock 7's).
// The entrance is mock 7; every collection room is laid out like bruce_mock_scene.png.

/** One swag of the curtain. Each room hangs its own, starting SWAG_START into the room, so every tag hangs alike. */
export const SWAG_STEP = 560
export const SWAG_START = 195
/**
 * The entrance runs from the far left wall to where the first collection begins. It ends past the
 * wardrobe (`CONFIG.atelier.wardrobe`), which stands 87 px short of the first room's wall, as it
 * does before Bruce's booth in the wardrobe mock.
 */
export const ENTRANCE = { startX: -1683, endX: 1497 }

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

/** Who made the work in a collection room. The card shows the name and links, not the blurb yet. */
export interface ArtistCredit {
  name: string
  instagram: string
  website: string
  /** Empty until the artist supplies one; the info card leaves out a blank description. */
  description?: string
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
  /** Flowers around the form's platform: Jazlyn's own touch for Bruce's booth. */
  flowers?: boolean
  /** The artist whose work hangs in this room, when known. */
  artist?: ArtistCredit
  /** The column beside the form: a cushion and the decoration resting on it. */
  pillar: {
    pillow: { image: 'pillowBlue' | 'pillowRed'; y: number; width: number }
    pieces: readonly HeadpieceSpot[]
  }
}

/** Bruce's booth, as offsets from its form, which every collection room follows. */
export const ROOM_TEMPLATE = {
  tag: { dx: -27, y: -46, width: 406, z: 0.2 },
  /** The tag's board, where a room's name is written. */
  tagText: { dy: 113, width: 270 },
  spotlight: { dx: -27, top: -165 },
  // Leave a small overlap behind the frame for the painting and placeholder aspects.
  leftFrame: { dx: -371, y: 209, width: 350, fill: 0.74 },
  // Overlap the new cream frame's opening, including its slightly lower centre.
  rightFrame: { dx: 336, y: 148, width: 201, fill: 0.72 },
  portrait: { dx: 148, y: 211, z: 0.2 },
  ribbon: { dx: 151, y: 282, width: 60, z: 0.21 },
  pillar: { dx: 324 },
  /** A two-form room's walls move out by this, its forms stand this far either side, keeping the template's gaps. */
  pair: { spread: 140, formDx: 150 },
}

export const COLLECTIONS: readonly CollectionRoom[] = [
  {
    key: 'bruce',
    title: "Bruce's Chronicles",
    tagImage: 'bruceTag',
    forms: [{ costume: 'tutu', base: 'mannequin', image: 'tutu' }],
    left: { painting: 'brucePaintingGarden' },
    right: { painting: 'brucePaintingPond' },
    portrait: { own: 'bruce', image: 'portraitBruce', width: 116 },
    ribbon: 'ribbonBlue',
    flowers: true,
    artist: {
      name: 'Jazlynn',
      instagram: 'https://www.instagram.com/jazlynn.art/',
      website: 'https://jazlynnart.com/',
      description: '',
    },
    pillar: {
      pillow: { image: 'pillowRed', y: 433, width: 210 },
      pieces: [
        { id: 'hibiscus-blue', image: 'hibiscusBlue', dx: -62, y: 398, width: 78, rotation: 0.2 },
        { id: 'hibiscus-yellow', image: 'hibiscusYellow', dx: 0, y: 386, width: 78, rotation: 0 },
        { id: 'hibiscus-pink', image: 'hibiscusPink', dx: 62, y: 398, width: 78, rotation: -0.2 },
      ],
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
