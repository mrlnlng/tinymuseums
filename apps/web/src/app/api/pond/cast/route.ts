import { castPond, env, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_POND_BODY_BYTES } from '../body.ts'

const PER_MEMBER = { limit: 40, windowSeconds: 60 }

const STATUS: Record<string, number> = {
  no_bait: 402,
  insufficient: 402,
  wager_cap: 400,
  no_chain: 400,
  invalid_bait: 400,
  invalid_wager: 400,
}

export async function POST(request: Request) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response

  const rate = await hit(`pond-cast:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body =
    request.body === null
      ? { ok: true as const, body: null }
      : await readMemberBody(request, MAX_POND_BODY_BYTES)
  if (!body.ok) return body.response

  const result = await castPond(guard.member.id, body.body, env.sessionSecret, new Date())
  if ('error' in result) return json({ error: result.error }, STATUS[result.error] ?? 400)
  return json(result)
}
