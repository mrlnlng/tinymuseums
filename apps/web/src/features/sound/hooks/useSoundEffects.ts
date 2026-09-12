'use client'

import { useCallback, useEffect, useRef } from 'react'
import { applyMix, resumeGain, routeThroughGain } from '@/features/sound/lib/output'

/*  Short one-shot effects plus the footstep loop, gated on the same preference as the music: someone who muted the museum muted the museum, not just its soundtrack. */

/*  `start` and `end` are where the sound actually is inside its file, in
    seconds, for the recordings that arrived with silence around them: the harp
    does not begin until a second and a half in, and the cat's hello is over
    after a second of an eleven-second file. Played from the top, a tap on the
    harp would answer with a second and a half of nothing, and one voice of the
    cat's pool would sit occupied on ten seconds of silence. So each voice is
    started at `start` and stopped at `end`, and the files are left as the
    artist exported them. Omit both for a recording that fills its file. */
/*  `volume` is each effect's balance against the others, and the numbers are
    not guesses: the recordings differ in level by more than a factor of four,
    so they were measured and the balances set to land them all at about the
    same loudness in the room. Mean square over the audible span, which tracks
    what a listener calls loud far better than the peak does — the owl peaks
    near full scale but so briefly that judging it by its peak had it mixed
    twice as quiet as it sounded.

        recording        loudness   balance   in the room
        sfx-click          0.240      0.63       0.151
        sfx-painting-open  0.066      1.40       0.093
        sfx-harp           0.105      1.40       0.147
        sfx-owl            0.267      0.59       0.158
        sfx-cafe-hello     0.178      0.87       0.155
        sfx-coin           0.160      0.72       0.115

    The music sits at 0.057 in that same column (see `MUSIC_MIX`), so all of
    these land well above the soundtrack — the four the visitor causes by
    between eight and nine decibels.

    Two balances are above 1, which is a boost rather than the attenuation the
    others are, because those two recordings are quiet: the harp is a third of
    the owl and the painting is a quarter of it, and left at 1 they were the
    two that failed to keep up. A boost is safe here only because it was
    checked against the peaks rather than assumed — every one of these
    recordings crests well below full scale, so even at the loudest the museum
    can be set the hottest sample any of them reaches is about 0.69, with no
    clipping anywhere.

    What a boost does cost is the top of the slider. An element's volume stops
    at 1, so above a museum level of about 0.71 those two stop getting louder
    while the rest carry on. That is a ceiling on the loudest setting rather
    than a change in how it sounds at ordinary ones, and it degrades by simply
    holding still.

    The coin sits under the rest on purpose: two seconds of pouring coins read
    louder than a tap at the same mean square, and its recording crests at
    0.97, so 0.72 keeps its hottest sample near the others' ~0.7.

    The footsteps are deliberately not in this company: they are a loop that
    runs the whole time the visitor is walking, and they stay under the music
    at about 0.025. A continuous sound mixed to answer a tap would be
    exhausting. */
const EFFECTS = {
  click: { file: '/audio/sfx-click.mp3', volume: 0.63 },
  'painting-open': { file: '/audio/sfx-painting-open.mp3', volume: 1.4 },
  /** The lyre on the third pedestal drawing, and the owl on the first. */
  harp: { file: '/audio/sfx-harp.mp3', volume: 1.4, start: 1.55, end: 5.3 },
  owl: { file: '/audio/sfx-owl.mp3', volume: 0.59, start: 0.7, end: 3.7 },
  /** The cafe cat, greeting whoever taps her at the counter. */
  'cafe-hello': { file: '/audio/sfx-cafe-hello.mp3', volume: 0.87, start: 0.48, end: 1.3 },
  /*  The hidden coin, found. The file is cut to the first 2.2s of the artist's
      4.6s pour, ending in its quietest gap just before a clink at 2.25s; a stop
      timer firing late would catch that clink. */
  coin: { file: '/audio/sfx-coin.mp3', volume: 0.72, start: 0.06 },
} as const

export type EffectName = keyof typeof EFFECTS

/** One effect's entry, with the trim that only some of them carry. */
interface EffectSpec {
  file: string
  volume: number
  start?: number
  end?: number
}

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
  /*  The pending out point for each voice that has one, so a stop can be
      called off when the voice is taken over by a fresh tap. */
  const stopTimersRef = useRef(new Map<HTMLAudioElement, number>())
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
    const voice = (file: string, mix: number, loop = false): HTMLAudioElement => {
      const audio = new Audio(file)
      audio.preload = 'auto'
      audio.loop = loop
      /*  Its place against the other sounds, written wherever this voice's
          sound is going to come out of.

          Through the graph if it can be, which is now the first choice rather
          than a fallback for one platform. The museum's level reaches a routed
          voice through the master, and on an iPhone that is the only way it
          reaches it at all: `volume` on a media element there is a setter that
          does nothing, so an unrouted effect plays at whatever the recording
          was mixed at and the museum's slider governs none of it. A gain is
          also allowed to be a boost, so the balances above 1 go through as
          they are.

          Only if it cannot be routed does the level go on the element, and
          there it is a fraction and nothing else: handed anything outside
          [0, 1] the setter throws rather than clamping, so a boosted balance
          has to be brought inside it. Nothing is lost — this is only the level
          the element idles at, and `applyMix` writes the real one, balance and
          museum level together, before every play. */
      if (!routeThroughGain(audio, mix)) audio.volume = Math.min(1, mix)
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

      const spec = EFFECTS[name] as EffectSpec
      const voice = pool[at]
      applyMix(voice, spec.volume, volumeRef.current)

      /*  Rewound rather than resumed: a voice reused mid-sound would start
          partway in. For a trimmed recording that means back to where the
          sound is, not to the top of the file. */
      const from = spec.start ?? 0
      voice.currentTime = from

      /*  A stop of its own, because a media element has no out point. Cleared
          first: this voice may still be counting down from an earlier tap, and
          that timer would cut the new sound off at the old sound's end. */
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
