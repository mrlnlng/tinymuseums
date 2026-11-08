import { defaultStore } from '@/shared/lib/slots'
import { fetchPondState, type PondStateView } from './pond-api'

/**
 * The pond's own little store, in the same subscribe/refresh shape as the economy store.
 * Panels and the room HUD read the same pearls, and the fishing view can adopt it later.
 */

export interface PondStateSnapshot {
  isMember: boolean
  isReady: boolean
  state: PondStateView | null
  error: string | null
}

const GUEST: PondStateSnapshot = { isMember: false, isReady: true, state: null, error: null }
const LOADING: PondStateSnapshot = { isMember: false, isReady: false, state: null, error: null }

let snapshot: PondStateSnapshot = GUEST
let started = false
let memberId: string | null = null
let inflight: Promise<void> | null = null
let inflightId: string | null = null
let unsubscribeMember: (() => void) | null = null
const listeners = new Set<() => void>()

function publish(next: PondStateSnapshot): void {
  snapshot = next
  for (const listener of listeners) listener()
}

function readMemberId(): string | null {
  if (typeof window === 'undefined') return null
  try {
    return defaultStore().getMemberSnapshot()?.id ?? null
  } catch {
    return null
  }
}

function watchMember(): void {
  const store = defaultStore()
  unsubscribeMember?.()
  unsubscribeMember = store.subscribeMember(() => {
    const next = readMemberId()
    if (next === memberId) return
    memberId = next
    publish(LOADING)
    void refreshPondState()
  })
}

export function ensurePondStateStarted(): void {
  if (started || typeof window === 'undefined') return
  started = true
  memberId = readMemberId()
  watchMember()
  if (memberId === null) publish(GUEST)
  else void refreshPondState()
}

export function subscribePondState(listener: () => void): () => void {
  ensurePondStateStarted()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getPondStateSnapshot(): PondStateSnapshot {
  return snapshot
}

/** Adopt a state view returned by a mutation so every subscriber updates at once. */
export function setPondState(state: PondStateView): void {
  publish({ isMember: true, isReady: true, state, error: null })
}

export function refreshPondState(): Promise<void> {
  ensurePondStateStarted()
  const id = readMemberId()
  memberId = id
  if (id === null) {
    publish(GUEST)
    return Promise.resolve()
  }
  if (inflight !== null && inflightId === id) return inflight

  let settled: Promise<void> | null = null
  settled = (async () => {
    const result = await fetchPondState()
    if (memberId !== id) return
    if (result.ok) {
      publish({ isMember: true, isReady: true, state: result.value, error: null })
      return
    }
    if (result.status === 401) {
      publish(GUEST)
      return
    }
    publish({ ...snapshot, isReady: true, error: result.error })
  })().finally(() => {
    if (inflight === settled) {
      inflight = null
      inflightId = null
    }
  })

  inflight = settled
  inflightId = id
  return settled
}
