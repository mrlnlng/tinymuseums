import { defaultStore } from '@/shared/lib/slots'
import type { BaitId, FishId, FishTier, FishVariant, PondTreasure } from './tables.ts'

/** Typed fetchers for the pond API. The server is the source of every roll. */

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
    tiers: Record<FishTier, number>
    payouts: Record<FishTier, number>
  }
}

export interface PondWagerView {
  tier: FishTier
  stake: number
  multiplier: number
}

export interface PondCastReply {
  ticket: string
  shadow: 'tiny' | 'small' | 'big' | 'huge'
  nibbles: number
  fight: number
  treasure: boolean
  wager: PondWagerView | null
  state: PondStateView
}

export interface PondCatch {
  id: string
  species: FishId
  tier: FishTier
  variant: FishVariant
  sizeCm: number
  trophy: boolean
  pearls: number
  breakdown: { base: number; size: number; variant: number; streak: number }
  isNewSpecies: boolean
  isNewVariant: boolean
  personalBest: boolean
}

export type PondReelReply =
  | {
      catch: PondCatch
      treasure: PondTreasure | null
      wagerWon: number | null
      chainPaid: number | null
      trophyCollected: boolean
      state: PondStateView
    }
  | { lost: true; state: PondStateView }

export type PondResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string; status: number }

function memberId(): string | null {
  return defaultStore().getMemberSnapshot()?.id ?? null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function readBody(response: Response): Promise<unknown> {
  return response.json().catch(() => null)
}

async function requestJson(
  path: string,
  init: RequestInit = {},
): Promise<{ response: Response; body: unknown }> {
  const response = await fetch(path, { cache: 'no-store', ...init })
  return { response, body: await readBody(response) }
}

function errorOf(body: unknown, fallback: string): string {
  return isRecord(body) && typeof body.error === 'string' ? body.error : fallback
}

export async function fetchPondState(
  bait: BaitId = 'worm',
  chain = false,
): Promise<PondStateView | null> {
  if (memberId() === null) return null
  try {
    const query = new URLSearchParams({ bait })
    if (chain) query.set('chain', '1')
    const { response, body } = await requestJson(`/api/pond/state?${query}`)
    if (!response.ok || !isRecord(body) || typeof body.pearls !== 'number') return null
    return body as unknown as PondStateView
  } catch {
    return null
  }
}

export interface CastOptions {
  wager?: { tier: FishTier; stake: number } | null
  chain?: boolean
}

export async function castPond(
  bait: BaitId,
  options: CastOptions = {},
): Promise<PondResult<PondCastReply>> {
  const id = memberId()
  if (id === null) return { ok: false, error: 'signed_out', status: 401 }
  try {
    const payload: Record<string, unknown> = { bait }
    if (options.wager) payload.wager = options.wager
    if (options.chain) payload.chain = true
    const { response, body } = await requestJson('/api/pond/cast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return { ok: false, error: errorOf(body, 'cast_failed'), status: response.status }
    if (!isRecord(body) || typeof body.ticket !== 'string') {
      return { ok: false, error: 'cast_failed', status: 500 }
    }
    return { ok: true, value: body as unknown as PondCastReply }
  } catch {
    return { ok: false, error: 'offline', status: 0 }
  }
}

export interface ReelRequest {
  ticket: string
  landed: boolean
  perfectCast: boolean
  perfectHook: boolean
  treasureGrabbed: boolean
}

export async function reelPond(request: ReelRequest): Promise<PondResult<PondReelReply>> {
  const id = memberId()
  if (id === null) return { ok: false, error: 'signed_out', status: 401 }
  try {
    const { response, body } = await requestJson('/api/pond/reel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
      body: JSON.stringify(request),
    })
    if (!response.ok) return { ok: false, error: errorOf(body, 'reel_failed'), status: response.status }
    if (!isRecord(body)) return { ok: false, error: 'reel_failed', status: 500 }
    return { ok: true, value: body as unknown as PondReelReply }
  } catch {
    return { ok: false, error: 'offline', status: 0 }
  }
}

export async function chainPondBait(catchId: string): Promise<PondResult<PondStateView>> {
  const id = memberId()
  if (id === null) return { ok: false, error: 'signed_out', status: 401 }
  try {
    const { response, body } = await requestJson('/api/pond/bait-chain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
      body: JSON.stringify({ catchId }),
    })
    if (!response.ok) return { ok: false, error: errorOf(body, 'chain_failed'), status: response.status }
    if (!isRecord(body) || !isRecord(body.state)) {
      return { ok: false, error: 'chain_failed', status: 500 }
    }
    return { ok: true, value: body.state as unknown as PondStateView }
  } catch {
    return { ok: false, error: 'offline', status: 0 }
  }
}

export async function buyPondBait(bait: BaitId): Promise<PondResult<PondStateView>> {
  const id = memberId()
  if (id === null) return { ok: false, error: 'signed_out', status: 401 }
  try {
    const { response, body } = await requestJson('/api/pond/bait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
      body: JSON.stringify({ bait }),
    })
    if (!response.ok) return { ok: false, error: errorOf(body, 'buy_failed'), status: response.status }
    if (!isRecord(body) || !isRecord(body.state)) {
      return { ok: false, error: 'buy_failed', status: 500 }
    }
    return { ok: true, value: body.state as unknown as PondStateView }
  } catch {
    return { ok: false, error: 'offline', status: 0 }
  }
}
