import { canonicalEmail, hit, hitForVisitor, signIn } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { setMemberCookie } from '@/shared/lib/member-session'
import { checkMutation, emailBucketKey, empty, json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 56 * 1024
const PER_EMAIL = { limit: 10, windowSeconds: 15 * 60 }
const PER_IP = { limit: 10, windowSeconds: 15 * 60 }
const GLOBAL = { limit: 500, windowSeconds: 60 * 60 }

export async function POST(request: Request) {
  const denied = checkMutation(request, true)
  if (denied) return denied

  const all = await hit('member-sign-in:all', GLOBAL)
  const perIp = await hitForVisitor('member-sign-in', clientIp(request.headers), PER_IP)
  if (!all.allowed) return limited(all)
  if (!perIp.allowed) return limited(perIp)

  const body = await readJsonBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.error === 'too_large' ? empty(413) : json({ error: 'bad_credentials' }, 400)

  const input = (body.body ?? {}) as { email?: unknown; password?: unknown }
  const email = canonicalEmail(typeof input.email === 'string' ? input.email : '')
  const password = typeof input.password === 'string' ? input.password : ''

  const perEmail = await hit(`member-sign-in:email:${emailBucketKey(email)}`, PER_EMAIL)
  if (!perEmail.allowed) return limited(perEmail)

  const started = await signIn(email, password)
  if (!started) return json({ error: 'bad_credentials' }, 400)

  await setMemberCookie(started.token, started.expiresAt)
  return json({ id: started.member.id, email: started.member.email })
}
