'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { openBugReport } from '@/features/feedback/lib/bug-report'

const AWNING = 0.462
const COUNTER = 0.725
const BOOTH_ASPECT = 811 / 1039

const BOOTH_WIDTH = 140
const COVER_WIDTH = 136
const COUNTER_CROP = 0.75
const MIN_SCALE = 0.75
const SCALE_STEP = 0.01

function fitWidth(scale: number): number {
  return Math.max(BOOTH_WIDTH, COVER_WIDTH / scale)
}

const STEPS = [
  'Swipe left and right to take a guilt-free scroll through the museum.',
  'Interact: tap any painting that catches your eye to view more details.',
  'Explore: hidden easter eggs are tucked all around the museum!',
]

interface HelpGuideProps {
  onClose: () => void
}

export default function HelpGuide({ onClose }: HelpGuideProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const rootRef = useRef<HTMLDivElement>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const boothRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const root = rootRef.current
    const fitBox = fitRef.current
    const booth = boothRef.current
    const counter = counterRef.current
    if (!root || !fitBox || !booth || !counter) return

    // Widening the booth rewraps the tips, so height is not monotonic in scale; measuring
    // each candidate avoids a feedback loop that flipped the line count every frame.
    const fit = () => {
      let chosen = MIN_SCALE
      for (let candidate = 1; candidate > MIN_SCALE; candidate -= SCALE_STEP) {
        fitBox.style.width = `${fitWidth(candidate)}%`
        const height = booth.offsetHeight - counter.offsetHeight * COUNTER_CROP
        if (height * candidate <= root.clientHeight) {
          chosen = candidate
          break
        }
      }
      fitBox.style.width = `${fitWidth(chosen)}%`
      setScale(chosen)
    }
    let isMounted = true
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(root)
    void document.fonts?.ready.then(() => {
      if (isMounted) fit()
    })
    return () => {
      isMounted = false
      observer.disconnect()
    }
  }, [])

  return (
    <motion.div
      ref={rootRef}
      className="help-guide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label="Help guide"
    >
      <button
        type="button"
        className="help-guide-scrim"
        onClick={onClose}
        aria-label="Close the help guide"
      />

      <div
        ref={fitRef}
        className="help-guide-fit"
        style={{
          width: `${fitWidth(scale)}%`,
          transform: `scale(${scale})`,
        }}
      >
        <motion.div
          ref={boothRef}
          className="help-guide-booth"
          initial={{ y: -28, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
          style={
            {
              '--awning': AWNING,
              '--counter': COUNTER,
              '--booth-aspect': BOOTH_ASPECT,
            } as React.CSSProperties
          }
        >
          <div className="help-band help-band-awning" />

          <div className="help-band help-band-middle">
            <ol className="help-steps">
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <button
              type="button"
              className="help-report"
              data-track="bug_report"
              onClick={() => {
                onClose()
                openBugReport()
              }}
            >
              Something not working? Tell us
            </button>
          </div>

          <div ref={counterRef} className="help-band help-band-counter" />
        </motion.div>
      </div>
    </motion.div>
  )
}
