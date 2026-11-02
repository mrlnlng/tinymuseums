import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { ClaimRequest } from './claim.ts'
import {
  CARRY_CAP,
  carryAdd,
  carryPrune,
  carryRemove,
  chunk,
  type CarryEntry,
} from './carry.ts'

function entry(key: string, day: string | null): CarryEntry {
  const request: ClaimRequest = { source: day === null ? 'secret' : 'coin', tzOffset: 0 }
  return { key, day, request }
}

test('carry-over add dedupes a claim key', () => {
  const once = carryAdd([], entry('secret:statue', null))
  assert.equal(carryAdd(once, entry('secret:statue', null)).length, 1)
})

test('carry-over keeps every once-ever entry and only today’s daily entries', () => {
  const entries = [
    entry('secret:statue', null),
    entry('art:piece-1', null),
    entry('coin:2026-11-01', '2026-11-01'),
    entry('coin:2026-10-31', '2026-10-31'),
    entry('game:2026-11-01:run-one', '2026-11-01'),
  ]
  assert.deepEqual(
    carryPrune(entries, '2026-11-01').map((row) => row.key),
    ['secret:statue', 'art:piece-1', 'coin:2026-11-01', 'game:2026-11-01:run-one'],
  )
})

test('carry-over remove clears submitted keys', () => {
  const entries = [entry('a', null), entry('b', null), entry('c', null)]
  assert.deepEqual(carryRemove(entries, ['a', 'c']).map((row) => row.key), ['b'])
})

test('carry-over caps the device set and drops the oldest', () => {
  let entries: CarryEntry[] = []
  for (let index = 0; index < CARRY_CAP + 3; index++) entries = carryAdd(entries, entry(`k${index}`, null))
  assert.equal(entries.length, CARRY_CAP)
  assert.equal(entries[0].key, 'k3')
  assert.equal(entries.at(-1)?.key, `k${CARRY_CAP + 2}`)
})

test('batches are at most 64 requests, with a remainder chunk', () => {
  const items = Array.from({ length: 130 }, (_, index) => index)
  assert.deepEqual(
    chunk(items, 64).map((group) => group.length),
    [64, 64, 2],
  )
  assert.deepEqual(chunk([], 64), [])
  assert.deepEqual(chunk(items, 0), [])
})
