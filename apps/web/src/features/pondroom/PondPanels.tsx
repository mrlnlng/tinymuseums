'use client'

import { useEffect, useRef, useState } from 'react'
import { openAccount } from '@/features/account/lib/account'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import type { PondPanelKind } from '@/features/rooms/pond/room'
import { SHOPKEEPER_NAME } from '@/features/rooms/pond/shopkeeper'
import { usePondState } from './lib/use-pond-state'
import { PondIcon } from './lib/icons'
import BountyPanel from './panels/BountyPanel'
import FishdexPanel from './panels/FishdexPanel'
import FishmongerPanel from './panels/FishmongerPanel'
import LeaderboardPanel from './panels/LeaderboardPanel'

export type PondOverlayKind = PondPanelKind

const TITLES: Record<PondOverlayKind, string> = {
  leaderboard: 'Noticeboard',
  bounties: 'Noticeboard',
  fishmonger: 'Bait shop',
  fishdex: 'Fish journal',
}

const SUBTITLES: Record<PondOverlayKind, string> = {
  leaderboard: 'The pond’s biggest and rarest catches',
  bounties: 'A few small goals, rewarded with pearls',
  fishmonger: 'A little bait, a little friendly advice',
  fishdex: 'A record of the fish you have met',
}

const BOARD_TABS = [
  { kind: 'bounties', label: 'Today’s bounties' },
  { kind: 'leaderboard', label: 'Pond records' },
] as const

export interface PondPanelsProps {
  kind: PondOverlayKind
  onClose(): void
}

/** Each pondside object has one home; the two notices share a board. */
export default function PondPanels({ kind, onClose }: PondPanelsProps) {
  const [activeKind, setActiveKind] = useState(kind)
  const snapshot = usePondState()
  const cardRef = useModalFocus()
  const closeRef = useRef<HTMLButtonElement>(null)
  useEscapeKey(onClose)
  const title = TITLES[activeKind]
  const isBoard = activeKind === 'bounties' || activeKind === 'leaderboard'

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  function signIn() {
    onClose()
    // Leave the pond panel before the account sheet takes focus.
    window.requestAnimationFrame(openAccount)
  }

  return (
    <div className="pond-room-panel" role="dialog" aria-modal="true" aria-labelledby="pond-room-panel-title">
      <button
        type="button"
        tabIndex={-1}
        className="pond-room-panel-scrim"
        onClick={onClose}
        aria-label={`Close the ${title.toLowerCase()}`}
      />
      <div ref={cardRef} className={`pond-room-panel-card is-${activeKind}`}>
        <header className="pond-room-panel-header">
          <div className="pond-room-panel-heading">
            <p className="pond-room-panel-subtitle">The Moonlit Pond</p>
            <h2 id="pond-room-panel-title" className="pond-room-panel-title">{title}</h2>
            <p className="pond-room-panel-intro">{SUBTITLES[activeKind]}</p>
          </div>
          <button ref={closeRef} type="button" className="pond-room-panel-close"
            onClick={onClose} aria-label={`Close the ${title.toLowerCase()}`}>
            <PondIcon name="close" />
          </button>
        </header>
        {isBoard ? (
          <div className="pond-notice-tabs" role="tablist" aria-label="Noticeboard">
            {BOARD_TABS.map((tab, index) => (
              <button
                key={tab.kind}
                id={`pond-notice-tab-${tab.kind}`}
                type="button"
                role="tab"
                aria-selected={activeKind === tab.kind}
                aria-controls="pond-notice-content"
                tabIndex={activeKind === tab.kind ? 0 : -1}
                onClick={() => setActiveKind(tab.kind)}
                onKeyDown={(event) => {
                  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
                  event.preventDefault()
                  const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index
                  setActiveKind(BOARD_TABS[next].kind)
                  document.getElementById(`pond-notice-tab-${BOARD_TABS[next].kind}`)?.focus()
                }}
              >
                <PondIcon name={tab.kind === 'bounties' ? 'scroll' : 'trophy'} size={22} />
                {tab.label}
              </button>
            ))}
          </div>
        ) : null}
        <div
          className={`pond-room-panel-body is-${activeKind}`}
          id={isBoard ? 'pond-notice-content' : undefined}
          role={isBoard ? 'tabpanel' : undefined}
          aria-labelledby={isBoard ? `pond-notice-tab-${activeKind}` : undefined}
        >
          {activeKind === 'leaderboard' ? <LeaderboardPanel /> : null}
          {activeKind === 'bounties' ? <BountyPanel /> : null}
          {activeKind === 'fishmonger' ? (
            <>
              <p className="pond-merchant-welcome">
                <strong>{SHOPKEEPER_NAME}</strong>
                “Evening, friend. Worms are on the house. Fancy trying a different bait?”
              </p>
              <FishmongerPanel />
            </>
          ) : null}
          {activeKind === 'fishdex' ? <FishdexPanel /> : null}
        </div>
        <footer className="pond-room-panel-footer">
          <button type="button" className="pond-room-button is-quiet" onClick={onClose}>← Keep exploring</button>
          {snapshot.isReady && !snapshot.isMember ? (
            <button type="button" className="pond-room-signin" onClick={signIn}>Sign in to save catches</button>
          ) : null}
        </footer>
      </div>
    </div>
  )
}
