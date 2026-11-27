'use client'

import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { KEEPSAKES, catchArt, type KeepsakeId } from '../lib/journal'

const USE_HINT: Record<KeepsakeId, string> = {
  'mp3-player': 'Tap it in your fish journal any time to listen.',
  camera: 'Tap it in your fish journal to take pictures of the pond.',
}

export default function KeepsakeFound({ keepsake, onClose }: { keepsake: KeepsakeId; onClose(): void }) {
  const ref = useModalFocus()
  useEscapeKey(onClose)
  const item = KEEPSAKES.find((entry) => entry.id === keepsake)!
  return (
    <div className="pond-keepsake-dim" role="dialog" aria-modal="true" aria-labelledby="pond-keepsake-found-title">
      <div ref={ref} className="pond-keepsake-found">
        <p className="pond-keepsake-kicker">Something tangled on your line!</p>
        <img src={catchArt(item)} alt="" />
        <h2 id="pond-keepsake-found-title">{item.name}</h2>
        <p>A keepsake for your journal. {USE_HINT[keepsake]}</p>
        <button type="button" className="pond-keepsake-button" onClick={onClose}>
          Lovely!
        </button>
      </div>
    </div>
  )
}
