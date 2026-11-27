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
  if (!prop || prop.floorCovering) return start
  const others = placements
    .filter((placement) => placement.zone === zone && !theme.props[placement.ref]?.floorCovering)
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
    if (placed.has(ref) || seen.has(ref) || isRemovedProceduralFish(ref)) continue
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
      placement.y === other.y &&
      placement.on === other.on &&
      (placement.flip ?? false) === (other.flip ?? false)
    )
  })
}

const REASONS: Record<string, string> = {
  not_found: 'This room could not be found.',
  forbidden: 'You cannot change this room.',
  invalid: 'That arrangement could not be saved.',
  not_cleaned: 'That junk has to be paid for before it can go.',
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
  unknown_finish: 'That wallpaper is not available.',
  invalid_rest: 'That has nothing to rest on there.',
}

const MESS_NAMES: Record<string, string> = {
  cobweb: 'Cobweb',
  stain: 'Damp stain',
  'peeling-paper': 'Peeling paper',
  dust: 'Dust',
  'old-canvases': 'Old canvases',
  'old-paint': 'Old paint tin',
  boards: 'Old boards',
  'wall-wear': 'Worn wall',
  'floor-wear': 'Worn floor',
}

export function messLabel(ref: string): string {
  return MESS_NAMES[ref] ?? 'Junk'
}

const MESS_NOTES: Record<string, string> = {
  'wall-wear': 'Every crack, chip and scuff on the wall',
  'floor-wear': 'Every scratch, scuff and crack in the floor',
}

/** A line under the name, for things that are more than they look. */
export function messNote(ref: string): string | null {
  return MESS_NOTES[ref] ?? null
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
  window: 'Window',
  'wall-hooks': 'Wall hooks',
  'wall-shelf': 'Wall shelf',
  'gold-frame': 'Gold frame',
  hanger: 'Hanger',
  cubby: 'Cubby',
  'round-table': 'Round table',
  'side-table': 'Side table',
  chair: 'Chair',
  armchair: 'Armchair',
  rug: 'Rug',
  plant: 'Potted plant',
  mug: 'Mug',
  'tulip-vase': 'Tulip vase',
  'reading-lamp': 'Reading lamp',
  sketchbooks: 'Sketchbooks',
  'ammonite-display': 'Ammonite display',
  'pressed-fern': 'Pressed fern',
  'patchwork-mat': 'Patchwork mat',
  'gallery-runner': 'Gallery runner',
  'moonwake-rug': 'Moonwake rug',
  'lily-stitch-rug': 'Lily stitch rug',
  'studio-stripe-carpet': 'Studio stripe carpet',
  'faded-floral-carpet': 'Faded floral carpet',
  'opening-night-invite': 'Opening night invitation',
  'paint-stained-palette': 'Paint-stained palette',
  'storeroom-letter': 'Storeroom letter',
  'midnight-study': 'Midnight study',
  'fish-minnow': 'Minnow trophy',
  'fish-perch': 'Perch trophy',
  'fish-carp': 'Carp trophy',
  'fish-koi': 'Koi trophy',
  'fish-golden-koi': 'Golden koi trophy',
  'fish-star-snapper': 'Star snapper trophy',
  'fish-crab': 'Crab trophy',
  'fish-puffer': 'Pufferfish trophy',
  'fish-blobfish': 'Sir Blobfish trophy',
}

export function propLabel(ref: string): string {
  return PROP_NAMES[ref] ?? ref.replace(/-/g, ' ')
}

const FINISH_NAMES: Record<string, string> = {
  'wallpaper-cream': 'Cream',
  'wallpaper-peach-stripes': 'Peach stripes',
  'wallpaper-pink-stripes': 'Pink stripes',
  'wallpaper-blue-floral': 'Blue floral',
  'wallpaper-ornate': 'Ornate',
  'baseboard-tall': 'Panelled',
  'baseboard-short': 'Skirting only',
}

export function finishLabel(ref: string): string {
  return FINISH_NAMES[ref] ?? ref.replace(/^(wallpaper|baseboard)-/, '').replace(/-/g, ' ')
}

export type DrawerCategory = 'all' | 'furniture' | 'wall' | 'small' | 'fish'

export function categoryOf(ref: string): Exclude<DrawerCategory, 'all'> {
  if (ref.startsWith('fish-')) return 'fish'
  const prop = THEMES.cozy.props[ref]
  if (prop?.zones[0] === 'wall') return 'wall'
  return prop?.rests ? 'small' : 'furniture'
}

const WORTH: Record<string, number> = {
  cabinet: 3,
  cat: 3,
  shelf: 3,
  mirror: 3,
  window: 3,
  cubby: 3,
  'round-table': 3,
  'side-table': 3,
  chair: 3,
  armchair: 4,
  plant: 3,
  'gold-frame': 3,
}

/** How much a placed thing adds to a room's coziness; trophies are prized. */
export function cozyWorth(ref: string): number {
  if (ref.startsWith('fish-')) return ref === 'fish-golden-koi' || ref === 'fish-blobfish' ? 8 : 4
  return WORTH[ref] ?? (THEMES.cozy.props[ref]?.floorCovering ? 3 : 2)
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

/** The 1–5 star presentation of a room level. The score behind it is unchanged. */
export interface RoomStars {
  stars: number
  maxStars: 5
  /** 0..1 toward the next star; 1 at five stars. */
  progress: number
  caption: string
}

/**
 * Maps the existing six cozy levels onto five stars:
 * Bare 1, Settling in 2, Snug 3, Cozy 4, Dreamy 5, Legendary 5.
 * Only the words and hearts change; `cozyLevel` still computes the score.
 */
export function roomStars(level: CozyLevel): RoomStars {
  const stars = Math.min(5, Math.max(1, level.hearts + 1))
  return {
    stars,
    maxStars: 5,
    progress: stars >= 5 ? 1 : level.progress,
    caption: 'More stars when your room is clean and decorated.',
  }
}

/** Fish that were drawn in code rather than from the artist's image assets. */
export const REMOVED_PROCEDURAL_FISH: ReadonlySet<string> = new Set([
  'fish-minnow',
  'fish-perch',
  'fish-carp',
  'fish-koi',
  'fish-golden-koi',
])

export function isRemovedProceduralFish(ref: string): boolean {
  return REMOVED_PROCEDURAL_FISH.has(ref)
}

export function cozyLevel(placements: readonly Placement[]): CozyLevel {
  const score = placements.reduce((sum, placement) => {
    if (placement.kind === 'prop') return sum + cozyWorth(placement.ref)
    if (placement.kind === 'finish') return sum + (placement.ref === THEMES.cozy.finishes?.[placement.zone]?.default ? 0 : 3)
    return sum
  }, 0)
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

const COZY = THEMES.cozy
/** Where legacy wall things, saved before they had a height, are centred. */
const LEGACY_WALL_CENTER = 2.3

export function propHeight(ref: string): number {
  return COZY.props[ref]?.height ?? 0
}

/** World y of a placement's bottom edge; things on the floor stand on the visitors' feet line. */
export function baseOf(placement: Placement): number {
  if (placement.zone === 'wall') return placement.y ?? LEGACY_WALL_CENTER - propHeight(placement.ref) / 2
  if (placement.zone === 'top') return placement.y ?? COZY.floorY
  return COZY.floorY
}

export interface Surface {
  parentId: string
  y: number
  minX: number
  maxX: number
  clearance?: number
}

/** Every resting line on the placed furniture, in world units; a flipped prop mirrors its spans. */
export function surfacesIn(placements: readonly Placement[], exclude: ReadonlySet<string> = new Set()): Surface[] {
  const surfaces: Surface[] = []
  for (const placement of placements) {
    if (placement.kind !== 'prop' || exclude.has(placement.id)) continue
    const prop = COZY.props[placement.ref]
    if (!prop?.surfaces) continue
    const left = placement.x - prop.width / 2
    const base = baseOf(placement)
    for (const surface of prop.surfaces) {
      const from = placement.flip ? 1 - surface.to : surface.from
      const to = placement.flip ? 1 - surface.from : surface.to
      surfaces.push({
        parentId: placement.id,
        y: tidy(base + surface.y * prop.height),
        minX: left + from * prop.width,
        maxX: left + to * prop.width,
        ...(surface.clearance === undefined ? {} : { clearance: surface.clearance }),
      })
    }
  }
  return surfaces
}

function intoSpan(surface: Surface, half: number, x: number): number {
  if (surface.maxX - surface.minX <= half * 2) return tidy((surface.minX + surface.maxX) / 2)
  return tidy(Math.min(surface.maxX - half, Math.max(surface.minX + half, x)))
}

const REST_BELOW = 0.25
const REST_ABOVE = 0.45

/** The surface a resting thing would land on with the pointer at (x, y), if any. */
export function restAt(
  ref: string,
  x: number,
  y: number,
  placements: readonly Placement[],
  exclude: ReadonlySet<string> = new Set(),
): { on: string; x: number; y: number } | null {
  const prop = COZY.props[ref]
  if (!prop?.rests) return null
  let best: { surface: Surface; distance: number } | null = null
  for (const surface of surfacesIn(placements, exclude)) {
    if (x < surface.minX || x > surface.maxX) continue
    if (y < surface.y - REST_BELOW || y > surface.y + prop.height + REST_ABOVE) continue
    if (surface.clearance !== undefined && prop.height > surface.clearance + 1e-9) continue
    const distance = Math.abs(y - (surface.y + prop.height / 2))
    if (!best || distance < best.distance) best = { surface, distance }
  }
  if (!best) return null
  return { on: best.surface.parentId, y: best.surface.y, x: intoSpan(best.surface, prop.width / 2, x) }
}

/** A free spot on a surface overlapping [left, right], nearest `center`, for tap-to-place. */
export function restInView(
  ref: string,
  left: number,
  right: number,
  center: number,
  placements: readonly Placement[],
): { on: string; x: number; y: number } | null {
  const prop = COZY.props[ref]
  if (!prop?.rests) return null
  const half = prop.width / 2
  const resting = placements.filter((placement) => placement.zone === 'top')
  const options = surfacesIn(placements)
    .filter((surface) => surface.maxX > left && surface.minX < right)
    .filter((surface) => surface.clearance === undefined || prop.height <= surface.clearance + 1e-9)
    .filter((surface) => surface.maxX - surface.minX >= prop.width * 0.8)
    .map((surface) => {
      const others = resting
        .filter((other) => other.on === surface.parentId && Math.abs((other.y ?? 0) - surface.y) < 0.01)
        .map((other) => ({ x: other.x, half: (COZY.props[other.ref]?.width ?? 0) / 2 }))
      const fits = (x: number) => others.every((other) => Math.abs(other.x - x) >= other.half + half)
      const mid = (surface.minX + surface.maxX) / 2
      for (let step = 0; step <= 40; step++) {
        for (const sign of step === 0 ? [1] : [1, -1]) {
          const x = intoSpan(surface, half, mid + sign * step * 0.05)
          if (fits(x)) return { surface, x }
        }
      }
      return null
    })
    .filter((option): option is { surface: Surface; x: number } => option !== null)
    .sort((a, b) => Math.abs(a.x - center) - Math.abs(b.x - center))
  const pick = options[0]
  return pick ? { on: pick.surface.parentId, y: pick.surface.y, x: pick.x } : null
}

/** A wall thing's bottom edge, kept so the whole thing stays on the wall. */
export function clampY(ref: string, y: number): number {
  const wall = COZY.zones.wall
  const height = propHeight(ref)
  const min = wall.minY ?? 0
  const max = (wall.maxY ?? min + height) - height
  return tidy(Math.min(Math.max(min, max), Math.max(min, y)))
}

export function ridersOf(id: string, placements: readonly Placement[]): Placement[] {
  return placements.filter((placement) => placement.zone === 'top' && placement.on === id)
}

/** Riders moved along with their parent going from `before` to `after`. */
export function ridersAfter(before: Placement, after: Placement, placements: readonly Placement[]): Placement[] {
  const dx = after.x - before.x
  const dy = before.zone === 'wall' && after.zone === 'wall' ? baseOf(after) - baseOf(before) : 0
  const flipped = (before.flip ?? false) !== (after.flip ?? false)
  return ridersOf(before.id, placements).map((rider) => {
    const x = flipped ? 2 * after.x - (rider.x + dx) : rider.x + dx
    return { ...rider, x: tidy(x), y: tidy((rider.y ?? 0) + dy) }
  })
}

/** Replaces one placement and carries whatever rests on it along. */
export function moveWithRiders(placements: readonly Placement[], next: Placement): Placement[] {
  const before = placements.find((placement) => placement.id === next.id)
  if (!before) return [...placements]
  const moved = new Map(ridersAfter(before, next, placements).map((rider) => [rider.id, rider]))
  return placements.map((placement) => (placement.id === next.id ? next : moved.get(placement.id) ?? placement))
}

/** Removes one placement; whatever rested on it lands on the floor below. */
export function putAwayWithRiders(placements: readonly Placement[], id: string): Placement[] {
  return placements
    .filter((placement) => placement.id !== id)
    .map((placement) => {
      if (placement.zone !== 'top' || placement.on !== id) return placement
      const { y: _y, on: _on, ...rest } = placement
      return { ...rest, zone: 'floor', x: clampX(COZY, placement.ref, 'floor', placement.x) }
    })
}

export type FinishSlot = 'wallpaper' | 'baseboard'
export const FINISH_SLOTS: readonly FinishSlot[] = ['wallpaper', 'baseboard']

export function finishOf(placements: readonly Placement[], zone: FinishSlot): string {
  const chosen = placements.find((placement) => placement.kind === 'finish' && placement.zone === zone)?.ref
  const slot = COZY.finishes?.[zone]
  return chosen && slot?.ids.includes(chosen) ? chosen : slot?.default ?? ''
}

export function withFinish(placements: readonly Placement[], zone: FinishSlot, ref: string): Placement[] {
  const rest = placements.filter((placement) => !(placement.kind === 'finish' && placement.zone === zone))
  return [...rest, { id: `finish-${zone}`, kind: 'finish', ref, zone, x: 0 }]
}

export function slotOf(ref: string): FinishSlot | null {
  for (const slot of FINISH_SLOTS) if (COZY.finishes?.[slot]?.ids.includes(ref)) return slot
  return null
}

export function ownedFinishIds(items: readonly string[]): Set<string> {
  return new Set(items.filter((item) => item.startsWith('finish:')).map((item) => item.slice('finish:'.length)))
}

export function shopFinishIds(items: readonly string[]): string[] {
  const owned = new Set(items)
  return Object.keys(ITEMS)
    .filter((itemId) => itemId.startsWith('finish:') && isBuyable(itemId) && ITEMS[itemId].price > 0 && !owned.has(itemId))
    .map((itemId) => itemId.slice('finish:'.length))
}

/** Things out in the room; wallpaper, baseboard and dirt take slots but aren't things. */
export function thingsIn(placements: readonly Placement[]): number {
  return placements.filter((placement) => placement.kind === 'prop').length
}

export const THING_LIMIT = 40
