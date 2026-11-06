import type { PoolClient } from 'pg'
import { ITEMS, isBuyable, isCatalogItem, priceOf } from '../economy/catalog.ts'
import { validateClaim, type ParsedClaim } from '../economy/rules.ts'
import { query, queryOne, transaction } from '../infra/db.ts'

export interface Wallet {
  balance: number
  items: string[]
}

export interface WalletToday {
  coin: number
  games: number
  note: number
}

export interface WalletView extends Wallet {
  today: WalletToday
}

export interface ClaimResult {
  granted: number
  balance: number
  capped: boolean
  already?: true
}

export type ClaimOutcome = ClaimResult | { error: 'invalid' }

export interface ClaimBatchResult {
  results: ClaimResult[]
  balance: number
}

export interface WalletExport {
  balance: number
  claims: { claim_key: string; amount: number; at: string }[]
  items: { item_id: string; price: number; at: string }[]
}

export type BuyResult = Wallet | { error: 'unknown_item' | 'insufficient' }

export type CollectResult = (Wallet & { collected: boolean }) | { error: 'unknown_item' }

const MAX_BATCH = 64

export async function ensureWallet(memberId: string): Promise<void> {
  await query(`insert into wallets (member_id) values ($1) on conflict do nothing`, [memberId])
}

async function lockWallet(client: PoolClient, memberId: string): Promise<number> {
  await client.query(`insert into wallets (member_id) values ($1) on conflict do nothing`, [memberId])
  const { rows } = await client.query<{ balance: number }>(
    `select balance from wallets where member_id = $1 for update`,
    [memberId],
  )
  return rows[0]?.balance ?? 0
}

async function itemsOf(client: PoolClient, memberId: string): Promise<string[]> {
  const { rows } = await client.query<{ item_id: string }>(
    `select item_id from wallet_items where member_id = $1 order by item_id`,
    [memberId],
  )
  return rows.map((row) => row.item_id)
}

async function walletOf(client: PoolClient, memberId: string, balance: number): Promise<Wallet> {
  return { balance, items: await itemsOf(client, memberId) }
}

async function pieceIsPublished(client: PoolClient, pieceId: string): Promise<boolean> {
  const { rows } = await client.query(
    `select 1
       from pieces p
       join artists a on a.id = p.artist_id
      where p.id::text = $1 and a.status = 'live'
      limit 1`,
    [pieceId],
  )
  return rows.length > 0
}

async function applyClaim(
  client: PoolClient,
  memberId: string,
  claim: ParsedClaim,
  balance: number,
): Promise<ClaimOutcome> {
  const earlier = await client.query<{ amount: number }>(
    `select amount from coin_claims where member_id = $1 and claim_key = $2`,
    [memberId, claim.claimKey],
  )
  if (earlier.rows[0]) {
    return { granted: 0, balance, capped: false, already: true }
  }

  if (claim.source === 'art' && !(await pieceIsPublished(client, claim.claimKey.slice(4)))) {
    return { error: 'invalid' }
  }

  let amount = claim.requested
  if (claim.day !== null && claim.dailyCap !== null) {
    const { rows } = await client.query<{ total: number }>(
      `select coalesce(sum(amount), 0)::int as total
         from coin_claims
        where member_id = $1 and source = $2 and day = $3`,
      [memberId, claim.source, claim.day],
    )
    amount = Math.min(amount, claim.dailyCap - rows[0].total)
  }
  if (amount <= 0) return { granted: 0, balance, capped: true }

  await client.query(
    `insert into coin_claims (member_id, claim_key, source, day, amount)
     values ($1, $2, $3, $4, $5)`,
    [memberId, claim.claimKey, claim.source, claim.day, amount],
  )
  const updated = await client.query<{ balance: number }>(
    `update wallets set balance = balance + $2 where member_id = $1 returning balance`,
    [memberId, amount],
  )
  return { granted: amount, balance: updated.rows[0].balance, capped: false }
}

export async function getWallet(memberId: string, today: string): Promise<WalletView> {
  await ensureWallet(memberId)
  const wallet = await queryOne<{ balance: number }>(
    `select balance from wallets where member_id = $1`,
    [memberId],
  )
  const items = await query<{ item_id: string }>(
    `select item_id from wallet_items where member_id = $1 order by item_id`,
    [memberId],
  )
  const sums = await query<{ source: string; total: number }>(
    `select source, sum(amount)::int as total
       from coin_claims
      where member_id = $1 and day = $2 and source in ('coin', 'game', 'note')
      group by source`,
    [memberId, today],
  )
  const totals: WalletToday = { coin: 0, games: 0, note: 0 }
  for (const row of sums) {
    if (row.source === 'coin') totals.coin = row.total
    else if (row.source === 'game') totals.games = row.total
    else if (row.source === 'note') totals.note = row.total
  }
  return { balance: wallet?.balance ?? 0, items: items.map((row) => row.item_id), today: totals }
}

export async function claim(
  memberId: string,
  request: unknown,
  now: Date,
): Promise<ClaimOutcome> {
  const parsed = validateClaim(request, now)
  if (!parsed) return { error: 'invalid' }
  return transaction(async (client) => {
    const balance = await lockWallet(client, memberId)
    return applyClaim(client, memberId, parsed, balance)
  })
}

export async function claimBatch(
  memberId: string,
  requests: unknown[],
  now: Date,
): Promise<ClaimBatchResult> {
  if (requests.length > MAX_BATCH) {
    throw new Error(`claimBatch accepts at most ${MAX_BATCH} requests`)
  }
  return transaction(async (client) => {
    let balance = await lockWallet(client, memberId)
    const results: ClaimResult[] = []
    for (const request of requests) {
      const parsed = validateClaim(request, now)
      if (!parsed) continue
      const result = await applyClaim(client, memberId, parsed, balance)
      if ('error' in result) continue
      results.push(result)
      balance = result.balance
    }
    return { results, balance }
  })
}

export async function buy(memberId: string, itemId: string): Promise<BuyResult> {
  if (!isBuyable(itemId)) return { error: 'unknown_item' }
  const price = priceOf(itemId) ?? 0
  return transaction(async (client) => {
    const balance = await lockWallet(client, memberId)
    const owned = await client.query(
      `select 1 from wallet_items where member_id = $1 and item_id = $2`,
      [memberId, itemId],
    )
    if (owned.rows.length > 0) return walletOf(client, memberId, balance)
    if (balance < price) return { error: 'insufficient' }

    await client.query(
      `insert into wallet_items (member_id, item_id, price) values ($1, $2, $3)`,
      [memberId, itemId, price],
    )
    const updated = await client.query<{ balance: number }>(
      `update wallets set balance = balance - $2 where member_id = $1 returning balance`,
      [memberId, price],
    )
    return walletOf(client, memberId, updated.rows[0].balance)
  })
}

function isCollectable(itemId: string): boolean {
  return isCatalogItem(itemId) && ITEMS[itemId].earnedBy !== undefined
}

export async function collect(memberId: string, itemId: string): Promise<CollectResult> {
  if (!isCollectable(itemId)) return { error: 'unknown_item' }
  return transaction(async (client) => {
    const balance = await lockWallet(client, memberId)
    const inserted = await client.query<{ item_id: string }>(
      `insert into wallet_items (member_id, item_id, price) values ($1, $2, 0)
       on conflict do nothing
       returning item_id`,
      [memberId, itemId],
    )
    return {
      ...(await walletOf(client, memberId, balance)),
      collected: inserted.rows.length > 0,
    }
  })
}

export async function grantWelcome(memberId: string): Promise<ClaimOutcome> {
  return claim(memberId, { source: 'welcome' }, new Date())
}

export async function grantNote(
  memberId: string,
  now: Date,
  tzOffset: number,
): Promise<ClaimOutcome> {
  return claim(memberId, { source: 'note', tzOffset }, now)
}

export async function exportWallet(memberId: string): Promise<WalletExport> {
  const wallet = await queryOne<{ balance: number }>(
    `select balance from wallets where member_id = $1`,
    [memberId],
  )
  const claims = await query<{ claim_key: string; amount: number; at: Date }>(
    `select claim_key, amount, at from coin_claims where member_id = $1 order by at, claim_key`,
    [memberId],
  )
  const items = await query<{ item_id: string; price: number; at: Date }>(
    `select item_id, price, at from wallet_items where member_id = $1 order by at, item_id`,
    [memberId],
  )
  return {
    balance: wallet?.balance ?? 0,
    claims: claims.map((row) => ({
      claim_key: row.claim_key,
      amount: row.amount,
      at: row.at.toISOString(),
    })),
    items: items.map((row) => ({ item_id: row.item_id, price: row.price, at: row.at.toISOString() })),
  }
}
