import { ensureEpoch, epochById, getHallSlice } from '@tiny/core'

const MAX_LIMIT = 12
const MAX_AFTER = 1_000_000

/** A whole number from the query, or null when it is present but not one in range. */
function intParam(raw: string | null, fallback: number, min: number, max: number): number | null {
  if (raw === null || raw === '') return fallback
  const value = Number(raw)
  if (!Number.isSafeInteger(value) || value < min || value > max) return null
  return value
}

export async function GET(request: Request) {
  const url = new URL(request.url)

  const epochParam = url.searchParams.get('epoch')
  const after = intParam(url.searchParams.get('after'), 0, 0, MAX_AFTER)
  const requested = intParam(url.searchParams.get('limit'), 4, 1, 1000)
  if (after === null || requested === null) {
    return Response.json({ error: 'Invalid page' }, { status: 400 })
  }
  const limit = Math.min(MAX_LIMIT, requested)

  const epochId = Number(epochParam)
  if (epochParam && !(Number.isSafeInteger(epochId) && epochId > 0)) {
    return Response.json({ error: 'Invalid epoch' }, { status: 400 })
  }

  const epoch = epochParam ? await epochById(epochId) : await ensureEpoch()

  if (!epoch) {
    return Response.json(
      { epochId: 0, slots: [], nextIndex: null, totalSlots: 0 },
      { headers: { 'cache-control': 'no-store' } },
    )
  }

  const slice = await getHallSlice(epoch, after, limit)

  return Response.json(slice, {
    headers: { 'cache-control': 'public, max-age=30, stale-while-revalidate=300' },
  })
}
