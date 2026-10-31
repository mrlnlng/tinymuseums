import { notFound } from 'next/navigation'
import CrowdPreview from '@/features/hall/components/CrowdPreview'

export default function CrowdPreviewPage() {
  if (process.env.NODE_ENV !== 'development') notFound()
  return <CrowdPreview />
}
