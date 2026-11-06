'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'motion/react'
import { outfit, restamp } from '@tiny/core/slots'
import AtelierKeeps from '@/features/hall/components/AtelierKeeps'
import AtelierLoading from '@/features/hall/components/AtelierLoading'
import { atelierRoom } from '@/features/rooms/atelier/room'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import type { DoorRef } from '@/features/rooms/types'
import { lookOf, ownedLook, shouldRewriteOutfit } from '@/features/hall/scene/wardrobe'
import { useWallet } from '@/features/economy'
import { useSlot } from '@/shared/lib/slots'

export default function Atelier() {
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
      }))
      try {
        window.sessionStorage.setItem('tm:economy:unkept', '1')
      } catch {}
    }
    router.push(hrefFor(to))
  }

  const { isReady, error } = useRoom({
    room: atelierRoom,
    arrival: { kind: 'door', door: 'gallery' },
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
      <AnimatePresence>{isReady ? null : <AtelierLoading key="loading" />}</AnimatePresence>
    </>
  )
}
