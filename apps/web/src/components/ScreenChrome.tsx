'use client'

import { usePathname, useRouter } from 'next/navigation'
import { SoundToggle } from './SoundProvider'
import { motion } from 'motion/react'

/**
 * The icon pair in the screen's top-right corner, as the mockups have it:
 * home, then the speaker.
 *
 * Rendered once in the root layout rather than per page, so it sits in the
 * same place on every screen and does not need re-adding to each one.
 */
export default function ScreenChrome() {
  const pathname = usePathname()
  const router = useRouter()

  // The studio has its own topbar with real navigation; floating icons over
  // its forms would just be noise.
  if (pathname.startsWith('/studio')) return null

  // On the landing page home would point at the page you are already on.
  const showHome = pathname !== '/'

  return (
    <motion.div 
      className="screen-chrome"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", bounce: 0, duration: 0.6, delay: 0.5 }}
    >
      {showHome ? (
        <button
          type="button"
          className="chrome-button"
          onClick={() => router.push('/')}
          aria-label="Back to the entrance"
          title="Back to the entrance"
        >
          <img src="/assets/icon-home.png" alt="" />
        </button>
      ) : null}
      <SoundToggle />
    </motion.div>
  )
}
