import { deletePondPhoto, hit } from '@tiny/core'
import { json, limited, memberMutation } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 60, windowSeconds: 60 }
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-photo-delete:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not_found' }, 404)
  return (await deletePondPhoto(guard.member.id, id)) ? json({ ok: true }) : json({ error: 'not_found' }, 404)
}
