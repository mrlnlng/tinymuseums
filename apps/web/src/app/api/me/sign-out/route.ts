import { signOut } from '@tiny/core'
import { clearMemberCookie } from '@/shared/lib/member-session'
import { empty, memberMutation } from '@/shared/lib/member-route'

export async function POST(request: Request) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  await signOut(guard.token)
  await clearMemberCookie()
  return empty(204)
}
