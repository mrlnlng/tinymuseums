'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'

/**
 * Background music for the museum.
 *
 * Three things make this less trivial than an <audio autoplay loop>:
 *
 * 1. Browsers refuse to start audio before a user gesture. So playback is
 *    armed on the first real interaction — tapping "Start visit", or the
 *    toggle itself — rather than on mount, and a rejected play() is caught and
 *    reflected in the UI instead of failing silently.
 *
 * 2. The element lives in the root layout, so walking from the landing page
 *    into the hall does not restart the track. App Router layouts persist
 *    across navigation; a page-level <audio> would cut every time.
 *
 * 3. The preference outlives the visit, in localStorage, because being asked
 *    to re-mute on every page is worse than no music at all.
 *
 * If the track is missing the element errors, the toggle hides itself, and
 * nothing else notices.
 */

/**
 * The track is ~54MB of streamed audio, so it does not belong in the app
 * bundle in production — point this at CloudFront and let the CDN serve it
 * with range requests, exactly like every other piece of media.
 */
const TRACK = process.env.NEXT_PUBLIC_MUSIC_URL ?? '/audio/hall.mp3'
const STORAGE_KEY = 'tm_sound'

/** Background music is background: loud enough to notice, quiet enough to ignore. */
const TARGET_VOLUME = 0.32
const FADE_MS = 600

/**
 * Whether a first-time visitor gets music. The mockups show an un-muted
 * speaker, so this is on — but it is one word to flip if unprompted audio on
 * someone's phone in public feels wrong.
 */
const DEFAULT_ENABLED = true

/**
 * Short effects, kept separate from the music.
 *
 * Each is a small file loaded once and replayed, and each is gated on the same
 * preference as the music: someone who muted the museum did not mute the
 * soundtrack, they muted the museum.
 */
const EFFECTS = {
  click: { file: '/audio/sfx-click.mp3', volume: 0.45 },
  'painting-open': { file: '/audio/sfx-painting-open.mp3', volume: 0.55 },
} as const

export type EffectName = keyof typeof EFFECTS

const FOOTSTEPS = { file: '/audio/sfx-footsteps.mp3', volume: 0.3 }

interface SoundState {
  enabled: boolean
  available: boolean
  toggle: () => void
  /** Fire a one-shot effect. Safe to call before anything has loaded. */
  play: (name: EffectName) => void
  /** Footsteps loop while this is true and stop when it goes false. */
  setWalking: (walking: boolean) => void
}

const SoundContext = createContext<SoundState>({
  enabled: false,
  available: false,
  toggle: () => {},
  play: () => {},
  setWalking: () => {},
})

export function useSound(): SoundState {
  return useContext(SoundContext)
}

export default function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<number | null>(null)

  const [enabled, setEnabled] = useState(false)
  /**
   * Starts false and turns on once the track's metadata loads. Starting true
   * would render the toggle server-side and then yank it away when a missing
   * file errors — a control that flashes and vanishes is worse than one that
   * arrives a moment late.
   */
  const [available, setAvailable] = useState(false)
  const [ready, setReady] = useState(false)

  /**
   * Decide availability on mount as well as on the event.
   *
   * The <audio> element is server-rendered, so the browser starts loading it
   * immediately and `loadedmetadata` can fire *before* React hydrates and
   * attaches the handler. Relying on the event alone means the toggle never
   * appears — which is exactly what happened. Checking readyState at mount
   * covers the race; the handlers cover the slower case.
   */
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    // HAVE_METADATA or better: duration and format are known.
    if (audio.readyState >= 1) setAvailable(true)
    else if (audio.error) setAvailable(false)
  }, [])

  // Read the stored preference after mount: localStorage is not available
  // during server rendering, and reading it in useState would desync hydration.
  useEffect(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      // Private mode, or storage disabled. Fall through to the default.
    }
    setEnabled(stored === null ? DEFAULT_ENABLED : stored === 'on')
    setReady(true)
  }, [])

  /** Ramps volume rather than cutting, so toggling does not feel like a switch. */
  const fadeTo = useCallback((target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return

    if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)

    const from = audio.volume
    const start = performance.now()

    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS)
      audio.volume = from + (target - from) * t
      if (t < 1) {
        fadeRef.current = requestAnimationFrame(step)
      } else {
        fadeRef.current = null
        onDone?.()
      }
    }
    fadeRef.current = requestAnimationFrame(step)
  }, [])

  /** Resolves true once audio is actually playing. */
  const start = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false
    if (!audio.paused) return true

    // No readyState guard: with preload="metadata" the file is not buffered
    // yet, and play() is perfectly happy to start once enough arrives.
    audio.volume = 0
    try {
      await audio.play()
      fadeTo(TARGET_VOLUME)
      return true
    } catch {
      // Blocked because no gesture has happened yet.
      return false
    }
  }, [fadeTo])

  // Apply the preference whenever it changes.
  useEffect(() => {
    if (!ready) return
    const audio = audioRef.current
    if (!audio) return

    if (enabled) {
      void start()
    } else if (!audio.paused) {
      fadeTo(0, () => audio.pause())
    }
  }, [enabled, ready, start, fadeTo])

  /**
   * Arm playback on user interaction.
   *
   * Deliberately not `{ once: true }`: the first gesture can land before the
   * browser will allow playback, and consuming the listener on a failed
   * attempt means the music never starts at all. The listeners are removed
   * only once audio is genuinely playing.
   */
  useEffect(() => {
    if (!ready || !enabled) return

    const events: Array<keyof DocumentEventMap> = ['pointerdown', 'keydown', 'touchstart']
    let done = false

    const unlock = async () => {
      if (done) return
      if (await start()) {
        done = true
        for (const event of events) document.removeEventListener(event, unlock)
      }
    }

    for (const event of events) {
      document.addEventListener(event, unlock, { passive: true })
    }
    return () => {
      for (const event of events) document.removeEventListener(event, unlock)
    }
  }, [ready, enabled, start])

  useEffect(() => {
    return () => {
      if (fadeRef.current !== null) cancelAnimationFrame(fadeRef.current)
    }
  }, [])

  // --- sound effects ---

  // Built on the client only: `new Audio()` does not exist while rendering on
  // the server, and these are useless before there is a document anyway.
  const effectsRef = useRef<Partial<Record<EffectName, HTMLAudioElement>>>({})
  const stepsRef = useRef<HTMLAudioElement | null>(null)
  const walkingRef = useRef(false)

  useEffect(() => {
    for (const [name, spec] of Object.entries(EFFECTS)) {
      const audio = new Audio(spec.file)
      audio.preload = 'auto'
      audio.volume = spec.volume
      effectsRef.current[name as EffectName] = audio
    }

    const steps = new Audio(FOOTSTEPS.file)
    steps.preload = 'auto'
    steps.loop = true
    steps.volume = FOOTSTEPS.volume
    stepsRef.current = steps

    return () => {
      steps.pause()
      for (const audio of Object.values(effectsRef.current)) audio?.pause()
      effectsRef.current = {}
      stepsRef.current = null
    }
  }, [])

  const play = useCallback(
    (name: EffectName) => {
      if (!enabled) return
      const source = effectsRef.current[name]
      if (!source) return

      // Cloned per call so rapid taps overlap instead of cutting each other
      // off — restarting one element makes fast clicking sound broken.
      const voice = source.cloneNode() as HTMLAudioElement
      voice.volume = source.volume
      void voice.play().catch(() => {
        // Not yet unlocked by a gesture. Nothing to recover from.
      })
    },
    [enabled],
  )

  const setWalking = useCallback(
    (walking: boolean) => {
      if (walking === walkingRef.current) return
      walkingRef.current = walking

      const steps = stepsRef.current
      if (!steps) return

      if (walking && enabled) {
        void steps.play().catch(() => {})
      } else {
        steps.pause()
        // Back to the top, so the next walk starts on a footfall rather than
        // halfway between two.
        steps.currentTime = 0
      }
    },
    [enabled],
  )

  // Muting mid-stride has to stop the loop that is already running.
  useEffect(() => {
    if (enabled) return
    const steps = stepsRef.current
    if (steps) {
      steps.pause()
      steps.currentTime = 0
    }
    walkingRef.current = false
  }, [enabled])

  /**
   * One click sound for every button, bound once here.
   *
   * Delegated from the document rather than wired into each control: there are
   * a couple of dozen buttons across the app, and a rule that lives in one
   * place cannot be forgotten by the next one somebody adds.
   */
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('.button, .chrome-button')) play('click')
    }
    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [play])

  const toggle = useCallback(() => {
    setEnabled((was) => {
      const next = !was
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? 'on' : 'off')
      } catch {
        // Preference simply will not persist. Not worth surfacing.
      }
      return next
    })
  }, [])

  return (
    <SoundContext.Provider value={{ enabled, available, toggle, play, setWalking }}>
      <audio
        ref={audioRef}
        src={TRACK}
        loop
        // "metadata", never "auto": the track is an hour long, and auto would
        // pull tens of megabytes before anyone has asked to hear anything.
        // Playback streams via range requests once it starts.
        preload="metadata"
        // Metadata rather than canplay: it fires earlier, and it is already
        // enough to know the file exists and is decodable.
        onLoadedMetadata={() => setAvailable(true)}
        // A missing or unplayable track leaves the control hidden rather than
        // showing a button that does nothing.
        onError={() => setAvailable(false)}
      />
      {children}
    </SoundContext.Provider>
  )
}

/**
 * The speaker button, drawn from the asset pack's sound_icon.svg.
 *
 * Inline rather than an <img> so the waves can be dimmed for the muted state
 * without shipping a second file, and so it inherits the brand colour.
 */
export function SoundToggle() {
  const { enabled, available, toggle } = useSound()

  // No track, no control. Placement is ScreenChrome's job, not this one's.
  if (!available) return null

  return (
    <button
      type="button"
      className="chrome-button sound-toggle"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn the music off' : 'Turn the music on'}
      title={enabled ? 'Turn the music off' : 'Turn the music on'}
    >
      <svg viewBox="0 0 75 75" aria-hidden="true">
        <path
          d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <g className="waves" data-on={enabled ? 'true' : 'false'}>
          <path
            d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6"
            fill="none"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
        {enabled ? null : (
          <path className="slash" d="M50,22 L68,53" strokeWidth="5" strokeLinecap="round" />
        )}
      </svg>
    </button>
  )
}
