import assert from 'node:assert/strict'
import { test } from 'node:test'
import { ROOM_CAPACITY, parseClientMessage, type Peer, type ServerMessage } from '@tiny/core/presence/wire'
import { HEARTBEAT_MS, HIDDEN_LIMIT_MS, createPresence, type Connect, type Self, type SocketHandlers } from './presence.ts'

const flush = () => new Promise((resolve) => setImmediate(resolve))
const look = { kind: 'otter', costume: null, bow: null } as const

/** Behaves like apps/presence for the client's purposes: tickets are "pid:name". */
class MemoryRooms {
  rooms = new Map<string, Set<Conn>>()
  sentStates = new Map<string, number>()
  connect: Connect = (url, handlers) => {
    const name = url.split('/room/')[1]
    const members = this.rooms.get(name) ?? new Set<Conn>()
    this.rooms.set(name, members)
    const conn = new Conn(this, name, handlers)
    queueMicrotask(() => {
      if (members.size >= ROOM_CAPACITY) {
        handlers.open()
        conn.deliver({ t: 'full' })
        conn.close()
        return
      }
      members.add(conn)
      handlers.open()
    })
    return conn
  }
}

class Conn {
  pid: string | null = null
  name = ''
  last: Peer | null = null
  closed = false
  private rooms: MemoryRooms
  private room: string
  private handlers: SocketHandlers
  constructor(rooms: MemoryRooms, room: string, handlers: SocketHandlers) {
    this.rooms = rooms
    this.room = room
    this.handlers = handlers
  }
  private others(): Conn[] {
    return [...(this.rooms.rooms.get(this.room) ?? [])].filter((c) => c !== this && c.pid)
  }
  deliver(message: ServerMessage): void {
    if (!this.closed) this.handlers.message(JSON.stringify(message))
  }
  send(text: string): void {
    if (this.closed) return
    const message = parseClientMessage(text)
    if (!message) return
    if (message.t === 'hello') {
      const [pid, name] = message.ticket.split(':')
      this.pid = pid
      this.name = name
      this.deliver({ t: 'welcome', pid, peers: this.others().flatMap((c) => (c.last ? [c.last] : [])) })
      return
    }
    if (!this.pid) return
    if (message.t === 'state') {
      const { t: _t, ...motion } = message
      this.last = { pid: this.pid, name: this.name, ...motion }
      this.rooms.sentStates.set(this.pid, (this.rooms.sentStates.get(this.pid) ?? 0) + 1)
      for (const other of this.others()) other.deliver({ t: 'state', ...this.last })
    }
    if (message.t === 'emote') for (const other of this.others()) other.deliver({ t: 'emote', pid: this.pid, e: message.e })
    if (message.t === 'leave') this.close()
  }
  close(): void {
    if (this.closed) return
    this.closed = true
    this.rooms.rooms.get(this.room)?.delete(this)
    if (this.pid) for (const other of this.others()) other.deliver({ t: 'leave', pid: this.pid })
    queueMicrotask(() => this.handlers.close())
  }
}

class Clock {
  t = 0
  timers: { at: number; run: () => void }[] = []
  now = () => this.t
  setTimer = (run: () => void, ms: number) => {
    const timer = { at: this.t + ms, run }
    this.timers.push(timer)
    return timer
  }
  clearTimer = (timer: unknown) => {
    this.timers = this.timers.filter((t) => t !== timer)
  }
  async advance(ms: number, step: number, ticks: (() => void)[]): Promise<void> {
    const end = this.t + ms
    while (this.t < end) {
      this.t = Math.min(end, this.t + step)
      for (const timer of this.timers.filter((t) => t.at <= this.t)) {
        this.clearTimer(timer)
        timer.run()
      }
      for (const tick of ticks) tick()
      await flush()
    }
  }
}

function visitor(rooms: MemoryRooms, clock: Clock, pid: string, extra: Partial<Parameters<typeof createPresence>[0]> = {}) {
  const self: Self = { x: 0, vx: 0, facing: 1, look }
  let away = false
  const emotes: string[] = []
  const presence = createPresence({
    room: 'atelier',
    seed: 1,
    self: () => self,
    walkAlone: () => away,
    onEmote: (from, e) => emotes.push(`${from}:${e}`),
    fetchTicket: async () => ({ ticket: `${pid}:Name ${pid.slice(0, 4)}`, exp: Date.now() + 600_000, url: 'ws://test' }),
    connect: rooms.connect,
    now: clock.now,
    setTimer: clock.setTimer,
    clearTimer: clock.clearTimer,
    ...extra,
  })
  return { presence, self, emotes, setAway: (value: boolean) => (away = value) }
}

test('two visitors meet, and each sees the other walk', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const a = visitor(rooms, clock, 'pidAAAA00001')
  const b = visitor(rooms, clock, 'pidBBBB00001')
  const ticks = [a.presence.tick, b.presence.tick]
  await clock.advance(500, 16, ticks)
  assert.equal(a.presence.status, 'open')
  assert.equal(b.presence.status, 'open')

  a.self.vx = 2
  for (let i = 0; i < 60; i++) {
    a.self.x += 2 * 0.016
    await clock.advance(16, 16, ticks)
  }
  const [seen] = b.presence.visitors()
  assert.equal(seen.name, 'Name pidA')
  assert.ok(Math.abs(seen.x - a.self.x) < 0.6, `drawn at ${seen.x}, really at ${a.self.x}`)
  assert.ok(seen.vx > 1)
})

test('alone, a walking visitor only sends a heartbeat; with company, about five a second', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const a = visitor(rooms, clock, 'pidAAAA00002')
  a.self.vx = 2
  await clock.advance(10_000, 16, [() => { a.self.x += 0.03; a.presence.tick() }])
  const alone = rooms.sentStates.get('pidAAAA00002') ?? 0
  assert.ok(alone <= Math.ceil(10_000 / HEARTBEAT_MS) + 1, `sent ${alone}`)

  const b = visitor(rooms, clock, 'pidBBBB00002')
  await clock.advance(10_000, 16, [() => { a.self.x += 0.03; a.presence.tick() }, b.presence.tick])
  const together = (rooms.sentStates.get('pidAAAA00002') ?? 0) - alone
  assert.ok(together >= 45 && together <= 52, `sent ${together} in 10 s`)
})

test('a newcomer is sent the present visitors at once', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const a = visitor(rooms, clock, 'pidAAAA00003')
  a.self.x = 7
  await clock.advance(300, 16, [a.presence.tick])
  const b = visitor(rooms, clock, 'pidBBBB00003')
  await clock.advance(100, 16, [a.presence.tick, b.presence.tick])
  assert.equal(b.presence.visitors()[0]?.x, 7)
})

test('a full room sends the ninth visitor to the next instance', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const crowd = Array.from({ length: 9 }, (_, i) => visitor(rooms, clock, `pidCROWD${String(i).padStart(4, '0')}`))
  await clock.advance(500, 16, crowd.map((v) => v.presence.tick))
  assert.equal(crowd.filter((v) => v.presence.status === 'open').length, 9)
  assert.deepEqual(crowd.map((v) => v.presence.instance).sort(), [0, 0, 0, 0, 0, 0, 0, 0, 1])
})

test('walking alone leaves the room, and coming back rejoins it', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const a = visitor(rooms, clock, 'pidAAAA00004')
  const b = visitor(rooms, clock, 'pidBBBB00004')
  const ticks = [a.presence.tick, b.presence.tick]
  await clock.advance(500, 16, ticks)
  assert.equal(b.presence.visitors().length, 1)

  a.setAway(true)
  await clock.advance(100, 16, ticks)
  assert.equal(a.presence.status, 'idle')
  assert.equal(a.presence.visitors().length, 0)
  assert.equal(b.presence.visitors().length, 0)

  a.setAway(false)
  await clock.advance(500, 16, ticks)
  assert.equal(a.presence.status, 'open')
  assert.equal(b.presence.visitors().length, 1)
})

test('a tab hidden for five minutes leaves; showing it again rejoins', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  let visible = true
  const a = visitor(rooms, clock, 'pidAAAA00005', { visible: () => visible })
  await clock.advance(500, 16, [a.presence.tick])
  visible = false
  await clock.advance(HIDDEN_LIMIT_MS - 1000, 1000, [a.presence.tick])
  assert.equal(a.presence.status, 'open')
  await clock.advance(3000, 1000, [a.presence.tick])
  assert.equal(a.presence.status, 'idle')
  visible = true
  await clock.advance(500, 16, [a.presence.tick])
  assert.equal(a.presence.status, 'open')
})

test('a dropped connection retries with growing waits', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const a = visitor(rooms, clock, 'pidAAAA00006')
  await clock.advance(300, 16, [a.presence.tick])
  ;[...rooms.rooms.get('atelier-s0')!][0].close()
  await clock.advance(50, 16, [a.presence.tick])
  assert.equal(a.presence.status, 'waiting')
  await clock.advance(1100, 16, [a.presence.tick])
  assert.equal(a.presence.status, 'open')
})

test('with presence turned off, the client goes quiet and stays quiet', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  let fetched = 0
  const a = visitor(rooms, clock, 'pidAAAA00007', { fetchTicket: async () => { fetched++; return null } })
  await clock.advance(60_000, 500, [a.presence.tick])
  assert.equal(a.presence.status, 'off')
  assert.equal(fetched, 1)
})

test('emotes reach the others, at most one each 1.5 s', async () => {
  const rooms = new MemoryRooms()
  const clock = new Clock()
  const a = visitor(rooms, clock, 'pidAAAA00008')
  const b = visitor(rooms, clock, 'pidBBBB00008')
  const ticks = [a.presence.tick, b.presence.tick]
  await clock.advance(500, 16, ticks)
  assert.equal(a.presence.emote('wave'), true)
  assert.equal(a.presence.emote('heart'), false)
  await clock.advance(1600, 16, ticks)
  assert.equal(a.presence.emote('heart'), true)
  await clock.advance(50, 16, ticks)
  assert.deepEqual(b.emotes, ['pidAAAA00008:wave', 'pidAAAA00008:heart'])
  assert.equal(b.presence.visitors()[0].emote?.e, 'heart')
})
