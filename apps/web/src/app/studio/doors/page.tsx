import { doorRoom, doorsState, ensureEpoch, getHallSlice, type DoorRoom } from '@tiny/core'
import Message from '@/shared/components/Message'
import DoorEditor, { type HallPainting } from '@/features/studio/components/DoorEditor'
import { requireHallOwner } from '@/shared/lib/session'

export const dynamic = 'force-dynamic'

/** The whole hall as visitors walk it: every painting, in order, at the size it hangs. */
async function hallPaintings(): Promise<HallPainting[]> {
  try {
    const epoch = await ensureEpoch()
    if (!epoch) return []
    const slice = await getHallSlice(epoch, 0, 1000)
    return slice.slots.map(({ display }) => ({ title: display.title, imageUrl: display.image.url, w: display.canvas.w, h: display.canvas.h }))
  } catch (error) {
    console.error('studio hall paintings', error)
    return []
  }
}

export default async function DoorsPage({ searchParams }: { searchParams: Promise<{ room?: string; m?: string; k?: string }> }) {
  const { room, m, k } = await searchParams
  await requireHallOwner()
  const [{ draft, published }, paintings] = await Promise.all([doorsState(), hallPaintings()])
  const start: DoorRoom = (room && doorRoom(room)?.id) || 'hall'
  return (
    <>
      <Message m={m} k={k} />
      <DoorEditor initial={draft} published={published} startRoom={start} paintings={paintings} />
    </>
  )
}
