import * as THREE from 'three'
import type { Attachment } from '@/features/hall/scene/carried'
import type { Pose } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import type { Viewport } from '@/features/hall/scene/overlay'
import { clearRigLayer, createRigLayer, disposeRigLayer, loadRig, type Rig } from '@/features/hall/scene/rig'
import { createRigState, rigFacing, stepRigState, type RigState } from '@/features/hall/scene/rig-motion'
import { isMuted } from '../lib/room-events'
import type { RemoteVisitor } from '../lib/peers'

export const MAX_SHOWN = 8
/** Long enough to read: 3 s, plus a little per character, up to 8 s. */
export function bubbleMs(text: string): number {
  return Math.min(8000, Math.max(3000, 1500 + 60 * [...text].length))
}
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
  costume: string | null
  bow: string | null
  motion: RigState
  tag: HTMLDivElement
  bubble: HTMLDivElement
  bubbleAt: number
  bubbleWidth: number
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
  /** The sender sees their own message at once, over their own character. */
  showOwnMessage(text: string): void
  /** Read out to screen readers, politely. */
  announce(text: string): void
  dispose(): void
}

/** A bubble's centre, kept so the whole bubble stays on screen near an edge. */
function insideScreen(x: number, width: number, viewportWidth: number): number {
  const margin = 8 + width / 2
  return viewportWidth < 2 * margin ? viewportWidth / 2 : Math.min(viewportWidth - margin, Math.max(margin, x))
}

function bubbleFor(host: HTMLElement): HTMLDivElement {
  const bubble = document.createElement('div')
  bubble.className = 'visitor-bubble'
  bubble.setAttribute('aria-hidden', 'true')
  bubble.hidden = true
  host.appendChild(bubble)
  return bubble
}

/** Other visitors, drawn into one WebGL layer behind the local visitor, with name tags. */
export function createRemoteVisitors(host: HTMLElement): RemoteVisitors {
  // Most visits start alone. Chat bubbles need DOM, but a WebGL context is only needed
  // once another visitor arrives; an empty room also needs no canvas clears or resizes.
  let layer: ReturnType<typeof createRigLayer> | null = null
  function ensureLayer(): ReturnType<typeof createRigLayer> {
    if (!layer) {
      layer = createRigLayer()
      layer.domElement.className = 'visitor-layer'
      layer.domElement.setAttribute('aria-hidden', 'true')
      host.prepend(layer.domElement)
    }
    return layer
  }
  const announcer = document.createElement('div')
  announcer.className = 'visitor-announcer'
  announcer.setAttribute('aria-live', 'polite')
  host.appendChild(announcer)

  const shown = new Map<string, Shown>()
  const nearest: RemoteVisitor[] = []
  const keep = new Set<string>()
  const names = new Map<string, number>()
  const projected = new THREE.Vector3()
  const pose: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }

  // Sprites sit just above the layer, so they too stay behind the local visitor.
  function sprite(className: string): Sprite {
    const element = document.createElement('img')
    element.className = className
    element.alt = ''
    element.setAttribute('aria-hidden', 'true')
    element.hidden = true
    ensureLayer().domElement.after(element)
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
    const center = at.left + at.width / 2 - origin.left
    const x = insideScreen(center, own.width, origin.width)
    own.bubble.style.setProperty('--tail', `${Math.max(14 - own.width / 2, Math.min(own.width / 2 - 14, center - x)).toFixed(1)}px`)
    own.bubble.style.transform =
      `translate3d(${x.toFixed(1)}px, ${(at.top + at.height * 0.08 - origin.top).toFixed(1)}px, 0) translate(-50%, -100%)`
  }

  function hideSprites(entry: Shown): void {
    entry.perch.element.hidden = true
    entry.helm.element.hidden = true
    entry.cup.element.hidden = true
  }
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let size = { width: 0, height: 0, ratio: 0 }
  // The local visitor's own bubble rides above them while it shows.
  let own: { bubble: HTMLDivElement; until: number; width: number } | null = null
  let lastCount = 0
  let announcedAt = -Infinity
  let disposed = false

  function load(entry: Shown): void {
    entry.rig?.dispose()
    entry.rig = null
    const kind = entry.kind
    void loadRig(null, kind, ensureLayer()).then(
      (rig) => {
        if (disposed || shown.get(entry.pid) !== entry || entry.kind !== kind) return rig.dispose()
        rig.setCostume(entry.costume, entry.bow)
        entry.rig = rig
      },
      (error) => {
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

  function arrivals(count: number, now: number): void {
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
      nearest.length = 0
      for (const visitor of visitors) nearest.push(visitor)
      nearest.sort((a, b) => Math.abs(a.x - selfX) - Math.abs(b.x - selfX))
      nearest.length = Math.min(nearest.length, MAX_SHOWN)
      arrivals(nearest.length, now)
      keep.clear()
      for (const visitor of nearest) keep.add(visitor.pid)
      for (const entry of shown.values()) if (!keep.has(entry.pid)) forget(entry)
      if (layer) layer.domElement.hidden = nearest.length === 0
      if (nearest.length === 0) return

      const renderer = ensureLayer()
      const ratio = Math.min(2, window.devicePixelRatio)
      if (viewport.width !== size.width || viewport.height !== size.height || ratio !== size.ratio) {
        size = { width: viewport.width, height: viewport.height, ratio }
        renderer.setPixelRatio(ratio)
        renderer.setSize(viewport.width, viewport.height)
      }

      names.clear()
      clearRigLayer(renderer)
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
            pid: visitor.pid, kind: visitor.look.kind, rig: null,
            costume: visitor.look.costume, bow: visitor.look.bow,
            motion: createRigState(visitor.facing > 0 ? 'right' : 'left'), tag, bubble: bubbleFor(host), bubbleAt: -Infinity, bubbleWidth: 0,
            perch: sprite('visitor-perch'), helm: sprite('hall-carried'), cup: sprite('hall-carried'),
          }
          shown.set(visitor.pid, entry)
          load(entry)
        }
        if (visitor.look.kind !== entry.kind) {
          entry.kind = visitor.look.kind
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
        // Muted visitors still walk about; their messages just don't show.
        const said = visitor.said && !isMuted(visitor.pid) ? visitor.said : null
        const saidAge = said ? now - said.at : Infinity
        const hop = !reducedMotion && saidAge < HOP_MS ? Math.sin((Math.PI * saidAge) / HOP_MS) * heightPx * 0.08 : 0
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
        const showBubble = said !== null && saidAge < bubbleMs(said.text)
        entry.bubble.hidden = !showBubble
        if (showBubble && said) {
          if (entry.bubbleAt !== said.at) {
            entry.bubbleAt = said.at
            entry.bubble.textContent = said.text
            entry.bubble.style.animationDuration = `${bubbleMs(said.text)}ms`
            entry.bubble.classList.remove('visitor-bubble--pop')
            entry.bubbleWidth = entry.bubble.offsetWidth
            entry.bubble.classList.add('visitor-bubble--pop')
          }
          const bubbleX = insideScreen(screenX, entry.bubbleWidth, viewport.width)
          const tail = Math.max(14 - entry.bubbleWidth / 2, Math.min(entry.bubbleWidth / 2 - 14, screenX - bubbleX))
          entry.bubble.style.setProperty('--tail', `${tail.toFixed(1)}px`)
          entry.bubble.style.transform = `translate3d(${bubbleX.toFixed(1)}px, ${(headY - 34).toFixed(1)}px, 0) translate(-50%, -100%)`
        }
      }
    },

    showOwnMessage(text) {
      own?.bubble.remove()
      const bubble = bubbleFor(host)
      bubble.hidden = false
      bubble.textContent = text
      bubble.style.animationDuration = `${bubbleMs(text)}ms`
      bubble.classList.add('visitor-bubble--pop')
      own = { bubble, until: performance.now() + bubbleMs(text), width: bubble.offsetWidth }
      placeOwn()
    },

    announce(text) {
      announcer.textContent = text
    },

    dispose() {
      disposed = true
      own?.bubble.remove()
      for (const entry of shown.values()) forget(entry)
      announcer.remove()
      if (layer) {
        disposeRigLayer(layer)
        layer.domElement.remove()
      }
    },
  }
}
