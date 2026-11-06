import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { FloorPoint, WalkArea } from './floor.ts'
import {
  contains,
  depthAtY,
  depthBounds,
  feetY,
  findPath,
  nearestInside,
  scaleAt,
  slide,
} from './floor.ts'

function rectangle(minX: number, maxX: number, minD: number, maxD: number): FloorPoint[] {
  return [
    { x: minX, d: minD },
    { x: maxX, d: minD },
    { x: maxX, d: maxD },
    { x: minX, d: maxD },
  ]
}

const AREA: WalkArea = {
  outline: rectangle(0, 10, 0, 10),
  holes: [rectangle(3, 7, 3, 7)],
}

function cross(a: FloorPoint, b: FloorPoint, c: FloorPoint): number {
  return (b.x - a.x) * (c.d - a.d) - (b.d - a.d) * (c.x - a.x)
}

function properCrossing(a: FloorPoint, b: FloorPoint, c: FloorPoint, d: FloorPoint): boolean {
  const o1 = cross(a, b, c)
  const o2 = cross(a, b, d)
  const o3 = cross(c, d, a)
  const o4 = cross(c, d, b)
  if ([o1, o2, o3, o4].some((value) => Math.abs(value) <= 1e-12)) return false
  return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0)
}

function hasLineOfSight(area: WalkArea, a: FloorPoint, b: FloorPoint): boolean {
  if (!contains(area, { x: (a.x + b.x) / 2, d: (a.d + b.d) / 2 })) return false
  for (const poly of [area.outline, ...(area.holes ?? [])]) {
    for (let i = 0; i < poly.length; i++) {
      if (properCrossing(a, b, poly[i], poly[(i + 1) % poly.length])) return false
    }
  }
  return true
}

function pathLength(points: FloorPoint[], from: FloorPoint): number {
  let total = 0
  let previous = from
  for (const point of points) {
    total += Math.hypot(point.x - previous.x, point.d - previous.d)
    previous = point
  }
  return total
}

test('contains accepts the outline, rejects hole interiors, and counts edges', () => {
  assert.equal(contains(AREA, { x: 1, d: 1 }), true)
  assert.equal(contains(AREA, { x: 5, d: 5 }), false)
  assert.equal(contains(AREA, { x: 3, d: 5 }), true)
  assert.equal(contains(AREA, { x: 5, d: 3 }), true)
  assert.equal(contains(AREA, { x: 3, d: 3 }), true)
  assert.equal(contains(AREA, { x: 10, d: 5 }), true)
  assert.equal(contains(AREA, { x: 0, d: 0 }), true)
  assert.equal(contains(AREA, { x: 11, d: 5 }), false)
  assert.equal(contains(AREA, { x: -1, d: 5 }), false)
  assert.equal(contains(AREA, { x: 5, d: 11 }), false)

  const reversed: WalkArea = {
    outline: [...AREA.outline].reverse(),
    holes: (AREA.holes ?? []).map((hole) => [...hole].reverse()),
  }
  assert.equal(contains(reversed, { x: 1, d: 1 }), true)
  assert.equal(contains(reversed, { x: 5, d: 5 }), false)
  assert.equal(contains(reversed, { x: 10, d: 5 }), true)
})

test('nearestInside projects an outside point onto the outline', () => {
  const from = { x: -2, d: 5 }
  const point = nearestInside(AREA, from)
  assert.ok(contains(AREA, point))
  assert.ok(point.x > 0 && point.x < 1e-3)
  assert.ok(Math.abs(point.d - 5) < 1e-9)
  assert.ok(Math.hypot(point.x - from.x, point.d - from.d) <= 2 + 2e-4)
})

test('nearestInside leaves a hole through its nearest edge', () => {
  const point = nearestInside(AREA, { x: 5, d: 5 })
  assert.ok(contains(AREA, point))
  assert.ok(!(point.x > 3 && point.x < 7 && point.d > 3 && point.d < 7))
  assert.ok(Math.abs(point.d - 3) <= 1.1e-4)
  assert.ok(Math.abs(point.x - 5) < 1e-9)
})

test('slide moves freely when the whole step stays walkable', () => {
  const from = { x: 1, d: 1 }
  const to = { x: 2, d: 2 }
  assert.deepEqual(slide(AREA, from, to), to)
})

test('slide stops at a wall instead of crossing it', () => {
  const from = { x: 9, d: 5 }
  const to = { x: 12, d: 5 }
  const point = slide(AREA, from, to)
  assert.ok(contains(AREA, point))
  assert.ok(point.x < 10 && point.x > 10 - 1.1e-4)
  assert.ok(Math.abs(point.d - 5) < 1e-9)
  assert.ok(Math.hypot(point.x - from.x, point.d - from.d) <= 3 + 1e-9)
})

test('slide projects diagonal motion along a wall', () => {
  const from = { x: 8, d: 5 }
  const to = { x: 12, d: 9 }
  const point = slide(AREA, from, to)
  assert.ok(contains(AREA, point))
  assert.ok(point.x < 10 && point.x > 10 - 2e-4)
  assert.ok(Math.abs(point.d - 9) <= 2e-4)
  assert.ok(Math.hypot(point.x - from.x, point.d - from.d) <= Math.hypot(4, 4) + 1e-9)
})

test('slide projects motion along a hole edge', () => {
  const from = { x: 4, d: 2 }
  const to = { x: 6, d: 4 }
  const point = slide(AREA, from, to)
  assert.ok(contains(AREA, point))
  assert.ok(point.d < 3 && point.d > 3 - 2e-4)
  assert.ok(point.x > 5 && point.x < 7)
  assert.ok(Math.hypot(point.x - from.x, point.d - from.d) <= Math.hypot(2, 2) + 1e-9)
})

test('slide never leaves the area or overshoots across 200 random steps', () => {
  let seed = 0x12345678
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return seed / 0x100000000
  }
  let from: FloorPoint = { x: 1, d: 1 }
  for (let step = 0; step < 200; step++) {
    const to: FloorPoint = { x: -2 + random() * 14, d: -2 + random() * 14 }
    const point = slide(AREA, from, to)
    assert.ok(Number.isFinite(point.x) && Number.isFinite(point.d), `step ${step}`)
    assert.ok(contains(AREA, point), `step ${step} left the area at ${point.x},${point.d}`)
    assert.ok(
      Math.hypot(point.x - from.x, point.d - from.d) <= Math.hypot(to.x - from.x, to.d - from.d) + 1e-9,
      `step ${step} moved too far`,
    )
    from = point
  }
})

test('findPath returns the goal directly when the way is clear', () => {
  const plain: WalkArea = { outline: rectangle(0, 10, 0, 10) }
  const goal = { x: 8, d: 8 }
  assert.deepEqual(findPath(plain, { x: 1, d: 1 }, goal), [goal])
})

test('findPath walks around a hole with visible segments and a longer route', () => {
  const from = { x: 1, d: 5 }
  const goal = { x: 9, d: 5 }
  const path = findPath(AREA, from, goal)
  assert.ok(path.length >= 2)
  assert.deepEqual(path[path.length - 1], goal)
  assert.ok(pathLength(path, from) > 8)
  let previous = from
  for (const point of path) {
    assert.ok(contains(AREA, point))
    assert.ok(hasLineOfSight(AREA, previous, point))
    previous = point
  }
})

test('findPath ends at the nearest walkable point for a goal inside a hole', () => {
  const from = { x: 1, d: 5 }
  const goal = nearestInside(AREA, { x: 5, d: 5 })
  const path = findPath(AREA, from, { x: 5, d: 5 })
  assert.ok(path.length > 0)
  assert.deepEqual(path[path.length - 1], goal)
  assert.ok(contains(AREA, goal))
  assert.ok(!(goal.x > 3 && goal.x < 7 && goal.d > 3 && goal.d < 7))
})

test('findPath returns no route for a degenerate area', () => {
  assert.deepEqual(findPath({ outline: [] }, { x: 0, d: 0 }, { x: 1, d: 1 }), [])
  assert.deepEqual(
    findPath({ outline: [{ x: 0, d: 0 }, { x: 1, d: 0 }] }, { x: 0, d: 0 }, { x: 1, d: 1 }),
    [],
  )
})

test('depthBounds covers the outline only', () => {
  const area: WalkArea = {
    outline: rectangle(-3, 4, 1, 9),
    holes: [rectangle(-100, 100, -100, 100)],
  }
  assert.deepEqual(depthBounds(area), { minX: -3, maxX: 4, minD: 1, maxD: 9 })
})

test('depth projection round-trips and clamps at both ends', () => {
  const view = { depth: 10, nearY: 2, farY: 12, farScale: 0.5 }
  assert.equal(feetY(view, 0), 2)
  assert.equal(feetY(view, 10), 12)
  assert.equal(feetY(view, 5), 7)
  assert.equal(feetY(view, -4), 2)
  assert.equal(feetY(view, 14), 12)

  assert.equal(scaleAt(view, 0), 1)
  assert.equal(scaleAt(view, 10), 0.5)
  assert.equal(scaleAt(view, 5), 0.75)
  assert.equal(scaleAt(view, -4), 1)
  assert.equal(scaleAt(view, 14), 0.5)

  assert.equal(depthAtY(view, 2), 0)
  assert.equal(depthAtY(view, 12), 10)
  assert.equal(depthAtY(view, 7), 5)
  assert.equal(depthAtY(view, 0), 0)
  assert.equal(depthAtY(view, 20), 10)

  for (const d of [0, 0.25, 2.5, 5, 9.75, 10]) {
    assert.ok(Math.abs(depthAtY(view, feetY(view, d)) - d) < 1e-9)
  }
})
