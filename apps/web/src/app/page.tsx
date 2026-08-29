import Link from 'next/link'
import { BRAND, ensureEpoch, getHallSlice } from '@tiny/core'

/**
 * The front door, laid out against mockup 1.
 *
 * A visitor arrives here rather than mid-corridor: the welcome plaque sets the
 * tone, the guidelines set expectations, and the two buttons on the floor are
 * the only choices — walk in, or claim a wall. Both go to a full screen of
 * their own; nothing expands in place, so this screen never scrolls.
 *
 * The artists at the bottom are in the document but not on screen. They give
 * the most linked-to page in the product real, crawlable content pointing at
 * every artist's own page, without pushing the layout around.
 */

export const dynamic = 'force-dynamic'

const GUIDELINES = [
  'Silence is not required — share your favourite pieces with your friends.',
  'There are no closing hours. Stay as long as you want.',
  'Touching the art, or zooming in to an unreasonable degree, is strictly encouraged.',
]

export default async function LandingPage() {
  const epoch = await ensureEpoch()
  const slice = epoch ? await getHallSlice(epoch.id, 0, 8) : null
  const showing = slice?.slots.map((slot) => slot.display) ?? []

  return (
    <main className="landing">
      <div className="landing-body">
        <div className="welcome-plaque">
          <span className="welcome-kicker">Welcome to</span>
          <h1 className="script welcome-title">{BRAND}</h1>
        </div>

        <section className="guidelines" aria-labelledby="guidelines-heading">
          <h2 id="guidelines-heading">Visitor&rsquo;s guidelines:</h2>
          <ol>
            {GUIDELINES.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>

        <p className="open-line">The gallery floor is officially open. Enjoy!</p>

        <div className="landing-props" aria-hidden="true">
          <img className="prop bunny" src="/assets/bunny.png" alt="" />
          <img className="prop ticket" src="/assets/ticket.png" alt="" />
          <img className="prop pedestal" src="/assets/pedestal.png" alt="" />
        </div>
      </div>

      <div className="landing-floor">
        <Link className="button" href="/museum">
          Start visit
        </Link>
        <Link className="button secondary" href="/studio/register">
          Claim a wall
        </Link>
      </div>

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
    </main>
  )
}
