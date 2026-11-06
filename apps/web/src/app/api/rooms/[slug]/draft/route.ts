import { canEdit, getRoom, hit, saveDraft } from '@tiny/core'
import { currentMember } from '@/shared/lib/member-session'
import { checkMutation, json, limited } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'
import { currentArtist, isHallOwner } from '@/shared/lib/session'

const MAX_BODY_BYTES = 128 * 1024
const PER_EDITOR = { limit: 120, windowSeconds: 60 }

export async function PUT(
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

  const denied = checkMutation(request, true)
  if (denied) return denied

  const editor = actor.memberId ?? artist?.id
  if (editor) {
    const rate = await hit(`rooms-draft:${editor}`, PER_EDITOR)
    if (!rate.allowed) return limited(rate)
  }

  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    return parsed.error === 'too_large'
      ? json({ error: 'too_large' }, 413)
      : json({ error: 'invalid' }, 400)
  }
  const body = typeof parsed.body === 'object' && parsed.body !== null ? parsed.body : {}
  const placements = (body as { placements?: unknown }).placements

  const result = await saveDraft(slug, placements, actor)
  if (!result.ok) {
    const status = result.reason === 'not_found' ? 404 : result.reason === 'forbidden' ? 403 : 400
    return json({ error: status === 400 ? 'invalid' : result.reason, reason: result.reason }, status)
  }
  return json({ ok: true })
}
