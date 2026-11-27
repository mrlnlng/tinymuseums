'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { onOpenBugReport, watchErrors } from '@/features/feedback/lib/bug-report'
import { useSound } from '@/features/sound/components/SoundProvider'

const BugReportSheet = dynamic(() => import('@/features/feedback/components/BugReportSheet'), { ssr: false })

export default function BugReportHost() {
  const [isOpen, setIsOpen] = useState(false)
  const { play } = useSound()

  useEffect(() => watchErrors(), [])
  useEffect(
    () =>
      onOpenBugReport(() => {
        setIsOpen(true)
        play('open')
      }),
    [play],
  )

  return isOpen ? (
    <BugReportSheet
      onClose={() => {
        play('close')
        setIsOpen(false)
      }}
    />
  ) : null
}
