import { GuestNoteRateLimited, GuestNoteRejected, listGuestNotes, postGuestNote } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'

/* The guest board, shared by every visitor. Reads are cached briefly at the edge — a new note takes a few seconds to reach other visitors, which a guest board can afford — and the poster's own client shows its note from the POST response straight away. */

export async function GET(request: Request) {
  const url = new URL(request.url)
  const limit = Number(url.searchParams.get('limit')) || undefined
  const cursor = url.searchParams.get('cursor')

  const page = await listGuestNotes({ limit, cursor })

  return Response.json(page, {
    headers: { 'cache-control': 'public, max-age=10, stale-while-revalidate=60' },
  })
}

export async function POST(request: Request) {
  let body: { name?: unknown; message?: unknown; color?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const note = await postGuestNote(body ?? {}, { ip: clientIp(request) })
    return Response.json({ note }, { status: 201 })
  } catch (error) {
    if (error instanceof GuestNoteRejected) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof GuestNoteRateLimited) {
      return Response.json(
        { error: error.message },
        { status: 429, headers: { 'retry-after': String(error.retryAfterSeconds) } },
      )
    }
    throw error
  }
}
