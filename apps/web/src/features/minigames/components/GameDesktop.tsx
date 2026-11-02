'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import { MINIGAMES, type MinigameId } from '../registry'

interface GameDesktopProps {
  onPick: (id: MinigameId) => void
  onClose: () => void
}

const ICONS: Record<MinigameId, string> = {
  sketch: '✎',
  color: '◐',
}

export default function GameDesktop({ onPick, onClose }: GameDesktopProps) {
  const isStill = useReducedMotion()
  useEscapeKey(onClose)

  return (
    <motion.div
      className="sketch-guess"
      initial={isStill ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: isStill ? 0 : 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label="Computer"
    >
      <button
        type="button"
        className="sketch-guess-scrim"
        onClick={onClose}
        aria-label="Close the computer"
      />

      <motion.div
        className="sketchbook gamedesktop"
        initial={isStill ? false : { y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={isStill ? { duration: 0 } : { type: 'spring', bounce: 0.18, duration: 0.45 }}
      >
        <header className="sketchbook-header">
          <span className="sketchbook-round gamedesktop-title">Tiny Museum computer</span>
          <button
            type="button"
            className="sketchbook-close"
            onClick={onClose}
            aria-label="Close the computer"
          >
            ×
          </button>
        </header>

        <p className="gamedesktop-greeting">Pick something to play.</p>

        <div className="gamedesktop-apps">
          {MINIGAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              className="gamedesktop-app"
              onClick={() => onPick(game.id)}
            >
              <span className={`gamedesktop-icon is-${game.id}`} aria-hidden="true">
                {ICONS[game.id]}
              </span>
              <span className="gamedesktop-app-name">{game.title}</span>
              <span className="gamedesktop-app-blurb">{game.blurb}</span>
            </button>
          ))}
        </div>

        <p className="gamedesktop-hint">More apps coming soon.</p>
      </motion.div>
    </motion.div>
  )
}
