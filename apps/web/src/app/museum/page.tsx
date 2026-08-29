import Link from 'next/link'
import { BRAND, ensureEpoch, getHallSlice, type HallSliceDto } from '@tiny/core'
import Museum from '@/components/Museum'

/**
 * The museum entrance.
 *
 * The first slice is rendered on the server so the hall has something to hang
 * the moment the canvas comes up, and so there is a real document underneath
 * the WebGL — the hidden index below is the crawlable, screen-reader surface
 * that justified server rendering in the first place.
 */

export const dynamic = 'force-dynamic'

const FIRST_SLICE = 4

export default async function MuseumPage() {
  const epoch = await ensureEpoch()
  const slice: HallSliceDto = epoch
    ? await getHallSlice(epoch.id, 0, FIRST_SLICE)
    : { epochId: 0, slots: [], nextIndex: null, totalSlots: 0 }

  if (slice.slots.length === 0) {
    return (
      <main className="page">
        <h1 className="script" style={{ fontSize: 44 }}>
          {BRAND} is empty
        </h1>
        <p>
          Nothing has been hung yet. The first artist to clear the publish bar gets the
          entrance to themselves.
        </p>
        <p>
          <Link className="button" href="/studio/register">
            Claim a wall
          </Link>
        </p>
      </main>
    )
  }

  return (
    <>
      <Museum initialSlice={slice} />

      <nav className="hall-index" aria-label="Artists in the museum">
        <h1>{BRAND}</h1>
        <ul>
          {slice.slots.map((slot) => (
            <li key={slot.index}>
              <Link href={`/a/${slot.display.slug}`}>{slot.display.artistName}</Link>
              {' — '}
              {slot.display.statement}
            </li>
          ))}
        </ul>
        <p>
          <Link href="/studio">Artists: claim a wall</Link>
        </p>
      </nav>
    </>
  )
}
