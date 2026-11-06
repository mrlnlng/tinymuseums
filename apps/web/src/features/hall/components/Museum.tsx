'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import type { HallSliceDto } from '@tiny/core'
import PinnedNotes from '@/features/guestboard/components/PinnedNotes'
import { useGuestNotes } from '@/features/guestboard/hooks/useGuestNotes'
import AtelierLoading from '@/features/hall/components/AtelierLoading'
import HallSkeleton from '@/features/hall/components/HallSkeleton'
import SwipeHint, { claimSwipeHint } from '@/features/hall/components/SwipeHint'
import type { PreparedGame } from '@/features/sketchguess/components/SketchGuess'
import type { MinigameId } from '@/features/minigames/registry'
import { createHallRoom, type HallCallbacks, type OpenPiece } from '@/features/rooms/hall/room'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import type { HallRoomData } from '@/features/rooms/decorate/HallArranger'
import type { DoorRef } from '@/features/rooms/types'
import { useSound } from '@/features/sound/components/SoundProvider'
import { preloadFrames } from '@/features/artwork/lib/frame'
import { MUSEUM_START_MARK } from '@/shared/lib/vitals-marks'

const loadGuestBoard = () => import('@/features/guestboard/components/GuestBoard')
const loadCoinFound = () => import('@/features/hall/components/CoinFound')
const loadHelpGuide = () => import('@/features/hall/components/HelpGuide')
const loadWalkthrough = () => import('@/features/artwork/components/Walkthrough')
const loadSketchGuess = () => import('@/features/sketchguess/components/SketchGuess')
const loadGameDesktop = () => import('@/features/minigames/components/GameDesktop')
const loadColorRecall = () => import('@/features/colorgame/components/ColorRecall')
const loadPondGame = () => import('@/features/pondgame/components/PondGame')
const loadHallArranger = () => import('@/features/rooms/decorate/HallArranger')

const GuestBoard = dynamic(loadGuestBoard, { ssr: false })
const CoinFound = dynamic(loadCoinFound, { ssr: false })
const HelpGuide = dynamic(loadHelpGuide, { ssr: false })
const Walkthrough = dynamic(loadWalkthrough, { ssr: false })
const SketchGuess = dynamic(loadSketchGuess, { ssr: false })
const GameDesktop = dynamic(loadGameDesktop, { ssr: false })
const ColorRecall = dynamic(loadColorRecall, { ssr: false })
const PondGame = dynamic(loadPondGame, { ssr: false })
const HallArranger = dynamic(loadHallArranger, { ssr: false })

interface MuseumProps {
  initialSlice: HallSliceDto
  arrival: 'door' | 'stairs'
}

export default function Museum({ initialSlice, arrival }: MuseumProps) {
  const guestBoardNotesRef = useRef<HTMLDivElement>(null)

  const [openPiece, setOpenPiece] = useState<OpenPiece | null>(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isCoinOpen, setIsCoinOpen] = useState(false)
  const [isGuestBoardOpen, setIsGuestBoardOpen] = useState(false)
  const [isGuestBoardHung, setIsGuestBoardHung] = useState(false)
  const [isHintShown, setIsHintShown] = useState(false)
  const [sketchGame, setSketchGame] = useState<PreparedGame | null>(null)
  const [openGame, setOpenGame] = useState<null | 'desktop' | MinigameId>(null)
  const [sketchSession, setSketchSession] = useState(0)
  const [unkeptNote, setUnkeptNote] = useState(false)
  const [arrangeRoom, setArrangeRoom] = useState<HallRoomData | null>(null)
  const [isArrangerOpen, setIsArrangerOpen] = useState(false)
  const hideHint = useCallback(() => setIsHintShown(false), [])

  useEffect(() => {
    performance.mark(MUSEUM_START_MARK)
  }, [])

  useEffect(() => {
    const abort = new AbortController()
    fetch('/api/rooms/hall', { cache: 'no-store', signal: abort.signal })
      .then(async (response) => {
        if (!response.ok) return
        const body: unknown = await response.json()
        if (typeof body === 'object' && body !== null && (body as { canEdit?: unknown }).canEdit === true) {
          setArrangeRoom(body as HallRoomData)
        }
      })
      .catch(() => {})
    return () => abort.abort()
  }, [])

  useEffect(() => {
    let timer = 0
    try {
      if (window.sessionStorage.getItem('tm:economy:unkept') === '1') {
        window.sessionStorage.removeItem('tm:economy:unkept')
        setUnkeptNote(true)
        timer = window.setTimeout(() => setUnkeptNote(false), 4200)
      }
    } catch {}
    return () => window.clearTimeout(timer)
  }, [])

  const { notes: guestNotes } = useGuestNotes({ enabled: isGuestBoardHung, live: false })
  const { setWalking } = useSound()
  const router = useRouter()

  const isSuspended =
    openPiece !== null ||
    isHelpOpen ||
    isCoinOpen ||
    isGuestBoardOpen ||
    openGame !== null ||
    isArrangerOpen

  const hallCallbacks = (): HallCallbacks => ({
    onOpenPiece: setOpenPiece,
    onLeave: () => router.push('/'),
    onOpenHelp: () => setIsHelpOpen(true),
    onFindCoin: () => setIsCoinOpen(true),
    onOpenGuestBoard: () => setIsGuestBoardOpen(true),
    onGuestBoardHung: () => setIsGuestBoardHung(true),
    onIntroDone: () => setIsHintShown(claimSwipeHint()),
    onFirstMove: hideHint,
    onOpenComputer: () => setOpenGame('desktop'),
  })
  const callbacksRef = useRef<HallCallbacks>(hallCallbacks())
  callbacksRef.current = hallCallbacks()

  const [hallRoom] = useState(() =>
    createHallRoom({
      initialSlice,
      guestBoardNotes: () => guestBoardNotesRef.current,
      callbacks: () => callbacksRef.current,
    }),
  )

  const { isReady, error } = useRoom({
    room: hallRoom,
    arrival: arrival === 'stairs' ? { kind: 'door', door: 'atelier' } : { kind: 'opening' },
    isSuspended: () => isSuspended,
    onExit: (to: DoorRef) => router.push(hrefFor(to)),
  })

  useEffect(() => {
    if (!isGuestBoardHung || sketchGame || openGame === 'sketch') return
    const controller = new AbortController()
    loadSketchGuess()
      .then(({ prepareSketchGame }) => prepareSketchGame(initialSlice.epochId, controller.signal))
      .then((game) => {
        if (!controller.signal.aborted) setSketchGame(game)
      })
      .catch(() => {})
    return () => controller.abort()
  }, [isGuestBoardHung, sketchGame, openGame, initialSlice.epochId])

  const closeSketchGuess = useCallback(() => {
    setOpenGame('desktop')
    setSketchGame(null)
  }, [])

  const pickGame = useCallback((id: MinigameId) => {
    if (id === 'sketch') setSketchSession((n) => n + 1)
    setOpenGame(id)
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
      <p className="hall-error" role="alert">
        {error}
      </p>
    )
  }

  return (
    <>
      <div className="hall-guestboard-notes" ref={guestBoardNotesRef} aria-hidden="true">
        <PinnedNotes notes={guestNotes} avoidSitArea />
      </div>

      {unkeptNote ? (
        <p className="economy-note" role="status">
          The unkept pieces went back to their stands.
        </p>
      ) : null}

      {arrangeRoom && isReady && !isArrangerOpen ? (
        <button type="button" className="arranger-open" onClick={() => setIsArrangerOpen(true)}>
          Arrange hall
        </button>
      ) : null}

      <AnimatePresence>
        {isArrangerOpen && arrangeRoom ? (
          <HallArranger
            key="hall-arranger"
            room={arrangeRoom}
            onClose={() => setIsArrangerOpen(false)}
            onPublished={() => {
              setIsArrangerOpen(false)
              window.location.reload()
            }}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {isHintShown ? <SwipeHint key="swipe-hint" onDone={hideHint} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {openGame === 'desktop' ? (
          <GameDesktop key="game-desktop" onPick={pickGame} onClose={() => setOpenGame(null)} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {openGame === 'sketch' ? (
          <SketchGuess
            key={`sketch-guess-${sketchSession}`}
            epochId={initialSlice.epochId}
            prepared={sketchGame}
            onClose={closeSketchGuess}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {openGame === 'color' ? (
          <ColorRecall key="color-recall" onClose={() => setOpenGame('desktop')} />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {openGame === 'pond' ? (
          <PondGame key="pond-game" onClose={() => setOpenGame('desktop')} />
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

      <AnimatePresence>
        {isReady ? null : (
          <motion.div
            key="curtain"
            className="hall-curtain"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {arrival === 'stairs' ? <AtelierLoading leaving /> : <HallSkeleton preload={false} />}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
