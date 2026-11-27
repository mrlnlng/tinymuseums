'use client'

import { useEffect } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { KEEPSAKES, catchArt, type KeepsakeId } from '../lib/journal'

const USE_HINT: Record<KeepsakeId, string> = {
  'mp3-player': 'Open your gadgets — the tool button in the bottom-left corner — to listen anywhere in the museum.',
  camera: 'Open your gadgets — the tool button in the bottom-left corner — to take pictures anywhere in the museum.',
}

export default function KeepsakeFound({ keepsake, onClose }: { keepsake: KeepsakeId; onClose(): void }) {
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
  const item = KEEPSAKES.find((entry) => entry.id === keepsake)!
  return (
    <div className="pond-keepsake-dim" role="dialog" aria-modal="true" aria-labelledby="pond-keepsake-found-title">
      <div ref={ref} className="pond-keepsake-found">
        <p className="pond-keepsake-kicker">Something tangled on your line!</p>
        <img src={catchArt(item)} alt="" />
        <h2 id="pond-keepsake-found-title">{item.name}</h2>
        <p>A new gadget! {USE_HINT[keepsake]}</p>
        <button type="button" className="pond-keepsake-button" onClick={close}>
          Lovely!
        </button>
      </div>
    </div>
  )
}
