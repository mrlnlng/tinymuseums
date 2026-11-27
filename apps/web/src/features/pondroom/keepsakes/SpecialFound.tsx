'use client'

import { useEffect } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { catchArt, journalCatch } from '../lib/journal'

export default function SpecialFound({
  species,
  variant,
  pearls,
  onClose,
}: {
  species: string
  variant: string
  pearls: number
  onClose(): void
}) {
  const ref = useModalFocus()
  const { play } = useSound()

  function close() {
    play('close')
    onClose()
  }

  useEffect(() => {
    play('unlock')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEscapeKey(close)
  const item = journalCatch(species, variant)
  return (
    <div className="pond-keepsake-dim" role="dialog" aria-modal="true" aria-labelledby="pond-special-found-title">
      <div ref={ref} className="pond-keepsake-found">
        <p className="pond-keepsake-kicker">★ Today’s special fish!</p>
        <img src={catchArt(item)} alt="" />
        <h2 id="pond-special-found-title">{item.name}</h2>
        <p>
          You landed today’s special. <strong>+{pearls} pearls</strong> — a new special swims in tomorrow.
        </p>
        <button type="button" className="pond-keepsake-button" onClick={close}>
          Hooray!
        </button>
      </div>
    </div>
  )
}
