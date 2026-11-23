import type { Metadata } from 'next'
import PondRoom from '@/features/pondroom/PondRoom'
import { POND_NAME } from '@/features/pondroom/lib/identity'

export const metadata: Metadata = { title: POND_NAME }

export default async function PondPage({ searchParams }: { searchParams: Promise<{ from?: string }> }) {
  return <PondRoom from={(await searchParams).from ?? null} />
}
