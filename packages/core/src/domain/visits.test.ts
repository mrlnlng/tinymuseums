import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseVisitReport } from './visits.ts'

const valid = {
  id: '3f2b8c1e-9a4d-4e6f-8b2a-1c3d5e7f9a0b',
  page: '/a/some-artist',
  device: 'mobile',
  durationMs: 64_000.7,
  interactions: 12,
  paintings: 4,
  furthest: 'cafe',
  features: { painting: 3, coin: 1 },
}

test('a well-formed report is kept, with paths grouped and counts floored', () => {
  assert.deepEqual(parseVisitReport(valid), {
    id: valid.id,
    page: '/a/[slug]',
    device: 'mobile',
    durationMs: 64_000,
    interactions: 12,
    paintings: 4,
    furthest: 'cafe',
    features: { painting: 3, coin: 1 },
  })
})

test('reports without a real visit id or with bad totals are refused', () => {
  assert.equal(parseVisitReport({ ...valid, id: 'not-a-uuid' }), null)
  assert.equal(parseVisitReport({ ...valid, durationMs: -1 }), null)
  assert.equal(parseVisitReport({ ...valid, interactions: 'many' }), null)
  assert.equal(parseVisitReport(null), null)
})

test('unknown features, zero counts and unknown landmarks are dropped', () => {
  const report = parseVisitReport({
    ...valid,
    furthest: 'the moon',
    features: { painting: 2, hacked: 99, coin: 0, __proto__: 5 },
  })
  assert.deepEqual(report?.features, { painting: 2 })
  assert.equal(report?.furthest, 'entrance')
})

test('absurd values are capped rather than trusted', () => {
  const report = parseVisitReport({ ...valid, durationMs: 1e12, interactions: 1e12 })
  assert.equal(report?.durationMs, 12 * 60 * 60 * 1000)
  assert.equal(report?.interactions, 100_000)
})
