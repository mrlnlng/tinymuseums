'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { loadRound, type LoadedRound } from '../lib/api'
import { planGame, randomRound } from '../lib/plan'
import { createReveal, type SketchReveal } from '../lib/reveal'
import BunnyArtist, { type BunnyMood } from './BunnyArtist'

const ROUNDS = 3
const STARS_BY_STEP = [3, 2, 1, 1]
const LAST_STEP = STARS_BY_STEP.length - 1
const MAX_STARS = ROUNDS * STARS_BY_STEP[0]
const STEP_DRAW_MS = 1100
const STREAK_FOR_BONUS = 3

// Fractions of strokes, not of ink: strokes overlap, so medium uncovers roughly 20%, 45%, 70% and all of the drawing.
const REVEAL_STEPS = {
  easy: [0.045, 0.11, 0.2, 1],
  medium: [0.02, 0.06, 0.13, 1],
  hard: [0.008, 0.022, 0.05, 1],
} as const

type Difficulty = keyof typeof REVEAL_STEPS

const DIFFICULTIES = Object.keys(REVEAL_STEPS) as Difficulty[]

const LEVEL_HINTS: Record<Difficulty, string> = {
  easy: 'Plenty of lines to go on',
  medium: 'A fair challenge',
  hard: 'Just a few scribbles',
}

const BEST_KEY = 'tiny-museum:sketch-best'
const BEST_STREAK_KEY = 'tiny-museum:sketch-streak'
const DIFFICULTY_KEY = 'tiny-museum:sketch-difficulty'

export interface PreparedGame {
  first: LoadedRound
}

export async function prepareSketchGame(epochId: number, signal?: AbortSignal): Promise<PreparedGame> {
  return { first: await loadRound(epochId, randomRound(), signal) }
}

function openingPlan(prepared: PreparedGame | null): number[] {
  if (!prepared) return [randomRound()]
  const { round, poolSize } = prepared.first.round
  return planGame(poolSize, ROUNDS, { first: round })
}

type Phase = 'choosing' | 'loading' | 'guessing' | 'answered' | 'done' | 'error'

function readStored(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStored(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value)
  } catch {}
}

function readDifficulty(): Difficulty {
  const saved = readStored(DIFFICULTY_KEY)
  return DIFFICULTIES.includes(saved as Difficulty) ? (saved as Difficulty) : 'medium'
}

function bestKeyFor(difficulty: Difficulty): string {
  return difficulty === 'medium' ? BEST_KEY : `${BEST_KEY}:${difficulty}`
}

function saveIfHigher(key: string, value: number): number {
  const previous = Number(readStored(key)) || 0
  if (value <= previous) return previous
  writeStored(key, String(value))
  return value
}

function Stars({ count, of }: { count: number; of: number }) {
  return (
    <span className="sketchbook-stars" role="img" aria-label={`${count} of ${of} stars`}>
      {Array.from({ length: of }, (_, i) => (
        <span key={i} className={i < count ? 'is-lit' : undefined} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  )
}

const BURST = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2)

function StarBurst() {
  return (
    <div className="sketchbook-burst" aria-hidden="true">
      {BURST.map((angle) => (
        <motion.span
          key={angle}
          initial={{ x: 0, y: 0, scale: 0.4, opacity: 1 }}
          animate={{ x: Math.cos(angle) * 90, y: Math.sin(angle) * 90, scale: 1.2, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          ★
        </motion.span>
      ))}
    </div>
  )
}

interface SketchGuessProps {
  epochId: number
  prepared: PreparedGame | null
  onClose: () => void
}

export default function SketchGuess({ epochId, prepared, onClose }: SketchGuessProps) {
  const { play } = useSound()
  const [difficulty, setDifficulty] = useState(readDifficulty)
  const [started, setStarted] = useState(false)
  const [plan, setPlan] = useState(() => openingPlan(prepared))
  const [roundIndex, setRoundIndex] = useState(0)
  const [attempt, setAttempt] = useState(0)
  const [phase, setPhase] = useState<Phase>('choosing')
  const [loaded, setLoaded] = useState<LoadedRound | null>(null)
  const [step, setStep] = useState(0)
  const [isDrawing, setIsDrawing] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [bonus, setBonus] = useState(0)
  const [streak, setStreak] = useState(0)
  const [earnedBonus, setEarnedBonus] = useState(false)
  const [best, setBest] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<SketchReveal | null>(null)
  const revealForRef = useRef<LoadedRound | null>(null)
  const drawnRef = useRef(0)
  const poolSizeRef = useRef(prepared?.first.round.poolSize ?? 0)
  const abortRef = useRef<AbortController | null>(null)
  const roundsRef = useRef(
    new Map<number, { pending: Promise<LoadedRound>; signal: AbortSignal | null }>(
      prepared
        ? [[prepared.first.round.round, { pending: Promise.resolve(prepared.first), signal: null }]]
        : [],
    ),
  )

  const earned = scores.reduce((sum, stars) => sum + stars, 0)
  const total = earned + bonus

  const requestRound = useCallback(
    (round: number): Promise<LoadedRound> => {
      const cached = roundsRef.current.get(round)
      if (cached && !cached.signal?.aborted) return cached.pending
      abortRef.current ??= new AbortController()
      const { signal } = abortRef.current
      const pending = loadRound(epochId, round, signal)
      const entry = { pending, signal }
      roundsRef.current.set(round, entry)
      pending.catch(() => {
        if (roundsRef.current.get(round) === entry) roundsRef.current.delete(round)
      })
      return pending
    },
    [epochId],
  )

  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      abortRef.current = null
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    for (const round of plan.slice(1)) requestRound(round).catch(() => {})
  }, [plan, requestRound])

  const currentRound = plan[roundIndex]

  useEffect(() => {
    let cancelled = false
    setPhase('loading')
    setPicked(null)
    setLoaded(null)
    setStep(0)
    revealRef.current = null
    revealForRef.current = null
    const canvas = canvasRef.current
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)

    if (!started) {
      setPhase('choosing')
      requestRound(currentRound).catch(() => {})
      return
    }

    requestRound(currentRound)
      .then((loadedRound) => {
        if (cancelled) return
        const { poolSize, round } = loadedRound.round
        poolSizeRef.current = poolSize
        setPlan((current) =>
          current.length >= ROUNDS ? current : planGame(poolSize, ROUNDS, { first: round }),
        )
        setLoaded(loadedRound)
        setPhase('guessing')
      })
      .catch(() => {
        if (!cancelled) setPhase('error')
      })

    return () => {
      cancelled = true
    }
  }, [currentRound, attempt, started, requestRound])

  useEffect(() => {
    if (phase !== 'guessing' || !loaded || !canvasRef.current) return
    if (revealForRef.current !== loaded) {
      revealRef.current = createReveal(canvasRef.current, loaded.ink)
      revealForRef.current = loaded
      drawnRef.current = 0
    }
    const reveal = revealRef.current!
    const from = drawnRef.current
    const to = REVEAL_STEPS[difficulty][step]
    const startedAt = performance.now()
    setIsDrawing(true)

    let frame = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - startedAt) / STEP_DRAW_MS)
      drawnRef.current = from + (to - from) * (1 - (1 - t) ** 2)
      if (drawnRef.current >= 1) reveal.finish()
      else reveal.draw(drawnRef.current)
      if (t < 1) frame = requestAnimationFrame(tick)
      else setIsDrawing(false)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, loaded, step, difficulty])

  const revealMore = useCallback(() => {
    if (phase !== 'guessing') return
    setStep((current) => Math.min(LAST_STEP, current + 1))
    play('click')
  }, [phase, play])

  const choose = useCallback(
    (pieceId: string) => {
      if (phase !== 'guessing' || !loaded) return
      const correct = pieceId === loaded.round.answer.pieceId
      const nextStreak = correct ? streak + 1 : 0
      const milestone = correct && nextStreak % STREAK_FOR_BONUS === 0
      revealRef.current?.finish()
      setPicked(pieceId)
      setScores((previous) => [...previous, correct ? STARS_BY_STEP[step] : 0])
      setStreak(nextStreak)
      setEarnedBonus(milestone)
      if (milestone) setBonus((n) => n + 1)
      setBestStreak(saveIfHigher(BEST_STREAK_KEY, nextStreak))
      setPhase('answered')
      play(milestone ? 'harp' : correct ? 'coin' : 'click')
    },
    [phase, loaded, play, streak, step],
  )

  const next = useCallback(() => {
    if (roundIndex + 1 < ROUNDS) {
      setRoundIndex(roundIndex + 1)
      return
    }
    setBest(saveIfHigher(bestKeyFor(difficulty), total))
    setPhase('done')
  }, [roundIndex, total, difficulty])

  const playAgain = useCallback(() => {
    const poolSize = poolSizeRef.current
    const avoid = new Set(plan.map((round) => round % poolSize))
    setPlan(poolSize > 0 ? planGame(poolSize, ROUNDS, { avoid }) : [randomRound()])
    setRoundIndex(0)
    setScores([])
    setBonus(0)
    setStarted(false)
    setAttempt((n) => n + 1)
  }, [plan])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const startGame = useCallback(
    (level: Difficulty) => {
      writeStored(DIFFICULTY_KEY, level)
      setDifficulty(level)
      setStarted(true)
      play('click')
    },
    [play],
  )

  const lastScore = scores[scores.length - 1] ?? 0
  const round = loaded?.round
  const isAnswered = phase === 'answered'

  let message = 'Which painting is being drawn?'
  if (isAnswered && round) {
    if (lastScore === 0) message = `It was ${round.answer.title} by ${round.answer.artistName}`
    else if (earnedBonus) message = `${streak} in a row! Bonus star`
    else message = `Yes! ${lastScore} ${lastScore === 1 ? 'star' : 'stars'}`
  }

  let mood: BunnyMood = 'idle'
  if (phase === 'guessing') mood = isDrawing ? 'drawing' : 'idle'
  else if (isAnswered) mood = lastScore > 0 ? 'cheering' : 'sad'
  else if (phase === 'done') mood = total >= MAX_STARS / 2 ? 'cheering' : 'idle'

  return (
    <motion.div
      className="sketch-guess"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label="Sketch and guess"
    >
      <button type="button" className="sketch-guess-scrim" onClick={onClose} aria-label="Close the game" />

      <motion.div
        className="sketchbook"
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 16, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.18, duration: 0.45 }}
      >
        <BunnyArtist mood={mood} />

        <header className="sketchbook-header">
          <span className="sketchbook-round">
            {phase === 'done'
              ? 'Finished'
              : phase === 'choosing'
                ? 'Sketch & Guess'
                : `Round ${roundIndex + 1} of ${ROUNDS}`}
          </span>
          {phase === 'choosing' ? null : <Stars count={earned} of={MAX_STARS} />}
          {bonus > 0 ? <span className="sketchbook-bonus">+{bonus}</span> : null}
          <button type="button" className="sketchbook-close" onClick={onClose} aria-label="Close the game">
            ×
          </button>
        </header>

        {phase === 'choosing' ? (
          <div className="sketchbook-summary">
            <p className="sketchbook-title">Pick a difficulty</p>
            <p className="sketchbook-note">The fewer lines you need, the more stars you earn.</p>
            <div className="sketchbook-levels">
              {DIFFICULTIES.map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`sketchbook-level${level === difficulty ? ' is-last' : ''}`}
                  onClick={() => startGame(level)}
                >
                  <span className="sketchbook-level-name">{level}</span>
                  <span className="sketchbook-level-hint">{LEVEL_HINTS[level]}</span>
                </button>
              ))}
            </div>
          </div>
        ) : phase === 'done' ? (
          <div className="sketchbook-summary">
            <p className="sketchbook-title">
              {earned} of {MAX_STARS} stars
            </p>
            {bonus > 0 ? (
              <p className="sketchbook-note">
                +{bonus} streak {bonus === 1 ? 'bonus' : 'bonuses'}, {total} in total
              </p>
            ) : null}
            <p className="sketchbook-note">
              Best on {difficulty}: {best} · Best streak: {bestStreak}
            </p>
            <div className="sketchbook-actions">
              <button type="button" className="button" onClick={playAgain}>
                Play again
              </button>
              <button type="button" className="button secondary" onClick={onClose}>
                Back to the hall
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="sketchbook-page">
              <canvas ref={canvasRef} className="sketchbook-canvas" aria-hidden="true" />
              {round ? (
                <img
                  key={round.answer.pieceId}
                  className={`sketchbook-canvas sketchbook-color${isAnswered ? ' is-shown' : ''}`}
                  src={round.answer.image.url}
                  alt={isAnswered ? `${round.answer.title} by ${round.answer.artistName}` : ''}
                  decoding="async"
                />
              ) : null}
              {isAnswered && earnedBonus ? <StarBurst key={streak} /> : null}
              <AnimatePresence>
                {streak >= 2 ? (
                  <motion.span
                    key={streak}
                    className={`sketchbook-streak${streak % STREAK_FOR_BONUS === 0 ? ' is-bonus' : ''}`}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: [0.6, 1.25, 1], opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    {streak} in a row
                  </motion.span>
                ) : null}
              </AnimatePresence>
              {phase === 'loading' ? <p className="sketchbook-status">Sharpening pencils…</p> : null}
              {phase === 'error' ? (
                <div className="sketchbook-status">
                  <p>This sketch smudged.</p>
                  <button type="button" className="button secondary" onClick={retry}>
                    Try again
                  </button>
                </div>
              ) : null}
            </div>

            <p className="sketchbook-prompt" aria-live="polite">
              {message}
            </p>

            {phase === 'guessing' ? (
              <div className="sketchbook-reveal">
                <span className="sketchbook-worth">
                  Worth <Stars count={STARS_BY_STEP[step]} of={3} />
                </span>
                {step < LAST_STEP ? (
                  <button type="button" className="sketchbook-more" onClick={revealMore}>
                    Reveal more
                  </button>
                ) : (
                  <span className="sketchbook-worth">Fully drawn</span>
                )}
              </div>
            ) : null}

            <div className="sketchbook-choices">
              {round?.choices.map((choice) => {
                const isAnswer = choice.pieceId === round.answer.pieceId
                const state = !isAnswered
                  ? ''
                  : isAnswer
                    ? ' is-right'
                    : choice.pieceId === picked
                      ? ' is-wrong'
                      : ' is-faded'
                return (
                  <button
                    key={choice.pieceId}
                    type="button"
                    className={`sketchbook-choice${state}`}
                    onClick={() => choose(choice.pieceId)}
                    disabled={phase !== 'guessing'}
                  >
                    {choice.title}
                  </button>
                )
              })}
            </div>

            {isAnswered ? (
              <button type="button" className="button sketchbook-next" onClick={next}>
                {roundIndex + 1 >= ROUNDS ? 'See my stars' : 'Next sketch'}
              </button>
            ) : null}
          </>
        )}
      </motion.div>
    </motion.div>
  )
}
