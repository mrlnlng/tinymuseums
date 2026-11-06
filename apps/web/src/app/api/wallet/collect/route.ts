import { collect, hit } from '@tiny/core'
import { ITEMS } from '@tiny/core/economy'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_WALLET_BODY_BYTES } from '../body.ts'

const PER_MEMBER = { limit: 60, windowSeconds: 60 * 60 }

function collectRequest(body: unknown): { item: string; source: string } | null {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) return null
  const { item, source } = body as Record<string, unknown>
  if (typeof item !== 'string' || item.length === 0) return null
  if (typeof source !== 'string' || source.length === 0) return null
  return { item, source }
}

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`wallet-collect:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_WALLET_BODY_BYTES)
  if (!body.ok) return body.response

  const parsed = collectRequest(body.body)
  if (parsed === null) return json({ error: 'unknown_item' }, 400)
  if (ITEMS[parsed.item]?.earnedBy !== parsed.source) {
    return json({ error: 'unknown_item' }, 400)
  }

  const result = await collect(guard.member.id, parsed.item)
  if ('error' in result) return json({ error: result.error }, 400)
  return json(result)
}
