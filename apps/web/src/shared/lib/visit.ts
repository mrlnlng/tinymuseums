import type { VisitFeature, VisitLandmark } from '@tiny/core/visit-features'
import { VISIT_LANDMARKS, isVisitFeature } from '@tiny/core/visit-features'

const HEARTBEAT_MS = 60_000
const FIRST_REPORT_MS = 3_000

interface VisitState {
  id: string
  page: string
  visibleMs: number
  visibleSince: number | null
  interactions: number
  paintings: number
  furthest: VisitLandmark
  features: Map<VisitFeature, number>
  isDirty: boolean
}

let state: VisitState | null = null

export function track(feature: VisitFeature): void {
  if (!state) return
  state.features.set(feature, (state.features.get(feature) ?? 0) + 1)
  state.isDirty = true
}

export function reachPainting(count: number): void {
  if (!state || count <= state.paintings) return
  state.paintings = count
  state.isDirty = true
}

export function reachLandmark(landmark: VisitLandmark): void {
  if (!state || VISIT_LANDMARKS.indexOf(landmark) <= VISIT_LANDMARKS.indexOf(state.furthest)) return
  state.furthest = landmark
  state.isDirty = true
}

function visibleMs(visit: VisitState): number {
  return visit.visibleMs + (visit.visibleSince === null ? 0 : performance.now() - visit.visibleSince)
}

function flush(): void {
  if (!state || !state.isDirty) return
  const body = JSON.stringify({
    id: state.id,
    page: state.page,
    device: window.matchMedia('(pointer: coarse)').matches ? 'mobile' : 'desktop',
    durationMs: Math.round(visibleMs(state)),
    interactions: state.interactions,
    paintings: state.paintings,
    furthest: state.furthest,
    features: Object.fromEntries(state.features),
  })
  const sent = navigator.sendBeacon?.('/api/visit', new Blob([body], { type: 'application/json' }))
  if (sent) state.isDirty = false
}

export function startVisit(page: string): () => void {
  if (state || typeof crypto.randomUUID !== 'function') return () => {}
  const visit: VisitState = {
    id: crypto.randomUUID(),
    page,
    visibleMs: 0,
    visibleSince: document.visibilityState === 'visible' ? performance.now() : null,
    interactions: 0,
    paintings: 0,
    furthest: 'entrance',
    features: new Map(),
    isDirty: true,
  }
  state = visit

  const onInput = (event: Event) => {
    if (event instanceof KeyboardEvent && event.repeat) return
    visit.interactions += 1
    visit.isDirty = true
  }
  const onClick = (event: MouseEvent) => {
    const feature = (event.target as Element | null)?.closest('[data-track]')?.getAttribute('data-track')
    if (isVisitFeature(feature)) track(feature)
  }
  const onVisibility = () => {
    if (document.visibilityState === 'visible') {
      visit.visibleSince ??= performance.now()
      return
    }
    if (visit.visibleSince !== null) {
      visit.visibleMs += performance.now() - visit.visibleSince
      visit.visibleSince = null
      visit.isDirty = true
    }
    flush()
  }
  const onPageHide = () => {
    onVisibility()
    visit.isDirty = true
    flush()
  }
  const firstReport = window.setTimeout(flush, FIRST_REPORT_MS)
  const heartbeat = window.setInterval(() => {
    if (document.visibilityState !== 'visible') return
    visit.isDirty = true
    flush()
  }, HEARTBEAT_MS)

  document.addEventListener('pointerdown', onInput, { capture: true, passive: true })
  document.addEventListener('keydown', onInput, { capture: true, passive: true })
  document.addEventListener('click', onClick, { capture: true, passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  window.addEventListener('pagehide', onPageHide)

  return () => {
    window.clearTimeout(firstReport)
    window.clearInterval(heartbeat)
    document.removeEventListener('pointerdown', onInput, { capture: true })
    document.removeEventListener('keydown', onInput, { capture: true })
    document.removeEventListener('click', onClick, { capture: true })
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('pagehide', onPageHide)
    state = null
  }
}
