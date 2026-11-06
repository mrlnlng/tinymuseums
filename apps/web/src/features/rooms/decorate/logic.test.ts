import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Placement } from '@tiny/core'
import { THEMES } from '../../../../../../packages/core/src/rooms/themes.ts'
import {
  clampX,
  currentHallOrder,
  hallPlacements,
  newPlacementId,
  paintingOrder,
  propLabel,
  reasonLabel,
  samePlacements,
  shopPropIds,
  trayPropIds,
  zoneFor,
} from './logic.ts'

const cozy = THEMES.cozy

function placement(overrides: Partial<Placement> = {}): Placement {
  return { id: 'pl-1', kind: 'prop', ref: 'shelf', zone: 'wall', x: 4, ...overrides }
}

test('clampX keeps a prop fully inside its zone', () => {
  assert.equal(clampX(cozy, 'shelf', 'wall', 0), 2.0 + 1.4 / 2)
  assert.equal(clampX(cozy, 'shelf', 'wall', 99), 13.4 - 1.4 / 2)
  assert.equal(clampX(cozy, 'shelf', 'wall', 5), 5)
  assert.equal(clampX(cozy, 'carpet', 'floor', -10), 1.9 + 2.4 / 2)
  assert.equal(clampX(cozy, 'carpet', 'floor', 99), 13.6 - 2.4 / 2)
})

test('clampX leaves unknown props and zones alone', () => {
  assert.equal(clampX(cozy, 'throne', 'floor', 4), 4)
  assert.equal(clampX(cozy, 'shelf', 'ceiling', 4), 4)
})

test('clampX centres a prop wider than the zone', () => {
  const theme = {
    ...cozy,
    props: { ...cozy.props, huge: { zones: ['floor'], width: 40 } },
  }
  assert.equal(clampX(theme, 'huge', 'floor', 3), (1.9 + 13.6) / 2)
})

test('zoneFor chooses the first allowed zone unless another is preferred', () => {
  assert.equal(zoneFor(cozy, 'shelf'), 'wall')
  assert.equal(zoneFor(cozy, 'carpet'), 'floor')
  assert.equal(zoneFor(cozy, 'shelf', 'floor'), 'wall')
  assert.equal(zoneFor(cozy, 'shelf', 'wall'), 'wall')
  assert.equal(zoneFor(cozy, 'throne'), null)
})

test('newPlacementId makes 12 alphanumeric characters', () => {
  assert.equal(newPlacementId(() => 0), 'AAAAAAAAAAAA')
  assert.equal(newPlacementId(() => 0.999999), '999999999999')
  const id = newPlacementId()
  assert.match(id, /^[A-Za-z0-9]{12}$/)
})

test('trayPropIds shows owned props that are not placed, once', () => {
  const items = [
    'prop:shelf',
    'prop:carpet',
    'prop:cat',
    'costume:kiki',
    'prop:cat',
    'prop:fish-koi',
  ]
  const placements = [placement({ ref: 'shelf', zone: 'wall' }), placement({ id: 'pl-2', ref: 'fish-koi', zone: 'floor' })]
  assert.deepEqual(trayPropIds(items, placements), ['carpet', 'cat'])
})

test('shopPropIds lists buyable props the member does not own', () => {
  const shop = shopPropIds(['prop:shelf', 'prop:cat'])
  assert.ok(!shop.includes('shelf'))
  assert.ok(!shop.includes('cat'))
  assert.ok(shop.includes('mirror'))
  assert.ok(!shop.includes('fish-koi'))
})

test('paintingOrder sorts paintings by x and ignores other kinds', () => {
  const placements = [
    placement({ id: 'b', kind: 'painting', ref: 'piece-b', zone: 'wall', x: 20 }),
    placement({ id: 'a', kind: 'painting', ref: 'piece-a', zone: 'wall', x: 10 }),
    placement({ id: 'p', kind: 'prop', ref: 'shelf', zone: 'wall', x: 5 }),
  ]
  assert.deepEqual(paintingOrder(placements), ['piece-a', 'piece-b'])
})

test('currentHallOrder falls back to published only when the draft is empty', () => {
  const draft = [placement({ kind: 'painting', ref: 'draft-piece', zone: 'wall', x: 0 })]
  const published = [placement({ kind: 'painting', ref: 'old-piece', zone: 'wall', x: 0 })]
  assert.deepEqual(currentHallOrder(draft, published), ['draft-piece'])
  assert.deepEqual(currentHallOrder([], published), ['old-piece'])
})

test('hallPlacements builds stable painting placements at index * 10', () => {
  const order = ['11111111-2222-3333-4444-555555555555', 'abcdefab-cdef-abcd-efab-cdefabcdefab']
  assert.deepEqual(hallPlacements(order), [
    {
      id: 'p-111111112222',
      kind: 'painting',
      ref: '11111111-2222-3333-4444-555555555555',
      zone: 'wall',
      x: 0,
    },
    {
      id: 'p-abcdefabcdef',
      kind: 'painting',
      ref: 'abcdefab-cdef-abcd-efab-cdefabcdefab',
      zone: 'wall',
      x: 10,
    },
  ])
})

test('samePlacements compares the full arrangement in order', () => {
  const a = [placement(), placement({ id: 'pl-2', ref: 'carpet', zone: 'floor', x: 8 })]
  assert.equal(samePlacements(a, a.map((item) => ({ ...item }))), true)
  assert.equal(samePlacements(a, [a[1], a[0]]), false)
  assert.equal(samePlacements(a, [a[0]]), false)
  assert.equal(samePlacements(a, [a[0], { ...a[1], x: 9 }]), false)
})

test('reasonLabel and propLabel give readable text', () => {
  assert.match(reasonLabel('out_of_bounds'), /fit/)
  assert.match(reasonLabel('not_owned'), /own/)
  assert.equal(reasonLabel('nonsense'), 'That could not be saved.')
  assert.equal(propLabel('fish-golden-koi'), 'Golden koi trophy')
  assert.equal(propLabel('some-new-prop'), 'some new prop')
})
