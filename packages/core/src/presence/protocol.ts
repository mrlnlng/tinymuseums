import { CHARACTERS, type CharacterChoice } from '../slots/outfit.ts'

export const PROTOCOL_VERSION = 1
export const ROOM_CAPACITY = 8
export const MAX_MESSAGE_BYTES = 1024

export const EMOTES = ['wave', 'heart', 'sparkle', 'ooh'] as const
export type Emote = (typeof EMOTES)[number]

export interface Look {
  kind: CharacterChoice
  costume: string | null
  bow: string | null
}

export interface Motion {
  /** World units along the room. */
  x: number
  vx: number
  facing: 1 | -1
  look: Look
  seq: number
}

export interface Peer extends Motion {
  pid: string
  name: string
}

export type ClientMessage =
  | { t: 'hello'; v: number; ticket: string }
  | ({ t: 'state' } & Motion)
  | { t: 'emote'; e: Emote; seq: number }
  | { t: 'leave' }

export type ServerMessage =
  | { t: 'welcome'; pid: string; peers: Peer[] }
  | ({ t: 'state' } & Peer)
  | { t: 'emote'; pid: string; e: Emote }
  | { t: 'leave'; pid: string }
  | { t: 'full' }
  | { t: 'denied' }

/** `hall-e<epoch>` or `atelier`, then `-s<instance>`. */
const ROOM = /^(hall-e\d{1,9}|atelier)-s(\d{1,2})$/

export function parseRoom(name: string): { base: string; instance: number } | null {
  const match = ROOM.exec(name)
  return match ? { base: match[1], instance: Number(match[2]) } : null
}

export function roomName(base: string, instance: number): string {
  return `${base}-s${instance}`
}

const CLOTHING_ID = /^[a-z][a-z0-9-]{0,31}$/
const MAX_X = 1e5
const MAX_VX = 100

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : null
}

const isSeq = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0

function parseLook(value: unknown): Look | null {
  const look = record(value)
  if (!look || Object.keys(look).length !== 3) return null
  const clothing = (v: unknown) => v === null || (typeof v === 'string' && CLOTHING_ID.test(v))
  if (!(CHARACTERS as readonly unknown[]).includes(look.kind) || !clothing(look.costume) || !clothing(look.bow)) return null
  return { kind: look.kind as CharacterChoice, costume: look.costume as string | null, bow: look.bow as string | null }
}

function parseMotion(m: Record<string, unknown>): Motion | null {
  const { x, vx, facing, seq } = m
  if (typeof x !== 'number' || !Number.isFinite(x) || Math.abs(x) > MAX_X) return null
  if (typeof vx !== 'number' || !Number.isFinite(vx) || Math.abs(vx) > MAX_VX) return null
  if (facing !== 1 && facing !== -1) return null
  const look = parseLook(m.look)
  if (!look || !isSeq(seq)) return null
  return { x, vx, facing, look, seq }
}

/** Unknown fields are dropped, so whatever a client adds never reaches other visitors. */
export function parseClientMessage(raw: unknown): ClientMessage | null {
  if (typeof raw !== 'string' || raw.length > MAX_MESSAGE_BYTES) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  const m = record(parsed)
  if (!m) return null
  switch (m.t) {
    case 'hello':
      return typeof m.ticket === 'string' && Number.isSafeInteger(m.v) ? { t: 'hello', v: m.v as number, ticket: m.ticket } : null
    case 'state': {
      const motion = parseMotion(m)
      return motion ? { t: 'state', ...motion } : null
    }
    case 'emote':
      return (EMOTES as readonly unknown[]).includes(m.e) && isSeq(m.seq) ? { t: 'emote', e: m.e as Emote, seq: m.seq } : null
    case 'leave':
      return { t: 'leave' }
    default:
      return null
  }
}
