import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildClaim, newRunId } from './claim.ts'

const now = new Date('2026-11-01T12:00:00Z')

test('buildClaim derives the same server key and day from a claim request', () => {
  assert.deepEqual(buildClaim('coin', {}, now, 840), {
    key: 'coin:2026-11-02',
    day: '2026-11-02',
    request: { source: 'coin', tzOffset: 840 },
  })
  assert.deepEqual(buildClaim('secret', { feature: 'statue' }, now, 0), {
    key: 'secret:statue',
    day: null,
    request: { source: 'secret', feature: 'statue', tzOffset: 0 },
  })
})

test('a game run without an id gets a valid one', () => {
  const first = buildClaim('game', { game: 'sketch', score: 12 }, now, 0)
  const second = buildClaim('game', { game: 'sketch', score: 12 }, now, 0)
  assert.ok(first)
  assert.ok(second)
  assert.match(String(first.request.runId), /^[A-Za-z0-9_-]{8,40}$/)
  assert.notEqual(first.request.runId, second.request.runId)
  assert.equal(first.key, `game:2026-11-01:${first.request.runId}`)
})

test('newRunId always meets the server regex', () => {
  for (let index = 0; index < 20; index++) {
    assert.match(newRunId(), /^[A-Za-z0-9_-]{8,40}$/)
  }
})

test('buildClaim rejects invalid details', () => {
  assert.equal(buildClaim('secret', { feature: 'unknown' as never }, now, 0), null)
  assert.equal(buildClaim('game', { game: 'sketch', score: 101 }, now, 0), null)
  assert.equal(buildClaim('art', { pieceId: '' }, now, 0), null)
})
