'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useState } from 'react'
import { hangAction, movePieceAction, unhangAction } from '@/features/studio/actions'

/* The arrange controls run through a transition + router.refresh() instead of
   a form redirect, so pressing ▲/▼ keeps the visitor exactly where they are on
   the page — a redirect would throw them back to the top of the studio. */

function formFor(entries: Record<string, string>): FormData {
  const form = new FormData()
  for (const [key, value] of Object.entries(entries)) form.set(key, value)
  return form
}

export function FloorControls({
  pieceId,
  title,
  first,
  last,
}: {
  pieceId: string
  title: string
  first: boolean
  last: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  function move(direction: 'up' | 'down'): void {
    startTransition(async () => {
      await movePieceAction(formFor({ id: pieceId, direction }))
      router.refresh()
    })
  }

  function unhang(): void {
    startTransition(async () => {
      await unhangAction(formFor({ id: pieceId }))
      router.refresh()
    })
  }

  return (
    <div className="stand-controls">
      <button
        className="stand-move"
        type="button"
        onClick={() => move('up')}
        disabled={pending || first}
        aria-label={`Move ${title} up`}
      >
        <span aria-hidden="true">▲</span>
      </button>
      <button
        className="stand-move"
        type="button"
        onClick={() => move('down')}
        disabled={pending || last}
        aria-label={`Move ${title} down`}
      >
        <span aria-hidden="true">▼</span>
      </button>
      <button className="stand-unhang" type="button" onClick={unhang} disabled={pending}>
        Unhang
      </button>
    </div>
  )
}

export function StorageControls({
  pieceId,
  title,
  disabled,
}: {
  pieceId: string
  title: string
  disabled: boolean
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function hang(): void {
    setError(null)
    startTransition(async () => {
      const result = await hangAction(formFor({ id: pieceId }))
      if (result?.error) setError(result.error)
      router.refresh()
    })
  }

  return (
    <div className="storage-controls">
      <button className="button secondary" type="button" onClick={hang} disabled={disabled || pending}>
        Hang
      </button>
      {error ? (
        <p className="small notice bad flush" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
