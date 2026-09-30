import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  hitsAt,
  isPaintedAt,
  pickAt,
  planeUvAt,
  registerSpriteMask,
  type PlaneLike,
  type WorldPoint,
} from './hit.ts'

function plane(overrides: Partial<PlaneLike> = {}): PlaneLike {
  return { x: 0, y: 0, width: 1, height: 1, z: 0, flipX: false, mask: null, ...overrides }
}

function pixelPoint(x: number, y: number, size = 8): WorldPoint {
  return { x: (x + 0.5) / size - 0.5, y: 1 - (y + 0.5) / size - 0.5 }
}

function dotMask(name: string, size = 8): void {
  const alpha = new Uint8Array(size * size)
  alpha[4 * size + 4] = 255
  registerSpriteMask(name, size, size, alpha)
}

function leftMask(name: string, size = 8): void {
  const alpha = new Uint8Array(size * size)
  for (let y = 0; y < size; y++) for (let x = 0; x < size / 2; x++) alpha[y * size + x] = 255
  registerSpriteMask(name, size, size, alpha)
}

test('planeUvAt maps world points to uv and rejects the outside', () => {
  const p = plane({ x: 1, y: 2, width: 2, height: 1 })
  assert.deepEqual(planeUvAt(p, { x: 1, y: 2 }), { u: 0.5, v: 0.5 })
  assert.deepEqual(planeUvAt(p, { x: 0, y: 1.5 }), { u: 0, v: 0 })
  assert.deepEqual(planeUvAt(p, { x: 2, y: 2.5 }), { u: 1, v: 1 })
  assert.equal(planeUvAt(p, { x: 2.0001, y: 2 }), null)
  assert.equal(planeUvAt(p, { x: -0.0001, y: 2 }), null)
  assert.equal(planeUvAt(p, { x: 1, y: 2.5001 }), null)
})

test('planeUvAt mirrors u when flipX is set', () => {
  const p = plane({ x: 1, y: 2, width: 2, height: 1, flipX: true })
  assert.deepEqual(planeUvAt(p, { x: 0.5, y: 2 }), { u: 0.75, v: 0.5 })
  assert.deepEqual(planeUvAt(p, { x: 1.5, y: 2 }), { u: 0.25, v: 0.5 })
  assert.deepEqual(planeUvAt(p, { x: 1, y: 2 }), { u: 0.5, v: 0.5 })
})

test('hitsAt sorts by descending z and keeps ties in input order', () => {
  const a = plane({ z: 1 })
  const b = plane({ z: 2 })
  const c = plane({ z: 2 })
  const d = plane({ z: 3 })
  const hits = hitsAt({ x: 0.5, y: 0.5 }, [a, b, c, d])
  assert.deepEqual(hits.map((h) => h.plane), [d, b, c, a])
  assert.deepEqual(hits.map((h) => h.z), [3, 2, 2, 1])
})

test('hitsAt skips planes that do not cover the point', () => {
  const here = plane()
  const away = plane({ x: 10 })
  assert.deepEqual(hitsAt({ x: 0.5, y: 0.5 }, [here, away]).map((h) => h.plane), [here])
  assert.equal(hitsAt({ x: 10.5, y: 0.5 }, [away])[0]?.plane, away)
})

test('a null mask is painted for both spread and exact tests', () => {
  const p = plane()
  const hit = hitsAt({ x: 0.5, y: 0.5 }, [p])[0]
  assert.ok(hit)
  assert.equal(isPaintedAt(hit), true)
  assert.equal(isPaintedAt(hit, true), true)
  assert.equal(pickAt({ x: 0.5, y: 0.5 }, [p])?.plane, p)
})

test('sprite masks decide painted and unpainted picks', () => {
  dotMask('test:dot')
  const p = plane({ mask: { sprite: 'test:dot' } })
  assert.equal(pickAt(pixelPoint(4, 4), [p])?.plane, p)
  assert.equal(pickAt(pixelPoint(0, 4), [p]), null)
  assert.equal(pickAt(pixelPoint(4, 0), [p]), null)
})

test('the spread mask is wider than the exact mask', () => {
  dotMask('test:spread')
  const p = plane({ mask: { sprite: 'test:spread' } })
  assert.equal(pickAt(pixelPoint(2, 4), [p])?.plane, p)
  assert.equal(pickAt(pixelPoint(2, 4), [p], true), null)
  assert.equal(pickAt(pixelPoint(4, 4), [p], true)?.plane, p)
  assert.equal(pickAt(pixelPoint(0, 4), [p], true), null)
})

test('flipX mirrors the mask lookup', () => {
  leftMask('test:left')
  const p = plane({ mask: { sprite: 'test:left' } })
  assert.equal(pickAt(pixelPoint(0, 4), [p])?.plane, p)
  assert.equal(pickAt(pixelPoint(7, 4), [p]), null)

  const flipped = plane({ mask: { sprite: 'test:left' }, flipX: true })
  assert.equal(pickAt(pixelPoint(0, 4), [flipped]), null)
  assert.equal(pickAt(pixelPoint(7, 4), [flipped])?.plane, flipped)
})

test('pickAt walks down the z order until something is painted', () => {
  dotMask('test:top')
  const top = plane({ z: 2, mask: { sprite: 'test:top' } })
  const under = plane({ z: 1 })
  assert.equal(pickAt(pixelPoint(0, 4), [top, under])?.plane, under)
  assert.equal(pickAt(pixelPoint(4, 4), [top, under])?.plane, top)
})
