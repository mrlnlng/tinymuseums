import { hit, setOpen } from '@tiny/core'
import { json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'
import { roomEditor } from '../../editor'

const MAX_BODY_BYTES = 1024
const PER_MEMBER = { limit: 30, windowSeconds: 60 }

/** Turns the sign on the owner's door: Open lets anyone in, Closed lets nobody in. */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const guard = await roomEditor(request, slug, true)
  if (!guard.ok) return guard.response
  if (guard.room.kind !== 'personal' || !guard.actor.memberId) return json({ error: 'not_found' }, 404)

  const rate = await hit(`rooms-open:${guard.actor.memberId}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    return parsed.error === 'too_large'
      ? json({ error: 'too_large' }, 413)
      : json({ error: 'invalid' }, 400)
  }
  const body = parsed.body as { open?: unknown }
  if (typeof body?.open !== 'boolean') return json({ error: 'invalid' }, 400)

  const updated = await setOpen(slug, body.open)
  if (!updated) return json({ error: 'not_found' }, 404)
  return json({ open: updated.visibility === 'open' })
}
