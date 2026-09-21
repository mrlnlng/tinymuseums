'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useFirstGesture } from '@/features/sound/lib/gesture'
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
  setWalking: () => {},
})

export function useSound(): SoundState {
  return useContext(SoundContext)
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isInMuseum = hasMusic(pathname)

  const hasGestured = useFirstGesture()

  // The track is a couple of megabytes, so it waits for the browser to go idle
  // rather than streaming while the hall is still fetching its own textures.
  const [canStream, setCanStream] = useState(false)
  useEffect(() => {
    if (!hasGestured || canStream) return
    const idle = window.requestIdleCallback ?? ((fn: () => void) => window.setTimeout(fn, 3000))
    const cancel = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(() => setCanStream(true), { timeout: 8000 })
    return () => cancel(handle as number)
  }, [hasGestured, canStream])

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
        setWalking: effects.setWalking,
      }}
    >
      <audio
        ref={music.audioRef}
        src={canStream ? music.track : undefined}
        loop
        preload="none"
        onLoadedMetadata={music.handleLoadedMetadata}
        onError={music.handleError}
        onPlaying={music.handlePlaying}
        onPause={music.handlePaused}
      />
      {children}
    </SoundContext.Provider>
  )
}
