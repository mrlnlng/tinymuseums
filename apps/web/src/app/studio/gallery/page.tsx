import { MAX_STANDS, env, getGallery, listQrTokens } from '@tiny/core'
import Message from '@/shared/components/Message'
import UploadWork from '@/features/studio/components/UploadWork'
import CodesSection from '@/features/studio/components/CodesSection'
import { FloorControls, StorageControls } from '@/features/studio/components/ArrangeControls'
import { requireArtist } from '@/shared/lib/session'
import { deletePieceAction, updatePieceAction } from '@/features/studio/actions'

export const dynamic = 'force-dynamic'

/* The single pane: upload a work, and every work you upload hangs on its own
   stand in the museum (up to 30), in the order set below. Codes join on this
   page. */

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams
  const artist = await requireArtist()

  const { arranged, storage } = await getGallery(artist.id)
  const works = [...arranged, ...storage]
  const floorFull = arranged.length >= MAX_STANDS
  const codes = (await listQrTokens(artist.id))
    .filter((code) => !code.revoked)
    .map(({ token, placement, scans }) => ({ token, placement, scans }))

  return (
    <>
      <h1 className="script page-title">Gallery</h1>
      <p className="muted lead">
        Upload your works — each one hangs on its own stand in the museum, up to 30.
      </p>

      <Message m={m} k={k} />

      <UploadWork />

      <h2 className="subhead">Your works</h2>
      {works.length === 0 ? (
        <p className="muted">Nothing uploaded yet.</p>
      ) : (
        works.map((work) => (
          <div key={work.id} className="card">
            <div className="piece-row">
              <div
                className="thumb thumb-sm"
                style={work.imageUrl ? { backgroundImage: `url(${work.imageUrl})` } : undefined}
                role="img"
                aria-label={work.title}
              />
              <div className="piece-fields">
                {work.status !== 'ready' ? (
                  <p className={`notice ${work.status === 'failed' ? 'bad' : 'ok'}`}>
                    {work.status === 'failed'
                      ? `Rejected: ${work.error ?? 'unreadable image'}`
                      : 'Processing — the worker is building this one.'}
                  </p>
                ) : null}

                <form action={updatePieceAction}>
                  <input type="hidden" name="id" value={work.id} />
                  <div className="field">
                    <label>Title</label>
                    <input name="title" defaultValue={work.title} required />
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea name="description" defaultValue={work.description} minLength={20} />
                  </div>
                  <div className="field">
                    <label>Shop print link</label>
                    <input
                      name="shopUrl"
                      type="url"
                      defaultValue={work.shopUrl ?? ''}
                      placeholder="https://…"
                    />
                  </div>
                  <button className="button secondary" type="submit">
                    Save
                  </button>
                </form>

                <form action={deletePieceAction} className="piece-remove">
                  <input type="hidden" name="id" value={work.id} />
                  <button className="button quiet" type="submit">
                    Remove
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))
      )}

      <h2 className="subhead">Arrange the floor</h2>
      <p className="small muted lead">
        Stands 1–30. The museum walks in this exact order — move works up and down.
      </p>

      {arranged.length === 0 ? (
        <p className="muted">Nothing on the floor yet — uploads hang automatically.</p>
      ) : (
        <ol className="stands">
          {arranged.map((work, i) => (
            <li key={work.id} className="stand">
              <span className="stand-number">{i + 1}</span>
              <div
                className="thumb stand-thumb"
                style={work.imageUrl ? { backgroundImage: `url(${work.imageUrl})` } : undefined}
                role="img"
                aria-label={work.title}
              />
              <span className="stand-title">{work.title}</span>
              <FloorControls
                pieceId={work.id}
                title={work.title}
                first={i === 0}
                last={i === arranged.length - 1}
              />
            </li>
          ))}
        </ol>
      )}

      {storage.length > 0 ? (
        <div className="card">
          <h3 className="card-title">In storage</h3>
          <p className="small muted lead">
            Uploaded but not on the floor — visitors never see these.
          </p>
          <ul className="storage-list">
            {storage.map((work) => (
              <li key={work.id}>
                <span className="storage-title">{work.title}</span>
                <StorageControls pieceId={work.id} title={work.title} disabled={floorFull} />
              </li>
            ))}
          </ul>
          {floorFull ? (
            <p className="small muted flush">
              {MAX_STANDS} of {MAX_STANDS} stands in use — unhang something first.
            </p>
          ) : null}
        </div>
      ) : null}

      <CodesSection codes={codes} baseUrl={env.publicBaseUrl} />
    </>
  )
}
