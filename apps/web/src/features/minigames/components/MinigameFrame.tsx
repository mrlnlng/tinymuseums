'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'

interface MinigameFrameProps {
  label: string
  onClose: () => void
  header: ReactNode
  closeLabel?: string
  cardClassName?: string
  children: ReactNode
}

export default function MinigameFrame({
  label,
  onClose,
  header,
  closeLabel,
  cardClassName,
  children,
}: MinigameFrameProps) {
  const isStill = useReducedMotion()
  useEscapeKey(onClose)
  const closeText = closeLabel ?? `Close ${label}`

  return (
    <motion.div
      className="sketch-guess"
      initial={isStill ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isStill ? 0 : 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <button
        type="button"
        className="sketch-guess-scrim"
        onClick={onClose}
        aria-label={closeText}
      />

      <motion.div
        className={cardClassName ? `sketchbook ${cardClassName}` : 'sketchbook'}
        initial={isStill ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={isStill ? { duration: 0 } : { type: 'spring', bounce: 0.18, duration: 0.45 }}
      >
        <header className="sketchbook-header">
          {header}
          <button
            type="button"
            className="sketchbook-close"
            onClick={onClose}
            aria-label={closeText}
          >
            ×
          </button>
        </header>

        {children}
      </motion.div>
    </motion.div>
  )
}
