'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { updatePieceAction } from '@/features/studio/actions'
import Frame from './Frame'

export interface EditedPainting {
  id: string
  title: string
  description: string
  shopUrl: string | null
  wallpaperUrl: string | null
  imageUrl: string | null
  aspect: number | null
  status: string | null
  error: string | null
}

async function sha256Hex(file: File): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

type Phase = 'idle' | 'hashing' | 'uploading' | 'saving'
const PHASE_LABEL: Record<Phase, string> = { idle: 'Upload', hashing: 'Reading the file…', uploading: 'Uploading…', saving: 'Saving…' }
const isLink = (value: string) => /^https?:\/\/\S+\.\S+/.test(value.trim())

/** Uploads a new painting, or edits one; the plaque beside it shows what visitors will read. */
export default function PaintingEditor({ painting }: { painting: EditedPainting | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(painting?.title ?? '')
  const [description, setDescription] = useState(painting?.description ?? '')
  const [shopUrl, setShopUrl] = useState(painting?.shopUrl ?? '')
  const [wallpaperUrl, setWallpaperUrl] = useState(painting?.wallpaperUrl ?? '')
  const [file, setFile] = useState<{ url: string; aspect: number; name: string; width: number; height: number } | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => () => { if (file) URL.revokeObjectURL(file.url) }, [file])

  function choose(chosen: File | undefined) {
    if (!chosen) return
    const url = URL.createObjectURL(chosen)
    const image = new Image()
    image.onload = () => setFile({ url, aspect: image.naturalWidth / image.naturalHeight, name: chosen.name, width: image.naturalWidth, height: image.naturalHeight })
    image.src = url
  }

  async function upload(form: FormData) {
    setError(null)
    const image = form.get('image')
    if (!(image instanceof File) || image.size === 0) return setError('Choose an image to upload')
    try {
      setPhase('hashing')
      const digest = await sha256Hex(image)
      setPhase('uploading')
      const presign = await fetch('/api/studio/uploads/presign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contentType: image.type, digest, bytes: image.size }),
      })
      const presigned = (await presign.json()) as { url?: string; headers?: Record<string, string>; error?: string }
      if (!presign.ok || !presigned.url) return setError(presigned.error ?? 'Could not start the upload')
      const put = await fetch(presigned.url, { method: 'PUT', headers: presigned.headers ?? {}, body: image })
      if (!put.ok) return setError('The upload did not go through. Try again.')
      setPhase('saving')
      const saved = await fetch('/api/studio/pieces', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contentType: image.type, digest, title, description, shopUrl, wallpaperUrl }),
      })
      const body = (await saved.json()) as { error?: string; pieceId?: string }
      if (!saved.ok) return setError(body.error ?? 'Could not save the painting')
      router.push(`/studio/paintings?id=${body.pieceId}&m=${encodeURIComponent('Uploaded. The museum is making its copies; it can hang in a minute or two.')}&k=ok`)
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setPhase('idle')
    }
  }

  const imageUrl = file?.url ?? painting?.imageUrl ?? null
  const aspect = file?.aspect ?? painting?.aspect ?? null
  const busy = phase !== 'idle'
  const checks: [boolean, string][] = [
    [painting ? painting.status === 'ready' : !!file, painting ? (painting.status === 'ready' ? 'Image is ready' : painting.status === 'failed' ? 'Image was rejected' : 'Image is still being made') : 'Has an image'],
    [title.trim().length > 0, 'Has a title'],
    [description.trim().length >= 20, 'Description is at least 20 characters'],
    [isLink(shopUrl), 'Has a shop link'],
  ]

  return (
    <>
      <section className="st-card">
        <form className="st-form" action={painting ? updatePieceAction : (data) => { void upload(data) }}>
          {painting ? <input type="hidden" name="id" value={painting.id} /> : null}
          <label className="st-full st-drop-file" htmlFor="image" style={{ display: 'flex', gap: 14, alignItems: 'center', border: '3px dashed #d8b98c', borderRadius: 18, padding: 12, background: '#fff', cursor: painting ? 'default' : 'pointer' }}>
            <span className="st-pic" style={{ width: 90, height: 120, borderRadius: 10, flex: 'none', background: imageUrl ? `#e9d4ad center / cover no-repeat url(${imageUrl})` : '#f6e8cc' }} />
            <span style={{ flex: 1, minWidth: 0 }}>
              {painting ? (
                <>
                  <b>{painting.title}</b>
                  <span className="st-small st-muted" style={{ display: 'block' }}>
                    {painting.status === 'ready' ? 'The museum has made its copies.' : painting.status === 'failed' ? `Rejected: ${painting.error ?? 'unreadable image'}` : 'Processing: the museum is making its copies.'}
                  </span>
                </>
              ) : (
                <>
                  <b>{file ? file.name : 'Choose the painting'}</b>
                  <span className="st-small st-muted" style={{ display: 'block' }}>
                    {file ? `${file.width} × ${file.height}${Math.max(file.width, file.height) < 1200 ? ' · smaller than the 1200px the museum needs' : ''}` : 'JPEG, PNG, WebP, AVIF or TIFF, at least 1200px on the long edge, up to 25MB.'}
                  </span>
                  <input id="image" name="image" type="file" accept="image/*" required onChange={(event) => choose(event.target.files?.[0])} style={{ marginTop: 8, maxWidth: '100%' }} />
                </>
              )}
            </span>
          </label>

          <div className="st-sect">About it</div>
          <div className="st-field st-full">
            <label htmlFor="title">Title</label>
            <input id="title" name="title" required value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} />
          </div>
          <div className="st-field st-full">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" rows={5} value={description} onChange={(event) => setDescription(event.target.value)} minLength={20} required={!painting}
              placeholder="The story behind it, in your words. Shown on the plaque." />
            <span className="st-hint"><span>What a visitor reads standing in front of it. At least 20 characters.</span><span>{description.trim().length}</span></span>
          </div>

          <div className="st-sect">Links</div>
          <div className="st-field st-full">
            <label htmlFor="shopUrl">Buy a print</label>
            <input id="shopUrl" name="shopUrl" type="url" placeholder="https://…" value={shopUrl} onChange={(event) => setShopUrl(event.target.value)} />
            <span className="st-hint"><span>Where the “Shop print” button goes. Leave empty to hide it.</span></span>
          </div>
          <div className="st-field st-full">
            <label htmlFor="wallpaperUrl">Wallpaper download</label>
            <input id="wallpaperUrl" name="wallpaperUrl" type="url" placeholder="https://…" value={wallpaperUrl} onChange={(event) => setWallpaperUrl(event.target.value)} />
            <span className="st-hint"><span>Where “Get wallpaper” goes, e.g. a Buy Me a Coffee page. Leave empty to hide it.</span></span>
          </div>

          {error ? <p className="notice bad st-full" role="alert">{error}</p> : null}
          <div className="st-full st-actions">
            <button className="st-btn primary" type="submit" disabled={busy}>{painting ? 'Save' : PHASE_LABEL[phase]}</button>
          </div>
        </form>
      </section>

      <aside className="st-preview">
        <div className="st-small st-muted" style={{ fontWeight: 800 }}>What visitors see</div>
        <div className="st-preview-wall">
          <Frame imageUrl={imageUrl} aspect={aspect} height={aspect && aspect > 1.05 ? 150 : 212} title={title || 'Your painting'} empty="your painting" />
          <div className="st-wall-floor" />
        </div>
        <div className="st-plaque-card">
          <h3>{title || 'Title'}</h3>
          <p className={description ? undefined : 'st-muted'}>{description || 'Your description shows here.'}</p>
          <div className="st-cta">
            {isLink(shopUrl) ? <span>Shop print</span> : null}
            {isLink(wallpaperUrl) ? <span style={{ background: '#fff1d2', boxShadow: '0 3px 0 #e0c79c' }}>Get wallpaper</span> : null}
          </div>
        </div>
        <section className="st-card" style={{ padding: '16px 18px' }}>
          <b>Ready to hang?</b>
          <ul className="st-checks">
            {checks.map(([ok, label]) => <li key={label}><span className={ok ? 'y' : 'n'} aria-label={ok ? 'done' : 'missing'}>{ok ? '✓' : '✗'}</span> {label}</li>)}
          </ul>
        </section>
      </aside>
    </>
  )
}
