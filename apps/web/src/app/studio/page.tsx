import Link from 'next/link'
import { analyticsFor, doorsState, getGallery, locationStates, piecesById, queryOne } from '@tiny/core'
import Message from '@/shared/components/Message'
import Frame, { AtelierFrame } from '@/features/studio/components/Frame'
import { requireArtist } from '@/shared/lib/session'
import { publishAction, publishAllAction } from '@/features/studio/actions'

export const dynamic = 'force-dynamic'

export default async function StudioHome({ searchParams }: { searchParams: Promise<{ m?: string; k?: string }> }) {
  const { m, k } = await searchParams
  const artist = await requireArtist()

  const [gallery, states, doors, stats, status] = await Promise.all([
    getGallery(artist.id),
    locationStates(),
    doorsState(),
    analyticsFor(artist.id),
    queryOne<{ status: string }>(`select status from artists where id = $1`, [artist.id]),
  ])
  const works = [...gallery.arranged, ...gallery.storage]
  const hungIds = states.flatMap((state) => [...state.row, ...state.spots.flatMap((spot) => (spot.pieceId ? [spot.pieceId] : []))])
  const others = await piecesById(hungIds.filter((id) => !works.some((work) => work.id === id)))
  const byId = new Map([...works, ...others].map((work) => [work.id, work]))
  const ready = works.filter((work) => work.status === 'ready')
  const hung = new Set(states.flatMap((state) => [...state.row, ...state.spots.map((spot) => spot.pieceId)]))
  const stored = ready.filter((work) => !hung.has(work.id))
  const emptyFrames = states.flatMap((state) => state.spots.filter((spot) => !spot.pieceId).map((spot) => ({ state, spot })))
  const missing = ready.filter((work) => !work.shopUrl || work.description.trim().length < 20)
  const problems = (work: (typeof works)[number]) => [
    !work.shopUrl ? 'no shop link' : null,
    work.description.trim().length < 20 ? 'description too short' : null,
    !hung.has(work.id) ? 'in storage' : null,
  ].filter(Boolean).join(' · ')
  const needLook = ready.filter((work) => problems(work) !== '')
  const waiting = states.filter((state) => state.unpublished).length + (doors.unpublished ? 1 : 0)
  const hall = states.find((state) => state.id === 'hall')
  const atelier = states.find((state) => state.id === 'atelier')
  const doorCount = (room: string) => doors.draft.filter((door) => door.room === room).length
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

  return (
    <>
      <div className="st-top">
        <div>
          <h1>Your museum</h1>
          <p>
            {waiting > 0
              ? `${plural(waiting, 'place')} with changes waiting. Visitors see the museum as it was until you publish.`
              : 'Everything you have changed is live.'}
          </p>
        </div>
        <div className="st-actions">
          <Link className="st-btn" href="/studio/paintings?id=new">+ Upload painting</Link>
          <form action={publishAllAction}>
            <button className="st-btn primary" type="submit" disabled={waiting === 0}>
              Publish all {waiting > 0 ? <span className="st-count">{waiting}</span> : null}
            </button>
          </form>
        </div>
      </div>

      <Message m={m} k={k} />

      {status?.status !== 'live' ? (
        <section className="st-card">
          <div className="st-card-head">
            <div>
              <h2>Your paintings are hidden</h2>
              <p className="st-muted st-small">Until your wall is hanging, visitors do not see your paintings in the hall.</p>
            </div>
            <form action={publishAction}><button className="st-btn primary" type="submit">Hang my wall</button></form>
          </div>
        </section>
      ) : null}

      <div className="st-stats">
        <div className="st-stat"><div className="st-small st-muted">Paintings</div><div className="st-n">{ready.length}</div><div className="st-small st-muted">{ready.length - stored.length} hanging · {stored.length} in storage</div></div>
        <div className="st-stat"><div className="st-small st-muted">Empty frames</div><div className="st-n">{emptyFrames.length}</div><div className="st-small st-muted">{emptyFrames.length ? emptyFrames.map(({ state }) => state.label).join(', ') : 'every frame is filled'}</div></div>
        <div className="st-stat"><div className="st-small st-muted">Missing details</div><div className={`st-n${missing.length ? ' bad' : ''}`}>{missing.length}</div><div className="st-small st-muted">no shop link or description</div></div>
        <div className="st-stat"><div className="st-small st-muted">Wall views</div><div className="st-n">{stats.displayViews}</div><div className="st-small st-muted"><Link href="/studio/analytics">See who came by</Link></div></div>
      </div>

      <section className="st-card">
        <div className="st-card-head">
          <h2>The museum</h2>
          <span className="st-small st-muted">Open a room to hang paintings or move its doors</span>
        </div>
        <div className="st-map">
          <Link className="st-room hall" href="/studio/hang?room=hall">
            <span className="st-room-name">The hall</span>
            <span className="st-inside">
              {(hall?.row ?? []).slice(0, 4).map((id) => {
                const work = byId.get(id)
                return <Frame key={id} imageUrl={work?.imageUrl ?? null} aspect={work?.aspect ?? null} height={72} title={work?.title ?? 'A painting'} />
              })}
              {hall && hall.row.length === 0 ? <span className="st-small">Nothing hanging yet</span> : null}
            </span>
            <span className="st-foot"><span>{plural(hall?.row.length ?? 0, 'painting')} · {plural(doorCount('hall'), 'door')}</span>{hall?.unpublished ? <span className="st-tag new">changes</span> : null}</span>
          </Link>
          <span className="st-link-door" aria-hidden="true"><span /></span>
          <Link className="st-room atelier" href="/studio/hang?room=atelier">
            <span className="st-room-name">The fashion area</span>
            <span className="st-inside">
              {(atelier?.spots ?? []).map((spot) => {
                const work = spot.pieceId ? byId.get(spot.pieceId) : undefined
                return <AtelierFrame key={spot.id} imageUrl={work?.imageUrl ?? null} side={spot.id.endsWith('left') ? 'left' : 'right'} height={78} title={work?.title ?? 'Empty frame'} />
              })}
            </span>
            <span className="st-foot"><span>{plural(atelier?.spots.length ?? 0, 'frame')} · {plural(doorCount('atelier'), 'door')}</span>{atelier?.unpublished ? <span className="st-tag new">changes</span> : atelier?.spots.some((spot) => !spot.pieceId) ? <span className="st-tag warn">empty frame</span> : null}</span>
          </Link>
          <span className="st-link-door" aria-hidden="true"><span /></span>
          <Link className="st-room pond" href="/studio/doors?room=pond">
            <span className="st-room-name">The pond</span>
            <span className="st-inside"><img src="/assets/pond/bridge.png" alt="" style={{ maxWidth: '80%', maxHeight: 90 }} /></span>
            <span className="st-foot"><span>No frames · {plural(doorCount('pond'), 'door')}</span></span>
          </Link>
        </div>
      </section>

      <div className="st-two">
        <section className="st-card">
          <h2>Waiting to go live</h2>
          {waiting === 0 ? <p className="st-muted">Nothing waiting.</p> : (
            <ul className="st-list">
              {states.filter((state) => state.unpublished).map((state) => (
                <li key={state.id}>
                  <span className="st-tag new">{state.label}</span>
                  <span className="st-grow">Paintings moved, added or taken down</span>
                  <Link href={`/studio/hang?room=${state.id}`}>Review</Link>
                </li>
              ))}
              {doors.unpublished ? (
                <li>
                  <span className="st-tag new">Doors</span>
                  <span className="st-grow">Doors moved, added or removed</span>
                  <Link href="/studio/doors">Review</Link>
                </li>
              ) : null}
            </ul>
          )}
        </section>
        <section className="st-card">
          <h2>Needs a look</h2>
          {needLook.length === 0 && emptyFrames.length === 0 ? <p className="st-muted">All good.</p> : (
            <ul className="st-list">
              {emptyFrames.map(({ state, spot }) => (
                <li key={spot.id}><span className="st-tag warn">Empty frame</span><span className="st-grow">{spot.label}</span><Link href={`/studio/hang?room=${state.id}`}>Fill</Link></li>
              ))}
              {needLook.map((work) => (
                <li key={work.id}>
                  <span className="st-thumb" style={work.imageUrl ? { backgroundImage: `url(${work.imageUrl})` } : undefined} />
                  <span className="st-grow">{work.title}<br /><span className="st-small st-muted">{problems(work)}</span></span>
                  <Link href={`/studio/paintings?id=${work.id}`}>Fix</Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
