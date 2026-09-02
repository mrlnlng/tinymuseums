'use client'

import { usePathname, useRouter } from 'next/navigation'
import SoundToggle from '@/features/sound/components/SoundToggle'

/*  The icon pair in the screen's top-right corner, as the mockups have it: home, then the speaker. Rendered once in the root layout so it sits in the same place on every screen.

    Its entrance is a CSS animation rather than a Motion one, and that is a size decision rather than a taste one: this component is rendered by the root layout, so whatever it imports is loaded by every page in the museum. Motion was therefore in the first load of the landing page, the studio and every route handler's client bundle — about 35kB to slide two icons down by twenty pixels once. Motion still runs the surfaces that genuinely need it, and now only those pages pay for it. */
export default function ScreenChrome() {
  const pathname = usePathname()
  const router = useRouter()

  // The studio has its own topbar with real navigation; floating icons over
  // its forms would just be noise.
  if (pathname.startsWith('/studio')) return null

  // On the landing page home would point at the page you are already on.
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
          <img src="/assets/icon-home.png" alt="" />
        </button>
      ) : null}
      <SoundToggle />
    </div>
  )
}
