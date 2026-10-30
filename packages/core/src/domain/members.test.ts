import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { test } from 'node:test'
import { testFixture } from '../slots/test-fixture.ts'
import { canonicalEmail, hashToken, mergeSlot, validCredentials } from './members.ts'

const memberId = '00000000-0000-0000-0000-000000000000'
const fixtureRegistry = { 'test-fixture': testFixture }

test('canonicalEmail trims and lowercases, so case variants share one value', () => {
  assert.equal(canonicalEmail(' A@X.com '), 'a@x.com')
  assert.equal(canonicalEmail('a@x.com'), 'a@x.com')
  assert.equal(canonicalEmail(' A@X.com '), canonicalEmail('a@x.com'))
})

test('validCredentials enforces the password limits of §2', () => {
  assert.equal(validCredentials('a@x.com', '1234567'), false)
  assert.equal(validCredentials('a@x.com', '12345678'), true)
  assert.equal(validCredentials('a@x.com', 'x'.repeat(129)), false)
  assert.equal(validCredentials('a@x.com', 'é'.repeat(37)), false) // 74 UTF-8 bytes
  assert.equal(validCredentials('a@x.com', 'é'.repeat(36)), true) // 72 UTF-8 bytes
  assert.equal(validCredentials('a@x.com', 'x'.repeat(72)), true)
  assert.equal(validCredentials('a@x.com', 'x'.repeat(73)), false)
})

test('validCredentials enforces the email limits of §2', () => {
  assert.equal(validCredentials('', '12345678'), false)
  assert.equal(validCredentials('no-at-sign', '12345678'), false)
  assert.equal(validCredentials('a@' + 'x'.repeat(252), '12345678'), true) // 254 chars
  assert.equal(validCredentials('a@' + 'x'.repeat(253), '12345678'), false) // 255 chars
  assert.equal(validCredentials(' A@X.com ', '12345678'), true) // canonicalised first
})

test('hashToken stores the sha256 hex of the raw token', () => {
  assert.equal(hashToken('token-abc'), createHash('sha256').update('token-abc').digest('hex'))
  assert.equal(hashToken('token-abc').length, 64)
  assert.notEqual(hashToken('token-abc'), hashToken('token-abd'))
})

test('mergeSlot rejects unregistered slots through the production registry', async () => {
  assert.deepEqual(await mergeSlot(memberId, 'nope', 1, {}), { ok: false, error: 'unknown_slot' })
})

test('mergeSlot rejects future versions, oversized docs and bad shapes before touching the db', async () => {
  assert.deepEqual(await mergeSlot(memberId, 'test-fixture', 3, {}, fixtureRegistry), {
    ok: false,
    error: 'version_ahead',
  })
  assert.deepEqual(await mergeSlot(memberId, 'test-fixture', 2, { big: 'x'.repeat(3000) }, fixtureRegistry), {
    ok: false,
    error: 'too_large',
  })
  assert.deepEqual(await mergeSlot(memberId, 'test-fixture', 1, { best: -1, scores: {} }, fixtureRegistry), {
    ok: false,
    error: 'invalid',
  })
})
