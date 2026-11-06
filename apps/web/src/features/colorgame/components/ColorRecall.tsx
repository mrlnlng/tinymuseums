'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { earn } from '@/features/economy/store'
import MinigameFrame from '@/features/minigames/components/MinigameFrame'
import { makeRound, showMs, type ColorRound } from '../lib/round'

const BEST_KEY = 'tm:colorrecall:best'
const MASK_MS = 350
const FEEDBACK_MS = 500

type Phase = 'intro' | 'show' | 'mask' | 'pick' | 'over'

interface ColorRecallProps {
  onClose: () => void
}

function readBest(): number {
  return Number(readLocal(BEST_KEY)) || 0
}

export default function ColorRecall({ onClose }: ColorRecallProps) {
  const { play } = useSound()
  const [phase, setPhase] = useState<Phase>('intro')
  const [streak, setStreak] = useState(0)
  const [best, setBest] = useState(readBest)
  const [round, setRound] = useState<ColorRound | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)

  const nextRound = useCallback((nextStreak: number) => {
    setPicked(null)
    setIsCorrect(false)
    setRound(makeRound(nextStreak, Math.random))
    setPhase('show')
  }, [])

  const start = useCallback(() => {
    play('click')
    setStreak(0)
    nextRound(0)
  }, [nextRound, play])

  const choose = useCallback(
    (index: number) => {
      if (phase !== 'pick' || isCorrect || !round) return
      setPicked(index)

      if (index === round.answer) {
        const nextStreak = streak + 1
        setStreak(nextStreak)
        setIsCorrect(true)
        play('harp')
        if (nextStreak > best) {
          setBest(nextStreak)
          writeLocal(BEST_KEY, String(nextStreak))
        }
        return
      }

      setPhase('over')
      play('click')
      if (streak > 0) earn('game', { game: 'colorrecall', score: streak })
      if (streak > best) {
        setBest(streak)
        writeLocal(BEST_KEY, String(streak))
      }
    },
    [best, isCorrect, phase, play, round, streak],
  )

  useEffect(() => {
    if (phase !== 'show' || !round) return
    const timer = window.setTimeout(() => setPhase('mask'), showMs(streak))
    return () => window.clearTimeout(timer)
  }, [phase, round, streak])

  useEffect(() => {
    if (phase !== 'mask') return
    const timer = window.setTimeout(() => setPhase('pick'), MASK_MS)
    return () => window.clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (!isCorrect) return
    const timer = window.setTimeout(() => nextRound(streak), FEEDBACK_MS)
    return () => window.clearTimeout(timer)
  }, [isCorrect, nextRound, streak])

  const panelColour = phase === 'mask' ? '#8a8a8a' : (round?.target ?? '#8a8a8a')

  return (
    <MinigameFrame
      label="Color Recall"
      onClose={onClose}
      cardClassName="colorrecall"
      header={
        <>
          <span className="sketchbook-round colorrecall-heading">Color Recall</span>
          {phase === 'intro' ? null : (
            <span className="colorrecall-streak">
              {phase === 'over' ? `Final streak ${streak}` : `Streak ${streak}`}
            </span>
          )}
        </>
      }
    >
      {phase === 'intro' ? (
        <div className="sketchbook-summary colorrecall-intro">
          <span className="colorrecall-logo" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <p className="sketchbook-title">Color Recall</p>
          <p className="sketchbook-note">A color flashes. Pick it out of four close matches.</p>
          <p className="colorrecall-best">Best streak: {best}</p>
          <button type="button" className="button" onClick={start}>
            Start
          </button>
        </div>
      ) : phase === 'over' ? (
        <div className="colorrecall-result">
          <div className="colorrecall-grid is-over">
            {round?.options.map((hex, index) => {
              const state =
                index === round.answer
                  ? ' is-correct'
                  : index === picked
                    ? ' is-wrong'
                    : ' is-faded'
              return (
                <button
                  key={hex}
                  type="button"
                  className={`colorrecall-swatch${state}`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Option ${index + 1}`}
                  disabled
                >
                  {index === round.answer ? (
                    <span aria-hidden="true">✓</span>
                  ) : index === picked ? (
                    <span aria-hidden="true">×</span>
                  ) : null}
                </button>
              )
            })}
          </div>
          <p className="colorrecall-verdict" role="status">
            The correct match was option {(round?.answer ?? 0) + 1}.
          </p>
          <p className="sketchbook-title">Streak {streak}</p>
          <p className="sketchbook-note">Best streak: {best}</p>
          <div className="sketchbook-actions">
            <button type="button" className="button" onClick={start}>
              Play again
            </button>
            <button type="button" className="button secondary" onClick={onClose}>
              Back
            </button>
          </div>
        </div>
      ) : phase === 'pick' ? (
        <>
          <p className="sketchbook-prompt" aria-live="polite">
            {isCorrect ? 'Nice! Next one…' : 'Which one was it?'}
          </p>
          <div className="colorrecall-grid">
            {round?.options.map((hex, index) => {
              const state = isCorrect
                ? index === picked
                  ? ' is-correct'
                  : ' is-faded'
                : ''
              return (
                <button
                  key={hex}
                  type="button"
                  className={`colorrecall-swatch${state}`}
                  style={{ backgroundColor: hex }}
                  aria-label={`Option ${index + 1}`}
                  onClick={() => choose(index)}
                  disabled={isCorrect}
                >
                  {isCorrect && index === picked ? <span aria-hidden="true">✓</span> : null}
                </button>
              )
            })}
          </div>
        </>
      ) : (
        <>
          <div className="colorrecall-stage">
            <div
              className="colorrecall-panel"
              style={{ backgroundColor: panelColour }}
              role="img"
              aria-label={phase === 'mask' ? 'Colors hidden' : 'Color to remember'}
            />
          </div>
          <p className="sketchbook-prompt" aria-live="polite">
            {phase === 'show' ? 'Remember this color…' : 'Hold it in your mind…'}
          </p>
        </>
      )}
    </MinigameFrame>
  )
}
