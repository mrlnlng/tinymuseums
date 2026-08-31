import { LAYOUTS, LAYOUT_NAMES, getStorage, getStudioDisplay, pickDerivative, query, type Derivative } from '@tiny/core'
import Message from '@/shared/components/Message'
import { requireArtist } from '@/shared/lib/session'
import { saveDisplayAction } from '@/features/studio/actions'

export const dynamic = 'force-dynamic'

interface Row {
  id: string
  title: string
  derivatives: Derivative[] | null
}

export default async function DisplayPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams
  const artist = await requireArtist()

  const [display, ready] = await Promise.all([
    getStudioDisplay(artist.id),
    query<Row>(
      `select p.id, p.title, a.derivatives
         from pieces p
         join assets a on a.id = p.asset_id
        where p.artist_id = $1 and a.status = 'ready'
        order by p.order_index, p.created_at`,
      [artist.id],
    ),
  ])

  const hung = new Set(display.hungPieceIds)

  return (
    <>
      <h1 className="script page-title">Arrange your wall</h1>
      <p className="muted">
        Choose a template and tick what hangs. Everything else stays on your page — visitors
        walk through your whole body of work once they step up to the wall.
      </p>

      <Message m={m} k={k} />

      {ready.length === 0 ? (
        <p className="notice bad">
          Nothing is ready to hang yet. Upload some works and wait for them to finish processing.
        </p>
      ) : (
        <form action={saveDisplayAction} className="card">
          <h2 className="card-title">Template</h2>
          <div className="grid two">
            {LAYOUT_NAMES.map((name) => (
              <label key={name} className="plaque-card">
                <input
                  type="radio"
                  name="layout"
                  value={name}
                  defaultChecked={display.layout === name}
                />{' '}
                <strong>{LAYOUTS[name].label}</strong>
                <br />
                <span className="small">
                  Holds {LAYOUTS[name].capacity} {LAYOUTS[name].capacity === 1 ? 'work' : 'works'}
                </span>
              </label>
            ))}
          </div>

          <h2 className="subhead">What hangs</h2>
          <p className="small muted lead">
            Tick in the order you want them, up to the template&rsquo;s capacity. Extras are
            ignored.
          </p>
          <div className="grid two">
            {ready.map((row) => {
              const small = pickDerivative(row.derivatives ?? [], 0)
              return (
                <label key={row.id} className="card">
                  <div
                    className="thumb"
                    style={
                      small ? { backgroundImage: `url(${getStorage().urlFor(small.key)})` } : undefined
                    }
                    role="img"
                    aria-label={row.title}
                  />
                  <p className="small thumb-caption">
                    <input type="checkbox" name="piece" value={row.id} defaultChecked={hung.has(row.id)} />{' '}
                    {row.title}
                  </p>
                </label>
              )
            })}
          </div>

          <button className="button form-submit" type="submit">
            Hang these
          </button>
        </form>
      )}

      {display.rendered && display.imageUrl ? (
        <div className="card">
          <h2 className="card-title">How it looks</h2>
          <img src={display.imageUrl} alt="Your display" className="display-preview" />
        </div>
      ) : null}
    </>
  )
}
