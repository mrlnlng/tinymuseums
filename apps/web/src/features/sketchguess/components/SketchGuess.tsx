'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { loadRound, type LoadedRound } from '../lib/api'
import { planGame, randomRound } from '../lib/plan'
import { createReveal, type SketchReveal } from '../lib/reveal'

const ROUNDS = 3
const REVEAL_MS = 12_000
const MAX_FRAME_MS = 100
const BEST_KEY = 'tiny-museum:sketch-best'

export interface PreparedGame {
  epochId: number
  first: LoadedRound
}

export async function prepareSketchGame(epochId: number, signal?: AbortSignal): Promise<PreparedGame> {
  return { epochId, first: await loadRound(epochId, randomRound(), signal) }
}

function openingPlan(prepared: PreparedGame | null): number[] {
  if (!prepared) return [randomRound()]
  const { round, poolSize } = prepared.first.round
  return planGame(poolSize, ROUNDS, { first: round })
}

type Phase = 'loading' | 'guessing' | 'answered' | 'done' | 'error'

function starsFor(elapsedRatio: number): number {
  if (elapsedRatio < 0.4) return 3
  if (elapsedRatio < 0.75) return 2
  return 1
}

function readBest(): number {
  try {
    return Number(window.localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

function saveBest(score: number): void {
  try {
    window.localStorage.setItem(BEST_KEY, String(score))
  } catch {}
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

interface SketchGuessProps {
  epochId: number
  prepared: PreparedGame | null
  onClose: () => void
}

export default function SketchGuess({ epochId, prepared, onClose }: SketchGuessProps) {
  const { play } = useSound()
  const [plan, setPlan] = useState(() => openingPlan(prepared))
  const [roundIndex, setRoundIndex] = useState(0)
  const [loaded, setLoaded] = useState<LoadedRound | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [picked, setPicked] = useState<string | null>(null)
  const [scores, setScores] = useState<number[]>([])
  const [best, setBest] = useState(0)
  const [attempt, setAttempt] = useState(0)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<SketchReveal | null>(null)
  const activeMsRef = useRef(0)
  const roundsRef = useRef(
    new Map<number, { pending: Promise<LoadedRound>; signal: AbortSignal | null }>(
      prepared
        ? [[prepared.first.round.round, { pending: Promise.resolve(prepared.first), signal: null }]]
        : [],
    ),
  )
  const poolSizeRef = useRef(prepared?.first.round.poolSize ?? 0)
  const abortRef = useRef<AbortController | null>(null)

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
    revealRef.current = null
    const canvas = canvasRef.current
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)

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
  }, [currentRound, attempt, requestRound])

  useEffect(() => {
    if (phase !== 'guessing' || !loaded || !canvasRef.current) return
    const reveal = createReveal(canvasRef.current, loaded.ink)
    revealRef.current = reveal
    activeMsRef.current = 0

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      activeMsRef.current += Math.min(MAX_FRAME_MS, now - last)
      last = now
      const ratio = activeMsRef.current / REVEAL_MS
      if (ratio >= 1) {
        reveal.finish()
        return
      }
      reveal.draw(ratio ** 1.4)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [phase, loaded])

  const choose = useCallback(
    (pieceId: string) => {
      if (phase !== 'guessing' || !loaded) return
      const correct = pieceId === loaded.round.answer.pieceId
      revealRef.current?.finish()
      setPicked(pieceId)
      setScores((previous) => [...previous, correct ? starsFor(activeMsRef.current / REVEAL_MS) : 0])
      setPhase('answered')
      play(correct ? 'coin' : 'click')
    },
    [phase, loaded, play],
  )

  const next = useCallback(() => {
    if (roundIndex + 1 < ROUNDS) {
      setRoundIndex(roundIndex + 1)
      return
    }
    const total = scores.reduce((sum, stars) => sum + stars, 0)
    const previousBest = readBest()
    if (total > previousBest) saveBest(total)
    setBest(Math.max(total, previousBest))
    setPhase('done')
  }, [roundIndex, scores])

  const playAgain = useCallback(() => {
    const poolSize = poolSizeRef.current
    const avoid = new Set(plan.map((round) => round % poolSize))
    setPlan(poolSize > 0 ? planGame(poolSize, ROUNDS, { avoid }) : [randomRound()])
    setRoundIndex(0)
    setScores([])
    setAttempt((n) => n + 1)
  }, [plan])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  const total = scores.reduce((sum, stars) => sum + stars, 0)
  const maxStars = ROUNDS * 3
  const lastScore = scores[scores.length - 1] ?? 0
  const round = loaded?.round
  const isAnswered = phase === 'answered'

  let message = 'Which painting is being drawn?'
  if (isAnswered && round) {
    message =
      lastScore > 0
        ? `Yes! ${lastScore} ${lastScore === 1 ? 'star' : 'stars'}`
        : `It was ${round.answer.title} by ${round.answer.artistName}`
  }

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
        <header className="sketchbook-header">
          <span className="sketchbook-round">
            {phase === 'done' ? 'Finished' : `Round ${roundIndex + 1} of ${ROUNDS}`}
          </span>
          <Stars count={total} of={maxStars} />
          <button type="button" className="sketchbook-close" onClick={onClose} aria-label="Close the game">
            ×
          </button>
        </header>

        {phase === 'done' ? (
          <div className="sketchbook-summary">
            <p className="sketchbook-title">
              {total} of {maxStars} stars
            </p>
            <p className="sketchbook-note">Best so far: {best}</p>
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
