import { ensureEpoch, getHallSlice, type HallSliceDto } from '@tiny/core'

const EMPTY: HallSliceDto = { epochId: 0, slots: [], nextIndex: null, totalSlots: 0 }
const TTL_MS = 30_000

// In-process rather than unstable_cache: Amplify never regenerates entries in the
// Next.js incremental cache, so anything stored there stays stale until the next deploy.
const memo = new Map<number, { at: number; slice: Promise<HallSliceDto> }>()

export function firstSlice(size: number): Promise<HallSliceDto> {
  const hit = memo.get(size)
  if (hit && Date.now() - hit.at < TTL_MS) return hit.slice

  const slice = ensureEpoch().then((epoch) => (epoch ? getHallSlice(epoch, 0, size) : EMPTY))
  memo.set(size, { at: Date.now(), slice })
  slice.catch(() => memo.delete(size))
  return slice
}
