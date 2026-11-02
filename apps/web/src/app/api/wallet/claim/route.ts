import { claimBatch, claimCoins, hit } from '@tiny/core'
import { json, limited, memberMutation, readMemberBody } from '@/shared/lib/member-route'
import { MAX_WALLET_BODY_BYTES, parseWalletClaim } from '../body.ts'

const PER_MEMBER = { limit: 60, windowSeconds: 60 }

export async function POST(request: Request) {
  const guard = await memberMutation(request)
  if (!guard.ok) return guard.response

  const rate = await hit(`wallet-claim:${guard.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const body = await readMemberBody(request, MAX_WALLET_BODY_BYTES)
  if (!body.ok) return body.response

  const tz = new URL(request.url).searchParams.get('tz')
  const parsed = parseWalletClaim(body.body, tz)
  if ('error' in parsed) return json({ error: 'invalid' }, 400)

  const now = new Date()
  if (parsed.kind === 'single') {
    const result = await claimCoins(guard.member.id, parsed.request, now)
    if ('error' in result) return json({ error: 'invalid' }, 400)
    return json(result)
  }

  const batch = await claimBatch(guard.member.id, parsed.requests, now)
  return json({
    granted: batch.results.reduce((sum, result) => sum + result.granted, 0),
    balance: batch.balance,
  })
}
