import { buyPondBait, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_WALLET_BODY_BYTES, baitIdOf } from '../../wallet/body.ts'

const PER_MEMBER = { limit: 20, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-bait:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_WALLET_BODY_BYTES)
  if (!body.ok) return body.response

  const bait = baitIdOf(body.body)
  if (bait === null) return json({ error: 'unknown_bait' }, 400)

  const result = await buyPondBait(guard.member.id, bait)
  if ('error' in result) {
    return json({ error: result.error }, result.error === 'insufficient' ? 402 : 400)
  }
  return json(result)
}
