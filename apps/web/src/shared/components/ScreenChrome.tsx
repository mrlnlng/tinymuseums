'use client'

import { usePathname, useRouter } from 'next/navigation'
import SoundToggle from '@/features/sound/components/SoundToggle'
import AssetImage from '@/shared/components/AssetImage'

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
          <AssetImage name="icon-home" />
        </button>
      ) : null}
      <SoundToggle />
    </div>
  )
}
