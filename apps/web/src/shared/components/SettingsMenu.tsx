'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useEscapeKey } from '@/shared/hooks/useEscapeKey'
import SoundToggle from '@/features/sound/components/SoundToggle'
import { openBugReport } from '@/features/feedback/lib/bug-report'
import { openAccount } from '@/features/account/lib/account'

export default function SettingsMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const host = useRef<HTMLDivElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)

  useEffect(() => { setIsOpen(false) }, [pathname])

  useEscapeKey((event) => {
    event.preventDefault()
    setIsOpen(false)
    toggle.current?.focus()
  }, isOpen)

  useEffect(() => {
    if (!isOpen) return
    const outside = (event: Event) => {
      if (event.target instanceof Node && !host.current?.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('pointerdown', outside, true)
    document.addEventListener('focusin', outside)
    return () => {
      document.removeEventListener('pointerdown', outside, true)
      document.removeEventListener('focusin', outside)
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
            {/* "Tiny Museum Screens" from the mocks: the cat inside a ring, scaled from its 87.75 box. */}
            <circle cx="37.5" cy="37.5" r="34.78" fill="none" stroke="currentColor" strokeWidth="5.24" />
            <path transform="translate(37.5 37.5) scale(0.8547) translate(-43.75 -43.75)"
              d="M 29.15625 22.6875 L 32.515625 23.730469 L 37.679688 30.441406 L 49.824219 30.441406 L 54.46875 24.246094 L 56.796875 22.6875 L 58.863281 22.953125 L 60.671875 25.015625 L 63.515625 31.738281 L 66.097656 44.136719 L 73.335938 43.101562 L 72.816406 44.398438 L 66.359375 45.429688 L 66.097656 48.527344 L 73.589844 48.527344 L 73.851562 49.558594 L 66.097656 49.824219 L 65.328125 52.921875 L 73.070312 54.46875 L 73.589844 55.765625 L 64.550781 54.46875 L 62.222656 58.34375 L 58.34375 61.453125 L 53.699219 63.515625 L 46.460938 64.8125 L 38.972656 64.550781 L 31.738281 62.738281 L 27.605469 60.417969 L 24.5 57.3125 L 22.953125 54.214844 L 14.167969 56.027344 L 14.429688 54.46875 L 22.171875 52.921875 L 21.402344 49.824219 L 13.648438 49.558594 L 13.914062 48.527344 L 21.402344 48.527344 L 21.140625 45.429688 L 14.683594 44.398438 L 14.167969 43.101562 L 21.402344 44.136719 L 24.5 30.441406 L 27.082031 24.761719 L 29.15625 22.953125 Z M 29.15625 22.6875"
            />
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
