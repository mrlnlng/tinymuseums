export type PlacementKind = 'prop' | 'painting' | 'game'

export interface ZoneSpec {
  minX: number
  maxX: number
  accepts: PlacementKind[]
}

export interface PropSpec {
  zones: string[]
  width: number
}

export interface ThemeSpec {
  id: ThemeId
  kind: 'shared' | 'personal'
  zones: Record<string, ZoneSpec>
  props: Record<string, PropSpec>
  maxPlacements: number
}

export type ThemeId = 'hall' | 'cozy'

const COZY_WALL_PROPS = [
  ['mirror', 0.9],
  ['painting', 1.1],
  ['portrait-bunny', 0.8],
  ['portrait-jiji', 0.8],
  ['portrait-otter', 0.8],
  ['portrait-wink', 0.8],
  ['shelf', 1.4],
] as const

const COZY_FLOOR_PROPS = [
  ['cabinet', 1.3],
  ['carpet', 2.4],
  ['pillow-blue', 0.8],
  ['pillow-red', 0.8],
  ['column', 0.7],
  ['jewelry-box', 0.6],
  ['perfume', 0.4],
  ['broom', 0.6],
  ['cat', 1.0],
  ['fish-minnow', 0.7],
  ['fish-perch', 0.7],
  ['fish-carp', 0.7],
  ['fish-koi', 0.7],
  ['fish-golden-koi', 0.7],
] as const

function propsOn(zone: string, props: readonly (readonly [string, number])[]): Record<string, PropSpec> {
  return Object.fromEntries(props.map(([id, width]) => [id, { zones: [zone], width }]))
}

export const THEMES: Record<ThemeId, ThemeSpec> = {
  hall: {
    id: 'hall',
    kind: 'shared',
    zones: {
      wall: { minX: 0, maxX: 10000, accepts: ['painting'] },
    },
    props: {},
    maxPlacements: 30,
  },
  cozy: {
    id: 'cozy',
    kind: 'personal',
    zones: {
      wall: { minX: 2.0, maxX: 13.4, accepts: ['prop'] },
      floor: { minX: 1.9, maxX: 13.6, accepts: ['prop'] },
    },
    props: {
      ...propsOn('wall', COZY_WALL_PROPS),
      ...propsOn('floor', COZY_FLOOR_PROPS),
    },
    maxPlacements: 24,
  },
}
