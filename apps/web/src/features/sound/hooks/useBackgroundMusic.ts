'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  isRouted,
  resumeGain,
  routeThroughGain,
  setGainLevel,
  suspendGain,
} from '@/features/sound/lib/output'

/* The museum's background track — more than an `<audio autoplay loop>`: browsers refuse audio before a gesture, the element must outlive navigation, and the preference has to survive the visit. */

const TRACK = process.env.NEXT_PUBLIC_MUSIC_URL ?? '/audio/hall.mp3'
const STORAGE_KEY = 'tm_sound'
const VOLUME_KEY = 'tm_volume'
const DEFAULT_VOLUME = 0.32

/*  The track's own place in the mix, below everything the museum does on
    purpose.

    Until now it had none: the speaker's level was written straight onto the
    track, while every effect was that same level scaled by a balance of its
    own. That makes the music the loudest thing in the building by
    construction — nothing with a balance under 1 can ever reach it — and the
    harp, the quietest recording of the set, came out a full seven decibels
    under the soundtrack it was supposed to be heard over.

    So the track takes a balance like everything else, and the speaker's level
    goes back to being the master it reads as. At this figure the music sits
    about five decibels under the sounds the visitor causes, which leaves it
    audible as a room tone without competing with a tapped harp. */
const MUSIC_MIX = 0.38
const FADE_MS = 600
const DEFAULT_ENABLED = true

/*  Safari carried the Page Visibility API under a prefix for a long time, and
    the versions that did fire only the prefixed event are exactly the ones
    this bug was reported against: a phone that leaves for another application
    while the museum listens for the unprefixed name alone is a phone that is
    never told. Both names are bound and both spellings of the answer are
    read, which costs nothing where only the standard one exists. */
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
  /*  And whether the page is still the one being shown at all. Leaving the site
      — following a link out, or the browser's own back — does not always tear
      the page down: it is frozen into the back/forward cache instead, and a
      frozen page is one that has stopped being told anything. On the platform
      where that matters most it can keep its audio element playing while the
      visitor reads somebody else's website, with no tab left on screen to
      explain where the music is coming from and nothing running that could
      stop it. See `watchPageHide`. */
  const [isPageShown, setIsPageShown] = useState(true)

  /*  Where the level is written, and the one place that knows there is a
      choice. On most platforms it is the element's own volume; on iOS, where
      that setter does nothing, it is a gain node the element has been routed
      through. Fades and the slider both come through here, so neither has to
      know which — and the last value written is kept, because a fade needs to
      know where it is starting from and the element can no longer be asked. */
  const outputRef = useRef(1)

  const setOutput = useCallback((value: number) => {
    /*  A ramp can step a hair past its ends (an interrupted fade resumes from a
        value that has already crossed zero), and a volume outside [0, 1] makes
        the element's setter throw. Clamping here keeps the audio element, the
        gain node and the recorded output all inside the range the platform
        accepts. */
    const clamped = value < 0 ? 0 : value > 1 ? 1 : value
    /*  Recorded before the track's own balance is applied, because this is
        what a fade ramps between: fades and the slider both speak in the
        museum's level, and only the write at the end of it is the music's. */
    outputRef.current = clamped
    const audio = audioRef.current
    if (isRouted(audio)) {
      /*  The master carries the museum's level unscaled — it is the level the
          effects ride on too, and turning the music down must not turn them
          down with it. On this path the track's balance is a gain of its own,
          set when it was routed. */
      setGainLevel(clamped)
      return
    }
    if (audio) audio.volume = clamped * MUSIC_MIX
  }, [])

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

  /*  Stopping the sound this instant, in the handler that heard the visitor
      go. Everything that means they have left calls this and nothing else,
      because every departure has the same two properties: it is the last
      moment this page is certainly running, and there is nobody left to hear
      anything gradual.

      Nothing here is scheduled. No state to be read by an effect, because a
      backgrounded page may never commit one; no fade, because a fade is driven
      by animation frames and those stop on the way out, which is how the track
      came to be left running at half volume behind whatever the visitor had
      switched to. The one thing a departing page can still do reliably is the
      thing it does synchronously, before it returns.

      The context is suspended as well as the element paused. On the platform
      that routes everything through the graph, that is the difference between
      stopping the source and stopping the output: pausing each element is a
      list that can be wrong, while a suspended context cannot be what anyone
      is still hearing. */
  const silence = useCallback(() => {
    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    fadeRef.current = null
    audioRef.current?.pause()
    suspendGain()
  }, [])

  /*  Pauses with the tab and picks up where it left off on the way back.

      The pause happens here, in the handler, and not by letting the state
      change reach `applyPreference` — the same reason `pagehide` does it by
      hand. A phone that has just been sent to its home screen, or a tab that
      has just gone to the background, is a page the browser is entitled to
      stop giving work to: React may not commit, effects may not run, and
      animation frames stop altogether. Every one of those is a way for a pause
      that was going to happen next render to simply never happen, and what the
      visitor hears then is a museum playing on behind whatever they went to
      look at.

      Straight to `pause` rather than through a fade, for the same reason and
      one more: a fade is driven by animation frames, and on the way out of a
      page those stop mid-ramp. That left the track running at whatever volume
      the ramp had reached when the lights went out — quieter, which is worse
      than either alternative, because it is still playing and now sounds like
      it is doing it on purpose. Nobody can hear a fade they have already
      left. */
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
    /*  This is the one that matters on a phone. Switching applications does
        not reliably hide the document — a browser showing a tab in the task
        switcher can consider itself perfectly visible, and iOS in particular
        will not always report `visibilitychange` on the way to another app —
        but the window does lose focus, every time. Left to fade, that was the
        departure the museum kept playing through. */
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

  /*  Leaving the site, which is the one departure the two watchers above cannot
      see. A tab that is closed or navigated away takes its audio with it, but a
      page frozen into the back/forward cache keeps everything it had —
      `visibilitychange` may never fire, `blur` may never fire, and nothing else
      is going to run until the visitor comes back.

      So the element is paused here, in the handler, rather than by letting a
      state change reach the effect below: after `pagehide` this page may be
      given no further work at all, and a pause scheduled for the next render is
      a pause that never happens. There is no fade for the same reason, and it
      would be a fade nobody is left to hear.

      `pageshow` is the other half: a restored page has been playing nothing
      since it left, and without something changing back, `applyPreference` has
      no reason to run and the museum would stay silent for the rest of the
      visit. */
  const watchPageHide = useCallback(() => {
    const onHide = () => {
      setIsPageShown(false)
      silence()
    }
    const onShow = () => setIsPageShown(true)

    window.addEventListener('pagehide', onHide)
    window.addEventListener('pageshow', onShow)
    /*  `freeze` is the browser saying outright that it is about to stop giving
        this page any work at all. Nothing after it runs until `resume`, so it
        is the last call anyone gets. */
    document.addEventListener('freeze', silence)
    return () => {
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('pageshow', onShow)
      document.removeEventListener('freeze', silence)
    }
  }, [silence])

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
  useEffect(() => watchPageHide(), [watchPageHide])
  useEffect(() => watchPlayback(), [watchPlayback])

  /** Ramps volume rather than cutting, so toggling does not feel like a switch. */
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

  /** Resolves true once audio is genuinely playing. */
  const startPlayback = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false

    /*  Before anything else, including the shortcut below: coming back from
        the background leaves the context interrupted, and an interrupted
        context with an element still playing through it is a track that is
        running and inaudible. The one case that must not take the shortcut is
        exactly the case the shortcut is for. */
    resumeGain()

    if (!audio.paused) return true

    /*  The track goes through the graph wherever it can, and the graph is
        built and woken here: this runs from the gesture that is allowed to
        start audio, which is also the only kind of moment a browser will let
        an AudioContext run in.

        Wherever it can, rather than only where the element's volume was found
        to be locked. That test decides a real question — whether writing
        `volume` does anything — but it was being used to answer a different
        one, and on an iPhone it answered it wrongly: the probe reported the
        volume writable, so the track stayed an ordinary media element, and two
        things followed from that. The museum's slider moved nothing, because
        iOS ignores the volume it was writing. And pressing the home button did
        not stop the music, because iOS keeps a media element playing in the
        background on purpose while it freezes the page's script — so no
        handler of ours was ever going to get the chance to pause it.

        A graph is the answer to both, and not by trying harder: an
        AudioContext is suspended by iOS the moment the page goes to the
        background, which stops the sound without this page having to still be
        running to do it. The level lands somewhere that works on the way in,
        and the platform silences it on the way out.

        Routing still refuses a track from another origin, which would come out
        of a graph silent, and a refusal simply leaves it on the element path
        where it plays as it always did. */
    routeThroughGain(audio, MUSIC_MIX)

    setOutput(0)
    try {
      await audio.play()
      fadeTo(volumeRef.current)
      return true
    } catch {
      // Blocked: no gesture has happened yet.
      return false
    }
  }, [fadeTo, setOutput])

  /*  Five things have to be true to hear anything: the visitor wants music,
      this screen is one that has it, the tab is the one being looked at, the
      window is the one being used, and the page has not been left behind
      altogether. Muting and walking out of the museum fade; switching tabs does
      not, because a hidden tab is given no animation frames — the ramp would
      freeze part-way through and leave the track playing at half volume behind
      whatever the visitor went to look at. Nobody can hear a fade they have
      already left. */
  const shouldSound = isEnabled && isAllowed && isVisible && isFocused && isPageShown

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
    setOutput(volume)
  }, [volume, shouldSound, setOutput])

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
