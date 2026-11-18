import { hit, restartInCloset } from '@tiny/core'
import { ADMIN_MODE } from '@/shared/lib/admin-mode'
import { json, limited, memberMutation } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 10, windowSeconds: 60 }

/** Admin mode only: puts the member's room back to a new closet, to try the start of the game again. */
export async function POST(request: Request) {
  if (!ADMIN_MODE) return json({ error: 'not_found' }, 404)

  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`room-closet:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const room = await restartInCloset(guard.member.id)
  return json({ slug: room.slug })
}
