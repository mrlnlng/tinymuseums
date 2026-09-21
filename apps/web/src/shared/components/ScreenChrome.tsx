'use client'

import { usePathname, useRouter } from 'next/navigation'
import SoundToggle from '@/features/sound/components/SoundToggle'

export default function ScreenChrome() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname.startsWith('/studio')) return null

  const showHome = pathname !== '/'

  return (
    <div className="screen-chrome">
      {showHome ? (
        <button
          type="button"
          className="chrome-button"
          onClick={() => router.push('/')}
          aria-label="Back to the entrance"
          title="Back to the entrance"
        >
          <img src="/assets/icon-home.webp" alt="" />
        </button>
      ) : null}
      <SoundToggle />
    </div>
  )
}
