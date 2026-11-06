'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Placement } from '@tiny/core'
import MinigameFrame from '@/features/minigames/components/MinigameFrame'
import { currentHallOrder, hallPlacements, reasonLabel } from '@/features/rooms/decorate/logic'

export interface HallRoomData {
  slug: string
  draft: Placement[]
  published: Placement[]
  canEdit?: boolean
}

interface Painting {
  id: string
  title: string
  imageUrl: string
  width: number
  height: number
}

interface HallArrangerProps {
  room: HallRoomData
  onClose(): void
  onPublished(): void
}

export default function HallArranger({ room, onClose, onPublished }: HallArrangerProps) {
  const [order, setOrder] = useState<string[]>(() => currentHallOrder(room.draft, room.published))
  const [paintings, setPaintings] = useState<Painting[] | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)

  useEffect(() => {
    const abort = new AbortController()
    fetch('/api/rooms/paintings', { cache: 'no-store', signal: abort.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('paintings')
        const body: unknown = await response.json()
        const rows =
          typeof body === 'object' && body !== null && Array.isArray((body as { paintings?: unknown }).paintings)
            ? ((body as { paintings: Painting[] }).paintings)
            : []
        setPaintings(rows)
      })
      .catch(() => {
        if (!abort.signal.aborted) setNotice('The paintings could not be loaded.')
      })
    return () => abort.abort()
  }, [])

  const byId = useMemo(() => new Map((paintings ?? []).map((painting) => [painting.id, painting])), [paintings])
  const unplaced = useMemo(
    () => (paintings ?? []).filter((painting) => !order.includes(painting.id)),
    [order, paintings],
  )

  const move = useCallback((index: number, delta: number) => {
    setOrder((current) => {
      const next = [...current]
      const target = index + delta
      if (target < 0 || target >= next.length) return current
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
    setStatus(null)
  }, [])

  const remove = useCallback((id: string) => {
    setOrder((current) => current.filter((pieceId) => pieceId !== id))
    setStatus(null)
  }, [])

  const add = useCallback((id: string) => {
    setOrder((current) => (current.includes(id) ? current : [...current, id]))
    setStatus(null)
  }, [])

  const saveDraft = useCallback(async (): Promise<boolean> => {
    setSaving(true)
    setNotice(null)
    let response: Response
    try {
      response = await fetch(`/api/rooms/${room.slug}/draft`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placements: hallPlacements(order) }),
      })
    } catch {
      setSaving(false)
      setNotice('The hall could not be saved just now.')
      return false
    }

    const body: unknown = await response.json().catch(() => null)
    setSaving(false)
    if (!response.ok) {
      const reason =
        typeof body === 'object' && body !== null
          ? ((body as { reason?: unknown; error?: unknown }).reason ??
            (body as { error?: unknown }).error)
          : null
      setNotice(reasonLabel(typeof reason === 'string' ? reason : null))
      return false
    }
    setStatus('Draft saved')
    return true
  }, [order, room.slug])

  const publish = useCallback(async () => {
    setNotice(null)
    setPublishing(true)
    if (!(await saveDraft())) {
      setPublishing(false)
      return
    }

    let response: Response
    try {
      response = await fetch(`/api/rooms/${room.slug}/publish`, { method: 'POST' })
    } catch {
      setPublishing(false)
      setNotice('The hall could not be published just now.')
      return
    }
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const reason =
        typeof body === 'object' && body !== null
          ? ((body as { reason?: unknown; error?: unknown }).reason ??
            (body as { error?: unknown }).error)
          : null
      setPublishing(false)
      setNotice(reasonLabel(typeof reason === 'string' ? reason : null))
      return
    }

    setPublishing(false)
    onPublished()
  }, [onPublished, room.slug, saveDraft])

  return (
    <MinigameFrame
      label="Arrange the hall"
      onClose={onClose}
      closeLabel="Close the hall arranger"
      cardClassName="arranger-card"
      header={<span className="sketchbook-round">Arrange the hall</span>}
    >
      <div className="arranger">
        {notice ? (
          <p className="arranger-error" role="alert">
            {notice}
          </p>
        ) : null}

        <div className="arranger-columns">
          <section className="arranger-column" aria-label="Paintings in the hall">
            <h3 className="arranger-heading">In the hall</h3>
            {order.length === 0 ? (
              <p className="arranger-empty">Nothing is hanging yet. Add a painting below.</p>
            ) : (
              <ol className="arranger-rows">
                {order.map((id, index) => {
                  const painting = byId.get(id)
                  return (
                    <li className="arranger-row" key={id}>
                      <span className="arranger-index">{index + 1}</span>
                      {painting ? (
                        <img className="arranger-thumb" src={painting.imageUrl} alt="" loading="lazy" />
                      ) : (
                        <span className="arranger-thumb" aria-hidden="true" />
                      )}
                      <span className="arranger-name">{painting?.title ?? 'Painting'}</span>
                      <span className="arranger-row-actions">
                        <button
                          type="button"
                          className="arranger-btn"
                          onClick={() => move(index, -1)}
                          disabled={index === 0}
                          aria-label={`Move ${painting?.title ?? 'painting'} up`}
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          className="arranger-btn"
                          onClick={() => move(index, 1)}
                          disabled={index === order.length - 1}
                          aria-label={`Move ${painting?.title ?? 'painting'} down`}
                        >
                          Down
                        </button>
                        <button
                          type="button"
                          className="arranger-btn"
                          onClick={() => remove(id)}
                          aria-label={`Remove ${painting?.title ?? 'painting'}`}
                        >
                          Remove
                        </button>
                      </span>
                    </li>
                  )
                })}
              </ol>
            )}
          </section>

          <section className="arranger-column" aria-label="Paintings to add">
            <h3 className="arranger-heading">Add</h3>
            {paintings === null ? (
              <p className="arranger-empty">Loading paintings…</p>
            ) : unplaced.length === 0 ? (
              <p className="arranger-empty">Every painting is already in the hall.</p>
            ) : (
              <ul className="arranger-rows">
                {unplaced.map((painting) => (
                  <li className="arranger-row" key={painting.id}>
                    <img className="arranger-thumb" src={painting.imageUrl} alt="" loading="lazy" />
                    <span className="arranger-name">{painting.title}</span>
                    <button
                      type="button"
                      className="arranger-btn"
                      onClick={() => add(painting.id)}
                      aria-label={`Add ${painting.title}`}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="arranger-actions">
          {status ? (
            <span className="arranger-status" role="status">
              {status}
            </span>
          ) : null}
          <button type="button" className="button arranger-btn" onClick={() => void saveDraft()} disabled={saving || publishing}>
            {saving ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" className="button arranger-publish" onClick={() => void publish()} disabled={saving || publishing}>
            {publishing ? 'Publishing…' : 'Publish'}
          </button>
        </footer>
      </div>
    </MinigameFrame>
  )
}
