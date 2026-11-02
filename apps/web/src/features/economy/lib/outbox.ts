import type { ClaimRequest } from './claim.ts'

export const OUTBOX_CAP = 200
export const RETRY_BASE_MS = 1_000
export const RETRY_MAX_MS = 60_000

export interface OutboxEntry {
  memberId: string
  key: string
  request: ClaimRequest
  attempts: number
  nextAt: number
}

export function retryDelay(attempts: number): number {
  const step = Math.max(1, Math.floor(attempts))
  return Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** (step - 1))
}

function sameEntry(entry: OutboxEntry, memberId: string, key: string): boolean {
  return entry.memberId === memberId && entry.key === key
}

export function outboxAdd(
  entries: readonly OutboxEntry[],
  entry: OutboxEntry,
  cap = OUTBOX_CAP,
): OutboxEntry[] {
  const without = entries.filter((existing) => !sameEntry(existing, entry.memberId, entry.key))
  return [...without, entry].slice(-cap)
}

export function outboxRemove(
  entries: readonly OutboxEntry[],
  memberId: string,
  key: string,
): OutboxEntry[] {
  return entries.filter((entry) => !sameEntry(entry, memberId, key))
}

export function outboxDue(
  entries: readonly OutboxEntry[],
  memberId: string,
  now: number,
): OutboxEntry[] {
  return entries.filter((entry) => entry.memberId === memberId && entry.nextAt <= now)
}

export function outboxFail(
  entries: readonly OutboxEntry[],
  memberId: string,
  key: string,
  now: number,
): OutboxEntry[] {
  return entries.map((entry) => {
    if (!sameEntry(entry, memberId, key)) return entry
    const attempts = entry.attempts + 1
    return { ...entry, attempts, nextAt: now + retryDelay(attempts) }
  })
}
