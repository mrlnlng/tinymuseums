import { unstable_cache } from 'next/cache'
import { ensureEpoch, epochById, getSketchPool, getSketchRound } from '@tiny/core'

const MAX_ROUND = 10_000

const sketchPool = unstable_cache(
  async (epochId: number) => {
    const epoch = await epochById(epochId)
    return epoch ? getSketchPool(epoch) : []
  },
  ['sketch-pool'],
  { revalidate: 300 },
)

function unavailable(status: number, error: string): Response {
  return Response.json({ error }, { status, headers: { 'cache-control': 'public, max-age=60' } })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const round = Number(url.searchParams.get('round') ?? 0)
  if (!Number.isSafeInteger(round) || round < 0 || round > MAX_ROUND) {
    return unavailable(400, 'Invalid round')
  }

  const epochParam = Number(url.searchParams.get('epoch'))
  const requested = Number.isSafeInteger(epochParam) && epochParam > 0 ? await epochById(epochParam) : null
  const epoch = requested ?? (await ensureEpoch())
  if (!epoch) return unavailable(404, 'The hall is empty')

  const sketch = await getSketchRound(epoch, await sketchPool(epoch.id), round)
  if (!sketch) return unavailable(404, 'Not enough sketches yet')

  return Response.json(sketch, {
    headers: { 'cache-control': 'public, max-age=300, stale-while-revalidate=600' },
  })
}
