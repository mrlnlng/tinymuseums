'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isRouted,
  resumeGain,
  routeThroughGain,
  setGainLevel,
  suspendGain,
} from '@/features/sound/lib/output'

const TRACK = process.env.NEXT_PUBLIC_MUSIC_URL ?? '/audio/hall.mp3'
const STORAGE_KEY = 'tm_sound'
const VOLUME_KEY = 'tm_volume'
const DEFAULT_VOLUME = 0.32

const MUSIC_MIX = 0.38
const FADE_MS = 600
const DEFAULT_ENABLED = true

// Older Safari only reports visibility under the webkit prefix.
const VISIBILITY_EVENTS = ['visibilitychange', 'webkitvisibilitychange'] as const

function isDocumentHidden(): boolean {
  if (typeof document === 'undefined') return false
  const prefixed = (document as Document & { webkitHidden?: boolean }).webkitHidden
  return document.hidden === true || prefixed === true
}

function clampVolume(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_VOLUME
  return Math.min(1, Math.max(0, value))
}

interface Options {
  isAllowed: boolean
}

export interface BackgroundMusic {
  isEnabled: boolean
  isSounding: boolean
  isAvailable: boolean
  volume: number
  setVolume: (value: number) => void
  toggle: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
  handleLoadedMetadata: () => void
  handleError: () => void
  handlePlaying: () => void
  handlePaused: () => void
  track: string
}

export function useBackgroundMusic({ isAllowed }: Options): BackgroundMusic {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)

  const [isEnabled, setIsEnabled] = useState(DEFAULT_ENABLED)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const [isFailed, setIsFailed] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const volumeRef = useRef(volume)
  volumeRef.current = volume

  const [isVisible, setIsVisible] = useState(true)
  const [isFocused, setIsFocused] = useState(true)
  const [isPageShown, setIsPageShown] = useState(true)

  const outputRef = useRef(1)

  const setOutput = useCallback((value: number) => {
    const clamped = value < 0 ? 0 : value > 1 ? 1 : value
    outputRef.current = clamped
    const audio = audioRef.current
    if (isRouted(audio)) {
      setGainLevel(clamped)
      return
    }
    if (audio) audio.volume = clamped * MUSIC_MIX
  }, [])

  const detectFailure = useCallback(() => {
    const audio = audioRef.current
    if (audio?.error) setIsFailed(true)
  }, [])

  const restorePreference = useCallback(() => {
    let stored: string | null = null
    let storedVolume: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
      storedVolume = window.localStorage.getItem(VOLUME_KEY)
    } catch {}
    setIsEnabled(stored === null ? DEFAULT_ENABLED : stored === 'on')
    if (storedVolume !== null) setVolumeState(clampVolume(Number(storedVolume)))
    setIsReady(true)
  }, [])

  const silence = useCallback(() => {
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    fadeRef.current = null
    audioRef.current?.pause()
    suspendGain()
  }, [])

  const watchVisibility = useCallback(() => {
    const onChange = () => {
      const isShowing = !isDocumentHidden()
      setIsVisible(isShowing)
      if (!isShowing) silence()
    }
    onChange()
    for (const event of VISIBILITY_EVENTS) document.addEventListener(event, onChange)
    return () => {
      for (const event of VISIBILITY_EVENTS) document.removeEventListener(event, onChange)
    }
  }, [silence])

  // iOS does not always fire visibilitychange when switching apps; losing focus covers it.
  const watchFocus = useCallback(() => {
    const onFocus = () => setIsFocused(true)
    const onBlur = () => {
      setIsFocused(false)
      silence()
    }
    setIsFocused(document.hasFocus())

    window.addEventListener('focus', onFocus)
    window.addEventListener('blur', onBlur)
    for (const event of ['pointerdown', 'keydown', 'touchstart'] as const) {
      document.addEventListener(event, onFocus, { passive: true })
    }

    return () => {
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('blur', onBlur)
      for (const event of ['pointerdown', 'keydown', 'touchstart'] as const) {
        document.removeEventListener(event, onFocus)
      }
    }
  }, [silence])

  // Navigating away can fire neither visibilitychange nor blur.
  const watchPageHide = useCallback(() => {
    const onHide = () => {
      setIsPageShown(false)
      silence()
    }
    const onShow = () => setIsPageShown(true)

    window.addEventListener('pagehide', onHide)
    window.addEventListener('pageshow', onShow)
    document.addEventListener('freeze', silence)
    return () => {
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('pageshow', onShow)
      document.removeEventListener('freeze', silence)
    }
  }, [silence])

  const watchPlayback = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return undefined

    const onPlaying = () => setIsPlaying(true)
    const onStopped = () => setIsPlaying(false)

    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onStopped)
    audio.addEventListener('ended', onStopped)
    setIsPlaying(!audio.paused)

    return () => {
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onStopped)
      audio.removeEventListener('ended', onStopped)
    }
  }, [])

  useEffect(() => detectFailure(), [detectFailure])
  useEffect(() => restorePreference(), [restorePreference])
  useEffect(() => watchVisibility(), [watchVisibility])
  useEffect(() => watchFocus(), [watchFocus])
  useEffect(() => watchPageHide(), [watchPageHide])
  useEffect(() => watchPlayback(), [watchPlayback])

  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)

    const from = outputRef.current
    const startedAt = performance.now()

    const step = (now: number) => {
      const t = Math.min(1, (now - startedAt) / FADE_MS)
      setOutput(from + (target - from) * t)
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step)
        return
      }
      fadeRef.current = null
      onDone?.()
    }
    fadeRef.current = requestAnimationFrame(step)
  }, [])

  const startPlayback = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false

    resumeGain()

    if (!audio.paused) return true

    routeThroughGain(audio, MUSIC_MIX)

    setOutput(0)
    try {
      await audio.play()
      fadeTo(volumeRef.current)
      return true
    } catch {
      return false
    }
  }, [fadeTo, setOutput])

  const shouldSound = isEnabled && isAllowed && isVisible && isFocused && isPageShown

  const applyPreference = useCallback(() => {
    const audio = audioRef.current
    if (!isReady || !audio) return

    if (shouldSound) {
      void startPlayback()
      return
    }
    if (audio.paused) return

    // A hidden page may never run the animation frames a fade needs.
    if (!isVisible) {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
      fadeRef.current = null
      audio.pause()
      return
    }
    fadeTo(0, () => audio.pause())
  }, [shouldSound, isVisible, isReady, startPlayback, fadeTo])

  useEffect(() => applyPreference(), [applyPreference])

  // Browsers refuse to start audio before a user gesture.
  const armPlaybackOnGesture = useCallback(() => {
    if (!isReady || !shouldSound || isPlaying) return undefined

    const events = ['pointerdown', 'pointerup', 'keydown', 'touchend', 'click'] as const
    const audio = audioRef.current
    let done = false

    const unlock = async () => {
      if (done || !(await startPlayback())) return
      done = true
      for (const event of events) document.removeEventListener(event, unlock)
      audio?.removeEventListener('canplay', unlock)
    }

    for (const event of events) document.addEventListener(event, unlock, { passive: true })
    audio?.addEventListener('canplay', unlock)

    return () => {
      for (const event of events) document.removeEventListener(event, unlock)
      audio?.removeEventListener('canplay', unlock)
    }
  }, [isReady, shouldSound, isPlaying, startPlayback])

  useEffect(() => armPlaybackOnGesture(), [armPlaybackOnGesture])

  useEffect(() => {
    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  const applyVolume = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.paused) return
    if (!shouldSound) return
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    fadeRef.current = null
    setOutput(volume)
  }, [volume, shouldSound, setOutput])

  useEffect(() => applyVolume(), [applyVolume])

  const remember = useCallback((key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value)
    } catch {}
  }, [])

  const setEnabled = useCallback(
    (next: boolean) => {
      setIsEnabled(next)
      remember(STORAGE_KEY, next ? 'on' : 'off')
    },
    [remember],
  )

  const isSounding = isEnabled && (isPlaying || !isAllowed)

  const toggle = useCallback(() => {
    const next = !isSounding
    setEnabled(next)
    if (next && volume === 0) {
      setVolumeState(DEFAULT_VOLUME)
      remember(VOLUME_KEY, String(DEFAULT_VOLUME))
    }
  }, [isSounding, volume, setEnabled, remember])

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
    isSounding,
    isAvailable: !isFailed,
    volume,
    setVolume,
    toggle,
    audioRef,
    track: TRACK,
    handleLoadedMetadata: () => setIsFailed(false),
    handleError: () => setIsFailed(true),
    handlePlaying: () => setIsPlaying(true),
    handlePaused: () => setIsPlaying(false),
  }
}
