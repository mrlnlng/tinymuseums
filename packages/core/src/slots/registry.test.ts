import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SLOTS, docBytes, slotDef, type SlotDef } from './index.ts'
import { testFixture, type TestFixture } from './test-fixture.ts'

const FIXTURE_REGISTRY: Record<string, SlotDef<unknown>> = { 'test-fixture': testFixture }

function checkRegistry(label: string, registry: Record<string, SlotDef<unknown>>): void {
  for (const def of Object.values(registry)) {
    const samples = def.samples
    for (const sample of samples) {
      assert.notEqual(def.parse(sample), null, `${label}/${def.name}: a sample fails parse`)
      assert.ok(docBytes(sample) <= def.maxBytes, `${label}/${def.name}: a sample exceeds maxBytes`)
    }
    for (const a of samples) {
      assert.deepEqual(def.merge(a, a), a, `${label}/${def.name}: merge is not idempotent`)
    }
    for (const a of samples) {
      for (const b of samples) {
        assert.deepEqual(def.merge(a, b), def.merge(b, a), `${label}/${def.name}: merge is not commutative`)
        const merged = def.merge(a, b)
        assert.notEqual(def.parse(merged), null, `${label}/${def.name}: merged docs fail parse`)
        assert.ok(docBytes(merged) <= def.maxBytes, `${label}/${def.name}: merged docs exceed maxBytes`)
      }
    }
    for (const a of samples) {
      for (const b of samples) {
        for (const c of samples) {
          assert.deepEqual(
            def.merge(def.merge(a, b), c),
            def.merge(a, def.merge(b, c)),
            `${label}/${def.name}: merge is not associative`,
          )
        }
      }
    }
  }
}

test('every slot in the production SLOTS registry obeys the merge laws', () => {
  checkRegistry('SLOTS', SLOTS)
})

test('the test fixture obeys the merge laws in an injected registry', () => {
  checkRegistry('injected', FIXTURE_REGISTRY)
})

test('the production SLOTS registry is empty and holds no test fixture', () => {
  assert.deepEqual(SLOTS, {})
  assert.equal(slotDef('test-fixture'), null)
  assert.equal(slotDef('constructor'), null)
})

test('slotDef resolves through an injected registry', () => {
  assert.equal(slotDef('test-fixture', FIXTURE_REGISTRY), testFixture)
  assert.equal(slotDef('missing', FIXTURE_REGISTRY), null)
  assert.equal(slotDef('test-fixture'), null)
})

test('the fixture parse rejects bad shapes and over-limit docs', () => {
  const valid: TestFixture = { best: 1, scores: { hall: 2 }, items: { helm: { at: 100 } } }
  assert.notEqual(testFixture.parse(valid), null)
  assert.notEqual(testFixture.parse(testFixture.empty()), null)
  assert.equal(testFixture.parse({}), null)
  assert.equal(testFixture.parse({ ...valid, best: -1 }), null)
  assert.equal(testFixture.parse({ ...valid, scores: { lobby: 2 } }), null)
  assert.equal(testFixture.parse({ ...valid, items: { helm: { at: 0 } } }), null)
  assert.equal(
    testFixture.parse({ ...valid, items: { a: { at: 1 }, b: { at: 2 }, c: { at: 3 }, d: { at: 4 } } }),
    null,
  )
})
