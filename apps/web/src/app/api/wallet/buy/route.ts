import { buy, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_WALLET_BODY_BYTES, itemIdOf } from '../body.ts'

const PER_MEMBER = { limit: 20, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`wallet-buy:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_WALLET_BODY_BYTES)
  if (!body.ok) return body.response

  const itemId = itemIdOf(body.body)
  if (itemId === null) return json({ error: 'unknown_item' }, 400)

  const result = await buy(guard.member.id, itemId)
  if ('error' in result) {
    return json({ error: result.error }, result.error === 'insufficient' ? 402 : 400)
  }
  return json(result)
}
