import Link from 'next/link'
import { getGallery, locationStates, piecesById, whereHung } from '@tiny/core'
import Message from '@/shared/components/Message'
import HangBoard, { type HangWork } from '@/features/studio/components/HangBoard'
import { discardLocationAction, publishLocationAction } from '@/features/studio/actions'
import { requireHallOwner } from '@/shared/lib/session'

export const dynamic = 'force-dynamic'

export default async function HangPage({ searchParams }: { searchParams: Promise<{ room?: string; m?: string; k?: string }> }) {
  const { room, m, k } = await searchParams
  const artist = await requireHallOwner()
  const [{ arranged, storage }, states] = await Promise.all([getGallery(artist.id), locationStates()])
  const state = states.find((s) => s.id === room) ?? states[0]
  const here = new Set([...state.row, ...state.spots.map((spot) => spot.pieceId)])
  const own = [...arranged, ...storage]
  const hung = states.flatMap((s) => [...s.row, ...s.spots.flatMap((spot) => (spot.pieceId ? [spot.pieceId] : []))])
  const others = await piecesById(hung.filter((id) => !own.some((work) => work.id === id)))
  // Whatever already hangs is shown, even without a finished image; only finished ones can be newly hung.
  const ready = [...own, ...others].filter((work) => work.status === 'ready' || here.has(work.id))
  const works: Record<string, HangWork> = {}
  for (const work of ready) {
    const where = whereHung(states, work.id)
    works[work.id] = {
      id: work.id,
      title: work.title,
      imageUrl: work.imageUrl,
      aspect: work.aspect,
      elsewhere: where && !here.has(work.id) ? where.split(' · ')[0] : null,
    }
  }
  // Paintings in storage first, then the ones hanging in other rooms, which would move here.
  const finished = new Set(ready.filter((work) => work.status === 'ready').map((work) => work.id))
  const tray = Object.values(works).filter((work) => !here.has(work.id) && finished.has(work.id)).sort((a, b) => Number(!!a.elsewhere) - Number(!!b.elsewhere))

  return (
    <>
      <div className="st-top">
        <div>
          <h1>Hang paintings</h1>
          <p>Drag paintings onto the wall. Nothing changes for visitors until you publish.</p>
        </div>
        <div className="st-actions">
          <form action={discardLocationAction}>
            <input type="hidden" name="location" value={state.id} />
            <button className="st-btn quiet" type="submit" disabled={!state.unpublished}>Discard changes</button>
          </form>
          <form action={publishLocationAction}>
            <input type="hidden" name="location" value={state.id} />
            <button className="st-btn primary" type="submit" disabled={!state.unpublished}>Publish {state.label.replace(/^The /, 'the ')}</button>
          </form>
        </div>
      </div>

      <nav className="st-tabs" aria-label="Rooms">
        {states.map((s) => (
          <Link key={s.id} className="st-tab" href={`/studio/hang?room=${s.id}`} aria-current={s.id === state.id ? 'page' : undefined}>
            {s.label}{s.unpublished ? <span className="st-dot" aria-label="changes waiting" /> : null}
          </Link>
        ))}
      </nav>

      <Message m={m} k={k} />

      <HangBoard key={state.id} state={state} works={works} tray={tray} />
    </>
  )
}
