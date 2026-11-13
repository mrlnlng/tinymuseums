import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ATELIER_END_X, ATELIER_ROOMS, COLLECTIONS, ROOM_TEMPLATE as T, SWAG_STEP } from './atelier-layout.ts'
import { CONFIG } from './config.ts'

const collections = ATELIER_ROOMS.slice(1)

test('the fashion rooms tile the area wall to wall, entrance first', () => {
  assert.equal(ATELIER_ROOMS[0].key, 'entrance')
  for (let i = 1; i < ATELIER_ROOMS.length; i++) {
    assert.equal(ATELIER_ROOMS[i].startX, ATELIER_ROOMS[i - 1].endX)
  }
  assert.deepEqual(collections.map((room) => room.key), COLLECTIONS.map((c) => c.key))
})

test('every room has the whole template: two paintings, a portrait, a column and its forms', () => {
  for (const { collection } of collections) {
    assert.ok(collection!.left.painting && collection!.right.painting, collection!.key)
    assert.ok(collection!.portrait.image, collection!.key)
    assert.notEqual(collection!.pillar.pieces.length > 0, Boolean(collection!.pillar.fishBag), collection!.key)
    assert.ok(collection!.forms.length >= 1, collection!.key)
  }
})

test('the template stays inside each room', () => {
  for (const room of collections) {
    const C = room.centerX!
    const out = room.spread
    const left = C + T.leftFrame.dx - out - T.leftFrame.width / 2
    const right = C + T.pillar.dx + out + 105
    assert.ok(left >= room.startX && right <= room.endX, room.key)
    assert.equal(room.endX - room.startX, 2 * SWAG_STEP + 2 * out, room.key)
  }
})

test('the rooms hang swags at the curtain spacing', () => {
  assert.equal(CONFIG.atelier.curtainSwags.width - CONFIG.atelier.curtainSwags.overlap, SWAG_STEP)
})

test('a two-form room keeps the template gaps between its forms and walls', () => {
  assert.equal(T.pair.formDx - T.pair.spread, 10)
})

test('the camera stops inside the last room', () => {
  const last = ATELIER_ROOMS[ATELIER_ROOMS.length - 1]
  assert.ok(ATELIER_END_X > last.centerX! && ATELIER_END_X <= last.endX)
})

test('the wardrobe stands at the end of the entrance, clear of its props and the first room', () => {
  const { wardrobe, portraitWink } = CONFIG.atelier
  const left = wardrobe.x - wardrobe.width / 2
  const right = wardrobe.x + wardrobe.width / 2
  assert.ok(left > portraitWink.x + portraitWink.width / 2)
  assert.ok(right < ATELIER_ROOMS[1].startX && right > ATELIER_ROOMS[1].startX - 100)
  assert.ok(wardrobe.rail.left < wardrobe.rail.right && wardrobe.hanger.slots <= wardrobe.hanger.max)
})
