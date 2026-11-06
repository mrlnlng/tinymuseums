import assert from 'node:assert/strict'
import { test } from 'node:test'
import { orderedPaintings, parsePlacements, validatePlacements, type Placement } from './placements.ts'
import { THEMES } from './themes.ts'

function placement(overrides: Partial<Placement> = {}): Placement {
  return { id: 'pl-1', kind: 'prop', ref: 'carpet', zone: 'floor', x: 7, ...overrides }
}

const ownsAll = { ownsProp: () => true, hasPainting: () => true }
const ownsNone = { ownsProp: () => false, hasPainting: () => false }

test('parsePlacements accepts valid entries and drops unknown fields', () => {
  const parsed = parsePlacements([
    { id: 'pl-1', kind: 'prop', ref: 'carpet', zone: 'floor', x: 2.5, extra: true },
    { id: 'pl-2', kind: 'game', ref: 'pond', zone: 'floor', x: 4 },
  ])
  assert.deepEqual(parsed, [
    { id: 'pl-1', kind: 'prop', ref: 'carpet', zone: 'floor', x: 2.5 },
    { id: 'pl-2', kind: 'game', ref: 'pond', zone: 'floor', x: 4 },
  ])
})

test('parsePlacements rejects bad containers, entries, ids, refs and coordinates', () => {
  const good = placement()
  const bad: unknown[] = [
    null,
    {},
    'nope',
    [null],
    [{ ...good, id: 'abc' }],
    [{ ...good, id: 'x'.repeat(41) }],
    [{ ...good, id: 'bad id' }],
    [{ ...good, kind: 'statue' }],
    [{ ...good, ref: 7 }],
    [{ ...good, ref: 'x'.repeat(81) }],
    [{ ...good, zone: '' }],
    [{ ...good, x: Number.NaN }],
    [{ ...good, x: Number.POSITIVE_INFINITY }],
    [{ ...good, x: '7' }],
    [good, { ...good, id: good.id }],
  ]
  for (const raw of bad) assert.equal(parsePlacements(raw), null, JSON.stringify(raw))
})

test('parsePlacements accepts empty arrays', () => {
  assert.deepEqual(parsePlacements([]), [])
})

test('a placement count above the theme limit is rejected', () => {
  const theme = { ...THEMES.hall, maxPlacements: 1 }
  const placements = [
    placement({ id: 'pl-1', kind: 'painting', ref: 'piece-1', zone: 'wall', x: 10 }),
    placement({ id: 'pl-2', kind: 'painting', ref: 'piece-2', zone: 'wall', x: 20 }),
  ]
  assert.deepEqual(validatePlacements(theme, placements, ownsAll), { ok: false, reason: 'too_many' })
})

test('the zone must exist and accept the placement kind', () => {
  assert.deepEqual(validatePlacements(THEMES.cozy, [placement({ zone: 'ceiling' })], ownsAll), {
    ok: false,
    reason: 'unknown_zone',
  })
  assert.deepEqual(
    validatePlacements(
      THEMES.cozy,
      [placement({ kind: 'painting', ref: 'piece-1', zone: 'wall', x: 7 })],
      ownsAll,
    ),
    { ok: false, reason: 'zone_rejects_kind' },
  )
})

test('a prop must be known, in one of its zones, and fully inside the zone', () => {
  const theme = THEMES.cozy
  assert.deepEqual(validatePlacements(theme, [placement({ ref: 'throne' })], ownsAll), {
    ok: false,
    reason: 'unknown_prop',
  })
  assert.deepEqual(validatePlacements(theme, [placement({ ref: 'shelf' })], ownsAll), {
    ok: false,
    reason: 'wrong_zone',
  })
  assert.deepEqual(validatePlacements(theme, [placement({ x: 1.5 })], ownsAll), {
    ok: false,
    reason: 'out_of_bounds',
  })
  assert.deepEqual(validatePlacements(theme, [placement({ x: 13.5 })], ownsAll), {
    ok: false,
    reason: 'out_of_bounds',
  })
  assert.deepEqual(validatePlacements(theme, [placement({ x: 3.1 })], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(theme, [placement({ x: 12.4 })], ownsAll), { ok: true })
})

test('a prop must be owned', () => {
  assert.deepEqual(validatePlacements(THEMES.cozy, [placement()], ownsNone), {
    ok: false,
    reason: 'not_owned',
  })
})

test('a painting must be owned and placed only once', () => {
  const theme = THEMES.hall
  const painting = placement({ kind: 'painting', ref: 'piece-1', zone: 'wall', x: 10 })
  assert.deepEqual(validatePlacements(theme, [painting], ownsNone), {
    ok: false,
    reason: 'unknown_painting',
  })
  assert.deepEqual(
    validatePlacements(theme, [painting, { ...painting, id: 'pl-2', x: 20 }], ownsAll),
    { ok: false, reason: 'duplicate_painting' },
  )
})

test('games must be one of the known ids', () => {
  const theme = {
    ...THEMES.hall,
    zones: {
      wall: { ...THEMES.hall.zones.wall, accepts: ['game' as const] },
    },
  }
  const game = (ref: string) => placement({ kind: 'game', ref, zone: 'wall', x: 10 })
  for (const ref of ['sketch', 'color', 'pond']) {
    assert.deepEqual(validatePlacements(theme, [game(ref)], ownsAll), { ok: true })
  }
  assert.deepEqual(validatePlacements(theme, [game('chess')], ownsAll), {
    ok: false,
    reason: 'unknown_game',
  })
})

test('a mixed valid arrangement passes', () => {
  const cozy = THEMES.cozy
  const placements = [
    placement({ id: 'pl-shelf', ref: 'shelf', zone: 'wall', x: 4 }),
    placement({ id: 'pl-carpet', ref: 'carpet', zone: 'floor', x: 6.5 }),
    placement({ id: 'pl-cat', ref: 'cat', zone: 'floor', x: 9 }),
  ]
  assert.deepEqual(validatePlacements(cozy, placements, ownsAll), { ok: true })
})

test('orderedPaintings sorts by x then id and leaves other kinds out', () => {
  const paintings = [
    placement({ id: 'pl-b', kind: 'painting', ref: 'piece-b', zone: 'wall', x: 20 }),
    placement({ id: 'pl-a', kind: 'painting', ref: 'piece-a', zone: 'wall', x: 10 }),
    placement({ id: 'pl-c', kind: 'painting', ref: 'piece-c', zone: 'wall', x: 20 }),
    placement({ id: 'pl-d', kind: 'prop', ref: 'carpet', zone: 'floor', x: 0 }),
  ]
  assert.deepEqual(orderedPaintings(paintings), ['piece-a', 'piece-b', 'piece-c'])
})
