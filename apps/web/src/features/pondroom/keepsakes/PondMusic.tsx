'use client'

import { useEffect, useRef, useState } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { staticUrl } from '@/shared/lib/static'
import { catchArt } from '../lib/journal'

// Drop the song in at apps/web/public/audio/pond-song.mp3; until then the player says so.
const SONG = staticUrl('/audio/pond-song.mp3')

export default function PondMusic({ onClose }: { onClose(): void }) {
  const { isEnabled, volume, holdMusic } = useSound()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [missing, setMissing] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    holdMusic(playing)
  }, [playing, holdMusic])
  useEffect(() => () => holdMusic(false), [holdMusic])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = isEnabled ? Math.min(1, volume * 1.5) : 0
  }, [isEnabled, volume])

  function toggle() {
    const audio = audioRef.current
    if (!audio || missing) return
    if (playing) audio.pause()
    else void audio.play().catch(() => setMissing(true))
  }

  const status = missing ? 'Song coming soon' : !isEnabled ? 'Sound is off' : playing ? 'Now playing' : 'Paused'

  return (
    <div className="pond-keepsake-dock" role="region" aria-label="MP3 player">
      <audio
        ref={audioRef}
        src={SONG}
        loop
        preload="metadata"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMissing(true)}
        onTimeUpdate={(event) => {
          const audio = event.currentTarget
          setProgress(audio.duration ? audio.currentTime / audio.duration : 0)
        }}
      />
      <img src={catchArt({ id: 'mp3-player' })} alt="" className="pond-keepsake-dock-art" />
      <div className="pond-keepsake-dock-info">
        <strong>Pond radio</strong>
        <span aria-live="polite">{status}</span>
        <span className="pond-journal-bar" aria-hidden="true">
          <span style={{ width: `${progress * 100}%` }} />
        </span>
      </div>
      <button
        type="button"
        className="pond-keepsake-round"
        onClick={toggle}
        disabled={missing}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? '❚❚' : '▶'}
      </button>
      <button type="button" className="pond-keepsake-round is-quiet" onClick={onClose} aria-label="Put the MP3 player away">
        ✕
      </button>
    </div>
  )
}
