import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, test } from 'node:test'
import { closePool, query, queryOne } from '../src/infra/db.ts'
import {
  changePassword,
  deleteMember,
  exportMember,
  hashToken,
  memberForSession,
  mergeSlot,
  readSlots,
  signIn,
  signUp,
  type Started,
} from '../src/domain/members.ts'
import { testFixture } from '../src/slots/test-fixture.ts'
import type { SlotDef } from '../src/slots/index.ts'

after(() => closePool())

const PASSWORD = 'correct horse'
const registry = { [testFixture.name]: testFixture as SlotDef<unknown> }

function email(): string {
  return `db-${randomBytes(6).toString('hex')}@example.test`
}

async function started(address = email(), password = PASSWORD): Promise<Started> {
  const result = await signUp(address, password)
  assert.ok('token' in result, `sign-up failed: ${JSON.stringify(result)}`)
  return result
}

test('concurrent sign-ups for one email, in different case, create one member', async () => {
  const address = email()
  const results = await Promise.all([signUp(address, PASSWORD), signUp(address.toUpperCase(), PASSWORD)])
  assert.equal(results.filter((r) => 'token' in r).length, 1)
  assert.deepEqual(
    results.filter((r) => 'error' in r),
    [{ error: 'email_taken' }],
  )
  const rows = await query(`select 1 from members where email = $1`, [address])
  assert.equal(rows.length, 1)
})

test('sign-up stores only a hash of the session token', async () => {
  const { token, member } = await started()
  const raw = await queryOne(`select 1 from member_sessions where token_hash = $1`, [token])
  const hashed = await queryOne<{ member_id: string }>(
    `select member_id from member_sessions where token_hash = $1`,
    [hashToken(token)],
  )
  assert.equal(raw, null)
  assert.equal(hashed?.member_id, member.id)
})

test('sign-in rejects a wrong password and an unknown email, the latter still paying for a compare', async () => {
  const address = email()
  await started(address)
  assert.equal(await signIn(address, 'wrong password'), null)

  const begun = performance.now()
  assert.equal(await signIn(email(), PASSWORD), null)
  assert.ok(performance.now() - begun > 30, 'unknown email returned without a bcrypt compare')

  const ok = await signIn(` ${address.toUpperCase()} `, PASSWORD)
  assert.ok(ok)
})

test('changing the password keeps the current session and revokes the others', async () => {
  const address = email()
  const first = await started(address)
  const second = await signIn(address, PASSWORD)
  assert.ok(second)

  assert.equal(await changePassword(first.member.id, first.token, 'wrong password', 'new password 1'), false)
  assert.equal(await changePassword(first.member.id, first.token, PASSWORD, 'new password 1'), true)

  assert.ok(await memberForSession(first.token))
  assert.equal(await memberForSession(second.token), null)
  assert.equal(await signIn(address, PASSWORD), null)
  assert.ok(await signIn(address, 'new password 1'))
})

test('sessions slide when fewer than 90 days remain, and expired ones are rejected', async () => {
  const { token, member } = await started()
  const fresh = await memberForSession(token)
  assert.equal(fresh?.renewed, false)

  await query(
    `update member_sessions set expires_at = now() + interval '10 days' where token_hash = $1`,
    [hashToken(token)],
  )
  await query(`update members set last_seen_at = now() - interval '1 day' where id = $1`, [member.id])
  const slid = await memberForSession(token)
  assert.equal(slid?.renewed, true)
  const daysLeft = (slid!.expiresAt.getTime() - Date.now()) / 86_400_000
  assert.ok(daysLeft > 179 && daysLeft <= 180, `expected ~180 days, got ${daysLeft}`)
  const seen = await queryOne<{ recent: boolean }>(
    `select last_seen_at > now() - interval '1 minute' as recent from members where id = $1`,
    [member.id],
  )
  assert.equal(seen?.recent, true)
  assert.equal((await memberForSession(token))?.renewed, false)

  await query(
    `update member_sessions set expires_at = now() - interval '1 second' where token_hash = $1`,
    [hashToken(token)],
  )
  assert.equal(await memberForSession(token), null)
})

test('the production registry is empty, so every slot is unknown', async () => {
  const { member } = await started()
  assert.deepEqual(await mergeSlot(member.id, 'test-fixture', 2, testFixture.empty()), {
    ok: false,
    error: 'unknown_slot',
  })
})

test('concurrent first merges into a new slot row keep both contributions', async () => {
  const { member } = await started()
  const results = await Promise.all([
    mergeSlot(member.id, 'test-fixture', 2, { best: 5, scores: { hall: 4 }, items: {} }, registry),
    mergeSlot(member.id, 'test-fixture', 2, { best: 9, scores: { cafe: 7 }, items: { coin: { at: 100 } } }, registry),
  ])
  assert.ok(results.every((r) => r.ok))
  const slots = await readSlots(member.id)
  assert.deepEqual(slots['test-fixture'], {
    version: 2,
    doc: { best: 9, scores: { hall: 4, cafe: 7 }, items: { coin: { at: 100 } } },
  })
})

test('merges reject bad input without touching the stored row', async () => {
  const { member } = await started()
  await mergeSlot(member.id, 'test-fixture', 2, { best: 3, scores: {}, items: {} }, registry)

  const tooLarge = { best: 1, scores: {}, items: {}, padding: 'x'.repeat(4096) }
  assert.deepEqual(await mergeSlot(member.id, 'test-fixture', 2, tooLarge, registry), {
    ok: false,
    error: 'too_large',
  })
  assert.deepEqual(await mergeSlot(member.id, 'test-fixture', 3, testFixture.empty(), registry), {
    ok: false,
    error: 'version_ahead',
  })
  assert.deepEqual(await mergeSlot(member.id, 'test-fixture', 2, { best: -1, scores: {}, items: {} }, registry), {
    ok: false,
    error: 'invalid',
  })
  assert.deepEqual((await readSlots(member.id))['test-fixture'].doc, { best: 3, scores: {}, items: {} })
})

test('an old-version incoming doc is migrated before merging', async () => {
  const { member } = await started()
  const result = await mergeSlot(member.id, 'test-fixture', 1, { best: 4, scores: { shop: 2 } }, registry)
  assert.deepEqual(result, { ok: true, version: 2, doc: { best: 4, scores: { shop: 2 }, items: {} } })
})

test('a stored doc that no longer validates is never overwritten', async () => {
  const { member } = await started()
  await query(
    `insert into member_slots (member_id, slot, version, doc) values ($1, 'test-fixture', 2, $2::jsonb)`,
    [member.id, JSON.stringify({ best: 'corrupt' })],
  )
  assert.deepEqual(await mergeSlot(member.id, 'test-fixture', 2, { best: 1, scores: {}, items: {} }, registry), {
    ok: false,
    error: 'invalid',
  })
  assert.deepEqual((await readSlots(member.id))['test-fixture'].doc, { best: 'corrupt' })
})

test('export returns the email and every stored slot, including unregistered ones', async () => {
  const address = email()
  const { member } = await started(address)
  await mergeSlot(member.id, 'test-fixture', 2, { best: 2, scores: {}, items: {} }, registry)
  await query(
    `insert into member_slots (member_id, slot, version, doc) values ($1, 'retired-slot', 1, '{"kept":true}')`,
    [member.id],
  )
  const exported = await exportMember(member.id)
  assert.equal(exported.email, address)
  assert.ok(!Number.isNaN(Date.parse(exported.createdAt)))
  assert.deepEqual(Object.keys(exported.slots).sort(), ['retired-slot', 'test-fixture'])
  assert.deepEqual(exported.slots['retired-slot'].doc, { kept: true })
  assert.ok(!Number.isNaN(Date.parse(exported.slots['test-fixture'].updatedAt)))
  assert.ok(!JSON.stringify(exported).includes('password'))
})

test('delete refuses a wrong password, then removes the member with its sessions and slots', async () => {
  const { member, token } = await started()
  await mergeSlot(member.id, 'test-fixture', 2, { best: 1, scores: {}, items: {} }, registry)

  assert.equal(await deleteMember(member.id, 'wrong password'), false)
  assert.ok(await memberForSession(token))

  assert.equal(await deleteMember(member.id, PASSWORD), true)
  assert.equal(await memberForSession(token), null)
  for (const table of ['members', 'member_sessions', 'member_slots']) {
    const column = table === 'members' ? 'id' : 'member_id'
    const rows = await query(`select 1 from ${table} where ${column} = $1`, [member.id])
    assert.equal(rows.length, 0, `${table} still has rows`)
  }
})
