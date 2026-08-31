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
  const slice = epoch ? await getHallSlice(epoch, 0, 8) : null
  const showing = slice?.slots.map((slot) => slot.display) ?? []

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
          {/* On the note rather than below it, where the mockup has it. */}
          <p className="open-line">The gallery floor is officially open. Enjoy!</p>
        </section>

      </div>

      <div className="landing-floor">
        <Link className="button" href="/museum">
          Start visit
        </Link>
      </div>

      {/*
        The visitor stands in front of the floor rather than above it, so it
        overlaps the boundary and reads as standing on the boards. It is the
        last child and outside both bands for that reason: stacking, not order.
      */}
      {/*
        The column at the right edge, as in the mockup: standing on the boards,
        running off the side of the screen. Behind the visitor and inert.
      */}
      <img className="landing-column" src="/assets/pedestal.png" alt="" aria-hidden="true" />

      <div className="landing-visitor">
        <img className="visitor-bunny" src="/assets/bunny-right.png" alt="" aria-hidden="true" />
        {/*
          The ticket is a way in, not decoration. It is a real link so it works
          by keyboard and reads as a control, and it carries its own label —
          "Free entry" is drawn into the image, where no reader can reach it.
        */}
        <Link className="visitor-ticket" href="/museum" aria-label="Start visit">
          <img src="/assets/ticket.png" alt="" aria-hidden="true" />
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
