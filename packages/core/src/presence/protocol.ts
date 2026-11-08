import { CHARACTERS, type CharacterChoice } from '../slots/outfit.ts'

export const PROTOCOL_VERSION = 1
export const ROOM_CAPACITY = 8
export const MAX_MESSAGE_BYTES = 1024

/** Why the room turned a message down (messages.ts); only its sender hears. */
export const REFUSALS = ['empty', 'long', 'contact', 'blocked', 'too-soon'] as const
export type Refusal = (typeof REFUSALS)[number]
/** Raw text accepted on the wire; the room's check then allows 100 characters. */
const MAX_RAW_TEXT = 400

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
  /** Seated on the beanbag; x is then the seat's. */
  sit: boolean
  /** Wearing a helmet from a pedestal, or holding a cup from the café. */
  helm: boolean
  cup: boolean
  seq: number
}

/**
 * Things only one visitor at a time may have: the beanbag and each pedestal's helmet. The
 * room decides who holds them; the café's cups are not here, since it serves everyone.
 */
export type Item = 'seat' | `helm-${number}` | `pond-spot-${1 | 2 | 3}`
const ITEM = /^(seat|helm-\d{1,4}|pond-spot-[1-3])$/
export const MAX_HOLDS = 2

export function isItem(value: unknown): value is Item {
  return typeof value === 'string' && ITEM.test(value)
}

export interface Peer extends Motion {
  pid: string
  name: string
}

export type ClientMessage =
  | { t: 'hello'; v: number; ticket: string }
  | ({ t: 'state' } & Motion)
  | { t: 'say'; text: string; seq: number }
  | { t: 'claim'; item: Item }
  | { t: 'release'; item: Item }
  | { t: 'leave' }

export type ServerMessage =
  | { t: 'welcome'; pid: string; peers: Peer[]; holds: Partial<Record<Item, string>> }
  /** Who holds an item now, or null when it is free; also the answer to a claim. */
  | { t: 'held'; item: Item; pid: string | null }
  | ({ t: 'state' } & Peer)
  | { t: 'said'; pid: string; text: string }
  | { t: 'refused'; reason: Refusal }
  | { t: 'leave'; pid: string }
  | { t: 'full' }
  | { t: 'denied' }

const BASE = /^(hall-e\d{1,9}|atelier|pond|r-[a-z0-9]{8})$/
/** A room base, then `-s<instance>`. */
const ROOM = /^(hall-e\d{1,9}|atelier|pond|r-[a-z0-9]{8})-s(\d{1,2})$/
export const MAX_INSTANCE = 99

export function validRoomBase(base: unknown): base is string {
  return typeof base === 'string' && BASE.test(base)
}

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
  // Absent from clients older than these fields.
  const flag = (value: unknown) => (value === undefined ? false : value === true ? true : value === false ? false : null)
  const sit = flag(m.sit)
  const helm = flag(m.helm)
  const cup = flag(m.cup)
  if (sit === null || helm === null || cup === null) return null
  return { x, vx, facing, look, sit, helm, cup, seq }
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
    case 'say':
      return typeof m.text === 'string' && m.text.length <= MAX_RAW_TEXT && isSeq(m.seq) ? { t: 'say', text: m.text, seq: m.seq } : null
    case 'claim':
    case 'release':
      return isItem(m.item) ? { t: m.t, item: m.item } : null
    case 'leave':
      return { t: 'leave' }
    default:
      return null
  }
}

const isPid = (value: unknown): value is string => typeof value === 'string' && /^[A-Za-z0-9_-]{8,32}$/.test(value)
const isName = (value: unknown): value is string => typeof value === 'string' && value.length > 0 && value.length <= 40

function parsePeer(value: unknown): Peer | null {
  const m = record(value)
  if (!m || !isPid(m.pid) || !isName(m.name)) return null
  const motion = parseMotion(m)
  return motion ? { pid: m.pid, name: m.name, ...motion } : null
}

/** The client checks the room's messages too, so a bad deploy cannot break the scene. */
export function parseServerMessage(raw: unknown): ServerMessage | null {
  if (typeof raw !== 'string' || raw.length > 64 * 1024) return null
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  const m = record(parsed)
  if (!m) return null
  switch (m.t) {
    case 'welcome': {
      if (!isPid(m.pid) || !Array.isArray(m.peers)) return null
      const peers = m.peers.map(parsePeer)
      const holds = record(m.holds ?? {})
      if (!holds || !Object.entries(holds).every(([item, pid]) => isItem(item) && isPid(pid))) return null
      return peers.every((peer) => peer !== null)
        ? { t: 'welcome', pid: m.pid, peers: peers as Peer[], holds: holds as Partial<Record<Item, string>> }
        : null
    }
    case 'held':
      return isItem(m.item) && (m.pid === null || isPid(m.pid)) ? { t: 'held', item: m.item, pid: m.pid } : null
    case 'state': {
      const peer = parsePeer(m)
      return peer ? { t: 'state', ...peer } : null
    }
    case 'said':
      return isPid(m.pid) && typeof m.text === 'string' && m.text.length > 0 && m.text.length <= MAX_RAW_TEXT
        ? { t: 'said', pid: m.pid, text: m.text }
        : null
    case 'refused':
      return (REFUSALS as readonly unknown[]).includes(m.reason) ? { t: 'refused', reason: m.reason as Refusal } : null
    case 'leave':
      return isPid(m.pid) ? { t: 'leave', pid: m.pid } : null
    case 'full':
    case 'denied':
      return { t: m.t }
    default:
      return null
  }
}
