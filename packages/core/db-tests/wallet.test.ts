import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, test } from 'node:test'
import { deleteMember, signUp } from '../src/domain/members.ts'
import {
  buy,
  claim,
  claimBatch,
  exportWallet,
  getWallet,
  grantNote,
  grantWelcome,
  type ClaimResult,
} from '../src/domain/wallet.ts'
import { closePool, query, queryOne } from '../src/infra/db.ts'
import { ITEMS } from '../src/economy/catalog.ts'
import { localDay } from '../src/economy/day.ts'
import { SECRET_FEATURES } from '../src/economy/rules.ts'

after(() => closePool())

const PASSWORD = 'correct horse'
const now = new Date('2026-11-01T12:00:00Z')
const today = localDay(0, now)

function randomId(): string {
  return randomBytes(8).toString('hex')
}

async function member(): Promise<string> {
  const result = await signUp(`wallet-${randomId()}@example.test`, PASSWORD)
  assert.ok('member' in result, `sign-up failed: ${JSON.stringify(result)}`)
  return result.member.id
}

function gameRequest(game: 'colorrecall' | 'sketch', score: number, runId = `run-${randomId()}`) {
  return { source: 'game', game, runId, score, tzOffsetMinutes: 0 }
}

async function assertInvariant(memberId: string): Promise<void> {
  const sums = await queryOne<{ claims: number; items: number }>(
    `select (select coalesce(sum(amount), 0)::int from coin_claims where member_id = $1) as claims,
            (select coalesce(sum(price), 0)::int from wallet_items where member_id = $1) as items`,
    [memberId],
  )
  const wallet = await queryOne<{ balance: number }>(
    `select balance from wallets where member_id = $1`,
    [memberId],
  )
  const balance = (sums?.claims ?? 0) - (sums?.items ?? 0)
  if (wallet) assert.equal(wallet.balance, balance)
  else assert.equal(balance, 0)
  assert.ok(balance >= 0)
}

function granted(results: ClaimResult[]): number {
  return results.reduce((sum, result) => sum + result.granted, 0)
}

async function piece(status: 'live' | 'draft'): Promise<string> {
  const name = `wallet-${randomId()}`
  const artist = await queryOne<{ id: string }>(
    `insert into artists (slug, display_name, email, password_hash, status)
     values ($1, $2, $3, $4, $5)
     returning id`,
    [name, 'Wallet Test', `${name}@example.test`, 'not-a-real-hash', status],
  )
  assert.ok(artist)
  const row = await queryOne<{ id: string }>(
    `insert into pieces (artist_id, title) values ($1, 'Test work') returning id`,
    [artist.id],
  )
  assert.ok(row)
  return row.id
}

test('a claim retry reports no new coins', async () => {
  const id = await member()
  assert.deepEqual(await claim(id, { source: 'secret', feature: 'statue' }, now), {
    granted: 10,
    balance: 10,
    capped: false,
  })
  assert.deepEqual(await claim(id, { source: 'secret', feature: 'statue' }, now), {
    granted: 0,
    balance: 10,
    capped: false,
    already: true,
  })
  const rows = await query(`select amount from coin_claims where member_id = $1`, [id])
  assert.equal(rows.length, 1)
  await assertInvariant(id)
})

test('the welcome purse is created lazily and granted once', async () => {
  const id = await member()
  assert.deepEqual(await getWallet(id, today), {
    balance: 0,
    items: [],
    today: { coin: 0, games: 0, note: 0 },
  })
  assert.deepEqual(await grantWelcome(id), { granted: 60, balance: 60, capped: false })
  assert.deepEqual(await grantWelcome(id), { granted: 0, balance: 60, capped: false, already: true })
  assert.equal((await getWallet(id, today)).balance, 60)
  await assertInvariant(id)
})

test('the coin and note claims are once per local day, and retries are idempotent', async () => {
  const id = await member()
  assert.deepEqual(await claim(id, { source: 'coin', tzOffsetMinutes: 0 }, now), {
    granted: 10,
    balance: 10,
    capped: false,
  })
  assert.deepEqual(await claim(id, { source: 'coin', tzOffsetMinutes: 0 }, now), {
    granted: 0,
    balance: 10,
    capped: false,
    already: true,
  })
  assert.deepEqual(await claim(id, { source: 'note', tzOffsetMinutes: 0 }, now), {
    granted: 5,
    balance: 15,
    capped: false,
  })
  assert.deepEqual(await claim(id, { source: 'note', tzOffsetMinutes: 0 }, now), {
    granted: 0,
    balance: 15,
    capped: false,
    already: true,
  })
  assert.deepEqual((await getWallet(id, today)).today, { coin: 10, games: 0, note: 5 })
  await assertInvariant(id)
})

test('grantNote pays once per local day', async () => {
  const id = await member()
  assert.deepEqual(await grantNote(id, now, 0), { granted: 5, balance: 5, capped: false })
  assert.deepEqual(await grantNote(id, now, 0), {
    granted: 0,
    balance: 5,
    capped: false,
    already: true,
  })
  assert.deepEqual((await getWallet(id, today)).today, { coin: 0, games: 0, note: 5 })
  assert.equal((await grantNote(id, new Date('2026-11-02T12:00:00Z'), 0) as ClaimResult).granted, 5)
  await assertInvariant(id)
})

test('the account export includes the wallet ledger', async () => {
  const id = await member()
  await grantWelcome(id)
  await claim(id, { source: 'secret', feature: 'statue' }, now)
  assert.ok('balance' in (await buy(id, 'bow:kiki')))

  const exported = await exportWallet(id)
  assert.equal(exported.balance, 10)
  assert.deepEqual(
    exported.claims.map((claim) => [claim.claim_key, claim.amount]),
    [
      ['welcome', 60],
      ['secret:statue', 10],
    ],
  )
  assert.deepEqual(
    exported.items.map((item) => [item.item_id, item.price]),
    [['bow:kiki', 60]],
  )
  for (const entry of [...exported.claims, ...exported.items]) {
    assert.ok(!Number.isNaN(Date.parse(entry.at)))
  }
  await assertInvariant(id)
})

test('colorrecall and sketch share one 25-coin daily cap', async () => {
  const id = await member()
  assert.deepEqual(await claim(id, gameRequest('colorrecall', 20), now), {
    granted: 20,
    balance: 20,
    capped: false,
  })
  assert.deepEqual(await claim(id, gameRequest('sketch', 20), now), {
    granted: 5,
    balance: 25,
    capped: false,
  })
  assert.deepEqual(await claim(id, gameRequest('colorrecall', 1), now), {
    granted: 0,
    balance: 25,
    capped: true,
  })
  assert.equal((await getWallet(id, today)).today.games, 25)
  await assertInvariant(id)
})

test('a new local day resets the daily caps', async () => {
  const id = await member()
  const nextDay = new Date('2026-11-02T12:00:00Z')

  assert.equal((await claim(id, { source: 'coin', tzOffsetMinutes: 0 }, now) as ClaimResult).granted, 10)
  assert.equal((await claim(id, { source: 'coin', tzOffsetMinutes: 0 }, nextDay) as ClaimResult).granted, 10)
  assert.equal((await claim(id, { source: 'coin', tzOffsetMinutes: 0 }, nextDay) as ClaimResult).granted, 0)

  assert.equal((await claim(id, gameRequest('colorrecall', 25), now) as ClaimResult).granted, 25)
  assert.equal((await claim(id, gameRequest('sketch', 25), nextDay) as ClaimResult).granted, 25)
  assert.equal((await claim(id, gameRequest('colorrecall', 1), now) as ClaimResult).granted, 0)
  assert.equal((await claim(id, gameRequest('sketch', 1), nextDay) as ClaimResult).granted, 0)

  assert.equal((await getWallet(id, today)).today.coin, 10)
  assert.equal((await getWallet(id, '2026-11-02')).today.coin, 10)
  assert.equal((await getWallet(id, '2026-11-02')).today.games, 25)
  await assertInvariant(id)
})

test('concurrent game claims never exceed the shared daily cap', async () => {
  const id = await member()
  const requests = Array.from({ length: 10 }, () => gameRequest('colorrecall', 5))
  const results = await Promise.all(requests.map((request) => claim(id, request, now)))
  const paid = results.reduce((sum, result) => sum + ('granted' in result ? result.granted : 0), 0)
  assert.equal(paid, 25)
  const wallet = await getWallet(id, today)
  assert.equal(wallet.balance, 25)
  assert.ok(wallet.balance <= 25)
  await assertInvariant(id)
})

test('concurrent buys with funds for one let exactly one through', async () => {
  const id = await member()
  await grantWelcome(id)
  const results = await Promise.all([buy(id, 'bow:kiki'), buy(id, 'bow:flower-crown')])
  assert.equal(results.filter((result) => 'balance' in result).length, 1)
  assert.deepEqual(
    results.filter((result) => 'error' in result),
    [{ error: 'insufficient' }],
  )
  const wallet = await getWallet(id, today)
  assert.equal(wallet.balance, 0)
  assert.equal(wallet.items.length, 1)
  await assertInvariant(id)
})

test('buying an owned item again does not charge twice', async () => {
  const id = await member()
  await grantWelcome(id)
  const first = await buy(id, 'bow:kiki')
  assert.deepEqual(first, { balance: 0, items: ['bow:kiki'] })
  assert.deepEqual(await buy(id, 'bow:kiki'), { balance: 0, items: ['bow:kiki'] })
  await assertInvariant(id)
})

test('an unknown or free item is rejected', async () => {
  const id = await member()
  await grantWelcome(id)
  assert.deepEqual(await buy(id, 'bow:nope'), { error: 'unknown_item' })
  assert.deepEqual(await buy(id, 'character:bunny'), { error: 'unknown_item' })
  assert.equal((await getWallet(id, today)).balance, 60)
  await assertInvariant(id)
})

test('claimBatch skips invalid entries and handles duplicates and over-cap runs', async () => {
  const id = await member()
  const result = await claimBatch(
    id,
    [
      { source: 'secret', feature: 'statue' },
      { source: 'secret', feature: 'statue' },
      gameRequest('colorrecall', 20, 'batch-game-1'),
      gameRequest('sketch', 20, 'batch-game-2'),
      { source: 'coin', tzOffsetMinutes: 0 },
      { source: 'bogus' },
    ],
    now,
  )
  assert.deepEqual(result, {
    results: [
      { granted: 10, balance: 10, capped: false },
      { granted: 0, balance: 10, capped: false, already: true },
      { granted: 20, balance: 30, capped: false },
      { granted: 5, balance: 35, capped: false },
      { granted: 10, balance: 45, capped: false },
    ],
    balance: 45,
  })
  assert.equal(granted(result.results), 45)
  assert.equal((await getWallet(id, today)).balance, 45)
  await assertInvariant(id)
})

test('an art claim needs an existing published piece', async () => {
  const id = await member()
  const live = await piece('live')
  const draft = await piece('draft')
  assert.deepEqual(await claim(id, { source: 'art', pieceId: live }, now), {
    granted: 5,
    balance: 5,
    capped: false,
  })
  assert.deepEqual(await claim(id, { source: 'art', pieceId: live }, now), {
    granted: 0,
    balance: 5,
    capped: false,
    already: true,
  })
  assert.deepEqual(
    await claim(id, { source: 'art', pieceId: '00000000-0000-0000-0000-000000000000' }, now),
    { error: 'invalid' },
  )
  assert.deepEqual(await claim(id, { source: 'art', pieceId: draft }, now), { error: 'invalid' })
  await assertInvariant(id)
})

test('the balance invariant holds after 200 random operations', async () => {
  const id = await member()
  const catalog = Object.keys(ITEMS)
  for (let i = 0; i < 200; i++) {
    if (Math.random() < 0.7) {
      const requests = [
        { source: 'welcome' },
        { source: 'coin', tzOffsetMinutes: 0 },
        { source: 'note', tzOffsetMinutes: 0 },
        {
          source: 'secret',
          feature: SECRET_FEATURES[Math.floor(Math.random() * SECRET_FEATURES.length)],
        },
        gameRequest(Math.random() < 0.5 ? 'colorrecall' : 'sketch', Math.floor(Math.random() * 11)),
        { source: 'bogus' },
      ]
      const request = requests[Math.floor(Math.random() * requests.length)]
      const result = await claim(id, request, now)
      assert.ok('granted' in result || result.error === 'invalid')
    } else {
      const itemId = catalog[Math.floor(Math.random() * catalog.length)]
      const result = await buy(id, itemId)
      assert.ok('balance' in result || result.error === 'insufficient')
    }
    await assertInvariant(id)
  }
})

test('deleting a member cascades to the wallet, claims and items', async () => {
  const id = await member()
  await grantWelcome(id)
  await claim(id, { source: 'coin', tzOffsetMinutes: 0 }, now)
  assert.ok('balance' in (await buy(id, 'bow:kiki')))

  assert.equal(await deleteMember(id, PASSWORD), true)
  for (const table of ['wallets', 'coin_claims', 'wallet_items']) {
    const rows = await query(`select 1 from ${table} where member_id = $1`, [id])
    assert.equal(rows.length, 0, `${table} still has rows`)
  }
})
