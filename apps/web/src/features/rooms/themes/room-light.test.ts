import assert from 'node:assert/strict'
import { test } from 'node:test'
import { type RoomLight, darknessAt } from './room-light.ts'

const dirty: RoomLight = {
  gloom: 0.86,
  suns: [{ x: 4.2, y: 1.6, width: 1.05, height: 1.3 }],
  lamps: [{ x: 3.3, y: 2.5 }],
}

test('the dark is deepest in the corners and side walls, lightest by the window', () => {
  const byWindow = darknessAt(dirty, 6, 4.4, 1.5)
  const farCorner = darknessAt(dirty, 6, 0.2, 4)
  const sideWall = darknessAt(dirty, 6, -2, 2)
  assert.ok(byWindow < 0.3)
  assert.ok(farCorner > byWindow + 0.3)
  assert.ok(sideWall > farCorner)
})

test('no part of the room is lost to the dark, even far from the window', () => {
  for (let x = 0.5; x <= 5.5; x += 0.5) assert.ok(darknessAt(dirty, 6, x, 1) < 0.65, `x ${x}`)
})

test('a clean room keeps only soft shading', () => {
  const clean = { ...dirty, gloom: 0 }
  for (let x = 0.5; x <= 5.5; x += 0.5) assert.ok(darknessAt(clean, 6, x, 1) < 0.15, `x ${x}`)
  assert.ok(darknessAt(clean, 6, 3, 1) < darknessAt(dirty, 6, 3, 1))
})

test('the ceiling is darker than the wall under it', () => {
  assert.ok(darknessAt(dirty, 6, 3, 4.8) > darknessAt(dirty, 6, 3, 4))
})
