import { hit, mergeSlot } from '@tiny/core'
import { checkMutation, empty, json, limited, memberFromRequest } from '@/shared/lib/member-route'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 56 * 1024
const PER_MEMBER = { limit: 60, windowSeconds: 60 }

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const guard = await memberFromRequest(request)
  if (!guard.ok) return guard.response

  const denied = checkMutation(request, true)
  if (denied) return denied

  const perMember = await hit(`member-slots:${guard.member.id}`, PER_MEMBER)
  if (!perMember.allowed) return limited(perMember)

  const { name } = await params

  const body = await readJsonBody(request, MAX_BODY_BYTES)
  if (!body.ok) return body.error === 'too_large' ? empty(413) : json({ error: 'invalid' }, 400)

  if (typeof body.body !== 'object' || body.body === null) return json({ error: 'invalid' }, 400)
  const { version, doc } = body.body as { version?: unknown; doc?: unknown }
  if (
    !Number.isInteger(version) ||
    (version as number) < 1 ||
    typeof doc !== 'object' ||
    doc === null ||
    Array.isArray(doc)
  ) {
    return json({ error: 'invalid' }, 400)
  }

  const result = await mergeSlot(guard.member.id, name, version as number, doc)
  if (!result.ok) {
    if (result.error === 'unknown_slot') return json({ error: 'unknown_slot' }, 404)
    if (result.error === 'too_large') return empty(413)
    if (result.error === 'version_ahead') return json({ error: 'version_ahead' }, 409)
    return json({ error: 'invalid' }, 400)
  }
  return json({ version: result.version, doc: result.doc })
}
