import { createInquiry } from '@tiny/core'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MESSAGE = 2000

/* Asking an artist about a work: the message goes straight to the artist and the platform steps out of the way — no checkout, no commission, no order record. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  let body: { email?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = (body.email ?? '').trim().toLowerCase()
  const message = (body.message ?? '').trim()

  if (!EMAIL.test(email)) {
    return Response.json({ error: 'A valid email address is required' }, { status: 400 })
  }
  if (message.length < 2) {
    return Response.json({ error: 'Say something to the artist' }, { status: 400 })
  }

  const sent = await createInquiry(id, email, message.slice(0, MAX_MESSAGE))
  if (!sent) return Response.json({ error: 'That work is not available' }, { status: 404 })

  return Response.json({ ok: true, message: 'Sent. The artist will reply to you directly.' })
}
