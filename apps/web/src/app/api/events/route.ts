import { hitForVisitor, recordEvent, type EventKind } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { isUuid } from '@/shared/lib/validate'

const PER_VISITOR = { limit: 240, windowSeconds: 60 * 60 }

const ALLOWED: EventKind[] = ['display_view', 'piece_view']

export async function POST(request: Request) {
  let parsed: unknown
  try {
    parsed = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return Response.json({ error: 'Unsupported event' }, { status: 400 })
  }
  const body = parsed as { kind?: unknown; artistId?: unknown; pieceId?: unknown }

  const kind = body.kind as EventKind
  if (!ALLOWED.includes(kind)) {
    return Response.json({ error: 'Unsupported event' }, { status: 400 })
  }

  if (!isUuid(body.artistId) || (body.pieceId !== undefined && !isUuid(body.pieceId))) {
    return Response.json({ error: 'Unknown artist or work' }, { status: 400 })
  }

  const limited = await hitForVisitor('events', clientIp(request.headers), PER_VISITOR)
  if (!limited.allowed) return new Response(null, { status: 204 })

  await recordEvent(kind, { artistId: body.artistId, pieceId: body.pieceId as string | undefined })
  return new Response(null, { status: 204 })
}
