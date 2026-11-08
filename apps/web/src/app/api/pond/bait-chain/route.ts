import { chainPondBait, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_POND_BODY_BYTES, catchIdOf } from '../body.ts'

const PER_MEMBER = { limit: 30, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-bait-chain:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_POND_BODY_BYTES)
  if (!body.ok) return body.response

  const catchId = catchIdOf(body.body)
  if (catchId === null) return json({ error: 'not_chainable' }, 400)

  const result = await chainPondBait(guard.member.id, catchId, new Date())
  if ('error' in result) return json({ error: result.error }, 400)
  return json(result)
}
