import { ATELIER_SPOTS } from './spots.ts'

export type PlacementKind = 'prop' | 'painting' | 'game' | 'finish' | 'mess'

export interface ZoneSpec {
  minX: number
  maxX: number
  /** Lowest valid bottom edge for zones with a vertical extent (the wall). */
  minY?: number
  /** Highest valid top edge for zones with a vertical extent (the wall). */
  maxY?: number
  accepts: PlacementKind[]
  /** At most this many placements; a frame or finish slot holds one. */
  capacity?: number
}

export interface SurfaceSpec {
  /** Height of the resting line, as a share of the prop's height from its bottom. */
  y: number
  /** Usable span, as shares of the prop's width from its left edge (as painted, unflipped). */
  from: number
  to: number
  /** Tallest thing that fits, in world units; omitted means no limit. */
  clearance?: number
}

export interface PropSpec {
  zones: string[]
  width: number
  height: number
  surfaces?: SurfaceSpec[]
  rests?: boolean
  /** Sits beneath furniture and may overlap its footprint. */
  floorCovering?: boolean
}

export interface ThemeSpec {
  id: ThemeId
  kind: 'shared' | 'personal'
  zones: Record<string, ZoneSpec>
  props: Record<string, PropSpec>
  /** World y of the visitors' feet, where floor things stand. */
  floorY: number
  maxPlacements: number
  finishes?: Partial<Record<string, { ids: string[]; default: string }>>
  /** Dirt a new room starts with; it is cleaned away, never placed. */
  messes?: Record<string, PropSpec>
}

export type ThemeId = 'hall' | 'cozy' | 'atelier'

function prop(zones: string[], width: number, height: number, extra: Partial<PropSpec> = {}): PropSpec {
  return { zones, width, height, ...extra }
}

const COZY_PROPS: Record<string, PropSpec> = {
  // Wall things.
  mirror: prop(['wall'], 0.9, 2.25),
  painting: prop(['wall'], 1.1, 1.53),
  'portrait-bunny': prop(['wall'], 0.8, 0.8),
  'portrait-jiji': prop(['wall'], 0.8, 0.8),
  'portrait-otter': prop(['wall'], 0.8, 0.8),
  'portrait-wink': prop(['wall'], 0.8, 0.67),
  shelf: prop(['wall'], 1.4, 0.2, { surfaces: [{ y: 0.95, from: 0.03, to: 0.97 }] }),
  window: prop(['wall'], 1.45, 1.84),
  'wall-hooks': prop(['wall'], 0.86, 0.4),
  'wall-shelf': prop(['wall'], 1.43, 0.19, { surfaces: [{ y: 0.95, from: 0.02, to: 0.98 }] }),
  'gold-frame': prop(['wall'], 0.95, 1.12),
  'pressed-fern': prop(['wall'], 0.425, 0.59),
  'midnight-study': prop(['wall'], 0.7, 0.403),
  hanger: prop(['wall'], 0.6, 0.34),
  // Hangs from the top of the wall on a long cord.
  'bare-bulb': prop(['wall'], 0.42, 1.5),
  // A small grimy window set high in the closet wall; the room's sunlight comes through it.
  'attic-window': prop(['wall'], 1.05, 1.3),

  // Floor things.
  cabinet: prop(['floor'], 1.3, 0.91, { surfaces: [{ y: 0.84, from: 0.04, to: 0.96 }] }),
  carpet: prop(['floor'], 2.4, 0.49, { floorCovering: true }),
  'pillow-blue': prop(['floor', 'top'], 0.8, 0.42, { rests: true }),
  'pillow-red': prop(['floor', 'top'], 0.8, 0.42, { rests: true }),
  column: prop(['floor'], 0.7, 0.8, { surfaces: [{ y: 0.98, from: 0.3, to: 0.7 }] }),
  'jewelry-box': prop(['floor', 'top'], 0.6, 0.38, { rests: true }),
  perfume: prop(['floor', 'top'], 0.4, 0.4, { rests: true }),
  broom: prop(['floor'], 0.6, 1.11),
  cat: prop(['floor'], 1.0, 1.37),
  cubby: prop(['floor'], 1.07, 1.36, {
    surfaces: [
      { y: 0.97, from: 0.04, to: 0.96 },
      { y: 0.68, from: 0.13, to: 0.87, clearance: 0.36 },
      { y: 0.4, from: 0.13, to: 0.87, clearance: 0.36 },
      { y: 0.07, from: 0.13, to: 0.87, clearance: 0.36 },
    ],
  }),
  'round-table': prop(['floor'], 1.38, 0.93, { surfaces: [{ y: 0.86, from: 0.14, to: 0.86 }] }),
  'side-table': prop(['floor'], 0.72, 1.01, { surfaces: [{ y: 0.93, from: 0.12, to: 0.88 }] }),
  chair: prop(['floor'], 0.78, 1.22, { surfaces: [{ y: 0.53, from: 0.1, to: 0.9 }] }),
  armchair: prop(['floor'], 1.4, 1.39, { surfaces: [{ y: 0.44, from: 0.22, to: 0.8 }] }),
  rug: prop(['floor'], 2.3, 0.75, { floorCovering: true }),
  'patchwork-mat': prop(['floor'], 1.45, 0.279, { floorCovering: true }),
  'gallery-runner': prop(['floor'], 2.95, 0.396, { floorCovering: true }),
  'moonwake-rug': prop(['floor'], 2.15, 0.598, { floorCovering: true }),
  'lily-stitch-rug': prop(['floor'], 1.55, 0.421, { floorCovering: true }),
  'studio-stripe-carpet': prop(['floor'], 2.55, 0.462, { floorCovering: true }),
  'faded-floral-carpet': prop(['floor'], 2.3, 0.5, { floorCovering: true }),
  plant: prop(['floor', 'top'], 0.85, 1.2, { rests: true }),
  mug: prop(['floor', 'top'], 0.24, 0.19, { rests: true }),
  'tulip-vase': prop(['floor', 'top'], 0.34, 0.45, { rests: true }),
  'reading-lamp': prop(['floor', 'top'], 0.37, 0.515, { rests: true }),
  sketchbooks: prop(['floor', 'top'], 0.45, 0.204, { rests: true }),
  'ammonite-display': prop(['floor', 'top'], 0.32, 0.34, { rests: true }),
  'opening-night-invite': prop(['floor', 'top'], 0.36, 0.184, { rests: true }),
  'paint-stained-palette': prop(['floor', 'top'], 0.43, 0.225, { rests: true }),
  'storeroom-letter': prop(['floor', 'top'], 0.29, 0.187, { rests: true }),

  // Fish trophies are plaques: they hang on the wall, or lean on the floor.
  'fish-minnow': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-perch': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-carp': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-koi': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-golden-koi': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-star-snapper': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-crab': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-puffer': prop(['wall', 'floor'], 0.7, 0.53),
  'fish-blobfish': prop(['wall', 'floor'], 0.7, 0.53),
}

export const THEMES: Record<ThemeId, ThemeSpec> = {
  hall: {
    id: 'hall',
    kind: 'shared',
    zones: {
      wall: { minX: 0, maxX: 10000, accepts: ['painting'] },
    },
    props: {},
    floorY: 0,
    maxPlacements: 30,
  },
  atelier: {
    id: 'atelier',
    kind: 'shared',
    zones: Object.fromEntries(ATELIER_SPOTS.map((spot) => [spot.id, { minX: 0, maxX: 0, accepts: ['painting'], capacity: 1 }])),
    props: {},
    floorY: 0,
    maxPlacements: ATELIER_SPOTS.length,
  },
  cozy: {
    id: 'cozy',
    kind: 'personal',
    zones: {
      wall: { minX: 0.3, maxX: 19.7, minY: 0.25, maxY: 3.8, accepts: ['prop', 'mess'] },
      floor: { minX: 0.3, maxX: 19.7, accepts: ['prop', 'mess'] },
      top: { minX: 0.3, maxX: 19.7, accepts: ['prop'] },
      wallpaper: { minX: 0, maxX: 0, accepts: ['finish'], capacity: 1 },
      baseboard: { minX: 0, maxX: 0, accepts: ['finish'], capacity: 1 },
    },
    props: COZY_PROPS,
    floorY: -0.05,
    // 40 things, two finishes and the closet's dirt.
    maxPlacements: 50,
    finishes: {
      wallpaper: {
        ids: [
          'wallpaper-cream',
          'wallpaper-plaster',
          'wallpaper-peach-stripes',
          'wallpaper-pink-stripes',
          'wallpaper-blue-floral',
          'wallpaper-ornate',
        ],
        default: 'wallpaper-cream',
      },
      baseboard: {
        ids: ['baseboard-tall', 'baseboard-short'],
        default: 'baseboard-tall',
      },
    },
    messes: {
      cobweb: prop(['wall'], 1.1, 0.95),
      stain: prop(['wall'], 0.95, 0.75),
      'peeling-paper': prop(['wall'], 0.8, 1.0),
      dust: prop(['floor'], 0.75, 0.28),
      'old-canvases': prop(['floor'], 1.5, 1.25),
      'old-paint': prop(['floor'], 0.6, 0.6),
      boards: prop(['wall'], 1.3, 3.7),
      // Wear across the whole wall or floor, fixed as one; drawn over the room, not as a thing in it.
      'wall-wear': prop(['wall'], 0.1, 0.1),
      'floor-wear': prop(['floor'], 0.1, 0.1),
    },
  },
}
