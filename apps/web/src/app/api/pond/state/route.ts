import { getPondState, hit, isPondBait } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json, limited } from '@/shared/lib/member-route'

const PER_MEMBER = { limit: 120, windowSeconds: 60 }

export async function GET(request: Request) {
  const session = await currentMember()
  if (!session) return json({ error: 'signed_out' }, 401)
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)

  const rate = await hit(`pond-state:${session.member.id}`, PER_MEMBER)
  if (!rate.allowed) return limited(rate)

  const url = new URL(request.url)
  const baitParam = url.searchParams.get('bait')
  if (baitParam !== null && !isPondBait(baitParam)) return json({ error: 'unknown_bait' }, 400)

  return json(
    await getPondState(session.member.id, new Date(), {
      bait: baitParam ?? 'worm',
      chain: url.searchParams.get('chain') === '1',
    }),
  )
}
