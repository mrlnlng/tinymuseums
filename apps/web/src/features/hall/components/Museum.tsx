'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { HallSliceDto } from '@tiny/core'
import { useHallScene, type OpenPiece } from '@/features/hall/hooks/useHallScene'
import { useSound } from '@/features/sound/components/SoundProvider'
import Walkthrough from '@/features/artwork/components/Walkthrough'

/* The hall: Three.js draws the room and the plaque text is real DOM projected over it; useHallScene owns the scene, this component is the markup it draws into plus the enlarged view. */

interface MuseumProps {
  initialSlice: HallSliceDto
}

export default function Museum({ initialSlice }: MuseumProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)

  const [openPiece, setOpenPiece] = useState<OpenPiece | null>(null)
  const { setWalking } = useSound()

  const { isReady, error } = useHallScene({
    hosts: { canvas: canvasRef, overlay: overlayRef, character: characterRef },
    initialSlice,
    isSuspended: openPiece !== null,
    onOpenPiece: setOpenPiece,
  })

  // Opening a work stops the hall, so it must stop the footsteps too.
  useEffect(() => {
    if (openPiece !== null) setWalking(false)
  }, [openPiece, setWalking])

  /* A failed load renders the message instead of the hall — it used to render inside the container that stays at opacity 0 until the hall is ready, so the only report of the failure was invisible. */
  if (error) {
    return (
      <div className="museum">
        <p className="hall-error" role="alert">
          {error}
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="museum"
      initial={{ opacity: 0 }}
      animate={{ opacity: isReady ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hall-host" ref={canvasRef} />
      <div className="hall-overlay" ref={overlayRef} />
      {/* Above the plaques, so the visitor is never painted over. */}
      <div className="hall-character" ref={characterRef} />

      <AnimatePresence>
        {openPiece ? (
          <Walkthrough
            key="walkthrough"
            slug={openPiece.slug}
            artistId={openPiece.artistId}
            initialPieceId={openPiece.pieceId}
            onClose={() => setOpenPiece(null)}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
