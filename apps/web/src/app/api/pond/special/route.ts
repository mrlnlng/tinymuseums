import { POND_SPECIAL_PEARLS, pondSpecialFor } from '@tiny/core'

// The same for everyone all UTC day, and cheap to work out, so guests can see it too.
export function GET() {
  const now = new Date()
  const day = now.toISOString().slice(0, 10)
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  const maxAge = Math.max(0, Math.floor((midnight - now.getTime()) / 1000))
  return Response.json(
    { day, ...pondSpecialFor(day), pearls: POND_SPECIAL_PEARLS },
    { headers: { 'cache-control': `public, max-age=${Math.min(maxAge, 300)}` } },
  )
}
