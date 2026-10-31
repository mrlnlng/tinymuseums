'use client'

import { usePathname, useRouter } from 'next/navigation'
import SettingsMenu from './SettingsMenu'
import AssetImage from '@/shared/components/AssetImage'
import ChatButton from '@/features/presence/components/ChatButton'

export default function ScreenChrome() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname.startsWith('/studio')) return null

  const showHome = pathname !== '/'
  const showChat = pathname === '/' || pathname === '/museum' || pathname === '/museum/atelier'
  // The atelier's walls are dark maroon, where the pink buttons would disappear.
  const onDark = pathname === '/museum/atelier'

  return (
    <>
      <div className={onDark ? 'screen-chrome screen-chrome--on-dark' : 'screen-chrome'}>
        {showHome ? (
          <button
            type="button"
            className="chrome-button"
            onClick={() => router.push('/')}
            aria-label="Back to the entrance"
            title="Back to the entrance"
          >
            <AssetImage name="icon-home" />
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
