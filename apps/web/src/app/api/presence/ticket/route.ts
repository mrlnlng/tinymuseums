import { randomBytes } from 'node:crypto'
import { env, hitForVisitor, memberName } from '@tiny/core'
import { TICKET_TTL_MS, nameFromSeed, signTicket, validRoomBase, validSeed } from '@tiny/core/presence'
import { clientIp } from '@/shared/lib/client-ip'
import { checkMutation, empty, json, limited } from '@/shared/lib/member-route'
import { currentMember } from '@/shared/lib/member-session'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 1024
const PER_IP = { limit: 120, windowSeconds: 60 * 60 }

// In development the room runs beside the site, so a phone on the LAN reaches it by the
// same host it used for the page.
function presenceUrl(request: Request): string {
  const url = new URL(env.presenceUrl)
  const host = request.headers.get('host')?.split(':')[0]
  if (process.env.NODE_ENV !== 'production' && url.hostname === 'localhost' && host) url.hostname = host
  return url.toString().replace(/\/$/, '')
}

/** A signed pass for one room, carrying the name other visitors will see. */
export async function POST(request: Request) {
  if (!env.presenceUrl || !env.presenceSecret) return json({ error: 'off' }, 404)

  const denied = checkMutation(request, true)
  if (denied) return denied

  const perIp = await hitForVisitor('presence-ticket', clientIp(request.headers), PER_IP)
  if (!perIp.allowed) return limited(perIp)

  const body = await readJsonBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.error === 'too_large' ? empty(413) : json({ error: 'invalid' }, 400)
  const { room, seed } = (body.body ?? {}) as { room?: unknown; seed?: unknown }
  if (!validRoomBase(room) || !validSeed(seed)) return json({ error: 'invalid' }, 400)

  const session = await currentMember()
  const name = (session ? (await memberName(session.member.id, seed))?.name : null) ?? nameFromSeed(seed)
  const exp = Date.now() + TICKET_TTL_MS
  const ticket = await signTicket({ pid: randomBytes(12).toString('base64url'), name, room, exp }, env.presenceSecret)
  return json({ ticket, exp, url: presenceUrl(request) })
}
