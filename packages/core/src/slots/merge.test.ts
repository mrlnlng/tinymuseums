import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mapOf, maxNumber, record, stamp, topTombSet, type TombSet } from './merge.ts'

test('maxNumber picks the larger value', () => {
  assert.equal(maxNumber(1, 2), 2)
  assert.equal(maxNumber(2, 1), 2)
  assert.equal(maxNumber(3, 3), 3)
})

test('record merges every field with its combinator and leaves inputs untouched', () => {
  const merge = record<{ n: number; tag: string }>({ n: maxNumber, tag: (a, b) => a + b })
  assert.deepEqual(merge({ n: 1, tag: 'a' }, { n: 5, tag: 'b' }), { n: 5, tag: 'ab' })
  const a = { n: 1, tag: 'a' }
  const b = { n: 5, tag: 'b' }
  merge(a, b)
  assert.deepEqual(a, { n: 1, tag: 'a' })
  assert.deepEqual(b, { n: 5, tag: 'b' })
})

test('record drops keys it has no combinator for', () => {
  const merge = record<{ n: number }>({ n: maxNumber })
  const wider = { n: 1, extra: 9 } as { n: number; extra: number }
  assert.deepEqual(merge(wider, wider), { n: 1 })
})

test('mapOf merges shared keys and carries keys from either side', () => {
  const merge = mapOf(maxNumber)
  assert.deepEqual(merge({ a: 1, b: 2 }, { b: 5, c: 3 }), { a: 1, b: 5, c: 3 })
  assert.deepEqual(merge({}, { a: 1 }), { a: 1 })
})

test('mapOf keys cannot reach the prototype', () => {
  const merge = mapOf(maxNumber)
  const out = merge({ ['__proto__']: 1 }, {})
  assert.equal(Object.getPrototypeOf(out), Object.prototype)
  assert.equal(out['__proto__'], 1)
  assert.deepEqual(Object.keys(out), ['__proto__'])
})

test('topTombSet resolves each key by higher at, then removal on a tie', () => {
  const merge = topTombSet(10)
  assert.deepEqual(
    merge({ a: { at: 1 }, b: { at: 2 } }, { a: { at: 3, removed: true } }),
    { a: { at: 3, removed: true }, b: { at: 2 } },
  )
  assert.deepEqual(merge({ a: { at: 4 } }, { a: { at: 4, removed: true } }), { a: { at: 4, removed: true } })
  assert.deepEqual(merge({ a: { at: 4 } }, { a: { at: 4 } }), { a: { at: 4 } })
})

test('topTombSet keeps the cap entries with the highest (at, key)', () => {
  const merge = topTombSet(2)
  assert.deepEqual(merge({ a: { at: 1 }, b: { at: 5 }, c: { at: 5 } }, {}), { b: { at: 5 }, c: { at: 5 } })
  assert.deepEqual(merge({ a: { at: 5 }, b: { at: 5 }, c: { at: 5 } }, {}), { b: { at: 5 }, c: { at: 5 } })
})

test('topTombSet does not resurrect a removal after truncation', () => {
  const stale: TombSet = { a: { at: 1 } }
  const withRemoval: TombSet = { a: { at: 9, removed: true }, x: { at: 10 }, y: { at: 11 } }

  const cap2 = topTombSet(2)
  const truncated = cap2(stale, withRemoval)
  assert.deepEqual(truncated, { x: { at: 10 }, y: { at: 11 } })
  assert.deepEqual(cap2(truncated, stale), { x: { at: 10 }, y: { at: 11 } })

  const cap3 = topTombSet(3)
  const kept = cap3(stale, withRemoval)
  assert.deepEqual(kept.a, { at: 9, removed: true })
  assert.deepEqual(cap3(kept, stale).a, { at: 9, removed: true })
})

test('topTombSet never evicts a new entry', () => {
  const merge = topTombSet(2)
  const full: TombSet = { b: { at: 2 }, c: { at: 3 } }
  const next = stamp(full)
  const merged = merge(full, { a: { at: next } })
  assert.deepEqual(merged.a, { at: next })
  assert.equal(Object.keys(merged).length, 2)
  assert.ok(next > 3)
})

test('stamp is at least the wall clock', (t) => {
  t.mock.method(Date, 'now', () => 2_000)
  assert.equal(stamp({}), 2_000)
  assert.equal(stamp({ a: { at: 500 }, b: { at: 700, removed: true } }), 2_000)
})

test('stamp is one above the highest at it has seen, live or removed, when the clock lags', (t) => {
  t.mock.method(Date, 'now', () => 1_000)
  assert.equal(stamp({ a: { at: 2_000 } }), 2_001)
  assert.equal(stamp({ a: { at: 4_000, removed: true } }), 4_001)
})

test('stamp outranks all seen stamps even with a clock far in the future', (t) => {
  const far = 1_000_000_000_000_000
  t.mock.method(Date, 'now', () => far)
  assert.equal(stamp({}), far)
  assert.equal(stamp({ a: { at: far + 5 } }), far + 6)
})

test('topTombSet ignores inherited keys missing from one side', () => {
  const merge = topTombSet(10)
  const a: TombSet = JSON.parse('{"toString":{"at":5},"constructor":{"at":6,"removed":true}}')
  assert.deepEqual(merge(a, {}), a)
  assert.deepEqual(merge({}, a), a)
})
