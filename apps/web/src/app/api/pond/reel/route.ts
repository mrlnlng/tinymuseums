import { env, hit, reelPond } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_POND_BODY_BYTES } from '../body.ts'

const PER_MEMBER = { limit: 120, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-reel:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_POND_BODY_BYTES)
  if (!body.ok) return body.response

  const result = await reelPond(guard.member.id, body.body, env.sessionSecret, new Date())
  if ('error' in result) return json({ error: result.error }, 400)
  return json(result)
}
