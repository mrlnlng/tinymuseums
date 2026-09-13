'use client'

import { useCallback, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import type { GuestNoteColor, GuestNoteDto, GuestNotePageDto } from '@tiny/core'

/*  The guest board's notes, newest first, a page at a time from
    /api/guestboard. SWR owns the cache: it refetches when the visitor comes
    back to the tab and every half minute while the board is open, so notes
    other visitors leave turn up without a reload, and a posted note is written
    straight into the cache from the server's reply rather than waiting for the
    next refetch (the route caches reads for a few seconds at the edge). */

const PAGE_SIZE = 50
const REFRESH_MS = 30_000

export interface NoteDraft {
  name: string
  message: string
  color: GuestNoteColor
}

/** A post the server turned down, carrying the sentence it gave as the reason. */
export class PostRejected extends Error {}

async function fetchPage(url: string): Promise<GuestNotePageDto> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`The guest board did not load (${response.status})`)
  return response.json()
}

export function useGuestNotes() {
  const { data, size, setSize, mutate } = useSWRInfinite<GuestNotePageDto>(
    (index, previous: GuestNotePageDto | null) => {
      if (previous && !previous.nextCursor) return null
      const cursor = previous?.nextCursor ? `&cursor=${encodeURIComponent(previous.nextCursor)}` : ''
      return `/api/guestboard?limit=${PAGE_SIZE}${cursor}`
    },
    fetchPage,
    { refreshInterval: REFRESH_MS, revalidateFirstPage: true },
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
      // Pinned to the top of the first page; no refetch, which could still be served stale.
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
