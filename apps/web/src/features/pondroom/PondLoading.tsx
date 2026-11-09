'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { revealFloorTransition } from '@/features/hall/lib/floor-transition'
import { POND_NAME } from './lib/identity'

/** The short curtain while the garden's art arrives, in the museum's loading style. */
export default function PondLoading() {
  useEffect(() => {
    revealFloorTransition()
  }, [])

  return (
    <motion.div
      className="pond-room-loading"
      role="status"
      aria-live="polite"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
    >
      <span className="pond-room-loading-flower" aria-hidden="true">
        ✿
      </span>
      <p className="pond-room-loading-title script">{POND_NAME}</p>
      <p className="pond-room-loading-note">Following the forest path to the water…</p>
    </motion.div>
  )
}
