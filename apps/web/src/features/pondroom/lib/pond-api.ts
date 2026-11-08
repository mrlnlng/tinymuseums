import { defaultStore } from '@/shared/lib/slots'
import type { PondBaitId, PondShopBaitId, PondTier } from './pond-format'

/** Typed fetchers for every pond route the room's panels touch. */

export interface PondStateView {
  pearls: number
  bait: Record<string, number>
  streak: number
  chain: { level: number; pot: number }
  lucky: number
  pity: number
  wageredToday: number
  moon: 'full' | 'other'
  odds: {
    tiers: Record<PondTier, number>
    payouts: Record<PondTier, number>
  }
}

export type PondBoardId = 'biggest' | 'haul' | 'rarest'
export type PondBoardPeriod = 'week' | 'all'

export interface PondBoardRow {
  rank: number
  name: string
  value: number
  species: string | null
  variant: string | null
  sizeCm: number | null
}

export interface PondLeaderboard {
  rows: PondBoardRow[]
  me: (PondBoardRow & { above: PondBoardRow[] }) | null
  week: string
}

export interface PondFeedItem {
  id: string
  name: string
  species: string
  variant: string
  sizeCm: number
  trophy: boolean
  at: string
}

export interface PondDexCell {
  count: number
  bestCm: number
}

export interface PondDex {
  entries: Record<string, Record<string, PondDexCell>>
  totals: { found: number; possible: number }
}

export interface PondBounty {
  id: string
  text: string
  progress: number
  target: number
  reward: number
  done: boolean
  claimed: boolean
}

export interface PondBounties {
  day: string
  bounties: PondBounty[]
}

export interface PondBountyClaim {
  state: PondStateView
  bounties: PondBounties
}

export interface PondExchangeResult {
  state: PondStateView
  balance: number
  granted: number
  capped: boolean
}

export type PondResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; status: number }

function memberId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return defaultStore().getMemberSnapshot()?.id ?? null
  } catch {
    return null
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function errorOf(body: unknown, fallback: string): string {
  return isRecord(body) && typeof body.error === 'string' ? body.error : fallback
}

function isStateView(value: unknown): value is PondStateView {
  return (
    isRecord(value) &&
    typeof value.pearls === 'number' &&
    isRecord(value.bait) &&
    isRecord(value.odds) &&
    isRecord(value.odds.tiers)
  )
}

async function request<T>(
  path: string,
  init: RequestInit,
  parse: (body: unknown) => T | null,
): Promise<PondResult<T>> {
  let response: Response
  try {
    response = await fetch(path, { cache: 'no-store', ...init })
  } catch {
    return { ok: false, error: 'offline', status: 0 }
  }

  const body: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const fallback = response.status === 401 ? 'signed_out' : `http_${response.status}`
    return { ok: false, error: errorOf(body, fallback), status: response.status }
  }
  const value = parse(body)
  if (value === null) return { ok: false, error: 'invalid_reply', status: response.status }
  return { ok: true, value }
}

function mutationHeaders(): Record<string, string> | null {
  const id = memberId()
  if (id === null) return null
  return { 'Content-Type': 'application/json', 'X-TM-Member': id }
}

export function fetchPondLeaderboard(
  board: PondBoardId,
  period: PondBoardPeriod,
): Promise<PondResult<PondLeaderboard>> {
  const query = new URLSearchParams({ board, period })
  return request(`/api/pond/leaderboard?${query}`, {}, (body) => {
    if (!isRecord(body) || !Array.isArray(body.rows) || typeof body.week !== 'string') return null
    return body as unknown as PondLeaderboard
  })
}

/** The feed route returns a bare array. */
export function fetchPondFeed(): Promise<PondResult<PondFeedItem[]>> {
  return request('/api/pond/feed', {}, (body) => {
    if (!Array.isArray(body)) return null
    return body as PondFeedItem[]
  })
}

export function fetchPondState(bait: PondBaitId = 'worm'): Promise<PondResult<PondStateView>> {
  const id = memberId()
  if (id === null) return Promise.resolve({ ok: false, error: 'signed_out', status: 401 })
  const query = new URLSearchParams({ bait })
  return request(`/api/pond/state?${query}`, {}, (body) => (isStateView(body) ? body : null))
}

export function fetchPondDex(): Promise<PondResult<PondDex>> {
  const id = memberId()
  if (id === null) return Promise.resolve({ ok: false, error: 'signed_out', status: 401 })
  return request('/api/pond/dex', {}, (body) => {
    if (!isRecord(body) || !isRecord(body.entries) || !isRecord(body.totals)) return null
    return body as unknown as PondDex
  })
}

export function fetchPondBounties(): Promise<PondResult<PondBounties>> {
  const id = memberId()
  if (id === null) return Promise.resolve({ ok: false, error: 'signed_out', status: 401 })
  return request('/api/pond/bounties', {}, (body) => {
    if (!isRecord(body) || !Array.isArray(body.bounties)) return null
    return body as unknown as PondBounties
  })
}

export function buyPondBait(bait: PondShopBaitId): Promise<PondResult<PondStateView>> {
  const headers = mutationHeaders()
  if (headers === null) return Promise.resolve({ ok: false, error: 'signed_out', status: 401 })
  return request(
    '/api/pond/bait',
    { method: 'POST', headers, body: JSON.stringify({ bait }) },
    (body) => (isRecord(body) && isStateView(body.state) ? body.state : null),
  )
}

export function exchangePondPearls(pearls: number): Promise<PondResult<PondExchangeResult>> {
  const headers = mutationHeaders()
  if (headers === null) return Promise.resolve({ ok: false, error: 'signed_out', status: 401 })
  const tz = -new Date().getTimezoneOffset()
  return request(
    `/api/pond/exchange?tz=${encodeURIComponent(String(tz))}`,
    {
      method: 'POST',
      headers,
      body: JSON.stringify({ pearls, tzOffset: tz }),
    },
    (body) => {
      if (!isRecord(body) || !isStateView(body.state) || typeof body.balance !== 'number') return null
      return body as unknown as PondExchangeResult
    },
  )
}

export function claimPondBounty(id: string): Promise<PondResult<PondBountyClaim>> {
  const headers = mutationHeaders()
  if (headers === null) return Promise.resolve({ ok: false, error: 'signed_out', status: 401 })
  return request(
    '/api/pond/bounties/claim',
    { method: 'POST', headers, body: JSON.stringify({ id }) },
    (body) => {
      if (!isRecord(body) || !isStateView(body.state) || !isRecord(body.bounties)) return null
      return body as unknown as PondBountyClaim
    },
  )
}
