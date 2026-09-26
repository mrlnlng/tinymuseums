'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import type { HallSliceDto } from '@tiny/core'
import PinnedNotes from '@/features/guestboard/components/PinnedNotes'
import { useGuestNotes } from '@/features/guestboard/hooks/useGuestNotes'
import HallSkeleton from '@/features/hall/components/HallSkeleton'
import SwipeHint, { claimSwipeHint } from '@/features/hall/components/SwipeHint'
import { useHallScene, type OpenPiece } from '@/features/hall/hooks/useHallScene'
import { useSound } from '@/features/sound/components/SoundProvider'
import { preloadFrames } from '@/features/artwork/lib/frame'

const loadGuestBoard = () => import('@/features/guestboard/components/GuestBoard')
const loadCoinFound = () => import('@/features/hall/components/CoinFound')
const loadHelpGuide = () => import('@/features/hall/components/HelpGuide')
const loadWalkthrough = () => import('@/features/artwork/components/Walkthrough')

const GuestBoard = dynamic(loadGuestBoard, { ssr: false })
const CoinFound = dynamic(loadCoinFound, { ssr: false })
const HelpGuide = dynamic(loadHelpGuide, { ssr: false })
const Walkthrough = dynamic(loadWalkthrough, { ssr: false })

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
  const [isHintShown, setIsHintShown] = useState(false)
  const hideHint = useCallback(() => setIsHintShown(false), [])

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
    onIntroDone: () => setIsHintShown(claimSwipeHint()),
    onFirstMove: hideHint,
  })

  useEffect(() => {
    if (!isSuspended) return
    setWalking(false)
    setIsHintShown(false)
  }, [isSuspended, setWalking])

  useEffect(() => {
    if (!isReady) return
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 4000))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(
      () => {
        preloadFrames()
        void Promise.all([loadGuestBoard(), loadCoinFound(), loadHelpGuide(), loadWalkthrough()])
      },
      { timeout: 15000 },
    )
    return () => cancel(handle as number)
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
    <>
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
          {isHintShown ? <SwipeHint key="swipe-hint" onDone={hideHint} /> : null}
        </AnimatePresence>

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

      <AnimatePresence>
        {isReady ? null : (
          <motion.div
            key="curtain"
            className="hall-curtain"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <HallSkeleton preload={false} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
