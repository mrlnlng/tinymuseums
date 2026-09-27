'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { MAX_BUG_CONTACT, MAX_BUG_MESSAGE } from '@tiny/core/bugs'
import { collectContext } from '@/features/feedback/lib/bug-report'

type Status = 'editing' | 'sending' | 'sent'

const SEND_FAILED = 'Could not send that — try again in a moment.'

export default function BugReportSheet({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [status, setStatus] = useState<Status>('editing')
  const [error, setError] = useState<string | null>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messageRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  async function send(event: React.FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError(null)
    try {
      const response = await fetch('/api/bugs', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, contact, page: pathname, context: collectContext() }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(body?.error ?? SEND_FAILED)
      }
      setStatus('sent')
    } catch (e) {
      setError(e instanceof Error ? e.message : SEND_FAILED)
      setStatus('editing')
    }
  }

  return (
    <div className="bug-report" role="dialog" aria-modal="true" aria-labelledby="bug-report-title">
      <button type="button" className="bug-report-scrim" onClick={onClose} aria-label="Close" />

      {status === 'sent' ? (
        <div className="bug-report-card">
          <h2 id="bug-report-title" className="script bug-report-title">Thank you!</h2>
          <p className="bug-report-note">We&apos;ll take a look and get it fixed.</p>
          <div className="bug-report-actions">
            <button type="button" className="button" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form className="bug-report-card" onSubmit={send}>
          <h2 id="bug-report-title" className="script bug-report-title">Something not working?</h2>

          <textarea
            ref={messageRef}
            className="bug-report-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What happened?"
            maxLength={MAX_BUG_MESSAGE}
            rows={4}
            required
            aria-label="What happened?"
          />
          <input
            className="bug-report-input"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or @handle for a reply (optional)"
            maxLength={MAX_BUG_CONTACT}
            aria-label="Email or handle for a reply (optional)"
          />

          <p className="bug-report-note">Your device and browser details are sent along to help us fix it.</p>
          {error ? <p className="bug-report-error" role="alert">{error}</p> : null}

          <div className="bug-report-actions">
            <button type="button" className="button quiet" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="button"
              disabled={status === 'sending' || !message.trim()}
            >
              {status === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
