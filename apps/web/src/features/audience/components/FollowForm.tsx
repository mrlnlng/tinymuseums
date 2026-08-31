'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/*  Following an artist — the only thing a visitor does that needs an identity, and deliberately not an account. An email, a confirmation, and nothing else. */
export default function FollowForm({ slug, artistName }: { slug: string; artistName: string }) {
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function submit(formData: FormData): Promise<void> {
    setBusy(true)
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ slug, email: formData.get('email') }),
      })
      const data = (await response.json()) as { message?: string; error?: string }
      setMessage(data.message ?? data.error ?? 'Something went wrong')
    } catch {
      setMessage('Could not reach the museum. Try again in a moment.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <motion.div layout className="follow-wrap">
      <AnimatePresence mode="wait">
        {message ? (
          <motion.p
            key="success"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="notice ok"
          >
            {message}
          </motion.p>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="card"
            action={(formData) => {
              void submit(formData)
            }}
          >
            <div className="field">
              <label htmlFor="follow-email">Hear when {artistName} hangs something new</label>
              <input id="follow-email" name="email" type="email" required placeholder="you@example.com" />
              <span className="hint">
                One email when there is new work. Nothing else, and no account needed.
              </span>
            </div>
            <button className="button" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Follow'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
