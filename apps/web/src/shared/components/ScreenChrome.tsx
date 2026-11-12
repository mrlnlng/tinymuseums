'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import SettingsMenu from './SettingsMenu'
import AssetImage from '@/shared/components/AssetImage'
import ChatButton from '@/features/presence/components/ChatButton'

export default function ScreenChrome() {
  const pathname = usePathname()
  const router = useRouter()
  const [leaving, setLeaving] = useState(false)
  const [isPending, startTransition] = useTransition()
  const wasPending = useRef(false)

  // One trip at a time: repeat taps while the next page loads are ignored, not queued.
  useEffect(() => {
    if (isPending) wasPending.current = true
    else if (wasPending.current) {
      wasPending.current = false
      setLeaving(false)
    }
  }, [isPending])
  useEffect(() => setLeaving(false), [pathname])

  function go(href: string): void {
    if (leaving || href === pathname) return
    setLeaving(true)
    startTransition(() => router.push(href))
  }

  if (pathname.startsWith('/studio')) return null

  const showHome = pathname !== '/'
  const showMyRoom = pathname === '/museum'
  const showChat = pathname === '/' || pathname === '/museum' || pathname === '/museum/atelier'

  return (
    <>
      {leaving && pathname === '/museum' ? (
        // Leaving the hall, its stage curtain closes; the next room's loading curtain then opens.
        <div className="screen-leaving is-curtain" aria-hidden="true">
          <div className="hall-skeleton-drape is-left" />
          <div className="hall-skeleton-drape is-right" />
        </div>
      ) : leaving ? (
        <div className="screen-leaving" aria-hidden="true" />
      ) : null}
      <div className="screen-chrome">
        {showHome ? (
          <button
            type="button"
            className="chrome-button"
            onClick={() => go('/')}
            disabled={leaving}
            aria-label="Back to the entrance"
            title="Back to the entrance"
          >
            <AssetImage name="icon-home" />
          </button>
        ) : null}
        {showMyRoom ? (
          <button
            type="button"
            className="chrome-button"
            onClick={() => go('/museum/home')}
            disabled={leaving}
            aria-label="My room"
            title="My room"
          >
            <svg viewBox="0 0 75 75" aria-hidden="true">
              <mask id="my-room-toggle-cutout">
                <rect width="75" height="75" fill="white" />
                <rect x="15" y="23" width="7" height="33" rx="3.5" fill="black" />
                <rect x="53" y="38" width="7" height="18" rx="3.5" fill="black" />
                <rect x="15" y="41" width="45" height="9" rx="3" fill="black" />
                <rect x="25" y="31" width="13" height="8" rx="4" fill="black" />
                <path fill="black" d="M41 39v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2Z" />
              </mask>
              <circle cx="37.5" cy="37.5" r="37.5" fill="#c22252" mask="url(#my-room-toggle-cutout)" />
            </svg>
          </button>
        ) : null}
        <SettingsMenu />
      </div>
      {showChat ? (
        <div className="chat-dock">
          <ChatButton />
        </div>
      ) : null}
    </>
  )
}
