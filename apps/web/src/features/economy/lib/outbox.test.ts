import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { ClaimRequest } from './claim.ts'
import {
  OUTBOX_CAP,
  RETRY_MAX_MS,
  outboxAdd,
  outboxDue,
  outboxFail,
  outboxRemove,
  retryDelay,
  type OutboxEntry,
} from './outbox.ts'

const request: ClaimRequest = { source: 'secret', feature: 'statue', tzOffset: 0 }

function entry(key: string, memberId = 'member-a', nextAt = 0): OutboxEntry {
  return { memberId, key, request, attempts: 0, nextAt }
}

test('outbox add dedupes a retried claim key', () => {
  const first = outboxAdd([], entry('secret:statue'))
  const again = outboxAdd(first, entry('secret:statue'))
  assert.equal(again.length, 1)
  assert.deepEqual(again[0], first[0])
})

test('outbox remove only drops the matching member and key', () => {
  const entries = [entry('secret:statue'), entry('secret:statue', 'member-b'), entry('coin:2026-11-01')]
  assert.deepEqual(
    outboxRemove(entries, 'member-a', 'secret:statue').map((row) => `${row.memberId}:${row.key}`),
    ['member-b:secret:statue', 'member-a:coin:2026-11-01'],
  )
})

test('outbox keeps only the newest cap of entries', () => {
  let entries: OutboxEntry[] = []
  for (let index = 0; index < OUTBOX_CAP + 2; index++) entries = outboxAdd(entries, entry(`k${index}`))
  assert.equal(entries.length, OUTBOX_CAP)
  assert.equal(entries[0].key, 'k2')
  assert.equal(entries.at(-1)?.key, `k${OUTBOX_CAP + 1}`)
})

test('backoff doubles to a minute cap', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 7, 8].map(retryDelay), [1000, 2000, 4000, 8000, 16000, 60000, 60000])
  assert.equal(retryDelay(100), RETRY_MAX_MS)
})

test('a failed entry waits with more attempts, and due entries are member-scoped', () => {
  const now = 1_000_000
  const failed = outboxFail([entry('secret:statue'), entry('coin:day', 'member-b')], 'member-a', 'secret:statue', now)
  assert.equal(failed[0].attempts, 1)
  assert.equal(failed[0].nextAt, now + 1000)
  assert.deepEqual(outboxDue(failed, 'member-a', now), [])
  assert.deepEqual(outboxDue(failed, 'member-a', now + 1000), [failed[0]])
  assert.deepEqual(outboxDue(failed, 'member-b', now + 1000), [failed[1]])
})
