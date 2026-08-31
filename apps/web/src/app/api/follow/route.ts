import { follow } from '@tiny/core'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/*  Following an artist — an email row rather than an account. The response is deliberately identical whether the artist exists or not, so this cannot be used to enumerate slugs. */
export async function POST(request: Request) {
  let body: { slug?: string; email?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const slug = (body.slug ?? '').trim()
  const email = (body.email ?? '').trim().toLowerCase()

  if (!slug || !EMAIL.test(email)) {
    return Response.json({ error: 'A valid email address is required' }, { status: 400 })
  }

  await follow(slug, email)

  return Response.json({
    ok: true,
    message: 'Check your email and confirm, and you will hear when new work goes up.',
  })
}
