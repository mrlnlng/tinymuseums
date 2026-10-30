import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json } from '@/shared/lib/member-route'

export async function GET() {
  const session = await currentMember()
  if (!session) return json({ member: null })
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)
  return json({ member: { id: session.member.id, email: session.member.email } })
}
