import { env } from '@tiny/core'

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
export function isSameOriginMutation(request: Request, requireJson: boolean): boolean {
  if (!allowedOrigin(request, request.headers.get('origin'))) return false
  if (!requireJson) return true
  const type = request.headers.get('content-type') ?? ''
  return type.split(';')[0].trim().toLowerCase() === 'application/json'
}
