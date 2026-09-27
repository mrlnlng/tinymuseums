'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { onOpenBugReport, watchErrors } from '@/features/feedback/lib/bug-report'

const BugReportSheet = dynamic(() => import('@/features/feedback/components/BugReportSheet'), { ssr: false })

export default function BugReportHost() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => watchErrors(), [])
  useEffect(() => onOpenBugReport(() => setIsOpen(true)), [])

  return isOpen ? <BugReportSheet onClose={() => setIsOpen(false)} /> : null
}
