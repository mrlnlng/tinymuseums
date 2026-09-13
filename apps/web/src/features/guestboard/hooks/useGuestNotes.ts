'use client'

import { useCallback, useMemo } from 'react'
import useSWRInfinite from 'swr/infinite'
import type { GuestNoteColor, GuestNoteDto, GuestNotePageDto } from '@tiny/core'

/*  The guest board's notes, newest first, a page at a time from
    /api/guestboard. SWR owns the cache, and every caller shares it: the board
    in the hall and the guest board screens read the same notes, so one
    published on the screens is on the wall when they close. It refetches when
    the visitor comes back to the tab, and every half minute while a `live`
    caller (the open screens) is mounted, so notes other visitors leave turn up
    without a reload. A posted note is written straight into the cache from the
    server's reply rather than waiting for the next refetch, which the route's
    few seconds of edge caching could still answer stale. */

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

interface Options {
  /** False holds off fetching entirely, until the notes are wanted. */
  enabled?: boolean
  /** Poll while mounted. Off for the hall, where nobody is reading them up close. */
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
