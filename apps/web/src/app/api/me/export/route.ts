import { exportMember, exportWallet } from '@tiny/core'
import { json, memberFromRequest } from '@/shared/lib/member-route'

export async function GET(request: Request) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  const [member, wallet] = await Promise.all([
    exportMember(guard.member.id),
    exportWallet(guard.member.id),
  ])
  return json({ ...member, wallet })
}
