/**
 * Letter progress: which letters have arrived, been opened and been completed,
 * plus the counters that answer each quest. Pure functions do the work; a small
 * localStorage-backed store keeps one record per visitor and lets React subscribe.
 *
 * Nothing here touches the server. A letter that needs a server-side reward shows
 * without it rather than pretending the reward was granted.
 */

import { LETTERS, letterById, isLetterId, type Letter, type LetterId, type QuestKind } from './letters.ts'
import { readLocal, writeLocal } from '../../shared/lib/browser-storage.ts'
import { defaultStore } from '../../shared/lib/slots/index.ts'

export interface LetterProgress {
  version: 1
  delivered: LetterId[]
  opened: LetterId[]
  completed: LetterId[]
  /** Count of events seen per quest kind. Counted quests count distinct details. */
  counters: Partial<Record<QuestKind, number>>
  /** Distinct details seen, for counted quests (artwork ids, seasonal item ids). */
  seen: Partial<Record<QuestKind, string[]>>
}

const KEY_PREFIX = 'tm:letters:'
const COUNTED: ReadonlySet<QuestKind> = new Set<QuestKind>(['view-artwork', 'seasonal-items'])

export function emptyProgress(): LetterProgress {
  return { version: 1, delivered: [], opened: [], completed: [], counters: {}, seen: {} }
}

function unique<T>(values: readonly T[]): T[] {
  return [...new Set(values)]
}

function conditionCount(letter: Letter): number {
  return letter.condition.count ?? 1
}

function has(progress: LetterProgress, id: LetterId): boolean {
  return progress.delivered.includes(id)
}

function isComplete(progress: LetterProgress, id: LetterId): boolean {
  return progress.completed.includes(id)
}

function conditionMet(progress: LetterProgress, letter: Letter): boolean {
  return (progress.counters[letter.condition.kind] ?? 0) >= conditionCount(letter)
}

/** The next letter can arrive once the trigger names something that has happened. */
function triggerMet(progress: LetterProgress, letter: Letter): boolean {
  switch (letter.trigger.kind) {
    case 'game-start':
      return true
    case 'letter-complete':
      return isComplete(progress, letter.trigger.letter)
    case 'letter-opened':
      return progress.opened.includes(letter.trigger.letter)
  }
}

function tryDeliver(progress: LetterProgress, letter: Letter): LetterProgress {
  if (!letter.available || has(progress, letter.id) || !triggerMet(progress, letter)) return progress
  return { ...progress, delivered: [...progress.delivered, letter.id] }
}

/**
 * Settles every delivered letter whose condition is already met, and hands the
 * next letter over. Repeats until nothing changes, so a chain completed out of
 * order still ends in the right place.
 */
function settle(progress: LetterProgress): LetterProgress {
  let next = progress
  let changed = true
  while (changed) {
    changed = false
    for (const letter of LETTERS) {
      if (!has(next, letter.id) || isComplete(next, letter.id) || !conditionMet(next, letter)) continue
      next = { ...next, completed: [...next.completed, letter.id] }
      changed = true
      if (letter.next !== null) {
        const following = letterById(letter.next)
        if (following) {
          const delivered = tryDeliver(next, following)
          if (delivered !== next) {
            next = delivered
            changed = true
          }
        }
      }
    }
  }
  return next
}

/** The visitor's first letter arrives when the museum starts; no earlier state exists. */
export function startProgress(): LetterProgress {
  let progress = emptyProgress()
  const first = letterById(0)
  if (first) progress = tryDeliver(progress, first)
  return settle(progress)
}

/**
 * One quest event. Repeats are idempotent:
 * - a plain event completes its condition once;
 * - a counted event counts each distinct `detail` once.
 *
 * Events may arrive before their letter (a visitor can decorate early); the
 * counters are kept and the letter completes as soon as it is delivered.
 */
export function recordEvent(progress: LetterProgress, kind: QuestKind, detail?: string): LetterProgress {
  const already =
    COUNTED.has(kind) && detail !== undefined
      ? (progress.seen[kind] ?? []).includes(detail)
      : (progress.counters[kind] ?? 0) > 0
  if (already) return progress

  const counters = { ...progress.counters, [kind]: (progress.counters[kind] ?? 0) + 1 }
  const seen = { ...progress.seen }
  if (COUNTED.has(kind) && detail !== undefined) seen[kind] = unique([...(seen[kind] ?? []), detail])
  return settle({ ...progress, counters, seen })
}

/** A delivered letter is opened; opening letter 6 is the trigger for letter 7. */
export function openLetterProgress(progress: LetterProgress, id: LetterId): LetterProgress {
  if (!has(progress, id) || progress.opened.includes(id)) return progress
  let next: LetterProgress = { ...progress, opened: [...progress.opened, id] }
  const letter = letterById(id)
  if (letter?.next !== null && letter?.next !== undefined) {
    const following = letterById(letter.next)
    if (following?.trigger.kind === 'letter-opened' && following.trigger.letter === id) {
      next = tryDeliver(next, following)
    }
  }
  return settle(next)
}

/** Letters waiting to be read, in chapter order. */
export function unopenedLetters(progress: LetterProgress): Letter[] {
  return progress.delivered
    .filter((id) => !progress.opened.includes(id))
    .sort((a, b) => a - b)
    .map((id) => letterById(id))
    .filter((letter): letter is Letter => letter !== null)
}

/** The newest delivered letter, which is the one whose quest is current. */
export function currentLetter(progress: LetterProgress): Letter | null {
  const latest = [...progress.delivered].sort((a, b) => b - a)[0]
  return latest === undefined ? null : letterById(latest)
}

export interface QuestView {
  text: string
  /** Required distinct events for a counted quest; null for a once-only quest. */
  count: number | null
  /** How far along the quest is, capped at its count. */
  done: number
  completed: boolean
}

export function questView(progress: LetterProgress, letter: Letter): QuestView {
  const count = letter.condition.count ?? null
  const raw = progress.counters[letter.condition.kind] ?? 0
  return {
    text: letter.condition.kind,
    count,
    done: count === null ? Math.min(1, raw) : Math.min(count, raw),
    completed: isComplete(progress, letter.id),
  }
}

function visitorId(): string {
  if (typeof window === 'undefined') return 'guest'
  try {
    return defaultStore().getMemberSnapshot()?.id ?? 'guest'
  } catch {
    return 'guest'
  }
}

function storageKey(id: string): string {
  return `${KEY_PREFIX}${id}`
}

function parsed(raw: string | null): LetterProgress {
  if (raw === null) return emptyProgress()
  try {
    const value: unknown = JSON.parse(raw)
    if (typeof value !== 'object' || value === null) return emptyProgress()
    const record = value as Record<string, unknown>
    const ids = (entry: unknown): LetterId[] =>
      Array.isArray(entry) ? unique(entry.filter(isLetterId)) : []
    return {
      version: 1,
      delivered: ids(record.delivered),
      opened: ids(record.opened),
      completed: ids(record.completed),
      counters:
        typeof record.counters === 'object' && record.counters !== null
          ? (record.counters as Partial<Record<QuestKind, number>>)
          : {},
      seen:
        typeof record.seen === 'object' && record.seen !== null
          ? (record.seen as Partial<Record<QuestKind, string[]>>)
          : {},
    }
  } catch {
    return emptyProgress()
  }
}

const cache = new Map<string, LetterProgress>()
const listeners = new Set<() => void>()

function read(id: string): LetterProgress {
  const known = cache.get(id)
  if (known) return known
  const progress = parsed(readLocal(storageKey(id)))
  cache.set(id, progress)
  return progress
}

function write(id: string, progress: LetterProgress): void {
  const before = read(id)
  cache.set(id, progress)
  writeLocal(storageKey(id), JSON.stringify(progress))
  if (before !== progress) for (const listener of listeners) listener()
}

/** The current visitor's progress. Never writes; safe to call while rendering. */
export function getLetterProgress(): LetterProgress {
  return read(visitorId())
}

/** Subscribe to progress changes for this tab. Returns the unsubscribe function. */
export function subscribeLetters(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Letter 0 arrives the first time the personal room is visited. Idempotent. */
export function ensureLettersStarted(): LetterProgress {
  const id = visitorId()
  const progress = read(id)
  if (progress.delivered.includes(0)) {
    const settled = settle(progress)
    if (settled !== progress) write(id, settled)
    return settled
  }
  const started = startProgress()
  write(id, started)
  return started
}

export function recordQuestEvent(kind: QuestKind, detail?: string): LetterProgress {
  const id = visitorId()
  // Events are counted from the first visit, but only the personal room delivers letter 0.
  const before = read(id)
  const after = recordEvent(before, kind, detail)
  if (after !== before) write(id, after)
  return after
}

export function markLetterOpened(letter: LetterId): LetterProgress {
  const id = visitorId()
  const before = read(id)
  const after = openLetterProgress(before, letter)
  if (after !== before) write(id, after)
  return after
}

/** Test seam: forget cached progress (localStorage is left alone). */
export function resetProgressCache(): void {
  cache.clear()
}
