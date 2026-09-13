import { createInquiry, hitForVisitor } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { isEmail, isUuid } from '@/shared/lib/validate'

const MAX_MESSAGE = 2000

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  if (!isUuid(id)) return Response.json({ error: 'That work is not available' }, { status: 404 })

  let body: { email?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  const message = (body.message ?? '').trim()

  if (!isEmail(email)) {
    return Response.json({ error: 'A valid email address is required' }, { status: 400 })
  }
  if (message.length < 2) {
    return Response.json({ error: 'Say something to the artist' }, { status: 400 })
  }

  const limited = await hitForVisitor('inquire', clientIp(request.headers), { limit: 5, windowSeconds: 60 * 60 })
  if (!limited.allowed) {
    return Response.json(
      { error: 'Too many messages. Try again later.' },
      { status: 429, headers: { 'retry-after': String(limited.retryAfterSeconds) } },
    )
  }

  const sent = await createInquiry(id, email, message.slice(0, MAX_MESSAGE))
  if (!sent) return Response.json({ error: 'That work is not available' }, { status: 404 })

  return Response.json({ ok: true, message: 'Sent. The artist will reply to you directly.' })
}
