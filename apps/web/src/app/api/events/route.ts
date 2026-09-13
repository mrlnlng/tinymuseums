import { recordEvent, type EventKind } from '@tiny/core'
import { isUuid } from '@/shared/lib/validate'

const ALLOWED: EventKind[] = ['display_view', 'piece_view']

export async function POST(request: Request) {
  let body: { kind?: string; artistId?: string; pieceId?: string }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const kind = body.kind as EventKind
  if (!ALLOWED.includes(kind)) {
    return Response.json({ error: 'Unsupported event' }, { status: 400 })
  }

  if (!isUuid(body.artistId) || (body.pieceId !== undefined && !isUuid(body.pieceId))) {
    return Response.json({ error: 'Unknown artist or work' }, { status: 400 })
  }

  await recordEvent(kind, { artistId: body.artistId, pieceId: body.pieceId })
  return new Response(null, { status: 204 })
}
