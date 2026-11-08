import { getPondFeed, hitForVisitor } from '@tiny/core'
import { json, limited } from '@/shared/lib/member-route'
import { clientIp } from '@/shared/lib/client-ip'

const PER_VISITOR = { limit: 120, windowSeconds: 60 }

export async function GET(request: Request) {
  const rate = await hitForVisitor('pond-feed', clientIp(request.headers), PER_VISITOR)
  if (!rate.allowed) return limited(rate)

  return json(await getPondFeed(20), 200, {
    'cache-control': 'public, s-maxage=15, stale-while-revalidate=30',
  })
}
