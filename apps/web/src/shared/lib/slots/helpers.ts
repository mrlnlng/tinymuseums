import { defineSlot, slotDef, upgrade, type SlotDef } from '@tiny/core/slots'
import { testFixture, type TestFixture } from '../../../../../../packages/core/src/slots/test-fixture.ts'
import type { EventLike, SyncEnv } from './store.ts'
import type { StorageLike } from './storage.ts'

export const fixture = testFixture

export const fixtureRegistry: Record<string, SlotDef<unknown>> = { 'test-fixture': testFixture }

export const fixtureB = defineSlot<TestFixture>({ ...testFixture, name: 'test-fixture-b' })

export const fixtureRegistryBoth: Record<string, SlotDef<unknown>> = {
  'test-fixture': testFixture,
  'test-fixture-b': fixtureB,
}

export const deviceSlot = defineSlot<{ n: number }>({
  name: 'device-only',
  version: 1,
  sync: false,
  maxBytes: 512,
  empty: () => ({ n: 0 }),
  parse: (raw) => {
    if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return null
    const n = (raw as Record<string, unknown>).n
    return typeof n === 'number' && Number.isFinite(n) ? (raw as { n: number }) : null
  },
  migrations: {},
  merge: (a, b) => ({ n: Math.max(a.n, b.n) }),
  samples: [],
})

export class FakeStorage implements StorageLike {
  map = new Map<string, string>()
  throwing = false
  writesThrow = false
  readThrows = false
  reads: string[] = []
  writes: string[] = []

  getItem(key: string): string | null {
    if (this.throwing || this.readThrows) throw new Error('storage unavailable')
    this.reads.push(key)
    return this.map.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    if (this.throwing || this.writesThrow) throw new Error('quota exceeded')
    this.writes.push(`set:${key}`)
    this.map.set(key, value)
  }

  removeItem(key: string): void {
    if (this.throwing) throw new Error('storage unavailable')
    this.writes.push(`remove:${key}`)
    this.map.delete(key)
  }

  keys(): string[] {
    if (this.throwing || this.readThrows) throw new Error('storage unavailable')
    return [...this.map.keys()]
  }

  raw(key: string): string | null {
    return this.map.get(key) ?? null
  }

  rawKeys(): string[] {
    return [...this.map.keys()].sort()
  }
}

export class FakeEvents {
  private listeners = new Map<string, Set<(event: EventLike) => void>>()

  addEventListener(type: string, listener: (event: EventLike) => void): void {
    let set = this.listeners.get(type)
    if (!set) {
      set = new Set()
      this.listeners.set(type, set)
    }
    set.add(listener)
  }

  removeEventListener(type: string, listener: (event: EventLike) => void): void {
    this.listeners.get(type)?.delete(listener)
  }

  dispatch(type: string, event?: Partial<EventLike>): void {
    for (const listener of this.listeners.get(type) ?? []) {
      listener({ key: null, newValue: null, ...event })
    }
  }
}

export interface ServerMember {
  id: string
  email: string
  password: string
}

export interface ServerRow {
  version: number
  doc: unknown
}

export interface RecordedRequest {
  url: string
  method: string
  headers: Record<string, string>
  body: unknown
  init?: RequestInit
}

export class FakeServer {
  members = new Map<string, ServerMember>()
  rows = new Map<string, Map<string, ServerRow>>()
  cookie: string | null = null
  versionAhead = false
  requests: RecordedRequest[] = []
  throttled = false
  private registry: Record<string, SlotDef<unknown>>
  private nextId = 1

  constructor(registry: Record<string, SlotDef<unknown>>) {
    this.registry = registry
  }

  fetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input)
    const headers: Record<string, string> = {}
    new Headers(init?.headers).forEach((value, key) => {
      headers[key] = value
    })
    let body: unknown = null
    if (typeof init?.body === 'string') {
      try {
        body = JSON.parse(init.body)
      } catch {
        body = null
      }
    }
    this.requests.push({ url, method: init?.method ?? 'GET', headers, body, init })
    return Promise.resolve(this.handle(url, init?.method ?? 'GET', headers, body))
  }

  private handle(url: string, method: string, headers: Record<string, string>, body: unknown): Response {
    const path = url.split('?')[0]
    if (path === '/api/me/sign-up' && method === 'POST') {
      const input = body as { email?: unknown; password?: unknown } | null
      const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
      const password = typeof input?.password === 'string' ? input.password : ''
      if (!email.includes('@') || password === '') return this.json(400, { error: 'invalid' })
      if (this.memberByEmail(email)) return this.json(400, { error: 'email_taken' })
      const member = { id: `m${this.nextId++}`, email, password }
      this.members.set(member.id, member)
      this.cookie = member.id
      return this.json(200, { id: member.id, email: member.email })
    }
    if (path === '/api/me/sign-in' && method === 'POST') {
      const input = body as { email?: unknown; password?: unknown } | null
      const email = typeof input?.email === 'string' ? input.email.trim().toLowerCase() : ''
      const member = email === '' ? undefined : this.memberByEmail(email)
      if (!member || input?.password !== member.password) return this.json(400, { error: 'bad_credentials' })
      this.cookie = member.id
      return this.json(200, { id: member.id, email: member.email })
    }
    if (path === '/api/me/password' && method === 'POST') {
      const auth = this.expectMember(headers)
      if (auth === null || 'error' in auth) return this.authError(auth)
      const input = body as { current?: unknown; next?: unknown } | null
      if (input?.current !== auth.member.password) return this.json(400, { error: 'bad_credentials' })
      if (typeof input?.next !== 'string' || input.next === '') return this.json(400, { error: 'invalid' })
      auth.member.password = input.next
      return this.json(204, null)
    }
    if (path === '/api/me/sign-out' && method === 'POST') {
      const auth = this.expectMember(headers)
      if (auth === null || 'error' in auth) return this.authError(auth)
      this.cookie = null
      return this.json(204, null)
    }
    if (path === '/api/me' && method === 'GET') {
      return this.json(200, { member: this.cookie ? this.publicMember(this.cookie) : null })
    }
    if (path === '/api/me/slots' && method === 'GET') {
      const auth = this.expectMember(headers)
      if (auth === null || 'error' in auth) return this.authError(auth)
      const slots: Record<string, { version: number; doc: unknown }> = {}
      for (const [name, row] of this.rows.get(auth.member.id) ?? []) {
        slots[name] = { version: row.version, doc: row.doc }
      }
      return this.json(200, { slots })
    }
    if (path === '/api/me/export' && method === 'GET') {
      const auth = this.expectMember(headers)
      if (auth === null || 'error' in auth) return this.authError(auth)
      const slots: Record<string, { version: number; doc: unknown }> = {}
      for (const [name, row] of this.rows.get(auth.member.id) ?? []) {
        slots[name] = { version: row.version, doc: row.doc }
      }
      return this.json(200, { email: auth.member.email, createdAt: '', slots })
    }
    if (path === '/api/me/delete' && method === 'POST') {
      const auth = this.expectMember(headers)
      if (auth === null || 'error' in auth) return this.authError(auth)
      const input = body as { password?: unknown } | null
      if (input?.password !== auth.member.password) return this.json(400, { error: 'bad_credentials' })
      this.members.delete(auth.member.id)
      this.rows.delete(auth.member.id)
      this.cookie = null
      return this.json(204, null)
    }
    if (path.startsWith('/api/me/slots/') && method === 'PUT') {
      const auth = this.expectMember(headers)
      if (auth === null || 'error' in auth) return this.authError(auth)
      const name = path.slice('/api/me/slots/'.length)
      const def = slotDef(name, this.registry)
      if (!def) return this.json(404, { error: 'unknown_slot' })
      if (this.throttled) return this.json(429, { error: 'too_many_requests' })
      if (this.versionAhead) return this.json(409, { error: 'version_ahead' })
      const input = body as { version?: unknown; doc?: unknown } | null
      if (typeof input?.version !== 'number' || !Number.isInteger(input.version)) return this.json(400, { error: 'invalid' })
      if (input.version > def.version) return this.json(409, { error: 'version_ahead' })
      const upgraded = upgrade(def, input.version, input.doc)
      if (upgraded === null) return this.json(400, { error: 'invalid' })
      const memberRows = this.rows.get(auth.member.id) ?? new Map<string, ServerRow>()
      const stored = memberRows.get(name)
      const merged = def.merge(stored ? stored.doc : def.empty(), upgraded)
      const row = { version: def.version, doc: merged }
      memberRows.set(name, row)
      this.rows.set(auth.member.id, memberRows)
      return this.json(200, { version: row.version, doc: row.doc })
    }
    return this.json(404, { error: 'not_found' })
  }

  private expectMember(headers: Record<string, string>): { member: ServerMember } | { error: string } | null {
    if (this.cookie === null) return { error: 'unauthorized' }
    const claimed = headers['x-tm-member'] ?? headers['X-TM-Member']
    if (claimed !== this.cookie) return { error: 'member_mismatch' }
    const member = this.members.get(this.cookie)
    if (!member) return { error: 'unauthorized' }
    return { member }
  }

  private authError(auth: { error: string } | null): Response {
    if (auth?.error === 'member_mismatch') return this.json(409, { error: 'member_mismatch' })
    return this.json(401, { error: 'unauthorized' })
  }

  private memberByEmail(email: string): ServerMember | undefined {
    for (const member of this.members.values()) if (member.email === email) return member
    return undefined
  }

  private publicMember(id: string): { id: string; email: string } {
    const member = this.members.get(id)
    return { id, email: member?.email ?? '' }
  }

  private json(status: number, value: unknown): Response {
    return new Response(status === 204 ? null : JSON.stringify(value), {
      status,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
    })
  }

  row(memberId: string, name: string): ServerRow | null {
    return this.rows.get(memberId)?.get(name) ?? null
  }

  rowDoc(memberId: string, name: string): TestFixture | null {
    const row = this.row(memberId, name)
    return row ? (row.doc as TestFixture) : null
  }
}

export function memberIdOf(server: FakeServer, email: string): string {
  for (const member of server.members.values()) if (member.email === email) return member.id
  throw new Error(`no member ${email}`)
}

export function memberKeyOf(memberId: string, name: string): string {
  return `tm_slot:m:${memberId}:${name}`
}

export function storedDoc(storage: FakeStorage, key: string): Record<string, unknown> | null {
  const raw = storage.raw(key)
  if (raw === null) return null
  const parsed = JSON.parse(raw) as { doc?: unknown }
  return parsed && typeof parsed === 'object' && parsed.doc !== null && typeof parsed.doc === 'object'
    ? (parsed.doc as Record<string, unknown>)
    : null
}

export function storedFixture(storage: FakeStorage, key: string): TestFixture | null {
  return storedDoc(storage, key) as TestFixture | null
}

export function storedDirty(storage: FakeStorage, key: string): boolean | null {
  const raw = storage.raw(key)
  if (raw === null) return null
  const parsed = JSON.parse(raw) as { dirty?: unknown }
  return parsed && typeof parsed === 'object' ? parsed.dirty === true : null
}

export function putCount(server: FakeServer, name: string): number {
  return server.requests.filter((r) => r.method === 'PUT' && r.url === `/api/me/slots/${name}`).length
}

export function deferredFetch(
  server: FakeServer,
  capture: boolean,
  when?: (input: RequestInfo | URL, init?: RequestInit) => boolean,
) {
  const held: {
    input: RequestInfo | URL
    init?: RequestInit
    resolve: (response: Response) => void
    captured?: Promise<Response>
  }[] = []
  let holding = false
  return {
    fetch: (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
      if (!holding || !(when ?? (() => true))(input, init)) return server.fetch(input, init)
      let captured: Promise<Response> | undefined
      if (capture) captured = server.fetch(input, init)
      return new Promise<Response>((resolve) => {
        held.push({ input, init, resolve, captured })
      })
    },
    hold: (): void => {
      holding = true
    },
    pass: (): void => {
      holding = false
    },
    release: async (): Promise<void> => {
      const pending = held.splice(0)
      for (const request of pending) {
        request.resolve(await (request.captured ?? server.fetch(request.input, request.init)))
      }
    },
    heldCount: (): number => held.length,
  }
}

export function makeEnv(opts: {
  server: FakeServer
  storage: FakeStorage
  registry?: Record<string, SlotDef<unknown>>
  events?: FakeEvents
  lifecycle?: FakeEvents
  debounceMs?: number
  fetchFn?: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
}) {
  let visible = true
  const lifecycle = opts.lifecycle ?? new FakeEvents()
  const env: SyncEnv = {
    storage: opts.storage,
    fetchFn: opts.fetchFn ?? opts.server.fetch,
    registry: opts.registry ?? fixtureRegistry,
    debounceMs: opts.debounceMs ?? 10,
    events: opts.events ?? new FakeEvents(),
    lifecycle,
    isVisible: () => visible,
  }
  return {
    env,
    lifecycle,
    setVisible: (value: boolean): void => {
      visible = value
    },
  }
}

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms))

export async function waitFor(check: () => boolean, what = 'condition'): Promise<void> {
  const deadline = Date.now() + 5000
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out waiting for ${what}`)
    await sleep(5)
  }
}
