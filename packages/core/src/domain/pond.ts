import type { PoolClient } from 'pg'
import { isCatalogItem } from '../economy/catalog.ts'
import {
  POND_BAIT_COST,
  POND_CHAIN_MAX,
  POND_WAGER_DAILY_CAP,
  POND_WAGER_MAX,
  POND_WAGER_MIN,
  isPondBait,
  isPondTier,
  isoWeek,
  issuePondTicket,
  pondBountiesFor,
  pondBountyProgress,
  pondCatchPearls,
  pondChainPayout,
  pondMoon,
  pondNibblesFor,
  pondNonce,
  pondOdds,
  pondRoll,
  pondShadowFor,
  pondSizeFor,
  pondSpeciesById,
  pondSpeciesFor,
  pondSpeciesProbability,
  pondTreasureFor,
  pondTreasureLoot,
  pondVariantFor,
  pondVariantOdds,
  readPondTicket,
  type PondBaitId,
  type PondBountyCatch,
  type PondFishId,
  type PondOdds,
  type PondTier,
  type PondTreasure,
  type PondVariant,
  type PondWager,
} from '../economy/pond.ts'
import { EXCHANGE_DAILY_STAMPS, validateClaim } from '../economy/rules.ts'
import { hit } from '../infra/rate-limit.ts'
import { transaction } from '../infra/db.ts'

export interface PondState {
  pearls: number
  streak: number
  pity: number
  lucky: number
  chainLevel: number
  chainPot: number
  chainCatch: string | null
  wageredDay: string | null
  wageredToday: number
}

export interface PondStateView {
  pearls: number
  bait: Record<string, number>
  streak: number
  chain: { level: number; pot: number }
  lucky: number
  pity: number
  wageredToday: number
  moon: 'full' | 'other'
  odds: PondOdds
}

interface PondStateRow {
  pearls: number
  streak: number
  pity: number
  lucky: number
  chain_level: number
  chain_pot: number
  chain_catch: string | null
  wagered_day: string | null
  wagered_today: number
}

const ONCE = { limit: 1, windowSeconds: 5 * 60 }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function utcDay(now: Date): string {
  return now.toISOString().slice(0, 10)
}

function stateOf(row: PondStateRow): PondState {
  return {
    pearls: row.pearls,
    streak: row.streak,
    pity: row.pity,
    lucky: row.lucky,
    chainLevel: row.chain_level,
    chainPot: row.chain_pot,
    chainCatch: row.chain_catch,
    wageredDay: row.wagered_day,
    wageredToday: row.wagered_today,
  }
}

async function readPondState(client: PoolClient, memberId: string): Promise<PondState> {
  await client.query(`insert into pond_state (member_id) values ($1) on conflict do nothing`, [memberId])
  const { rows } = await client.query<PondStateRow>(
    `select pearls, streak, pity, lucky, chain_level, chain_pot, chain_catch,
            wagered_day::text as wagered_day, wagered_today
       from pond_state where member_id = $1`,
    [memberId],
  )
  return stateOf(rows[0])
}

async function lockPondState(client: PoolClient, memberId: string): Promise<PondState> {
  await client.query(`insert into pond_state (member_id) values ($1) on conflict do nothing`, [memberId])
  const { rows } = await client.query<PondStateRow>(
    `select pearls, streak, pity, lucky, chain_level, chain_pot, chain_catch,
            wagered_day::text as wagered_day, wagered_today
       from pond_state where member_id = $1 for update`,
    [memberId],
  )
  return stateOf(rows[0])
}

async function savePondState(client: PoolClient, memberId: string, state: PondState): Promise<void> {
  await client.query(
    `update pond_state
        set pearls = $2, streak = $3, pity = $4, lucky = $5,
            chain_level = $6, chain_pot = $7, chain_catch = $8,
            wagered_day = $9, wagered_today = $10, updated_at = now()
      where member_id = $1`,
    [
      memberId,
      state.pearls,
      state.streak,
      state.pity,
      state.lucky,
      state.chainLevel,
      state.chainPot,
      state.chainCatch,
      state.wageredDay,
      state.wageredToday,
    ],
  )
}

async function baitOf(client: PoolClient, memberId: string): Promise<Record<string, number>> {
  const { rows } = await client.query<{ bait_id: string; count: number }>(
    `select bait_id, count from wallet_bait
      where member_id = $1 and bait_id <> 'worm' and count > 0
      order by bait_id`,
    [memberId],
  )
  return Object.fromEntries(rows.map((row) => [row.bait_id, row.count]))
}

async function stateView(
  client: PoolClient,
  memberId: string,
  state: PondState,
  now: Date,
  options: { bait?: PondBaitId; chain?: boolean } = {},
): Promise<PondStateView> {
  const bait = options.bait ?? 'worm'
  const chainLevel = options.chain ? Math.max(1, state.chainLevel) : 0
  const wageredToday = state.wageredDay === utcDay(now) ? state.wageredToday : 0
  return {
    pearls: state.pearls,
    bait: await baitOf(client, memberId),
    streak: state.streak,
    chain: { level: state.chainLevel, pot: state.chainPot },
    lucky: state.lucky,
    pity: state.pity,
    wageredToday,
    moon: pondMoon(now),
    odds: pondOdds({ bait, chainLevel, pity: state.pity }),
  }
}

export async function getPondState(
  memberId: string,
  now = new Date(),
  options: { bait?: PondBaitId; chain?: boolean } = {},
): Promise<PondStateView> {
  return transaction(async (client) => {
    const state = await readPondState(client, memberId)
    return stateView(client, memberId, state, now, options)
  })
}

export type PondBaitResult = { state: PondStateView } | { error: 'unknown_bait' | 'insufficient' }

export async function buyPondBait(memberId: string, baitId: string): Promise<PondBaitResult> {
  if (baitId === 'worm' || !isPondBait(baitId)) return { error: 'unknown_bait' }
  const { pack, cost } = POND_BAIT_COST[baitId]
  return transaction(async (client) => {
    const state = await lockPondState(client, memberId)
    if (state.pearls < cost) return { error: 'insufficient' }
    await client.query(
      `insert into wallet_bait (member_id, bait_id, count) values ($1, $2, $3)
       on conflict (member_id, bait_id) do update set count = wallet_bait.count + excluded.count`,
      [memberId, baitId, pack],
    )
    const next = { ...state, pearls: state.pearls - cost }
    await savePondState(client, memberId, next)
    return { state: await stateView(client, memberId, next, new Date()) }
  })
}

export type PondCastError =
  | 'invalid_bait'
  | 'invalid_wager'
  | 'no_bait'
  | 'insufficient'
  | 'wager_cap'
  | 'no_chain'

export type PondCastResult =
  | {
      ticket: string
      shadow: 'tiny' | 'small' | 'big' | 'huge'
      nibbles: number
      fight: number
      treasure: boolean
      wager: PondWager | null
      state: PondStateView
    }
  | { error: PondCastError }

export async function castPond(
  memberId: string,
  request: unknown,
  secret: string,
  now = new Date(),
): Promise<PondCastResult> {
  if (!isRecord(request)) return { error: 'invalid_bait' }
  const baitValue = request.bait === undefined ? 'worm' : request.bait
  if (!isPondBait(baitValue)) return { error: 'invalid_bait' }
  const bait = baitValue

  let wanted: { tier: PondTier; stake: number } | null = null
  if (request.wager !== undefined && request.wager !== null) {
    if (!isRecord(request.wager)) return { error: 'invalid_wager' }
    const tier = request.wager.tier
    const stake = request.wager.stake
    if (
      !isPondTier(tier) ||
      !Number.isSafeInteger(stake) ||
      (stake as number) < POND_WAGER_MIN ||
      (stake as number) > POND_WAGER_MAX
    ) {
      return { error: 'invalid_wager' }
    }
    wanted = { tier, stake: stake as number }
  }

  const chain = request.chain === true
  const nonce = pondNonce()
  const treasure = pondTreasureFor(pondRoll(secret, 'treasure', nonce))

  return transaction(async (client) => {
    const state = await lockPondState(client, memberId)
    const day = utcDay(now)
    const wagered = state.wageredDay === day ? state.wageredToday : 0

    if (chain && state.chainLevel <= 0) return { error: 'no_chain' as const }
    if (wanted) {
      if (wagered + wanted.stake > POND_WAGER_DAILY_CAP) return { error: 'wager_cap' as const }
      if (state.pearls < wanted.stake) return { error: 'insufficient' as const }
    }

    const config = { bait, chainLevel: chain ? state.chainLevel : 0, pity: state.pity }
    const odds = pondOdds(config)
    if (wanted && !(odds.payouts[wanted.tier] > 0)) return { error: 'invalid_wager' as const }

    if (bait !== 'worm') {
      const spent = await client.query(
        `update wallet_bait set count = count - 1
          where member_id = $1 and bait_id = $2 and count > 0
          returning count`,
        [memberId, bait],
      )
      if (spent.rows.length === 0) return { error: 'no_bait' as const }
    }

    const species = pondSpeciesFor(pondRoll(secret, 'species', nonce), config)
    const fish = pondSpeciesById(species)
    const lucky = state.lucky > 0
    const wager: PondWager | null = wanted
      ? { ...wanted, multiplier: odds.payouts[wanted.tier] }
      : null

    const next: PondState = {
      ...state,
      pearls: state.pearls - (wanted?.stake ?? 0),
      pity: fish.tier === 'legendary' ? state.pity : state.pity + 1,
      lucky: lucky ? state.lucky - 1 : state.lucky,
      wageredDay: day,
      wageredToday: wanted ? wagered + wanted.stake : wagered,
    }
    await savePondState(client, memberId, next)

    return {
      ticket: issuePondTicket(secret, memberId, now.getTime(), bait, {
        nonce,
        species,
        wager,
        chainLevel: chain ? state.chainLevel : 0,
        chainPot: chain ? state.chainPot : 0,
        lucky,
        treasure,
      }),
      shadow: pondShadowFor(pondRoll(secret, 'shadow', nonce), fish.tier),
      nibbles: pondNibblesFor(pondRoll(secret, 'nibbles', nonce)),
      fight: fish.fight,
      treasure,
      wager,
      state: await stateView(client, memberId, next, now, { bait, chain }),
    }
  })
}

export type PondReelError =
  | 'invalid'
  | 'invalid_ticket'
  | 'too_soon'
  | 'expired'
  | 'used_ticket'

export interface PondCatch {
  id: string
  species: PondFishId
  tier: PondTier
  variant: PondVariant
  sizeCm: number
  trophy: boolean
  pearls: number
  breakdown: { base: number; size: number; variant: number; streak: number }
  isNewSpecies: boolean
  isNewVariant: boolean
  personalBest: boolean
}

export type PondReelResult =
  | {
      catch: PondCatch
      treasure: PondTreasure | null
      wagerWon: number | null
      chainPaid: number | null
      trophyCollected: boolean
      state: PondStateView
    }
  | { lost: true; state: PondStateView }
  | { error: PondReelError }

async function addBait(client: PoolClient, memberId: string, baitId: PondBaitId, count: number): Promise<void> {
  await client.query(
    `insert into wallet_bait (member_id, bait_id, count) values ($1, $2, $3)
     on conflict (member_id, bait_id) do update set count = wallet_bait.count + excluded.count`,
    [memberId, baitId, count],
  )
}

export async function reelPond(
  memberId: string,
  request: unknown,
  secret: string,
  now = new Date(),
): Promise<PondReelResult> {
  if (!isRecord(request)) return { error: 'invalid' }
  const landed = request.landed
  if (typeof landed !== 'boolean') return { error: 'invalid' }
  const perfectCast = request.perfectCast === true
  const treasureGrabbed = request.treasureGrabbed === true

  const check = readPondTicket(secret, request.ticket, memberId, now.getTime())
  if (!check.ok) {
    return { error: check.reason === 'invalid' ? 'invalid_ticket' : check.reason }
  }

  const once = await hit(`pond-ticket:${check.nonce}`, ONCE)
  if (!once.allowed) return { error: 'used_ticket' }

  return transaction(async (client) => {
    const state = await lockPondState(client, memberId)
    const species = pondSpeciesById(check.species)

    if (!landed) {
      const next: PondState = {
        ...state,
        streak: 0,
        pity: species.tier === 'legendary' ? state.pity + 1 : state.pity,
        chainLevel: 0,
        chainPot: 0,
        chainCatch: null,
      }
      await savePondState(client, memberId, next)
      return { lost: true as const, state: await stateView(client, memberId, next, now) }
    }

    const moon = pondMoon(now)
    const size = pondSizeFor(pondRoll(secret, 'size', check.nonce), species.id, perfectCast)
    const variant = pondVariantFor(pondRoll(secret, 'variant', check.nonce), check.lucky, moon === 'full')
    const streak = state.streak + 1
    const { pearls: catchPearls, breakdown } = pondCatchPearls(species.id, size.sizeCm, variant, streak)
    const { pearls: score } = pondCatchPearls(species.id, size.sizeCm, variant, 1)

    const castPity =
      species.tier === 'legendary' ? state.pity : Math.max(0, state.pity - 1)
    const speciesOdds = pondSpeciesProbability(
      { bait: check.bait, chainLevel: check.chainLevel, pity: castPity },
      species.id,
    )
    const variantOdds =
      pondVariantOdds(check.lucky, moon === 'full').find((row) => row.variant === variant)?.probability ?? 1

    const wagerWon = check.wager
      ? species.tier === check.wager.tier
        ? Math.round(check.wager.stake * check.wager.multiplier)
        : 0
      : null
    const chainPaid = check.chainLevel > 0 ? pondChainPayout(check.chainPot, check.chainLevel) : null

    let treasure: PondTreasure | null = null
    let treasurePearls = 0
    let lucky = state.lucky
    if (check.treasure && treasureGrabbed) {
      treasure = pondTreasureLoot(
        pondRoll(secret, 'loot', check.nonce),
        pondRoll(secret, 'loot-detail', check.nonce),
      )
      if (treasure.kind === 'pearls') treasurePearls = treasure.pearls
      else if (treasure.kind === 'bait') await addBait(client, memberId, treasure.bait, treasure.count)
      else lucky = treasure.casts
    }

    const prior = await client.query<{ species_count: number; variant_count: number; best: number | null }>(
      `select count(*) filter (where species = $2)::int as species_count,
              count(*) filter (where species = $2 and variant = $3)::int as variant_count,
              max(size_cm) filter (where species = $2) as best
         from pond_catches where member_id = $1`,
      [memberId, species.id, variant],
    )
    const earlier = prior.rows[0]
    const isNewSpecies = earlier.species_count === 0
    const isNewVariant = earlier.variant_count === 0
    const personalBest = earlier.best === null || size.sizeCm > earlier.best

    const inserted = await client.query<{ id: string }>(
      `insert into pond_catches
         (member_id, species, tier, variant, size_cm, pearls, odds, week, at, chained, score, trophy)
       values ($1, $2, $3, $4, $5, $6, $7, $8, $9, false, $10, $11)
       returning id`,
      [
        memberId,
        species.id,
        species.tier,
        variant,
        size.sizeCm,
        catchPearls,
        speciesOdds * variantOdds,
        isoWeek(now),
        now,
        score,
        size.trophy,
      ],
    )
    const catchId = inserted.rows[0].id

    const itemId = `prop:fish-${species.id}`
    const collected = isCatalogItem(itemId)
      ? await client.query(
          `insert into wallet_items (member_id, item_id, price) values ($1, $2, 0)
           on conflict do nothing
           returning item_id`,
          [memberId, itemId],
        )
      : { rows: [] }

    const next: PondState = {
      ...state,
      pearls:
        state.pearls +
        catchPearls +
        (wagerWon ?? 0) +
        (chainPaid ?? 0) +
        treasurePearls,
      streak,
      pity: species.tier === 'legendary' ? 0 : state.pity,
      lucky,
      chainLevel: 0,
      chainPot: 0,
      chainCatch: null,
    }
    await savePondState(client, memberId, next)

    return {
      catch: {
        id: catchId,
        species: species.id,
        tier: species.tier,
        variant,
        sizeCm: size.sizeCm,
        trophy: size.trophy,
        pearls: catchPearls,
        breakdown,
        isNewSpecies,
        isNewVariant,
        personalBest,
      },
      treasure,
      wagerWon,
      chainPaid,
      trophyCollected: collected.rows.length > 0,
      state: await stateView(client, memberId, next, now),
    }
  })
}

export type PondChainResult = { state: PondStateView } | { error: 'not_chainable' }

export async function chainPondBait(
  memberId: string,
  catchId: unknown,
  now = new Date(),
): Promise<PondChainResult> {
  if (typeof catchId !== 'string') return { error: 'not_chainable' }
  return transaction(async (client) => {
    const state = await lockPondState(client, memberId)
    if (state.chainLevel >= POND_CHAIN_MAX) return { error: 'not_chainable' as const }

    const { rows } = await client.query<{ id: string; tier: string; pearls: number; chained: boolean }>(
      `select id, tier, pearls, chained
         from pond_catches where member_id = $1
        order by at desc, id desc
        limit 1`,
      [memberId],
    )
    const last = rows[0]
    if (!last || last.id !== catchId || last.chained) return { error: 'not_chainable' as const }
    if (last.tier !== 'common' && last.tier !== 'uncommon') return { error: 'not_chainable' as const }

    await client.query(`update pond_catches set chained = true where id = $1`, [catchId])
    const next: PondState = {
      ...state,
      chainLevel: state.chainLevel + 1,
      chainPot: state.chainPot + last.pearls,
      chainCatch: catchId,
    }
    await savePondState(client, memberId, next)
    return { state: await stateView(client, memberId, next, now) }
  })
}

export type PondExchangeResult =
  | { state: PondStateView; balance: number; granted: number; capped: boolean }
  | { error: 'invalid' | 'insufficient' }

export async function exchangePearls(
  memberId: string,
  request: unknown,
  now = new Date(),
  tzOffset = 0,
): Promise<PondExchangeResult> {
  const body = isRecord(request) ? request : {}
  const parsed = validateClaim(
    { ...body, source: 'exchange', claimId: pondNonce(), tzOffsetMinutes: tzOffset },
    now,
  )
  if (!parsed || parsed.source !== 'exchange') return { error: 'invalid' }
  const requested = parsed.requested
  const day = parsed.day ?? utcDay(now)

  return transaction(async (client) => {
    const state = await lockPondState(client, memberId)
    await client.query(`insert into wallets (member_id) values ($1) on conflict do nothing`, [memberId])
    const wallet = await client.query<{ balance: number }>(
      `select balance from wallets where member_id = $1 for update`,
      [memberId],
    )
    let balance = wallet.rows[0]?.balance ?? 0
    if (state.pearls < requested * 10) return { error: 'insufficient' as const }

    const used = await client.query<{ total: number }>(
      `select coalesce(sum(amount), 0)::int as total
         from coin_claims
        where member_id = $1 and source = 'exchange' and day = $2`,
      [memberId, day],
    )
    const remaining = Math.max(0, EXCHANGE_DAILY_STAMPS - used.rows[0].total)
    if (remaining <= 0) {
      return { state: await stateView(client, memberId, state, now), balance, granted: 0, capped: true }
    }

    const granted = Math.min(requested, remaining)
    await client.query(
      `insert into coin_claims (member_id, claim_key, source, day, amount)
       values ($1, $2, 'exchange', $3, $4)`,
      [memberId, parsed.claimKey, day, granted],
    )
    const updated = await client.query<{ balance: number }>(
      `update wallets set balance = balance + $2 where member_id = $1 returning balance`,
      [memberId, granted],
    )
    balance = updated.rows[0].balance

    const next = { ...state, pearls: state.pearls - granted * 10 }
    await savePondState(client, memberId, next)
    return {
      state: await stateView(client, memberId, next, now),
      balance,
      granted,
      capped: granted < requested,
    }
  })
}



export interface PondBountyView {
  id: string
  text: string
  progress: number
  target: number
  reward: number
  done: boolean
  claimed: boolean
}

export interface PondBountiesView {
  day: string
  bounties: PondBountyView[]
}

export type PondBountyClaimResult =
  | { state: PondStateView; bounties: PondBountiesView }
  | { error: 'invalid' | 'not_done' | 'already_claimed' }

interface BountyCatchRow {
  species: string
  tier: string
  variant: string
  size_cm: number
  trophy: boolean
  pearls: number
}

async function bountyCatches(
  client: PoolClient,
  memberId: string,
  day: string,
): Promise<PondBountyCatch[]> {
  const start = new Date(`${day}T00:00:00.000Z`)
  const end = new Date(start.getTime() + 86_400_000)
  const { rows } = await client.query<BountyCatchRow>(
    `select species, tier, variant, size_cm, trophy, pearls
       from pond_catches
      where member_id = $1 and at >= $2 and at < $3`,
    [memberId, start, end],
  )
  return rows.map((row) => ({
    species: row.species as PondFishId,
    tier: row.tier as PondTier,
    variant: row.variant as PondVariant,
    sizeCm: row.size_cm,
    trophy: row.trophy,
    pearls: row.pearls,
  }))
}

async function bountyViews(
  client: PoolClient,
  memberId: string,
  now: Date,
): Promise<PondBountiesView> {
  const day = utcDay(now)
  const catches = await bountyCatches(client, memberId, day)
  const claimed = await client.query<{ bounty_id: string }>(
    `select bounty_id from pond_bounty_claims where member_id = $1 and day = $2`,
    [memberId, day],
  )
  const claimedIds = new Set(claimed.rows.map((row) => row.bounty_id))
  return {
    day,
    bounties: pondBountiesFor(day).map((bounty) => {
      const progress = pondBountyProgress(bounty, catches)
      return {
        id: bounty.id,
        text: bounty.text,
        progress,
        target: bounty.target,
        reward: bounty.reward,
        done: progress >= bounty.target,
        claimed: claimedIds.has(bounty.id),
      }
    }),
  }
}

export async function getPondBounties(
  memberId: string,
  now = new Date(),
): Promise<PondBountiesView> {
  return transaction(async (client) => bountyViews(client, memberId, now))
}

export async function claimPondBounty(
  memberId: string,
  bountyId: unknown,
  now = new Date(),
): Promise<PondBountyClaimResult> {
  if (typeof bountyId !== 'string') return { error: 'invalid' }
  return transaction(async (client) => {
    const state = await lockPondState(client, memberId)
    const day = utcDay(now)
    const bounty = pondBountiesFor(day).find((entry) => entry.id === bountyId)
    if (!bounty) return { error: 'invalid' as const }

    const catches = await bountyCatches(client, memberId, day)
    if (pondBountyProgress(bounty, catches) < bounty.target) {
      return { error: 'not_done' as const }
    }

    const inserted = await client.query(
      `insert into pond_bounty_claims (member_id, day, bounty_id)
       values ($1, $2, $3)
       on conflict do nothing
       returning bounty_id`,
      [memberId, day, bounty.id],
    )
    if (inserted.rows.length === 0) return { error: 'already_claimed' as const }

    const next = { ...state, pearls: state.pearls + bounty.reward }
    await savePondState(client, memberId, next)
    return {
      state: await stateView(client, memberId, next, now),
      bounties: await bountyViews(client, memberId, now),
    }
  })
}
