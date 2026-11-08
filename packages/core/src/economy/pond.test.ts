import assert from 'node:assert/strict'
import { createHmac } from 'node:crypto'
import { test } from 'node:test'
import {
  pondShadowFor,
  POND_BAIT,
  POND_BAIT_COST,
  POND_FISH,
  POND_MAX_REEL_MS,
  POND_MIN_REEL_MS,
  POND_SPECIES,
  isoWeek,
  issuePondTicket,
  pondBountiesFor,
  pondBountyProgress,
  pondCatchPearls,
  pondChainPayout,
  pondFishFor,
  pondMoon,
  pondOdds,
  pondPayoutMultiplier,
  pondSizeFor,
  pondSpeciesFor,
  pondSpeciesWeights,
  pondStreakMultiplier,
  pondVariantFor,
  pondVariantOdds,
  pondWeights,
  readPondTicket,
} from './pond.ts'

const SECRET = 'test-secret'

function forgedTicket(body: Record<string, unknown>): string {
  const payload = Buffer.from(JSON.stringify(body)).toString('base64url')
  const signature = createHmac('sha256', SECRET).update(`pond-ticket:${payload}`).digest('base64url')
  return `${payload}.${signature}`
}

test('a ticket reels in a fish for its own member after the bite delay', () => {
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000, 'worm')
  const result = readPondTicket(SECRET, ticket, 'member-a', 1_000 + POND_MIN_REEL_MS)
  assert.ok(result.ok)
  assert.equal(result.bait, 'worm')
  assert.ok(POND_FISH.some((fish) => fish.id === result.fish))
  // The same ticket always rolls the same fish.
  assert.deepEqual(readPondTicket(SECRET, ticket, 'member-a', 5_000), result)
})

test('a ticket carries its bait and rolls with that bait weights', () => {
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000, 'cupcake')
  const [payload] = ticket.split('.')
  const body = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { b: string }
  assert.equal(body.b, 'cupcake')

  const result = readPondTicket(SECRET, ticket, 'member-a', 5_000)
  assert.ok(result.ok)
  assert.equal(result.bait, 'cupcake')
  const roll =
    createHmac('sha256', SECRET).update(`pond-fish:${result.nonce}`).digest().readUInt32BE(0) / 2 ** 32
  assert.equal(result.fish, pondFishFor(roll, 'cupcake'))
})

test('a ticket is refused too early, too late, for another member, or tampered with', () => {
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000, 'worm')
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

test('a ticket with an unknown or missing bait is invalid', () => {
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000, 'worm')
  const [payload] = ticket.split('.')
  const body = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Record<string, unknown>
  assert.deepEqual(readPondTicket(SECRET, forgedTicket({ ...body, b: 'nope' }), 'member-a', 5_000), {
    ok: false,
    reason: 'invalid',
  })
  const { b: _bait, ...withoutBait } = body
  assert.deepEqual(readPondTicket(SECRET, forgedTicket(withoutBait), 'member-a', 5_000), {
    ok: false,
    reason: 'invalid',
  })
})

test('fish odds follow the base weights', () => {
  assert.equal(pondFishFor(0), 'star-snapper')
  assert.equal(pondFishFor(0.449), 'star-snapper')
  assert.equal(pondFishFor(0.45), 'crab')
  assert.equal(pondFishFor(0.749), 'crab')
  assert.equal(pondFishFor(0.75), 'puffer')
  assert.equal(pondFishFor(0.949), 'puffer')
  assert.equal(pondFishFor(0.95), 'blobfish')
  assert.equal(pondFishFor(1), 'blobfish')
})

test('bait multiplies its species weight', () => {
  assert.deepEqual(pondWeights('worm'), POND_FISH.map((fish) => ({ id: fish.id, weight: fish.weight })))
  assert.deepEqual(pondWeights('shrimp'), [
    { id: 'star-snapper', weight: 45 },
    { id: 'crab', weight: 90 },
    { id: 'puffer', weight: 20 },
    { id: 'blobfish', weight: 5 },
  ])
  assert.deepEqual(pondWeights('berry'), [
    { id: 'star-snapper', weight: 45 },
    { id: 'crab', weight: 30 },
    { id: 'puffer', weight: 60 },
    { id: 'blobfish', weight: 5 },
  ])
  assert.deepEqual(pondWeights('cupcake'), [
    { id: 'star-snapper', weight: 45 },
    { id: 'crab', weight: 30 },
    { id: 'puffer', weight: 20 },
    { id: 'blobfish', weight: 20 },
  ])
  assert.equal(POND_BAIT.shrimp.pack, 5)
  assert.equal(POND_BAIT.cupcake.price, 9)
})

test('fish odds follow the bait weights', () => {
  assert.equal(pondFishFor(0.28, 'shrimp'), 'star-snapper')
  assert.equal(pondFishFor(0.29, 'shrimp'), 'crab')
  assert.equal(pondFishFor(0.8, 'berry'), 'puffer')
  assert.equal(pondFishFor(0.9, 'cupcake'), 'blobfish')
})


test('the build-contract species table carries tiers, pearls and sizes', () => {
  assert.deepEqual(
    POND_SPECIES.map((fish) => [fish.id, fish.tier, fish.weight, fish.pearls, fish.medianCm, fish.minCm, fish.maxCm, fish.fight]),
    [
      ['star-snapper', 'common', 55, 2, 22, 14, 40, 0],
      ['crab', 'uncommon', 28, 4, 18, 10, 34, 1],
      ['puffer', 'rare', 14, 8, 26, 15, 45, 2],
      ['blobfish', 'legendary', 3, 40, 35, 22, 60, 3],
    ],
  )
  assert.deepEqual(POND_BAIT_COST, {
    worm: { pack: 0, cost: 0 },
    shrimp: { pack: 5, cost: 20 },
    berry: { pack: 5, cost: 20 },
    cupcake: { pack: 3, cost: 40 },
  })
})

test('tier odds and payouts follow the weights and the 10% cut', () => {
  const odds = pondOdds({ bait: 'worm', chainLevel: 0, pity: 0 })
  assert.deepEqual(odds.tiers, { common: 0.55, uncommon: 0.28, rare: 0.14, legendary: 0.03 })
  assert.deepEqual(odds.payouts, { common: 1.6, uncommon: 3.2, rare: 6.4, legendary: 30 })
  assert.equal(pondPayoutMultiplier(0.5), 1.8)
  assert.equal(pondPayoutMultiplier(0), 0)
  assert.equal(pondPayoutMultiplier(1), 0.9)

  const shrimp = pondOdds({ bait: 'shrimp', chainLevel: 0, pity: 0 })
  assert.deepEqual(shrimp.tiers, {
    common: 55 / 156,
    uncommon: 84 / 156,
    rare: 14 / 156,
    legendary: 3 / 156,
  })
})

test('live bait doubles then triples rare and legendary weights', () => {
  const one = pondSpeciesWeights({ bait: 'worm', chainLevel: 1, pity: 0 })
  const two = pondSpeciesWeights({ bait: 'worm', chainLevel: 2, pity: 0 })
  assert.deepEqual(one.map((fish) => fish.weight), [55, 28, 28, 6])
  assert.deepEqual(two.map((fish) => fish.weight), [55, 28, 42, 9])
})

test('pity lifts the legendary from cast 60 and guarantees it at 120', () => {
  const soft = pondSpeciesWeights({ bait: 'worm', chainLevel: 0, pity: 60 })
  assert.equal(soft.find((fish) => fish.tier === 'legendary')?.weight, 6)
  const later = pondSpeciesWeights({ bait: 'worm', chainLevel: 0, pity: 119 })
  assert.equal(later.find((fish) => fish.tier === 'legendary')?.weight, 183)
  const certain = pondOdds({ bait: 'worm', chainLevel: 0, pity: 120 })
  assert.equal(certain.tiers.legendary, 1)
  assert.equal(certain.tiers.common, 0)
  assert.equal(pondSpeciesFor(0, { bait: 'worm', chainLevel: 0, pity: 120 }), 'blobfish')
  assert.equal(pondSpeciesFor(0.999999, { bait: 'worm', chainLevel: 0, pity: 120 }), 'blobfish')
})

test('size is log-normal around the median, clamped, and top 1% is trophy', () => {
  const median = pondSizeFor(0.5, 'star-snapper')
  assert.equal(median.sizeCm, 22)
  assert.equal(median.trophy, false)
  assert.equal(pondSizeFor(0, 'star-snapper').sizeCm, 14)
  assert.equal(pondSizeFor(1, 'star-snapper').sizeCm, 40)
  assert.equal(pondSizeFor(0.5, 'star-snapper', true).sizeCm, 24.2)
  assert.equal(pondSizeFor(0.995, 'blobfish').trophy, true)
  assert.equal(pondSizeFor(0.98, 'blobfish').trophy, false)
})

test('variant odds include full moon and a lucky charm tripling every chance', () => {
  const normal = pondVariantOdds()
  assert.equal(normal.reduce((sum, row) => sum + row.probability, 0), 1)
  const byId = Object.fromEntries(normal.map((row) => [row.variant, row.probability]))
  assert.ok(Math.abs(byId.shiny - 1 / 40) < 1e-12)
  assert.ok(Math.abs(byId.golden - 1 / 200) < 1e-12)
  assert.ok(Math.abs(byId.moonlit - 1 / 600) < 1e-12)
  assert.ok(Math.abs(byId.prismatic - 1 / 2500) < 1e-12)

  const full = pondVariantOdds(false, true)
  assert.ok(Math.abs((full.find((row) => row.variant === 'moonlit')?.probability ?? 0) - 1 / 150) < 1e-12)

  const lucky = pondVariantOdds(true, false)
  assert.ok(Math.abs((lucky.find((row) => row.variant === 'shiny')?.probability ?? 0) - 3 / 40) < 1e-12)
  assert.equal(pondVariantFor(0), 'prismatic')
  assert.equal(pondVariantFor(0.999999), 'normal')
})

test('streak multipliers rise to a x3 cap', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 5, 9].map(pondStreakMultiplier), [1, 1, 1.25, 1.5, 2, 3, 3])
})

test('catch pearls combine base, size, variant and streak with a floor of one', () => {
  const catchResult = pondCatchPearls('star-snapper', 22, 'normal', 1)
  assert.equal(catchResult.pearls, 2)
  assert.deepEqual(catchResult.breakdown, { base: 2, size: 1, variant: 1, streak: 1 })
  const big = pondCatchPearls('blobfish', 60, 'prismatic', 5)
  assert.ok(big.pearls > 40 * 25 * 3)
  assert.equal(pondCatchPearls('blobfish', 1, 'normal', 1).pearls, 1)
})

test('chain payouts pay 1.5x or 2x the pot and round to pearls', () => {
  assert.equal(pondChainPayout(10, 1), 15)
  assert.equal(pondChainPayout(10, 2), 20)
  assert.equal(pondChainPayout(7, 1), 11)
  assert.equal(pondChainPayout(10, 0), 0)
})

test('full moon days sit within a day of the synodic full moon', () => {
  assert.equal(pondMoon(new Date('2024-04-23T23:49:00Z')), 'full')
  assert.equal(pondMoon(new Date('2024-04-24T12:00:00Z')), 'full')
  assert.equal(pondMoon(new Date('2024-04-21T12:00:00Z')), 'other')
  assert.equal(isoWeek(new Date('2026-11-07T12:00:00Z')), '2026-W45')
  assert.equal(isoWeek(new Date('2026-11-02T00:00:00Z')), '2026-W45')
  assert.equal(isoWeek(new Date('2026-11-09T00:00:00Z')), '2026-W46')
})

test('a ticket carries the locked species, wager, chain and lucky flag', () => {
  const wager = { tier: 'rare' as const, stake: 25, multiplier: 6.4 }
  const ticket = issuePondTicket(SECRET, 'member-a', 1_000, 'berry', {
    species: 'puffer',
    wager,
    chainLevel: 2,
    chainPot: 13,
    lucky: true,
    treasure: true,
  })
  const result = readPondTicket(SECRET, ticket, 'member-a', 5_000)
  assert.ok(result.ok)
  assert.equal(result.species, 'puffer')
  assert.equal(result.fish, 'puffer')
  assert.deepEqual(result.wager, wager)
  assert.equal(result.chainLevel, 2)
  assert.equal(result.chainPot, 13)
  assert.equal(result.lucky, true)
  assert.equal(result.treasure, true)
  assert.ok(ticket.length <= 300)
})

test('shadows grow with the tier, and a legendary always looks huge', () => {
  assert.equal(pondShadowFor(0.99, 'legendary'), 'huge')
  assert.equal(pondShadowFor(0, 'legendary'), 'huge')
  assert.equal(pondShadowFor(0, 'common'), 'tiny')
  assert.equal(pondShadowFor(0.95, 'common'), 'big')
  assert.equal(pondShadowFor(0, 'rare'), 'big')
})


test('daily bounties are deterministic, distinct and valid', () => {
  const day = '2026-11-07'
  const first = pondBountiesFor(day)
  assert.deepEqual(pondBountiesFor(day), first)
  assert.equal(first.length, 3)
  assert.equal(new Set(first.map((bounty) => bounty.id)).size, 3)
  for (const bounty of first) {
    assert.ok(['fish', 'crab', 'puffer', 'variant', 'trophy', 'species', 'pearls'].includes(bounty.kind))
    assert.ok(bounty.text.length > 0)
    assert.ok(bounty.target > 0)
    assert.ok(bounty.reward >= 15 && bounty.reward <= 60)
    if (bounty.kind === 'fish') assert.ok(bounty.target >= 5 && bounty.target <= 15)
  }
  const boards = new Set(
    Array.from({ length: 14 }, (_, index) =>
      pondBountiesFor(`2026-11-${String(index + 1).padStart(2, '0')}`)
        .map((bounty) => bounty.id)
        .join(','),
    ),
  )
  assert.ok(boards.size > 3)
})

test('bounty progress follows the catches of the day', () => {
  const catches = [
    { species: 'star-snapper', tier: 'common', variant: 'normal', sizeCm: 30, trophy: false, pearls: 3 },
    { species: 'crab', tier: 'uncommon', variant: 'shiny', sizeCm: 27, trophy: false, pearls: 9 },
    { species: 'puffer', tier: 'rare', variant: 'normal', sizeCm: 40, trophy: true, pearls: 12 },
  ] as const
  assert.equal(pondBountyProgress({ kind: 'fish', target: 5 }, catches), 3)
  assert.equal(pondBountyProgress({ kind: 'crab', target: 1 }, catches), 1)
  assert.equal(pondBountyProgress({ kind: 'puffer', target: 1 }, catches), 1)
  assert.equal(pondBountyProgress({ kind: 'variant', target: 1 }, catches), 1)
  assert.equal(pondBountyProgress({ kind: 'trophy', target: 1 }, catches), 1)
  assert.equal(pondBountyProgress({ kind: 'species', target: 3 }, catches), 3)
  assert.equal(pondBountyProgress({ kind: 'pearls', target: 60 }, catches), 24)
  assert.equal(pondBountyProgress({ kind: 'species', target: 3 }, []), 0)
})
