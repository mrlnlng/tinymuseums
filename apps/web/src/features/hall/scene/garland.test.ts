import assert from 'node:assert/strict'
import { test } from 'node:test'
import { garlandRibbon, sag } from './garland.ts'

const shape = { height: 0.72, loop: 5.85, dip: 0.54, aspect: 5.4, lengthsPerLoop: 2 }

test('the garland hangs from points on its line and sags between them', () => {
  assert.equal(sag(0, shape), -0)
  assert.ok(Math.abs(sag(shape.loop / 2, shape) + shape.dip) < 1e-9)
  assert.ok(Math.abs(sag(shape.loop * 3, shape)) < 1e-9)
})

test('bent along its loops, the garland keeps its thickness and repeats every loop', () => {
  const { positions, indices } = garlandRibbon(shape, 3)
  assert.ok(indices.length > 0)
  for (let v = 0; v < positions.length / 3; v += 2) {
    const thickness = Math.hypot(positions[(v + 1) * 3] - positions[v * 3], positions[(v + 1) * 3 + 1] - positions[v * 3 + 1])
    assert.ok(Math.abs(thickness - shape.height) < 1e-4)
  }
  // The third length lies one loop on from the first.
  const perLength = 41 * 2 * 3
  assert.ok(Math.abs(positions[2 * perLength] - positions[0] - shape.loop) < 1e-4)
  assert.ok(Math.abs(positions[2 * perLength + 1] - positions[1]) < 1e-4)
})
