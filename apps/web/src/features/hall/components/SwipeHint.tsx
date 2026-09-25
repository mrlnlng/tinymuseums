'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const VISIBLE_MS = 4500
const SEEN_KEY = 'tiny-museum:swipe-hint'

export function claimSwipeHint(): boolean {
  try {
    if (window.sessionStorage.getItem(SEEN_KEY)) return false
    window.sessionStorage.setItem(SEEN_KEY, '1')
  } catch {}
  return true
}

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      className="swipe-hint-arrow"
      viewBox="0 0 16 24"
      style={flip ? { scale: '-1 1' } : undefined}
    >
      <path
        d="M12 3 3 12l9 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function SwipeHint({ onDone }: { onDone: () => void }) {
  const isStill = useReducedMotion()
  const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    const timer = window.setTimeout(onDone, VISIBLE_MS)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <motion.div
      className="swipe-hint"
      role="status"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35 }}
    >
      <div className="swipe-hint-track" aria-hidden="true">
        <Chevron />
        <motion.svg
          className="swipe-hint-hand"
          viewBox="0 0 64 80"
          animate={isStill ? undefined : { x: ['-45%', '45%', '-45%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <g
            fill="#fffaf0"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinejoin="round"
            strokeLinecap="round"
          >
            <path d="M24 44V12a5 5 0 0 1 10 0v23a4.5 4.5 0 0 1 9 0v2a4.5 4.5 0 0 1 9 0v21c0 9-7 16-16 16h-2c-7 0-11-3-15-8L7 53a4.5 4.5 0 0 1 6.5-6L24 55Z" />
            <path d="M34 35v7M43 37v6" fill="none" />
          </g>
        </motion.svg>
        <Chevron flip />
      </div>
      <p className="swipe-hint-text">
        {isTouch ? 'Swipe to explore' : 'Drag or scroll to explore'}
      </p>
    </motion.div>
  )
}
