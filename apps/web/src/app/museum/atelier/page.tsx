import type { Metadata } from 'next'
import Atelier from '@/features/hall/components/Atelier'

export const metadata: Metadata = { title: 'The Costume Atelier' }

export default function AtelierPage() {
  return <Atelier />
}
