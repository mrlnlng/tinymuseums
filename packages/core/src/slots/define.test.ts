import assert from 'node:assert/strict'
import { test } from 'node:test'
import { defineSlot, docBytes } from './define.ts'
import { upgrade } from './index.ts'
import { maxNumber } from './merge.ts'
import { testFixture } from './test-fixture.ts'

test('defineSlot returns the definition unchanged', () => {
  assert.equal(defineSlot(testFixture), testFixture)
})

test('docBytes counts UTF-8 bytes of the JSON', () => {
  assert.equal(docBytes(42), 2)
  assert.equal(docBytes({ a: 'é' }), 10)
  assert.equal(docBytes('🐈'), 6)
})

test('upgrade runs the migration chain from the stored version', () => {
  const chained = defineSlot({
    name: 'chain',
    version: 3,
    sync: false,
    maxBytes: 64,
    empty: () => 0,
    parse: (raw) => (typeof raw === 'number' ? raw : null),
    migrations: {
      1: (old) => (old as number) + 1,
      2: (old) => (old as number) + 1,
    },
    merge: maxNumber,
    samples: [1],
  })
  assert.equal(upgrade(chained, 3, 3), 3)
  assert.equal(upgrade(chained, 2, 5), 6)
  assert.equal(upgrade(chained, 1, 0), 2)
})

test('upgrade runs the fixture v1 -> v2 migration', () => {
  assert.deepEqual(upgrade(testFixture, 1, { best: 3, scores: { hall: 2 } }), {
    best: 3,
    scores: { hall: 2 },
    items: {},
  })
  assert.deepEqual(upgrade(testFixture, 2, { best: 3, scores: { hall: 2 }, items: {} }), {
    best: 3,
    scores: { hall: 2 },
    items: {},
  })
})

test('upgrade rejects future versions and bad shapes', () => {
  const valid = { best: 3, scores: { hall: 2 }, items: {} }
  assert.equal(upgrade(testFixture, 3, valid), null)
  assert.equal(upgrade(testFixture, 0, valid), null)
  assert.equal(upgrade(testFixture, 1, { best: 3 }), null)
  assert.equal(upgrade(testFixture, 2, { ...valid, best: 'high' }), null)
  assert.equal(upgrade(testFixture, 2, { ...valid, items: { a: { at: 0 } } }), null)
})

test('upgrade returns null when a migration throws', () => {
  const throwing = defineSlot({
    name: 'throwing',
    version: 2,
    sync: false,
    maxBytes: 64,
    empty: () => 0,
    parse: (raw) => (typeof raw === 'number' ? raw : null),
    migrations: {
      1: (): never => {
        throw new Error('boom')
      },
    },
    merge: maxNumber,
    samples: [1],
  })
  assert.equal(upgrade(throwing, 1, 0), null)
  assert.equal(upgrade(throwing, 2, 1), 1)
})
