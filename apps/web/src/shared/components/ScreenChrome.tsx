'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import SettingsMenu from './SettingsMenu'
import AssetImage from '@/shared/components/AssetImage'
import ChatButton from '@/features/presence/components/ChatButton'
import { useInOwnRoom } from '@/shared/lib/own-room'

export default function ScreenChrome() {
  const pathname = usePathname()
  const inOwnRoom = useInOwnRoom()
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

  // The house is the visitor's own room, from anywhere in the museum but that room itself; the
  // entrance (the landing page) is a row in the settings.
  const showMyRoom = pathname.startsWith('/museum') && pathname !== '/museum/home' && !inOwnRoom
  // ChatButton hides itself unless the page shares a room, so every museum room can offer it.
  const showChat = pathname === '/' || pathname.startsWith('/museum')

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
        {showMyRoom ? (
          <button
            type="button"
            className="chrome-button"
            onClick={() => go('/museum/home')}
            disabled={leaving}
            aria-label="My room"
            title="My room"
          >
            <AssetImage name="icon-home" />
          </button>
        ) : null}
        <SettingsMenu onEntrance={pathname === '/' ? null : () => go('/')} />
      </div>
      {showChat ? (
        <div className="chat-dock">
          <ChatButton />
        </div>
      ) : null}
    </>
  )
}
