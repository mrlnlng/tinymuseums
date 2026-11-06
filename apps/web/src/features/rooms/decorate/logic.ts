import { ITEMS, isBuyable } from '@tiny/core/economy'
import { THEMES, type Placement, type ThemeSpec } from '@tiny/core/rooms'

const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

export function newPlacementId(random: () => number = Math.random): string {
  let id = ''
  for (let i = 0; i < 12; i++) {
    const index = Math.min(ID_CHARS.length - 1, Math.floor(random() * ID_CHARS.length))
    id += ID_CHARS[Math.max(0, index)]
  }
  return id
}

export function zoneFor(theme: ThemeSpec, ref: string, preferred?: string): string | null {
  const prop = theme.props[ref]
  if (!prop) return null
  if (preferred && prop.zones.includes(preferred)) return preferred
  return prop.zones[0] ?? null
}

/** Above this height a pointer means the wall, below it the floor. */
const WALL_FROM_Y = 0.55

export function zoneAt(theme: ThemeSpec, ref: string, worldY: number): string | null {
  const zones = theme.props[ref]?.zones ?? []
  if (zones.length <= 1) return zones[0] ?? null
  const wanted = worldY >= WALL_FROM_Y ? 'wall' : 'floor'
  return zones.includes(wanted) ? wanted : zones[0]
}

/** Positions are kept to a thousandth, which also rounds away floating-point noise at zone edges. */
function tidy(x: number): number {
  return Math.round(x * 1000) / 1000
}

export function clampX(theme: ThemeSpec, ref: string, zone: string, x: number): number {
  const prop = theme.props[ref]
  const band = theme.zones[zone]
  if (!prop || !band) return x
  const min = band.minX + prop.width / 2
  const max = band.maxX - prop.width / 2
  if (min > max) return tidy((band.minX + band.maxX) / 2)
  return tidy(Math.min(max, Math.max(min, x)))
}

/** The repaired arrangement after the server refused one placement: that one goes back to how it was saved, or away. */
export function withoutRejected(
  draft: readonly Placement[],
  saved: readonly Placement[],
  rejectedId: string | null,
): Placement[] {
  if (rejectedId === null) return [...saved]
  const before = saved.find((placement) => placement.id === rejectedId)
  return before
    ? draft.map((placement) => (placement.id === rejectedId ? before : placement))
    : draft.filter((placement) => placement.id !== rejectedId)
}

const LIES_FLAT = new Set(['carpet'])

/** The nearest x to `preferred` where a prop fits its zone without overlapping its neighbours. */
export function freeX(
  theme: ThemeSpec,
  ref: string,
  zone: string,
  placements: readonly Placement[],
  preferred: number,
): number {
  const prop = theme.props[ref]
  const start = clampX(theme, ref, zone, preferred)
  if (!prop || LIES_FLAT.has(ref)) return start
  const others = placements
    .filter((placement) => placement.zone === zone && !LIES_FLAT.has(placement.ref))
    .map((placement) => ({ x: placement.x, half: (theme.props[placement.ref]?.width ?? 0) / 2 }))
  const fits = (x: number) => others.every((other) => Math.abs(other.x - x) >= other.half + prop.width / 2 + 0.05)
  for (let step = 0; step <= 400; step++) {
    for (const sign of step === 0 ? [1] : [1, -1]) {
      const x = clampX(theme, ref, zone, start + sign * step * 0.1)
      if (fits(x)) return x
    }
  }
  return start
}

function propIds(items: readonly string[]): string[] {
  return items.filter((item) => item.startsWith('prop:')).map((item) => item.slice('prop:'.length))
}

export function trayPropIds(items: readonly string[], placements: readonly Placement[]): string[] {
  const placed = new Set(placements.filter((placement) => placement.kind === 'prop').map((placement) => placement.ref))
  const seen = new Set<string>()
  const result: string[] = []
  for (const ref of propIds(items)) {
    if (placed.has(ref) || seen.has(ref)) continue
    seen.add(ref)
    result.push(ref)
  }
  return result
}

export function shopPropIds(items: readonly string[]): string[] {
  const owned = new Set(items)
  return Object.keys(ITEMS)
    .filter((itemId) => itemId.startsWith('prop:') && isBuyable(itemId) && !owned.has(itemId))
    .map((itemId) => itemId.slice('prop:'.length))
}

export function paintingOrder(placements: readonly Placement[]): string[] {
  return placements
    .filter((placement) => placement.kind === 'painting')
    .slice()
    .sort((a, b) => a.x - b.x || a.id.localeCompare(b.id))
    .map((placement) => placement.ref)
}

export function currentHallOrder(draft: readonly Placement[], published: readonly Placement[]): string[] {
  return paintingOrder(draft.length > 0 ? draft : published)
}

export function hallPlacements(order: readonly string[]): Placement[] {
  return order.map((pieceId, index) => ({
    id: `p-${pieceId.replace(/-/g, '').slice(0, 12)}`,
    kind: 'painting',
    ref: pieceId,
    zone: 'wall',
    x: index * 10,
  }))
}

export function samePlacements(a: readonly Placement[], b: readonly Placement[]): boolean {
  if (a.length !== b.length) return false
  return a.every((placement, index) => {
    const other = b[index]
    return (
      placement.id === other.id &&
      placement.kind === other.kind &&
      placement.ref === other.ref &&
      placement.zone === other.zone &&
      placement.x === other.x &&
      (placement.flip ?? false) === (other.flip ?? false)
    )
  })
}

const REASONS: Record<string, string> = {
  not_found: 'This room could not be found.',
  forbidden: 'You cannot change this room.',
  invalid: 'That arrangement could not be saved.',
  too_many: 'There are too many things in this room.',
  unknown_zone: 'That spot is not part of the room.',
  zone_rejects_kind: 'That does not belong there.',
  unknown_prop: 'That thing is not available.',
  wrong_zone: 'That thing does not belong in that zone.',
  out_of_bounds: 'That does not fit there.',
  not_owned: 'You do not own that yet.',
  unknown_painting: 'That painting is not available.',
  duplicate_painting: 'That painting is already hanging.',
  duplicate_prop: 'That is already out in your room.',
  unknown_game: 'That game is not available.',
  unknown_theme: 'This room has an unknown theme.',
}

export function reasonLabel(reason: string | null | undefined): string {
  if (!reason) return 'That could not be saved.'
  return REASONS[reason] ?? 'That could not be saved.'
}

const PROP_NAMES: Record<string, string> = {
  mirror: 'Mirror',
  painting: 'Little painting',
  'portrait-bunny': 'Bunny portrait',
  'portrait-jiji': 'Jiji portrait',
  'portrait-otter': 'Otter portrait',
  'portrait-wink': 'Winking portrait',
  shelf: 'Shelf',
  cabinet: 'Cabinet',
  carpet: 'Carpet',
  'pillow-blue': 'Blue pillow',
  'pillow-red': 'Red pillow',
  column: 'Column',
  'jewelry-box': 'Jewelry box',
  perfume: 'Perfume',
  broom: 'Broom',
  cat: 'Standing cat',
  'fish-minnow': 'Minnow trophy',
  'fish-perch': 'Perch trophy',
  'fish-carp': 'Carp trophy',
  'fish-koi': 'Koi trophy',
  'fish-golden-koi': 'Golden koi trophy',
}

export function propLabel(ref: string): string {
  return PROP_NAMES[ref] ?? ref.replace(/-/g, ' ')
}

export type DrawerCategory = 'all' | 'wall' | 'floor' | 'fish'

export function categoryOf(ref: string): Exclude<DrawerCategory, 'all'> {
  if (ref.startsWith('fish-')) return 'fish'
  return THEMES.cozy.props[ref]?.zones[0] === 'wall' ? 'wall' : 'floor'
}

const WORTH: Record<string, number> = { carpet: 3, cabinet: 3, cat: 3, shelf: 3, mirror: 3 }

/** How much a placed thing adds to a room's coziness; trophies are prized. */
export function cozyWorth(ref: string): number {
  if (ref.startsWith('fish-')) return ref === 'fish-golden-koi' ? 8 : 4
  return WORTH[ref] ?? 2
}

const LEVELS = [
  { name: 'Bare', at: 0 },
  { name: 'Settling in', at: 3 },
  { name: 'Snug', at: 8 },
  { name: 'Cozy', at: 15 },
  { name: 'Dreamy', at: 24 },
  { name: 'Legendary', at: 36 },
] as const

export interface CozyLevel {
  score: number
  name: string
  hearts: number
  maxHearts: number
  /** 0..1 toward the next level; 1 at the top. */
  progress: number
  next: string | null
}

export function cozyLevel(placements: readonly Placement[]): CozyLevel {
  const score = placements.reduce((sum, placement) => sum + (placement.kind === 'prop' ? cozyWorth(placement.ref) : 0), 0)
  let index = 0
  for (let i = 0; i < LEVELS.length; i++) if (score >= LEVELS[i].at) index = i
  const current = LEVELS[index]
  const next = LEVELS[index + 1]
  return {
    score,
    name: current.name,
    hearts: index,
    maxHearts: LEVELS.length - 1,
    progress: next ? (score - current.at) / (next.at - current.at) : 1,
    next: next?.name ?? null,
  }
}
