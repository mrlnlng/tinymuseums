'use client'

import { useEffect } from 'react'
import { PearlIcon } from './lib/icons'
import { fetchPondBounties } from './lib/pond-api'
import { formatInteger } from './lib/pond-format'
import { usePondState } from './lib/use-pond-state'

export interface PondHudProps {
  onBountyReady(ready: boolean): void
  /** Bumped when a panel closes, so the bounty dot can catch up after a claim. */
  refreshKey?: number
}

/** A quiet balance display; activities and account prompts live at their woodland objects. */
export default function PondHud({ onBountyReady, refreshKey = 0 }: PondHudProps) {
  const snapshot = usePondState()

  useEffect(() => {
    if (!snapshot.isMember) {
      onBountyReady(false)
      return
    }
    let live = true
    void fetchPondBounties().then((result) => {
      if (live && result.ok) onBountyReady(result.value.bounties.some((bounty) => bounty.done && !bounty.claimed))
    })
    return () => { live = false }
  }, [snapshot.isMember, refreshKey, onBountyReady])

  const pearls = snapshot.isMember && snapshot.state ? formatInteger(snapshot.state.pearls) : null
  if (pearls === null) return null

  return (
    <div className="pond-room-pearls" role="status" aria-label={`${pearls} pearls`}>
      <PearlIcon size={18} />
      <span className="pond-room-pearls-count">{pearls}</span>
    </div>
  )
}
