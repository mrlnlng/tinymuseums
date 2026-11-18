import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parsePlacements, validatePlacements, type Placement } from './placements.ts'
import { THEMES } from './themes.ts'

const cozy = THEMES.cozy
const ownsAll = { ownsProp: () => true, hasPainting: () => true, ownsFinish: () => true }
const ownsNone = { ownsProp: () => false, hasPainting: () => false, ownsFinish: () => false }

function wallProp(overrides: Partial<Placement> = {}): Placement {
  return { id: 'pl-prop', kind: 'prop', ref: 'shelf', zone: 'wall', x: 4, ...overrides }
}

function finish(overrides: Partial<Placement> = {}): Placement {
  return {
    id: 'pl-finish',
    kind: 'finish',
    ref: 'wallpaper-cream',
    zone: 'wallpaper',
    x: 0,
    ...overrides,
  }
}

function table(): Placement {
  return { id: 'pl-table', kind: 'prop', ref: 'round-table', zone: 'floor', x: 4.96 }
}

function vase(overrides: Partial<Placement> = {}): Placement {
  return {
    id: 'pl-vase',
    kind: 'prop',
    ref: 'tulip-vase',
    zone: 'top',
    x: 4.92,
    y: 0.24,
    on: 'pl-table',
    ...overrides,
  }
}

test('parsePlacements keeps valid y and on, and only includes them when present', () => {
  const base = { id: 'pl-1', kind: 'prop', ref: 'tulip-vase', zone: 'top', x: 4.92 }
  assert.deepEqual(parsePlacements([{ ...base, y: 0.24, on: 'pl-2' }]), [
    { ...base, y: 0.24, on: 'pl-2' },
  ])
  assert.deepEqual(parsePlacements([{ ...base, y: 0 }]), [{ ...base, y: 0 }])
  assert.deepEqual(parsePlacements([{ ...base, on: 'pl-2' }]), [{ ...base, on: 'pl-2' }])
  assert.deepEqual(parsePlacements([base]), [base])
})

test('parsePlacements rejects malformed y and on', () => {
  const base = { id: 'pl-1', kind: 'prop', ref: 'tulip-vase', zone: 'top', x: 4.92 }
  const bad: unknown[] = [
    [{ ...base, y: Number.NaN }],
    [{ ...base, y: Number.POSITIVE_INFINITY }],
    [{ ...base, y: Number.NEGATIVE_INFINITY }],
    [{ ...base, y: '0.24' }],
    [{ ...base, on: 7 }],
    [{ ...base, on: 'abc' }],
    [{ ...base, on: 'bad id' }],
    [{ ...base, on: 'x'.repeat(41) }],
  ]
  for (const raw of bad) assert.equal(parsePlacements(raw), null, JSON.stringify(raw))
})

test('a finish must be a known id in its slot and owned', () => {
  const wallpaper = finish({ ref: 'wallpaper-pink-stripes' })
  assert.deepEqual(validatePlacements(cozy, [wallpaper], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [finish({ ref: 'wallpaper-nope' })], ownsAll), {
    ok: false,
    reason: 'unknown_finish',
    id: 'pl-finish',
  })
  assert.deepEqual(validatePlacements(cozy, [wallpaper], ownsNone), {
    ok: false,
    reason: 'not_owned',
    id: 'pl-finish',
  })
})

test('a finish slot holds one finish', () => {
  const first = finish({ id: 'pl-finish-1', ref: 'wallpaper-pink-stripes' })
  const second = finish({ id: 'pl-finish-2', ref: 'wallpaper-ornate' })
  assert.deepEqual(validatePlacements(cozy, [first, second], ownsAll), {
    ok: false,
    reason: 'zone_full',
    id: 'pl-finish-2',
  })
})

test('a wall prop with y must fit between the wall base and wall top', () => {
  assert.deepEqual(validatePlacements(cozy, [wallProp({ y: 0.25 })], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [wallProp({ y: 3.6 })], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [wallProp({ y: 0.24 })], ownsAll), {
    ok: false,
    reason: 'out_of_bounds',
    id: 'pl-prop',
  })
  assert.deepEqual(validatePlacements(cozy, [wallProp({ y: 3.61 })], ownsAll), {
    ok: false,
    reason: 'out_of_bounds',
    id: 'pl-prop',
  })
  // No y is a legacy wall placement, drawn at the old centred band.
  assert.deepEqual(validatePlacements(cozy, [wallProp()], ownsAll), { ok: true })
})

test('a top placement needs a y and a parent with surfaces, in any order', () => {
  assert.deepEqual(validatePlacements(cozy, [table(), vase()], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [vase(), table()], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [table(), vase({ y: -0.05 })], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [table(), vase({ y: 3.8 })], ownsAll), { ok: true })
  assert.deepEqual(validatePlacements(cozy, [table(), vase({ y: -0.051 })], ownsAll), {
    ok: false,
    reason: 'out_of_bounds',
    id: 'pl-vase',
  })
  assert.deepEqual(validatePlacements(cozy, [table(), vase({ y: 3.801 })], ownsAll), {
    ok: false,
    reason: 'out_of_bounds',
    id: 'pl-vase',
  })
})

test('a top placement needs y and on', () => {
  assert.deepEqual(validatePlacements(cozy, [table(), vase({ y: undefined })], ownsAll), {
    ok: false,
    reason: 'invalid_rest',
    id: 'pl-vase',
  })
  assert.deepEqual(validatePlacements(cozy, [table(), vase({ on: undefined })], ownsAll), {
    ok: false,
    reason: 'invalid_rest',
    id: 'pl-vase',
  })
})

test('a top placement parent must exist, differ from the child, and have surfaces', () => {
  assert.deepEqual(validatePlacements(cozy, [vase({ on: 'pl-missing' })], ownsAll), {
    ok: false,
    reason: 'invalid_rest',
    id: 'pl-vase',
  })
  assert.deepEqual(validatePlacements(cozy, [vase({ on: 'pl-vase' })], ownsAll), {
    ok: false,
    reason: 'invalid_rest',
    id: 'pl-vase',
  })
  const rug: Placement = { id: 'pl-rug', kind: 'prop', ref: 'rug', zone: 'floor', x: 5 }
  assert.deepEqual(validatePlacements(cozy, [rug, vase({ on: 'pl-rug' })], ownsAll), {
    ok: false,
    reason: 'invalid_rest',
    id: 'pl-vase',
  })
})

test('every resting prop accepts top and every surface span is within the prop width', () => {
  for (const [id, prop] of Object.entries(cozy.props)) {
    if (prop.rests) assert.ok(prop.zones.includes('top'), `${id} has rests but no top zone`)
    for (const surface of prop.surfaces ?? []) {
      assert.ok(surface.from >= 0, `${id} surface from >= 0`)
      assert.ok(surface.from < surface.to, `${id} surface from < to`)
      assert.ok(surface.to <= 1, `${id} surface to <= 1`)
    }
  }
})

test('finish slots list valid ids and defaults', () => {
  for (const [slotName, slot] of Object.entries(cozy.finishes ?? {})) {
    assert.ok(slot, slotName)
    assert.ok(slot.ids.length > 0, slotName)
    assert.ok(slot.ids.includes(slot.default), `${slotName} default is one of its ids`)
  }
})
