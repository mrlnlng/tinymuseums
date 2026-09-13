'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSound } from './SoundProvider'

const OPEN_MS = 4000

export default function SoundToggle() {
  const { isSounding, isAvailable, volume, setVolume, toggle } = useSound()

  const [isOpen, setIsOpen] = useState(false)
  const closeAt = useRef<number | null>(null)

  const hold = useCallback(() => {
    if (!window.matchMedia('(hover: none)').matches) return
    setIsOpen(true)
    if (closeAt.current !== null) window.clearTimeout(closeAt.current)
    closeAt.current = window.setTimeout(() => setIsOpen(false), OPEN_MS)
  }, [])

  useEffect(() => {
    if (!isOpen) return undefined
    const onDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('.sound')) return
      setIsOpen(false)
    }
    document.addEventListener('pointerdown', onDown, { capture: true, passive: true })
    return () => document.removeEventListener('pointerdown', onDown, { capture: true })
  }, [isOpen])

  useEffect(() => {
    return () => {
      if (closeAt.current !== null) window.clearTimeout(closeAt.current)
    }
  }, [])

  if (!isAvailable) return null

  const label = isSounding ? 'Turn the music off' : 'Turn the music on'
  const shown = isSounding ? volume : 0

  return (
    <div className="sound" data-open={isOpen ? 'true' : 'false'}>
      <div className="sound-panel">
        <input
          className="sound-level"
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(shown * 100)}
          onChange={(event) => {
            setVolume(Number(event.target.value) / 100)
            hold()
          }}
          aria-label="Volume"
          aria-valuetext={`${Math.round(shown * 100)}%`}
          style={{ '--level': `${Math.round(shown * 100)}%` } as React.CSSProperties}
        />
      </div>

      <button
        type="button"
        className="chrome-button sound-toggle"
        onClick={() => {
          toggle()
          hold()
        }}
        aria-pressed={isSounding}
        aria-label={label}
        title={label}
      >
        <svg viewBox="0 0 75 75" aria-hidden="true">
          <path
            d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
            strokeWidth="5"
            strokeLinejoin="round"
          />
          <g className="waves" data-on={isSounding ? 'true' : 'false'}>
            <path
              d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
          {isSounding ? null : (
            <path className="slash" d="M50,22 L68,53" strokeWidth="5" strokeLinecap="round" />
          )}
        </svg>
      </button>
    </div>
  )
}
