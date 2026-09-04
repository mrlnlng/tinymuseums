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
  /** The visitor's preference: whether they want the museum to have a sound. */
  isEnabled: boolean
  /*  What the speaker is drawn from: the preference, qualified by whether the
      track is genuinely audible on a screen that has one. A speaker showing its
      waves while the browser is still refusing to play is the museum saying
      something the visitor cannot hear. */
  isSounding: boolean
  isAvailable: boolean
  /** How loud, 0 to 1. Remembered across a mute, so unmuting comes back at it. */
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

  /*  Starts at the default rather than at silence. The preference is only
      readable once the client is running, and starting from `false` meant the
      speaker was drawn with its slash through it on every load and then
      corrected a frame later — the museum announcing itself as muted. Anyone
      who has actually muted it is corrected the same way, one frame later, and
      they at least already know what they chose. */
  const [isEnabled, setIsEnabled] = useState(DEFAULT_ENABLED)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  /*  Assumed present until the element says otherwise. It used to wait for
      `loadedmetadata`, which meant the speaker did not exist at all until the
      browser had got round to fetching the track — and a browser fetches
      nothing for a tab it is not showing. The museum was therefore offering no
      sound control on arrival while also behaving as though sound were on. */
  const [isFailed, setIsFailed] = useState(false)
  const [isReady, setIsReady] = useState(false)
  /** Set from the element's own play/pause events, never guessed. */
  const [isPlaying, setIsPlaying] = useState(false)

  /*  The frame loop that ramps the volume reads the target through a ref, so
      that changing the level does not rebuild the ramp itself. */
  const volumeRef = useRef(volume)
  volumeRef.current = volume

  /*  A hidden tab is not a quiet tab: the track goes on playing behind whatever
      the visitor switched to, which is the one place background music becomes
      somebody shouting from another room. The same is true of a window the
      visitor has clicked away from, which `visibilitychange` never reports —
      on a desktop the tab is still "visible" while the whole window sits behind
      something else — so window focus is watched alongside it. */
  const [isVisible, setIsVisible] = useState(true)
  const [isFocused, setIsFocused] = useState(true)

  /** Only a genuine load failure takes the control away. */
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

  /*  And with the window: leaving for another application is leaving the
      museum as far as anyone in earshot is concerned.

      A touch or a key counts as focus too, and has to. The window's own `focus`
      event only fires on a *change*, so a page that loads into an unfocused
      document — opened in a background window, or restored into one — starts
      with `hasFocus()` false and may never be told otherwise; without this the
      museum would sit silent for the whole visit while the visitor walked
      around it. Nobody types into a window they are not looking at. */
  const watchFocus = useCallback(() => {
    const onFocus = () => setIsFocused(true)
    const onBlur = () => setIsFocused(false)
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
  }, [])

  /*  What the element is actually doing, taken from the element. React state
      set optimistically alongside a `play()` call would be a guess: the promise
      resolves before the first sample is audible, and the browser may pause the
      track again on its own. */
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
  useEffect(() => watchPlayback(), [watchPlayback])

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

  /*  Four things have to be true to hear anything: the visitor wants music,
      this screen is one that has it, the tab is the one being looked at, and
      the window is the one being used. Muting and walking out of the museum
      fade; switching tabs does not, because a hidden tab is given no animation
      frames — the ramp would freeze part-way through and leave the track
      playing at half volume behind whatever the visitor went to look at.
      Nobody can hear a fade they have already left. */
  const shouldSound = isEnabled && isAllowed && isVisible && isFocused

  const applyPreference = useCallback(() => {
    const audio = audioRef.current
    if (!isReady || !audio) return

    if (shouldSound) {
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
  }, [shouldSound, isVisible, isReady, startPlayback, fadeTo])

  useEffect(() => applyPreference(), [applyPreference])

  /*  Arms playback on the first interaction, for as long as it takes. A browser
      will not start audio before a gesture, so between arriving and touching
      anything the museum is silent no matter what the preference says; the
      listeners stay bound until a `play()` actually succeeds.

      Bound whenever the track *should* be sounding but is not, rather than only
      once at mount: a gesture that lands before the browser is willing, a track
      that has not finished loading, or a return from another window all leave
      the museum needing another attempt, and each of those changes one of these
      dependencies. Not `{ once: true }` for the same reason — consuming the
      listener on a rejected attempt would stop the music ever starting. */
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
    /*  A gesture may already have happened — the tap that opened this screen —
        and the only thing missing may be the audio itself. When it arrives,
        try again without waiting for another touch. */
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

  /*  The slider writes straight to the element instead of ramping to it. A ramp
      is for a decision — muting, leaving the museum — and a ramp underneath a
      finger that is still moving fights the finger. */
  const applyVolume = useCallback(() => {
    const audio = audioRef.current
    if (!audio || audio.paused) return
    /*  Only while the museum is meant to be heard. Dragging the slider all the
        way down is muting, and muting fades out and then pauses — so a level
        written straight to the element there cancelled the ramp, and with it
        the pause the ramp ends in, leaving the track running silently for the
        rest of the visit. Setting the level and stopping the sound are two
        different intentions and only one of them belongs here. */
    if (!shouldSound) return
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    fadeRef.current = null
    audio.volume = volume
  }, [volume, shouldSound])

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

  /*  What the speaker draws, and the thing the toggle flips. On a screen that
      has music it is the fact — the track is audible or it is not. On a screen
      that has none (the studio, a confirmation page) there is nothing to be a
      fact about, so it falls back to the preference and the speaker keeps
      reading the way the visitor left it.

      This is what makes the control honest on arrival: browsers refuse audio
      until the page has been touched, so a museum drawn "on" before anyone has
      touched it is promising a sound nobody can hear. */
  const isSounding = isEnabled && (isPlaying || !isAllowed)

  const toggle = useCallback(() => {
    /*  Against what can be heard, not against the stored preference. If the
        preference already says on and the browser has simply not let the track
        start, the visitor is looking at a muted speaker and means "start" by
        tapping it — and that tap is itself the gesture the browser was waiting
        for. Flipping the preference to off there would mute a silence. */
    const next = !isSounding
    setEnabled(next)
    /*  Turning the sound back on when the slider was dragged all the way down
        would be turning on silence, and the speaker would then be lying about
        what it had done. */
    if (next && volume === 0) {
      setVolumeState(DEFAULT_VOLUME)
      remember(VOLUME_KEY, String(DEFAULT_VOLUME))
    }
  }, [isSounding, volume, setEnabled, remember])

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
