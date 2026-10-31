import { changePassword, validCredentials } from '@tiny/core'
import { checkPasswordRateLimit, empty, json, memberMutation, readMemberBody } from '@/shared/lib/member-route'

const MAX_BODY_BYTES = 56 * 1024

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const passwordLimited = await checkPasswordRateLimit(guard.member.email)
  if (passwordLimited) return passwordLimited

  const body = await readMemberBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.response

  const input = (body.body ?? {}) as { current?: unknown; next?: unknown }
  const current = typeof input.current === 'string' ? input.current : ''
  const next = typeof input.next === 'string' ? input.next : ''

  // The member's email already passes the email half of validCredentials, so
  // this is the §2 password rule (8–128 chars, ≤ 72 UTF-8 bytes) on `next`.
  if (!validCredentials(guard.member.email, next)) return json({ error: 'invalid' }, 400)

  const changed = await changePassword(guard.member.id, guard.token, current, next)
  if (!changed) return json({ error: 'bad_credentials' }, 400)

  return empty(204)
}
