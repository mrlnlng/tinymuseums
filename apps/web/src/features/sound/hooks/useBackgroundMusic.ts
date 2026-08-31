'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/* The museum's background track — more than an `<audio autoplay loop>`: browsers refuse audio before a gesture, the element must outlive navigation, and the preference has to survive the visit. */

const TRACK = process.env.NEXT_PUBLIC_MUSIC_URL ?? '/audio/hall.mp3'
const STORAGE_KEY = 'tm_sound'
const TARGET_VOLUME = 0.32
const FADE_MS = 600
const DEFAULT_ENABLED = true

export interface BackgroundMusic {
  isEnabled: boolean
  isAvailable: boolean
  toggle: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  handleLoadedMetadata: () => void
  handleError: () => void
  track: string
}

export function useBackgroundMusic(): BackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)

  const [isEnabled, setIsEnabled] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)
  const [isReady, setIsReady] = useState(false)

  /*  `loadedmetadata` can fire before React attaches the handler; checking readyState at mount covers that race — the toggle never appeared otherwise. */
  const detectAvailability = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.readyState >= 1) setIsAvailable(true)
    else if (audio.error) setIsAvailable(false)
  }, [])

  const restorePreference = useCallback(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // Private mode, or storage disabled. Fall through to the default.
    }
    setIsEnabled(stored === null ? DEFAULT_ENABLED : stored === 'on')
    setIsReady(true)
  }, [])

  useEffect(() => detectAvailability(), [detectAvailability])
  useEffect(() => restorePreference(), [restorePreference])

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
      fadeTo(TARGET_VOLUME)
      return true
    } catch {
      // Blocked: no gesture has happened yet.
      return false
    }
  }, [fadeTo])

  const applyPreference = useCallback(() => {
    const audio = audioRef.current
    if (!isReady || !audio) return
    if (isEnabled) void startPlayback()
    else if (!audio.paused) fadeTo(0, () => audio.pause())
  }, [isEnabled, isReady, startPlayback, fadeTo])

  useEffect(() => applyPreference(), [applyPreference])

  /* Arms playback on the first interaction. Not `{ once: true }` — the first gesture can land before the browser allows playback, and consuming the listener would stop the music ever starting. */
  const armPlaybackOnGesture = useCallback(() => {
    if (!isReady || !isEnabled) return undefined

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
  }, [isReady, isEnabled, startPlayback])

  useEffect(() => armPlaybackOnGesture(), [armPlaybackOnGesture])

  useEffect(() => {
    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  const toggle = useCallback(() => {
    setIsEnabled((was) => {
      const next = !was
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      } catch {
        // The preference simply will not persist.
      }
      return next
    })
  }, [])

  return {
    isEnabled,
    isAvailable,
    toggle,
    audioRef,
    track: TRACK,
    handleLoadedMetadata: () => setIsAvailable(true),
    handleError: () => setIsAvailable(false),
  }
}
