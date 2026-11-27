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
import {
  ROOM_SIZES,
  THEMES,
  buildSecondsFor,
  WEAR,
  cleanItemId,
  cleanupFor,
  isRepair,
  nextRoomSize,
  roomSizeFor,
  sizedTheme,
  type Placement,
} from '@tiny/core/rooms'
import { buy, stampLabel, useWallet } from '@/features/economy'
import HallSkeleton from '@/features/hall/components/HallSkeleton'
import { useSound } from '@/features/sound/components/SoundProvider'
import LetterMailbox from '@/features/letters/components/LetterMailbox'
import { reportQuestEvent } from '@/features/letters/events'
import { hrefFor } from '@/features/rooms/links'
import { useRoom } from '@/features/rooms/MuseumStage'
import { createPersonalRoom } from '@/features/rooms/personal/room'
import type { DoorRef } from '@/features/rooms/types'
import DecorDrawer from '@/features/rooms/decorate/DecorDrawer'
import { createDecorController } from '@/features/rooms/decorate/controller'
import { cozyPropImageUrl, type WorkKind } from '@/features/rooms/themes/cozy'
import { CEILING } from '@/features/rooms/themes/room-light'
import {
  clampX,
  clampY,
  cozyLevel,
  freeX,
  isRemovedProceduralFish,
  messLabel,
  messNote,
  moveWithRiders,
  newPlacementId,
  propHeight,
  putAwayWithRiders,
  reasonLabel,
  roomStars,
  restAt,
  restInView,
  ridersAfter,
  ridersOf,
  samePlacements,
  surfacesIn,
  THING_LIMIT,
  thingsIn,
  trayPropIds,
  withFinish,
  withoutRejected,
  zoneAt,
  zoneFor,
  type FinishSlot,
} from '@/features/rooms/decorate/logic'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { defaultStore } from '@/shared/lib/slots'

interface PersonalRoomProps {
  slug: string
  theme: string
  placements: Placement[]
  ownerName?: string | null
  /** The sign on the door says Open. */
  open: boolean
  canEdit: boolean
  /** The room's length when the page was made; the owner's wallet updates it as they knock through. */
  width: number
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

/** Something being built or cleaned away; it takes its time, shown by a ring over it. */
interface Job {
  id: string
  kind: WorkKind
  seconds: number
  startedAt: number
  /** Where to show the ring, in room units, for work spread over a whole surface. */
  at?: { x: number; y: number }
  /** The visitor's very first clean ends with a burst and a cheer. */
  celebrate?: boolean
}

/** A piece of junk or damage on offer; `at` is where a whole-surface one was tapped. */
interface Offer {
  id: string
  ref: string
  at?: { x: number; y: number }
}

interface Puff {
  id: number
  left: number
  top: number
  big: boolean
}

const COZY = THEMES.cozy

function sizeOfWidth(width: number) {
  return ROOM_SIZES.find((size) => size.width >= width - 1e-6) ?? ROOM_SIZES[ROOM_SIZES.length - 1]
}
const SEEN_KEY = 'tm:room:seen'
const FIRST_CLEAN_KEY = 'tm:room:first-clean'
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

export default function PersonalRoom({ slug, placements, ownerName, open, canEdit, width }: PersonalRoomProps) {
  const router = useRouter()
  const { play } = useSound()
  const wallet = useWallet()
  const controller = useMemo(() => createDecorController(), [])
  // The owner sees their room grow the moment they knock through; everyone else sees the page's size.
  const ownsSize = canEdit && wallet.items.some((item) => item.startsWith('room:'))
  const roomSize = ownsSize ? roomSizeFor(wallet.items) : sizeOfWidth(width)
  const widthRef = useRef(roomSize.width)
  widthRef.current = roomSize.width
  const sizedRef = useRef(sizedTheme(COZY, roomSize.width))
  sizedRef.current = sizedTheme(COZY, roomSize.width)
  // The five procedurally drawn fish are no longer part of the personal room; artist-asset
  // trophies stay. Filtering here also drops them from the draft on the next save.
  const keptPlacements = useMemo(
    () => placements.filter((placement) => !isRemovedProceduralFish(placement.ref)),
    [placements],
  )
  // Rebuild the room only when what it shows changes, not on every re-render of the page.
  const placementsKey = JSON.stringify(keptPlacements)
  const room = useMemo(
    () =>
      createPersonalRoom({
        slug,
        placements: JSON.parse(placementsKey) as Placement[],
        ownerName,
        open,
        canEdit,
        setOpen: async (next) => {
          try {
            const response = await fetch(`/api/rooms/${slug}/open`, {
              method: 'POST',
              headers: roomHeaders(true),
              body: JSON.stringify({ open: next }),
            })
            return response.ok
          } catch {
            return false
          }
        },
        decor: controller,
        width: () => widthRef.current,
      }),
    [slug, placementsKey, ownerName, open, canEdit, controller],
  )

  // A visitor steps in through the door under a plaque naming whose room it is.
  const [arriving, setArriving] = useState(!canEdit && Boolean(ownerName))
  const [isEditing, setIsEditing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [draft, setDraft] = useState<Placement[]>(keptPlacements)
  const [history, setHistory] = useState<Placement[][]>([])
  const [saveState, setSaveState] = useState<SaveState>('saved')
  const [notice, setNotice] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [carrying, setCarrying] = useState<'new' | 'move' | null>(null)
  const [overTray, setOverTray] = useState(false)
  const [puffs, setPuffs] = useState<Puff[]>([])
  const [toast, setToast] = useState<string | null>(null)
  const [seen, setSeen] = useState<Set<string>>(() => new Set())
  const [offscreen, setOffscreen] = useState({ left: 0, right: 0 })
  const [jobs, setJobs] = useState<Job[]>([])
  const [offer, setOffer] = useState<Offer | null>(null)
  const [paying, setPaying] = useState(false)
  const [firstCleanDone, setFirstCleanDone] = useState(false)
  const [broomBusy, setBroomBusy] = useState(false)
  const jobsRef = useRef<Job[]>([])
  const payingRef = useRef(false)
  const ringsRef = useRef(new Map<string, HTMLDivElement>())
  const offerRef = useRef<HTMLDivElement>(null)
  const sparkleRef = useRef(new Map<string, HTMLSpanElement>())

  const draftRef = useRef<Placement[]>(draft)
  draftRef.current = draft
  const savedRef = useRef<Placement[]>(keptPlacements)
  const publishedRef = useRef<Placement[]>(keptPlacements)
  const loadedRef = useRef(false)
  const carryRef = useRef<Carry | null>(null)
  const panRef = useRef<{ pointerId: number; lastX: number; lastY: number; moved: boolean; dismissing: boolean } | null>(null)
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
    setFirstCleanDone(readLocal(FIRST_CLEAN_KEY) === '1')
  }, [])

  // A room cleaned before the letters existed still counts as clean.
  useEffect(() => {
    // Wait for the saved room, so messes still on their way in are not read as a clean room.
    if (!canEdit || !isReady || isEditing || !loaded) return
    if (!draftRef.current.some((placement) => placement.kind === 'mess')) reportQuestEvent('room-clean')
  }, [canEdit, isEditing, isReady, loaded])

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

  const dirtyMesses = useMemo(() => draft.filter((placement) => placement.kind === 'mess'), [draft])

  // A soft sparkle over each mess while the room is dirty; the sparkles are DOM, the messes are canvas.
  useEffect(() => {
    if (isEditing || dirtyMesses.length === 0) return
    let handle = 0
    const follow = () => {
      handle = requestAnimationFrame(follow)
      for (const mess of dirtyMesses) {
        const sparkle = sparkleRef.current.get(mess.id)
        if (!sparkle) continue
        const box = controller.screenBox(mess.id)
        if (!box) {
          sparkle.style.visibility = 'hidden'
          continue
        }
        sparkle.style.visibility = 'visible'
        sparkle.style.transform = `translate3d(${box.left.toFixed(1)}px, ${((box.top + box.bottom) / 2).toFixed(1)}px, 0) translate(-50%, -50%)`
      }
    }
    follow()
    return () => cancelAnimationFrame(handle)
  }, [controller, dirtyMesses, isEditing])

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

  // Knocking a wall through: dust where the boards were, a fanfare, and a look at the new space.
  const shownWidth = useRef(roomSize.width)
  useEffect(() => {
    const before = shownWidth.current
    shownWidth.current = roomSize.width
    if (roomSize.width <= before) return
    play('harp')
    showToast(`You knocked through! Welcome to your ${roomSize.label.toLowerCase()}.`)
    controller.panTo(before + 1)
    const spot = controller.screenPoint(before, 1.5)
    if (spot) {
      const puff = { id: ++puffId.current, left: spot.left, top: spot.top, big: true }
      setPuffs((current) => [...current, puff])
      later(() => setPuffs((current) => current.filter((entry) => entry.id !== puff.id)), 900)
    }
  }, [controller, play, roomSize.label, roomSize.width, showToast])

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
        const stars = roomStars(now).stars
        play('harp')
        showToast(`Your room is a ${stars}-star room now!`)
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
        if (placement.kind !== 'prop') continue
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

  // Jobs tick on every frame: the room shows the work and a ring counts it down.
  useEffect(() => {
    if (jobs.length === 0) return
    let handle = 0
    const tick = () => {
      handle = requestAnimationFrame(tick)
      const now = performance.now()
      for (const job of jobsRef.current) {
        // Undone, or swapped out by another tab: nothing left to work on.
        if (!draftRef.current.some((placement) => placement.id === job.id)) {
          finishJob(job, false)
          continue
        }
        const t = (now - job.startedAt) / (job.seconds * 1000)
        if (t >= 1) {
          finishJob(job, true)
          continue
        }
        controller.work(job.id, job.kind, t)
        const ring = ringsRef.current.get(job.id)
        const box = anchorOf(job.id, job.at)
        if (!ring) continue
        if (!box) {
          ring.style.opacity = '0'
          continue
        }
        ring.style.opacity = '1'
        ring.style.transform = `translate3d(${box.left.toFixed(1)}px, ${(job.kind === 'build' && box.bottom !== undefined ? box.bottom - 70 : box.top - 6).toFixed(1)}px, 0) translate(-50%, -100%)`
        ring.style.setProperty('--p', t.toFixed(3))
        const label = ring.firstElementChild
        const left = `${Math.ceil(job.seconds * (1 - t))}s`
        if (label && label.textContent !== left) label.textContent = left
      }
    }
    tick()
    return () => cancelAnimationFrame(handle)
    // finishJob only reads refs and stable callbacks.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, jobs])

  // The offer to clear a piece of junk rides above it, like the toolbar.
  useEffect(() => {
    if (!offer) return
    let handle = 0
    const follow = () => {
      handle = requestAnimationFrame(follow)
      const box = anchorOf(offer.id, offer.at)
      const card = offerRef.current
      if (!card) return
      if (!box) {
        card.style.opacity = '0'
        return
      }
      card.style.opacity = '1'
      // Kept inside the frame, so junk at a phone's edge still shows its whole offer.
      const frameWidth = (card.offsetParent as HTMLElement | null)?.clientWidth ?? window.innerWidth
      const half = card.offsetWidth / 2
      const x = Math.min(Math.max(box.left, half + 8), frameWidth - half - 8)
      card.style.transform = `translate3d(${x.toFixed(1)}px, ${Math.max(box.top - 8, card.offsetHeight + 8).toFixed(1)}px, 0) translate(-50%, -100%)`
    }
    follow()
    return () => cancelAnimationFrame(handle)
  }, [controller, offer])

  const panToward = useCallback(
    (side: 'left' | 'right') => {
      const view = controller.viewRange()
      if (!view) return
      const xs = draftRef.current.filter((placement) => placement.kind === 'prop').map((placement) => placement.x)
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
      controller.highlight(placement?.zone === 'floor' ? 'floor' : null, true)
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
      play('error')
      return
    }
    const record = typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {}
    const serverDraft = Array.isArray(record.draft) ? (record.draft as Placement[]) : keptPlacements
    const next = serverDraft.filter((placement) => !isRemovedProceduralFish(placement.ref))
    versionRef.current = typeof record.draftVersion === 'number' ? record.draftVersion : null
    bestHeartsRef.current = cozyLevel(next).hearts
    savedRef.current = next
    draftRef.current = next
    setDraft(next)
    setHistory([])
    controller.setPlacements(next)
    controller.setCharacterOpacity(0.3)
    loadedRef.current = true
    setLoaded(true)
    play('open')
  }, [controller, keptPlacements, play, slug])

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
    setOffer(null)
    isEditingRef.current = false
    setIsEditing(false)
    setLoaded(false)
    setSaveState('saved')
  }, [controller])

  const done = useCallback(async () => {
    if (payingRef.current) {
      setNotice('Hold on, still paying for that.')
      return
    }
    if (jobsRef.current.length > 0) {
      const left = Math.max(...jobsRef.current.map((job) => job.startedAt + job.seconds * 1000 - performance.now()))
      setNotice(`Hold on, still working: about ${Math.max(1, Math.ceil(left / 1000))}s to go.`)
      return
    }
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

  const applyFinish = useCallback(
    (zone: FinishSlot, ref: string) => {
      apply(withFinish(draftRef.current, zone, ref))
      play('select')
    },
    [apply, play],
  )

  /** Shows a wallpaper or baseboard from the shop on the room without changing the draft. */
  const previewFinish = useCallback(
    (zone: FinishSlot, ref: string | null) => {
      controller.setPlacements(ref ? withFinish(draftRef.current, zone, ref) : draftRef.current)
    },
    [controller],
  )

  const putAway = useCallback(
    (id: string) => {
      apply(putAwayWithRiders(draftRef.current, id))
      select(null)
      play('click')
    },
    [apply, play, select],
  )

  const flip = useCallback(
    (id: string) => {
      const placement = draftRef.current.find((entry) => entry.id === id)
      if (!placement) return
      apply(moveWithRiders(draftRef.current, { ...placement, flip: !placement.flip }), id)
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
      if (event.key === 'Escape') setOffer(null)
      if (selected === null) return
      if (event.key === 'Escape') return select(null)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault()
        return putAway(selected)
      }
      if (event.key.toLowerCase() === 'f') return flip(selected)
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
      const placement = draftRef.current.find((item) => item.id === selected)
      if (!placement) return
      event.preventDefault()
      const step = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? -0.1 : 0.1
      const next = nudged(placement, event.key === 'ArrowUp' || event.key === 'ArrowDown' ? 'y' : 'x', step)
      if (next) apply(moveWithRiders(draftRef.current, next))
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
      if (carry.kind === 'move') {
        controller.hide([carry.placement.id, ...ridersOf(carry.placement.id, draftRef.current).map((rider) => rider.id)])
      }
      play('click')
    }
    const velocity = (clientX - carry.lastX) / Math.max(1, now - carry.lastAt)
    carry.tilt += (Math.max(-MAX_TILT, Math.min(MAX_TILT, -velocity * 0.12)) - carry.tilt) * 0.35
    carry.lastX = clientX
    carry.lastAt = now
    const over = overDrawer(clientX, clientY)
    setOverTray(over)
    const { placement, surface } = carriedTo(carry, controller.worldXAt(clientX), controller.worldYAt(clientY))
    carry.placement = placement
    const before = carry.kind === 'move' ? draftRef.current.find((entry) => entry.id === placement.id) : undefined
    const riders = before ? ridersAfter(before, placement, draftRef.current) : []
    controller.ghost(placement, { valid: !over, tilt: carry.tilt, riders })
    if (surface) controller.highlight('top', !over, surface)
    else controller.highlight(placement.zone, !over)
  }

  /** Where a carried thing would land with the pointer at a world point. */
  function carriedTo(carry: Carry, worldX: number, worldY: number): { placement: Placement; surface: { minX: number; maxX: number; y: number } | null } {
    const { y: _y, on: _on, ...plain } = carry.placement
    const ref = plain.ref
    const prop = COZY.props[ref]
    const exclude = new Set([plain.id, ...ridersOf(plain.id, draftRef.current).map((rider) => rider.id)])
    if (prop?.rests) {
      const rest = restAt(ref, worldX, worldY, draftRef.current, exclude)
      if (rest) {
        const surface = surfacesIn(draftRef.current, exclude).find((entry) => entry.parentId === rest.on && entry.y === rest.y)
        return {
          placement: { ...plain, zone: 'top', x: rest.x, y: rest.y, on: rest.on },
          surface: surface ? { minX: surface.minX, maxX: surface.maxX, y: surface.y } : null,
        }
      }
      return { placement: { ...plain, zone: 'floor', x: clampX(sizedRef.current, ref, 'floor', worldX) }, surface: null }
    }
    const zone = zoneAt(COZY, ref, worldY) ?? plain.zone
    const x = clampX(sizedRef.current, ref, zone, worldX)
    if (zone === 'wall') return { placement: { ...plain, zone, x, y: clampY(ref, worldY - propHeight(ref) / 2) }, surface: null }
    return { placement: { ...plain, zone, x }, surface: null }
  }

  /** A placement moved one keyboard step; a resting thing stays on its surface or doesn't move. */
  function nudged(placement: Placement, axis: 'x' | 'y', step: number): Placement | null {
    if (placement.zone === 'top') {
      if (axis === 'y' || placement.y === undefined) return null
      const exclude = new Set([placement.id])
      const surface = surfacesIn(draftRef.current, exclude).find((entry) => entry.parentId === placement.on && entry.y === placement.y)
      if (!surface) return null
      const half = (COZY.props[placement.ref]?.width ?? 0) / 2
      const x = Math.round(Math.min(surface.maxX - half, Math.max(surface.minX + half, placement.x + step)) * 1000) / 1000
      return { ...placement, x }
    }
    if (axis === 'y') {
      if (placement.zone !== 'wall') return null
      const base = placement.y ?? 2.3 - propHeight(placement.ref) / 2
      return { ...placement, y: clampY(placement.ref, base + step) }
    }
    return { ...placement, x: clampX(sizedRef.current, placement.ref, placement.zone, placement.x + step) }
  }

  /** Whether a new thing may come out of the drawer; says why not when it can't. */
  function canPlaceNew(ref: string): boolean {
    // Each thing is owned once: a fast double tap must not put it out twice.
    if (draftRef.current.some((placement) => placement.kind === 'prop' && placement.ref === ref)) return false
    if (thingsIn(draftRef.current) >= THING_LIMIT) {
      setNotice(`Your room holds ${THING_LIMIT} things at most. Put something away to make space.`)
      return false
    }
    return true
  }

  function placeNew(ref: string): void {
    const zone = zoneFor(COZY, ref)
    if (!zone || !canPlaceNew(ref)) return
    // Dropped in the middle of the view, nudged to the nearest free spot; small things look for a table first.
    const center = controller.centerX()
    const view = controller.viewRange()
    const rest = view ? restInView(ref, view.left, view.right, center, draftRef.current) : null
    const id = newPlacementId()
    const next: Placement = rest
      ? { id, kind: 'prop', ref, zone: 'top', x: rest.x, y: rest.y, on: rest.on }
      : zone === 'wall'
        ? { id, kind: 'prop', ref, zone, x: freeX(sizedRef.current, ref, zone, draftRef.current, center), y: clampY(ref, 2.3 - propHeight(ref) / 2) }
        : { id, kind: 'prop', ref, zone, x: freeX(sizedRef.current, ref, zone, draftRef.current, center) }
    apply([...draftRef.current, next])
    markSeen(ref)
    select(null)
    startJob(next.id, 'build', buildSecondsFor(ref))
    play('click')
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
      apply([...draftRef.current, placement])
      markSeen(placement.ref)
      select(null)
      startJob(placement.id, 'build', buildSecondsFor(placement.ref))
      play('click')
      return
    }
    apply(moveWithRiders(draftRef.current, placement), placement.id)
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

  /** Where a job's ring or an offer sits: the tapped spot for whole-surface wear, else over the thing. */
  function anchorOf(id: string, at?: { x: number; y: number }): { left: number; top: number; bottom?: number } | null {
    if (!at) return controller.screenBox(id)
    return controller.screenPoint(at.x, at.y)
  }

  function startJob(id: string, kind: WorkKind, seconds: number, at?: { x: number; y: number }, celebrate = false): void {
    const job = { id, kind, seconds, startedAt: performance.now(), at, celebrate }
    jobsRef.current = [...jobsRef.current.filter((entry) => entry.id !== id), job]
    setJobs(jobsRef.current)
    controller.work(id, kind, 0)
  }

  /** A job ends: built things settle with a puff; junk that was being cleaned is gone for good. */
  function finishJob(job: Job, completed: boolean): void {
    jobsRef.current = jobsRef.current.filter((entry) => entry.id !== job.id)
    setJobs(jobsRef.current)
    controller.work(job.id, job.kind, null)
    if (!completed) return
    if (job.kind === 'build') {
      controller.bounce(job.id)
      puffAt(job.id)
      play('jump')
      return
    }
    const box = controller.screenBox(job.id)
    const next = draftRef.current.filter((placement) => placement.id !== job.id)
    const isLast = !next.some((placement) => placement.kind === 'mess')
    // It was paid for, so undo never brings it back.
    setHistory((stack) => stack.map((entry) => entry.filter((placement) => placement.id !== job.id)))
    replaceDraft(next)
    if (box) {
      const puff = { id: ++puffId.current, left: box.left, top: (box.top + box.bottom) / 2, big: isLast || job.celebrate === true }
      setPuffs((current) => [...current, puff])
      later(() => setPuffs((current) => current.filter((entry) => entry.id !== puff.id)), 900)
    }
    if (isLast) {
      play(job.celebrate ? 'success' : 'harp')
      showToast(job.celebrate ? 'Your first tidy-up! It already feels more like home.' : 'All clean! The place looks brighter already.')
      reportQuestEvent('room-clean')
    } else if (job.celebrate) {
      play('success')
      showToast('Lovely! One mess down, and the room is starting to shine.')
    } else {
      play('click')
    }
    if (job.celebrate) {
      setFirstCleanDone(true)
      writeLocal(FIRST_CLEAN_KEY, '1')
    }
  }

  /**
   * Pays for a piece of junk (unless it already is) and starts clearing it.
   * `celebrate` is the first-ever clean: no confirmation step and a two-second job.
   */
  async function cleanNow(id: string, ref: string, at: { x: number; y: number } | undefined, celebrate: boolean): Promise<boolean> {
    if (payingRef.current) return false
    const itemId = cleanItemId(id)
    if (!wallet.items.includes(itemId)) {
      setPaying(true)
      payingRef.current = true
      const outcome = await buy(itemId).finally(() => {
        payingRef.current = false
      })
      setPaying(false)
      if (outcome !== 'ok') {
        setNotice(outcome === 'insufficient' ? `Not enough stamps to ${isRepair(ref) ? 'repair' : 'clear'} that yet.` : 'That could not be paid for just now.')
        play('error')
        return false
      }
      play('purchase')
    }
    setOffer(null)
    // Paid for but not started (left Decorate meanwhile): tapping it later finishes the job for free.
    const placement = draftRef.current.find((entry) => entry.id === id)
    if (isEditingRef.current && placement) {
      controller.panTo(placement.x)
      startJob(id, 'clean', celebrate ? Math.min(2, cleanupFor(ref).seconds) : cleanupFor(ref).seconds, at, celebrate)
    }
    return true
  }

  /** Pays for a piece of junk (unless it already is) and starts clearing it. */
  async function confirmClean(): Promise<void> {
    if (!offer || paying) return
    await cleanNow(offer.id, offer.ref, offer.at, false)
  }

  /**
   * The broom is the one-tap way to tidy. The first clean is deliberately easier:
   * no offer card, no confirmation, a short job, and a celebration at the end.
   * Later sweeps open the ordinary offer, so they still need the paid confirmation.
   */
  async function tidyWithBroom(): Promise<void> {
    if (broomBusy || payingRef.current) return
    setBroomBusy(true)
    try {
      if (!isEditingRef.current) await enterEdit()
      if (!isEditingRef.current) return
      const messes = draftRef.current.filter((placement) => placement.kind === 'mess')
      if (messes.length === 0) return
      const mess = [...messes].sort((a, b) => cleanupFor(a.ref).price - cleanupFor(b.ref).price)[0]
      if (firstCleanDone) {
        controller.panTo(mess.x)
        setOffer({ id: mess.id, ref: mess.ref })
        play('click')
        return
      }
      await cleanNow(mess.id, mess.ref, undefined, true)
    } finally {
      setBroomBusy(false)
    }
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
    if (hit?.kind === 'mess') {
      select(null)
      setOffer({ id: hit.id, ref: hit.ref })
      play('click')
      return
    }
    setOffer(null)
    if (hit) {
      startCarry('move', hit, event)
      return
    }
    // A tap that only closes what's open shouldn't also open the wear offer underneath.
    const dismissing = offerRef.current !== null || selected !== null
    panRef.current = { pointerId: event.pointerId, lastX: event.clientX, lastY: event.clientY, moved: false, dismissing }
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {}
  }

  function onSurfaceMove(event: ReactPointerEvent<HTMLDivElement>): void {
    const pan = panRef.current
    if (pan && pan.pointerId === event.pointerId) {
      const dx = event.clientX - pan.lastX
      const dy = event.clientY - pan.lastY
      pan.lastX = event.clientX
      pan.lastY = event.clientY
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) pan.moved = true
      controller.panBy(dx, dy)
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
    if (pan.moved) return
    select(null)
    if (!pan.dismissing) offerWear(event.clientX, event.clientY)
  }

  /** A tap on bare wall or floor: offer to fix all of its wear at once. */
  function offerWear(clientX: number, clientY: number): void {
    const x = controller.worldXAt(clientX)
    const y = controller.worldYAt(clientY)
    if (x < 0 || x > widthRef.current || y > CEILING) return
    const surface = y >= 0 ? 'wall' : 'floor'
    const wear = draftRef.current.find((placement) => placement.kind === 'mess' && WEAR[placement.ref] === surface)
    if (!wear || jobsRef.current.some((job) => job.id === wear.id)) return
    setOffer({ id: wear.id, ref: wear.ref, at: { x, y } })
    play('click')
  }

  if (error) {
    return (
      <p className="hall-error" role="alert">
        This room could not open. <Link href="/museum">Back to the museum</Link>
      </p>
    )
  }

  const selectedPlacement = selected === null ? null : draft.find((entry) => entry.id === selected) ?? null
  const broomImage = cozyPropImageUrl('broom')
  const showTidy = canEdit && isReady && !isEditing && dirtyMesses.length > 0

  return (
    <>
      {canEdit && isReady && !isEditing ? (
        <div className="decor-enter-wrap">
          <button type="button" className="button decor-enter" data-sound onClick={() => void enterEdit()}>
            <span aria-hidden="true">{'✦'}</span> Decorate
          </button>
        </div>
      ) : null}

      {showTidy ? (
        <>
          <div className="room-broom-wrap">
            <p className="room-tidy-hint">Your room is dusty! Tap the broom to tidy up.</p>
            <button
              type="button"
              className={`room-broom${firstCleanDone ? '' : ' is-first'}${broomBusy ? ' is-busy' : ''}`}
              onClick={() => void tidyWithBroom()}
              aria-label={firstCleanDone ? 'Tidy up with the broom' : 'Tidy up with the broom (your first clean is quick)'}
              title="Tidy up"
            >
              {broomImage ? <img src={broomImage} alt="" draggable={false} /> : <span aria-hidden="true">{'🧹'}</span>}
              <span className="room-broom-spark" aria-hidden="true">
                {'✦'}
              </span>
            </button>
          </div>
          <div className="room-mess-sparkles" aria-hidden="true">
            {dirtyMesses.map((mess) => (
              <span
                key={mess.id}
                ref={(element) => {
                  if (element) sparkleRef.current.set(mess.id, element)
                  else sparkleRef.current.delete(mess.id)
                }}
                className="room-mess-sparkle"
              >
                {'✦'}
              </span>
            ))}
          </div>
        </>
      ) : null}

      {canEdit && isReady && !isEditing ? <LetterMailbox ownerName={ownerName} /> : null}

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

          {offer
            ? (() => {
                const cost = cleanupFor(offer.ref)
                const paid = wallet.items.includes(cleanItemId(offer.id))
                const short = !paid && (wallet.balance ?? 0) < cost.price
                return (
                  <div ref={offerRef} className="decor-offer" style={{ opacity: 0 }} role="dialog" aria-label={`${isRepair(offer.ref) ? 'Repair' : 'Clear'} the ${messLabel(offer.ref).toLowerCase()}`}>
                    <p className="decor-offer-title">{messLabel(offer.ref)}</p>
                    {messNote(offer.ref) ? <p className="decor-offer-meta">{messNote(offer.ref)}</p> : null}
                    <p className="decor-offer-meta">
                      {paid ? 'Paid for' : stampLabel(cost.price)} · takes {cost.seconds}s
                    </p>
                    <div className="decor-offer-actions">
                      <button type="button" className="decor-buy" disabled={paying || short} onClick={() => void confirmClean()}>
                        {paying
                          ? '…'
                          : paid
                            ? isRepair(offer.ref) ? 'Finish repairing' : 'Finish cleaning'
                            : short
                              ? 'Not enough stamps'
                              : isRepair(offer.ref) ? 'Repair' : 'Clean up'}
                      </button>
                      <button type="button" className="decor-offer-close" onClick={() => setOffer(null)} aria-label="Never mind">
                        {'×'}
                      </button>
                    </div>
                  </div>
                )
              })()
            : null}

          <DecorDrawer
            ref={drawerRef}
            slug={slug}
            placements={draft}
            saveState={saveState}
            saveLabel={SAVE_LABELS[saveState]}
            maxPlacements={THING_LIMIT}
            notice={notice}
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
            onBought={unseeBought}
            onFinish={applyFinish}
            onPreviewFinish={previewFinish}
            roomSize={roomSize}
            nextSize={canEdit ? nextRoomSize(roomSize) : null}
            dirt={draft.filter((placement) => placement.kind === 'mess').length}
          />
        </>
      ) : null}

      <div className="decor-fx" aria-hidden="true">
        {jobs.map((job) => (
          <div
            key={job.id}
            ref={(element) => {
              if (element) ringsRef.current.set(job.id, element)
              else ringsRef.current.delete(job.id)
            }}
            className={`decor-work is-${job.kind}`}
            style={{ opacity: 0 }}
          >
            <span>{job.seconds}s</span>
          </div>
        ))}
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

      {isReady && arriving ? (
        <div className="room-arrival" aria-hidden="true" onAnimationEnd={(event) => event.target === event.currentTarget && setArriving(false)}>
          <span className="room-arrival-plaque">{`${ownerName}'s room`}</span>
        </div>
      ) : null}

      <AnimatePresence>{isReady ? null : <HallSkeleton key="personal-loading" preload={false} />}</AnimatePresence>
    </>
  )
}
