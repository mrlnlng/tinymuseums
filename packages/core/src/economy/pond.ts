import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto'

/** Catch odds; the Pond game's local roll for guests uses the same weights. */
export const POND_FISH = [
  { id: 'minnow', weight: 50 },
  { id: 'perch', weight: 28 },
  { id: 'carp', weight: 15 },
  { id: 'koi', weight: 6 },
  { id: 'golden-koi', weight: 1 },
] as const

export type PondFishId = (typeof POND_FISH)[number]['id']

/** A cast takes at least this long to get a bite (0.5 s cast plus a 1.5 s minimum wait), less some slack. */
export const POND_MIN_REEL_MS = 1800
export const POND_MAX_REEL_MS = 120_000

interface TicketBody {
  m: string
  n: string
  t: number
}

function sign(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(`pond-ticket:${payload}`).digest('base64url')
}

export function issuePondTicket(secret: string, memberId: string, now: number): string {
  const body: TicketBody = { m: memberId, n: randomBytes(12).toString('base64url'), t: now }
  const payload = Buffer.from(JSON.stringify(body)).toString('base64url')
  return `${payload}.${sign(secret, payload)}`
}

export type TicketCheck = { ok: true; nonce: string; fish: PondFishId } | { ok: false; reason: 'invalid' | 'too_soon' | 'expired' }

/** Checks a cast ticket and rolls its fish from the secret, so the client cannot pick one. */
export function readPondTicket(secret: string, ticket: unknown, memberId: string, now: number): TicketCheck {
  if (typeof ticket !== 'string' || ticket.length > 300) return { ok: false, reason: 'invalid' }
  const [payload, signature, extra] = ticket.split('.')
  if (!payload || !signature || extra !== undefined) return { ok: false, reason: 'invalid' }
  const expected = Buffer.from(sign(secret, payload))
  const given = Buffer.from(signature)
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return { ok: false, reason: 'invalid' }

  let body: TicketBody
  try {
    body = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as TicketBody
  } catch {
    return { ok: false, reason: 'invalid' }
  }
  if (body.m !== memberId || typeof body.n !== 'string' || typeof body.t !== 'number') {
    return { ok: false, reason: 'invalid' }
  }
  const age = now - body.t
  if (age < POND_MIN_REEL_MS) return { ok: false, reason: 'too_soon' }
  if (age > POND_MAX_REEL_MS) return { ok: false, reason: 'expired' }

  const roll = createHmac('sha256', secret).update(`pond-fish:${body.n}`).digest().readUInt32BE(0) / 2 ** 32
  return { ok: true, nonce: body.n, fish: pondFishFor(roll) }
}

export function pondFishFor(roll: number): PondFishId {
  const total = POND_FISH.reduce((sum, fish) => sum + fish.weight, 0)
  let at = Math.max(0, Math.min(0.999999, roll)) * total
  for (const fish of POND_FISH) {
    if (at < fish.weight) return fish.id
    at -= fish.weight
  }
  return POND_FISH[POND_FISH.length - 1].id
}
