import { exchangePearls, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_POND_BODY_BYTES, pearlsOf } from '../body.ts'
import { tzOffsetOf } from '../../wallet/body.ts'

const PER_MEMBER = { limit: 20, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-exchange:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_POND_BODY_BYTES)
  if (!body.ok) return body.response
  if (pearlsOf(body.body) === undefined) return json({ error: 'invalid' }, 400)

  const tz = new URL(request.url).searchParams.get('tz')
  const result = await exchangePearls(guard.member.id, body.body, new Date(), tzOffsetOf(tz))
  if ('error' in result) {
    return json({ error: result.error }, result.error === 'insufficient' ? 402 : 400)
  }
  return json(result)
}
