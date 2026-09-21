'use client'

import { useCallback, useEffect, useRef } from 'react'
import { gestured } from '@/features/sound/lib/gesture'
import { applyMix, resumeGain, routeThroughGain } from '@/features/sound/lib/output'

const EFFECTS = {
  click: { file: '/audio/sfx-click.mp3', volume: 0.63 },
  'painting-open': { file: '/audio/sfx-painting-open.mp3', volume: 1.4 },
  harp: { file: '/audio/sfx-harp.mp3', volume: 1.4, start: 1.55, end: 5.3 },
  owl: { file: '/audio/sfx-owl.mp3', volume: 0.59, start: 0.7, end: 3.7 },
  'cafe-hello': { file: '/audio/sfx-cafe-hello.mp3', volume: 0.87, start: 0.48, end: 1.3 },
  coin: { file: '/audio/sfx-coin.mp3', volume: 0.72, start: 0.06 },
} as const

export type EffectName = keyof typeof EFFECTS

interface EffectSpec {
  file: string
  volume: number
  start?: number
  end?: number
}

const FOOTSTEPS = { file: '/audio/sfx-footsteps.mp3', volume: 0.3 }

const VOICES = 3

const CLICKABLE = '.button, .chrome-button, .lobby-help-button, .gift-shop-button'

export interface SoundEffects {
  play: (name: EffectName) => void
  setWalking: (isWalking: boolean) => void
}

export function useSoundEffects(isEnabled: boolean, volume: number): SoundEffects {
  const voicesRef = useRef<Partial<Record<EffectName, HTMLAudioElement[]>>>({})
  const nextVoiceRef = useRef<Partial<Record<EffectName, number>>>({})
  const stepsRef = useRef<HTMLAudioElement | null>(null)
  const stopTimersRef = useRef(new Map<HTMLAudioElement, number>())
  const isWalkingRef = useRef(false)

  const volumeRef = useRef(volume)
  volumeRef.current = volume

  const makeVoice = useCallback((file: string, mix: number, loop = false): HTMLAudioElement => {
    const audio = new Audio(file)
    audio.preload = 'auto'
    audio.loop = loop
    if (!routeThroughGain(audio, mix)) audio.volume = Math.min(1, mix)
    return audio
  }, [])

  // Each clip is fetched the first time it is actually needed, so entering the
  // hall costs one footstep loop rather than the whole sound library.
  // Built once for the page's life: an element routed into Web Audio cannot be released.
  const voicesFor = useCallback(
    (name: EffectName): HTMLAudioElement[] | null => {
      if (!gestured()) return null
      let pool = voicesRef.current[name]
      if (!pool) {
        const spec = EFFECTS[name]
        // One voice to begin with. Creating all VOICES up front fires VOICES
        // parallel requests for the same file, none of which can hit the cache
        // yet, so every clip was being downloaded three times.
        pool = [makeVoice(spec.file, spec.volume)]
        voicesRef.current[name] = pool
      }
      return pool
    },
    [makeVoice],
  )

  const ensureSteps = useCallback((): HTMLAudioElement | null => {
    if (!gestured()) return null
    if (!stepsRef.current) {
      const steps = makeVoice(FOOTSTEPS.file, FOOTSTEPS.volume, true)
      applyMix(steps, FOOTSTEPS.volume, volumeRef.current)
      stepsRef.current = steps
    }
    return stepsRef.current
  }, [makeVoice])

  useEffect(
    () => () => {
      stepsRef.current?.pause()
      for (const pool of Object.values(voicesRef.current)) {
        for (const audio of pool ?? []) audio.pause()
      }
    },
    [],
  )

  useEffect(() => {
    const steps = stepsRef.current
    if (steps) applyMix(steps, FOOTSTEPS.volume, volume)
  }, [volume])

  const play = useCallback(
    (name: EffectName) => {
      if (!isEnabled) return

      const pool = voicesFor(name)
      if (!pool?.length) return

      const spec = EFFECTS[name] as EffectSpec

      let voice = pool.find((candidate) => candidate.paused || candidate.ended)
      if (!voice && pool.length < VOICES) {
        // Overlapping playback needs another element, but the file is cached now.
        voice = makeVoice(spec.file, spec.volume)
        pool.push(voice)
      }
      if (!voice) {
        const at = (nextVoiceRef.current[name] ?? 0) % pool.length
        nextVoiceRef.current[name] = at + 1
        voice = pool[at]
      }
      applyMix(voice, spec.volume, volumeRef.current)

      const from = spec.start ?? 0
      voice.currentTime = from

      const timers = stopTimersRef.current
      window.clearTimeout(timers.get(voice))
      timers.delete(voice)
      if (spec.end !== undefined) {
        timers.set(
          voice,
          window.setTimeout(
            () => {
              voice.pause()
              voice.currentTime = from
              timers.delete(voice)
            },
            Math.max(0, (spec.end - from) * 1000),
          ),
        )
      }

      resumeGain()
      void voice.play().catch(() => {})
    },
    [isEnabled, voicesFor, makeVoice],
  )

  const setWalking = useCallback(
    (isWalking: boolean) => {
      if (isWalking === isWalkingRef.current) return

      const steps = isWalking && isEnabled ? ensureSteps() : stepsRef.current
      if (!steps) {
        // Nothing to start yet; stay out of sync so the next call retries.
        if (!isWalking) isWalkingRef.current = false
        return
      }
      isWalkingRef.current = isWalking

      if (isWalking && isEnabled) {
        resumeGain()
        void steps.play().catch(() => {})
        return
      }
      steps.pause()
      steps.currentTime = 0
    },
    [isEnabled, ensureSteps],
  )

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
