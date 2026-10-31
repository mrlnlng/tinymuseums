import { chooseName, hit, memberName, rerollName } from '@tiny/core'
import { validSeed } from '@tiny/core/presence'
import { checkMutation, empty, json, limited, memberFromRequest } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 1024
const PER_MEMBER = { limit: 30, windowSeconds: 60 * 60 }

// One of: { device } reads the name, giving the account this device's seed if it has none;
// { name } chooses one; { seed } rolls a new generated name.
export async function PUT(request: Request) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  const denied = checkMutation(request, true)
  if (denied) return denied

  const body = await readJsonBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.error === 'too_large' ? empty(413) : json({ error: 'invalid' }, 400)
  const input = (body.body ?? {}) as { device?: unknown; name?: unknown; seed?: unknown }

  if ('device' in input) {
    if (input.device !== null && !validSeed(input.device)) return json({ error: 'invalid' }, 400)
    const result = await memberName(guard.member.id, input.device)
    return result ? json(result) : json({ error: 'invalid' }, 400)
  }

  const perMember = await hit(`member-name:${guard.member.id}`, PER_MEMBER)
  if (!perMember.allowed) return limited(perMember)

  if (typeof input.name === 'string') {
    const result = await chooseName(guard.member.id, input.name)
    if (!result) return json({ error: 'invalid' }, 400)
    return 'ok' in result ? json({ error: result.reason }, 400) : json(result)
  }
  if (validSeed(input.seed)) {
    const result = await rerollName(guard.member.id, input.seed)
    return result ? json(result) : json({ error: 'invalid' }, 400)
  }
  return json({ error: 'invalid' }, 400)
}
