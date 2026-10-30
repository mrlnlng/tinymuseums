import { canonicalEmail, hit, hitForVisitor, signUp } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { setMemberCookie } from '@/shared/lib/member-session'
import { checkMutation, empty, json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 56 * 1024
const PER_IP = { limit: 10, windowSeconds: 60 * 60 }
const GLOBAL = { limit: 300, windowSeconds: 60 * 60 }

export async function POST(request: Request) {
  const denied = checkMutation(request, true)
  if (denied) return denied

  const all = await hit('member-sign-up:all', GLOBAL)
  const perIp = await hitForVisitor('member-sign-up', clientIp(request.headers), PER_IP)
  if (!all.allowed) return limited(all)
  if (!perIp.allowed) return limited(perIp)

  const body = await readJsonBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.error === 'too_large' ? empty(413) : json({ error: 'invalid' }, 400)

  const input = (body.body ?? {}) as { email?: unknown; password?: unknown }
  const email = canonicalEmail(typeof input.email === 'string' ? input.email : '')
  const password = typeof input.password === 'string' ? input.password : ''

  const started = await signUp(email, password)
  if ('error' in started) return json({ error: started.error }, 400)

  await setMemberCookie(started.token, started.expiresAt)
  return json({ id: started.member.id, email: started.member.email })
}
