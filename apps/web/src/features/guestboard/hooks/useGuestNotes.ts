'use client'

import { useCallback, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import type { GuestNoteColor, GuestNoteDto, GuestNotePageDto } from '@tiny/core'

const PAGE_SIZE = 50
const REFRESH_MS = 30_000

export interface NoteDraft {
  name: string
  message: string
  color: GuestNoteColor
}

export class PostRejected extends Error {}

async function fetchPage(url: string): Promise<GuestNotePageDto> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`The guest board did not load (${response.status})`)
  return response.json()
}

interface Options {
  enabled?: boolean
  live?: boolean
}

export function useGuestNotes({ enabled = true, live = true }: Options = {}) {
  const { data, size, setSize, mutate } = useSWRInfinite<GuestNotePageDto>(
    (index, previous: GuestNotePageDto | null) => {
      if (!enabled || (previous && !previous.nextCursor)) return null
      const cursor = previous?.nextCursor ? `&cursor=${encodeURIComponent(previous.nextCursor)}` : ''
      return `/api/guestboard?limit=${PAGE_SIZE}${cursor}`
    },
    fetchPage,
    { refreshInterval: live ? REFRESH_MS : 0, revalidateFirstPage: true },
  )

  const notes = useMemo(() => data?.flatMap((page) => page.notes) ?? [], [data])
  const hasMore = Boolean(data?.at(-1)?.nextCursor)
  const isLoadingMore = size > 0 && data !== undefined && data[size - 1] === undefined

  const loadMore = useCallback(() => {
    if (hasMore && !isLoadingMore) void setSize((current) => current + 1)
  }, [hasMore, isLoadingMore, setSize])

  const post = useCallback(
    async (draft: NoteDraft): Promise<GuestNoteDto> => {
      const response = await fetch('/api/guestboard', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const body = (await response.json().catch(() => ({}))) as { note?: GuestNoteDto; error?: string }
      if (!response.ok || !body.note) {
        throw new PostRejected(body.error ?? 'Your note could not be pinned up. Try again?')
      }

      const note = body.note
      await mutate(
        (pages) => {
          if (!pages?.length) return [{ notes: [note], nextCursor: null }]
          const [first, ...rest] = pages
          return [{ ...first, notes: [note, ...first.notes] }, ...rest]
        },
        { revalidate: false },
      )
      return note
    },
    [mutate],
  )

  return { notes, hasMore, loadMore, post }
}
