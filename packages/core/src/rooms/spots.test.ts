import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validatePlacements } from './placements.ts'
import { ATELIER_SPOTS, LOCATIONS, locationById, spotPlacementId } from './spots.ts'
import { THEMES } from './themes.ts'

const ownsAll = { ownsProp: () => true, hasPainting: () => true }
const painting = (zone: string, ref: string) => ({ id: spotPlacementId(zone), kind: 'painting' as const, ref, zone, x: 0 })

test('every location is a room theme, and spot ids are unique', () => {
  for (const location of LOCATIONS) {
    assert.ok(THEMES[location.id as keyof typeof THEMES], location.id)
    const ids = location.spots.map((spot) => spot.id)
    assert.equal(new Set(ids).size, ids.length, location.id)
  }
  assert.equal(locationById('atelier')?.spots, ATELIER_SPOTS)
  assert.equal(locationById('nowhere'), null)
})

test('the fashion area accepts one painting in each of its frames', () => {
  const placements = ATELIER_SPOTS.map((spot, i) => painting(spot.id, `piece-${i}`))
  assert.deepEqual(validatePlacements(THEMES.atelier, placements, ownsAll), { ok: true })
})

test('a frame holds one painting, and only frames are spots', () => {
  const full = validatePlacements(THEMES.atelier, [painting('floral.left', 'a'), { ...painting('floral.left', 'b'), id: 's-other' }], ownsAll)
  assert.equal(full.ok, false)
  assert.equal(!full.ok && full.reason, 'zone_full')
  const unknown = validatePlacements(THEMES.atelier, [painting('kiki.left', 'a')], ownsAll)
  assert.equal(!unknown.ok && unknown.reason, 'unknown_zone')
})

test('placement ids pass the placement id rule', () => {
  for (const spot of ATELIER_SPOTS) assert.match(spotPlacementId(spot.id), /^[A-Za-z0-9_-]{4,40}$/)
})
