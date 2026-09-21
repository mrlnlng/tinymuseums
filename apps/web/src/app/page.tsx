import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND } from '@tiny/core'
import { firstSlice } from '@/features/hall/lib/slice'

export const dynamic = 'force-dynamic'

const GUIDELINES = [
  'Silence is not required — share your favourite pieces with your friends.',
  'There are no closing hours. Stay as long as you want.',
  'Touching the art, or zooming in to an unreasonable degree, is strictly encouraged.',
]

export default function LandingPage() {
  return (
    <main className="landing">
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
        <Link className="button" href="/museum">
          Start visit
        </Link>
      </div>

      <img className="landing-column" src="/assets/pedestal.png" alt="" aria-hidden="true" />

      <div className="landing-visitor">
        <img className="visitor-bunny" src="/assets/bunny-right.png" alt="" aria-hidden="true" />
        <Link className="visitor-ticket" href="/museum" aria-label="Start visit">
          <img src="/assets/ticket.png" alt="" aria-hidden="true" />
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
