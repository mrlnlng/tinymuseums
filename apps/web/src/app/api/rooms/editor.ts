import { canEdit, getRoom, type RoomRow } from '@tiny/core'
import { currentMember } from '@/shared/lib/member-session'
import { checkMutation, json } from '@/shared/lib/member-route'
import { currentArtist, isHallOwner } from '@/shared/lib/session'

export type RoomEditor =
  | { ok: true; room: RoomRow; actor: { memberId: string | null; isOwnerArtist: boolean }; editorId: string | null }
  | { ok: false; response: Response }

/**
 * Resolves who may change a room. A room the caller cannot edit answers 404 either way, so
 * slugs do not leak, and a personal room's tab must say which member it belongs to (X-TM-Member)
 * so a tab left over from another account cannot write into whoever is signed in now.
 */
export async function roomEditor(request: Request, slug: string, requireJson: boolean): Promise<RoomEditor> {
  const session = await currentMember()
  const artist = await currentArtist()
  const actor = {
    memberId: session?.member.id ?? null,
    isOwnerArtist: artist ? isHallOwner(artist) : false,
  }

  const room = await getRoom(slug)
  if (!room || !canEdit(room, actor)) return { ok: false, response: json({ error: 'not_found' }, 404) }
  if (room.kind === 'personal' && request.headers.get('x-tm-member') !== actor.memberId) {
    return { ok: false, response: json({ error: 'member_mismatch' }, 409) }
  }

  const denied = checkMutation(request, requireJson)
  if (denied) return { ok: false, response: denied }
  return { ok: true, room, actor, editorId: actor.memberId ?? artist?.id ?? null }
}
