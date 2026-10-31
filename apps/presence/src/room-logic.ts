import type { ClientMessage, Motion, Peer, ServerMessage, Ticket } from '@tiny/core/presence/wire'

export const HELLO_TIMEOUT_MS = 5000
const STATE_BURST = 10
const STATES_PER_SECOND = 6
const EMOTE_GAP_MS = 1500
const STRIKES_TO_CLOSE = 40

/** Kept on each socket with serializeAttachment, so it survives the room hibernating. */
export interface Attachment {
  room: string
  joinedAt: number
  pid: string | null
  name: string | null
  last: Motion | null
  tokens: number
  refilledAt: number
  emoteAt: number
  strikes: number
}

export function newAttachment(room: string, now: number): Attachment {
  return { room, joinedAt: now, pid: null, name: null, last: null, tokens: STATE_BURST, refilledAt: now, emoteAt: 0, strikes: 0 }
}

export function admitted(attachment: Attachment, ticket: Ticket | null): Attachment | null {
  if (!ticket || ticket.room !== attachment.room.replace(/-s\d+$/, '')) return null
  return { ...attachment, pid: ticket.pid, name: ticket.name }
}

export function peerOf(attachment: Attachment): Peer | null {
  return attachment.pid && attachment.name && attachment.last
    ? { pid: attachment.pid, name: attachment.name, ...attachment.last }
    : null
}

export type Outcome =
  | { kind: 'ignore'; attachment: Attachment }
  | { kind: 'broadcast'; attachment: Attachment; message: ServerMessage }
  | { kind: 'close'; attachment: Attachment; code: number; reason: string }

function strike(attachment: Attachment): Outcome {
  const next = { ...attachment, strikes: attachment.strikes + 1 }
  return next.strikes >= STRIKES_TO_CLOSE
    ? { kind: 'close', attachment: next, code: 1008, reason: 'too many messages' }
    : { kind: 'ignore', attachment: next }
}

/** Every message after hello. Identity comes from the attachment, never from the message. */
export function onMessage(attachment: Attachment, message: ClientMessage | null, now: number): Outcome {
  if (!attachment.pid || !attachment.name) return { kind: 'close', attachment, code: 1008, reason: 'hello first' }
  if (!message) return strike(attachment)
  const { pid, name } = attachment
  switch (message.t) {
    case 'hello':
      return strike(attachment)
    case 'leave':
      return { kind: 'close', attachment, code: 1000, reason: 'left' }
    case 'emote':
      if (now - attachment.emoteAt < EMOTE_GAP_MS) return strike(attachment)
      return { kind: 'broadcast', attachment: { ...attachment, emoteAt: now }, message: { t: 'emote', pid, e: message.e } }
    case 'state': {
      const tokens = Math.min(STATE_BURST, attachment.tokens + ((now - attachment.refilledAt) / 1000) * STATES_PER_SECOND)
      if (tokens < 1) return strike({ ...attachment, tokens, refilledAt: now })
      if (attachment.last && message.seq <= attachment.last.seq) return { kind: 'ignore', attachment }
      const { t: _t, ...motion } = message
      const next = { ...attachment, tokens: tokens - 1, refilledAt: now, last: motion }
      return { kind: 'broadcast', attachment: next, message: { t: 'state', pid, name, ...motion } }
    }
  }
}
