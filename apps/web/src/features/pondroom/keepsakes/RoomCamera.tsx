'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useWallet } from '@/features/economy/hooks'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import AlbumPanel from './AlbumPanel'
import PondCamera from './PondCamera'
import { onOpenCamera, type CameraView } from './camera-events'

export const CAMERA_ITEM = 'keepsake:camera'

function AlbumOverlay({ onClose }: { onClose(): void }) {
  const ref = useModalFocus()
  useEscapeKey(onClose)
  return (
    <div className="pond-keepsake-dim" role="dialog" aria-modal="true" aria-labelledby="room-album-title">
      <div ref={ref} className="room-album">
        <header className="room-album-head">
          <h2 id="room-album-title">Photo album</h2>
          <button type="button" className="pond-keepsake-round is-quiet" onClick={onClose} aria-label="Close the album">
            ✕
          </button>
        </header>
        <div className="room-album-body">
          <AlbumPanel hasCamera />
        </div>
      </div>
    </div>
  )
}

/** Members who found the pond's camera can take pictures and leaf through them in any room. */
export default function RoomCamera() {
  const pathname = usePathname()
  const wallet = useWallet()
  const [view, setView] = useState<CameraView | null>(null)
  const allowed = wallet.isMember && wallet.items.includes(CAMERA_ITEM)

  useEffect(() => onOpenCamera(setView), [])
  useEffect(() => setView(null), [pathname])

  if (!allowed || view === null) return null
  if (view === 'album') return <AlbumOverlay onClose={() => setView(null)} />
  return <PondCamera onClose={() => setView(null)} onAlbum={() => setView('album')} />
}
