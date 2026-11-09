import assert from 'node:assert/strict'
import { test } from 'node:test'
import { boundedCameraX } from './camera-bounds.ts'

test('the visible edges stop at the room ends on narrow and wide screens', () => {
  for (const width of [3.6, 6.4, 12.8]) {
    const left = -6.725
    const right = 13.5
    assert.equal(boundedCameraX(-100, width, left, right) - width / 2, left)
    assert.equal(boundedCameraX(100, width, left, right) + width / 2, right)
    assert.equal(boundedCameraX(3, width, left, right), 3)
  }
})

test('a resize contains an old camera position and a short room stays centred', () => {
  const before = boundedCameraX(100, 3.6, -4.3, 20)
  const after = boundedCameraX(before, 12.8, -4.3, 20)
  assert.equal(after + 6.4, 20)
  assert.equal(boundedCameraX(-100, 12.8, -2, 2), 0)
  assert.equal(boundedCameraX(100, 12.8, -2, 2), 0)
})
