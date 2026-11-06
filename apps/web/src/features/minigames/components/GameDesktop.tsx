'use client'

import MinigameFrame from './MinigameFrame'
import { MINIGAMES, type MinigameId } from '../registry'

interface GameDesktopProps {
  onPick: (id: MinigameId) => void
  onClose: () => void
}

export default function GameDesktop({ onPick, onClose }: GameDesktopProps) {
  return (
    <MinigameFrame
      label="Computer"
      onClose={onClose}
      closeLabel="Close the computer"
      cardClassName="gamedesktop"
      header={<span className="sketchbook-round gamedesktop-title">Tiny Museum computer</span>}
    >
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
              {game.icon}
            </span>
            <span className="gamedesktop-app-name">{game.title}</span>
            <span className="gamedesktop-app-blurb">{game.blurb}</span>
          </button>
        ))}
      </div>

      <p className="gamedesktop-hint">More apps coming soon.</p>
    </MinigameFrame>
  )
}
