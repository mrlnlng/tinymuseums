import { ensureEpoch, epochById, getHallSlice } from '@tiny/core'

const MAX_LIMIT = 12

export async function GET(request: Request) {
  const url = new URL(request.url)

  const epochParam = url.searchParams.get('epoch')
  const after = Math.max(0, Number(url.searchParams.get('after') ?? 0) || 0)
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(url.searchParams.get('limit') ?? 4) || 4))

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
