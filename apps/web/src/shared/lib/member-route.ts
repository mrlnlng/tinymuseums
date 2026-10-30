import { createHmac } from 'node:crypto'
import { env, type Member } from '@tiny/core'
import { currentMember, setMemberCookie } from './member-session'

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

export function emailBucketKey(email: string): string {
  return createHmac('sha256', env.sessionSecret).update(email).digest('base64url').slice(0, 22)
}

const LOOPBACK = new Set(['localhost', '127.0.0.1', '[::1]'])

// Outside production a loopback origin is also accepted, but only when it is the
// host the request was actually sent to, so local dev works on localhost too.
function allowedOrigin(request: Request, origin: string | null): boolean {
  if (origin === null) return false
  if (origin === new URL(env.publicBaseUrl).origin) return true
  if (process.env.NODE_ENV === 'production') return false
  let parsed: URL
  try {
    parsed = new URL(origin)
  } catch {
    return false
  }
  return LOOPBACK.has(parsed.hostname) && parsed.host === request.headers.get('host')
}

// Same-origin JSON posts only (CSRF). sign-out has no body, so it is held to
// the Origin half only; a browser's cross-site POST always carries Origin.
export function checkMutation(request: Request, requireJson: boolean): Response | null {
  if (!allowedOrigin(request, request.headers.get('origin'))) {
    return json({ error: 'forbidden' }, 403)
  }
  if (requireJson) {
    const type = request.headers.get('content-type') ?? ''
    if (type.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return json({ error: 'forbidden' }, 403)
    }
  }
  return null
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
