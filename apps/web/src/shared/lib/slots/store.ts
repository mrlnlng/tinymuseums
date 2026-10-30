import { SLOTS, upgrade, type SlotDef } from '@tiny/core/slots'
import {
  ANON_PREFIX,
  MEMBER_KEY,
  anonKey,
  deviceKey,
  encodeStored,
  isMemberSlotKey,
  listKeys,
  memberKey,
  memberPrefix,
  parseStored,
  readStored,
  removeStored,
  tryReadStored,
  writeStored,
  type StorageLike,
} from './storage.ts'

export interface MemberInfo {
  id: string
  email: string
}

export interface EventLike {
  key: string | null
  newValue: string | null
}

export interface EventTargetLike {
  addEventListener(type: string, listener: (event: EventLike) => void): void
  removeEventListener(type: string, listener: (event: EventLike) => void): void
}

export interface SyncEnv {
  storage: StorageLike
  fetchFn: typeof fetch
  registry?: Record<string, SlotDef<unknown>>
  debounceMs?: number
  setTimeoutFn?: typeof setTimeout
  clearTimeoutFn?: typeof clearTimeout
  events?: EventTargetLike
  lifecycle?: EventTargetLike
  isVisible?: () => boolean
}

export interface SlotHandle<T> {
  snapshot(): T
  subscribe(listener: () => void): () => void
  update(fn: (current: T) => T): void
}

interface SlotState<T> {
  def: SlotDef<T>
  memory: T
  dirty: boolean
  generation: number
  listeners: Set<() => void>
  handle: SlotHandle<T>
}

interface Scope {
  memberId: string | null
  prefix: string
}

function deepEq(a: unknown, b: unknown): boolean {
  if (a === b) return true
  if (a === null || b === null || typeof a !== 'object' || typeof b !== 'object') return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (!Object.hasOwn(b, key)) return false
    if (!deepEq((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) return false
  }
  return true
}

export class SyncStore {
  private readonly storage: StorageLike
  private readonly fetchFn: typeof fetch
  private readonly registry: Record<string, SlotDef<unknown>>
  private readonly debounceMs: number
  private readonly setTimeoutFn: typeof setTimeout
  private readonly clearTimeoutFn: typeof clearTimeout
  private readonly isVisible: () => boolean

  private scope: Scope
  private member: MemberInfo | null
  private readonly slots = new Map<string, SlotState<unknown>>()
  private readonly memberListeners = new Set<() => void>()
  private debounceTimer: ReturnType<typeof setTimeout> | null = null
  private drainChain: Promise<void> = Promise.resolve()

  constructor(env: SyncEnv) {
    this.storage = env.storage
    this.fetchFn = env.fetchFn
    this.registry = env.registry ?? SLOTS
    this.debounceMs = env.debounceMs ?? 2000
    this.setTimeoutFn = env.setTimeoutFn ?? setTimeout
    this.clearTimeoutFn = env.clearTimeoutFn ?? clearTimeout
    this.isVisible = env.isVisible ?? (() => true)
    const marker = readStored(this.storage, MEMBER_KEY)
    this.scope = { memberId: marker, prefix: marker ? memberPrefix(marker) : ANON_PREFIX }
    this.member = marker ? { id: marker, email: '' } : null
    env.events?.addEventListener('storage', this.onStorage)
    env.lifecycle?.addEventListener('visibilitychange', this.onVisibility)
    env.lifecycle?.addEventListener('online', this.onOnline)
    if (marker) this.triggerDrain()
  }

  getSlot<T>(def: SlotDef<T>): SlotHandle<T> {
    const existing = this.slots.get(def.name)
    if (existing) return existing.handle as SlotHandle<T>
    return this.createState(def).handle
  }

  private createState<T>(def: SlotDef<T>): SlotState<T> {
    const key = this.slotKey(def)
    const stored = parseStored(readStored(this.storage, key))
    let doc: T | null = stored === null ? null : (upgrade(def, stored.version, stored.doc) as T | null)
    let dirty = stored?.dirty ?? false
    // safety net: anon data written before this tab mounted the slot joins the member record
    if (def.sync && this.scope.memberId !== null) {
      const aStored = parseStored(readStored(this.storage, anonKey(def.name)))
      if (aStored !== null) {
        const aDoc = upgrade(def, aStored.version, aStored.doc)
        if (aDoc !== null) {
          doc = def.merge(doc ?? def.empty(), aDoc as T)
          dirty = true
          if (writeStored(this.storage, key, encodeStored(def.version, doc, true))) {
            removeStored(this.storage, anonKey(def.name))
          }
        }
      }
    }
    const state: SlotState<T> = {
      def,
      memory: doc ?? def.empty(),
      dirty,
      generation: 0,
      listeners: new Set(),
      handle: null as unknown as SlotHandle<T>,
    }
    state.handle = {
      snapshot: () => state.memory,
      subscribe: (listener) => {
        state.listeners.add(listener)
        return () => {
          state.listeners.delete(listener)
        }
      },
      update: (fn) => this.update(def, fn),
    }
    this.slots.set(def.name, state as SlotState<unknown>)
    if (this.scope.memberId !== null && def.sync && dirty) this.scheduleDebounce()
    return state
  }

  private slotKey(def: SlotDef<unknown>): string {
    return def.sync ? `${this.scope.prefix}${def.name}` : deviceKey(def.name)
  }

  private syncedStates(): SlotState<unknown>[] {
    const states = new Map<string, SlotState<unknown>>()
    for (const def of Object.values(this.registry)) {
      if (!def.sync) continue
      const existing = this.slots.get(def.name)
      states.set(def.name, (existing ?? this.createState(def)) as SlotState<unknown>)
    }
    for (const state of this.slots.values()) if (state.def.sync) states.set(state.def.name, state)
    return [...states.values()]
  }

  private update<T>(def: SlotDef<T>, fn: (current: T) => T): void {
    const markerRead = tryReadStored(this.storage, MEMBER_KEY)
    if (markerRead !== null && markerRead.value !== this.scope.memberId) this.passiveTransition()
    const state = (this.slots.get(def.name) ?? this.createState(def)) as SlotState<T>
    const result = fn(state.memory)
    const key = this.slotKey(def)
    const stored = parseStored(readStored(this.storage, key))
    const base = stored === null ? def.empty() : ((upgrade(def, stored.version, stored.doc) as T | null) ?? def.empty())
    const merged = def.merge(base, result)
    state.memory = merged
    state.dirty = true
    state.generation++
    writeStored(this.storage, key, encodeStored(def.version, merged, true))
    this.notify(state)
    if (this.scope.memberId !== null && def.sync) this.scheduleDebounce()
  }

  private passiveTransition(): void {
    const markerRead = tryReadStored(this.storage, MEMBER_KEY)
    if (markerRead === null || markerRead.value === this.scope.memberId) return
    this.cancelDebounce()
    this.adopt(markerRead.value, markerRead.value ? { id: markerRead.value, email: '' } : null)
  }

  private signOutTransition(): void {
    this.cancelDebounce()
    removeStored(this.storage, MEMBER_KEY)
    for (const key of listKeys(this.storage)) {
      if (isMemberSlotKey(key)) removeStored(this.storage, key)
    }
    this.adopt(null, null)
  }

  private handle401(): void {
    this.cancelDebounce()
    removeStored(this.storage, MEMBER_KEY)
    this.adopt(null, null)
  }

  private claim(member: MemberInfo): void {
    this.cancelDebounce()
    const id = member.id
    const wasAnon = this.scope.memberId === null
    for (const key of listKeys(this.storage)) {
      if (isMemberSlotKey(key) && !key.startsWith(memberPrefix(id))) removeStored(this.storage, key)
    }
    const defs = new Map<string, SlotDef<unknown>>()
    for (const def of Object.values(this.registry)) if (def.sync) defs.set(def.name, def)
    for (const state of this.slots.values()) if (state.def.sync) defs.set(state.def.name, state.def)
    const mergedNames: string[] = []
    for (const def of defs.values()) {
      const mStored = parseStored(readStored(this.storage, memberKey(id, def.name)))
      const mDoc = mStored === null ? def.empty() : (upgrade(def, mStored.version, mStored.doc) ?? def.empty())
      const aStored = parseStored(readStored(this.storage, anonKey(def.name)))
      const aDoc = aStored === null ? def.empty() : (upgrade(def, aStored.version, aStored.doc) ?? def.empty())
      const merged = def.merge(mDoc, aDoc)
      if (writeStored(this.storage, memberKey(id, def.name), encodeStored(def.version, merged, true))) {
        mergedNames.push(def.name)
      }
    }
    writeStored(this.storage, MEMBER_KEY, id)
    for (const name of mergedNames) removeStored(this.storage, anonKey(name))
    this.scope = { memberId: id, prefix: memberPrefix(id) }
    for (const state of this.syncedStates()) {
      const stored = parseStored(readStored(this.storage, memberKey(id, state.def.name)))
      const doc = stored === null ? null : upgrade(state.def, stored.version, stored.doc)
      if (doc !== null) {
        state.memory = doc
        state.dirty = stored?.dirty ?? false
      } else {
        // storage unavailable: merge anon memory into the new memory
        state.memory = state.def.merge(state.def.empty(), wasAnon ? state.memory : state.def.empty())
        state.dirty = wasAnon
      }
      this.notify(state)
    }
    this.member = member
    this.notifyMember()
    this.triggerDrain()
  }

  private adopt(memberId: string | null, member: MemberInfo | null): void {
    this.scope = { memberId, prefix: memberId ? memberPrefix(memberId) : ANON_PREFIX }
    for (const state of this.slots.values()) {
      if (!state.def.sync) continue
      const stored = parseStored(readStored(this.storage, `${this.scope.prefix}${state.def.name}`))
      const doc = stored === null ? null : upgrade(state.def, stored.version, stored.doc)
      state.memory = doc ?? state.def.empty()
      state.dirty = stored?.dirty ?? false
      this.notify(state)
    }
    this.member = member
    this.notifyMember()
    if (memberId) this.triggerDrain()
  }

  private readonly onStorage = (event: EventLike): void => {
    if (event.key === MEMBER_KEY) {
      this.passiveTransition()
      return
    }
    if (event.key === null || event.newValue === null) return
    for (const state of this.slots.values()) {
      if (!state.def.sync) continue
      if (event.key !== `${this.scope.prefix}${state.def.name}`) continue
      const stored = parseStored(event.newValue)
      if (stored === null) return
      const doc = upgrade(state.def, stored.version, stored.doc)
      if (doc === null) return
      state.memory = state.def.merge(state.memory, doc)
      this.notify(state)
      return
    }
  }

  private readonly onVisibility = (): void => {
    if (this.isVisible()) this.triggerDrain()
    else this.flushHidden()
  }

  private readonly onOnline = (): void => {
    this.triggerDrain()
  }

  private scheduleDebounce(): void {
    this.cancelDebounce()
    this.debounceTimer = this.setTimeoutFn(() => {
      this.debounceTimer = null
      this.triggerDrain()
    }, this.debounceMs)
  }

  private cancelDebounce(): void {
    if (this.debounceTimer !== null) {
      this.clearTimeoutFn(this.debounceTimer)
      this.debounceTimer = null
    }
  }

  private triggerDrain(): void {
    if (!this.scope.memberId) return
    this.queueDrain()
  }

  private queueDrain(): void {
    this.drainChain = this.drainChain.then(() => this.drainOnce()).catch(() => {})
  }

  async drainNow(): Promise<void> {
    if (!this.scope.memberId) return
    this.queueDrain()
    await this.drainChain
  }

  private async drainOnce(): Promise<void> {
    const scope = this.scope
    if (!scope.memberId) return
    this.cancelDebounce()
    let res: Response
    try {
      res = await this.fetchFn('/api/me/slots', { headers: { 'X-TM-Member': scope.memberId } })
    } catch {
      return
    }
    if (res.status === 401) {
      if (this.scope === scope) this.handle401()
      return
    }
    if (res.status === 409) {
      if (this.scope === scope) await this.handle409()
      return
    }
    if (!res.ok) return
    const body = (await res.json().catch(() => null)) as {
      slots?: Record<string, { version: number; doc: unknown }>
    } | null
    if (this.scope !== scope) return
    const rows = body?.slots ?? {}
    const synced = this.syncedStates()
    for (const state of synced) {
      if (this.scope !== scope) return
      const row = rows[state.def.name]
      const serverDoc = row ? upgrade(state.def, row.version, row.doc) : null
      const stored = parseStored(readStored(this.storage, `${scope.prefix}${state.def.name}`))
      const base = stored === null ? state.def.empty() : (upgrade(state.def, stored.version, stored.doc) ?? state.def.empty())
      const local = state.def.merge(base, state.memory)
      const merged = serverDoc === null ? local : state.def.merge(local, serverDoc)
      state.memory = merged
      writeStored(
        this.storage,
        `${scope.prefix}${state.def.name}`,
        encodeStored(state.def.version, merged, (stored?.dirty ?? false) || state.dirty),
      )
      this.notify(state)
    }
    for (const state of synced) {
      if (this.scope !== scope) return
      const row = rows[state.def.name]
      const upgraded = row ? upgrade(state.def, row.version, row.doc) : null
      const serverCopy = row && upgraded === null ? null : (upgraded ?? state.def.empty())
      const stored = parseStored(readStored(this.storage, `${scope.prefix}${state.def.name}`))
      const dirty = state.dirty || (stored?.dirty ?? false)
      const differs = serverCopy === null ? true : !deepEq(serverCopy, state.memory)
      if (dirty || differs) await this.putSlot(state, scope, false)
    }
  }

  private async putSlot(state: SlotState<unknown>, scope: Scope, keepalive: boolean): Promise<void> {
    const def = state.def
    let generation = state.generation
    for (;;) {
      if (this.scope !== scope) return
      let res: Response
      try {
        res = await this.fetchFn(`/api/me/slots/${def.name}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-TM-Member': scope.memberId ?? '' },
          body: JSON.stringify({ version: def.version, doc: state.memory }),
          keepalive: keepalive || undefined,
        })
      } catch {
        return
      }
      if (res.status === 401) {
        if (this.scope === scope) this.handle401()
        return
      }
      if (res.status === 409) {
        const body = (await res.json().catch(() => null)) as { error?: unknown } | null
        if (this.scope === scope && body?.error === 'member_mismatch') await this.handle409()
        return
      }
      if (res.status !== 200) return
      const reply = (await res.json().catch(() => null)) as { version?: unknown; doc?: unknown } | null
      if (this.scope !== scope) return
      const replyDoc = reply && typeof reply.version === 'number' ? upgrade(def, reply.version, reply.doc) : def.empty()
      const unchanged = generation === state.generation
      if (replyDoc !== null) {
        const stored = parseStored(readStored(this.storage, `${scope.prefix}${def.name}`))
        const base = stored === null ? def.empty() : (upgrade(def, stored.version, stored.doc) ?? def.empty())
        state.memory = def.merge(def.merge(base, state.memory), replyDoc)
        state.dirty = !unchanged
        writeStored(this.storage, `${scope.prefix}${def.name}`, encodeStored(def.version, state.memory, state.dirty))
        this.notify(state)
      } else {
        // reply newer than our def: ignore the doc, still clear dirty under the generation rule
        state.dirty = !unchanged
        writeStored(this.storage, `${scope.prefix}${def.name}`, encodeStored(def.version, state.memory, state.dirty))
        this.notify(state)
      }
      if (!unchanged) {
        if (keepalive) return
        generation = state.generation
        continue
      }
      return
    }
  }

  private flushHidden(): void {
    const scope = this.scope
    if (!scope.memberId) return
    for (const state of this.slots.values()) {
      if (!state.def.sync) continue
      const stored = parseStored(readStored(this.storage, `${scope.prefix}${state.def.name}`))
      if (state.dirty || (stored?.dirty ?? false)) void this.putSlot(state, scope, true)
    }
  }

  private async handle409(): Promise<void> {
    const scope = this.scope
    let res: Response
    try {
      res = await this.fetchFn('/api/me', { cache: 'no-store' })
    } catch {
      return
    }
    if (this.scope !== scope) return
    if (!res.ok) return
    const body = (await res.json().catch(() => null)) as { member?: { id?: unknown; email?: unknown } | null } | null
    if (this.scope !== scope) return
    const member = body?.member ?? null
    if (member !== null && typeof member.id === 'string') {
      this.claim({ id: member.id, email: typeof member.email === 'string' ? member.email : '' })
    } else {
      this.handle401()
    }
  }

  readonly subscribeMember = (listener: () => void): (() => void) => {
    this.memberListeners.add(listener)
    return () => {
      this.memberListeners.delete(listener)
    }
  }

  readonly getMemberSnapshot = (): MemberInfo | null => this.member

  readonly refreshMember = async (): Promise<void> => {
    const scope = this.scope
    if (!scope.memberId) return
    let res: Response
    try {
      res = await this.fetchFn('/api/me', { cache: 'no-store' })
    } catch {
      return
    }
    if (this.scope !== scope) return
    if (!res.ok) return
    const body = (await res.json().catch(() => null)) as { member?: { id?: unknown; email?: unknown } | null } | null
    if (this.scope !== scope) return
    const member = body?.member ?? null
    if (member !== null && typeof member.id === 'string') {
      if (member.id === scope.memberId) {
        this.member = { id: member.id, email: typeof member.email === 'string' ? member.email : '' }
        this.notifyMember()
      } else {
        this.claim({ id: member.id, email: typeof member.email === 'string' ? member.email : '' })
      }
    } else {
      this.handle401()
    }
  }

  readonly signUp = async (email: string, password: string): Promise<null | 'invalid' | 'email_taken'> => {
    const res = await this.fetchFn('/api/me/sign-up', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.status === 200) {
      const body = (await res.json()) as { id?: unknown; email?: unknown }
      if (typeof body.id !== 'string') return 'invalid'
      this.claim({ id: body.id, email: typeof body.email === 'string' ? body.email : '' })
      return null
    }
    if (res.status === 400) {
      const body = (await res.json().catch(() => null)) as { error?: unknown } | null
      return body?.error === 'email_taken' ? 'email_taken' : 'invalid'
    }
    throw new Error(`sign-up failed: ${res.status}`)
  }

  readonly signIn = async (email: string, password: string): Promise<boolean> => {
    const res = await this.fetchFn('/api/me/sign-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (res.status === 200) {
      const body = (await res.json()) as { id?: unknown; email?: unknown }
      if (typeof body.id !== 'string') return false
      this.claim({ id: body.id, email: typeof body.email === 'string' ? body.email : '' })
      return true
    }
    if (res.status === 400) return false
    throw new Error(`sign-in failed: ${res.status}`)
  }

  readonly changePassword = async (current: string, next: string): Promise<boolean> => {
    const scope = this.scope
    if (!scope.memberId) return false
    const res = await this.fetchFn('/api/me/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': scope.memberId },
      body: JSON.stringify({ current, next }),
    })
    if (res.status === 204) return true
    if (res.status === 401) {
      if (this.scope === scope) this.handle401()
      return false
    }
    if (res.status === 409) {
      if (this.scope === scope) await this.handle409()
      return false
    }
    return false
  }

  readonly hasDirty = (): boolean => {
    for (const state of this.syncedStates()) {
      if (state.dirty) return true
      const stored = parseStored(readStored(this.storage, `${this.scope.prefix}${state.def.name}`))
      if (stored?.dirty ?? false) return true
    }
    return false
  }

  readonly signOut = async (options?: { force?: boolean }): Promise<'ok' | 'dirty'> => {
    const scope = this.scope
    if (scope.memberId === null) {
      if (!options?.force && this.hasDirty()) return 'dirty'
      this.signOutTransition()
      return 'ok'
    }
    await this.drainNow()
    if (this.scope !== scope) {
      if (this.scope.memberId === null) {
        if (!options?.force && this.hasDirty()) return 'dirty'
        this.signOutTransition()
      }
      return 'ok'
    }
    if (!options?.force && this.hasDirty()) return 'dirty'
    const res = await this.fetchFn('/api/me/sign-out', {
      method: 'POST',
      headers: { 'X-TM-Member': scope.memberId },
    })
    if (this.scope !== scope) return 'ok'
    if (res.status === 204 || res.status === 401) {
      this.signOutTransition()
      return 'ok'
    }
    if (res.status === 409) {
      await this.handle409()
      return 'ok'
    }
    return 'ok'
  }

  readonly deleteAccount = async (password: string, options?: { force?: boolean }): Promise<true | false | 'dirty'> => {
    const scope = this.scope
    if (!scope.memberId) return false
    await this.drainNow()
    if (this.scope !== scope) return false
    if (!options?.force && this.hasDirty()) return 'dirty'
    const res = await this.fetchFn('/api/me/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-TM-Member': scope.memberId },
      body: JSON.stringify({ password }),
    })
    if (this.scope !== scope) return false
    if (res.status === 204) {
      this.signOutTransition()
      return true
    }
    if (res.status === 401) {
      this.handle401()
      return false
    }
    if (res.status === 409) {
      await this.handle409()
      return false
    }
    return false
  }

  readonly exportData = async (): Promise<Blob | null> => {
    const scope = this.scope
    if (!scope.memberId) return null
    let res: Response
    try {
      res = await this.fetchFn('/api/me/export', { headers: { 'X-TM-Member': scope.memberId } })
    } catch {
      return null
    }
    if (this.scope !== scope) return null
    if (res.status === 401) {
      this.handle401()
      return null
    }
    if (res.status === 409) {
      await this.handle409()
      return null
    }
    if (!res.ok) return null
    try {
      return await res.blob()
    } catch {
      return null
    }
  }

  private notify(state: SlotState<unknown>): void {
    for (const listener of state.listeners) listener()
  }

  private notifyMember(): void {
    for (const listener of this.memberListeners) listener()
  }
}

export function createStore(env: SyncEnv): SyncStore {
  return new SyncStore(env)
}

function defaultEnv(): SyncEnv {
  return {
    storage: {
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, value) => {
        window.localStorage.setItem(key, value)
      },
      removeItem: (key) => {
        window.localStorage.removeItem(key)
      },
      keys: () => Object.keys(window.localStorage),
    },
    fetchFn: (...args) => fetch(...args),
    registry: SLOTS,
    events: window,
    lifecycle: window,
    isVisible: () => document.visibilityState === 'visible',
  }
}

let store: SyncStore | null = null

export function defaultStore(): SyncStore {
  if (!store) store = new SyncStore(defaultEnv())
  return store
}
