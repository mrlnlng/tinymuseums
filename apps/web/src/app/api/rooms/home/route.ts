import { hit, personalRoomFor } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json, limited } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 30, windowSeconds: 60 }

export async function POST() {
  const session = await currentMember()
  if (!session) return json({ error: 'unauthorized' }, 401)
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)

  const rate = await hit(`rooms-home:${session.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const room = await personalRoomFor(session.member.id)
  return json({ slug: room.slug })
}
