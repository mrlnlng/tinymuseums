import { deleteMember } from '@tiny/core'
import { clearMemberCookie } from '@/shared/lib/member-session'
import { checkPasswordRateLimit, empty, json, memberMutation, readMemberBody } from '@/shared/lib/member-route'

const MAX_BODY_BYTES = 56 * 1024

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const passwordLimited = await checkPasswordRateLimit(guard.member.email)
  if (passwordLimited) return passwordLimited

  const body = await readMemberBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.response

  const input = (body.body ?? {}) as { password?: unknown }
  const password = typeof input.password === 'string' ? input.password : ''

  const deleted = await deleteMember(guard.member.id, password)
  if (!deleted) return json({ error: 'bad_credentials' }, 400)

  await clearMemberCookie()
  return empty(204)
}
