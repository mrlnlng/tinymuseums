import { deleteMember, hit } from '@tiny/core'
import { clearMemberCookie } from '@/shared/lib/member-session'
import { checkMutation, emailBucketKey, empty, json, limited, memberFromRequest } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 56 * 1024
const PER_EMAIL = { limit: 10, windowSeconds: 15 * 60 }

export async function POST(request: Request) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  const denied = checkMutation(request, true)
  if (denied) return denied

  const perEmail = await hit(`member-sign-in:email:${emailBucketKey(guard.member.email)}`, PER_EMAIL)
  if (!perEmail.allowed) return limited(perEmail)

  const body = await readJsonBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.error === 'too_large' ? empty(413) : json({ error: 'invalid' }, 400)

  const input = (body.body ?? {}) as { password?: unknown }
  const password = typeof input.password === 'string' ? input.password : ''

  const deleted = await deleteMember(guard.member.id, password)
  if (!deleted) return json({ error: 'bad_credentials' }, 400)

  await clearMemberCookie()
  return empty(204)
}
