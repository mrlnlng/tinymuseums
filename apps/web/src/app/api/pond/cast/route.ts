import { env, hit, issuePondTicket } from '@tiny/core'
import { json, limited, memberMutation } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 40, windowSeconds: 60 }

/** A member's cast: the ticket is what lets the reel collect a fish trophy. */
export async function POST(request: Request) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-cast:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  return json({ ticket: issuePondTicket(env.sessionSecret, guard.member.id, Date.now()) })
}
