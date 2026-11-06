import {
  MAX_INSTANCE,
  PROTOCOL_VERSION,
  parseServerMessage,
  roomName,
  type ClientMessage,
  type Item,
  type Look,
  type Refusal,
  type ServerMessage,
} from '@tiny/core/presence/wire'
import { checkMessage } from '@tiny/core/presence'
import { PeerTable, type RemoteVisitor } from './peers.ts'

/** While someone else is here and we are moving. */
export const STATE_INTERVAL_MS = 200
/** Otherwise, and always while alone: enough for others to keep us and for newcomers to find us. */
export const HEARTBEAT_MS = 4000
/** As the room enforces (room-logic.ts). */
export const SAY_GAP_MS = 1500
/** A tab hidden this long lets go of its place in the room. */
export const HIDDEN_LIMIT_MS = 60 * 1000
/** Hidden tabs get no animation frames; this keeps their heartbeat going until they leave. */
const BEAT_MS = 1000
const RETRY_MS = [1000, 2000, 4000, 8000, 15_000, 30_000]
const TICKET_MARGIN_MS = 60_000
const MOVING = 0.05

export interface SocketHandlers {
  open(): void
  message(text: string): void
  close(): void
}

export interface Socket {
  send(text: string): void
  close(code?: number): void
}

export type Connect = (url: string, handlers: SocketHandlers) => Socket

export const connectWebSocket: Connect = (url, handlers) => {
  const socket = new WebSocket(url)
  socket.onopen = () => handlers.open()
  socket.onmessage = (event) => {
    if (typeof event.data === 'string') handlers.message(event.data)
  }
  socket.onclose = () => handlers.close()
  return {
    send: (text) => {
      if (socket.readyState === WebSocket.OPEN) socket.send(text)
    },
    close: (code) => socket.close(code),
  }
}

export interface TicketGrant {
  ticket: string
  exp: number
  url: string
}

/** Null when presence is off for this site. */
export type FetchTicket = (room: string, seed: number, key?: string) => Promise<TicketGrant | null>

export const fetchTicket: FetchTicket = async (room, seed, key) => {
  const response = await fetch('/api/presence/ticket', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, seed, ...(key ? { key } : {}) }),
  })
  if (response.status === 404) return null
  if (!response.ok) throw new Error(`ticket ${response.status}`)
  return (await response.json()) as TicketGrant
}

export interface Self {
  x: number
  vx: number
  facing: 1 | -1
  look: Look
  sit: boolean
  helm: boolean
  cup: boolean
}

export interface PresenceOptions {
  /** Room base: `hall-e<epoch>`, `atelier`, or a personal `r-<slug>`. */
  room: string
  /** The share key for a private personal room, when the visitor has one. */
  key?: string
  seed: number
  /** Where we are now; null while the scene is not ready. */
  self(): Self | null
  walkAlone?(): boolean
  visible?(): boolean
  /** This tab has the device's turn in the room (tab-turn.ts). */
  active?(): boolean
  /** Another visitor's message. */
  onSaid?(pid: string, name: string, text: string): void
  /** The room turned down one of ours (normally caught here first). */
  onRefused?(reason: Refusal): void
  fetchTicket?: FetchTicket
  connect?: Connect
  now?(): number
  setTimer?(run: () => void, ms: number): unknown
  clearTimer?(timer: unknown): void
}

export interface Presence {
  readonly status: 'idle' | 'connecting' | 'open' | 'waiting' | 'off'
  readonly pid: string | null
  readonly instance: number
  /** Call once a frame. */
  tick(): void
  visitors(): RemoteVisitor[]
  /** The tidied text when sent, or why not. */
  say(text: string): { ok: true; text: string } | { ok: false; reason: Refusal | 'closed' }
  /** Asks the room for an item, or lets it go; claims are made again after reconnecting. */
  want(item: Item, on: boolean): void
  /** Someone else holds it. Alone, offline or walking alone, nothing is ever blocked. */
  blocked(item: Item): boolean
  /** Items held by other visitors in the room. */
  heldByOthers(): Item[]
  /** A fresh ticket, so a changed name reaches the others now. */
  reconnect(): void
  dispose(): void
}

const sameLook = (a: Look, b: Look) => a.kind === b.kind && a.costume === b.costume && a.bow === b.bow
const samePose = (a: Self, b: Self) => a.sit === b.sit && a.helm === b.helm && a.cup === b.cup

export function createPresence(options: PresenceOptions): Presence {
  const now = options.now ?? (() => performance.now())
  const setTimer = options.setTimer ?? ((run, ms) => setTimeout(run, ms))
  const clearTimer = options.clearTimer ?? ((timer) => clearTimeout(timer as ReturnType<typeof setTimeout>))
  const getTicket = options.fetchTicket ?? fetchTicket
  const connect = options.connect ?? connectWebSocket
  // Ticket expiry is wall-clock time, unlike the frame clock.
  const wallClock = () => Date.now()

  const peers = new PeerTable()
  let status: Presence['status'] = 'idle'
  let socket: Socket | null = null
  let grant: TicketGrant | null = null
  let pid: string | null = null
  let instance = 0
  let attempts = 0
  let retry: unknown = null
  let seq = 0
  let lastSent: (Self & { at: number }) | null = null
  let lastSaidAt = -Infinity
  let hadCompany = false
  let hiddenSince: number | null = null
  let disposed = false
  let lastStepAt = -Infinity
  const holds = new Map<Item, string>()
  const wants = new Set<Item>()

  function send(message: ClientMessage): void {
    socket?.send(JSON.stringify(message))
  }

  function drop(): void {
    const closing = socket
    socket = null
    pid = null
    lastSent = null
    hadCompany = false
    peers.clear()
    holds.clear()
    closing?.close(1000)
  }

  function scheduleRetry(ms: number): void {
    status = 'waiting'
    retry = setTimer(() => {
      retry = null
      if (!disposed && status === 'waiting') void start()
    }, ms)
  }

  async function start(): Promise<void> {
    status = 'connecting'
    let failed = false
    try {
      if (!grant || grant.exp - wallClock() < TICKET_MARGIN_MS) grant = await getTicket(options.room, options.seed, options.key)
    } catch {
      grant = null
      failed = true
    }
    if (disposed || status !== 'connecting') return
    if (!grant) {
      // A failed fetch retries; a site with presence turned off stays quiet.
      if (failed) scheduleRetry(RETRY_MS[Math.min(attempts++, RETRY_MS.length - 1)])
      else status = 'off'
      return
    }
    const ticket = grant.ticket
    let moving = false
    const current: Socket = connect(`${grant.url}/room/${roomName(options.room, instance)}`, {
      open: () => {
        if (socket === current) send({ t: 'hello', v: PROTOCOL_VERSION, ticket })
      },
      message: (text) => {
        if (socket !== current) return
        const message = parseServerMessage(text)
        if (message?.t === 'full') {
          moving = true
          instance = instance < MAX_INSTANCE ? instance + 1 : 0
        }
        if (message?.t === 'denied') grant = null
        if (message) receive(message)
      },
      close: () => {
        if (socket !== current) return
        drop()
        if (disposed || status === 'idle') return
        if (moving) {
          void start()
          return
        }
        scheduleRetry(RETRY_MS[Math.min(attempts++, RETRY_MS.length - 1)])
      },
    })
    socket = current
  }

  function receive(message: ServerMessage): void {
    const at = now()
    switch (message.t) {
      case 'welcome':
        status = 'open'
        pid = message.pid
        attempts = 0
        for (const peer of message.peers) peers.heard(peer, at)
        for (const [item, holder] of Object.entries(message.holds) as [Item, string][]) holds.set(item, holder)
        for (const item of wants) if (holds.get(item) !== pid) send({ t: 'claim', item })
        break
      case 'held':
        if (message.pid) holds.set(message.item, message.pid)
        else holds.delete(message.item)
        // Something wanted came free (its holder left): try again.
        if (!message.pid && wants.has(message.item)) send({ t: 'claim', item: message.item })
        break
      case 'state':
        peers.heard(message, at)
        break
      case 'said':
        if (peers.said(message.pid, message.text, at)) options.onSaid?.(message.pid, peers.nameOf(message.pid) ?? '', message.text)
        break
      case 'refused':
        options.onRefused?.(message.reason)
        break
      case 'leave':
        peers.left(message.pid)
        break
      case 'full':
      case 'denied':
        break
    }
  }

  function sendState(self: Self, at: number): void {
    seq = Math.max(seq + 1, Math.floor(wallClock()))
    send({ t: 'state', x: self.x, vx: self.vx, facing: self.facing, look: self.look, sit: self.sit, helm: self.helm, cup: self.cup, seq })
    lastSent = { ...self, look: { ...self.look }, at }
  }

  function maybeSend(at: number): void {
    const self = options.self()
    if (!self) return
    const company = peers.size > 0
    const arrived = company && !hadCompany
    hadCompany = company
    const since = lastSent ? at - lastSent.at : Infinity
    const lookChanged = !lastSent || !sameLook(lastSent.look, self.look) || !samePose(lastSent, self)
    const moved = !lastSent || Math.abs(self.x - lastSent.x) > 0.01 || lastSent.facing !== self.facing ||
      (Math.abs(self.vx) > MOVING) !== (Math.abs(lastSent.vx) > MOVING)
    const due =
      since >= HEARTBEAT_MS ||
      lookChanged ||
      arrived ||
      (company && (moved || Math.abs(self.vx) > MOVING) && since >= STATE_INTERVAL_MS)
    if (due) sendState(self, at)
  }

  function onPageHide(): void {
    send({ t: 'leave' })
  }
  if (typeof window !== 'undefined') window.addEventListener('pagehide', onPageHide)

  function step(at: number): void {
    lastStepAt = at
    if (disposed || status === 'off') return
    const visible = options.visible?.() ?? true
    if (visible) hiddenSince = null
    else hiddenSince ??= at
    const away =
      (options.walkAlone?.() ?? false) ||
      !(options.active?.() ?? true) ||
      (hiddenSince !== null && at - hiddenSince > HIDDEN_LIMIT_MS)

    if (away) {
      if (status !== 'idle') {
        send({ t: 'leave' })
        status = 'idle'
        if (retry !== null) clearTimer(retry)
        retry = null
        drop()
      }
      return
    }
    if (status === 'idle') {
      attempts = 0
      void start()
      return
    }
    if (status !== 'open') return
    peers.expire(at)
    maybeSend(at)
  }

  let beat: unknown = null
  function heartbeat(): void {
    beat = setTimer(heartbeat, BEAT_MS)
    const at = now()
    if (at - lastStepAt >= BEAT_MS) step(at)
  }
  beat = setTimer(heartbeat, BEAT_MS)

  return {
    get status() {
      return status
    },
    get pid() {
      return pid
    },
    get instance() {
      return instance
    },

    tick() {
      step(now())
    },

    visitors() {
      return status === 'open' ? peers.visitors(now()) : []
    },

    say(raw) {
      const at = now()
      if (status !== 'open') return { ok: false, reason: 'closed' }
      if (at - lastSaidAt < SAY_GAP_MS) return { ok: false, reason: 'too-soon' }
      const check = checkMessage(raw)
      if (!check.ok) return check
      lastSaidAt = at
      send({ t: 'say', text: check.text, seq: ++seq })
      return check
    },

    want(item, on) {
      if (on === wants.has(item)) return
      if (on) wants.add(item)
      else wants.delete(item)
      if (status !== 'open') return
      if (on && holds.get(item) !== pid) send({ t: 'claim', item })
      if (!on && holds.get(item) === pid) send({ t: 'release', item })
    },

    blocked(item) {
      const holder = status === 'open' ? holds.get(item) : undefined
      return holder !== undefined && holder !== pid
    },

    heldByOthers() {
      const items: Item[] = []
      if (status === 'open') {
        for (const [item, holder] of holds) if (holder !== pid) items.push(item)
      }
      return items
    },

    reconnect() {
      grant = null
      if (status !== 'open' && status !== 'connecting') return
      drop()
      void start()
    },

    dispose() {
      if (disposed) return
      send({ t: 'leave' })
      disposed = true
      if (retry !== null) clearTimer(retry)
      if (beat !== null) clearTimer(beat)
      if (typeof window !== 'undefined') window.removeEventListener('pagehide', onPageHide)
      drop()
    },
  }
}
