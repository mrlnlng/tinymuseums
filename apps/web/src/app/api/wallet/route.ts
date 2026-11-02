import { getWallet, localDay } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json } from '@/shared/lib/member-route'
import { tzOffsetOf } from './body.ts'

export async function GET(request: Request) {
  const session = await currentMember()
  if (!session) return json({ error: 'signed_out' }, 401)
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)

  const tz = new URL(request.url).searchParams.get('tz')
  const today = localDay(tzOffsetOf(tz), new Date())
  return json(await getWallet(session.member.id, today))
}
