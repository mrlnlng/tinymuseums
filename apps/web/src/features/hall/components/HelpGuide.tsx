'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

/*  What the help booth hands out, from mockup 2.1: the booth itself, blown up
    to fill the screen, with the guide written on its counter.

    The booth is one drawing, and the guide is however many lines it is, so the
    art is cut into three horizontal bands and only the middle one stretches —
    the awning and the counter keep the proportions they were drawn at, and the
    two yellow posts either side of the text grow with it. The same trick the
    rope on every wall uses, turned on its side. */

/*  Where the bands fall in help-center.png, measured off the art: the scallops
    of the awning end at 46.2%, and the counter's rail begins at 74%. */
const AWNING = 0.462
const COUNTER = 0.74
/** The drawing's own proportions, so the two fixed bands cannot be stretched. */
const BOOTH_ASPECT = 811 / 1039

const STEPS = [
  'Use the left and right arrows to take a guilt-free scroll through the museum.',
  'Interact: tap any painting that catches your eye to view more details.',
]

interface HelpGuideProps {
  onClose: () => void
}

export default function HelpGuide({ onClose }: HelpGuideProps) {
  // Escape closes it, as it closes the enlarged view.
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
      {/*  The whole surface closes it. The booth is drawn wider than the frame,
           so there is barely any backdrop left to tap beside it — the booth is
           made inert instead and every tap lands here. */}
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
