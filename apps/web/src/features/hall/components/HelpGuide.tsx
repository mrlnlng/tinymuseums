'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

const AWNING = 0.462
const COUNTER = 0.74
const BOOTH_ASPECT = 811 / 1039

const STEPS = [
  'Use the left and right arrows to take a guilt-free scroll through the museum.',
  'Interact: tap any painting that catches your eye to view more details.',
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

  return (
    <motion.div
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

      <motion.div
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
        </div>

        <div className="help-band help-band-counter" />
      </motion.div>
    </motion.div>
  )
}
