import { follow, hitForVisitor } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { isEmail } from '@/shared/lib/validate'

export async function POST(request: Request) {
  let body: { slug?: string; email?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const slug = (body.slug ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()

  if (!slug || !isEmail(email)) {
    return Response.json({ error: 'A valid email address is required' }, { status: 400 })
  }

  const limited = await hitForVisitor('follow', clientIp(request.headers), { limit: 10, windowSeconds: 60 * 60 })
  if (!limited.allowed) {
    return Response.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429, headers: { 'retry-after': String(limited.retryAfterSeconds) } },
    )
  }

  // Same response whether or not the artist exists, so slugs cannot be probed.
  await follow(slug, email)

  return Response.json({
    ok: true,
    message: 'Check your email and confirm, and you will hear when new work goes up.',
  })
}
