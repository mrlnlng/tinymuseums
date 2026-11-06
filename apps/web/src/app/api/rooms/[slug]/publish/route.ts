import { canEdit, getRoom, hit, publish } from '@tiny/core'
import { currentMember } from '@/shared/lib/member-session'
import { checkMutation, json, limited } from '@/shared/lib/member-route'
import { currentArtist, isHallOwner } from '@/shared/lib/session'

const PER_EDITOR = { limit: 20, windowSeconds: 60 }

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const session = await currentMember()
  const artist = await currentArtist()
  const actor = {
    memberId: session?.member.id ?? null,
    isOwnerArtist: artist ? isHallOwner(artist) : false,
  }

  const room = await getRoom(slug)
  if (!room) return json({ error: 'not_found' }, 404)
  if (!canEdit(room, actor)) return json({ error: 'forbidden' }, 403)

  const denied = checkMutation(request, false)
  if (denied) return denied

  const editor = actor.memberId ?? artist?.id
  if (editor) {
    const rate = await hit(`rooms-publish:${editor}`, PER_EDITOR)
    if (!rate.allowed) return limited(rate)
  }

  const updated = await publish(slug)
  if (!updated) return json({ error: 'not_found' }, 404)
  return json({ ok: true, publishedAt: updated.publishedAt })
}
