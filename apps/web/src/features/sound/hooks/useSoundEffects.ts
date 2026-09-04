'use client'

import { useCallback, useEffect, useRef } from 'react'
import {
  applyMix,
  isElementVolumeLocked,
  resumeGain,
  routeThroughGain,
} from '@/features/sound/lib/output'

/*  Short one-shot effects plus the footstep loop, gated on the same preference as the music: someone who muted the museum muted the museum, not just its soundtrack. */

const EFFECTS = {
  click: { file: '/audio/sfx-click.mp3', volume: 0.45 },
  'painting-open': { file: '/audio/sfx-painting-open.mp3', volume: 0.55 },
} as const

export type EffectName = keyof typeof EFFECTS

const FOOTSTEPS = { file: '/audio/sfx-footsteps.mp3', volume: 0.3 }

/*  Voices per effect. Rapid taps have to overlap rather than cut each other
    off, and the way that used to be done was to clone the element per tap —
    simple, and fine while the level was written on the element itself. It is
    not fine on the graph path: a clone is a new element, every one of them
    would have to be routed afresh, and a routed element can never be given
    back. A fixed pool overlaps just as well and is routed once. Three is what
    it takes to tap faster than a short sound finishes. */
const VOICES = 3

/*  Every control that clicks, in one list — so a new button does not need a selector buried in an effect. */
const CLICKABLE = '.button, .chrome-button, .lobby-help-button, .gift-shop-button'

export interface SoundEffects {
  play: (name: EffectName) => void
  setWalking: (isWalking: boolean) => void
}

/*  `volume` is the museum's own level, the one the speaker's slider sets: every
    sound the place makes is scaled by it, so the control governs the footsteps
    and the taps as well as the music rather than only the soundtrack. Each
    effect keeps its own balance against the others. */
export function useSoundEffects(isEnabled: boolean, volume: number): SoundEffects {
  // Built on the client only: `new Audio()` does not exist while rendering on
  // the server, and these are useless before there is a document.
  const voicesRef = useRef<Partial<Record<EffectName, HTMLAudioElement[]>>>({})
  const nextVoiceRef = useRef<Partial<Record<EffectName, number>>>({})
  const stepsRef = useRef<HTMLAudioElement | null>(null)
  const isWalkingRef = useRef(false)

  /* Read at play time, so changing the level does not rebuild the callbacks. */
  const volumeRef = useRef(volume)
  volumeRef.current = volume

  /*  Built once and kept, rather than torn down and rebuilt: on the graph path
      an element cannot be un-routed, so a pool that came and went would leave
      its predecessors attached to the graph for the life of the page — and in
      development React mounts every effect twice on purpose. The provider that
      owns this lives in the root layout and is never unmounted anyway; the
      cleanup silences the voices, it does not throw them away. */
  const loadEffects = useCallback(() => {
    const isGraph = isElementVolumeLocked()

    const voice = (file: string, mix: number, loop = false): HTMLAudioElement => {
      const audio = new Audio(file)
      audio.preload = 'auto'
      audio.loop = loop
      /*  Its place against the other sounds. On the graph path it rides on a
          gain of the element's own, set when it is routed; on the element path
          it is written here and again with the museum's level at play time. */
      if (isGraph) routeThroughGain(audio, mix)
      else audio.volume = mix
      return audio
    }

    if (Object.keys(voicesRef.current).length === 0) {
      for (const [name, spec] of Object.entries(EFFECTS)) {
        voicesRef.current[name as EffectName] = Array.from({ length: VOICES }, () =>
          voice(spec.file, spec.volume),
        )
      }
    }

    if (!stepsRef.current) {
      const steps = voice(FOOTSTEPS.file, FOOTSTEPS.volume, true)
      applyMix(steps, FOOTSTEPS.volume, volumeRef.current)
      stepsRef.current = steps
    }

    return () => {
      stepsRef.current?.pause()
      for (const pool of Object.values(voicesRef.current)) {
        for (const audio of pool ?? []) audio.pause()
      }
    }
  }, [])

  useEffect(() => loadEffects(), [loadEffects])

  /* The footsteps are a loop, so a change of level has to reach the one running. */
  useEffect(() => {
    const steps = stepsRef.current
    if (steps) applyMix(steps, FOOTSTEPS.volume, volume)
  }, [volume])

  const play = useCallback(
    (name: EffectName) => {
      const pool = voicesRef.current[name]
      if (!isEnabled || !pool?.length) return

      // Round robin, so a tap lands on the voice that has had the longest to
      // finish rather than cutting off the one still sounding.
      const at = (nextVoiceRef.current[name] ?? 0) % pool.length
      nextVoiceRef.current[name] = at + 1

      const voice = pool[at]
      applyMix(voice, EFFECTS[name].volume, volumeRef.current)
      // Rewound rather than resumed: a voice reused mid-sound would start
      // partway in.
      voice.currentTime = 0
      resumeGain()
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
        resumeGain()
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
