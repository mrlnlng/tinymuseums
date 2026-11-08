import { getPondLeaderboard, hitForVisitor, type PondBoardId, type PondBoardPeriod } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { json, limited } from '@/shared/lib/member-route'
import { clientIp } from '@/shared/lib/client-ip'

const PER_VISITOR = { limit: 120, windowSeconds: 60 }
const BOARDS: readonly PondBoardId[] = ['biggest', 'haul', 'rarest']
const PERIODS: readonly PondBoardPeriod[] = ['week', 'all']

function oneOf<T extends string>(values: readonly T[], value: string | null, fallback: T): T | null {
  if (value === null) return fallback
  return (values as readonly string[]).includes(value) ? (value as T) : null
}

export async function GET(request: Request) {
  const session = await currentMember()
  if (session?.renewed) await setMemberCookie(session.token, session.expiresAt)

  const rate = await hitForVisitor('pond-leaderboard', clientIp(request.headers), PER_VISITOR)
  if (!rate.allowed) return limited(rate)

  const url = new URL(request.url)
  const board = oneOf(BOARDS, url.searchParams.get('board'), 'biggest')
  if (board === null) return json({ error: 'invalid_board' }, 400)
  const period = oneOf(PERIODS, url.searchParams.get('period'), 'week')
  if (period === null) return json({ error: 'invalid_period' }, 400)

  const data = await getPondLeaderboard(board, period, session?.member.id ?? null, new Date())
  const cache = session
    ? 'private, no-store'
    : 'public, s-maxage=15, stale-while-revalidate=30'
  return json(data, 200, { 'cache-control': cache })
}
