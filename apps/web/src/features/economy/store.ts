import type { WalletView } from '@tiny/core'
import { localDay } from '@tiny/core/economy'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { defaultStore } from '@/shared/lib/slots'
import { track } from '@/shared/lib/visit'
import { buildClaim, tzOffsetNow, type BuiltClaim, type EarnDetail, type EarnSource, type ClaimRequest } from './lib/claim.ts'
import { CARRY_CAP, carryAdd, carryPrune, carryRemove, chunk, type CarryEntry } from './lib/carry.ts'
import {
  outboxAdd,
  outboxDue,
  outboxFail,
  outboxRemove,
  type OutboxEntry,
} from './lib/outbox.ts'

export interface WalletSnapshot {
  isMember: boolean
  balance: number | null
  items: string[]
  bait: Record<string, number>
  today: WalletView['today'] | null
}

export interface EarnedEvent {
  type: 'earned'
  source: EarnSource
  granted: number
  capped: boolean
  already: boolean
}

export interface InviteEvent {
  type: 'invite'
}

export type EconomyEvent = EarnedEvent | InviteEvent

export type BuyOutcome = 'ok' | 'insufficient' | 'error'

export { allowedCharacter, owns, walletReady } from './lib/ownership.ts'

const CARRY_KEY = 'tm:economy:carry'
const OUTBOX_KEY = 'tm:economy:outbox'
const INVITE_KEY = 'tm:economy:invite-shown'
const BATCH = 64

const EMPTY_BAIT: Record<string, number> = {}
const NON_MEMBER: WalletSnapshot = { isMember: false, balance: null, items: [], bait: EMPTY_BAIT, today: null }
const EMPTY_TODAY: WalletView['today'] = { coin: 0, games: 0, note: 0 }

let started = false
let memberId: string | null = null
let wallet: WalletView | null = null
let snapshot = NON_MEMBER
let flushing: Promise<void> | null = null
let flushQueued = false
let retryTimer: number | null = null
let inviteShown = false
let shuttingDown = false
const cappedTracked = new Set<string>()
const walletListeners = new Set<() => void>()
const eventListeners = new Set<(event: EconomyEvent) => void>()

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isRequest(value: unknown): value is ClaimRequest {
  return isRecord(value) && typeof value.source === 'string' && typeof value.tzOffset === 'number'
}

function readArray(key: string): unknown[] {
  const raw = readLocal(key)
  if (raw === null) return []
  try {
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function readCarry(): CarryEntry[] {
  return readArray(CARRY_KEY)
    .filter(
      (value): value is CarryEntry =>
        isRecord(value) &&
        typeof value.key === 'string' &&
        (value.day === null || typeof value.day === 'string') &&
        isRequest(value.request),
    )
    .slice(-CARRY_CAP)
}

function writeCarry(entries: readonly CarryEntry[]): void {
  writeLocal(CARRY_KEY, JSON.stringify(entries.slice(-CARRY_CAP)))
}

function readOutbox(): OutboxEntry[] {
  return readArray(OUTBOX_KEY).filter(
    (value): value is OutboxEntry =>
      isRecord(value) &&
      typeof value.memberId === 'string' &&
      typeof value.key === 'string' &&
      isRequest(value.request) &&
      typeof value.attempts === 'number' &&
      typeof value.nextAt === 'number',
  )
}

function writeOutbox(entries: readonly OutboxEntry[]): void {
  writeLocal(OUTBOX_KEY, JSON.stringify(entries))
}

function readSession(key: string): boolean {
  try {
    return window.sessionStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeSession(key: string): void {
  try {
    window.sessionStorage.setItem(key, '1')
  } catch {}
}

function publish(): void {
  const next: WalletSnapshot =
    memberId === null
      ? NON_MEMBER
      : {
          isMember: true,
          balance: wallet?.balance ?? null,
          items: wallet?.items ?? [],
          bait: wallet?.bait ?? EMPTY_BAIT,
          today: wallet?.today ?? null,
        }
  const changed =
    next.isMember !== snapshot.isMember ||
    next.balance !== snapshot.balance ||
    next.items !== snapshot.items ||
    next.bait !== snapshot.bait ||
    next.today !== snapshot.today
  snapshot = next
  if (changed) for (const listener of walletListeners) listener()
}

function emit(event: EconomyEvent): void {
  for (const listener of eventListeners) listener(event)
}

function emitEarned(source: EarnSource, result: {
  granted: number
  capped: boolean
  already?: boolean
}): void {
  if (result.granted > 0) track('coins_earned')
  if (result.capped && !cappedTracked.has(source)) {
    cappedTracked.add(source)
    track('daily_cap_reached')
  }
  emit({
    type: 'earned',
    source,
    granted: result.granted,
    capped: result.capped,
    already: result.already === true,
  })
}

function setBalance(balance: number): void {
  wallet = {
    balance,
    items: wallet?.items ?? [],
    bait: wallet?.bait ?? EMPTY_BAIT,
    today: wallet?.today ?? EMPTY_TODAY,
  }
  publish()
}

function maybeInvite(): void {
  if (inviteShown) return
  inviteShown = true
  writeSession(INVITE_KEY)
  track('coins_invite_shown')
  emit({ type: 'invite' })
}

function storeCarry(claim: BuiltClaim, now: Date): void {
  const tzOffset = tzOffsetNow(now)
  const today = localDay(tzOffset, now)
  writeCarry(carryAdd(carryPrune(readCarry(), today), claim, CARRY_CAP))
}

function queueClaim(claim: BuiltClaim): void {
  if (memberId === null) return
  const entry: OutboxEntry = {
    memberId,
    key: claim.key,
    request: claim.request,
    attempts: 0,
    nextAt: Date.now(),
  }
  writeOutbox(outboxAdd(readOutbox(), entry))
  void flushOutbox()
}

export function earn(source: EarnSource, detail: EarnDetail = {}): void {
  ensureStarted()
  const now = new Date()
  const claim = buildClaim(source, detail, now)
  if (!claim) return
  if (memberId === null) {
    storeCarry(claim, now)
    maybeInvite()
    return
  }
  queueClaim(claim)
}

function isClaimReply(value: unknown): value is {
  granted: number
  balance: number
  capped: boolean
  already?: boolean
} {
  return (
    isRecord(value) &&
    typeof value.granted === 'number' &&
    typeof value.balance === 'number' &&
    typeof value.capped === 'boolean'
  )
}

function isBaitCounts(value: unknown): value is Record<string, number> {
  return isRecord(value) && Object.values(value).every((count) => typeof count === 'number')
}

function isBuyReply(
  value: unknown,
): value is { balance: number; items: string[]; bait: Record<string, number> } {
  return (
    isRecord(value) &&
    typeof value.balance === 'number' &&
    Array.isArray(value.items) &&
    value.items.every((item) => typeof item === 'string') &&
    isBaitCounts(value.bait)
  )
}

function isWalletView(value: unknown): value is WalletView {
  return (
    isRecord(value) &&
    typeof value.balance === 'number' &&
    Array.isArray(value.items) &&
    value.items.every((item) => typeof item === 'string') &&
    isBaitCounts(value.bait) &&
    isRecord(value.today) &&
    typeof value.today.coin === 'number' &&
    typeof value.today.games === 'number' &&
    typeof value.today.note === 'number'
  )
}

async function refreshWallet(): Promise<void> {
  const id = memberId
  if (id === null) return
  let response: Response
  try {
    response = await fetch(`/api/wallet?tz=${tzOffsetNow()}`, { cache: 'no-store' })
  } catch {
    return
  }
  if (memberId !== id || !response.ok) return
  const body: unknown = await response.json().catch(() => null)
  if (memberId !== id || !isWalletView(body)) return
  wallet = body
  publish()
}

async function flushOnce(id: string): Promise<void> {
  let entries = readOutbox()
  const due = outboxDue(entries, id, Date.now())
  for (const entry of due) {
    if (memberId !== id) return
    let response: Response
    try {
      response = await fetch('/api/wallet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
        body: JSON.stringify(entry.request),
      })
    } catch {
      entries = outboxFail(entries, id, entry.key, Date.now())
      writeOutbox(entries)
      continue
    }

    if (response.status === 200) {
      const body: unknown = await response.json().catch(() => null)
      entries = outboxRemove(entries, id, entry.key)
      writeOutbox(entries)
      if (isClaimReply(body)) {
        setBalance(body.balance)
        emitEarned(entry.request.source, body)
      }
      continue
    }

    if (response.status === 400) {
      entries = outboxRemove(entries, id, entry.key)
      writeOutbox(entries)
      continue
    }

    if (response.status === 401 || response.status === 409) return

    entries = outboxFail(entries, id, entry.key, Date.now())
    writeOutbox(entries)
  }
}

export function flushOutbox(): Promise<void> {
  if (memberId === null) return Promise.resolve()
  if (flushing !== null) {
    flushQueued = true
    return flushing
  }
  const id = memberId
  flushing = flushOnce(id).finally(() => {
    flushing = null
    if (flushQueued) {
      flushQueued = false
      void flushOutbox()
      return
    }
    if (memberId === id) scheduleRetry()
  })
  return flushing
}

function scheduleRetry(): void {
  if (retryTimer !== null) {
    window.clearTimeout(retryTimer)
    retryTimer = null
  }
  const id = memberId
  if (id === null) return
  const due = outboxDue(readOutbox(), id, Date.now())
  const earliest = due.length === 0 ? readOutbox().filter((entry) => entry.memberId === id) : due
  if (earliest.length === 0) return
  const wait = Math.max(0, Math.min(...earliest.map((entry) => entry.nextAt)) - Date.now())
  retryTimer = window.setTimeout(() => {
    retryTimer = null
    void flushOutbox()
  }, wait)
}

async function claimCarryOver(id: string): Promise<void> {
  const now = new Date()
  const tzOffset = tzOffsetNow(now)
  let entries = carryPrune(readCarry(), localDay(tzOffset, now))
  writeCarry(entries)

  for (const group of chunk(entries, BATCH)) {
    if (memberId !== id) return
    let response: Response
    try {
      response = await fetch('/api/wallet/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
        body: JSON.stringify({ batch: group.map((entry) => entry.request), tzOffset }),
      })
    } catch {
      return
    }
    if (memberId !== id) return
    if (response.status === 200) {
      const body: unknown = await response.json().catch(() => null)
      if (isRecord(body) && typeof body.balance === 'number') setBalance(body.balance)
      if (isRecord(body) && typeof body.granted === 'number' && body.granted > 0) {
        track('coins_earned')
      }
      entries = carryRemove(entries, group.map((entry) => entry.key))
      writeCarry(entries)
      continue
    }
    if (response.status === 400) {
      entries = carryRemove(entries, group.map((entry) => entry.key))
      writeCarry(entries)
      continue
    }
    return
  }
}

async function syncMember(id: string): Promise<void> {
  await claimCarryOver(id)
  if (memberId !== id) return
  await flushOutbox()
  if (memberId !== id) return
  await refreshWallet()
}

function memberChanged(): void {
  const next = defaultStore().getMemberSnapshot()?.id ?? null
  if (next === memberId) return
  memberId = next
  wallet = null
  cappedTracked.clear()
  publish()
  if (next !== null) void syncMember(next)
}

export function ensureStarted(): void {
  if (started || typeof window === 'undefined') return
  started = true
  inviteShown = readSession(INVITE_KEY)
  const store = defaultStore()
  memberId = store.getMemberSnapshot()?.id ?? null
  publish()
  store.subscribeMember(memberChanged)
  window.addEventListener('online', onOnline)
  if (memberId !== null) void syncMember(memberId)
}

function onOnline(): void {
  void flushOutbox()
}

export function shutdown(): void {
  if (shuttingDown || !started) return
  shuttingDown = true
  window.removeEventListener('online', onOnline)
  if (retryTimer !== null) window.clearTimeout(retryTimer)
  retryTimer = null
}

export function subscribeWallet(listener: () => void): () => void {
  walletListeners.add(listener)
  ensureStarted()
  return () => {
    walletListeners.delete(listener)
  }
}

export function getWalletSnapshot(): WalletSnapshot {
  return snapshot
}

export async function buy(itemId: string): Promise<BuyOutcome> {
  ensureStarted()
  const id = memberId
  if (id === null) return 'error'
  let response: Response
  try {
    response = await fetch('/api/wallet/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': id },
      body: JSON.stringify({ itemId }),
    })
  } catch {
    return 'error'
  }
  if (response.status === 402) return 'insufficient'
  if (!response.ok) return 'error'
  const body: unknown = await response.json().catch(() => null)
  if (memberId !== id || !isBuyReply(body)) return 'error'
  wallet = {
    balance: body.balance,
    items: body.items,
    bait: body.bait,
    today: wallet?.today ?? EMPTY_TODAY,
  }
  publish()
  track('item_kept')
  return 'ok'
}

export function subscribeEvents(listener: (event: EconomyEvent) => void): () => void {
  eventListeners.add(listener)
  ensureStarted()
  return () => {
    eventListeners.delete(listener)
  }
}

export function refreshWalletNow(): Promise<void> {
  return refreshWallet()
}
