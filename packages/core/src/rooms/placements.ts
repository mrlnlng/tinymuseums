import type { PlacementKind, ThemeSpec } from './themes.ts'

export interface Placement {
  id: string
  kind: PlacementKind
  ref: string
  zone: string
  x: number
}

export interface PlacementOwnership {
  ownsProp(propId: string): boolean
  hasPainting(pieceId: string): boolean
}

const ID = /^[A-Za-z0-9_-]{4,40}$/
const MAX_REF = 80
const GAMES = new Set(['sketch', 'color', 'pond'])

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function placementOf(value: unknown): Placement | null {
  if (!isRecord(value)) return null
  const { id, kind, ref, zone, x } = value
  if (typeof id !== 'string' || !ID.test(id)) return null
  if (typeof kind !== 'string' || !['prop', 'painting', 'game'].includes(kind)) return null
  if (typeof ref !== 'string' || ref.length > MAX_REF) return null
  if (typeof zone !== 'string' || zone.length === 0) return null
  if (typeof x !== 'number' || !Number.isFinite(x)) return null
  return { id, kind: kind as PlacementKind, ref, zone, x }
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
): { ok: true } | { ok: false; reason: string } {
  if (placements.length > theme.maxPlacements) return { ok: false, reason: 'too_many' }

  const paintings = new Set<string>()
  for (const placement of placements) {
    const zone = theme.zones[placement.zone]
    if (!zone) return { ok: false, reason: 'unknown_zone' }
    if (!zone.accepts.includes(placement.kind)) return { ok: false, reason: 'zone_rejects_kind' }

    if (placement.kind === 'prop') {
      const prop = theme.props[placement.ref]
      if (!prop) return { ok: false, reason: 'unknown_prop' }
      if (!prop.zones.includes(placement.zone)) return { ok: false, reason: 'wrong_zone' }
      if (placement.x - prop.width / 2 < zone.minX || placement.x + prop.width / 2 > zone.maxX) {
        return { ok: false, reason: 'out_of_bounds' }
      }
      if (!can.ownsProp(placement.ref)) return { ok: false, reason: 'not_owned' }
    } else if (placement.kind === 'painting') {
      if (!can.hasPainting(placement.ref)) return { ok: false, reason: 'unknown_painting' }
      if (paintings.has(placement.ref)) return { ok: false, reason: 'duplicate_painting' }
      paintings.add(placement.ref)
    } else if (!GAMES.has(placement.ref)) {
      return { ok: false, reason: 'unknown_game' }
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
