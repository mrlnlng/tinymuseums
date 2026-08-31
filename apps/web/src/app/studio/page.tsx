import Link from 'next/link'
import { evaluatePublishBar, getStudioDisplay, queryOne } from '@tiny/core'
import Message from '@/shared/components/Message'
import { requireArtist } from '@/shared/lib/session'
import { publishAction, unpublishAction } from '@/features/studio/actions'

export const dynamic = 'force-dynamic'

export default async function StudioHome({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams
  const artist = await requireArtist()

  const [report, display, status] = await Promise.all([
    evaluatePublishBar(artist.id),
    getStudioDisplay(artist.id),
    queryOne<{ status: string }>(`select status from artists where id = $1`, [artist.id]),
  ])

  const live = status?.status === 'live'

  return (
    <>
      <h1 className="script page-title lg">{artist.displayName}</h1>
      <p className="muted lead">
        Your wall is at <Link href={`/a/${artist.slug}`}>/a/{artist.slug}</Link>
      </p>

      <Message m={m} k={k} />

      <div className="card">
        <h2 className="card-title">Before your wall can hang</h2>
        <p className="small muted lead">
          Nobody is judged on their art. These are the only requirements, and they exist so the
          museum does not fill up with empty walls.
        </p>
        <ul className="checklist">
          {report.checks.map((check) => (
            <li key={check.code} className={check.ok ? 'pass' : 'fail'}>
              <span className="mark">{check.ok ? '✓' : '·'}</span>
              <span>{check.label}</span>
              <span className="detail">{check.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2 className="card-title">Status</h2>
        {live ? (
          <>
            <p>
              Your wall is <strong>hanging</strong> in the museum.
            </p>
            <form action={unpublishAction}>
              <button className="button quiet" type="submit">
                Take it down
              </button>
            </form>
            <p className="small muted flush">
              Taking down is immediate — it does not wait for the next rotation.
            </p>
          </>
        ) : (
          <>
            <p>
              Your wall is <strong>not hanging</strong> yet.
            </p>
            <form action={publishAction}>
              <button className="button" type="submit" disabled={!report.passed}>
                Hang my wall
              </button>
            </form>
            {!report.passed ? (
              <p className="small muted flush">
                Finish the checklist above first.
              </p>
            ) : null}
          </>
        )}
      </div>

      <div className="card">
        <h2 className="card-title">Your display</h2>
        {display.rendered && display.imageUrl ? (
          <img
            src={display.imageUrl}
            alt="Your arranged display"
            className="display-preview"
          />
        ) : (
          <p className="muted">
            Nothing arranged yet. <Link href="/studio/display">Choose what hangs</Link>.
          </p>
        )}
      </div>
    </>
  )
}
