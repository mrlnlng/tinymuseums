import assert from 'node:assert/strict'
import { test } from 'node:test'
import { POND_MAX_REEL_MS, POND_MIN_REEL_MS, issuePondTicket, pondFishFor, readPondTicket } from './pond.ts'

const SECRET = 'test-secret'

test('a ticket reels in a fish for its own member after the bite delay', () => {
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000)
  const result = readPondTicket(SECRET, ticket, 'member-a', 1_000 + POND_MIN_REEL_MS)
  assert.equal(result.ok, true)
  // The same ticket always rolls the same fish.
  assert.deepEqual(readPondTicket(SECRET, ticket, 'member-a', 5_000), result)
})

test('a ticket is refused too early, too late, for another member, or tampered with', () => {
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000)
  assert.deepEqual(readPondTicket(SECRET, ticket, 'member-a', 1_500), { ok: false, reason: 'too_soon' })
  assert.deepEqual(readPondTicket(SECRET, ticket, 'member-a', 1_001 + POND_MAX_REEL_MS), { ok: false, reason: 'expired' })
  assert.deepEqual(readPondTicket(SECRET, ticket, 'member-b', 5_000), { ok: false, reason: 'invalid' })
  assert.deepEqual(readPondTicket('other-secret', ticket, 'member-a', 5_000), { ok: false, reason: 'invalid' })
  const [payload, signature] = ticket.split('.')
  const forged = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(payload, 'base64url').toString()), t: 0 })).toString('base64url')
  assert.deepEqual(readPondTicket(SECRET, `${forged}.${signature}`, 'member-a', 5_000), { ok: false, reason: 'invalid' })
  for (const junk of [null, 7, '', 'a.b.c', 'x'.repeat(301)]) {
    assert.equal(readPondTicket(SECRET, junk, 'member-a', 5_000).ok, false)
  }
})

test('fish odds follow the weights', () => {
  assert.equal(pondFishFor(0), 'minnow')
  assert.equal(pondFishFor(0.499), 'minnow')
  assert.equal(pondFishFor(0.5), 'perch')
  assert.equal(pondFishFor(0.93), 'koi')
  assert.equal(pondFishFor(0.995), 'golden-koi')
  assert.equal(pondFishFor(1), 'golden-koi')
})
