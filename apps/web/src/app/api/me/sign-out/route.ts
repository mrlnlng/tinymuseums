import { signOut } from '@tiny/core'
import { clearMemberCookie } from '@/shared/lib/member-session'
import { checkMutation, empty, memberFromRequest } from '@/shared/lib/member-route'

export async function POST(request: Request) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  const denied = checkMutation(request, false)
  if (denied) return denied

  await signOut(guard.token)
  await clearMemberCookie()
  return empty(204)
}
