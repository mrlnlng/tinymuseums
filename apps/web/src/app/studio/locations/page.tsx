import { getGallery, locationStates } from '@tiny/core'
import Message from '@/shared/components/Message'
import PlacePicker from '@/features/studio/components/PlacePicker'
import { discardLocationAction, nudgeInRowAction, placePaintingAction, publishLocationAction } from '@/features/studio/actions'
import { requireHallOwner } from '@/shared/lib/session'

export const dynamic = 'force-dynamic'

export default async function LocationsPage({ searchParams }: { searchParams: Promise<{ m?: string; k?: string }> }) {
  const { m, k } = await searchParams
  const artist = await requireHallOwner()
  const { arranged, storage } = await getGallery(artist.id)
  const works = [...arranged, ...storage]
  const byId = new Map(works.map((work) => [work.id, work]))
  const titles = new Map(works.map((work) => [work.id, work.title]))
  const states = await locationStates()
  const ready = works.filter((work) => work.status === 'ready')

  const thumb = (id: string | null) => {
    const work = id ? byId.get(id) : null
    return (
      <div
        className="thumb stand-thumb"
        style={work?.imageUrl ? { backgroundImage: `url(${work.imageUrl})` } : undefined}
        role="img"
        aria-label={work?.title ?? 'Empty'}
      />
    )
  }

  return (
    <>
      <h1 className="script page-title">Locations</h1>
      <p className="muted lead">
        Every place in the museum a painting can hang. Choose what hangs where, then publish a location to put it live.
        Until then visitors see what was published before. An empty frame shows a plain canvas.
      </p>
      <Message m={m} k={k} />

      {states.map((state) => (
        <section key={state.id} id={state.id} className="card location">
          <div className="location-head">
            <h2 className="card-title">{state.label}</h2>
            <span className={`notice ${state.unpublished ? 'bad' : 'ok'}`}>{state.unpublished ? 'Unpublished changes' : 'Live'}</span>
            <form action={publishLocationAction}>
              <input type="hidden" name="location" value={state.id} />
              <button className="button" type="submit" disabled={!state.unpublished}>Publish</button>
            </form>
            <form action={discardLocationAction}>
              <input type="hidden" name="location" value={state.id} />
              <button className="button quiet" type="submit" disabled={!state.unpublished}>Discard changes</button>
            </form>
          </div>

          {state.kind === 'spots' ? (
            <ul className="spot-grid">
              {state.spots.map((spot) => (
                <li key={spot.id} className="spot">
                  {thumb(spot.pieceId)}
                  <div className="spot-fields">
                    <strong>{spot.label}</strong>
                    <span className="small muted">
                      {spot.pieceId ? titles.get(spot.pieceId) ?? 'untitled' : 'Empty'}
                      {spot.pieceId !== spot.livePieceId ? ' (not published yet)' : ''}
                    </span>
                    <form action={placePaintingAction} className="place-picker">
                      <input type="hidden" name="back" value="/studio/locations" />
                      <input type="hidden" name="target" value={`${state.id}|${spot.id}`} />
                      <select name="id" defaultValue={spot.pieceId ?? ''} aria-label={`Painting for ${spot.label}`}>
                        <option value="" disabled>Choose a painting</option>
                        {ready.map((work) => <option key={work.id} value={work.id}>{work.title}</option>)}
                      </select>
                      <button className="button secondary" type="submit">Hang</button>
                    </form>
                    {spot.pieceId ? (
                      <form action={placePaintingAction}>
                        <input type="hidden" name="back" value="/studio/locations" />
                        <input type="hidden" name="id" value={spot.pieceId} />
                        <input type="hidden" name="target" value="none" />
                        <button className="button quiet" type="submit">Take down</button>
                      </form>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {state.row.length === 0 ? <p className="muted">Nothing in the row yet.</p> : (
                <ol className="stands">
                  {state.row.map((id, i) => (
                    <li key={id} className="stand">
                      <span className="stand-number">{i + 1}</span>
                      {thumb(id)}
                      <span className="stand-title">{titles.get(id) ?? 'untitled'}{state.liveRow[i] !== id ? ' (not published yet)' : ''}</span>
                      <div className="stand-controls">
                      {(['up', 'down'] as const).map((by) => (
                        <form key={by} action={nudgeInRowAction}>
                          <input type="hidden" name="location" value={state.id} />
                          <input type="hidden" name="id" value={id} />
                          <input type="hidden" name="by" value={by} />
                          <button className="button quiet" type="submit" disabled={by === 'up' ? i === 0 : i === state.row.length - 1}
                            aria-label={`Move ${titles.get(id) ?? 'it'} ${by}`}>{by === 'up' ? '↑' : '↓'}</button>
                        </form>
                      ))}
                      <form action={placePaintingAction}>
                        <input type="hidden" name="back" value="/studio/locations" />
                        <input type="hidden" name="id" value={id} />
                        <input type="hidden" name="target" value="none" />
                        <button className="button quiet" type="submit">Take down</button>
                      </form>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
              <form action={placePaintingAction} className="place-picker">
                <input type="hidden" name="back" value="/studio/locations" />
                <input type="hidden" name="target" value={`${state.id}|end`} />
                <select name="id" defaultValue="" aria-label={`Add a painting to ${state.label}`}>
                  <option value="" disabled>Add a painting at the end</option>
                  {ready.filter((work) => !state.row.includes(work.id)).map((work) => <option key={work.id} value={work.id}>{work.title}</option>)}
                </select>
                <button className="button secondary" type="submit">Add</button>
              </form>
            </>
          )}
        </section>
      ))}

      <h2 className="subhead">Not hung anywhere</h2>
      {(() => {
        const hung = new Set(states.flatMap((s) => [...s.row, ...s.spots.map((spot) => spot.pieceId)]))
        const loose = ready.filter((work) => !hung.has(work.id))
        return loose.length === 0 ? <p className="muted">Every painting hangs somewhere.</p> : loose.map((work) => (
          <div key={work.id} className="card piece-row">
            {thumb(work.id)}
            <div className="piece-fields">
              <strong>{work.title}</strong>
              <PlacePicker pieceId={work.id} states={states} titles={titles} back="/studio/locations" />
            </div>
          </div>
        ))
      })()}
    </>
  )
}
