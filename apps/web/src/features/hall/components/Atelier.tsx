'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Work } from '@/features/artwork/components/Walkthrough'
import type { Layers } from '@/features/hall/scene/layers'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { SpotPainting } from '@tiny/core'
import { AnimatePresence } from 'motion/react'
import { outfit, restamp } from '@tiny/core/slots'
import AtelierKeeps from '@/features/hall/components/AtelierKeeps'
import AtelierLoading from '@/features/hall/components/AtelierLoading'
import ClosetView from '@/features/hall/components/ClosetView'
import MirrorView from '@/features/hall/components/MirrorView'
import { createAtelierRoomDef, type AtelierHooks } from '@/features/rooms/atelier/room'
import { doorsOf } from '@/features/rooms/doors'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import type { DoorRef } from '@/features/rooms/types'
import { lookOf, ownedLook, shouldRewriteOutfit } from '@/features/hall/scene/wardrobe'
import { allowedCharacter, owns, useWallet } from '@/features/economy'
import type { CharacterKind } from '@/features/hall/scene/rig'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useSlot } from '@/shared/lib/slots'

// The hall's closeup, loaded only when a painting is first tapped.
const Walkthrough = dynamic(() => import('@/features/artwork/components/Walkthrough'), { ssr: false })

/** The sounds a change of clothes or character makes. */
const CHANGE_SOUND = { costume_on: 'confirm', costume_off: 'select', character: 'transition' } as const

export default function Atelier({ spots, from }: { spots: Record<string, SpotPainting>; from: string | null }) {
  // In through the door the visitor came by; without one, the first door in the fashion area.
  const [arrivalDoor] = useState(() => doorsOf('atelier').find((door) => door.id === from)?.id ?? doorsOf('atelier')[0]?.id)
  const [mirrorOpen, setMirrorOpen] = useState(false)
  const [becoming, setBecoming] = useState<CharacterKind | null>(null)
  const [closetOpen, setClosetOpen] = useState(false)
  const [dressing, setDressing] = useState<{ layers: Layers; bow: string | null } | null>(null)
  const [painting, setPainting] = useState<{ works: readonly Work[]; index: number } | null>(null)
  const { play } = useSound()
  const playRef = useRef(play)
  playRef.current = play
  const [hooks] = useState<AtelierHooks>(() => ({
    onMirror: () => { playRef.current('open'); setMirrorOpen(true) },
    onCloset: () => { playRef.current('open'); setClosetOpen(true) },
    onPainting: (works, index) => { playRef.current('painting-open'); setPainting({ works, index }) },
    onChange: { current: (change) => playRef.current(CHANGE_SOUND[change]) },
    become: { current: null },
    dress: { current: null },
    wardrobeDoors: { current: null },
  }))
  const [atelierRoom] = useState(() => createAtelierRoomDef(spots, hooks))
  const router = useRouter()
  const wallet = useWallet()
  const [outfitDoc, updateOutfit] = useSlot(outfit)

  function leave(to: DoorRef): void {
    const current = lookOf(outfitDoc)
    if (shouldRewriteOutfit(current, wallet)) {
      const next = ownedLook(current, wallet)
      updateOutfit((value) => ({
        ...value,
        character: restamp(value.character, next.kind),
        costume: restamp(value.costume, next.costume),
        bow: restamp(value.bow, next.bow),
        top: restamp(value.top, next.top),
      }))
    }
    router.push(hrefFor(to))
  }

  // The room ignores taps while a dialog is up, so the change waits until the mirror has gone.
  useEffect(() => {
    if (mirrorOpen || becoming === null) return
    hooks.become.current?.(becoming)
    setBecoming(null)
  }, [mirrorOpen, becoming, hooks])

  // The wardrobe's doors stand open while the closet is up; what was chosen goes on once it has shut.
  useEffect(() => { hooks.wardrobeDoors.current?.(closetOpen) }, [closetOpen, hooks])
  useEffect(() => {
    if (closetOpen || dressing === null) return
    hooks.dress.current?.(dressing.layers, dressing.bow)
    setDressing(null)
  }, [closetOpen, dressing, hooks])

  const { isReady, error } = useRoom({
    room: atelierRoom,
    arrival: arrivalDoor ? { kind: 'door', door: arrivalDoor } : { kind: 'opening' },
    onExit: leave,
  })

  if (error) {
    return (
      <p className="hall-error" role="alert">
        The atelier could not open. <Link href="/museum">Back to the museum</Link>
      </p>
    )
  }


  return (
    <>
      <AtelierKeeps />
      {closetOpen ? (
        <ClosetView
          kind={lookOf(outfitDoc).kind}
          costume={lookOf(outfitDoc).costume}
          top={lookOf(outfitDoc).top}
          bow={lookOf(outfitDoc).bow}
          kept={(itemId) => owns(wallet, itemId)}
          onDone={(layers, bow) => { setDressing({ layers, bow }); setClosetOpen(false) }}
          onClose={() => setClosetOpen(false)}
        />
      ) : null}
      {mirrorOpen ? (
        <MirrorView
          kind={lookOf(outfitDoc).kind}
          costume={lookOf(outfitDoc).costume}
          top={lookOf(outfitDoc).top}
          bow={lookOf(outfitDoc).bow}
          kept={(kind) => allowedCharacter(wallet, kind)}
          onBecome={(kind) => { setBecoming(kind); setMirrorOpen(false) }}
          onClose={() => setMirrorOpen(false)}
        />
      ) : null}
      <AnimatePresence>
        {painting ? (
          <Walkthrough
            key="walkthrough"
            works={painting.works}
            initialIndex={painting.index}
            onClose={() => setPainting(null)}
          />
        ) : null}
      </AnimatePresence>
      <AnimatePresence>{isReady ? null : <AtelierLoading key="loading" />}</AnimatePresence>
    </>
  )
}
