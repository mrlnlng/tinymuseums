import { getStorage, query, type Derivative } from '@tiny/core'
import Message from '@/components/Message'
import UploadWork from '@/components/UploadWork'
import { requireArtist } from '@/lib/session'
import { deletePieceAction, updatePieceAction } from '../actions'

export const dynamic = 'force-dynamic'

interface Row {
  id: string
  title: string
  description: string
  medium: string
  year: number | null
  dimensions: string | null
  availability: string
  status: string | null
  error: string | null
  derivatives: Derivative[] | null
}

function thumbUrl(derivatives: Derivative[] | null): string | undefined {
  if (!derivatives) return undefined
  const small = derivatives
    .filter((d) => d.format === 'jpg')
    .sort((a, b) => a.width - b.width)[0]
  return small ? getStorage().urlFor(small.key) : undefined
}

export default async function PiecesPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams
  const artist = await requireArtist()

  const rows = await query<Row>(
    `select p.id, p.title, p.description, p.medium, p.year, p.dimensions, p.availability,
            a.status, a.error, a.derivatives
       from pieces p
       left join assets a on a.id = p.asset_id
      where p.artist_id = $1
      order by p.order_index, p.created_at`,
    [artist.id],
  )

  return (
    <>
      <h1 className="script" style={{ fontSize: 38 }}>
        Your works
      </h1>
      <Message m={m} k={k} />

      <UploadWork />

      {rows.length === 0 ? <p className="muted">Nothing uploaded yet.</p> : null}

      {rows.map((row) => (
        <div key={row.id} className="card">
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div
              className="thumb"
              style={{ width: 90, flex: 'none', backgroundImage: thumbUrl(row.derivatives) ? `url(${thumbUrl(row.derivatives)})` : undefined }}
              role="img"
              aria-label={row.title}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              {row.status === 'ready' ? null : (
                <p className={`notice ${row.status === 'failed' ? 'bad' : 'ok'}`}>
                  {row.status === 'failed'
                    ? `Rejected: ${row.error ?? 'unreadable image'}`
                    : 'Processing — the worker is building this one.'}
                </p>
              )}

              <form action={updatePieceAction}>
                <input type="hidden" name="id" value={row.id} />
                <div className="field">
                  <label>Title</label>
                  <input name="title" defaultValue={row.title} required />
                </div>
                <div className="field">
                  <label>Description</label>
                  <textarea name="description" defaultValue={row.description} minLength={20} />
                </div>
                <div className="grid two">
                  <div className="field">
                    <label>Medium</label>
                    <input name="medium" defaultValue={row.medium} />
                  </div>
                  <div className="field">
                    <label>Year</label>
                    <input name="year" type="number" defaultValue={row.year ?? ''} />
                  </div>
                  <div className="field">
                    <label>Dimensions</label>
                    <input name="dimensions" defaultValue={row.dimensions ?? ''} />
                  </div>
                  <div className="field">
                    <label>
                      <input
                        name="forSale"
                        type="checkbox"
                        defaultChecked={row.availability === 'available'}
                      />{' '}
                      Open to enquiries
                    </label>
                  </div>
                </div>
                <button className="button secondary" type="submit">
                  Save
                </button>
              </form>

              <form action={deletePieceAction} style={{ marginTop: 10 }}>
                <input type="hidden" name="id" value={row.id} />
                <button className="button quiet" type="submit">
                  Remove
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}
