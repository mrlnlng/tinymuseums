import { notFound } from 'next/navigation'
import PresencePreview from '@/features/presence/components/PresencePreview'

export default function PresencePreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <PresencePreview />
}
