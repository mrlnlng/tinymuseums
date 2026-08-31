'use client'

import { createContext, useContext } from 'react'
import { useBackgroundMusic } from '@/features/sound/hooks/useBackgroundMusic'
import { useSoundEffects, type EffectName } from '@/features/sound/hooks/useSoundEffects'

/* Sound for the whole museum. Lives in the root layout so walking from the landing page into the hall does not restart the track. */

interface SoundState {
  isEnabled: boolean
  isAvailable: boolean
  toggle: () => void
  play: (name: EffectName) => void
  setWalking: (isWalking: boolean) => void
}

const SoundContext = createContext<SoundState>({
  isEnabled: false,
  isAvailable: false,
  toggle: () => {},
  play: () => {},
  setWalking: () => {},
})

export function useSound(): SoundState {
  return useContext(SoundContext)
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const music = useBackgroundMusic()
  const effects = useSoundEffects(music.isEnabled)

  return (
    <SoundContext.Provider
      value={{
        isEnabled: music.isEnabled,
        isAvailable: music.isAvailable,
        toggle: music.toggle,
        play: effects.play,
        setWalking: effects.setWalking,
      }}
    >
      <audio
        ref={music.audioRef}
        src={music.track}
        loop
        // Never "auto": the track is long, and auto pulls megabytes before
        // anyone has asked to hear anything. Playback streams once it starts.
        preload="metadata"
        onLoadedMetadata={music.handleLoadedMetadata}
        onError={music.handleError}
      />
      {children}
    </SoundContext.Provider>
  )
}
