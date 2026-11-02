import { localDay } from './day.ts'

export const SOURCES = {
  welcome: { amount: 60, limit: 'once' },
  coin: { amount: 10, limit: 'daily' },
  secret: { amount: 10, limit: 'once' },
  art: { amount: 5, limit: 'once' },
  game: { perScore: true, limit: 'daily', cap: 25 },
  note: { amount: 5, limit: 'daily' },
} as const

export type SourceId = keyof typeof SOURCES

export const SECRET_FEATURES = [
  'statue',
  'cafe_cat',
  'matcha',
  'helm',
  'beanbag',
  'help',
  'atelier',
  'guest_note_posted',
] as const

export type SecretFeature = (typeof SECRET_FEATURES)[number]

export const GAMES = ['colorrecall', 'sketch'] as const

export type GameId = (typeof GAMES)[number]

export const GAME_DAILY_CAP = SOURCES.game.cap

const RUN_ID = /^[A-Za-z0-9_-]{8,40}$/

export interface ParsedClaim {
  source: SourceId
  claimKey: string
  day: string | null
  requested: number
  dailyCap: number | null
}

function includes<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === 'string' && (values as readonly string[]).includes(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function offsetOf(request: Record<string, unknown>): number {
  if (typeof request.tzOffset === 'number') return request.tzOffset
  return typeof request.tzOffsetMinutes === 'number' ? request.tzOffsetMinutes : 0
}

/** Validates an untrusted claim request; the server never trusts a client amount. */
export function validateClaim(request: unknown, now: Date): ParsedClaim | null {
  if (!isRecord(request)) return null
  const source = request.source
  if (typeof source !== 'string' || !Object.hasOwn(SOURCES, source)) return null

  if (source === 'welcome') {
    return { source, claimKey: 'welcome', day: null, requested: SOURCES.welcome.amount, dailyCap: null }
  }

  if (source === 'coin') {
    const day = localDay(offsetOf(request), now)
    return {
      source,
      claimKey: `coin:${day}`,
      day,
      requested: SOURCES.coin.amount,
      dailyCap: SOURCES.coin.amount,
    }
  }

  if (source === 'secret') {
    const feature = request.feature
    if (!includes(SECRET_FEATURES, feature)) return null
    return { source, claimKey: `secret:${feature}`, day: null, requested: SOURCES.secret.amount, dailyCap: null }
  }

  if (source === 'art') {
    const pieceId = request.pieceId
    if (typeof pieceId !== 'string' || pieceId.length === 0 || pieceId.length > 100) return null
    return { source, claimKey: `art:${pieceId}`, day: null, requested: SOURCES.art.amount, dailyCap: null }
  }

  if (source === 'game') {
    const game = request.game
    const runId = request.runId
    const score = request.score
    if (!includes(GAMES, game)) return null
    if (typeof runId !== 'string' || !RUN_ID.test(runId)) return null
    if (!Number.isSafeInteger(score) || (score as number) < 0 || (score as number) > 100) return null
    const day = localDay(offsetOf(request), now)
    return {
      source,
      claimKey: `game:${day}:${runId}`,
      day,
      requested: score as number,
      dailyCap: GAME_DAILY_CAP,
    }
  }

  const day = localDay(offsetOf(request), now)
  return {
    source: 'note',
    claimKey: `note:${day}`,
    day,
    requested: SOURCES.note.amount,
    dailyCap: SOURCES.note.amount,
  }
}
