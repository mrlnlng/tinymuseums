'use client'

import { createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { useBackgroundMusic } from '@/features/sound/hooks/useBackgroundMusic'
import { useSoundEffects, type EffectName } from '@/features/sound/hooks/useSoundEffects'

/* Sound for the whole museum. Lives in the root layout so walking from the landing page into the hall does not restart the track. */

/*  Where the music belongs: the visitor's side of the product. The studio is an
    artist's workspace and the rest is paperwork — a confirmation page, an
    unsubscribe — and a soundtrack under either is somebody else's mood in your
    ears. Walking out of the museum fades it out; walking back in starts it
    again from wherever the track had got to. */
function hasMusic(pathname: string): boolean {
  return pathname === '/' || pathname === '/museum' || pathname.startsWith('/a/')
}

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
  const pathname = usePathname()
  const isInMuseum = hasMusic(pathname)

  const music = useBackgroundMusic({ isAllowed: isInMuseum })
  // Footsteps and taps are the museum's too, and they follow the same rule.
  const effects = useSoundEffects(music.isEnabled && isInMuseum)

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
