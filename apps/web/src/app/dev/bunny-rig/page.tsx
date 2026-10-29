import { notFound } from 'next/navigation'
import BunnyRigPreview from '@/features/hall/components/BunnyRigPreview'

export default function BunnyRigPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <BunnyRigPreview />
}
