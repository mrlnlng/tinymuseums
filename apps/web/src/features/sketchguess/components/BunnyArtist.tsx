'use client'

import { motion, useReducedMotion, type TargetAndTransition, type Transition } from 'motion/react'

export type BunnyMood = 'idle' | 'drawing' | 'cheering' | 'sad'

const SITTING = '/assets/bunny-sit.webp'
const JUMPING = '/assets/bunny-right.webp'

const POSES: Record<BunnyMood, { animate: TargetAndTransition; transition: Transition }> = {
  idle: { animate: { y: 0, rotate: 0, x: 0 }, transition: { duration: 0.3 } },
  drawing: {
    animate: { rotate: [-3, 3, -3], y: [0, -1.5, 0] },
    transition: { duration: 1.1, repeat: Infinity, ease: 'easeInOut' },
  },
  cheering: {
    animate: { y: [0, -22, 0, -10, 0], rotate: [0, -6, 0, 4, 0], scale: [1, 1.08, 1, 1.04, 1] },
    transition: { duration: 0.9, ease: 'easeOut' },
  },
  sad: {
    animate: { rotate: [0, -10, -6, -10, -8], x: [0, -3, 3, -2, 0], y: 4 },
    transition: { duration: 0.7, ease: 'easeInOut' },
  },
}

function Pencil({ scribbling }: { scribbling: boolean }) {
  const isStill = useReducedMotion()
  return (
    <motion.svg
      className="bunny-artist-pencil"
      viewBox="0 0 40 12"
      aria-hidden="true"
      animate={scribbling && !isStill ? { x: [0, 4, -2, 3, 0], y: [0, 2, -1, 1, 0] } : { x: 0, y: 0 }}
      transition={scribbling ? { duration: 0.45, repeat: Infinity, ease: 'linear' } : { duration: 0.2 }}
    >
      <rect x="6" y="2" width="28" height="8" rx="1.5" fill="#f2b233" stroke="#5d3218" strokeWidth="1.4" />
      <rect x="30" y="2" width="6" height="8" rx="1.5" fill="#f5a3b8" stroke="#5d3218" strokeWidth="1.4" />
      <path d="M6 2 L0 6 L6 10 Z" fill="#fae3c0" stroke="#5d3218" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M0 6 L2.4 4.6 L2.4 7.4 Z" fill="#5d3218" />
    </motion.svg>
  )
}

export default function BunnyArtist({ mood }: { mood: BunnyMood }) {
  const isStill = useReducedMotion()
  const pose = POSES[mood]

  return (
    <motion.div
      className="bunny-artist"
      aria-hidden="true"
      animate={isStill ? undefined : pose.animate}
      transition={pose.transition}
    >
      <img src={mood === 'cheering' ? JUMPING : SITTING} alt="" draggable={false} />
      {mood === 'cheering' ? null : <Pencil scribbling={mood === 'drawing'} />}
    </motion.div>
  )
}
