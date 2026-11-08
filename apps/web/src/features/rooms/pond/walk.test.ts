import assert from 'node:assert/strict'
import { test } from 'node:test'
import { contains } from '../floor.ts'
import { MAX_DEPTH, Walker, pondFloor, toFloor } from './walk.ts'

const WIDTH = (8 * 2388) / 1668
const area = pondFloor(WIDTH, -6.5, WIDTH + 2.6, -4.35)

test('the grass is walkable from the bank to the treeline, but not the pond', () => {
  assert.ok(contains(area, toFloor(-3, 0.5)))
  assert.ok(contains(area, toFloor(12, MAX_DEPTH - 0.01)))
  assert.ok(contains(area, toFloor(WIDTH / 2, 0)))
  assert.ok(!contains(area, toFloor(WIDTH / 2, 0.5)))
  assert.ok(!contains(area, toFloor(0, MAX_DEPTH + 0.05)))
  assert.ok(!contains(area, toFloor(-5.6, 0.4)))
  assert.ok(contains(area, toFloor(-5.6, 0)))
})

test('walks round the near shore to cross the pond', () => {
  const walker = new Walker(area, 1, 0.6)
  walker.walkTo(10, 0.6)
  let seconds = 0
  let shallowest = 1
  while (walker.walking && seconds < 30) {
    walker.step(1 / 60, 2.4)
    if (walker.x > 4 && walker.x < 7) shallowest = Math.min(shallowest, walker.depth)
    seconds += 1 / 60
  }
  assert.ok(!walker.walking)
  assert.ok(Math.abs(walker.x - 10) < 1e-6 && Math.abs(walker.depth - 0.6) < 1e-6)
  assert.ok(shallowest < 0.1)
})

test('keys steer into the picture and stop at the treeline', () => {
  const walker = new Walker(area, -3, 0)
  for (let i = 0; i < 240; i++) walker.steer(1 / 60, 0, 1, 3)
  assert.ok(Math.abs(walker.depth - MAX_DEPTH) < 1e-3)
  assert.ok(Math.abs(walker.x + 3) < 1e-6)
})

test('a tap in the water walks to the shore instead', () => {
  const walker = new Walker(area, 0, 0)
  walker.walkTo(WIDTH / 2, 0.5)
  const end = walker.route[walker.route.length - 1]
  assert.ok(contains(area, end))
})

test('strides with the walk, facing the way it goes', () => {
  const walker = new Walker(area, -3, 0.3)
  walker.steer(1 / 60, -1, 0, 3)
  assert.ok(walker.stride < 0)
  walker.steer(1 / 60, 0, 1, 3)
  assert.ok(walker.stride < 0)
})
