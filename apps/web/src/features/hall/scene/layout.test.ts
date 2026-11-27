import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CONFIG } from './config.ts'
import { computeLayout, type HallLayout } from './layout.ts'

const paintings = (n: number) => Array.from({ length: n }, () => 2.63)

function roomAt(layout: HallLayout, x: number) {
  return layout.rooms.find((s) => x >= s.startX && x < s.endX)
}

test('rooms tile the hall end to end, starting at the entrance', () => {
  for (const layout of [computeLayout(paintings(5), true), computeLayout(paintings(25), false), computeLayout(paintings(40), true)]) {
    assert.equal(layout.rooms[0].kind, 'entrance')
    assert.equal(layout.rooms[0].startX, CONFIG.lobby.minX)
    for (let i = 1; i < layout.rooms.length; i++) {
      assert.equal(layout.rooms[i].startX, layout.rooms[i - 1].endX)
      assert.ok(layout.rooms[i].endX > layout.rooms[i].startX)
    }
  }
})

test('gallery rooms stay within the size limit', () => {
  const layout = computeLayout(paintings(40), true)
  for (const room of layout.rooms.filter((s) => s.kind === 'gallery')) {
    assert.ok(room.endX - room.startX <= CONFIG.galleryRoom.maxWidth + CONFIG.piece.gap, room.key)
  }
})

test('every painting, pedestal and landmark falls inside a room of the right kind', () => {
  const layout = computeLayout(paintings(25), true)
  for (const x of [...layout.centerX, ...layout.pedestalX]) {
    assert.equal(roomAt(layout, x)?.kind, 'gallery', `x ${x}`)
  }
  assert.equal(layout.comingSoonX, null)
  assert.equal(roomAt(layout, layout.cafeX!)?.kind, 'cafe')
  assert.equal(roomAt(layout, layout.guestBoardX!)?.kind, 'cafe')
  assert.equal(roomAt(layout, layout.giftShopX! - 0.01)?.kind, 'giftShop')
  assert.equal(roomAt(layout, CONFIG.lobby.startX)?.kind, 'entrance')
})

test('a small hall puts the cafe and gift shop after its last gallery', () => {
  const kinds = computeLayout(paintings(5), true).rooms.map((s) => s.kind)
  assert.deepEqual(kinds, ['entrance', 'gallery', 'gallery', 'cafe', 'giftShop'])
})

test('keys of earlier rooms stay the same as more paintings arrive', () => {
  const early = computeLayout(paintings(12)).rooms
  const later = computeLayout(paintings(24)).rooms
  const sealed = early.slice(0, -1)
  assert.deepEqual(
    sealed.map((s) => [s.key, s.startX, s.endX]),
    later.slice(0, sealed.length).map((s) => [s.key, s.startX, s.endX]),
  )
  assert.equal(later[sealed.length].key, early[early.length - 1].key)
})

test('paintings, the cafe and the gift shop step round the doors in the hall', () => {
  const doors = [{ x: 12, width: 1.96 }, { x: 40, width: 2.6 }]
  const layout = computeLayout(paintings(25), true, doors)
  const half = 2.63 / 2
  for (const x of layout.centerX) {
    for (const door of doors) assert.ok(Math.abs(x - door.x) >= half + door.width / 2, `painting at ${x} overlaps the door at ${door.x}`)
  }
  for (const x of layout.pedestalX) for (const door of doors) assert.ok(Math.abs(x - door.x) > door.width / 2)
  // Without doors the same hall is shorter: the doors made room for themselves.
  assert.ok(layout.totalLength > computeLayout(paintings(25), true).totalLength)
  // A door far past the paintings known so far still has floor under it.
  assert.ok(computeLayout(paintings(3), false, [{ x: 90, width: 2 }]).totalLength > 91)
})

test('a door under a painting moves nothing along and lifts only the painting above it', () => {
  const plain = computeLayout(paintings(6), true)
  const third = plain.centerX[2]
  const under = computeLayout(paintings(6), true, [{ x: third, width: 0.6, top: 0.6 }])
  assert.deepEqual(under.centerX, plain.centerX)
  assert.ok(under.lift[2] > 0.1)
  assert.deepEqual(under.lift.filter((_, i) => i !== 2), [0, 0, 0, 0, 0])
  assert.deepEqual(plain.lift, [0, 0, 0, 0, 0, 0])
})
