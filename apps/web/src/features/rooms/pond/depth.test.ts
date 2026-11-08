import assert from 'node:assert/strict'
import { test } from 'node:test'
import { FAR_LIFT, FAR_SCALE, depthAtLift, liftAt, pathHalfWidth, pathX, scaleAt } from './depth.ts'
import { POND_LANDMARKS } from './landmarks.ts'

const close = (actual: number | null, expected: number) => assert.ok(actual !== null && Math.abs(actual - expected) < 1e-6, `${actual} ≈ ${expected}`)

const path = { foot: 2, end: 1, sway: 0.2, width: 1 }

test('stands on the bank at depth 0 and at the treeline at depth 1', () => {
  assert.equal(scaleAt(0), 1)
  assert.equal(liftAt(0), 0)
  close(scaleAt(1), FAR_SCALE)
  close(liftAt(1), FAR_LIFT)
})

test('shrinks and rises steadily, slowing toward the trees', () => {
  assert.ok(liftAt(0.5) - liftAt(0) > liftAt(1) - liftAt(0.5))
  assert.ok(scaleAt(0.5) < 1)
  assert.ok(scaleAt(0.5) > FAR_SCALE)
})

test('turns a height on screen back into a depth', () => {
  for (const d of [0, 0.25, 0.6, 1]) close(depthAtLift(liftAt(d)), d)
})

test('runs from the foot on the bank to the end at the treeline', () => {
  assert.equal(pathX(path, 0), 2)
  close(pathX(path, 1), 1)
  close(pathHalfWidth(path, 1), 0.5 * FAR_SCALE)
})

test('leads every path into its prop and stands the visitor clear beside it', () => {
  for (const landmark of POND_LANDMARKS) {
    if (landmark.kind === 'exit') {
      assert.equal(landmark.depth, 0)
      continue
    }
    assert.ok(landmark.path && landmark.standX !== undefined)
    close(pathX(landmark.path, 1), landmark.x)
    const half = (landmark.width * scaleAt(landmark.depth)) / 2
    assert.ok(Math.abs(landmark.standX - landmark.x) > half)
  }
})
