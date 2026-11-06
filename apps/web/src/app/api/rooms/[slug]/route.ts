import { canEdit, canView, getRoom } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json } from '@/shared/lib/member-route'
import { currentArtist, isHallOwner } from '@/shared/lib/session'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const session = await currentMember()
  if (session?.renewed) await setMemberCookie(session.token, session.expiresAt)
  const artist = await currentArtist()

  const actor = {
    memberId: session?.member.id ?? null,
    isOwnerArtist: artist ? isHallOwner(artist) : false,
  }
  const key = new URL(request.url).searchParams.get('key')
  const room = await getRoom(slug)
  if (!room || !canView(room, { ...actor, shareToken: key })) {
    return json({ error: 'not_found' }, 404)
  }

  const edit = canEdit(room, actor)
  const owner = room.kind === 'personal' && room.ownerMemberId === actor.memberId
  return json({
    slug: room.slug,
    theme: room.theme,
    kind: room.kind,
    published: room.published,
    canEdit: edit,
    ...(edit ? { draft: room.draft, draftVersion: room.draftVersion } : {}),
    ...(owner ? { sharing: { on: room.visibility === 'link', token: room.shareToken } } : {}),
  })
}
