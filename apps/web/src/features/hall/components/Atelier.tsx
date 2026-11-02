'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import { outfit, restamp } from '@tiny/core/slots'
import AtelierKeeps from '@/features/hall/components/AtelierKeeps'
import AtelierLoading from '@/features/hall/components/AtelierLoading'
import { useAtelierScene } from '@/features/hall/hooks/useAtelierScene'
import { lookOf, ownedLook, shouldRewriteOutfit } from '@/features/hall/scene/wardrobe'
import { useWallet } from '@/features/economy'
import { useSlot } from '@/shared/lib/slots'

export default function Atelier() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const wallet = useWallet()
  const [outfitDoc, updateOutfit] = useSlot(outfit)

  function leave(): void {
    const current = lookOf(outfitDoc)
    if (shouldRewriteOutfit(current, wallet)) {
      const next = ownedLook(current, wallet)
      updateOutfit((value) => ({
        ...value,
        character: restamp(value.character, next.kind),
        costume: restamp(value.costume, next.costume),
        bow: restamp(value.bow, next.bow),
      }))
      try {
        window.sessionStorage.setItem('tm:economy:unkept', '1')
      } catch {}
    }
    router.push('/museum?from=atelier')
  }

  const { isReady, error } = useAtelierScene({
    hosts: { canvas: canvasRef, overlay: overlayRef, character: characterRef },
    onLeave: leave,
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
      <AtelierKeeps />
      <AnimatePresence>{isReady ? null : <AtelierLoading key="loading" />}</AnimatePresence>
    </div>
  )
}
