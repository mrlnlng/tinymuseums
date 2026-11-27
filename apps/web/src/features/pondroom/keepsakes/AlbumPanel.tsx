'use client'

import { useEffect, useState } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { deletePondPhoto, fetchPondPhotos, type PondPhoto } from '../lib/pond-api'
import { openCamera } from './camera-events'

const ALBUM_SIZE = 24

export default function AlbumPanel({ hasCamera }: { hasCamera: boolean }) {
  const { play } = useSound()
  const [photos, setPhotos] = useState<PondPhoto[] | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'guest' | 'error'>('loading')
  const [confirming, setConfirming] = useState<string | null>(null)

  useEffect(() => {
    let live = true
    void fetchPondPhotos().then((result) => {
      if (!live) return
      if (result.ok) {
        setPhotos(result.value)
        setStatus('ready')
      } else setStatus(result.status === 401 ? 'guest' : 'error')
    })
    return () => {
      live = false
    }
  }, [])

  async function remove(id: string) {
    const result = await deletePondPhoto(id)
    if (result.ok) {
      play('confirm')
      setPhotos((list) => list?.filter((photo) => photo.id !== id) ?? null)
    } else {
      play('error')
    }
    setConfirming(null)
  }

  if (status === 'loading') return <p className="pond-room-empty">Opening the album…</p>
  if (status === 'guest') return <p className="pond-room-note">Sign in to keep a photo album.</p>
  if (status === 'error') return <p className="pond-room-empty">The album could not be fetched just now.</p>

  return (
    <div className="pond-album">
      <p className="pond-album-count">
        {photos?.length ?? 0} / {ALBUM_SIZE} photos
      </p>
      <div className="pond-album-grid">
        {photos?.map((photo, index) => (
          <figure className="pond-album-photo" key={photo.id} style={{ rotate: `${[-2, 1.5, -1, 2][index % 4]}deg` }}>
            <img src={photo.url} alt={`Photo from ${new Date(photo.at).toLocaleDateString()}`} loading="lazy" />
            <figcaption>{new Date(photo.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</figcaption>
            {confirming === photo.id ? (
              <span className="pond-album-confirm">
                <button type="button" onClick={() => void remove(photo.id)}>Delete</button>
                <button type="button" onClick={() => setConfirming(null)}>Keep</button>
              </span>
            ) : (
              <button
                type="button"
                className="pond-album-delete"
                aria-label="Delete this photo"
                onClick={() => {
                  play('warning')
                  setConfirming(photo.id)
                }}
              >
                ✕
              </button>
            )}
          </figure>
        ))}
        {hasCamera ? (
          <button type="button" className="pond-album-photo is-new" onClick={() => openCamera('camera')}>
            <span aria-hidden="true">📷</span>
            Take a photo
          </button>
        ) : (
          <p className="pond-album-photo is-new">
            <span aria-hidden="true">📷</span>
            Find the camera in the pond to take photos
          </p>
        )}
      </div>
    </div>
  )
}
