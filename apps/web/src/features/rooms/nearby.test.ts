import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createNearby, type RoomSpan } from './nearby.ts'

const strip: RoomSpan[] = ['a', 'b', 'c', 'd', 'e'].map((key, i) => ({ key, startX: i * 20, endX: (i + 1) * 20 }))

// A 4-unit view: rooms are built within 2 + 4 = 6 units of the camera and removed past 2 + 8 = 10.
const reach = { loadScreens: 1, unloadScreens: 2 }
const VIEW = 4

test('builds only the room under the camera when the others are far', () => {
  const stream = createNearby(reach)
  stream.update(strip, 30, VIEW)
  assert.deepEqual(stream.loaded(), ['b'])
})

test('the next room is built a screen before the camera reaches it', () => {
  const stream = createNearby(reach)
  stream.update(strip, 33, VIEW)
  assert.equal(stream.isLoaded('c'), false)
  stream.update(strip, 35, VIEW)
  assert.deepEqual([...stream.loaded()].sort(), ['b', 'c'])
})

test('a built room stays until it is past the remove distance', () => {
  const stream = createNearby(reach)
  stream.update(strip, 35, VIEW)
  stream.update(strip, 50, VIEW)
  assert.deepEqual([...stream.loaded()].sort(), ['b', 'c'])
  stream.update(strip, 51, VIEW)
  assert.deepEqual(stream.loaded(), ['c'])
  stream.update(strip, 49, VIEW)
  assert.equal(stream.isLoaded('b'), false, 'coming back inside the remove distance does not rebuild it')
})

test('update reports whether the near set changed', () => {
  const stream = createNearby(reach)
  assert.equal(stream.update(strip, 10, VIEW), true)
  assert.equal(stream.update(strip, 10.1, VIEW), false)
})

test('covers answers for points by the room that holds them', () => {
  const stream = createNearby(reach)
  stream.update(strip, 10, VIEW)
  assert.equal(stream.covers(19.9), true)
  assert.equal(stream.covers(20), false)
  assert.equal(stream.covers(-3), true, 'points before the first room belong to it')
  stream.update(strip, 90, VIEW)
  assert.equal(stream.covers(150), true, 'points past the last room belong to it')
})

test('rooms removed from the list are dropped', () => {
  const stream = createNearby(reach)
  stream.update(strip, 30, VIEW)
  stream.update(strip.filter((s) => s.key !== 'b'), 30, VIEW)
  assert.equal(stream.isLoaded('b'), false)
})
