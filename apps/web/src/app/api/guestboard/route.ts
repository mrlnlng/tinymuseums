import {
  GuestNoteRateLimited,
  GuestNoteRejected,
  grantNote,
  listGuestNotes,
  postGuestNote,
} from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { rateLimitedResponse, rejectedResponse } from '@/shared/lib/domain-error'
import { currentMember } from '@/shared/lib/member-session'

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
  let body: { name?: unknown; message?: unknown; color?: unknown; tzOffset?: unknown }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const queryTz = new URL(request.url).searchParams.get('tz')
  const tzOffset = typeof body?.tzOffset === 'number' ? body.tzOffset : Number(queryTz)

  try {
    const note = await postGuestNote(body ?? {}, { ip: clientIp(request.headers) })
    try {
      const session = await currentMember()
      if (session) await grantNote(session.member.id, new Date(), tzOffset)
    } catch {}
    return Response.json({ note }, { status: 201 })
  } catch (error) {
    if (error instanceof GuestNoteRejected) {
      return rejectedResponse(error)
    }
    if (error instanceof GuestNoteRateLimited) {
      return rateLimitedResponse(error)
    }
    throw error
  }
}
