import assert from 'node:assert/strict'
import { test } from 'node:test'
import { localDay } from './day.ts'

const at = (iso: string, offset: number): string => localDay(offset, new Date(iso))

test('localDay shifts UTC by the supplied offset', () => {
  assert.equal(at('2026-11-01T20:00:00Z', 0), '2026-11-01')
  assert.equal(at('2026-11-01T20:00:00Z', 120), '2026-11-01')
  assert.equal(at('2026-11-01T20:00:00Z', 240), '2026-11-02')
  assert.equal(at('2026-11-01T05:00:00Z', -480), '2026-10-31')
})

test('localDay crosses month and year boundaries', () => {
  assert.equal(at('2026-01-01T00:30:00Z', -60), '2025-12-31')
  assert.equal(at('2026-12-31T23:30:00Z', 60), '2027-01-01')
})

test('localDay clamps offsets to plus or minus 14 hours', () => {
  assert.equal(at('2026-11-01T20:00:00Z', 840), '2026-11-02')
  assert.equal(at('2026-11-01T20:00:00Z', 10_000), '2026-11-02')
  assert.equal(at('2026-11-01T05:00:00Z', -840), '2026-10-31')
  assert.equal(at('2026-11-01T05:00:00Z', -10_000), '2026-10-31')
})

test('non-integer and non-finite offsets are treated as zero', () => {
  for (const offset of [1.5, -1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    assert.equal(at('2026-11-01T23:00:00Z', offset), '2026-11-01')
  }
})
