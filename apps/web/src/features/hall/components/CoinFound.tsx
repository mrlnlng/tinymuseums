'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

interface CoinFoundProps {
  onClose: () => void
}

export default function CoinFound({ onClose }: CoinFoundProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      className="coin-found"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      role="dialog"
      aria-modal="true"
      aria-label="You found a coin"
      onClick={onClose}
    >
      <div className="coin-found-stage">
        <img className="coin-found-urn" src="/assets/pedestal-5.png" alt="" />
        <h2 className="coin-found-title">You found a coin!</h2>
        <p className="coin-found-code" onClick={(e) => e.stopPropagation()}>
          Use &quot;tinymuseum&quot;
          <br />
          for 2$ OFF your order
        </p>
        <motion.img
          className="coin-found-coin"
          src="/assets/coin-large.png"
          alt=""
          initial={{ scale: 0.4, rotate: -200, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.35, duration: 0.7 }}
        />
      </div>
    </motion.div>
  )
}
