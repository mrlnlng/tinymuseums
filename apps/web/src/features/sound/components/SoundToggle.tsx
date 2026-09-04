'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSound } from './SoundProvider'

/*  The speaker button, drawn from the asset pack's sound icon. Inline rather than an `<img>` so the waves can be dimmed for the muted state without a second file, and so it inherits the brand colour.

    Beside it, the level. The two say the same thing in different words and are kept in agreement: the slider reads zero while the museum is muted whatever level is being held for it, dragging it off zero turns the sound back on, and dragging it to zero is muting. The speaker keeps the one-tap mute it always had — the slider is for choosing how loud, not for turning it off.

    With a pointer the level is revealed on hover or focus. Without one it is opened by the tap that mutes, and closes again on its own — see below. */

/*  How long the level stays open on a touch screen after the last thing that
    opened or moved it. Long enough to put a finger on it after tapping the
    speaker, short enough that it is gone before it becomes furniture. */
const OPEN_MS = 4000

export default function SoundToggle() {
  const { isSounding, isAvailable, volume, setVolume, toggle } = useSound()

  /*  A touch screen has no hover to reveal the level with, so the speaker's own
      tap does it: the tap mutes as it always has, and shows the level for a few
      seconds so the same hand can follow it with an adjustment. It used to
      stand open for the whole visit instead, which put a third thing in a
      corner the mockups keep to two — and left a slider over the artwork on
      every screen of the museum. */
  const [isOpen, setIsOpen] = useState(false)
  const closeAt = useRef<number | null>(null)

  const hold = useCallback(() => {
    // Only where there is no hover; with a pointer the CSS does this and the
    // state is inert, so there is nothing to arm.
    if (!window.matchMedia('(hover: none)').matches) return
    setIsOpen(true)
    if (closeAt.current !== null) window.clearTimeout(closeAt.current)
    closeAt.current = window.setTimeout(() => setIsOpen(false), OPEN_MS)
  }, [])

  /*  Anywhere else closes it, which is what a popover over a museum should do:
      the visitor's next touch is almost always meant for the hall behind it.
      Bound only while it is open, and on the capture phase so a tap that starts
      a drag of the hall still closes it. */
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

  // No track, no control. Placement is ScreenChrome's job, not this one's.
  if (!isAvailable) return null

  /*  `isSounding`, not the stored preference: a browser will not play audio
      until someone has touched the page, so on arrival the preference is "on"
      and the room is silent — and a speaker with its waves out in that moment
      is the museum claiming a sound that is not there. It draws muted until the
      track is genuinely audible, and the tap that turns it on is itself the
      gesture that lets playback start. */
  const label = isSounding ? 'Turn the music off' : 'Turn the music on'
  const shown = isSounding ? volume : 0

  return (
    <div className="sound" data-open={isOpen ? 'true' : 'false'}>
      {/*  On a touch screen this is the panel the level sits in, so that it
           reads as something that has opened rather than as a bar left lying
           over the artwork. With a pointer it is nothing at all: `display:
           contents` leaves the slider hanging off the speaker exactly as it
           did before. */}
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
            // Moving it is using it: the few seconds start again from here, so
            // it cannot close under a finger that is still adjusting.
            hold()
          }}
          aria-label="Volume"
          // The percentage is what a screen reader should read out, not "58".
          aria-valuetext={`${Math.round(shown * 100)}%`}
          // Paints the filled part of the track up to the handle.
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
