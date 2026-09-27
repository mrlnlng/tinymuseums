'use client'

import { usePathname, useRouter } from 'next/navigation'
import SoundToggle from '@/features/sound/components/SoundToggle'
import AssetImage from '@/shared/components/AssetImage'
import { openBugReport } from '@/features/feedback/lib/bug-report'

export default function ScreenChrome() {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname.startsWith('/studio')) return null

  const showHome = pathname !== '/'
  const showReport = pathname === '/' || pathname === '/museum'

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
      {showReport ? (
        <button
          type="button"
          className="chrome-button bug-toggle"
          data-track="bug_report"
          onClick={openBugReport}
          aria-label="Report a problem"
          title="Report a problem"
        >
          <svg viewBox="0 0 75 75" aria-hidden="true">
            <mask id="bug-toggle-cutout">
              <rect width="75" height="75" fill="white" />
              <path
                d="M26,19 H49 A10,10 0 0 1 59,29 V39 A10,10 0 0 1 49,49 H36 L25,58 L27,49 H26 A10,10 0 0 1 16,39 V29 A10,10 0 0 1 26,19z"
                fill="black"
              />
              <circle cx="28.5" cy="34" r="3.4" fill="white" />
              <circle cx="37.5" cy="34" r="3.4" fill="white" />
              <circle cx="46.5" cy="34" r="3.4" fill="white" />
            </mask>
            <circle cx="37.5" cy="37.5" r="37.5" mask="url(#bug-toggle-cutout)" />
          </svg>
        </button>
      ) : null}
      <SoundToggle />
    </div>
  )
}
