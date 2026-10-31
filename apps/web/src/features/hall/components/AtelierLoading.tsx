'use client'

import { useEffect } from 'react'
import { revealFloorTransition } from '@/features/hall/lib/floor-transition'
import { motion } from 'motion/react'

// The stitched outline the needle travels: bodice and skirt of a dress form.
const SEAM =
  'M 96 74 C 84 96 82 122 96 150 C 101 160 101 168 94 178 L 70 238 Q 120 252 170 238 L 146 178 C 139 168 139 160 144 150 C 158 122 156 96 144 74 Q 120 66 96 74 Z'

export default function AtelierLoading({ leaving = false }: { leaving?: boolean }) {
  // The maroon loading screen is ready to replace the cover before the room is loaded.
  useEffect(() => { revealFloorTransition() }, [])
  return (
    <motion.div
      className="atelier-loading"
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <svg className="atelier-loading-art" viewBox="0 0 240 300" aria-hidden="true">
        <g className="atelier-loading-form">
          <circle cx="120" cy="42" r="8" />
          <rect x="114" y="48" width="12" height="20" rx="4" />
          <path d={SEAM} />
          <rect x="117" y="244" width="6" height="34" rx="2" />
          <path d="M 120 274 L 94 292 M 120 274 L 146 292 M 120 274 L 120 294" />
        </g>
        <path className="atelier-loading-stitches" d={SEAM} />
        <g className="atelier-loading-bow">
          <path d="M 120 62 L 100 52 Q 94 62 100 72 Z M 120 62 L 140 52 Q 146 62 140 72 Z" />
          <circle cx="120" cy="62" r="4.5" />
        </g>
        <g className="atelier-loading-needle" style={{ offsetPath: `path('${SEAM}')` }}>
          <path d="M -14 0 L 12 -1.6 L 15 0 L 12 1.6 Z" />
          <ellipse cx="-9" cy="0" rx="2.6" ry="0.9" />
        </g>
      </svg>
      <p className="atelier-loading-title">{leaving ? 'Tiny Museum' : 'The Costume Atelier'}</p>
      <p className="atelier-loading-note">{leaving ? 'Back to the collection' : 'Threading the needle'}</p>
    </motion.div>
  )
}
