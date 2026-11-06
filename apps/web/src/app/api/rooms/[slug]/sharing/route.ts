import { getRoom, hit, setSharing } from '@tiny/core'
import { currentMember } from '@/shared/lib/member-session'
import { checkMutation, json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 1024
const PER_MEMBER = { limit: 30, windowSeconds: 60 }

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await currentMember()
  if (!session) return json({ error: 'unauthorized' }, 401)

  const { slug } = await params
  const room = await getRoom(slug)
  if (!room) return json({ error: 'not_found' }, 404)
  if (room.kind !== 'personal' || room.ownerMemberId !== session.member.id) {
    return json({ error: 'forbidden' }, 403)
  }

  const denied = checkMutation(request, true)
  if (denied) return denied

  const rate = await hit(`rooms-sharing:${session.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    return parsed.error === 'too_large'
      ? json({ error: 'too_large' }, 413)
      : json({ error: 'invalid' }, 400)
  }
  const body = parsed.body as { on?: unknown }
  if (typeof body?.on !== 'boolean') return json({ error: 'invalid' }, 400)

  const updated = await setSharing(slug, body.on)
  if (!updated) return json({ error: 'not_found' }, 404)
  return json({ on: updated.visibility === 'link', token: updated.shareToken })
}
