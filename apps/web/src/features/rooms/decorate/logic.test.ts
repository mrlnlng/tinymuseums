import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { Placement } from '@tiny/core'
import { THEMES } from '../../../../../../packages/core/src/rooms/themes.ts'
import {
  categoryOf,
  clampX,
  clampY,
  finishLabel,
  finishOf,
  moveWithRiders,
  putAwayWithRiders,
  restAt,
  restInView,
  shopFinishIds,
  surfacesIn,
  withFinish,
  withoutRejected,
  cozyLevel,
  freeX,
  zoneAt,
  currentHallOrder,
  hallPlacements,
  newPlacementId,
  paintingOrder,
  propLabel,
  cozyWorth,
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
  assert.equal(clampX(cozy, 'shelf', 'wall', 0), 1)
  assert.equal(clampX(cozy, 'shelf', 'wall', 99), 19)
  assert.equal(clampX(cozy, 'shelf', 'wall', 5), 5)
  assert.equal(clampX(cozy, 'carpet', 'floor', -10), 1.5)
  assert.equal(clampX(cozy, 'carpet', 'floor', 99), 18.5)
  // Floating-point sums at a zone edge are rounded away; the server once refused 3.0999999999999996.
  assert.equal(clampX(cozy, 'chair', 'floor', -10), 0.69)
  assert.equal(clampX(cozy, 'shelf', 'wall', 5.123456), 5.123)
})

test('a refused placement goes back to how it was saved, or away if it is new', () => {
  const saved = [
    { id: 'a', kind: 'prop' as const, ref: 'shelf', zone: 'wall', x: 4 },
    { id: 'b', kind: 'prop' as const, ref: 'cat', zone: 'floor', x: 9 },
  ]
  const draft = [{ ...saved[0], x: 6 }, { ...saved[1], x: 11 }, { id: 'c', kind: 'prop' as const, ref: 'broom', zone: 'floor', x: 5 }]
  assert.deepEqual(withoutRejected(draft, saved, 'a'), [saved[0], draft[1], draft[2]])
  assert.deepEqual(withoutRejected(draft, saved, 'c'), [draft[0], draft[1]])
  assert.deepEqual(withoutRejected(draft, saved, null), saved)
})

test('clampX leaves unknown props and zones alone', () => {
  assert.equal(clampX(cozy, 'throne', 'floor', 4), 4)
  assert.equal(clampX(cozy, 'shelf', 'ceiling', 4), 4)
})

test('clampX centres a prop wider than the zone', () => {
  const theme = {
    ...cozy,
    props: { ...cozy.props, huge: { zones: ['floor'], width: 40, height: 1 } },
  }
  assert.equal(clampX(theme, 'huge', 'floor', 3), (cozy.zones.floor.minX + cozy.zones.floor.maxX) / 2)
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
  assert.equal(propLabel('fish-star-snapper'), 'Star snapper trophy')
  assert.equal(propLabel('fish-crab'), 'Crab trophy')
  assert.equal(propLabel('fish-puffer'), 'Pufferfish trophy')
  assert.equal(propLabel('fish-blobfish'), 'Sir Blobfish trophy')
  assert.equal(propLabel('some-new-prop'), 'some new prop')
})

test('the blobfish is the rare pond trophy; the other pond fish are ordinary', () => {
  assert.equal(cozyWorth('fish-golden-koi'), 8)
  assert.equal(cozyWorth('fish-blobfish'), 8)
  for (const ref of ['fish-star-snapper', 'fish-crab', 'fish-puffer', 'fish-koi']) {
    assert.equal(cozyWorth(ref), 4)
  }
})

test('old and new fish trophies all hang on the wall or lean on the floor', () => {
  const refs = [
    'fish-minnow',
    'fish-perch',
    'fish-carp',
    'fish-koi',
    'fish-golden-koi',
    'fish-star-snapper',
    'fish-crab',
    'fish-puffer',
    'fish-blobfish',
  ]
  for (const ref of refs) assert.deepEqual(THEMES.cozy.props[ref]?.zones, ['wall', 'floor'])
})

test('cozy level climbs as things are placed, and trophies count for more', () => {
  const place = (ref: string, i: number): Placement => ({ id: `cozy-${i}`, kind: 'prop', ref, zone: 'floor', x: 4 })
  assert.equal(cozyLevel([]).name, 'Bare')
  assert.equal(cozyLevel([]).hearts, 0)
  const starters = ['shelf', 'carpet', 'pillow-red'].map(place)
  assert.equal(cozyLevel(starters).score, 8)
  assert.equal(cozyLevel(starters).name, 'Snug')
  assert.equal(cozyLevel([...starters, place('fish-golden-koi', 9)]).name, 'Cozy')
  const top = cozyLevel(Array.from({ length: 20 }, (_, i) => place('cabinet', i)))
  assert.equal(top.name, 'Legendary')
  assert.equal(top.progress, 1)
  assert.equal(top.next, null)
})

test('drawer categories follow the prop zones', () => {
  assert.equal(categoryOf('mirror'), 'wall')
  assert.equal(categoryOf('cabinet'), 'furniture')
  assert.equal(categoryOf('window'), 'wall')
  assert.equal(categoryOf('mug'), 'small')
  assert.equal(categoryOf('pillow-red'), 'small')
  assert.equal(categoryOf('fish-koi'), 'fish')
})

test('a flip makes two arrangements differ', () => {
  const a: Placement = { id: 'flip-a', kind: 'prop', ref: 'mirror', zone: 'wall', x: 3 }
  assert.equal(samePlacements([a], [{ ...a }]), true)
  assert.equal(samePlacements([a], [{ ...a, flip: true }]), false)
})

test('freeX finds the nearest gap beside things already there', () => {
  const cozy = THEMES.cozy
  const pillow: Placement = { id: 'free-1', kind: 'prop', ref: 'pillow-red', zone: 'floor', x: 6 }
  assert.equal(freeX(cozy, 'pillow-blue', 'floor', [], 6), 6)
  const x = freeX(cozy, 'pillow-blue', 'floor', [pillow], 6)
  assert.ok(Math.abs(x - 6) >= 0.8 + 0.05 - 1e-9)
  assert.ok(Math.abs(x - 6) < 1.1)
  for (const [ref, prop] of Object.entries(cozy.props)) {
    if (!prop.floorCovering) continue
    const carpet: Placement = { id: 'free-2', kind: 'prop', ref, zone: 'floor', x: 6 }
    assert.equal(freeX(cozy, 'pillow-blue', 'floor', [carpet], 6), 6, ref)
    assert.equal(freeX(cozy, ref, 'floor', [pillow], 6), 6, ref)
  }
})

test('a trophy goes on the wall when held high and the floor when held low', () => {
  assert.equal(zoneAt(THEMES.cozy, 'fish-koi', 2), 'wall')
  assert.equal(zoneAt(THEMES.cozy, 'fish-koi', -0.4), 'floor')
  assert.equal(zoneAt(THEMES.cozy, 'cabinet', 3), 'floor')
})

const table: Placement = { id: 'table-1', kind: 'prop', ref: 'round-table', zone: 'floor', x: 5 }
const tableTop = Math.round((cozy.floorY + 0.86 * 0.93) * 1000) / 1000

test('a resting thing lands on the table under the pointer', () => {
  const rest = restAt('mug', 5.1, tableTop + 0.1, [table])
  assert.deepEqual(rest, { on: 'table-1', y: tableTop, x: 5.1 })
})

test('a resting thing held away from any surface finds none', () => {
  assert.equal(restAt('mug', 5.1, tableTop + 1.5, [table]), null)
  assert.equal(restAt('mug', 9, tableTop, [table]), null)
  assert.equal(restAt('chair', 5, tableTop, [table]), null)
})

test('a resting thing is kept inside the surface span', () => {
  const rest = restAt('mug', 5.49, tableTop, [table])
  const right = 5 - 1.38 / 2 + 0.86 * 1.38
  assert.ok(rest && Math.abs(rest.x - (right - 0.12)) < 0.002)
})

test('a cubby shelf only takes things short enough to fit', () => {
  const cubby: Placement = { id: 'cubby-1', kind: 'prop', ref: 'cubby', zone: 'floor', x: 3 }
  const shelfY = Math.round((cozy.floorY + 0.4 * 1.36) * 1000) / 1000
  assert.equal(restAt('mug', 3, shelfY + 0.05, [cubby])?.y, shelfY)
  assert.notEqual(restAt('tulip-vase', 3, shelfY + 0.1, [cubby])?.y, shelfY)
})

test('a flipped parent mirrors its surface spans', () => {
  const chair: Placement = { id: 'chair-1', kind: 'prop', ref: 'armchair', zone: 'floor', x: 5 }
  const [plain] = surfacesIn([chair])
  const [flipped] = surfacesIn([{ ...chair, flip: true }])
  assert.ok(Math.abs(plain.minX - 5 - (5 - flipped.maxX)) < 1e-9)
  assert.ok(Math.abs(plain.maxX - 5 - (5 - flipped.minX)) < 1e-9)
})

test('a thing never rests on itself', () => {
  assert.equal(surfacesIn([table], new Set(['table-1'])).length, 0)
})

test('tap to place finds a free spot on a surface in view', () => {
  const mug: Placement = { id: 'mug-1', kind: 'prop', ref: 'mug', zone: 'top', x: 5, y: tableTop, on: 'table-1' }
  const spot = restInView('tulip-vase', 2, 8, 5, [table, mug])
  assert.ok(spot)
  assert.equal(spot.on, 'table-1')
  assert.ok(Math.abs(spot.x - 5) >= 0.12 + 0.17 - 1e-9)
  assert.equal(restInView('tulip-vase', 10, 14, 12, [table]), null)
})

test('moving furniture carries what rests on it, and flipping mirrors it', () => {
  const mug: Placement = { id: 'mug-1', kind: 'prop', ref: 'mug', zone: 'top', x: 5.2, y: tableTop, on: 'table-1' }
  const moved = moveWithRiders([table, mug], { ...table, x: 7 })
  assert.equal(moved[1].x, 7.2)
  assert.equal(moved[1].y, tableTop)
  const flipped = moveWithRiders([table, mug], { ...table, flip: true })
  assert.equal(flipped[1].x, 4.8)
})

test('a wall shelf lifts what rests on it', () => {
  const shelf: Placement = { id: 'shelf-1', kind: 'prop', ref: 'wall-shelf', zone: 'wall', x: 6, y: 1.4 }
  const vase: Placement = { id: 'vase-1', kind: 'prop', ref: 'tulip-vase', zone: 'top', x: 6, y: 1.58, on: 'shelf-1' }
  const moved = moveWithRiders([shelf, vase], { ...shelf, y: 2 })
  assert.equal(moved[1].y, 2.18)
})

test('putting furniture away drops what rested on it to the floor', () => {
  const mug: Placement = { id: 'mug-1', kind: 'prop', ref: 'mug', zone: 'top', x: 5.2, y: tableTop, on: 'table-1' }
  assert.deepEqual(putAwayWithRiders([table, mug], 'table-1'), [{ id: 'mug-1', kind: 'prop', ref: 'mug', zone: 'floor', x: 5.2 }])
})

test('wall things stay on the wall', () => {
  assert.equal(clampY('window', -3), 0.25)
  assert.equal(clampY('window', 9), Math.round((3.8 - 1.84) * 1000) / 1000)
  assert.equal(clampY('window', 1.5), 1.5)
})

test('finishes: one per slot, the default when none is chosen', () => {
  assert.equal(finishOf([], 'wallpaper'), 'wallpaper-cream')
  const papered = withFinish(withFinish([], 'wallpaper', 'wallpaper-ornate'), 'wallpaper', 'wallpaper-pink-stripes')
  assert.equal(papered.length, 1)
  assert.equal(finishOf(papered, 'wallpaper'), 'wallpaper-pink-stripes')
  assert.equal(finishOf(papered, 'baseboard'), 'baseboard-tall')
  assert.equal(finishLabel('baseboard-short'), 'Skirting only')
})

test('the shop sells finishes the member lacks, never the free ones', () => {
  const shop = shopFinishIds(['finish:wallpaper-ornate'])
  assert.ok(shop.includes('wallpaper-pink-stripes'))
  assert.ok(!shop.includes('wallpaper-ornate'))
  assert.ok(!shop.includes('wallpaper-cream'))
})

test('a chosen wallpaper adds to coziness, the default does not', () => {
  assert.equal(cozyLevel(withFinish([], 'wallpaper', 'wallpaper-cream')).score, 0)
  assert.equal(cozyLevel(withFinish([], 'wallpaper', 'wallpaper-ornate')).score, 3)
})
