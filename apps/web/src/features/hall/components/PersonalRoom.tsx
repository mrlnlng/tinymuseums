'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { AnimatePresence } from 'motion/react'
import { THEMES, type Placement } from '@tiny/core/rooms'
import { useWallet } from '@/features/economy'
import HallSkeleton from '@/features/hall/components/HallSkeleton'
import { useSound } from '@/features/sound/components/SoundProvider'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import { createPersonalRoom } from '@/features/rooms/personal/room'
import type { DoorRef } from '@/features/rooms/types'
import DecorDrawer, { type SharingState } from '@/features/rooms/decorate/DecorDrawer'
import { createDecorController } from '@/features/rooms/decorate/controller'
import {
  clampX,
  cozyLevel,
  freeX,
  newPlacementId,
  reasonLabel,
  samePlacements,
  trayPropIds,
  withoutRejected,
  zoneAt,
  zoneFor,
} from '@/features/rooms/decorate/logic'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { defaultStore } from '@/shared/lib/slots'

interface PersonalRoomProps {
  slug: string
  theme: string
  placements: Placement[]
  ownerName?: string | null
  shareKey?: string
  canEdit: boolean
}

interface Carry {
  kind: 'new' | 'move'
  pointerId: number
  placement: Placement
  startX: number
  startY: number
  lastX: number
  lastAt: number
  tilt: number
  moved: boolean
  touch: boolean
}

interface Puff {
  id: number
  left: number
  top: number
  big: boolean
}

const COZY = THEMES.cozy
const SEEN_KEY = 'tm:room:seen'
const HISTORY_LIMIT = 40
const DRAG_START_PX = 6
const MAX_TILT = 0.2
const AUTOSAVE_MS = 700
const RETRY_MS = [2000, 4000, 8000, 15000, 30000]

type SaveState = 'saved' | 'saving' | 'unsaved' | 'offline'
type SaveResult = 'saved' | 'offline' | 'rejected' | 'conflict' | 'failed'

const SAVE_LABELS: Record<SaveState, string> = {
  saved: 'Saved',
  saving: 'Saving…',
  unsaved: 'Not saved yet',
  offline: 'Offline, will retry',
}

/** Room changes say which member's tab sent them, so a tab left from another account is refused. */
function roomHeaders(json: boolean): Record<string, string> {
  const headers: Record<string, string> = json ? { 'Content-Type': 'application/json' } : {}
  const memberId = defaultStore().getMemberSnapshot()?.id
  if (memberId) headers['X-TM-Member'] = memberId
  return headers
}

function overDrawer(clientX: number, clientY: number): boolean {
  const element = document.elementFromPoint(clientX, clientY)
  return element instanceof Element && element.closest('.decor-drawer') !== null
}

function readSeen(): Set<string> {
  try {
    const parsed: unknown = JSON.parse(readLocal(SEEN_KEY) ?? '[]')
    return new Set(Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === 'string') : [])
  } catch {
    return new Set()
  }
}

function errorReason(body: unknown): string | null {
  if (typeof body !== 'object' || body === null) return null
  const record = body as { reason?: unknown; error?: unknown }
  const reason = record.reason ?? record.error
  return typeof reason === 'string' ? reason : null
}

export default function PersonalRoom({ slug, placements, ownerName, shareKey, canEdit }: PersonalRoomProps) {
  const router = useRouter()
  const { play } = useSound()
  const wallet = useWallet()
  const controller = useMemo(() => createDecorController(), [])
  // Rebuild the room only when what it shows changes, not on every re-render of the page.
  const placementsKey = JSON.stringify(placements)
  const room = useMemo(
    () => createPersonalRoom({ slug, placements: JSON.parse(placementsKey) as Placement[], ownerName, shareKey, decor: controller }),
    [slug, placementsKey, ownerName, shareKey, controller],
  )

  const [isEditing, setIsEditing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [draft, setDraft] = useState<Placement[]>(placements)
  const [history, setHistory] = useState<Placement[][]>([])
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [notice, setNotice] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [sharing, setSharing] = useState<SharingState | null>(null)
  const [sharingBusy, setSharingBusy] = useState(false)
  const [saving, setSaving] = useState(false)
  const [carrying, setCarrying] = useState<'new' | 'move' | null>(null)
  const [overTray, setOverTray] = useState(false)
  const [puffs, setPuffs] = useState<Puff[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  const [offscreen, setOffscreen] = useState({ left: 0, right: 0 })

  const draftRef = useRef<Placement[]>(draft)
  draftRef.current = draft
  const savedRef = useRef<Placement[]>(placements)
  const publishedRef = useRef<Placement[]>(placements)
  const loadedRef = useRef(false)
  const carryRef = useRef<Carry | null>(null)
  const panRef = useRef<{ pointerId: number; lastX: number; moved: boolean } | null>(null)
  const drawerRef = useRef<HTMLElement>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const puffId = useRef(0)
  const timers = useRef<number[]>([])
  const versionRef = useRef<number | null>(null)
  const inflightRef = useRef<Promise<SaveResult> | null>(null)
  const retryRef = useRef<{ timer: number | null; attempt: number }>({ timer: null, attempt: 0 })
  /** The most hearts reached while decorating; a level is celebrated only the first time. */
  const bestHeartsRef = useRef(0)
  const isEditingRef = useRef(false)

  const { isReady, error } = useRoom({
    room,
    arrival: { kind: 'opening' },
    isSuspended: () => isEditing,
    onExit: (to: DoorRef) => router.push(hrefFor(to)),
  })

  useEffect(() => {
    setSeen(readSeen())
  }, [])

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer))
      controller.detach()
    },
    [controller],
  )

  function later(fn: () => void, ms: number): void {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const newRefs = useMemo(() => {
    const owned = trayPropIds(wallet.items, [])
    return new Set(owned.filter((ref) => !seen.has(ref)))
  }, [seen, wallet.items])

  const markSeen = useCallback((ref: string) => {
    setSeen((current) => {
      if (current.has(ref)) return current
      const next = new Set(current)
      next.add(ref)
      writeLocal(SEEN_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  const unseeBought = useCallback((ref: string) => {
    setSeen((current) => {
      if (!current.has(ref)) return current
      const next = new Set(current)
      next.delete(ref)
      writeLocal(SEEN_KEY, JSON.stringify([...next]))
      return next
    })
  }, [])

  const puffAt = useCallback((id: string, big = false) => {
    // Wait a frame so the room has drawn the thing where it landed.
    requestAnimationFrame(() => {
      const box = controller.screenBox(id)
      if (!box) return
      const puff = { id: ++puffId.current, left: box.left, top: box.bottom, big }
      setPuffs((current) => [...current, puff])
      later(() => setPuffs((current) => current.filter((entry) => entry.id !== puff.id)), 900)
    })
  }, [controller])

  const showToast = useCallback((text: string) => {
    setToast(text)
    later(() => setToast((current) => (current === text ? null : current)), 2600)
  }, [])

  /** Every change to the arrangement goes through here, so it can be undone. */
  const apply = useCallback(
    (next: Placement[], landed?: string) => {
      const before = draftRef.current
      setHistory((stack) => [...stack.slice(-(HISTORY_LIMIT - 1)), before])
      draftRef.current = next
      setDraft(next)
      controller.setPlacements(next)
      if (landed) {
        controller.bounce(landed)
        puffAt(landed)
      }
      const now = cozyLevel(next)
      if (now.hearts > bestHeartsRef.current) {
        bestHeartsRef.current = now.hearts
        play('harp')
        showToast(`Your room feels ${now.name} now!`)
        if (landed) puffAt(landed, true)
      }
    },
    [controller, play, puffAt, showToast],
  )

  const undo = useCallback(() => {
    setHistory((stack) => {
      if (stack.length === 0) return stack
      const previous = stack[stack.length - 1]
      draftRef.current = previous
      setDraft(previous)
      controller.setPlacements(previous)
      setSelected(null)
      controller.select(null)
      play('click')
      return stack.slice(0, -1)
    })
  }, [controller, play])

  const replaceDraft = useCallback(
    (next: Placement[]) => {
      draftRef.current = next
      setDraft(next)
      controller.setPlacements(next)
    },
    [controller],
  )

  const isDirty = () => loadedRef.current && !samePlacements(draftRef.current, savedRef.current)

  const sendDraft = useCallback(
    async (next: Placement[]): Promise<SaveResult> => {
      setSaveState('saving')
      let response: Response
      try {
        response = await fetch(`/api/rooms/${slug}/draft`, {
          method: 'PUT',
          headers: roomHeaders(true),
          body: JSON.stringify({ placements: next, version: versionRef.current }),
        })
      } catch {
        setSaveState('offline')
        return 'offline'
      }
      const body: unknown = await response.json().catch(() => null)
      const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
      const version = typeof record.version === 'number' ? record.version : null

      if (response.ok) {
        savedRef.current = next
        versionRef.current = version
        setSaveState(samePlacements(draftRef.current, next) ? 'saved' : 'unsaved')
        return 'saved'
      }

      if (response.status === 409 && record.error === 'conflict' && Array.isArray(record.draft)) {
        const latest = record.draft as Placement[]
        versionRef.current = version
        savedRef.current = latest
        // Our own earlier save landed even though its reply was lost.
        if (samePlacements(latest, next)) {
          setSaveState(samePlacements(draftRef.current, next) ? 'saved' : 'unsaved')
          return 'saved'
        }
        replaceDraft(latest)
        setHistory([])
        setSelected(null)
        controller.select(null)
        setSaveState('saved')
        setNotice('Your room was changed in another tab, so this shows the newest version.')
        return 'conflict'
      }

      if (response.status === 409) {
        setSaveState('unsaved')
        setNotice('You signed in as someone else in another tab. Reload this page to keep decorating.')
        return 'failed'
      }

      if (response.status === 400) {
        // Put back only the thing the server refused; everything else stays.
        const rejected = typeof record.id === 'string' ? record.id : null
        replaceDraft(withoutRejected(draftRef.current, savedRef.current, rejected))
        setNotice(reasonLabel(errorReason(body)))
        setSaveState(samePlacements(draftRef.current, savedRef.current) ? 'saved' : 'unsaved')
        return 'rejected'
      }

      setSaveState(response.status === 429 || response.status >= 500 ? 'offline' : 'unsaved')
      if (response.status !== 429 && response.status < 500) setNotice(reasonLabel(errorReason(body)))
      return response.status === 429 || response.status >= 500 ? 'offline' : 'failed'
    },
    [controller, replaceDraft, slug],
  )

  /** One save at a time, always of the newest arrangement; repeats until nothing is left to save. */
  const saveNow = useCallback(async (): Promise<SaveResult> => {
    for (let round = 0; round < 4; round++) {
      while (inflightRef.current) await inflightRef.current
      if (!isDirty()) return 'saved'
      const run = sendDraft(draftRef.current)
      inflightRef.current = run
      let result: SaveResult
      try {
        result = await run
      } finally {
        inflightRef.current = null
      }
      if (result !== 'saved' && result !== 'rejected') return result
    }
    return isDirty() ? 'failed' : 'saved'
  }, [sendDraft])

  const clearRetry = useCallback(() => {
    if (retryRef.current.timer !== null) window.clearTimeout(retryRef.current.timer)
    retryRef.current.timer = null
  }, [])

  const saveSoon = useCallback(
    (delay: number) => {
      clearRetry()
      retryRef.current.timer = window.setTimeout(() => {
        retryRef.current.timer = null
        void saveNow().then((result) => {
          if (result === 'offline' && isDirty()) {
            const attempt = Math.min(retryRef.current.attempt, RETRY_MS.length - 1)
            retryRef.current.attempt += 1
            saveSoon(RETRY_MS[attempt])
          } else {
            retryRef.current.attempt = 0
          }
        })
      }, delay)
    },
    [clearRetry, saveNow],
  )

  useEffect(() => {
    if (!isEditing || !loadedRef.current) return
    if (samePlacements(draft, savedRef.current)) return
    setSaveState((state) => (state === 'offline' ? state : 'unsaved'))
    retryRef.current.attempt = 0
    saveSoon(AUTOSAVE_MS)
  }, [draft, isEditing, saveSoon])

  // Back online: try right away instead of waiting out the backoff.
  useEffect(() => {
    if (!isEditing) return
    const onOnline = () => {
      if (isDirty()) saveSoon(0)
    }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [isEditing, saveSoon])

  // Leaving the page (or the room) with unsaved changes: send them on the way out.
  useEffect(() => {
    if (!isEditing) return
    const flush = () => {
      if (!isDirty()) return
      try {
        void fetch(`/api/rooms/${slug}/draft`, {
          method: 'PUT',
          headers: roomHeaders(true),
          // An earlier save may still be on its way; then our version is stale, so send none.
          body: JSON.stringify({
            placements: draftRef.current,
            version: inflightRef.current ? undefined : versionRef.current,
          }),
          keepalive: true,
        }).catch(() => {})
      } catch {}
    }
    const onHidden = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onHidden)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onHidden)
      flush()
      clearRetry()
    }
  }, [clearRetry, isEditing, slug])

  // The drawer covers the bottom of the frame; the room lifts its floor clear of it.
  useLayoutEffect(() => {
    if (!isEditing) {
      controller.setEditing(false)
      return
    }
    const drawer = drawerRef.current
    const frame = drawer?.parentElement
    if (!drawer || !frame) return
    const measure = () => {
      const height = frame.getBoundingClientRect().height
      controller.setEditing(true, height > 0 ? drawer.getBoundingClientRect().height / height : 0)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(drawer)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [controller, isEditing, loaded])

  // Keep the selection toolbar riding above its item as the camera glides.
  useEffect(() => {
    if (!isEditing || selected === null) return
    let handle = 0
    const follow = () => {
      handle = requestAnimationFrame(follow)
      const box = controller.screenBox(selected)
      const toolbar = toolbarRef.current
      if (!toolbar) return
      if (!box || carryRef.current) {
        toolbar.style.opacity = '0'
        return
      }
      toolbar.style.opacity = '1'
      toolbar.style.transform = `translate3d(${box.left.toFixed(1)}px, ${(box.top - 10).toFixed(1)}px, 0) translate(-50%, -100%)`
    }
    follow()
    return () => cancelAnimationFrame(handle)
  }, [controller, isEditing, selected])

  // Little markers at the edges say how many things are out of view, and which way.
  useEffect(() => {
    if (!isEditing || !loaded) return
    let handle = 0
    let last = ''
    const watch = () => {
      handle = requestAnimationFrame(watch)
      const view = controller.viewRange()
      if (!view) return
      let left = 0
      let right = 0
      for (const placement of draftRef.current) {
        if (placement.x < view.left + 0.3) left++
        else if (placement.x > view.right - 0.3) right++
      }
      const key = `${left}:${right}`
      if (key === last) return
      last = key
      setOffscreen({ left, right })
    }
    watch()
    return () => cancelAnimationFrame(handle)
  }, [controller, isEditing, loaded])

  const panToward = useCallback(
    (side: 'left' | 'right') => {
      const view = controller.viewRange()
      if (!view) return
      const xs = draftRef.current.map((placement) => placement.x)
      const target =
        side === 'left'
          ? Math.max(...xs.filter((x) => x < view.left + 0.3))
          : Math.min(...xs.filter((x) => x > view.right - 0.3))
      if (Number.isFinite(target)) controller.panTo(target)
    },
    [controller],
  )

  const select = useCallback(
    (id: string | null) => {
      setSelected(id)
      controller.select(id)
      const placement = id === null ? null : draftRef.current.find((entry) => entry.id === id)
      controller.highlight(placement ? placement.zone : null, true)
    },
    [controller],
  )

  const enterEdit = useCallback(async () => {
    // A double tap on Decorate would load the room twice and reset the second time.
    if (isEditingRef.current) return
    isEditingRef.current = true
    setNotice(null)
    setSaveState('saved')
    setIsEditing(true)
    loadedRef.current = false
    let body: unknown
    try {
      const response = await fetch(`/api/rooms/${slug}`, { cache: 'no-store' })
      if (!response.ok) throw new Error('room')
      body = await response.json()
    } catch {
      isEditingRef.current = false
      setIsEditing(false)
      setNotice('Your room could not be opened for decorating just now.')
      return
    }
    const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
    const next = Array.isArray(record.draft) ? (record.draft as Placement[]) : placements
    versionRef.current = typeof record.draftVersion === 'number' ? record.draftVersion : null
    bestHeartsRef.current = cozyLevel(next).hearts
    savedRef.current = next
    draftRef.current = next
    setDraft(next)
    setHistory([])
    const share = record.sharing as { on?: unknown; token?: unknown } | undefined
    setSharing(share ? { on: share.on === true, token: typeof share.token === 'string' ? share.token : null } : null)
    controller.setPlacements(next)
    controller.setCharacterOpacity(0.3)
    loadedRef.current = true
    setLoaded(true)
    play('click')
  }, [controller, placements, play, slug])

  const leaveEdit = useCallback(() => {
    loadedRef.current = false
    carryRef.current = null
    panRef.current = null
    setCarrying(null)
    controller.ghost(null)
    controller.highlight(null, true)
    controller.select(null)
    controller.hide(null)
    controller.setCharacterOpacity(1)
    setSelected(null)
    isEditingRef.current = false
    setIsEditing(false)
    setLoaded(false)
    setSaveState('saved')
  }, [controller])

  const done = useCallback(async () => {
    setNotice(null)
    setSaving(true)
    clearRetry()
    const saved = await saveNow()
    if (saved !== 'saved') {
      setSaving(false)
      if (saved === 'offline') {
        setNotice('Your room could not be saved: you seem to be offline. Your changes are kept here; press Done again once you are back.')
        saveSoon(RETRY_MS[0])
      } else if (saved === 'rejected') {
        setNotice((current) => current ?? 'Something could not be placed, so it was put back. Press Done again to save the rest.')
      }
      return
    }
    const next = draftRef.current
    let failure: string | null = null
    try {
      const response = await fetch(`/api/rooms/${slug}/publish`, {
        method: 'POST',
        headers: roomHeaders(true),
        body: JSON.stringify(versionRef.current === null ? {} : { version: versionRef.current }),
      })
      if (response.status === 409) {
        const body: unknown = await response.json().catch(() => null)
        failure =
          errorReason(body) === 'member_mismatch'
            ? 'You signed in as someone else in another tab. Reload this page to keep decorating.'
            : 'Your room was changed in another tab. Reopen Decorate to see the newest version.'
      } else if (!response.ok) {
        failure = reasonLabel(errorReason(await response.json().catch(() => null)))
      }
    } catch {
      failure = 'Your room could not be saved: you seem to be offline. Press Done again once you are back.'
    }
    if (failure) {
      setNotice(failure)
      setSaving(false)
      return
    }
    publishedRef.current = next
    savedRef.current = next
    setSaving(false)
    leaveEdit()
    controller.setPlacements(next)
    play('harp')
    showToast('Saved! Visitors will see your room like this.')
  }, [clearRetry, controller, leaveEdit, play, saveNow, saveSoon, showToast, slug])

  const changeSharing = useCallback(
    async (on: boolean) => {
      setSharingBusy(true)
      setNotice(null)
      try {
        const response = await fetch(`/api/rooms/${slug}/sharing`, {
          method: 'POST',
          headers: roomHeaders(true),
          body: JSON.stringify({ on }),
        })
        const body: unknown = await response.json().catch(() => null)
        if (!response.ok) {
          setNotice('That sharing setting could not be changed.')
          return
        }
        const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
        setSharing({ on: record.on === true, token: typeof record.token === 'string' ? record.token : null })
      } catch {
        setNotice('That sharing setting could not be changed.')
      } finally {
        setSharingBusy(false)
      }
    },
    [slug],
  )

  const putAway = useCallback(
    (id: string) => {
      apply(draftRef.current.filter((placement) => placement.id !== id))
      select(null)
      play('click')
    },
    [apply, play, select],
  )

  const flip = useCallback(
    (id: string) => {
      apply(draftRef.current.map((placement) => (placement.id === id ? { ...placement, flip: !placement.flip } : placement)), id)
      play('click')
    },
    [apply, play],
  )

  useEffect(() => {
    if (!isEditing) return
    const onKey = (event: KeyboardEvent) => {
      const target = event.target instanceof Element ? event.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault()
        undo()
        return
      }
      if (selected === null) return
      if (event.key === 'Escape') return select(null)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        return putAway(selected)
      }
      if (event.key.toLowerCase() === 'f') return flip(selected)
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
      const placement = draftRef.current.find((item) => item.id === selected)
      if (!placement) return
      event.preventDefault()
      const x = clampX(COZY, placement.ref, placement.zone, placement.x + (event.key === 'ArrowLeft' ? -0.1 : 0.1))
      apply(draftRef.current.map((item) => (item.id === selected ? { ...item, x } : item)))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [apply, flip, isEditing, putAway, select, selected, undo])

  // Carrying: one path for new things from the drawer and things already in the room.
  function carryMove(carry: Carry, clientX: number, clientY: number): void {
    const now = performance.now()
    if (!carry.moved && Math.hypot(clientX - carry.startX, clientY - carry.startY) < DRAG_START_PX) return
    // On a touch screen a sideways swipe across the cards scrolls them; only an upward drag picks one up.
    if (!carry.moved && carry.touch && carry.kind === 'new' && Math.abs(clientX - carry.startX) > Math.abs(clientY - carry.startY)) {
      carryRef.current = null
      return
    }
    if (!carry.moved) {
      carry.moved = true
      setCarrying(carry.kind)
      if (carry.kind === 'move') controller.hide(carry.placement.id)
      play('click')
    }
    const velocity = (clientX - carry.lastX) / Math.max(1, now - carry.lastAt)
    carry.tilt += (Math.max(-MAX_TILT, Math.min(MAX_TILT, -velocity * 0.12)) - carry.tilt) * 0.35
    carry.lastX = clientX
    carry.lastAt = now
    const over = overDrawer(clientX, clientY)
    setOverTray(over)
    const zone = zoneAt(COZY, carry.placement.ref, controller.worldYAt(clientY)) ?? carry.placement.zone
    carry.placement = {
      ...carry.placement,
      zone,
      x: clampX(COZY, carry.placement.ref, zone, controller.worldXAt(clientX)),
    }
    controller.ghost(carry.placement, { valid: !over, tilt: carry.tilt })
    controller.highlight(carry.placement.zone, !over)
  }

  /** Whether a new thing may come out of the drawer; says why not when it can't. */
  function canPlaceNew(ref: string): boolean {
    // Each thing is owned once: a fast double tap must not put it out twice.
    if (draftRef.current.some((placement) => placement.kind === 'prop' && placement.ref === ref)) return false
    if (draftRef.current.length >= COZY.maxPlacements) {
      setNotice(`Your room holds ${COZY.maxPlacements} things at most. Put something away to make space.`)
      return false
    }
    return true
  }

  function placeNew(ref: string): void {
    const zone = zoneFor(COZY, ref)
    if (!zone || !canPlaceNew(ref)) return
    // Dropped in the middle of the view, nudged to the nearest free spot.
    const x = freeX(COZY, ref, zone, draftRef.current, controller.centerX())
    const next: Placement = { id: newPlacementId(), kind: 'prop', ref, zone, x }
    apply([...draftRef.current, next], next.id)
    markSeen(ref)
    select(next.id)
    play('jump')
  }

  function carryEnd(carry: Carry, clientX: number, clientY: number, cancelled: boolean): void {
    carryRef.current = null
    setCarrying(null)
    setOverTray(false)
    controller.ghost(null)
    controller.hide(null)
    const placement = carry.placement

    // A cancelled touch is usually the browser taking over to scroll the cards.
    if (cancelled) {
      controller.highlight(null, true)
      return
    }

    if (!carry.moved) {
      if (carry.kind === 'new') placeNew(placement.ref)
      else select(selected === placement.id ? null : placement.id)
      return
    }

    if (overDrawer(clientX, clientY)) {
      if (carry.kind === 'move') putAway(placement.id)
      else controller.highlight(null, true)
      return
    }
    if (carry.kind === 'new') {
      if (!canPlaceNew(placement.ref)) {
        controller.highlight(null, true)
        return
      }
      apply([...draftRef.current, placement], placement.id)
      markSeen(placement.ref)
    } else {
      apply(draftRef.current.map((entry) => (entry.id === placement.id ? placement : entry)), placement.id)
    }
    select(placement.id)
    play('jump')
  }

  function startCarry(kind: Carry['kind'], placement: Placement, event: PointerEvent | ReactPointerEvent): Carry {
    const carry: Carry = {
      kind,
      pointerId: event.pointerId,
      placement,
      startX: event.clientX,
      startY: event.clientY,
      lastX: event.clientX,
      lastAt: performance.now(),
      tilt: 0,
      moved: false,
      touch: event.pointerType === 'touch',
    }
    carryRef.current = carry
    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== carry.pointerId || carryRef.current !== carry) return
      carryMove(carry, moveEvent.clientX, moveEvent.clientY)
    }
    const finish = (endEvent: PointerEvent) => {
      if (endEvent.pointerId !== carry.pointerId) return
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', finish)
      window.removeEventListener('pointercancel', finish)
      if (carryRef.current !== carry) return
      carryEnd(carry, endEvent.clientX, endEvent.clientY, endEvent.type === 'pointercancel')
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', finish)
    window.addEventListener('pointercancel', finish)
    return carry
  }

  /** Keyboard activation of a card (Enter or Space); pointer taps go through the carry instead. */
  function onCardKey(ref: string): void {
    if (!loaded) return
    setNotice(null)
    placeNew(ref)
  }

  /** Picking a placed thing from the drawer's list: select it and bring it into view. */
  function focusPlaced(id: string): void {
    const placement = draftRef.current.find((entry) => entry.id === id)
    if (!placement) return
    controller.panTo(placement.x)
    select(id)
    play('click')
  }

  function onCardPointerDown(ref: string, event: ReactPointerEvent<HTMLButtonElement>): void {
    if (!loaded || (event.pointerType === 'mouse' && event.button !== 0)) return
    const zone = zoneFor(COZY, ref)
    if (!zone) return
    event.preventDefault()
    setNotice(null)
    startCarry('new', { id: newPlacementId(), kind: 'prop', ref, zone, x: controller.centerX() }, event)
  }

  function onSurfaceDown(event: ReactPointerEvent<HTMLDivElement>): void {
    if (!loaded || (event.pointerType === 'mouse' && event.button !== 0)) return
    event.preventDefault()
    setNotice(null)
    const hit = controller.pick(event.clientX, event.clientY)
    if (hit) {
      startCarry('move', hit, event)
      return
    }
    panRef.current = { pointerId: event.pointerId, lastX: event.clientX, moved: false }
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {}
  }

  function onSurfaceMove(event: ReactPointerEvent<HTMLDivElement>): void {
    const pan = panRef.current
    if (pan && pan.pointerId === event.pointerId) {
      const dx = event.clientX - pan.lastX
      pan.lastX = event.clientX
      if (Math.abs(dx) > 1) pan.moved = true
      controller.panBy(dx)
      return
    }
    if (event.pointerType === 'mouse' && !carryRef.current) {
      event.currentTarget.style.cursor = controller.pick(event.clientX, event.clientY) ? 'grab' : ''
    }
  }

  function onSurfaceUp(event: ReactPointerEvent<HTMLDivElement>): void {
    const pan = panRef.current
    if (!pan || pan.pointerId !== event.pointerId) return
    panRef.current = null
    if (!pan.moved) select(null)
  }

  if (error) {
    return (
      <p className="hall-error" role="alert">
        This room could not open. <Link href="/museum">Back to the museum</Link>
      </p>
    )
  }

  const selectedPlacement = selected === null ? null : draft.find((entry) => entry.id === selected) ?? null

  return (
    <>
      {canEdit && isReady && !isEditing ? (
        <div className="decor-enter-wrap">
          <button type="button" className="button decor-enter" onClick={() => void enterEdit()}>
            <span aria-hidden="true">{'✦'}</span> Decorate
          </button>
        </div>
      ) : null}

      {isEditing ? (
        <>
          {loaded ? (
            <div
              className={`decor-surface${carrying ? ' is-carrying' : ''}`}
              onPointerDown={onSurfaceDown}
              onPointerMove={onSurfaceMove}
              onPointerUp={onSurfaceUp}
              onPointerCancel={onSurfaceUp}
            />
          ) : null}

          {loaded && offscreen.left > 0 ? (
            <button type="button" className="decor-edge is-left" onClick={() => panToward('left')} aria-label={`${offscreen.left} more to the left`}>
              {'‹'} {offscreen.left}
            </button>
          ) : null}
          {loaded && offscreen.right > 0 ? (
            <button type="button" className="decor-edge is-right" onClick={() => panToward('right')} aria-label={`${offscreen.right} more to the right`}>
              {offscreen.right} {'›'}
            </button>
          ) : null}

          {selectedPlacement ? (
            <div ref={toolbarRef} className="decor-toolbar" style={{ opacity: 0 }}>
              <button type="button" onClick={() => flip(selectedPlacement.id)} aria-label="Flip">
                {'⇄'}
              </button>
              <button type="button" onClick={() => putAway(selectedPlacement.id)} aria-label="Put away">
                {'⤵'}
              </button>
            </div>
          ) : null}

          <DecorDrawer
            ref={drawerRef}
            slug={slug}
            placements={draft}
            saveState={saveState}
            saveLabel={SAVE_LABELS[saveState]}
            maxPlacements={COZY.maxPlacements}
            notice={notice}
            sharing={sharing}
            sharingBusy={sharingBusy}
            saving={saving}
            canUndo={history.length > 0}
            dropActive={carrying === 'move'}
            dropHover={overTray}
            newRefs={newRefs}
            onCardPointerDown={onCardPointerDown}
            onCardKey={onCardKey}
            onFocusPlaced={focusPlaced}
            onUndo={undo}
            onDone={() => void done()}
            onSharingChange={(on) => void changeSharing(on)}
            onBought={unseeBought}
          />
        </>
      ) : null}

      <div className="decor-fx" aria-hidden="true">
        {puffs.map((puff) => (
          <span key={puff.id} className={`decor-puff${puff.big ? ' is-big' : ''}`} style={{ left: puff.left, top: puff.top }}>
            {Array.from({ length: puff.big ? 10 : 6 }, (_, i) => (
              <i key={i} style={{ ['--a' as string]: `${(360 / (puff.big ? 10 : 6)) * i}deg` }} />
            ))}
          </span>
        ))}
      </div>

      {toast ? (
        <p className="decor-toast" role="status">
          {toast}
        </p>
      ) : null}

      {notice && !isEditing ? (
        <p className="decor-toast is-error" role="alert">
          {notice}
        </p>
      ) : null}

      <AnimatePresence>{isReady ? null : <HallSkeleton key="personal-loading" preload={false} />}</AnimatePresence>
    </>
  )
}
