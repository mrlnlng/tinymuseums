'use client'

import { useCallback, useEffect, useRef } from 'react'

/*  Short one-shot effects plus the footstep loop, gated on the same preference as the music: someone who muted the museum muted the museum, not just its soundtrack. */

const EFFECTS = {
  click: { file: '/audio/sfx-click.mp3', volume: 0.45 },
  'painting-open': { file: '/audio/sfx-painting-open.mp3', volume: 0.55 },
} as const

export type EffectName = keyof typeof EFFECTS

const FOOTSTEPS = { file: '/audio/sfx-footsteps.mp3', volume: 0.3 }

/*  Every control that clicks, in one list — so a new button does not need a selector buried in an effect. */
const CLICKABLE = '.button, .chrome-button, .lobby-help-button'

export interface SoundEffects {
  play: (name: EffectName) => void
  setWalking: (isWalking: boolean) => void
}

export function useSoundEffects(isEnabled: boolean): SoundEffects {
  // Built on the client only: `new Audio()` does not exist while rendering on
  // the server, and these are useless before there is a document.
  const effectsRef = useRef<Partial<Record<EffectName, HTMLAudioElement>>>({})
  const stepsRef = useRef<HTMLAudioElement | null>(null)
  const isWalkingRef = useRef(false)

  const loadEffects = useCallback(() => {
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

  useEffect(() => loadEffects(), [loadEffects])

  const play = useCallback(
    (name: EffectName) => {
      const source = effectsRef.current[name]
      if (!isEnabled || !source) return

      // Cloned per call so rapid taps overlap instead of cutting each other off.
      const voice = source.cloneNode() as HTMLAudioElement
      voice.volume = source.volume
      void voice.play().catch(() => {
        // Not yet unlocked by a gesture. Nothing to recover from.
      })
    },
    [isEnabled],
  )

  const setWalking = useCallback(
    (isWalking: boolean) => {
      const steps = stepsRef.current
      if (isWalking === isWalkingRef.current || !steps) return
      isWalkingRef.current = isWalking

      if (isWalking && isEnabled) {
        void steps.play().catch(() => {})
        return
      }
      steps.pause()
      // Back to the top, so the next walk starts on a footfall.
      steps.currentTime = 0
    },
    [isEnabled],
  )

  /** Muting mid-stride has to stop the loop already running. */
  const silenceOnMute = useCallback(() => {
    if (isEnabled) return
    const steps = stepsRef.current
    if (steps) {
      steps.pause()
      steps.currentTime = 0
    }
    isWalkingRef.current = false
  }, [isEnabled])

  useEffect(() => silenceOnMute(), [silenceOnMute])

  /** One click sound for every control, bound once rather than per button. */
  const bindClickSound = useCallback(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest(CLICKABLE)) play('click')
    }
    document.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [play])

  useEffect(() => bindClickSound(), [bindClickSound])

  return { play, setWalking }
}
