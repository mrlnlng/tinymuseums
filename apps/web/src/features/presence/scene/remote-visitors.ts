import * as THREE from 'three'
import type { Emote } from '@tiny/core/presence/wire'
import { CONFIG } from '@/features/hall/scene/config'
import type { Viewport } from '@/features/hall/scene/overlay'
import { clearRigLayer, createRigLayer, disposeRigLayer, loadRig, type Rig } from '@/features/hall/scene/rig'
import { createRigState, stepRigState, type RigState } from '@/features/hall/scene/rig-motion'
import { EMOTE_LABELS } from '../lib/emote-events'
import type { RemoteVisitor } from '../lib/peers'

export const MAX_SHOWN = 8
const EMOTE_MS = 2000
const HOP_MS = 360
const ANNOUNCE_GAP_MS = 30_000
// Closer than this, a visitor stands behind the local one; their tag would read as ours.
const BEHIND_SELF = 0.3


interface Shown {
  pid: string
  kind: RemoteVisitor['look']['kind']
  rig: Rig | null
  failed: boolean
  costume: string | null
  bow: string | null
  motion: RigState
  tag: HTMLDivElement
  bubble: HTMLDivElement
  bubbleAt: number
}

export interface RemoteVisitors {
  update(dt: number, visitors: RemoteVisitor[], selfX: number, camera: THREE.OrthographicCamera, viewport: Viewport): void
  /** The sender sees their own emote at once, over their own character. */
  showOwnEmote(e: Emote): void
  dispose(): void
}

function bubbleFor(host: HTMLElement): HTMLDivElement {
  const bubble = document.createElement('div')
  bubble.className = 'visitor-emote'
  bubble.setAttribute('aria-hidden', 'true')
  bubble.hidden = true
  host.appendChild(bubble)
  return bubble
}

/** Other visitors, drawn into one WebGL layer behind the local visitor, with name tags. */
export function createRemoteVisitors(host: HTMLElement): RemoteVisitors {
  const layer = createRigLayer()
  layer.domElement.className = 'visitor-layer'
  layer.domElement.setAttribute('aria-hidden', 'true')
  host.prepend(layer.domElement)
  const announcer = document.createElement('div')
  announcer.className = 'visitor-announcer'
  announcer.setAttribute('aria-live', 'polite')
  host.appendChild(announcer)

  const shown = new Map<string, Shown>()
  const projected = new THREE.Vector3()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let size = { width: 0, height: 0, ratio: 0 }
  let lastCount = 0
  let announcedAt = -Infinity
  let disposed = false

  function load(entry: Shown): void {
    entry.rig?.dispose()
    entry.rig = null
    const kind = entry.kind
    void loadRig(null, kind, layer).then(
      (rig) => {
        if (disposed || shown.get(entry.pid) !== entry || entry.kind !== kind) return rig.dispose()
        rig.setCostume(entry.costume, entry.bow)
        entry.rig = rig
      },
      (error) => {
        entry.failed = true
        console.warn(`[presence] ${kind} rig unavailable`, error)
      },
    )
  }

  function forget(entry: Shown): void {
    entry.rig?.dispose()
    entry.tag.remove()
    entry.bubble.remove()
    shown.delete(entry.pid)
  }

  function announce(count: number, now: number): void {
    if (count > 0 && lastCount === 0 && now - announcedAt > ANNOUNCE_GAP_MS) {
      announcer.textContent = count === 1 ? 'Another visitor is here.' : `${count} other visitors are here.`
      announcedAt = now
    }
    lastCount = count
  }

  return {
    update(dt, visitors, selfX, camera, viewport) {
      const now = performance.now()
      const ratio = Math.min(2, window.devicePixelRatio)
      if (viewport.width !== size.width || viewport.height !== size.height || ratio !== size.ratio) {
        size = { width: viewport.width, height: viewport.height, ratio }
        layer.setPixelRatio(ratio)
        layer.setSize(viewport.width, viewport.height)
      }

      const nearest = [...visitors].sort((a, b) => Math.abs(a.x - selfX) - Math.abs(b.x - selfX)).slice(0, MAX_SHOWN)
      announce(nearest.length, now)
      const keep = new Set(nearest.map((visitor) => visitor.pid))
      for (const entry of [...shown.values()]) if (!keep.has(entry.pid)) forget(entry)

      const names = new Map<string, number>()
      clearRigLayer(layer)
      const frustumHeight = camera.top - camera.bottom
      const heightPx = (CONFIG.character.height / frustumHeight) * viewport.height

      for (const visitor of nearest) {
        let entry = shown.get(visitor.pid)
        if (!entry) {
          const tag = document.createElement('div')
          tag.className = 'visitor-tag'
          tag.setAttribute('aria-hidden', 'true')
          host.appendChild(tag)
          entry = {
            pid: visitor.pid, kind: visitor.look.kind, rig: null, failed: false,
            costume: visitor.look.costume, bow: visitor.look.bow,
            motion: createRigState(visitor.facing > 0 ? 'right' : 'left'), tag, bubble: bubbleFor(host), bubbleAt: -Infinity,
          }
          shown.set(visitor.pid, entry)
          load(entry)
        }
        if (visitor.look.kind !== entry.kind) {
          entry.kind = visitor.look.kind
          entry.failed = false
          load(entry)
        }
        if (visitor.look.costume !== entry.costume || visitor.look.bow !== entry.bow) {
          entry.costume = visitor.look.costume
          entry.bow = visitor.look.bow
          entry.rig?.setCostume(entry.costume, entry.bow)
        }

        const repeat = (names.get(visitor.name) ?? 0) + 1
        names.set(visitor.name, repeat)
        const label = repeat > 1 ? `${visitor.name} ·${repeat}` : visitor.name
        if (entry.tag.textContent !== label) entry.tag.textContent = label

        const rig = entry.rig
        projected.set(visitor.x, CONFIG.character.centerY, 0).project(camera)
        const screenX = (projected.x * 0.5 + 0.5) * viewport.width
        const screenY = (-projected.y * 0.5 + 0.5) * viewport.height
        const canvasHeight = rig ? heightPx * rig.spriteScale : heightPx
        const canvasWidth = rig ? canvasHeight * rig.aspect : heightPx
        const left = screenX - canvasWidth / 2
        const onScreen = left < viewport.width && left + canvasWidth > 0
        const visible = rig !== null && onScreen
        entry.tag.hidden = !visible || Math.abs(visitor.x - selfX) < BEHIND_SELF
        if (!rig || !onScreen) {
          entry.bubble.hidden = true
          continue
        }

        const speed = Math.abs(visitor.vx)
        stepRigState(entry.motion, dt, speed > 0.12, visitor.facing > 0 ? 'right' : 'left', speed / CONFIG.move.maxSpeed, rig.cycleSeconds)
        const emoteAge = visitor.emote ? now - visitor.emote.at : Infinity
        const hop = !reducedMotion && emoteAge < HOP_MS ? Math.sin((Math.PI * emoteAge) / HOP_MS) * heightPx * 0.08 : 0
        const top = screenY + heightPx / 2 - canvasHeight * rig.feet - hop
        rig.render(entry.motion, dt, canvasHeight, ratio, { left, top })

        const headY = screenY - heightPx / 2 - hop
        entry.tag.style.transform = `translate3d(${screenX.toFixed(1)}px, ${(headY - 6).toFixed(1)}px, 0) translate(-50%, -100%)`
        const showBubble = visitor.emote !== null && emoteAge < EMOTE_MS
        entry.bubble.hidden = !showBubble
        if (showBubble && visitor.emote) {
          if (entry.bubbleAt !== visitor.emote.at) {
            entry.bubbleAt = visitor.emote.at
            entry.bubble.textContent = EMOTE_LABELS[visitor.emote.e]
            entry.bubble.classList.remove('visitor-emote--pop')
            void entry.bubble.offsetWidth
            entry.bubble.classList.add('visitor-emote--pop')
          }
          entry.bubble.style.transform = `translate3d(${screenX.toFixed(1)}px, ${(headY - 34).toFixed(1)}px, 0) translate(-50%, -100%)`
        }
      }
    },

    showOwnEmote(e) {
      const figure = host.querySelector<HTMLElement>('.hall-bunny-rig:not([hidden]), .hall-bunny:not([hidden])')
      if (!figure) return
      const at = figure.getBoundingClientRect()
      const origin = host.getBoundingClientRect()
      const bubble = bubbleFor(host)
      bubble.hidden = false
      bubble.textContent = EMOTE_LABELS[e]
      bubble.classList.add('visitor-emote--pop')
      bubble.style.transform = `translate3d(${(at.left + at.width / 2 - origin.left).toFixed(1)}px, ${(at.top + at.height * 0.08 - origin.top).toFixed(1)}px, 0) translate(-50%, -100%)`
      window.setTimeout(() => bubble.remove(), EMOTE_MS)
    },

    dispose() {
      disposed = true
      for (const entry of [...shown.values()]) forget(entry)
      announcer.remove()
      disposeRigLayer(layer)
      layer.domElement.remove()
    },
  }
}
