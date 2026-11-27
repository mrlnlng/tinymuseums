'use client'

import { createContext, useContext, useState } from 'react'
import { usePathname } from 'next/navigation'
import { staticUrl } from '@/shared/lib/static'
import { isPublicPage } from '@/shared/lib/public-page'
import { useBackgroundMusic } from '@/features/sound/hooks/useBackgroundMusic'
import { useSoundEffects, type EffectName } from '@/features/sound/hooks/useSoundEffects'

const HALL_TRACK = process.env.NEXT_PUBLIC_MUSIC_URL ?? staticUrl('/audio/hall.mp3')
const ATELIER_TRACK = process.env.NEXT_PUBLIC_ATELIER_MUSIC_URL ?? staticUrl('/audio/atelier.mp3')
const POND_TRACK = process.env.NEXT_PUBLIC_POND_MUSIC_URL ?? staticUrl('/audio/pond.mp3')
const ROOM_TRACK = process.env.NEXT_PUBLIC_ROOM_MUSIC_URL ?? staticUrl('/audio/room.mp3')

/** The pond and the visitors' own rooms sound too, though they are not tracked as public pages. */
function hasSound(pathname: string): boolean {
  return isPublicPage(pathname) || pathname === '/museum/pond' || pathname === '/museum/home' || pathname.startsWith('/museum/r/')
}

function trackFor(pathname: string): string {
  if (pathname === '/' || pathname === '/museum/atelier') return ATELIER_TRACK
  if (pathname === '/museum/pond') return POND_TRACK
  if (pathname === '/museum/home' || pathname.startsWith('/museum/r/')) return ROOM_TRACK
  return HALL_TRACK
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
  /** Fades the background track out while something else, like the pond's MP3 player, is playing. */
  holdMusic: (isHeld: boolean) => void
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
  holdMusic: () => {},
})

export function useSound(): SoundState {
  return useContext(SoundContext)
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isInMuseum = hasSound(pathname)

  const track = trackFor(pathname)
  const [isHeld, setIsHeld] = useState(false)
  const music = useBackgroundMusic({ isAllowed: isInMuseum && !isHeld, track })
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
        holdMusic: setIsHeld,
      }}
    >
      <audio
        ref={music.audioRef}
        crossOrigin="anonymous"
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
