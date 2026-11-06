import { collect, env, hit, readPondTicket } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_WALLET_BODY_BYTES } from '../body.ts'

const PER_MEMBER = { limit: 60, windowSeconds: 60 * 60 }
/** Longer than a ticket lives, so each ticket reels in once. */
const ONCE = { limit: 1, windowSeconds: 5 * 60 }

/** Reels in a Pond catch. The fish comes from the server-signed cast ticket, never from the client. */
export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`wallet-collect:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_WALLET_BODY_BYTES)
  if (!body.ok) return body.response

  const ticket = typeof body.body === 'object' && body.body !== null ? (body.body as { ticket?: unknown }).ticket : undefined
  const check = readPondTicket(env.sessionSecret, ticket, guard.member.id, Date.now())
  if (!check.ok) return json({ error: check.reason === 'invalid' ? 'invalid_ticket' : check.reason }, 400)

  const once = await hit(`pond-ticket:${check.nonce}`, ONCE)
  if (!once.allowed) return json({ error: 'used_ticket' }, 400)

  const result = await collect(guard.member.id, `prop:fish-${check.fish}`)
  if ('error' in result) return json({ error: result.error }, 400)
  return json({ ...result, fish: check.fish })
}
