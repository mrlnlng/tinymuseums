'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createPondRoom, type PondCallbacks, type PondControl } from '@/features/rooms/pond/room'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import type { DoorRef } from '@/features/rooms/types'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { refreshPondState } from './lib/pond-state'
import PondHud from './PondHud'
import PondLoading from './PondLoading'
import PondPanels, { type PondOverlayKind } from './PondPanels'
import PondTicker from './PondTicker'
import { POND_NAME } from './lib/identity'

const PondGame = dynamic(() => import('@/features/pondgame/components/PondGame'), { ssr: false })

export interface PondRoomProps {
  /** Later phases can take over the pond's overlays without changing the room. */
  callbacks?: Partial<PondCallbacks>
}

function PondFishing({ onClose, spot, unavailable }: { onClose(): void; spot: number; unavailable: boolean }) {
  const focusRef = useModalFocus()
  useEffect(() => () => {
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`.pond-room-ripple[data-spot="${spot + 1}"]:not(:disabled)`)?.focus({ preventScroll: true }))
  }, [spot])
  return (
    <motion.div
      className="pond-room-fishing"
      ref={focusRef}
      role="dialog"
      aria-modal="true"
      aria-label="Fishing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PondGame onClose={onClose} spotUnavailable={unavailable} />
    </motion.div>
  )
}

export default function PondRoom({ callbacks: overrides }: PondRoomProps = {}) {
  const router = useRouter()
  const routerRef = useRef(router)
  routerRef.current = router
  const overridesRef = useRef(overrides)
  overridesRef.current = overrides

  const [fishingSpot, setFishingSpot] = useState<number | null>(null)
  const [spotUnavailable, setSpotUnavailable] = useState(false)
  const [panel, setPanel] = useState<PondOverlayKind | null>(null)
  const controlRef = useRef<PondControl>({ release: () => {}, setBountyReady: () => {} })

  const [room] = useState(() =>
    createPondRoom({
      control: controlRef.current,
      callbacks: {
        onFish(spot) {
          setSpotUnavailable(false)
          overridesRef.current?.onFish?.(spot)
          setFishingSpot(spot)
        },
        onSpotLost() {
          setSpotUnavailable(true)
          overridesRef.current?.onSpotLost?.()
        },
        onPanel(kind) {
          overridesRef.current?.onPanel?.(kind)
          setPanel(kind)
        },
      },
    }),
  )

  const closeFishing = useCallback(() => {
    controlRef.current.release()
    setFishingSpot(null)
    // Pearls and streaks change while fishing; the room HUD catches up when the overlay leaves.
    void refreshPondState()
  }, [])

  const onBountyReady = useCallback((ready: boolean) => {
    controlRef.current.setBountyReady(ready)
  }, [])

  const [panelCloses, setPanelCloses] = useState(0)
  const closePanel = useCallback(() => {
    setPanel(null)
    setPanelCloses((count) => count + 1)
  }, [])

  const { isReady, error } = useRoom({
    room,
    arrival: { kind: 'opening' },
    isSuspended: () => fishingSpot !== null || panel !== null,
    onExit: (to: DoorRef) => routerRef.current.push(hrefFor(to)),
  })

  if (error) {
    return (
      <p className="hall-error" role="alert">
        {POND_NAME} could not open. <Link href="/museum">Back to the museum</Link>
      </p>
    )
  }

  return (
    <>
      {isReady && fishingSpot === null ? (
        <>
          <PondHud onBountyReady={onBountyReady} refreshKey={panelCloses} />
          <PondTicker />
        </>
      ) : null}

      <AnimatePresence>
        {fishingSpot !== null ? <PondFishing key="pond-fishing" onClose={closeFishing} spot={fishingSpot} unavailable={spotUnavailable} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {panel !== null ? <PondPanels key={`pond-panel-${panel}`} kind={panel} onClose={closePanel} /> : null}
      </AnimatePresence>

      <AnimatePresence>{isReady ? null : <PondLoading key="pond-loading" />}</AnimatePresence>
    </>
  )
}
