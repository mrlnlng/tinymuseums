'use client'

import { useSound } from './SoundProvider'

/*  The speaker button, drawn from the asset pack's sound icon. Inline rather than an `<img>` so the waves can be dimmed for the muted state without a second file, and so it inherits the brand colour. */
export default function SoundToggle() {
  const { isEnabled, isAvailable, toggle } = useSound()

  // No track, no control. Placement is ScreenChrome's job, not this one's.
  if (!isAvailable) return null

  const label = isEnabled ? 'Turn the music off' : 'Turn the music on'

  return (
    <button
      type="button"
      className="chrome-button sound-toggle"
      onClick={toggle}
      aria-pressed={isEnabled}
      aria-label={label}
      title={label}
    >
      <svg viewBox="0 0 75 75" aria-hidden="true">
        <path
          d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <g className="waves" data-on={isEnabled ? 'true' : 'false'}>
          <path
            d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
        {isEnabled ? null : (
          <path className="slash" d="M50,22 L68,53" strokeWidth="5" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}
