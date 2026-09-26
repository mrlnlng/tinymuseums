import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizePage, parseVitalsReport } from './vitals.ts'

test('pages are grouped so artist slugs and studio paths never land in the table', () => {
  assert.equal(normalizePage('/museum'), '/museum')
  assert.equal(normalizePage('/a/some-artist'), '/a/[slug]')
  assert.equal(normalizePage('/studio/gallery'), '/studio')
  assert.equal(normalizePage('/q/secret-token'), 'other')
  assert.equal(normalizePage(42), 'other')
})

test('a well-formed report becomes one row per metric', () => {
  const rows = parseVitalsReport({
    page: '/museum',
    device: 'mobile',
    connection: '4g',
    metrics: [
      { name: 'LCP', value: 1830.5, rating: 'good' },
      { name: 'CLS', value: 0.02, rating: 'good' },
      { name: 'first_painting', value: 2400 },
    ],
  })
  assert.equal(rows.length, 3)
  assert.deepEqual(rows[0], {
    page: '/museum',
    metric: 'LCP',
    value: 1830.5,
    rating: 'good',
    device: 'mobile',
    connection: '4g',
  })
  assert.equal(rows[2].rating, null)
})

test('unknown metrics, bad values and oversized reports are dropped', () => {
  const rows = parseVitalsReport({
    page: '/',
    device: 'fridge',
    connection: "4g'; drop table vitals",
    metrics: [
      { name: 'LCP', value: -1 },
      { name: 'LCP', value: Number.NaN },
      { name: 'LCP', value: 9e9 },
      { name: 'CLS', value: 50 },
      { name: 'FID', value: 10 },
      ...Array.from({ length: 20 }, () => ({ name: 'TTFB', value: 100 })),
    ],
  })
  assert.equal(rows.length, 5)
  assert.ok(rows.every((row) => row.metric === 'TTFB' && row.device === 'desktop' && row.connection === null))
})

test('garbage bodies produce nothing', () => {
  for (const body of [null, 'text', 3, {}, { metrics: 'LCP' }]) assert.deepEqual(parseVitalsReport(body), [])
})
