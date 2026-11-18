import type { PlacementKind, ThemeSpec } from './themes.ts'

export interface Placement {
  id: string
  kind: PlacementKind
  ref: string
  zone: string
  x: number
  /** World y of the thing's bottom edge. Wall and top placements; absent elsewhere. */
  y?: number
  /** The placement this one rests on (zone 'top'). */
  on?: string
  /** Drawn mirrored; absent means as painted. */
  flip?: boolean
}

export interface PlacementOwnership {
  ownsProp(propId: string): boolean
  hasPainting(pieceId: string): boolean
  /** Optional for older callers; a finish is not owned without it. */
  ownsFinish?(finishId: string): boolean
}

const ID = /^[A-Za-z0-9_-]{4,40}$/
/** Room for floating-point noise when a prop sits flush against a zone's edge. */
const EDGE_SLACK = 1e-6
const MAX_REF = 80
const GAMES = new Set(['sketch', 'color', 'pond'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function placementOf(value: unknown): Placement | null {
  if (!isRecord(value)) return null
  const { id, kind, ref, zone, x, y, on, flip } = value
  if (typeof id !== 'string' || !ID.test(id)) return null
  if (typeof kind !== 'string' || !['prop', 'painting', 'game', 'finish', 'mess'].includes(kind)) return null
  if (typeof ref !== 'string' || ref.length > MAX_REF) return null
  if (typeof zone !== 'string' || zone.length === 0) return null
  if (typeof x !== 'number' || !Number.isFinite(x)) return null
  if (y !== undefined && (typeof y !== 'number' || !Number.isFinite(y))) return null
  if (on !== undefined && (typeof on !== 'string' || !ID.test(on))) return null
  if (flip !== undefined && typeof flip !== 'boolean') return null
  return {
    id,
    kind: kind as PlacementKind,
    ref,
    zone,
    x,
    ...(y !== undefined ? { y } : {}),
    ...(on !== undefined ? { on } : {}),
    ...(flip ? { flip: true } : {}),
  }
}

export function parsePlacements(raw: unknown): Placement[] | null {
  if (!Array.isArray(raw)) return null
  const placements: Placement[] = []
  const ids = new Set<string>()
  for (const entry of raw) {
    const placement = placementOf(entry)
    if (!placement || ids.has(placement.id)) return null
    ids.add(placement.id)
    placements.push(placement)
  }
  return placements
}

export function validatePlacements(
  theme: ThemeSpec,
  placements: Placement[],
  can: PlacementOwnership,
): { ok: true } | { ok: false; reason: string; id?: string } {
  if (placements.length > theme.maxPlacements) return { ok: false, reason: 'too_many' }

  const paintings = new Set<string>()
  const props = new Set<string>()
  const filled = new Map<string, number>()
  const byId = new Map(placements.map((placement) => [placement.id, placement]))
  for (const placement of placements) {
    const fail = (reason: string) => ({ ok: false as const, reason, id: placement.id })
    const zone = theme.zones[placement.zone]
    if (!zone) return fail('unknown_zone')
    if (!zone.accepts.includes(placement.kind)) return fail('zone_rejects_kind')
    const count = (filled.get(placement.zone) ?? 0) + 1
    if (zone.capacity !== undefined && count > zone.capacity) return fail('zone_full')
    filled.set(placement.zone, count)

    if (placement.kind === 'prop') {
      const prop = theme.props[placement.ref]
      if (!prop) return fail('unknown_prop')
      if (!prop.zones.includes(placement.zone)) return fail('wrong_zone')
      const half = prop.width / 2
      if (placement.x - half < zone.minX - EDGE_SLACK || placement.x + half > zone.maxX + EDGE_SLACK) {
        return fail('out_of_bounds')
      }
      if (
        placement.y !== undefined &&
        zone.minY !== undefined &&
        zone.maxY !== undefined &&
        (placement.y < zone.minY - EDGE_SLACK || placement.y + prop.height > zone.maxY + EDGE_SLACK)
      ) {
        return fail('out_of_bounds')
      }
      if (placement.zone === 'top') {
        if (placement.y === undefined || placement.on === undefined) return fail('invalid_rest')
        const parent = byId.get(placement.on)
        if (!parent || parent.id === placement.id) return fail('invalid_rest')
        const parentProp = parent.kind === 'prop' ? theme.props[parent.ref] : undefined
        if (!parentProp?.surfaces?.length) return fail('invalid_rest')
        const wall = theme.zones.wall
        const wallTop = wall?.maxY ?? theme.floorY
        if (placement.y < theme.floorY - EDGE_SLACK || placement.y > wallTop + EDGE_SLACK) {
          return fail('out_of_bounds')
        }
      }
      if (!can.ownsProp(placement.ref)) return fail('not_owned')
      // Each prop is owned once, so it can stand in only one spot.
      if (props.has(placement.ref)) return fail('duplicate_prop')
      props.add(placement.ref)
    } else if (placement.kind === 'painting') {
      if (!can.hasPainting(placement.ref)) return fail('unknown_painting')
      if (paintings.has(placement.ref)) return fail('duplicate_painting')
      paintings.add(placement.ref)
    } else if (placement.kind === 'mess') {
      // Dirt is only ever cleaned away; it can be left where the room put it, never added elsewhere.
      const mess = theme.messes?.[placement.ref]
      if (!mess || !mess.zones.includes(placement.zone)) return fail('unknown_mess')
      if (placement.x + mess.width / 2 > zone.maxX + 1) return fail('out_of_bounds')
    } else if (placement.kind === 'finish') {
      const slot = theme.finishes?.[placement.zone]
      if (!slot || !slot.ids.includes(placement.ref)) return fail('unknown_finish')
      if (!can.ownsFinish?.(placement.ref)) return fail('not_owned')
    } else if (!GAMES.has(placement.ref)) {
      return fail('unknown_game')
    }
  }

  return { ok: true }
}

export function orderedPaintings(placements: Placement[]): string[] {
  return placements
    .filter((placement) => placement.kind === 'painting')
    .sort((a, b) => a.x - b.x || a.id.localeCompare(b.id))
    .map((placement) => placement.ref)
}
