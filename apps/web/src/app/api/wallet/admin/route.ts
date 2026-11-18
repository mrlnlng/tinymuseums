import { hit, undoAdminUnlock, unlockEverything } from '@tiny/core'
import { ADMIN_MODE, ADMIN_STAMPS } from '@/shared/lib/admin-mode'
import { json, limited, memberMutation } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 10, windowSeconds: 60 }

export async function POST(request: Request) {
  if (!ADMIN_MODE) return json({ error: 'not_found' }, 404)

  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`wallet-admin:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  return json(await unlockEverything(guard.member.id, ADMIN_STAMPS))
}

/** Turning admin mode off: takes back what its unlocks gave. */
export async function DELETE(request: Request) {
  if (!ADMIN_MODE) return json({ error: 'not_found' }, 404)

  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`wallet-admin:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  return json(await undoAdminUnlock(guard.member.id))
}
