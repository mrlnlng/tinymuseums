import { MAX_HOLDS, type ClientMessage, type Item, type Motion, type Peer, type ServerMessage, type Ticket } from '@tiny/core/presence/wire'

export const HELLO_TIMEOUT_MS = 5000
/** A visitor's tab sends at least every 4 s, even hidden; silence past this is a lost connection. */
export const GHOST_MS = 15_000
export const SWEEP_MS = 10_000
/** Connections from one address that have not yet shown a ticket; more are refused. */
export const MAX_WAITING_PER_IP = 4
const STATE_BURST = 10
const STATES_PER_SECOND = 6
const EMOTE_GAP_MS = 1500
const STRIKES_TO_CLOSE = 40

/** Kept on each socket with serializeAttachment, so it survives the room hibernating. */
export interface Attachment {
  room: string
  /** The connecting address, kept only to limit connections that never show a ticket. */
  ip: string
  joinedAt: number
  heardAt: number
  pid: string | null
  name: string | null
  last: Motion | null
  /** What this visitor holds; released when the socket goes. */
  holds: Item[]
  tokens: number
  refilledAt: number
  emoteAt: number
  strikes: number
  /** Closing, or replaced by a newer socket with the same pid: no longer in the room. */
  gone: boolean
}

export function newAttachment(room: string, now: number, ip = ''): Attachment {
  return {
    room, ip, joinedAt: now, heardAt: now, pid: null, name: null, last: null, holds: [],
    tokens: STATE_BURST, refilledAt: now, emoteAt: 0, strikes: 0, gone: false,
  }
}

/** Room places go to admitted visitors only, so unticketed sockets can't fill a room. */
export function roomFull(attachments: Attachment[], capacity: number): boolean {
  return attachments.filter(present).length >= capacity
}

/** Too many sockets from this address are waiting without a ticket. */
export function tooManyWaiting(attachments: Attachment[], ip: string): boolean {
  return ip !== '' && attachments.filter((a) => a.pid === null && !a.gone && a.ip === ip).length >= MAX_WAITING_PER_IP
}

/** Those still in the room: admitted, and not closing. */
export const present = (attachment: Attachment): boolean => attachment.pid !== null && !attachment.gone

export function admitted(attachment: Attachment, ticket: Ticket | null): Attachment | null {
  if (!ticket || ticket.room !== attachment.room.replace(/-s\d+$/, '')) return null
  return { ...attachment, pid: ticket.pid, name: ticket.name }
}

export function peerOf(attachment: Attachment): Peer | null {
  return present(attachment) && attachment.name && attachment.last
    ? { pid: attachment.pid!, name: attachment.name, ...attachment.last }
    : null
}

export function holdsOf(attachments: Attachment[]): Partial<Record<Item, string>> {
  const holds: Partial<Record<Item, string>> = {}
  for (const attachment of attachments) {
    if (!present(attachment)) continue
    for (const item of attachment.holds) holds[item] = attachment.pid!
  }
  return holds
}

/** Gone quiet: never said hello, or a lost connection that never closed. */
export function stale(attachment: Attachment, now: number): boolean {
  return attachment.pid === null ? now - attachment.joinedAt >= HELLO_TIMEOUT_MS : now - attachment.heardAt >= GHOST_MS
}

/** What the others hear when a visitor leaves: they go, and so do their holds. */
export function farewell(attachment: Attachment): ServerMessage[] {
  if (!present(attachment)) return []
  return [{ t: 'leave', pid: attachment.pid! }, ...attachment.holds.map((item): ServerMessage => ({ t: 'held', item, pid: null }))]
}

export interface Outcome {
  attachment: Attachment
  send?: { to: 'others' | 'all' | 'self'; message: ServerMessage }
  close?: { code: number; reason: string }
}

function strike(attachment: Attachment): Outcome {
  const next = { ...attachment, strikes: attachment.strikes + 1 }
  return next.strikes >= STRIKES_TO_CLOSE ? { attachment: next, close: { code: 1008, reason: 'too many messages' } } : { attachment: next }
}

/** Spends one message from the visitor's budget, or strikes when it is empty. */
function spend(attachment: Attachment, now: number): Attachment | null {
  const tokens = Math.min(STATE_BURST, attachment.tokens + ((now - attachment.refilledAt) / 1000) * STATES_PER_SECOND)
  return tokens < 1 ? null : { ...attachment, tokens: tokens - 1, refilledAt: now }
}

/**
 * Every message after hello. Identity comes from the attachment, never from the message, and
 * claims are settled against the others in one synchronous step, so the first claim wins.
 */
export function onMessage(attachment: Attachment, message: ClientMessage | null, now: number, others: Attachment[]): Outcome {
  if (!attachment.pid || !attachment.name) return { attachment, close: { code: 1008, reason: 'hello first' } }
  const { pid, name } = attachment
  const heard = { ...attachment, heardAt: now }
  if (!message) return strike(heard)
  switch (message.t) {
    case 'hello':
      return strike(heard)
    case 'leave':
      return { attachment: heard, close: { code: 1000, reason: 'left' } }
    case 'emote':
      if (now - heard.emoteAt < EMOTE_GAP_MS) return strike(heard)
      return { attachment: { ...heard, emoteAt: now }, send: { to: 'others', message: { t: 'emote', pid, e: message.e } } }
    case 'state': {
      const paid = spend(heard, now)
      if (!paid) return strike({ ...heard, tokens: 0, refilledAt: now })
      if (heard.last && message.seq <= heard.last.seq) return { attachment: heard }
      const { t: _t, ...motion } = message
      return { attachment: { ...paid, last: motion }, send: { to: 'others', message: { t: 'state', pid, name, ...motion } } }
    }
    case 'claim': {
      const paid = spend(heard, now)
      if (!paid) return strike({ ...heard, tokens: 0, refilledAt: now })
      if (paid.holds.includes(message.item)) return { attachment: paid, send: { to: 'self', message: { t: 'held', item: message.item, pid } } }
      const holder = holdsOf(others)[message.item]
      if (holder) return { attachment: paid, send: { to: 'self', message: { t: 'held', item: message.item, pid: holder } } }
      if (paid.holds.length >= MAX_HOLDS) return strike(paid)
      return {
        attachment: { ...paid, holds: [...paid.holds, message.item] },
        send: { to: 'all', message: { t: 'held', item: message.item, pid } },
      }
    }
    case 'release':
      if (!heard.holds.includes(message.item)) return { attachment: heard }
      return {
        attachment: { ...heard, holds: heard.holds.filter((item) => item !== message.item) },
        send: { to: 'all', message: { t: 'held', item: message.item, pid: null } },
      }
  }
}
