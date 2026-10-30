import { exportMember } from '@tiny/core'
import { json, memberFromRequest } from '@/shared/lib/member-route'

export async function GET(request: Request) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  return json(await exportMember(guard.member.id))
}
