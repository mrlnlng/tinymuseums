'use client'

import type { MuseumDoor } from '@tiny/core/rooms'
import { setMuseumDoors } from './doors'

/** Hands the published doors to the rooms before any of them is built. */
export default function MuseumDoors({ doors, children }: { doors: MuseumDoor[]; children: React.ReactNode }) {
  setMuseumDoors(doors)
  return children
}
