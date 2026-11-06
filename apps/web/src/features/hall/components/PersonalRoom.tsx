'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { AnimatePresence } from 'motion/react'
import { THEMES, type Placement } from '@tiny/core/rooms'
import HallSkeleton from '@/features/hall/components/HallSkeleton'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import { createPersonalRoom } from '@/features/rooms/personal/room'
import type { DoorRef } from '@/features/rooms/types'
import DecorTray, { type SharingState } from '@/features/rooms/decorate/DecorTray'
import { createDecorController } from '@/features/rooms/decorate/controller'
import {
  clampX,
  newPlacementId,
  reasonLabel,
  samePlacements,
  zoneFor,
} from '@/features/rooms/decorate/logic'

interface PersonalRoomProps {
  slug: string
  theme: string
  placements: Placement[]
  shareKey?: string
  canEdit: boolean
}

type Drag =
  | { kind: 'pan'; pointerId: number; lastX: number; moved: boolean }
  | {
      kind: 'move'
      pointerId: number
      placed: Placement
      startClientX: number
      currentX: number
      moved: boolean
    }

const COZY = THEMES.cozy

function overTray(clientX: number, clientY: number): boolean {
  const element = document.elementFromPoint(clientX, clientY)
  return element instanceof Element && element.closest('.decor-tray') !== null
}

export default function PersonalRoom({ slug, placements, shareKey, canEdit }: PersonalRoomProps) {
  const router = useRouter()
  const controller = useMemo(() => createDecorController(), [])
  const room = useMemo(
    () => createPersonalRoom({ slug, placements, shareKey, decor: controller }),
    [slug, placements, shareKey, controller],
  )

  const [isEditing, setIsEditing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [draft, setDraft] = useState<Placement[]>(placements)
  const [status, setStatus] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [sharing, setSharing] = useState<SharingState | null>(null)
  const [sharingBusy, setSharingBusy] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [viewTick, setViewTick] = useState(0)

  const draftRef = useRef<Placement[]>(draft)
  draftRef.current = draft
  const savedRef = useRef<Placement[]>(placements)
  const publishedRef = useRef<Placement[]>(placements)
  const loadedRef = useRef(false)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag | null>(null)
  const tileDragRef = useRef<Placement | null>(null)
  const tileCleanupRef = useRef<(() => void) | null>(null)

  const { isReady, error } = useRoom({
    room,
    arrival: { kind: 'opening' },
    isSuspended: () => isEditing,
    onExit: (to: DoorRef) => router.push(hrefFor(to)),
  })

  const commit = useCallback(
    (next: Placement[]) => {
      draftRef.current = next
      setDraft(next)
      controller.setPlacements(next)
    },
    [controller],
  )

  const persist = useCallback(
    async (next: Placement[], signal?: AbortSignal): Promise<boolean> => {
      setStatus('Saving…')
      let response: Response
      try {
        response = await fetch(`/api/rooms/${slug}/draft`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ placements: next }),
          signal,
        })
      } catch {
        if (signal?.aborted) return false
        setStatus('Could not save just now.')
        return false
      }

      if (response.ok) {
        savedRef.current = next
        setStatus('Saved')
        return true
      }

      const body: unknown = await response.json().catch(() => null)
      const reason =
        typeof body === 'object' && body !== null
          ? ((body as { reason?: unknown; error?: unknown }).reason ??
            (body as { error?: unknown }).error)
          : null
      setStatus(reasonLabel(typeof reason === 'string' ? reason : null))

      if (response.status === 400) {
        const fallback = savedRef.current
        draftRef.current = fallback
        setDraft(fallback)
        controller.setPlacements(fallback)
        controller.ghost(null)
        controller.highlight(null, true)
        setSelected(null)
      }
      return false
    },
    [controller, slug],
  )

  useEffect(() => {
    if (!isEditing || !loadedRef.current) return
    if (samePlacements(draft, savedRef.current)) {
      setStatus((current) => (current === 'Saving…' ? 'Saved' : current))
      return
    }

    setStatus('Saving…')
    const abort = new AbortController()
    const timer = window.setTimeout(() => {
      void persist(draftRef.current, abort.signal)
    }, 600)
    return () => {
      window.clearTimeout(timer)
      abort.abort()
    }
  }, [draft, isEditing, persist])

  useEffect(
    () => () => {
      tileCleanupRef.current?.()
      controller.detach()
    },
    [controller],
  )

  const finishEdit = useCallback(async () => {
    loadedRef.current = false
    tileCleanupRef.current?.()
    tileCleanupRef.current = null
    dragRef.current = null
    tileDragRef.current = null
    controller.ghost(null)
    controller.highlight(null, true)
    if (!samePlacements(draftRef.current, savedRef.current)) {
      await persist(draftRef.current)
    }
    controller.setCharacterOpacity(1)
    controller.setPlacements(publishedRef.current)
    draftRef.current = publishedRef.current
    setDraft(publishedRef.current)
    setSelected(null)
    setIsEditing(false)
    setLoaded(false)
    setStatus('')
    setNotice(null)
  }, [controller, persist])

  const enterEdit = useCallback(async () => {
    setNotice(null)
    setStatus('')
    setIsEditing(true)
    loadedRef.current = false
    let body: unknown
    try {
      const response = await fetch(`/api/rooms/${slug}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('room')
      body = await response.json()
    } catch {
      setIsEditing(false)
      setNotice('Your draft could not be opened just now.')
      return
    }

    const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
    const next = Array.isArray(record.draft) ? (record.draft as Placement[]) : placements
    savedRef.current = next
    draftRef.current = next
    setDraft(next)
    setSharing(
      typeof record.sharing === 'object' && record.sharing !== null
        ? {
            on: (record.sharing as { on?: unknown }).on === true,
            token:
              typeof (record.sharing as { token?: unknown }).token === 'string'
                ? (record.sharing as { token: string }).token
                : null,
          }
        : null,
    )
    controller.setPlacements(next)
    controller.setCharacterOpacity(0.35)
    loadedRef.current = true
    setLoaded(true)
    setStatus('Saved')
  }, [controller, placements, slug])

  const publish = useCallback(async () => {
    setNotice(null)
    setPublishing(true)
    const next = draftRef.current
    if (!samePlacements(next, savedRef.current)) {
      const saved = await persist(next)
      if (!saved) {
        setPublishing(false)
        return
      }
    }

    let response: Response
    try {
      response = await fetch(`/api/rooms/${slug}/publish`, { method: 'POST' })
    } catch {
      setNotice('Could not publish just now.')
      setPublishing(false)
      return
    }
    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const reason =
        typeof body === 'object' && body !== null
          ? ((body as { reason?: unknown; error?: unknown }).reason ??
            (body as { error?: unknown }).error)
          : null
      setNotice(reasonLabel(typeof reason === 'string' ? reason : null))
      setPublishing(false)
      return
    }

    publishedRef.current = next
    savedRef.current = next
    setStatus('Saved')
    setPublishing(false)
  }, [persist, slug])

  const changeSharing = useCallback(
    async (on: boolean) => {
      setSharingBusy(true)
      setNotice(null)
      try {
        const response = await fetch(`/api/rooms/${slug}/sharing`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ on }),
        })
        const body: unknown = await response.json().catch(() => null)
        if (!response.ok) {
          setNotice('That sharing setting could not be changed.')
          return
        }
        const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
        setSharing({
          on: record.on === true,
          token: typeof record.token === 'string' ? record.token : null,
        })
      } catch {
        setNotice('That sharing setting could not be changed.')
      } finally {
        setSharingBusy(false)
      }
    },
    [slug],
  )

  const remove = useCallback(
    (id: string) => {
      commit(draftRef.current.filter((placement) => placement.id !== id))
      setSelected(null)
      controller.ghost(null)
      controller.highlight(null, true)
    },
    [commit, controller],
  )

  useEffect(() => {
    if (!isEditing || selected === null) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === 'Escape') {
        setSelected(null)
        controller.highlight(null, true)
        return
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        remove(selected)
        return
      }
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const placement = draftRef.current.find((item) => item.id === selected)
      if (!placement) return
      event.preventDefault()
      const delta = event.key === 'ArrowLeft' ? -0.1 : 0.1
      const x = clampX(COZY, placement.ref, placement.zone, placement.x + delta)
      commit(draftRef.current.map((item) => (item.id === selected ? { ...item, x } : item)))
      controller.highlight(placement.zone, true)
      setViewTick((tick) => tick + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [commit, controller, isEditing, remove, selected])

  const selectedPlacement = useMemo(
    () => (selected === null ? null : draft.find((placement) => placement.id === selected) ?? null),
    [draft, selected],
  )
  const selectedPoint = useMemo(() => {
    void viewTick
    return selectedPlacement
      ? controller.screenPointAt(selectedPlacement.x, selectedPlacement.zone)
      : null
  }, [controller, selectedPlacement, viewTick])

  function capture(drag: Drag, clientX: number, clientY: number): void {
    if (drag.kind === 'pan') {
      const dx = clientX - drag.lastX
      drag.lastX = clientX
      if (Math.abs(dx) > 2) drag.moved = true
      controller.panBy(dx)
      setViewTick((tick) => tick + 1)
      return
    }

    if (Math.abs(clientX - drag.startClientX) > 4) drag.moved = true
    drag.currentX = clampX(COZY, drag.placed.ref, drag.placed.zone, controller.worldXAt(clientX))
    controller.ghost({ ...drag.placed, x: drag.currentX })
    controller.highlight(drag.placed.zone, !overTray(clientX, clientY))
  }

  function onSurfaceDown(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!loaded) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    event.preventDefault()
    setNotice(null)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {}

    const hit = controller.pick(event.clientX, event.clientY)
    if (hit) {
      dragRef.current = {
        kind: 'move',
        pointerId: event.pointerId,
        placed: hit,
        startClientX: event.clientX,
        currentX: hit.x,
        moved: false,
      }
      setSelected(hit.id)
      controller.ghost(hit)
      controller.highlight(hit.zone, true)
    } else {
      dragRef.current = { kind: 'pan', pointerId: event.pointerId, lastX: event.clientX, moved: false }
      setSelected(null)
      controller.ghost(null)
      controller.highlight(null, true)
    }
  }

  function onSurfaceMove(event: ReactPointerEvent<HTMLDivElement>): void {
    const drag = dragRef.current
    if (!drag) return
    capture(drag, event.clientX, event.clientY)
  }

  function onSurfaceUp(event: ReactPointerEvent<HTMLDivElement>): void {
    const drag = dragRef.current
    dragRef.current = null
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {}
    if (!drag) return

    if (drag.kind === 'pan') {
      if (!drag.moved) setSelected(null)
      controller.highlight(null, true)
      return
    }

    controller.ghost(null)
    if (overTray(event.clientX, event.clientY)) {
      remove(drag.placed.id)
      return
    }

    if (drag.moved) {
      commit(
        draftRef.current.map((placement) =>
          placement.id === drag.placed.id ? { ...placement, x: drag.currentX } : placement,
        ),
      )
    }
    setSelected(drag.placed.id)
    controller.highlight(drag.placed.zone, true)
  }

  function onSurfaceCancel(event: ReactPointerEvent<HTMLDivElement>): void {
    dragRef.current = null
    controller.ghost(null)
    controller.highlight(selectedPlacement?.zone ?? null, true)
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }
    } catch {}
  }

  function startTileDrag(ref: string, event: ReactPointerEvent<HTMLButtonElement>): void {
    if (!loaded) return
    event.preventDefault()
    tileCleanupRef.current?.()
    const zone = zoneFor(COZY, ref)
    if (!zone) return
    const pending: Placement = {
      id: newPlacementId(),
      kind: 'prop',
      ref,
      zone,
      x: clampX(COZY, ref, zone, controller.worldXAt(event.clientX)),
    }
    tileDragRef.current = pending
    controller.ghost(pending)
    controller.highlight(zone, true)

    const onMove = (moveEvent: PointerEvent) => {
      const current = tileDragRef.current
      if (!current) return
      const x = clampX(COZY, current.ref, current.zone, controller.worldXAt(moveEvent.clientX))
      current.x = x
      controller.ghost({ ...current, x })
      controller.highlight(current.zone, !overTray(moveEvent.clientX, moveEvent.clientY))
    }

    const cleanup = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onCancel)
      tileCleanupRef.current = null
    }

    const onUp = (upEvent: PointerEvent) => {
      cleanup()
      const current = tileDragRef.current
      tileDragRef.current = null
      controller.ghost(null)
      controller.highlight(null, true)
      if (!current) return
      const rect = surfaceRef.current?.getBoundingClientRect()
      const inside =
        rect !== undefined &&
        upEvent.clientX >= rect.left &&
        upEvent.clientX <= rect.right &&
        upEvent.clientY >= rect.top &&
        upEvent.clientY <= rect.bottom
      if (!inside || overTray(upEvent.clientX, upEvent.clientY)) return
      const next = [...draftRef.current, current]
      commit(next)
      setSelected(current.id)
      controller.highlight(current.zone, true)
    }

    const onCancel = () => {
      cleanup()
      tileDragRef.current = null
      controller.ghost(null)
      controller.highlight(null, true)
    }

    tileCleanupRef.current = cleanup
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onCancel)
  }

  if (error) {
    return (
      <p className="hall-error" role="alert">
        This room could not open. <Link href="/museum">Back to the museum</Link>
      </p>
    )
  }

  return (
    <>
      {canEdit && !isEditing ? (
        <button type="button" className="button decor-enter" onClick={() => void enterEdit()}>
          Decorate
        </button>
      ) : null}

      {isEditing ? (
        <>
          {loaded ? (
            <div
              ref={surfaceRef}
              className="decor-surface"
              onPointerDown={onSurfaceDown}
              onPointerMove={onSurfaceMove}
              onPointerUp={onSurfaceUp}
              onPointerCancel={onSurfaceCancel}
            />
          ) : null}

          {selectedPoint && selectedPlacement ? (
            <button
              type="button"
              className="decor-putaway"
              style={{ left: selectedPoint.left, top: selectedPoint.top }}
              onClick={() => remove(selectedPlacement.id)}
            >
              Put away
            </button>
          ) : null}

          <DecorTray
            slug={slug}
            placements={draft}
            status={status}
            sharing={sharing}
            sharingBusy={sharingBusy}
            publishing={publishing}
            notice={notice}
            onPublish={() => void publish()}
            onDone={() => void finishEdit()}
            onSharingChange={(on) => void changeSharing(on)}
            onTilePointerDown={startTileDrag}
          />
        </>
      ) : null}

      <AnimatePresence>{isReady ? null : <HallSkeleton key="personal-loading" preload={false} />}</AnimatePresence>
    </>
  )
}
