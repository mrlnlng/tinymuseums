import { hit, publish } from '@tiny/core'
import { json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'
import { roomEditor } from '../../editor'

const PER_EDITOR = { limit: 20, windowSeconds: 60 }
const MAX_BODY_BYTES = 1024

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const guard = await roomEditor(request, slug, false)
  if (!guard.ok) return guard.response

  if (guard.editorId) {
    const rate = await hit(`rooms-publish:${guard.editorId}`, PER_EDITOR)
    if (!rate.allowed) return limited(rate)
  }

  // An optional { version } publishes only the draft the editor last saw.
  let version: number | undefined
  if (request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    const parsed = await readJsonBody(request, MAX_BODY_BYTES)
    if (!parsed.ok) return json({ error: 'invalid' }, 400)
    const raw = (parsed.body as { version?: unknown } | null)?.version
    if (raw !== undefined && (typeof raw !== 'number' || !Number.isSafeInteger(raw) || raw < 0)) {
      return json({ error: 'invalid' }, 400)
    }
    version = raw
  }

  const updated = await publish(slug, version)
  if (!updated) return json({ error: 'conflict' }, 409)
  return json({ ok: true, publishedAt: updated.publishedAt })
}
