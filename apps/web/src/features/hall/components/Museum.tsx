'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import type { HallSliceDto } from '@tiny/core'
import PinnedNotes from '@/features/guestboard/components/PinnedNotes'
import { useGuestNotes } from '@/features/guestboard/hooks/useGuestNotes'
import HallSkeleton from '@/features/hall/components/HallSkeleton'
import SwipeHint, { claimSwipeHint } from '@/features/hall/components/SwipeHint'
import type { PreparedGame } from '@/features/sketchguess/components/SketchGuess'
import { useHallScene, type OpenPiece } from '@/features/hall/hooks/useHallScene'
import { useHallGame, type HallGameOptions } from '@/features/hall/hooks/useHallGame'
import { useSound } from '@/features/sound/components/SoundProvider'
import { preloadFrames } from '@/features/artwork/lib/frame'
import { MUSEUM_START_MARK } from '@/shared/lib/vitals-marks'

const loadGuestBoard = () => import('@/features/guestboard/components/GuestBoard')
const loadCoinFound = () => import('@/features/hall/components/CoinFound')
const loadHelpGuide = () => import('@/features/hall/components/HelpGuide')
const loadWalkthrough = () => import('@/features/artwork/components/Walkthrough')
const loadSketchGuess = () => import('@/features/sketchguess/components/SketchGuess')

const GuestBoard = dynamic(loadGuestBoard, { ssr: false })
const CoinFound = dynamic(loadCoinFound, { ssr: false })
const HelpGuide = dynamic(loadHelpGuide, { ssr: false })
const Walkthrough = dynamic(loadWalkthrough, { ssr: false })
const SketchGuess = dynamic(loadSketchGuess, { ssr: false })

type EngineHostProps = Omit<HallGameOptions, 'enabled'> & {
  onState: (isReady: boolean, error: string | null) => void
}

function ThreeHost({ onState, ...options }: EngineHostProps) {
  const { isReady, error } = useHallScene(options)

  useEffect(() => {
    onState(isReady, error)
  }, [isReady, error, onState])

  return null
}

function PhaserHost({ onState, ...options }: EngineHostProps) {
  const { isReady, error } = useHallGame({ ...options, enabled: true })

  useEffect(() => {
    onState(isReady, error)
  }, [isReady, error, onState])

  return null
}

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
  const [sketchGame, setSketchGame] = useState<PreparedGame | null>(null)
  const [isSketchOpen, setIsSketchOpen] = useState(false)
  const [sketchSession, setSketchSession] = useState(0)
  const hideHint = useCallback(() => setIsHintShown(false), [])

  useEffect(() => {
    performance.mark(MUSEUM_START_MARK)
  }, [])

  const { notes: guestNotes } = useGuestNotes({ enabled: isGuestBoardHung, live: false })
  const { setWalking } = useSound()
  const router = useRouter()

  const searchParams = useSearchParams()
  const engine = searchParams.get('engine') === 'phaser' ? 'phaser' : 'three'
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handleEngineState = useCallback((ready: boolean, nextError: string | null) => {
    setIsReady(ready)
    setError(nextError)
  }, [])

  const isSuspended =
    openPiece !== null || isHelpOpen || isCoinOpen || isGuestBoardOpen || isSketchOpen

  const hostProps = {
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
    onOpenSketchGame: () => {
      setSketchSession((n) => n + 1)
      setIsSketchOpen(true)
    },
    onState: handleEngineState,
  }

  useEffect(() => {
    if (!isGuestBoardHung || sketchGame || isSketchOpen) return
    const controller = new AbortController()
    loadSketchGuess()
      .then(({ prepareSketchGame }) => prepareSketchGame(initialSlice.epochId, controller.signal))
      .then((game) => {
        if (!controller.signal.aborted) setSketchGame(game)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [isGuestBoardHung, sketchGame, isSketchOpen, initialSlice.epochId])

  const closeSketchGuess = useCallback(() => {
    setIsSketchOpen(false)
    setSketchGame(null)
  }, [])

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
          <PinnedNotes notes={guestNotes} avoidSitArea />
        </div>
        <div className="hall-character" ref={characterRef} />

        {engine === 'phaser' ? <PhaserHost {...hostProps} /> : <ThreeHost {...hostProps} />}

        <AnimatePresence>
          {isHintShown ? <SwipeHint key="swipe-hint" onDone={hideHint} /> : null}
        </AnimatePresence>

        <AnimatePresence>
          {isSketchOpen ? (
            <SketchGuess
              key={`sketch-guess-${sketchSession}`}
              epochId={initialSlice.epochId}
              prepared={sketchGame}
              onClose={closeSketchGuess}
            />
          ) : null}
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
