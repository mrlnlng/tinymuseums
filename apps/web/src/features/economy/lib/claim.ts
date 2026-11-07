import { validateClaim, type SecretFeature, type SourceId } from '@tiny/core/economy'

export type EarnSource = SourceId
export type GameSource = 'colorrecall' | 'sketch' | 'pond'

export interface EarnDetail {
  feature?: SecretFeature
  pieceId?: string
  game?: GameSource
  score?: number
  runId?: string
}

export interface ClaimRequest {
  source: SourceId
  tzOffset: number
  feature?: string
  pieceId?: string
  game?: string
  runId?: string
  score?: number
}

export interface BuiltClaim {
  key: string
  day: string | null
  request: ClaimRequest
}

/** New random run ids use only [A-Za-z0-9_-] and stay inside the server's 8..40 range. */
export function newRunId(): string {
  const random =
    globalThis.crypto?.randomUUID?.().replaceAll('-', '').slice(0, 20) ??
    Math.random().toString(36).slice(2, 12)
  return `r${Date.now().toString(36)}${random}`.slice(0, 40)
}

export function tzOffsetNow(now: Date = new Date()): number {
  return -now.getTimezoneOffset()
}

export function buildClaim(
  source: EarnSource,
  detail: EarnDetail,
  now: Date,
  tzOffset = tzOffsetNow(now),
): BuiltClaim | null {
  const request: ClaimRequest = { ...detail, source, tzOffset }
  if (source === 'game' && request.runId === undefined) request.runId = newRunId()
  const parsed = validateClaim(request, now)
  if (!parsed) return null
  return { key: parsed.claimKey, day: parsed.day, request }
}
