'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import SoundToggle from '@/features/sound/components/SoundToggle'
import { openBugReport } from '@/features/feedback/lib/bug-report'
import { openAccount } from '@/features/account/lib/account'

export default function SettingsMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => { setIsOpen(false) }, [pathname])

  useEffect(() => {
    if (!isOpen) return
    const outside = (event: Event) => {
      if (event.target instanceof Node && !host.current?.contains(event.target)) setIsOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setIsOpen(false)
      toggle.current?.focus()
    }
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('focusin', outside)
    document.addEventListener('keydown', escape)
    return () => {
      document.removeEventListener('pointerdown', outside, true)
      document.removeEventListener('focusin', outside)
      document.removeEventListener('keydown', escape)
    }
  }, [isOpen])

  function open(action: () => void) {
    setIsOpen(false)
    action()
  }

  return (
    <div className="settings" ref={host} onKeyDown={event => {
      // Arrow keys operate settings controls without also walking the visitor.
      if (event.key !== 'Escape') event.stopPropagation()
    }}>
      <button ref={toggle} type="button" className="chrome-button settings-toggle"
        aria-label="Settings" title="Settings" aria-expanded={isOpen}
        aria-controls="screen-settings" onClick={() => setIsOpen(value => !value)}>
        <svg viewBox="0 0 75 75" aria-hidden="true">
          <mask id="settings-toggle-cutout">
            <rect width="75" height="75" fill="white" />
            <path fill="black" d="M32 14H43L45 22L49 24L57 22L63 32L57 38L57 42L63 48L57 58L49 55L45 57L43 65H32L30 57L26 55L18 58L12 48L18 42V38L12 32L18 22L26 24L30 22Z" transform="translate(0 -2)" />
            <circle cx="37.5" cy="37.5" r="9" fill="white" />
          </mask>
          <circle cx="37.5" cy="37.5" r="37.5" mask="url(#settings-toggle-cutout)" />
        </svg>
      </button>
      {isOpen ? (
        <div id="screen-settings" className="settings-panel" role="region" aria-label="Settings">
          <p className="settings-heading">Settings</p>
          <button type="button" className="settings-row" onClick={() => open(openAccount)} aria-label="Your account">
          <svg viewBox="0 0 75 75" aria-hidden="true">
            <mask id="account-toggle-cutout">
              <rect width="75" height="75" fill="white" />
              {/* The supplied cat (mock_new_floor/cat.jpg, an SVG), cut out of the disc like the other icons. */}
              <path
                transform="translate(37.5 37.5) scale(0.92) translate(-43.75 -43.75)"
                d="M 29.16 22.69 L 32.52 23.73 L 37.68 30.44 L 49.82 30.44 L 54.47 24.25 L 56.8 22.69 L 58.86 22.95 L 60.67 25.02 L 63.52 31.74 L 66.1 44.14 L 73.34 43.1 L 72.82 44.4 L 66.36 45.43 L 66.1 48.53 L 73.59 48.53 L 73.85 49.56 L 66.1 49.82 L 65.33 52.92 L 73.07 54.47 L 73.59 55.77 L 64.55 54.47 L 62.22 58.34 L 58.34 61.45 L 53.7 63.52 L 46.46 64.81 L 38.97 64.55 L 31.74 62.74 L 27.61 60.42 L 24.5 57.31 L 22.95 54.21 L 14.17 56.03 L 14.43 54.47 L 22.17 52.92 L 21.4 49.82 L 13.65 49.56 L 13.91 48.53 L 21.4 48.53 L 21.14 45.43 L 14.68 44.4 L 14.17 43.1 L 21.4 44.14 L 24.5 30.44 L 27.08 24.76 L 29.16 22.95 Z M 29.16 22.69"
                fill="black"
              />
            </mask>
            <circle cx="37.5" cy="37.5" r="37.5" mask="url(#account-toggle-cutout)" />
          </svg>
            <span>Account</span>
          </button>
          <button type="button" className="settings-row" data-track="bug_report"
            onClick={() => open(openBugReport)} aria-label="Report a problem">
          <svg viewBox="0 0 75 75" aria-hidden="true">
            <mask id="bug-toggle-cutout">
              <rect width="75" height="75" fill="white" />
              {/* A beetle: legs and feelers, body, head, and a seam down its back. */}
              <g stroke="black" strokeWidth="3.2" strokeLinecap="round" fill="none">
                <path d="M33,19 L28,13 M42,19 L47,13" />
                <path d="M25,33 L16,29 M24,42 L14,42 M25,51 L16,56 M50,33 L59,29 M51,42 L61,42 M50,51 L59,56" />
              </g>
              <circle cx="37.5" cy="23.5" r="6.5" fill="black" />
              <ellipse cx="37.5" cy="43" rx="13.5" ry="16" fill="black" />
              <path d="M37.5,30 V58" stroke="white" strokeWidth="2.4" />
            </mask>
            <circle cx="37.5" cy="37.5" r="37.5" mask="url(#bug-toggle-cutout)" />
          </svg>
            <span>Bug Report</span>
          </button>
          <SoundToggle inSettings />
        </div>
      ) : null}
    </div>
  )
}
