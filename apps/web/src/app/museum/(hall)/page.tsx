import { Suspense } from 'react'
import Link from 'next/link'
import { BRAND } from '@tiny/core'
import MediaPreconnect from '@/shared/components/MediaPreconnect'
import Museum from '@/features/hall/components/Museum'
import HallSkeleton, { HallPreload } from '@/features/hall/components/HallSkeleton'
import { firstSlice } from '@/features/hall/lib/slice'

export const dynamic = 'force-dynamic'

const FIRST_SLICE = 4

export default async function MuseumPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  // Coming through one of the hall's doors, the visitor steps out of it instead of in at the front.
  const arrival = (await searchParams).from ?? null
  return (
    <>
      <MediaPreconnect />
      <HallPreload />
      <Suspense fallback={<HallSkeleton />}>
        <Hall arrival={arrival} />
      </Suspense>
    </>
  )
}

async function Hall({ arrival }: { arrival: string | null }) {
  const slice = await firstSlice(FIRST_SLICE)

  return (
    <>
      <Museum initialSlice={slice} arrival={arrival} />

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
          <Link href="/studio">Studio</Link>
        </p>
      </nav>
    </>
  )
}
