import * as THREE from 'three'
import type { Emote } from '@tiny/core/presence/wire'
import type { Attachment } from '@/features/hall/scene/carried'
import type { Pose } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import type { Viewport } from '@/features/hall/scene/overlay'
import { clearRigLayer, createRigLayer, disposeRigLayer, loadRig, type Rig } from '@/features/hall/scene/rig'
import { createRigState, rigFacing, stepRigState, type RigState } from '@/features/hall/scene/rig-motion'
import { EMOTE_LABELS } from '../lib/emote-events'
import type { RemoteVisitor } from '../lib/peers'

export const MAX_SHOWN = 8
const EMOTE_MS = 2000
const HOP_MS = 360
const ANNOUNCE_GAP_MS = 30_000
// Closer than this, a visitor stands behind the local one; their tag would read as ours.
const BEHIND_SELF = 0.3

interface Prop {
  image: HTMLImageElement
  attachment: Attachment
}

/** What the hall lends for drawing others: its beanbag and the things that can be carried. */
export interface VisitorScenery {
  seat?: { x: number; y: number; height: number; plain: HTMLImageElement; helm: HTMLImageElement }
  helm?: Prop
  cup?: Prop
}

interface Sprite {
  element: HTMLImageElement
  transform: string
  size: string
}

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
  perch: Sprite
  helm: Sprite
  cup: Sprite
}

export interface RemoteVisitors {
  update(
    dt: number,
    visitors: RemoteVisitor[],
    selfX: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    scenery?: VisitorScenery | null,
  ): void
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
  const pose: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }

  // Sprites sit just above the layer, so they too stay behind the local visitor.
  function sprite(className: string): Sprite {
    const element = document.createElement('img')
    element.className = className
    element.alt = ''
    element.setAttribute('aria-hidden', 'true')
    element.hidden = true
    layer.domElement.after(element)
    return { element, transform: '', size: '' }
  }

  function show(target: Sprite, src: string, size: string, transform: string, sizeProperty: 'width' | 'height'): void {
    if (target.element.getAttribute('src') !== src) target.element.src = src
    if (target.size !== size) {
      target.size = size
      target.element.style[sizeProperty] = size
    }
    if (target.transform !== transform) {
      target.transform = transform
      target.element.style.transform = transform
    }
    target.element.hidden = false
  }

  /** The same placement as a carried prop on the local visitor (carried.ts). */
  function showProp(target: Sprite, prop: Prop, at: Pose): void {
    const aspect = prop.image.naturalHeight / prop.image.naturalWidth
    show(
      target,
      prop.image.src,
      `${at.width.toFixed(1)}px`,
      `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0) scale(${at.flip}, 1) rotate(${at.rotation.toFixed(1)}deg)` +
        ` translate(${(-at.width / 2).toFixed(1)}px, ${((-at.width * aspect) / 2).toFixed(1)}px)`,
      'width',
    )
  }

  function placeOwn(): void {
    if (!own) return
    if (performance.now() >= own.until) {
      own.bubble.remove()
      own = null
      return
    }
    const figure = host.querySelector<HTMLElement>('.hall-bunny-rig:not([hidden]), .hall-bunny:not([hidden])')
    if (!figure) return
    const at = figure.getBoundingClientRect()
    const origin = host.getBoundingClientRect()
    own.bubble.style.transform =
      `translate3d(${(at.left + at.width / 2 - origin.left).toFixed(1)}px, ${(at.top + at.height * 0.08 - origin.top).toFixed(1)}px, 0) translate(-50%, -100%)`
  }

  function hideSprites(entry: Shown): void {
    entry.perch.element.hidden = true
    entry.helm.element.hidden = true
    entry.cup.element.hidden = true
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let size = { width: 0, height: 0, ratio: 0 }
  // The local visitor's own bubble rides above them while it shows.
  let own: { bubble: HTMLDivElement; until: number } | null = null
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
    entry.perch.element.remove()
    entry.helm.element.remove()
    entry.cup.element.remove()
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
    update(dt, visitors, selfX, camera, viewport, scenery) {
      const now = performance.now()
      placeOwn()
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
            perch: sprite('visitor-perch'), helm: sprite('hall-carried'), cup: sprite('hall-carried'),
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
        const emoteAge = visitor.emote ? now - visitor.emote.at : Infinity
        const hop = !reducedMotion && emoteAge < HOP_MS ? Math.sin((Math.PI * emoteAge) / HOP_MS) * heightPx * 0.08 : 0
        const seat = visitor.sit && visitor.look.kind === 'bunny' ? scenery?.seat : undefined
        let screenX: number
        let headY: number

        if (seat) {
          // Seated on the beanbag: the painted sitting bunny, as the local visitor is drawn.
          const image = visitor.helm ? seat.helm : seat.plain
          projected.set(seat.x, seat.y, 0).project(camera)
          screenX = (projected.x * 0.5 + 0.5) * viewport.width
          const screenY = (-projected.y * 0.5 + 0.5) * viewport.height - hop
          const seatPx = (seat.height / frustumHeight) * viewport.height
          const widthPx = (seatPx * image.naturalWidth) / image.naturalHeight
          const onScreen = screenX - widthPx / 2 < viewport.width && screenX + widthPx / 2 > 0
          entry.tag.hidden = !onScreen
          if (!onScreen) {
            hideSprites(entry)
            entry.bubble.hidden = true
            continue
          }
          show(entry.perch, image.src, `${seatPx.toFixed(1)}px`, `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) translate(-50%, -50%)`, 'height')
          entry.helm.element.hidden = true
          if (visitor.cup && scenery?.cup) {
            const { sit } = scenery.cup.attachment
            const scale = seatPx / image.naturalHeight
            pose.x = screenX + (sit.x - image.naturalWidth / 2) * scale
            pose.y = screenY + (sit.y - image.naturalHeight / 2) * scale
            pose.width = sit.width * scale
            pose.rotation = sit.rotation
            pose.flip = sit.flip
            showProp(entry.cup, scenery.cup, pose)
          } else {
            entry.cup.element.hidden = true
          }
          headY = screenY - seatPx / 2
        } else {
          entry.perch.element.hidden = true
          projected.set(visitor.x, CONFIG.character.centerY, 0).project(camera)
          screenX = (projected.x * 0.5 + 0.5) * viewport.width
          const screenY = (-projected.y * 0.5 + 0.5) * viewport.height
          const canvasHeight = rig ? heightPx * rig.spriteScale : heightPx
          const canvasWidth = rig ? canvasHeight * rig.aspect : heightPx
          const left = screenX - canvasWidth / 2
          const onScreen = left < viewport.width && left + canvasWidth > 0
          entry.tag.hidden = rig === null || !onScreen || Math.abs(visitor.x - selfX) < BEHIND_SELF
          if (!rig || !onScreen) {
            hideSprites(entry)
            entry.bubble.hidden = true
            continue
          }

          const speed = Math.abs(visitor.vx)
          stepRigState(entry.motion, dt, speed > 0.12, visitor.facing > 0 ? 'right' : 'left', speed / CONFIG.move.maxSpeed, rig.cycleSeconds)
          const top = screenY + heightPx / 2 - canvasHeight * rig.feet - hop
          rig.render(entry.motion, dt, canvasHeight, ratio, { left, top })

          // Carried things ride the same anchors as on the local visitor (Character.attach).
          for (const [has, prop, target] of [
            [visitor.helm, scenery?.helm, entry.helm],
            [visitor.cup, scenery?.cup, entry.cup],
          ] as const) {
            const anchor = prop?.attachment.rig?.[visitor.look.kind]
            if (!has || !prop || !anchor || !rig.projectAttachment(anchor, pose)) {
              target.element.hidden = true
              continue
            }
            pose.x += left
            pose.y += top
            pose.flip = rigFacing(entry.motion) === prop.attachment.facing ? 1 : -1
            pose.rotation = anchor.rotation + pose.rotation / pose.flip
            showProp(target, prop, pose)
          }
          headY = screenY - heightPx / 2 - hop
        }

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
      own?.bubble.remove()
      const bubble = bubbleFor(host)
      bubble.hidden = false
      bubble.textContent = EMOTE_LABELS[e]
      bubble.classList.add('visitor-emote--pop')
      own = { bubble, until: performance.now() + EMOTE_MS }
      placeOwn()
    },

    dispose() {
      disposed = true
      own?.bubble.remove()
      for (const entry of [...shown.values()]) forget(entry)
      announcer.remove()
      disposeRigLayer(layer)
      layer.domElement.remove()
    },
  }
}
