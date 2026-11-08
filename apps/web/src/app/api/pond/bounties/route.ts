import { getPondBounties, hit } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json, limited } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 120, windowSeconds: 60 }

export async function GET() {
  const session = await currentMember()
  if (!session) return json({ error: 'signed_out' }, 401)
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)

  const rate = await hit(`pond-bounties:${session.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  return json(await getPondBounties(session.member.id, new Date()))
}
