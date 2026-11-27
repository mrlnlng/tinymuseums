'use client'

import { useEffect, useState } from 'react'
import { composeJpeg } from '@/features/rooms/snapshot'
import { useStage } from '@/features/rooms/MuseumStage'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { uploadPondPhoto } from '../lib/pond-api'

type Shot = { blob: Blob; url: string; at: Date; place: string }

const ERRORS: Record<string, string> = {
  album_full: 'Your album is full. Delete a photo in the journal to make room.',
  rate_limited: 'That is a lot of photos for one hour. Try again a little later.',
  signed_out: 'Sign in to keep photos in your album.',
}

function Polaroid({ shot, onRetake, onKept }: { shot: Shot; onRetake(): void; onKept(): void }) {
  const ref = useModalFocus()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEscapeKey(onRetake)

  async function keep() {
    setSaving(true)
    setError(null)
    const result = await uploadPondPhoto(shot.blob)
    setSaving(false)
    if (result.ok) onKept()
    else setError(ERRORS[result.error] ?? 'The photo could not be saved just now.')
  }

  return (
    <div className="pond-keepsake-dim" role="dialog" aria-modal="true" aria-label="Your photo">
      <div ref={ref} className="pond-keepsake-photo-wrap">
        <figure className="pond-keepsake-photo">
          <img src={shot.url} alt="Your picture of the pond" />
          <figcaption>
            {shot.place} · {shot.at.toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
          </figcaption>
        </figure>
        {error ? (
          <p className="pond-keepsake-error" role="alert">
            {error}
          </p>
        ) : null}
        <div className="pond-keepsake-photo-actions">
          <button type="button" className="pond-keepsake-button is-quiet" onClick={onRetake} disabled={saving}>
            Retake
          </button>
          <button type="button" className="pond-keepsake-button" onClick={keep} disabled={saving}>
            {saving ? 'Saving…' : 'Keep in album'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PondCamera({ onClose, onAlbum }: { onClose(): void; onAlbum(): void }) {
  const stage = useStage()
  const [shot, setShot] = useState<Shot | null>(null)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState(false)
  const [note, setNote] = useState<string | null>(null)
  useEscapeKey(onClose, shot === null)

  useEffect(() => () => {
    if (shot) URL.revokeObjectURL(shot.url)
  }, [shot])

  async function snap() {
    if (!stage || busy) return
    setBusy(true)
    setNote(null)
    setFlash(true)
    const grab = await stage.capture()
    const blob = grab ? await composeJpeg(grab) : null
    setFlash(false)
    setBusy(false)
    if (blob) setShot({ blob, url: URL.createObjectURL(blob), at: new Date(), place: document.title })
    else setNote('The camera could not focus. Try again.')
  }

  return (
    <>
      <div className="pond-keepsake-viewfinder" role="region" aria-label="Camera">
        <span className="pond-keepsake-corners" aria-hidden="true" />
        <span className="pond-keepsake-rec" aria-hidden="true">
          TINY ●
        </span>
        {note ? (
          <p className="pond-keepsake-note" role="status">
            {note}
          </p>
        ) : null}
        <div className="pond-keepsake-shutter-row">
          <button type="button" className="pond-keepsake-round is-quiet" onClick={onClose} aria-label="Put the camera away">
            ✕
          </button>
          <button type="button" className="pond-keepsake-shutter" onClick={snap} disabled={busy} aria-label="Take a picture" />
          <button type="button" className="pond-keepsake-round is-quiet" onClick={onAlbum} aria-label="Open the photo album">
            <span aria-hidden="true">🖼</span>
          </button>
        </div>
      </div>
      {flash ? <span className="pond-keepsake-flash" aria-hidden="true" /> : null}
      {shot ? (
        <Polaroid
          shot={shot}
          onRetake={() => setShot(null)}
          onKept={() => {
            setShot(null)
            setNote('Kept in your album ✓')
          }}
        />
      ) : null}
    </>
  )
}
