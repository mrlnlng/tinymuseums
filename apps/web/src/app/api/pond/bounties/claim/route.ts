import { claimPondBounty, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_POND_BODY_BYTES } from '../../body.ts'

const PER_MEMBER = { limit: 30, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-bounty-claim:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_POND_BODY_BYTES)
  if (!body.ok) return body.response

  const id =
    typeof body.body === 'object' && body.body !== null && !Array.isArray(body.body)
      ? (body.body as { id?: unknown }).id
      : undefined
  if (typeof id !== 'string') return json({ error: 'invalid' }, 400)

  const result = await claimPondBounty(guard.member.id, id, new Date())
  if ('error' in result) return json({ error: result.error }, 400)
  return json(result)
}
