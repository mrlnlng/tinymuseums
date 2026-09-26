import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND } from '@tiny/core'
import MediaPreconnect from '@/shared/components/MediaPreconnect'
import Museum from '@/features/hall/components/Museum'
import HallSkeleton, { HallPreload } from '@/features/hall/components/HallSkeleton'
import { firstSlice } from '@/features/hall/lib/slice'

export const revalidate = 30

const FIRST_SLICE = 4

export default function MuseumPage() {
  return (
    <>
      <MediaPreconnect />
      <HallPreload />
      <Suspense fallback={<HallSkeleton />}>
        <Hall />
      </Suspense>
    </>
  )
}

async function Hall() {
  const slice = await firstSlice(FIRST_SLICE)

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
