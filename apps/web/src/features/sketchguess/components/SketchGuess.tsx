'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { decodeImage, loadRound, type LoadedRound } from '../lib/api'
import { pickFocus } from '../lib/focus'
import {
  DIFFICULTIES,
  LAST_STEP,
  LEVEL_HINTS,
  MODE_ORDER,
  MODES,
  STARS_BY_STEP,
  isDifficulty,
  isMode,
  type Difficulty,
  type Mode,
} from '../lib/modes'
import { planGame, randomRound } from '../lib/plan'
import { createReveal, type SketchReveal } from '../lib/reveal'
import BunnyArtist, { type BunnyMood } from './BunnyArtist'

const ROUNDS = 3
const MAX_STARS = ROUNDS * STARS_BY_STEP[0]
const STEP_DRAW_MS = 1100
const STREAK_FOR_BONUS = 3

const BEST_KEY = 'tiny-museum:sketch-best'
const BEST_STREAK_KEY = 'tiny-museum:sketch-streak'
const DIFFICULTY_KEY = 'tiny-museum:sketch-difficulty'
const MODE_KEY = 'tiny-museum:sketch-mode'

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
  return isDifficulty(saved) ? saved : 'medium'
}

function readMode(): Mode {
  const saved = readStored(MODE_KEY)
  return isMode(saved) ? saved : 'sketch'
}

function bestKeyFor(mode: Mode, difficulty: Difficulty): string {
  if (mode !== 'sketch') return `${BEST_KEY}:${mode}:${difficulty}`
  return difficulty === 'medium' ? BEST_KEY : `${BEST_KEY}:${difficulty}`
}

function clueUrl(mode: Mode, loaded: LoadedRound): string | null {
  const { answer } = loaded.round
  // Round responses cached before detail images existed do not carry one.
  if (mode === 'zoom') return (answer.detail ?? answer.image).url
  if (mode === 'colour') return answer.image.url
  return null
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
  const [mode, setMode] = useState(readMode)
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

  const requestPlayable = useCallback(
    async (round: number): Promise<LoadedRound> => {
      const loadedRound = await requestRound(round)
      const url = clueUrl(mode, loadedRound)
      if (url) await decodeImage(url, abortRef.current?.signal)
      return loadedRound
    },
    [requestRound, mode],
  )

  useEffect(() => {
    const request = started ? requestPlayable : requestRound
    for (const round of plan.slice(1)) request(round).catch(() => {})
  }, [plan, started, requestPlayable, requestRound])

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

    requestPlayable(currentRound)
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
  }, [currentRound, attempt, started, requestRound, requestPlayable])

  useEffect(() => {
    if (mode !== 'sketch' || phase !== 'guessing' || !loaded || !canvasRef.current) return
    if (revealForRef.current !== loaded) {
      revealRef.current = createReveal(canvasRef.current, loaded.ink)
      revealForRef.current = loaded
      drawnRef.current = 0
    }
    const reveal = revealRef.current!
    const from = drawnRef.current
    const to = MODES.sketch.steps[difficulty][step]
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
  }, [mode, phase, loaded, step, difficulty])

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
    setBest(saveIfHigher(bestKeyFor(mode, difficulty), total))
    setPhase('done')
  }, [roundIndex, total, mode, difficulty])

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
      writeStored(MODE_KEY, mode)
      setDifficulty(level)
      setStarted(true)
      play('click')
    },
    [mode, play],
  )

  const focus = useMemo(
    () => (loaded ? pickFocus(loaded.ink.ink, loaded.ink.width, loaded.ink.height) : null),
    [loaded],
  )

  const lastScore = scores[scores.length - 1] ?? 0
  const round = loaded?.round
  const isAnswered = phase === 'answered'

  const spec = MODES[mode]
  const clueValue = spec.steps[difficulty][step]
  let message = spec.question
  if (isAnswered && round) {
    if (lastScore === 0) message = `It was ${round.answer.title} by ${round.answer.artistName}`
    else if (earnedBonus) message = `${streak} in a row! Bonus star`
    else message = `Yes! ${lastScore} ${lastScore === 1 ? 'star' : 'stars'}`
  }

  let mood: BunnyMood = 'idle'
  if (phase === 'guessing') mood = mode === 'sketch' && isDrawing ? 'drawing' : 'idle'
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
                ? 'Guess the painting'
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
            <p className="sketchbook-title">How will you play?</p>
            <div className="sketchbook-modes" role="radiogroup" aria-label="Game mode">
              {MODE_ORDER.map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={option === mode}
                  className={option === mode ? 'is-selected' : undefined}
                  onClick={() => setMode(option)}
                >
                  {MODES[option].label}
                </button>
              ))}
            </div>
            <p className="sketchbook-note">The less you need to see, the more stars you earn.</p>
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
              Best on {spec.label.toLowerCase()}, {difficulty}: {best} · Best streak: {bestStreak}
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
              {mode === 'sketch' ? (
                <canvas ref={canvasRef} className="sketchbook-canvas" aria-hidden="true" />
              ) : loaded && focus ? (
                <div
                  className="sketchbook-fit"
                  style={{ '--ratio': loaded.ink.width / loaded.ink.height } as React.CSSProperties}
                  aria-hidden="true"
                >
                  <img
                    className={`sketchbook-clue is-${mode}`}
                    src={clueUrl(mode, loaded) ?? undefined}
                    alt=""
                    draggable={false}
                    style={
                      mode === 'zoom'
                        ? {
                            transform: `scale(${clueValue})`,
                            transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
                          }
                        : { filter: `blur(calc(${clueValue} * 100cqw))` }
                    }
                  />
                </div>
              ) : null}
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
                    {spec.more}
                  </button>
                ) : (
                  <span className="sketchbook-worth">Nothing left to show</span>
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
