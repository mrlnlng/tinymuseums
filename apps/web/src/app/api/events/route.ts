import { recordEvent, type EventKind } from '@tiny/core'

const ALLOWED: EventKind[] = ['display_view', 'piece_view']

/*  Visitor telemetry, limited to what an artist actually sees on their dashboard. Scans are recorded server-side by the redirect, and inquiries by the inquiry handler, so neither is accepted here. */
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

  await recordEvent(kind, { artistId: body.artistId, pieceId: body.pieceId })
  return new Response(null, { status: 204 })
}
