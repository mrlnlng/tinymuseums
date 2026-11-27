'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useWallet } from '@/features/economy/hooks'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { KEEPSAKES, catchArt, ownedKeepsakes } from '../lib/journal'
import AlbumPanel from './AlbumPanel'
import PondCamera from './PondCamera'
import PondMusic from './PondMusic'
import { onOpenCamera, type CameraView } from './camera-events'

function AlbumOverlay({ onClose }: { onClose(): void }) {
  const { play } = useSound()
  const ref = useModalFocus()
  function close() {
    play('close')
    onClose()
  }
  useEffect(() => {
    play('open')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEscapeKey(close)
  return (
    <div className="pond-keepsake-dim" role="dialog" aria-modal="true" aria-labelledby="room-album-title">
      <div ref={ref} className="room-album">
        <header className="room-album-head">
          <h2 id="room-album-title">Photo album</h2>
          <button type="button" className="pond-keepsake-round is-quiet" onClick={close} aria-label="Close the album">
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

function ToolIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21.7 18.6 13.3 10.2a5.5 5.5 0 0 0-7-7.1l3.4 3.4-2.8 2.8-3.4-3.4a5.5 5.5 0 0 0 7.1 7l8.4 8.4a1.9 1.9 0 0 0 2.7 0l.1-.1a1.9 1.9 0 0 0 0-2.6Z"
      />
    </svg>
  )
}

/** Members' gadgets, found as the Basic and Fine sunken treasures, usable in every room. */
export default function Gadgets() {
  const pathname = usePathname()
  const { play } = useSound()
  const wallet = useWallet()
  const owned = wallet.isMember ? ownedKeepsakes(wallet.items) : []
  const [menu, setMenu] = useState(false)
  const [music, setMusic] = useState(false)
  const [view, setView] = useState<CameraView | null>(null)
  const host = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => onOpenCamera(setView), [])
  useEffect(() => {
    setView(null)
    setMenu(false)
  }, [pathname])
  useEscapeKey(() => {
    play('close')
    setMenu(false)
    toggle.current?.focus()
  }, menu)
  useEffect(() => {
    if (!menu) return
    const outside = (event: Event) => {
      if (event.target instanceof Node && !host.current?.contains(event.target)) setMenu(false)
    }
    document.addEventListener('pointerdown', outside, true)
    return () => document.removeEventListener('pointerdown', outside, true)
  }, [menu])

  if (owned.length === 0) return null
  const hasCamera = owned.includes('camera')

  function use(action: () => void) {
    setMenu(false)
    action()
  }

  return (
    <>
      {view === null ? (
        <div className="gadgets" ref={host}>
          {menu ? (
            <div id="gadget-menu" className="gadgets-menu" role="region" aria-label="Your gadgets">
              <p className="gadgets-heading">Gadgets</p>
              {KEEPSAKES.filter((item) => owned.includes(item.id)).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="gadgets-row"
                  onClick={() => use(() => (item.id === 'camera' ? setView('camera') : setMusic(true)))}
                >
                  <img src={catchArt(item)} alt="" />
                  <span>
                    <strong>{item.name}</strong>
                    <small>{item.action}</small>
                  </span>
                </button>
              ))}
              {hasCamera ? (
                <button type="button" className="gadgets-row" onClick={() => use(() => setView('album'))}>
                  <span className="gadgets-album" aria-hidden="true">
                    🖼
                  </span>
                  <span>
                    <strong>Photo album</strong>
                    <small>Your pictures</small>
                  </span>
                </button>
              ) : null}
            </div>
          ) : null}
          <button
            ref={toggle}
            type="button"
            className="gadgets-toggle"
            aria-label="Gadgets"
            title="Gadgets"
            aria-expanded={menu}
            aria-controls="gadget-menu"
            onClick={() => {
              play(menu ? 'close' : 'open')
              setMenu((open) => !open)
            }}
          >
            <ToolIcon />
          </button>
        </div>
      ) : null}
      {music ? <PondMusic onClose={() => setMusic(false)} /> : null}
      {view === 'camera' && hasCamera ? <PondCamera onClose={() => setView(null)} onAlbum={() => setView('album')} /> : null}
      {view === 'album' && hasCamera ? <AlbumOverlay onClose={() => setView(null)} /> : null}
    </>
  )
}
