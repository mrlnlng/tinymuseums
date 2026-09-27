import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND } from '@tiny/core'
import MediaPreconnect from '@/shared/components/MediaPreconnect'
import { firstSlice } from '@/features/hall/lib/slice'
import AssetImage from '@/shared/components/AssetImage'

export const revalidate = 30

const GUIDELINES = [
  'Silence is not required — share your favourite pieces with your friends.',
  'There are no closing hours. Stay as long as you want.',
  'Touching the art, or zooming in to an unreasonable degree, is strictly encouraged.',
]

export default function LandingPage() {
  return (
    <main className="landing">
      <MediaPreconnect />
      <div className="landing-body">
        <div className="welcome-plaque">
          <span className="welcome-kicker">Welcome to</span>
          <h1 className="script welcome-title">{BRAND}</h1>
        </div>

        <section className="guidelines" aria-labelledby="guidelines-heading">
          <h2 id="guidelines-heading">Visitor&apos;s guidelines:</h2>
          <ol>
            {GUIDELINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <p className="open-line">The gallery floor is officially open. Enjoy!</p>
        </section>

      </div>

      <div className="landing-floor">
        <Link className="button" href="/museum" data-track="start_visit">
          Start visit
        </Link>
      </div>

      <AssetImage name="pedestal" className="landing-column" aria-hidden="true" />

      <div className="landing-visitor">
        <AssetImage name="bunny-right" className="visitor-bunny" aria-hidden="true" />
        <Link className="visitor-ticket" href="/museum" data-track="start_visit" aria-label="Start visit">
          <AssetImage name="ticket" aria-hidden="true" />
        </Link>
      </div>

      <Suspense fallback={null}>
        <CurrentlyShowing />
      </Suspense>
    </main>
  )
}

async function CurrentlyShowing() {
  const slice = await firstSlice(8)
  const showing = slice.slots.map((slot) => slot.display)

  return (
    <nav className="offscreen" aria-label="Artists currently showing">
      <h2>Currently showing</h2>
      {showing.length > 0 ? (
        <ul>
          {showing.map((display) => (
            <li key={display.artistId}>
              <Link href={`/a/${display.slug}`}>{display.artistName}</Link> — {display.statement}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nothing is hanging yet.</p>
      )}
      <p>
        <Link href="/studio/sign-in">Artists: sign in</Link>
      </p>
    </nav>
  )
}
