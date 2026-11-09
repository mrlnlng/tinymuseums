import type { Metadata } from 'next'
import PondRoom from '@/features/pondroom/PondRoom'
import { POND_NAME } from '@/features/pondroom/lib/identity'

export const metadata: Metadata = { title: POND_NAME }

export default function PondPage() {
  return <PondRoom />
}
