import { ITEMS, isBuyable } from '@tiny/core/economy'
import type { Placement, ThemeSpec } from '@tiny/core'

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

export function clampX(theme: ThemeSpec, ref: string, zone: string, x: number): number {
  const prop = theme.props[ref]
  const band = theme.zones[zone]
  if (!prop || !band) return x
  const min = band.minX + prop.width / 2
  const max = band.maxX - prop.width / 2
  if (min > max) return (band.minX + band.maxX) / 2
  return Math.min(max, Math.max(min, x))
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
      placement.x === other.x
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
