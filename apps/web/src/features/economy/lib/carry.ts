import type { ClaimRequest } from './claim.ts'

export const CARRY_CAP = 200

export interface CarryEntry {
  key: string
  day: string | null
  request: ClaimRequest
}

export function carryPrune(entries: readonly CarryEntry[], today: string): CarryEntry[] {
  return entries.filter((entry) => entry.day === null || entry.day === today)
}

export function carryAdd(
  entries: readonly CarryEntry[],
  entry: CarryEntry,
  cap = CARRY_CAP,
): CarryEntry[] {
  if (entries.some((existing) => existing.key === entry.key)) return [...entries]
  return [...entries, entry].slice(-cap)
}

export function carryRemove(
  entries: readonly CarryEntry[],
  keys: Iterable<string>,
): CarryEntry[] {
  const remove = new Set(keys)
  return entries.filter((entry) => !remove.has(entry.key))
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isSafeInteger(size) || size < 1) return []
  const chunks: T[][] = []
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size))
  }
  return chunks
}
