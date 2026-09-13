'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import type { HallSliceDto } from '@tiny/core'
import GuestBoard from '@/features/guestboard/components/GuestBoard'
import PinnedNotes from '@/features/guestboard/components/PinnedNotes'
import { useGuestNotes } from '@/features/guestboard/hooks/useGuestNotes'
import CoinFound from '@/features/hall/components/CoinFound'
import HelpGuide from '@/features/hall/components/HelpGuide'
import { useHallScene, type OpenPiece } from '@/features/hall/hooks/useHallScene'
import { useSound } from '@/features/sound/components/SoundProvider'
import Walkthrough from '@/features/artwork/components/Walkthrough'
import { preloadFrames } from '@/features/artwork/lib/frame'

interface MuseumProps {
  initialSlice: HallSliceDto
}

export default function Museum({ initialSlice }: MuseumProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const guestBoardNotesRef = useRef<HTMLDivElement>(null)

  const [openPiece, setOpenPiece] = useState<OpenPiece | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isCoinOpen, setIsCoinOpen] = useState(false)
  const [isGuestBoardOpen, setIsGuestBoardOpen] = useState(false)
  const [isGuestBoardHung, setIsGuestBoardHung] = useState(false)

  const { notes: guestNotes } = useGuestNotes({ enabled: isGuestBoardHung, live: false })
  const { setWalking } = useSound()
  const router = useRouter()

  const isSuspended = openPiece !== null || isHelpOpen || isCoinOpen || isGuestBoardOpen

  const { isReady, error } = useHallScene({
    hosts: {
      canvas: canvasRef,
      overlay: overlayRef,
      character: characterRef,
      guestBoardNotes: guestBoardNotesRef,
    },
    initialSlice,
    isSuspended,
    onOpenPiece: setOpenPiece,
    onLeave: () => router.push('/'),
    onOpenHelp: () => setIsHelpOpen(true),
    onFindCoin: () => setIsCoinOpen(true),
    onOpenGuestBoard: () => setIsGuestBoardOpen(true),
    onGuestBoardHung: () => setIsGuestBoardHung(true),
  })

  useEffect(() => {
    if (isSuspended) setWalking(false)
  }, [isSuspended, setWalking])

  useEffect(() => {
    if (isReady) preloadFrames()
  }, [isReady])

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
      <div className="hall-guestboard-notes" ref={guestBoardNotesRef} aria-hidden="true">
        <PinnedNotes notes={guestNotes} />
      </div>
      <div className="hall-character" ref={characterRef} />

      <AnimatePresence>
        {isHelpOpen ? <HelpGuide key="help" onClose={() => setIsHelpOpen(false)} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {isCoinOpen ? <CoinFound key="coin" onClose={() => setIsCoinOpen(false)} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {isGuestBoardOpen ? (
          <GuestBoard key="guestboard" onClose={() => setIsGuestBoardOpen(false)} />
        ) : null}
      </AnimatePresence>

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
