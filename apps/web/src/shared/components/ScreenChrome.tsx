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
  // The atelier's walls are dark maroon, where the pink buttons would disappear.
  const onDark = pathname === '/museum/atelier'

  return (
    <>
      {leaving ? <div className="screen-leaving" aria-hidden="true" /> : null}
      <div className={onDark ? 'screen-chrome screen-chrome--on-dark' : 'screen-chrome'}>
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
                <path fill="black" d="M25 58V21L47 16V58Z" />
                <rect x="40" y="34" width="23" height="24" fill="black" />
                <circle cx="45" cy="46" r="2.4" fill="white" />
              </mask>
              <circle cx="37.5" cy="37.5" r="37.5" mask="url(#my-room-toggle-cutout)" />
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
