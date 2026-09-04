'use client'

import { useSound } from './SoundProvider'

/*  The speaker button, drawn from the asset pack's sound icon. Inline rather than an `<img>` so the waves can be dimmed for the muted state without a second file, and so it inherits the brand colour.

    Beside it, the level. The two say the same thing in different words and are kept in agreement: the slider reads zero while the museum is muted whatever level is being held for it, dragging it off zero turns the sound back on, and dragging it to zero is muting. The speaker keeps the one-tap mute it always had — the slider is for choosing how loud, not for turning it off.

    It is revealed on hover or focus and stands open on a touch screen, which has no hover to reveal it with. */
export default function SoundToggle() {
  const { isSounding, isAvailable, volume, setVolume, toggle } = useSound()

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
    <div className="sound">
      <input
        className="sound-level"
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(shown * 100)}
        onChange={(event) => setVolume(Number(event.target.value) / 100)}
        aria-label="Volume"
        // The percentage is what a screen reader should read out, not "58".
        aria-valuetext={`${Math.round(shown * 100)}%`}
        // Paints the filled part of the track up to the handle.
        style={{ '--level': `${Math.round(shown * 100)}%` } as React.CSSProperties}
      />

      <button
        type="button"
        className="chrome-button sound-toggle"
        onClick={toggle}
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
