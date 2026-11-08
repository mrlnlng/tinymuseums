export const MAX_WALLET_BODY_BYTES = 56 * 1024
export const MAX_CLAIM_BATCH = 64

export type ParsedWalletClaim =
  | { kind: 'single'; request: Record<string, unknown> }
  | { kind: 'batch'; requests: Record<string, unknown>[] }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function integerOffset(value: unknown): number | null {
  let number: number
  if (typeof value === 'number') number = value
  else if (typeof value === 'string' && value.trim() !== '') number = Number(value)
  else return null
  return Number.isInteger(number) ? number : null
}

/** Minutes east of UTC, the same value as `-new Date().getTimezoneOffset()`. */
export function tzOffsetOf(value: unknown): number {
  return integerOffset(value) ?? 0
}

function routeBanned(source: unknown): boolean {
  return source === 'welcome' || source === 'note' || source === 'exchange'
}

export function parseWalletClaim(
  body: unknown,
  queryTz: unknown,
): ParsedWalletClaim | { error: 'invalid' } {
  if (!isRecord(body)) return { error: 'invalid' }
  const tzOffset = tzOffsetOf(body.tzOffset ?? queryTz)

  if ('batch' in body) {
    const batch = body.batch
    if (!Array.isArray(batch) || batch.length > MAX_CLAIM_BATCH) return { error: 'invalid' }
    const requests: Record<string, unknown>[] = []
    for (const entry of batch) {
      if (!isRecord(entry)) continue
      if (routeBanned(entry.source)) return { error: 'invalid' }
      requests.push({ ...entry, tzOffset })
    }
    return { kind: 'batch', requests }
  }

  if (routeBanned(body.source)) return { error: 'invalid' }
  return { kind: 'single', request: { ...body, tzOffset } }
}

export function itemIdOf(body: unknown): string | null {
  if (!isRecord(body)) return null
  return typeof body.itemId === 'string' && body.itemId.length > 0 ? body.itemId : null
}

export function baitIdOf(body: unknown, fallback: string | null = null): string | null {
  if (!isRecord(body) || !('bait' in body) || body.bait === undefined || body.bait === null) {
    return fallback
  }
  return typeof body.bait === 'string' && body.bait.length > 0 ? body.bait : null
}
