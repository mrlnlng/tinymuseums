'use client'

import { createContext, useContext } from 'react'
import { usePathname } from 'next/navigation'
import { useBackgroundMusic } from '@/features/sound/hooks/useBackgroundMusic'
import { useSoundEffects, type EffectName } from '@/features/sound/hooks/useSoundEffects'

function hasMusic(pathname: string): boolean {
  return pathname === '/' || pathname === '/museum' || pathname.startsWith('/a/')
}

interface SoundState {
  isEnabled: boolean
  isSounding: boolean
  isAvailable: boolean
  volume: number
  setVolume: (value: number) => void
  toggle: () => void
  play: (name: EffectName) => void
  prepare: (name: EffectName) => void
  setWalking: (isWalking: boolean) => void
}

const SoundContext = createContext<SoundState>({
  isEnabled: false,
  isSounding: false,
  isAvailable: false,
  volume: 0,
  setVolume: () => {},
  toggle: () => {},
  play: () => {},
  prepare: () => {},
  setWalking: () => {},
})

export function useSound(): SoundState {
  return useContext(SoundContext)
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isInMuseum = hasMusic(pathname)

  const music = useBackgroundMusic({ isAllowed: isInMuseum })
  const effects = useSoundEffects(music.isEnabled && isInMuseum, music.volume)

  return (
    <SoundContext.Provider
      value={{
        isEnabled: music.isEnabled,
        isSounding: music.isSounding,
        isAvailable: music.isAvailable,
        volume: music.volume,
        setVolume: music.setVolume,
        toggle: music.toggle,
        play: effects.play,
        prepare: effects.prepare,
        setWalking: effects.setWalking,
      }}
    >
      <audio
        ref={music.audioRef}
        src={music.track}
        loop
        preload="metadata"
        onLoadedMetadata={music.handleLoadedMetadata}
        onError={music.handleError}
        onPlaying={music.handlePlaying}
        onPause={music.handlePaused}
      />
      {children}
    </SoundContext.Provider>
  )
}
