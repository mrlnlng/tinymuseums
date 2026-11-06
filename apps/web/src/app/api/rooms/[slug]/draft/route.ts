import { hit, saveDraft } from '@tiny/core'
import { json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'
import { roomEditor } from '../../editor'

const MAX_BODY_BYTES = 128 * 1024
const PER_EDITOR = { limit: 120, windowSeconds: 60 }

function versionOf(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0 ? value : undefined
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const guard = await roomEditor(request, slug, true)
  if (!guard.ok) return guard.response

  if (guard.editorId) {
    const rate = await hit(`rooms-draft:${guard.editorId}`, PER_EDITOR)
    if (!rate.allowed) return limited(rate)
  }

  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    return parsed.error === 'too_large'
      ? json({ error: 'too_large' }, 413)
      : json({ error: 'invalid' }, 400)
  }
  const body = (typeof parsed.body === 'object' && parsed.body !== null ? parsed.body : {}) as {
    placements?: unknown
    version?: unknown
  }

  const result = await saveDraft(slug, body.placements, guard.actor, versionOf(body.version))
  if (result.ok) return json({ ok: true, version: result.version })
  if (result.reason === 'conflict' && 'draft' in result) {
    return json({ error: 'conflict', version: result.version, draft: result.draft }, 409)
  }
  if (result.reason === 'not_found' || result.reason === 'forbidden') return json({ error: 'not_found' }, 404)
  return json({ error: 'invalid', reason: result.reason, ...('id' in result && result.id ? { id: result.id } : {}) }, 400)
}
