'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

/**
 * Uploading a work, without the file ever touching the application.
 *
 *   1. hash the file in the browser, so the storage key stays content-addressed
 *   2. ask for a presigned URL
 *   3. PUT the bytes straight to storage
 *   4. tell the API the key, with the metadata
 *
 * Step 3 is the point: a 25MB file would be rejected outright by serverless
 * request payload limits if it went through a route handler.
 */

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
          medium: formData.get('medium'),
          year: Number(formData.get('year')) || undefined,
          dimensions: formData.get('dimensions'),
          forSale: Boolean(formData.get('forSale')),
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
    <form
      className="card"
      action={(formData) => {
        void submit(formData)
      }}
    >
      <h2 style={{ fontSize: 17, marginTop: 0 }}>Add a work</h2>

      {error ? <p className="notice bad">{error}</p> : null}
      {done ? <p className="notice ok">{done}</p> : null}

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
      <div className="grid two">
        <div className="field">
          <label htmlFor="medium">Medium</label>
          <input id="medium" name="medium" placeholder="Oil on linen" />
        </div>
        <div className="field">
          <label htmlFor="year">Year</label>
          <input id="year" name="year" type="number" min={1000} max={2100} />
        </div>
        <div className="field">
          <label htmlFor="dimensions">Dimensions</label>
          <input id="dimensions" name="dimensions" placeholder="40 x 60 cm" />
        </div>
        <div className="field">
          <label htmlFor="forSale">
            <input id="forSale" name="forSale" type="checkbox" /> Open to enquiries
          </label>
          <span className="hint">Visitors can email you about it. No payment happens here.</span>
        </div>
      </div>

      <button className="button" type="submit" disabled={busy}>
        {PHASE_LABEL[phase]}
      </button>
    </form>
  )
}
