'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* Uploads a work without the file ever touching the application: hash in the browser (content-addressed key), presign, PUT straight to storage, then record the key — serverless payload limits would reject a 25MB file through a route handler. */

async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

type Phase = 'idle' | 'hashing' | 'uploading' | 'saving'

const PHASE_LABEL: Record<Phase, string> = {
  idle: 'Upload',
  hashing: 'Reading the file…',
  uploading: 'Uploading…',
  saving: 'Saving…',
}

export default function UploadWork() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(null)

  async function submit(formData: FormData): Promise<void> {
    setError(null)
    setDone(null)

    const file = formData.get('image')
    if (!(file instanceof File) || file.size === 0) {
      setError('Choose an image to upload')
      return
    }

    try {
      setPhase('hashing')
      const digest = await sha256Hex(file)

      setPhase('uploading')
      const presignResponse = await fetch('/api/studio/uploads/presign', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contentType: file.type, digest, bytes: file.size }),
      })
      const presigned = (await presignResponse.json()) as {
        url?: string
        headers?: Record<string, string>
        error?: string
      }
      if (!presignResponse.ok || !presigned.url) {
        setError(presigned.error ?? 'Could not start the upload')
        return
      }

      const put = await fetch(presigned.url, {
        method: 'PUT',
        headers: presigned.headers ?? {},
        body: file,
      })
      if (!put.ok) {
        setError('The upload did not go through. Try again.')
        return
      }

      setPhase('saving')
      const saveResponse = await fetch('/api/studio/pieces', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contentType: file.type,
          digest,
          title: formData.get('title'),
          description: formData.get('description'),
          shopUrl: formData.get('shopUrl'),
        }),
      })
      const saved = (await saveResponse.json()) as { error?: string }
      if (!saveResponse.ok) {
        setError(saved.error ?? 'Could not save the work')
        return
      }

      setDone('Uploaded. The image is being processed.')
      router.refresh()
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setPhase('idle')
    }
  }

  const busy = phase !== 'idle'

  return (
    <motion.form
      layout
      className="card"
      action={(formData) => {
        void submit(formData)
      }}
    >
      <h2 className="card-title">Add a work</h2>

      <AnimatePresence mode="popLayout">
        {error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="notice bad"
          >
            {error}
          </motion.p>
        ) : null}
        {done ? (
          <motion.p
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="notice ok"
          >
            {done}
          </motion.p>
        ) : null}
      </AnimatePresence>

      <div className="field">
        <label htmlFor="image">Image</label>
        <input id="image" name="image" type="file" accept="image/*" required />
        <span className="hint">
          At least 1200px on the long edge. JPEG, PNG, WebP, AVIF or TIFF, up to 25MB.
        </span>
      </div>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input id="title" name="title" required />
      </div>
      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required minLength={20} />
        <span className="hint">
          At least 20 characters. This is what a visitor reads standing in front of it.
        </span>
      </div>
      <div className="field">
        <label htmlFor="shopUrl">Shop print link (optional)</label>
        <input id="shopUrl" name="shopUrl" type="url" placeholder="https://…" />
        <span className="hint">
          Where "Shop print" goes on this work. Leave empty to hide the button.
        </span>
      </div>

      <button className="button" type="submit" disabled={busy}>
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="phase-label"
          >
            {PHASE_LABEL[phase]}
          </motion.span>
        </AnimatePresence>
      </button>
    </motion.form>
  )
}
