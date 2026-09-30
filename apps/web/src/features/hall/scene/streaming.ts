import type { HallPieceDto, HallSliceDto } from '@tiny/core'

export type SlotStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface SlotRuntime<T> {
  index: number
  piece: HallPieceDto
  status: SlotStatus
  texture?: T
  startedAt?: number
  readyAt?: number
  inRangeAt?: number
  attempts?: number
  retryAt?: number
}

export interface SlotSnapshot {
  index: number
  status: SlotStatus
  hasThumbhash: boolean
  hasTexture: boolean
  attempts: number
  retryAt: number
  readyAt: number | undefined
  inRangeAt: number | undefined
  centerX: number | undefined
}

export interface MountSnapshot {
  index: number
  showsPlaceholder: boolean
  fading: boolean
}

export type StreamAction =
  | { kind: 'unmount'; index: number }
  | { kind: 'mount'; index: number }
  | { kind: 'fade'; index: number }
  | { kind: 'unmountMesh'; index: number }
  | { kind: 'enterRange'; index: number }
  | { kind: 'load'; index: number }

export interface StreamingInput {
  slots: readonly SlotSnapshot[]
  mounts: readonly MountSnapshot[]
  cameraX: number
  now: number
  inFlight: number
  mountRadiusUnits: number
  loadRadiusUnits: number
  minDwellMs: number
  maxConcurrentLoads: number
  maxTextureAttempts: number
}

export function planStreaming(input: StreamingInput): StreamAction[] {
  const actions: StreamAction[] = []
  const mounted = new Map<number, MountSnapshot>()
  for (const mount of input.mounts) mounted.set(mount.index, mount)

  const wanted: { index: number; distance: number }[] = []
  let mountedThisFrame = false
  let inFlight = input.inFlight

  for (const slot of input.slots) {
    const { centerX } = slot
    if (centerX === undefined) continue

    const distance = Math.abs(centerX - input.cameraX)

    if (distance > input.loadRadiusUnits) {
      if (mounted.has(slot.index) || slot.status === 'error') {
        actions.push({ kind: 'unmount', index: slot.index })
      }
      continue
    }

    const mount = mounted.get(slot.index)
    if (
      distance <= input.mountRadiusUnits &&
      slot.status !== 'ready' &&
      !mount &&
      slot.hasThumbhash
    ) {
      if (!mountedThisFrame) {
        actions.push({ kind: 'mount', index: slot.index })
        mountedThisFrame = true
        mounted.set(slot.index, { index: slot.index, showsPlaceholder: true, fading: false })
      }
    } else if (mount?.showsPlaceholder && !mount.fading && slot.status === 'ready' && slot.hasTexture) {
      actions.push({ kind: 'fade', index: slot.index })
    }

    if (slot.status === 'idle') {
      wanted.push({ index: slot.index, distance })
      continue
    }

    if (slot.status === 'error') {
      if (slot.attempts < input.maxTextureAttempts && input.now >= slot.retryAt) {
        wanted.push({ index: slot.index, distance })
      }
      continue
    }

    if (distance > input.mountRadiusUnits) {
      if (mounted.has(slot.index)) actions.push({ kind: 'unmountMesh', index: slot.index })
      continue
    }
    if (slot.inRangeAt === undefined) actions.push({ kind: 'enterRange', index: slot.index })

    if (slot.status === 'ready' && !mounted.has(slot.index)) {
      const arrivedAt = slot.inRangeAt ?? input.now
      const earliest = arrivedAt + input.minDwellMs
      if (!mountedThisFrame && input.now >= Math.max(slot.readyAt ?? input.now, earliest)) {
        actions.push({ kind: 'mount', index: slot.index })
        mountedThisFrame = true
      }
    }
  }

  wanted.sort((a, b) => a.distance - b.distance)
  for (const { index } of wanted) {
    if (inFlight >= input.maxConcurrentLoads) break
    actions.push({ kind: 'load', index })
    inFlight += 1
  }

  return actions
}

export interface NeedsMoreInput {
  nextIndex: number | null
  known: number
  centerX: readonly number[]
  visitorX: number
  prefetchAheadUnits: number
}

export function needsMore(input: NeedsMoreInput): boolean {
  if (input.nextIndex === null) return false
  if (input.known === 0) return true
  const lastCenter = input.centerX[input.known - 1] ?? 0
  return input.visitorX > lastCenter - input.prefetchAheadUnits
}

export interface SliceFeedOptions {
  sliceSize: number
  fetchSlice: (epochId: number, after: number, limit: number) => Promise<HallSliceDto>
  onSlice: (slice: HallSliceDto) => void
  now?: () => number
}

export class SliceFeed {
  isFetching = false
  failures = 0
  retryAt = 0
  private readonly options: SliceFeedOptions
  private readonly now: () => number

  constructor(options: SliceFeedOptions) {
    this.options = options
    this.now = options.now ?? (() => performance.now())
  }

  maybeFetch(epochId: number, nextIndex: number | null): void {
    if (this.isFetching || nextIndex === null) return
    if (this.now() < this.retryAt) return
    this.isFetching = true
    this.options
      .fetchSlice(epochId, nextIndex, this.options.sliceSize)
      .then((slice) => {
        this.options.onSlice(slice)
        this.failures = 0
      })
      .catch(() => {
        this.retryAt = this.now() + Math.min(10000, 500 * 2 ** this.failures)
        this.failures += 1
      })
      .finally(() => {
        this.isFetching = false
      })
  }
}
