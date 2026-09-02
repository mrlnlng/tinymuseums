'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* The museum's background track — more than an `<audio autoplay loop>`: browsers refuse audio before a gesture, the element must outlive navigation, and the preference has to survive the visit. */

const TRACK = process.env.NEXT_PUBLIC_MUSIC_URL ?? '/audio/hall.mp3'
const STORAGE_KEY = 'tm_sound'
const VOLUME_KEY = 'tm_volume'
const DEFAULT_VOLUME = 0.32
const FADE_MS = 600
const DEFAULT_ENABLED = true

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_VOLUME
  return Math.min(1, Math.max(0, value))
}

interface Options {
  /*  Whether music belongs on this screen at all. Separate from the visitor's
      preference: the speaker still reads "on" in the studio, because the
      preference has not changed — there is simply nothing playing there. */
  isAllowed: boolean
}

export interface BackgroundMusic {
  isEnabled: boolean
  isAvailable: boolean
  /** How loud, 0 to 1. Remembered across a mute, so unmuting comes back at it. */
  volume: number
  setVolume: (value: number) => void
  toggle: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  handleLoadedMetadata: () => void
  handleError: () => void
  track: string
}

export function useBackgroundMusic({ isAllowed }: Options): BackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)

  /*  Starts at the default rather than at silence. The preference is only
      readable once the client is running, and starting from `false` meant the
      speaker was drawn with its slash through it on every load and then
      corrected a frame later — the museum announcing itself as muted. Anyone
      who has actually muted it is corrected the same way, one frame later, and
      they at least already know what they chose. */
  const [isEnabled, setIsEnabled] = useState(DEFAULT_ENABLED)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isReady, setIsReady] = useState(false)

  /*  The frame loop that ramps the volume reads the target through a ref, so
      that changing the level does not rebuild the ramp itself. */
  const volumeRef = useRef(volume)
  volumeRef.current = volume

  /*  A hidden tab is not a quiet tab: the track goes on playing behind whatever
      the visitor switched to, which is the one place background music becomes
      somebody shouting from another room. */
  const [isVisible, setIsVisible] = useState(true)

  /*  `loadedmetadata` can fire before React attaches the handler; checking readyState at mount covers that race — the toggle never appeared otherwise. */
  const detectAvailability = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.readyState >= 1) setIsAvailable(true)
    else if (audio.error) setIsAvailable(false)
  }, [])

  const restorePreference = useCallback(() => {
    let stored: string | null = null
    let storedVolume: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
      storedVolume = window.localStorage.getItem(VOLUME_KEY)
    } catch {
      // Private mode, or storage disabled. Fall through to the defaults.
    }
    setIsEnabled(stored === null ? DEFAULT_ENABLED : stored === 'on')
    if (storedVolume !== null) setVolumeState(clampVolume(Number(storedVolume)))
    setIsReady(true)
  }, [])

  /** Pauses with the tab and picks up where it left off on the way back. */
  const watchVisibility = useCallback(() => {
    const onChange = () => setIsVisible(document.visibilityState !== 'hidden')
    onChange()
    document.addEventListener('visibilitychange', onChange)
    return () => document.removeEventListener('visibilitychange', onChange)
  }, [])

  useEffect(() => detectAvailability(), [detectAvailability])
  useEffect(() => restorePreference(), [restorePreference])
  useEffect(() => watchVisibility(), [watchVisibility])

  /** Ramps volume rather than cutting, so toggling does not feel like a switch. */
  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)

    const from = audio.volume
    const startedAt = performance.now()

    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / FADE_MS)
      audio.volume = from + (target - from) * t
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step)
        return
      }
      fadeRef.current = null
      onDone?.()
    }
    fadeRef.current = requestAnimationFrame(step)
  }, [])

  /** Resolves true once audio is genuinely playing. */
  const startPlayback = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false
    if (!audio.paused) return true

    audio.volume = 0
    try {
      await audio.play()
      fadeTo(volumeRef.current)
      return true
    } catch {
      // Blocked: no gesture has happened yet.
      return false
    }
  }, [fadeTo])

  /*  Three things have to be true to hear anything: the visitor wants music,
      this screen is one that has it, and the tab is the one being looked at.
      Muting and walking out of the museum fade; switching tabs does not, because
      a hidden tab is given no animation frames — the ramp would freeze part-way
      through and leave the track playing at half volume behind whatever the
      visitor went to look at. Nobody can hear a fade they have already left. */
  const applyPreference = useCallback(() => {
    const audio = audioRef.current
    if (!isReady || !audio) return

    if (isEnabled && isAllowed && isVisible) {
      void startPlayback()
      return
    }
    if (audio.paused) return

    if (!isVisible) {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
      fadeRef.current = null
      audio.pause()
      return
    }
    fadeTo(0, () => audio.pause())
  }, [isEnabled, isAllowed, isVisible, isReady, startPlayback, fadeTo])

  useEffect(() => applyPreference(), [applyPreference])

  /* Arms playback on the first interaction. Not `{ once: true }` — the first gesture can land before the browser allows playback, and consuming the listener would stop the music ever starting. */
  const armPlaybackOnGesture = useCallback(() => {
    if (!isReady || !isEnabled || !isAllowed || !isVisible) return undefined

    const events = ['pointerdown', 'keydown', 'touchstart'] as const
    let done = false

    const unlock = async () => {
      if (done || !(await startPlayback())) return
      done = true
      for (const event of events) document.removeEventListener(event, unlock)
    }

    for (const event of events) document.addEventListener(event, unlock, { passive: true })
    return () => {
      for (const event of events) document.removeEventListener(event, unlock)
    }
  }, [isReady, isEnabled, isAllowed, isVisible, startPlayback])

  useEffect(() => armPlaybackOnGesture(), [armPlaybackOnGesture])

  useEffect(() => {
    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  /*  The slider writes straight to the element instead of ramping to it. A ramp
      is for a decision — muting, leaving the museum — and a ramp underneath a
      finger that is still moving fights the finger. */
  const applyVolume = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.paused) return
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    fadeRef.current = null
    audio.volume = volume
  }, [volume])

  useEffect(() => applyVolume(), [applyVolume])

  const remember = useCallback((key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      // The preference simply will not persist.
    }
  }, [])

  const setEnabled = useCallback(
    (next: boolean) => {
      setIsEnabled(next)
      remember(STORAGE_KEY, next ? 'on' : 'off')
    },
    [remember],
  )

  const toggle = useCallback(() => {
    const next = !isEnabled
    setEnabled(next)
    /*  Turning the sound back on when the slider was dragged all the way down
        would be turning on silence, and the speaker would then be lying about
        what it had done. */
    if (next && volume === 0) {
      setVolumeState(DEFAULT_VOLUME)
      remember(VOLUME_KEY, String(DEFAULT_VOLUME))
    }
  }, [isEnabled, volume, setEnabled, remember])

  /*  The slider and the speaker are two ways of saying the same thing, so they
      agree: dragging off zero turns the sound back on, and dragging to zero is
      muting. The level itself is kept through a mute, so the speaker brings the
      music back at the volume it was left at rather than at full. */
  const setVolume = useCallback(
    (value: number) => {
      const next = clampVolume(value)
      setVolumeState(next)
      remember(VOLUME_KEY, String(next))
      if (next > 0 && !isEnabled) setEnabled(true)
      else if (next === 0 && isEnabled) setEnabled(false)
    },
    [isEnabled, remember, setEnabled],
  )

  return {
    isEnabled,
    isAvailable,
    volume,
    setVolume,
    toggle,
    audioRef,
    track: TRACK,
    handleLoadedMetadata: () => setIsAvailable(true),
    handleError: () => setIsAvailable(false),
  }
}
