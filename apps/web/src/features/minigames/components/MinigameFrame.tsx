'use client'

import { useCallback, useEffect, useRef, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'

interface MinigameFrameProps {
  label: string
  onClose: () => void
  header: ReactNode
  closeLabel?: string
  cardClassName?: string
  /** Opt in to the shared open/close effects; panels that own their trigger handle their own sound. */
  sounds?: boolean
  /** Off when closing this panel immediately opens another one (e.g. back to the desktop). */
  closeSound?: boolean
  children: ReactNode
}

export default function MinigameFrame({
  label,
  onClose,
  header,
  closeLabel,
  cardClassName,
  sounds = false,
  closeSound = true,
  children,
}: MinigameFrameProps) {
  const { play } = useSound()
  const isStill = useReducedMotion()
  const hasOpened = useRef(false)
  const closeText = closeLabel ?? `Close ${label}`

  useEffect(() => {
    if (!sounds || hasOpened.current) return
    hasOpened.current = true
    play('open')
  }, [play, sounds])

  const handleClose = useCallback(() => {
    if (sounds && closeSound) play('close')
    onClose()
  }, [closeSound, onClose, play, sounds])

  useEscapeKey(handleClose)

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
        onClick={handleClose}
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
            onClick={handleClose}
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
