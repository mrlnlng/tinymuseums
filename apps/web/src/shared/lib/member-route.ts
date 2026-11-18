import { createHmac } from 'node:crypto'
import { env, hit, type Member } from '@tiny/core'
import { currentMember, setMemberCookie } from './member-session'
import { isSameOriginMutation } from './mutation-guard'
import { readJsonBody } from './read-json-body'

const NO_STORE = 'private, no-store'

export function json(body: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return Response.json(body, { status, headers: { 'cache-control': NO_STORE, ...extra } })
}

export function empty(status: number): Response {
  return new Response(null, { status, headers: { 'cache-control': NO_STORE } })
}

export function limited(result: { retryAfterSeconds: number }): Response {
  return json({ error: 'rate_limited' }, 429, { 'retry-after': String(result.retryAfterSeconds) })
}

// Sign-in, password changes, and deletion share one password-attempt budget.
export async function checkPasswordRateLimit(email: string): Promise<Response | null> {
  const key = createHmac('sha256', env.sessionSecret).update(email).digest('base64url').slice(0, 22)
  const result = await hit(`member-sign-in:email:${key}`, { limit: 10, windowSeconds: 15 * 60 })
  return result.allowed ? null : limited(result)
}

export async function readMemberBody(request: Request, maxBytes: number, invalidError = 'invalid') {
  const result = await readJsonBody(request, maxBytes)
  if (result.ok) return result
  return {
    ok: false as const,
    response: result.error === 'too_large' ? empty(413) : json({ error: invalidError }, 400),
  }
}

export function checkMutation(request: Request, requireJson: boolean): Response | null {
  return isSameOriginMutation(request, requireJson) ? null : json({ error: 'forbidden' }, 403)
}

export type MemberRequest = { ok: true; member: Member; token: string } | { ok: false; response: Response }

// The cookie is the only source of member identity. The X-TM-Member check runs
// before anything else is read or mutated, so a stale tab holding another id
// cannot act on whoever signed in last.
export async function memberFromRequest(request: Request): Promise<MemberRequest> {
  const session = await currentMember()
  if (!session) return { ok: false, response: json({ error: 'unauthorized' }, 401) }
  if (request.headers.get('x-tm-member') !== session.member.id) {
    return { ok: false, response: json({ error: 'member_mismatch' }, 409) }
  }
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)
  return { ok: true, member: session.member, token: session.token }
}

export async function memberMutation(request: Request, requireJson = true): Promise<MemberRequest> {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard
  const denied = checkMutation(request, requireJson)
  return denied ? { ok: false, response: denied } : guard
}
