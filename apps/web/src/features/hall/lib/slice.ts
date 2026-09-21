import { unstable_cache } from 'next/cache'
import { ensureEpoch, getHallSlice, type HallSliceDto } from '@tiny/core'

const EMPTY: HallSliceDto = { epochId: 0, slots: [], nextIndex: null, totalSlots: 0 }

// Matches the 30s the /api/hall route already allows itself, so most visits open
// the hall without touching the database.
export const firstSlice = unstable_cache(
  async (size: number): Promise<HallSliceDto> => {
    const epoch = await ensureEpoch()
    return epoch ? getHallSlice(epoch, 0, size) : EMPTY
  },
  ['hall-first-slice'],
  { revalidate: 30 },
)
