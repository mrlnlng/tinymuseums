import { env, hit, scoopPond } from '@tiny/core'
import { json, limited, memberMutation } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 60, windowSeconds: 60 }

const STATUS: Record<string, number> = {
  no_net: 409,
  too_soon: 429,
}

export async function POST(request: Request) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-scoop:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const result = await scoopPond(guard.member.id, env.sessionSecret, new Date())
  if ('error' in result) return json({ error: result.error }, STATUS[result.error] ?? 400)
  return json(result)
}
