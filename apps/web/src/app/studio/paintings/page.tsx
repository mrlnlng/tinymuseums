import Link from 'next/link'
import { env, getGallery, listQrTokens, locationStates, whereHung } from '@tiny/core'
import Message from '@/shared/components/Message'
import CodesSection from '@/features/studio/components/CodesSection'
import PaintingEditor from '@/features/studio/components/PaintingEditor'
import PlacePicker from '@/features/studio/components/PlacePicker'
import { deletePieceAction } from '@/features/studio/actions'
import { requireArtist } from '@/shared/lib/session'

export const dynamic = 'force-dynamic'

export default async function PaintingsPage({ searchParams }: { searchParams: Promise<{ id?: string; m?: string; k?: string }> }) {
  const { id, m, k } = await searchParams
  const artist = await requireArtist()
  const [{ arranged, storage }, states, codes] = await Promise.all([getGallery(artist.id), locationStates(), listQrTokens(artist.id)])
  const works = [...arranged, ...storage]
  const titles = new Map(works.map((work) => [work.id, work.title]))
  const chosen = id === 'new' ? null : works.find((work) => work.id === id) ?? (id ? null : works[0] ?? null)
  const where = chosen ? whereHung(states, chosen.id) : null

  const tagFor = (work: (typeof works)[number]) => {
    if (work.status === 'failed') return <span className="st-tag warn">rejected</span>
    if (work.status !== 'ready') return <span className="st-tag new">processing</span>
    if (!work.shopUrl) return <span className="st-tag warn">no shop link</span>
    const hung = whereHung(states, work.id)
    return hung ? <span className="st-tag live">{hung.split(' · ')[0].replace(/^The /, '')}</span> : <span className="st-tag warn">storage</span>
  }

  return (
    <>
      <div className="st-top">
        <div>
          <h1>Paintings</h1>
          <p>Everything a visitor can read or click on a painting lives here.</p>
        </div>
      </div>

      <Message m={m} k={k} />

      <div className="st-paint">
        <nav className="st-card st-picker" aria-label="Paintings">
          <Link className="st-pick" href="/studio/paintings?id=new" aria-current={chosen === null ? 'page' : undefined}>
            <span className="st-pic plus">+</span>
            <span><b>Upload new</b><span className="st-small st-muted">a painting from your computer</span></span>
          </Link>
          {works.map((work) => (
            <Link key={work.id} className="st-pick" href={`/studio/paintings?id=${work.id}`} aria-current={chosen?.id === work.id ? 'page' : undefined}>
              <span className="st-pic" style={work.imageUrl ? { backgroundImage: `url(${work.imageUrl})` } : undefined} />
              <span style={{ minWidth: 0 }}><b>{work.title}</b>{tagFor(work)}</span>
            </Link>
          ))}
        </nav>

        <PaintingEditor key={chosen?.id ?? 'new'} painting={chosen} />
      </div>

      {chosen ? (
        <section className="st-card">
          <div className="st-card-head">
            <div>
              <h2>Where it hangs</h2>
              <p className="st-muted st-small" style={{ margin: 0 }}>
                {where ? `${where}.` : 'Not hanging anywhere yet.'} Changes wait for you to publish them under <Link href="/studio/hang">Hang paintings</Link>.
              </p>
            </div>
            <form action={deletePieceAction}>
              <input type="hidden" name="id" value={chosen.id} />
              <button className="st-btn danger small" type="submit">Delete painting</button>
            </form>
          </div>
          {chosen.status === 'ready' ? <PlacePicker pieceId={chosen.id} states={states} titles={titles} back={`/studio/paintings?id=${chosen.id}`} /> : <p className="st-small st-muted">It can hang once the museum has made its copies.</p>}
        </section>
      ) : null}

      <CodesSection codes={codes.filter((code) => !code.revoked).map(({ token, placement, scans }) => ({ token, placement, scans }))} baseUrl={env.publicBaseUrl} />
    </>
  )
}
