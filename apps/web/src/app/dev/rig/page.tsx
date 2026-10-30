import { notFound } from 'next/navigation'
import RigPreview from '@/features/hall/components/RigPreview'

export default function RigPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <RigPreview />
}
