import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { after, test } from 'node:test'
import {
  POND_MIN_REEL_MS,
  castPond,
  chainPondBait,
  claimPondBounty,
  exchangePearls,
  getPondBounties,
  getPondDex,
  getPondFeed,
  getPondLeaderboard,
  getPondState,
  isoWeek,
  pondBountiesFor,
  reelPond,
  type PondCastResult,
} from '../src/index.ts'
import { buyPondBait } from '../src/domain/pond.ts'
import { signUp } from '../src/domain/members.ts'
import { nameFromSeed } from '../src/presence/names.ts'
import { closePool, query, queryOne } from '../src/infra/db.ts'

after(() => closePool())

const PASSWORD = 'correct horse'
const SECRET = 'pond-db-test-secret'

function randomId(): string {
  return randomBytes(8).toString('hex')
}

async function member(): Promise<string> {
  const result = await signUp(`pond-${randomId()}@example.test`, PASSWORD)
  assert.ok('member' in result, `sign-up failed: ${JSON.stringify(result)}`)
  return result.member.id
}

interface StatePatch {
  pearls?: number
  streak?: number
  pity?: number
  lucky?: number
  chainLevel?: number
  chainPot?: number
  chainCatch?: string | null
  wageredDay?: string | null
  wageredToday?: number
}

const COLUMNS: Record<keyof StatePatch, string> = {
  pearls: 'pearls',
  streak: 'streak',
  pity: 'pity',
  lucky: 'lucky',
  chainLevel: 'chain_level',
  chainPot: 'chain_pot',
  chainCatch: 'chain_catch',
  wageredDay: 'wagered_day',
  wageredToday: 'wagered_today',
}

async function setState(memberId: string, patch: StatePatch): Promise<void> {
  await query(`insert into pond_state (member_id) values ($1) on conflict do nothing`, [memberId])
  const params: unknown[] = [memberId]
  const sets: string[] = []
  for (const [key, value] of Object.entries(patch) as [keyof StatePatch, unknown][]) {
    params.push(value)
    sets.push(`${COLUMNS[key]} = $${params.length}`)
  }
  if (sets.length > 0) {
    await query(`update pond_state set ${sets.join(', ')} where member_id = $1`, params)
  }
}

async function clearCatches(): Promise<void> {
  await query(`delete from pond_catches`)
}

async function grantPearls(memberId: string, amount: number): Promise<void> {
  await query(
    `insert into pond_state (member_id, pearls) values ($1, $2)
     on conflict (member_id) do update set pearls = pond_state.pearls + excluded.pearls`,
    [memberId, amount],
  )
}

interface CatchExtra {
  species?: string
  variant?: string
  sizeCm?: number
  odds?: number
  score?: number
  trophy?: boolean
  week?: string
}

async function insertCatch(
  memberId: string,
  tier: 'common' | 'uncommon' | 'rare' | 'legendary',
  pearls: number,
  at: Date,
  extra: CatchExtra = {},
): Promise<string> {
  const species =
    extra.species ??
    (tier === 'common' ? 'star-snapper' : tier === 'uncommon' ? 'crab' : tier === 'rare' ? 'puffer' : 'blobfish')
  const row = await queryOne<{ id: string }>(
    `insert into pond_catches
       (member_id, species, tier, variant, size_cm, pearls, odds, week, at, score, trophy)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     returning id`,
    [
      memberId,
      species,
      tier,
      extra.variant ?? 'normal',
      extra.sizeCm ?? 20,
      pearls,
      extra.odds ?? 0.5,
      extra.week ?? isoWeek(at),
      at,
      extra.score ?? pearls,
      extra.trophy ?? false,
    ],
  )
  assert.ok(row)
  return row.id
}

async function namedMember(name: string): Promise<string> {
  const id = await member()
  await query(`update members set display_name = $2 where id = $1`, [id, name])
  return id
}

function castResult(result: PondCastResult): Extract<PondCastResult, { ticket: string }> {
  assert.ok('ticket' in result, `cast failed: ${JSON.stringify(result)}`)
  return result
}

function reelTime(castAt: Date): Date {
  return new Date(castAt.getTime() + POND_MIN_REEL_MS + 10)
}

function ticketSpecies(ticket: string): string {
  const [payload] = ticket.split('.')
  return (JSON.parse(Buffer.from(payload, 'base64url').toString()) as { k: string }).k
}

test('a landed cast records a catch, credits pearls and collects the species trophy', async () => {
  const id = await member()
  const castAt = new Date()
  const cast = castResult(await castPond(id, { bait: 'worm' }, SECRET, castAt))
  const reel = await reelPond(
    id,
    { ticket: cast.ticket, landed: true, perfectCast: false, perfectHook: false, treasureGrabbed: false },
    SECRET,
    reelTime(castAt),
  )
  assert.ok('catch' in reel, JSON.stringify(reel))
  assert.ok(reel.catch.pearls >= 1)
  assert.equal(reel.state.pearls, reel.catch.pearls)
  assert.equal(reel.trophyCollected, true)

  const rows = await query(
    `select species, tier, variant, size_cm, pearls, week from pond_catches where member_id = $1`,
    [id],
  )
  assert.equal(rows.length, 1)
  assert.equal((rows[0] as { species: string }).species, reel.catch.species)
  const trophy = await query(`select 1 from wallet_items where member_id = $1 and item_id = $2`, [
    id,
    `prop:fish-${reel.catch.species}`,
  ])
  assert.equal(trophy.length, 1)
})

test('a lost fish resets the streak and empties the chain pot', async () => {
  const id = await member()
  await setState(id, { streak: 3, chainLevel: 2, chainPot: 7 })
  const castAt = new Date()
  const cast = castResult(await castPond(id, { bait: 'worm', chain: true }, SECRET, castAt))
  const reel = await reelPond(id, { ticket: cast.ticket, landed: false }, SECRET, reelTime(castAt))
  assert.ok('lost' in reel)
  assert.equal(reel.state.streak, 0)
  assert.deepEqual(reel.state.chain, { level: 0, pot: 0 })
})

test('a won wager pays its locked multiplier, and a wrong tier loses the stake', async () => {
  const winner = await member()
  await setState(winner, { pity: 120, pearls: 100 })
  const wonAt = new Date()
  const wonCast = castResult(
    await castPond(winner, { bait: 'worm', wager: { tier: 'legendary', stake: 5 } }, SECRET, wonAt),
  )
  const won = await reelPond(
    winner,
    { ticket: wonCast.ticket, landed: true, perfectCast: false, perfectHook: false, treasureGrabbed: false },
    SECRET,
    reelTime(wonAt),
  )
  assert.ok('catch' in won)
  assert.equal(won.catch.species, 'blobfish')
  assert.equal(won.wagerWon, 5)

  const loser = await member()
  await setState(loser, { pearls: 200 })
  const lostAt = new Date()
  let lostCast = castResult(
    await castPond(loser, { bait: 'worm', wager: { tier: 'common', stake: 5 } }, SECRET, lostAt),
  )
  for (let attempt = 0; attempt < 20 && ticketSpecies(lostCast.ticket) === 'star-snapper'; attempt++) {
    lostCast = castResult(
      await castPond(loser, { bait: 'worm', wager: { tier: 'common', stake: 5 } }, SECRET, lostAt),
    )
  }
  assert.notEqual(ticketSpecies(lostCast.ticket), 'star-snapper')
  const lost = await reelPond(
    loser,
    { ticket: lostCast.ticket, landed: true, perfectCast: false, perfectHook: false, treasureGrabbed: false },
    SECRET,
    reelTime(lostAt),
  )
  assert.ok('catch' in lost)
  assert.equal(lost.wagerWon, 0)
})

test('the wager cap is per UTC day and resets with the day', async () => {
  const id = await member()
  const now = new Date()
  await setState(id, { pearls: 100, wageredDay: now.toISOString().slice(0, 10), wageredToday: 195 })
  const capped = await castPond(id, { bait: 'worm', wager: { tier: 'common', stake: 10 } }, SECRET, now)
  assert.deepEqual(capped, { error: 'wager_cap' })

  await setState(id, { wageredDay: '2026-01-01', wageredToday: 200 })
  const nextDay = castResult(
    await castPond(id, { bait: 'worm', wager: { tier: 'common', stake: 5 } }, SECRET, now),
  )
  assert.equal(nextDay.wager?.stake, 5)
  assert.equal(nextDay.state.wageredToday, 5)
})

test('buying bait spends pearls and refuses when they are short', async () => {
  const id = await member()
  await grantPearls(id, 20)
  const bought = await buyPondBait(id, 'shrimp')
  assert.ok('state' in bought)
  assert.equal(bought.state.pearls, 0)
  assert.deepEqual(bought.state.bait, { shrimp: 5 })
  assert.deepEqual(await buyPondBait(id, 'cupcake'), { error: 'insufficient' })
})

test('only the last landed common or uncommon can become chain bait', async () => {
  const id = await member()
  const first = await insertCatch(id, 'common', 4, new Date(Date.now() - 2000))
  const chained = await chainPondBait(id, first)
  assert.ok('state' in chained)
  assert.deepEqual(chained.state.chain, { level: 1, pot: 4 })

  const second = await insertCatch(id, 'common', 6, new Date())
  const linked = await chainPondBait(id, second)
  assert.ok('state' in linked)
  assert.deepEqual(linked.state.chain, { level: 2, pot: 10 })
  assert.deepEqual(await chainPondBait(id, second), { error: 'not_chainable' })

  const other = await member()
  const common = await insertCatch(other, 'common', 4, new Date(Date.now() - 2000))
  const rare = await insertCatch(other, 'rare', 8, new Date())
  assert.deepEqual(await chainPondBait(other, common), { error: 'not_chainable' })
  assert.ok(rare)
})

test('exchange turns ten pearls into a stamp and stops at twenty stamps a day', async () => {
  const id = await member()
  await grantPearls(id, 250)
  const now = new Date('2026-11-01T12:00:00Z')

  const first = await exchangePearls(id, { pearls: 100 }, now, 0)
  assert.ok('granted' in first)
  assert.equal(first.granted, 10)
  assert.equal(first.balance, 10)
  assert.equal(first.capped, false)
  assert.equal(first.state.pearls, 150)

  const second = await exchangePearls(id, { pearls: 150 }, now, 0)
  assert.ok('granted' in second)
  assert.equal(second.granted, 10)
  assert.equal(second.balance, 20)
  assert.equal(second.capped, true)
  assert.equal(second.state.pearls, 50)

  const third = await exchangePearls(id, { pearls: 50 }, now, 0)
  assert.ok('granted' in third)
  assert.equal(third.granted, 0)
  assert.equal(third.capped, true)
  assert.equal(third.state.pearls, 50)
  assert.equal(third.balance, 20)

  const poor = await member()
  await grantPearls(poor, 5)
  assert.deepEqual(await exchangePearls(poor, { pearls: 20 }, now, 0), { error: 'insufficient' })
  const state = await getPondState(id, now)
  assert.equal(state.pearls, 50)
})

test('a ticket cannot be reeled twice', async () => {
  const id = await member()
  const castAt = new Date()
  const cast = castResult(await castPond(id, { bait: 'worm' }, SECRET, castAt))
  const body = { ticket: cast.ticket, landed: false }
  const first = await reelPond(id, body, SECRET, reelTime(castAt))
  assert.ok('lost' in first)
  assert.deepEqual(await reelPond(id, body, SECRET, reelTime(castAt)), { error: 'used_ticket' })
})


test('biggest keeps the top ten and fills me with the two rows above', async () => {
  await clearCatches()
  const now = new Date()
  const ids: string[] = []
  for (let index = 0; index < 12; index++) {
    const id = await namedMember(`Rank ${String(index + 1).padStart(2, '0')}`)
    ids.push(id)
    await insertCatch(id, 'common', 12 - index, now, {
      score: 12 - index,
      sizeCm: 20 + index / 10,
    })
  }

  const board = await getPondLeaderboard('biggest', 'week', ids[11], now)
  assert.equal(board.week, isoWeek(now))
  assert.equal(board.rows.length, 10)
  assert.deepEqual(board.rows.map((row) => row.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  assert.deepEqual(board.rows.map((row) => row.value), [12, 11, 10, 9, 8, 7, 6, 5, 4, 3])
  assert.equal(board.me?.rank, 12)
  assert.equal(board.me?.value, 1)
  assert.deepEqual(board.me?.above.map((row) => row.rank), [10, 11])
})

test('biggest ties share a rank and generated names fall back without writes', async () => {
  await clearCatches()
  const now = new Date()
  const first = await namedMember('Tie A')
  const second = await namedMember('Tie B')
  const generated = await member()
  await query(`update members set display_name = null, name_seed = $2 where id = $1`, [
    generated,
    12345,
  ])
  await insertCatch(first, 'common', 50, now, { score: 50, sizeCm: 21 })
  await insertCatch(second, 'common', 50, now, { score: 50, sizeCm: 22 })
  await insertCatch(generated, 'common', 40, now, { score: 40, sizeCm: 20 })

  const board = await getPondLeaderboard('biggest', 'week', null, now)
  assert.deepEqual(board.rows.map((row) => row.rank), [1, 1, 3])
  assert.ok(board.rows.some((row) => row.name === nameFromSeed(12345)))
})

test('weekly boards filter by ISO week while all-time does not', async () => {
  await clearCatches()
  const oldAt = new Date('2000-01-03T12:00:00Z')
  const old = await namedMember('Old Best')
  await insertCatch(old, 'common', 999, oldAt, { score: 999, week: isoWeek(oldAt) })
  const current = await namedMember('Current Best')
  await insertCatch(current, 'common', 10, new Date(), { score: 10 })

  const week = await getPondLeaderboard('biggest', 'week', null, new Date())
  assert.deepEqual(week.rows.map((row) => row.name), ['Current Best'])
  const all = await getPondLeaderboard('biggest', 'all', null, new Date())
  assert.equal(all.rows[0]?.name, 'Old Best')
})

test('haul sums catch pearls and rarest breaks equal odds by size', async () => {
  await clearCatches()
  const now = new Date()
  const first = await namedMember('Haul A')
  const second = await namedMember('Haul B')
  await insertCatch(first, 'common', 10, now)
  await insertCatch(first, 'common', 5, now)
  await insertCatch(second, 'common', 12, now)

  const haul = await getPondLeaderboard('haul', 'week', first, now)
  assert.deepEqual(haul.rows.map((row) => [row.name, row.value]), [
    ['Haul A', 15],
    ['Haul B', 12],
  ])
  assert.equal(haul.rows[0]?.species, null)
  assert.equal(haul.me?.rank, 1)

  const third = await namedMember('Rare C')
  await insertCatch(first, 'rare', 8, now, { odds: 0.001, sizeCm: 10 })
  await insertCatch(second, 'rare', 8, now, { odds: 0.001, sizeCm: 20 })
  await insertCatch(third, 'legendary', 8, now, { odds: 0.0005, sizeCm: 5 })

  const rarest = await getPondLeaderboard('rarest', 'week', null, now)
  assert.deepEqual(
    rarest.rows.map((row) => [row.name, row.rank, row.value, row.sizeCm]),
    [
      ['Rare C', 1, 0.0005, 5],
      ['Haul B', 2, 0.001, 20],
      ['Haul A', 3, 0.001, 10],
    ],
  )
})

test('feed shows only rare, legendary or non-normal catches, newest first', async () => {
  await clearCatches()
  const id = await namedMember('Feed Tester')
  const now = Date.now()
  await insertCatch(id, 'common', 2, new Date(now - 4000))
  await insertCatch(id, 'rare', 8, new Date(now - 3000), { trophy: true })
  await insertCatch(id, 'common', 2, new Date(now - 2000), { variant: 'shiny' })
  await insertCatch(id, 'legendary', 40, new Date(now - 1000))

  const feed = await getPondFeed()
  assert.equal(feed.length, 3)
  assert.deepEqual(feed.map((item) => item.species), ['blobfish', 'star-snapper', 'puffer'])
  assert.equal(feed[0]?.name, 'Feed Tester')
  assert.equal(feed[1]?.variant, 'shiny')
  assert.equal(feed[2]?.trophy, true)
  assert.ok(feed.every((item) => item.id.length > 0))
})

test('dex counts caught cells and their best size', async () => {
  await clearCatches()
  const id = await namedMember('Dex Tester')
  const other = await namedMember('Other Dex')
  const now = new Date()
  await insertCatch(id, 'common', 2, now, { species: 'star-snapper', sizeCm: 22 })
  await insertCatch(id, 'common', 2, now, { species: 'star-snapper', sizeCm: 30 })
  await insertCatch(id, 'common', 2, now, { species: 'star-snapper', variant: 'shiny', sizeCm: 25 })
  await insertCatch(id, 'uncommon', 4, now, { species: 'crab', variant: 'golden', sizeCm: 18 })
  await insertCatch(other, 'rare', 8, now, { species: 'puffer', sizeCm: 40 })

  const dex = await getPondDex(id)
  assert.deepEqual(dex.entries['star-snapper']?.['normal'], { count: 2, bestCm: 30 })
  assert.deepEqual(dex.entries['star-snapper']?.['shiny'], { count: 1, bestCm: 25 })
  assert.deepEqual(dex.entries['crab']?.['golden'], { count: 1, bestCm: 18 })
  assert.deepEqual(dex.totals, { found: 3, possible: 20 })
})

test('bounties progress from today catches and a claim pays once', async () => {
  await clearCatches()
  const now = new Date()
  const noon = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 12))
  const day = noon.toISOString().slice(0, 10)
  const id = await namedMember('Bounty Tester')

  const species = ['star-snapper', 'crab', 'puffer'] as const
  const tiers = ['common', 'uncommon', 'rare'] as const
  for (let index = 0; index < 15; index++) {
    const which = index % 3
    await insertCatch(id, tiers[which], 10, noon, {
      species: species[which],
      variant: index === 0 ? 'shiny' : 'normal',
      sizeCm: species[which] === 'crab' ? 26 : 20,
      trophy: index === 1,
      score: 10,
    })
  }

  const board = await getPondBounties(id, noon)
  assert.equal(board.day, day)
  assert.equal(board.bounties.length, 3)
  assert.deepEqual(
    board.bounties.map((bounty) => bounty.id),
    pondBountiesFor(day).map((bounty) => bounty.id),
  )
  for (const bounty of board.bounties) {
    assert.equal(bounty.done, true)
    assert.equal(bounty.claimed, false)
    assert.ok(bounty.progress >= bounty.target)
    assert.ok(bounty.reward >= 15 && bounty.reward <= 60)
  }

  const first = board.bounties[0]
  const claimed = await claimPondBounty(id, first.id, noon)
  assert.ok('state' in claimed)
  assert.equal(claimed.state.pearls, first.reward)
  assert.equal(claimed.bounties.bounties.find((bounty) => bounty.id === first.id)?.claimed, true)
  assert.deepEqual(await claimPondBounty(id, first.id, noon), { error: 'already_claimed' })

  const empty = await namedMember('Empty Bounty')
  const emptyBoard = await getPondBounties(empty, noon)
  assert.ok(emptyBoard.bounties.every((bounty) => !bounty.done))
  assert.deepEqual(await claimPondBounty(empty, emptyBoard.bounties[0].id, noon), {
    error: 'not_done',
  })
  assert.deepEqual(await claimPondBounty(empty, 'not-a-bounty', noon), { error: 'invalid' })
})
