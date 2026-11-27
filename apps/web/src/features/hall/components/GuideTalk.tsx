'use client'

import { useEffect, useRef, useState } from 'react'
import { guideOffer } from '@tiny/core/rooms'
import { castMember, FRAME, IDLE } from '@/features/npcs/cast'
import type { GuideTalk as Talk } from '@/features/rooms/hall/room'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { assetEntry, assetUrl, type AssetName } from '@/shared/lib/assets'

/** A door's guide talking, one line at a time, then offering to take the visitor through. */
export default function GuideTalk({ talk, onClose }: { talk: Talk; onClose(): void }) {
  const character = castMember(talk.guide.npc)
  const [at, setAt] = useState(0)
  const { play } = useSound()
  const cardRef = useModalFocus()
  const nextRef = useRef<HTMLButtonElement>(null)
  const close = () => {
    play('close')
    onClose()
  }
  useEscapeKey(close)
  const last = at === talk.guide.lines.length - 1
  const idle = `npcs/${character.id}-idle` as AssetName
  const hasIdle = Boolean(assetEntry(idle))
  const sheet = assetUrl(hasIdle ? idle : (character.asset as AssetName))
  const cels = hasIdle ? IDLE.count : FRAME.count

  useEffect(() => { nextRef.current?.focus({ preventScroll: true }) }, [at])

  function go() {
    onClose()
    // The room ignores doors while this dialog is open, so step through once it has gone.
    window.setTimeout(talk.go, 0)
  }

  return (
    <div className="guide-talk" role="dialog" aria-modal="true" aria-labelledby="guide-talk-name" aria-describedby="guide-talk-line">
      <button type="button" tabIndex={-1} className="guide-talk-scrim" onClick={close} aria-label={`Stop talking to ${character.name}`} />
      <div ref={cardRef} className="guide-talk-card">
        <span
          className="guide-talk-face"
          aria-hidden="true"
          style={{ backgroundImage: `url("${sheet}")`, backgroundSize: `${cels * 100}% 100%`, aspectRatio: `${FRAME.width} / ${FRAME.height}` }}
        />
        <div className="guide-talk-words">
          <p className="guide-talk-who"><strong id="guide-talk-name">{character.name}</strong> {character.role}</p>
          <p id="guide-talk-line" className="guide-talk-line" aria-live="polite">{talk.guide.lines[at]}</p>
          <div className="guide-talk-actions">
            {last ? (
              <>
                <button type="button" className="guide-talk-button is-quiet" onClick={close}>Maybe later</button>
                <button ref={nextRef} type="button" className="guide-talk-button" onClick={go}>{guideOffer({ to: talk.to })}</button>
              </>
            ) : (
              <button ref={nextRef} type="button" className="guide-talk-button" onClick={() => { play('blip'); setAt(at + 1) }}>Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
