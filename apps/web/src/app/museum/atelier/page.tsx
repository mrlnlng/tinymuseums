import type { Metadata } from 'next'
import { spotPaintings, type SpotPainting } from '@tiny/core'
import Atelier from '@/features/hall/components/Atelier'

export const metadata: Metadata = { title: 'The Costume Atelier' }
export const dynamic = 'force-dynamic'

export default async function AtelierPage() {
  // A frame with nothing published, or a database that cannot be reached, shows its placeholder.
  let spots: Record<string, SpotPainting> = {}
  try {
    spots = await spotPaintings('atelier')
  } catch (error) {
    console.error('atelier spots', error)
  }
  return <Atelier spots={spots} />
}
