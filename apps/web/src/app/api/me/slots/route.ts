import { readSlots } from '@tiny/core'
import { json, memberFromRequest } from '@/shared/lib/member-route'

export async function GET(request: Request) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  const slots = await readSlots(guard.member.id)
  return json({ slots })
}
