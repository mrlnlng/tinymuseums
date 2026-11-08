import type { Metadata } from 'next'
import PondRoom from '@/features/pondroom/PondRoom'

export const metadata: Metadata = { title: 'The Moonlit Pond' }

export default function PondPage() {
  return <PondRoom />
}
