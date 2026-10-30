import { changePassword, hit, validCredentials } from '@tiny/core'
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
