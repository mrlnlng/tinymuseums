import { randomBytes } from 'node:crypto'
import { canView, env, exportWallet, getRoom, hitForVisitor, memberName } from '@tiny/core'
import { ITEMS, isCatalogItem } from '@tiny/core/economy'
import { TICKET_TTL_MS, nameFromSeed, signTicket, validRoomBase, validSeed } from '@tiny/core/presence'
import { clientIp } from '@/shared/lib/client-ip'
import { checkMutation, json, limited, readMemberBody } from '@/shared/lib/member-route'
import { currentMember } from '@/shared/lib/member-session'

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

  const body = await readMemberBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.response
  const { room, seed, key } = (body.body ?? {}) as { room?: unknown; seed?: unknown; key?: unknown }
  if (!validRoomBase(room) || !validSeed(seed)) return json({ error: 'invalid' }, 400)

  const session = await currentMember()
  if (room.startsWith('r-')) {
    const shareKey = typeof key === 'string' && key.length <= 128 ? key : null
    const found = await getRoom(room)
    if (!found || !canView(found, { memberId: session?.member.id ?? null, shareToken: shareKey })) {
      return json({ error: 'forbidden' }, 403)
    }
  }
  const [member, wallet] = session
    ? await Promise.all([memberName(session.member.id, seed), exportWallet(session.member.id)])
    : [null, null]
  const name = member?.name ?? nameFromSeed(seed)
  const own = wallet
    ? wallet.items
        .map((item) => item.item_id)
        // Only what others can see worn; a room server built before props would refuse them.
        .filter((id) => isCatalogItem(id) && ITEMS[id].kind !== 'prop')
        .slice(0, Object.keys(ITEMS).length)
    : []
  const exp = Date.now() + TICKET_TTL_MS
  // A ticket without `own` still passes a room server deployed before ownership existed.
  const ticket = await signTicket(
    { pid: randomBytes(12).toString('base64url'), name, room, exp, ...(own.length > 0 ? { own } : {}) },
    env.presenceSecret,
  )
  return json({ ticket, exp, url: presenceUrl(request) })
}
