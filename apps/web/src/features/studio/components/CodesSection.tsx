'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { createCodeAction, deleteCodeAction } from '@/features/studio/actions'

/* The codes section lives on the gallery page and runs through a transition +
   router.refresh() like the arrange controls, so adding or removing a code
   never throws the visitor back to the top of the studio. */

export interface CodeRow {
  token: string
  placement: string
  scans: number
}

export default function CodesSection({
  codes,
  baseUrl,
}: {
  codes: CodeRow[]
  baseUrl: string
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [placement, setPlacement] = useState('')
  const [message, setMessage] = useState<{ kind: 'ok' | 'bad'; text: string } | null>(null)

  function create(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setMessage(null)
    startTransition(async () => {
      const result = await createCodeAction(formData)
      if (result?.error) setMessage({ kind: 'bad', text: result.error })
      else setMessage({ kind: 'ok', text: 'Code ready — the link is below.' })
      setPlacement('')
      router.refresh()
    })
  }

  function remove(token: string): void {
    const formData = new FormData()
    formData.set('token', token)
    setMessage(null)
    startTransition(async () => {
      await deleteCodeAction(formData)
      router.refresh()
    })
  }

  return (
    <section className="card">
      <h2 className="card-title">Codes</h2>
      <p className="small muted lead">
        Make a separate code for each place you put one — that is the only way to find out
        whether the café poster does better than the business card.
      </p>

      {message ? (
        <p className={`notice ${message.kind}`} role="alert">
          {message.text}
        </p>
      ) : null}

      <form className="codes-form" onSubmit={create}>
        <div className="field">
          <label htmlFor="placement">Where is this one going?</label>
          <input
            id="placement"
            name="placement"
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            placeholder="café poster"
            required
          />
        </div>
        <button className="button" type="submit" disabled={pending}>
          Make a code
        </button>
      </form>

      {codes.length === 0 ? (
        <p className="muted flush">No codes yet.</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Placement</th>
              <th>Link</th>
              <th>Scans</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.token}>
                <td>{code.placement}</td>
                <td>
                  <code className="token">
                    {baseUrl}/q/{code.token}
                  </code>
                </td>
                <td className="num">{code.scans}</td>
                <td>
                  <button
                    className="code-remove"
                    type="button"
                    onClick={() => remove(code.token)}
                    disabled={pending}
                    aria-label={`Remove the ${code.placement} code`}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
