'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { createPondRoom, type PondCallbacks, type PondControl } from '@/features/rooms/pond/room'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import type { DoorRef } from '@/features/rooms/types'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { refreshPondState } from './lib/pond-state'
import PondHud from './PondHud'
import PondLoading from './PondLoading'
import PondPanels, { type PondOverlayKind } from './PondPanels'
import PondTicker from './PondTicker'

const PondGame = dynamic(() => import('@/features/pondgame/components/PondGame'), { ssr: false })

export interface PondRoomProps {
  /** Later phases can take over the pond's overlays without changing the room. */
  callbacks?: Partial<PondCallbacks>
}

function PondFishing({ onClose }: { onClose(): void }) {
  useEscapeKey(onClose)
  return (
    <motion.div
      className="pond-room-fishing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <PondGame onClose={onClose} />
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
  const [panel, setPanel] = useState<PondOverlayKind | null>(null)
  const controlRef = useRef<PondControl>({ release: () => {}, setBountyReady: () => {} })

  const [room] = useState(() =>
    createPondRoom({
      control: controlRef.current,
      callbacks: {
        onFish(spot) {
          overridesRef.current?.onFish?.(spot)
          setFishingSpot(spot)
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
        The moonlit pond could not open. <Link href="/museum">Back to the museum</Link>
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
        {fishingSpot !== null ? <PondFishing key="pond-fishing" onClose={closeFishing} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {panel !== null ? <PondPanels key={`pond-panel-${panel}`} kind={panel} onClose={closePanel} /> : null}
      </AnimatePresence>

      <AnimatePresence>{isReady ? null : <PondLoading key="pond-loading" />}</AnimatePresence>
    </>
  )
}
