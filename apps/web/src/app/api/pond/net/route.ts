import { buyPondNet, hit } from '@tiny/core'
import { json, limited, memberMutation } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 20, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-net:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const result = await buyPondNet(guard.member.id)
  if ('error' in result) {
    return json({ error: result.error }, result.error === 'insufficient' ? 402 : 409)
  }
  return json(result)
}
