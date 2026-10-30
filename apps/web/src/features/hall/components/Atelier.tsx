'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import AtelierLoading from '@/features/hall/components/AtelierLoading'
import { useAtelierScene } from '@/features/hall/hooks/useAtelierScene'

export default function Atelier() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const { isReady, error } = useAtelierScene({
    hosts: { canvas: canvasRef, overlay: overlayRef, character: characterRef },
    onLeave: () => router.push('/museum?from=atelier'),
  })

  if (error) {
    return (
      <div className="museum atelier">
        <p className="hall-error" role="alert">
          The atelier could not open. <Link href="/museum">Back to the museum</Link>
        </p>
      </div>
    )
  }

  return (
    <div className="museum atelier">
      <div className="hall-host" ref={canvasRef} />
      <div className="hall-overlay" ref={overlayRef} />
      <div className="hall-character" ref={characterRef} />
      <AnimatePresence>{isReady ? null : <AtelierLoading key="loading" />}</AnimatePresence>
    </div>
  )
}
