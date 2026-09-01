import * as THREE from 'three'
import { CONFIG } from './config'
import type { LobbyMarks } from './lobby'
import type { MountedDisplay } from './scene'

export interface Viewport {
  width: number
  height: number
  left: number
  top: number
}

/* One placard per painting: the title above the plane, the work's description on the plaque beneath it. The plaque is a scene sprite; the text on it is real DOM — selectable, readable, crawlable — updated in one imperative pass per frame, because routing it through a render cycle at 60fps makes overlays swim. */
export class Placards {
  private nodes = new Map<string, HTMLElement>()
  private titles = new Map<string, HTMLElement>()
  private projected = new THREE.Vector3()
  /*  Rendered heights, kept up to date by the observer below. A bottom-hung label has to know how tall it grew before it can be kept on screen, and asking the element that inside the frame loop would force a layout per title per frame. */
  private heights = new WeakMap<HTMLElement, number>()

  /*  Watches the titles instead of measuring them: the height changes on a resize and again when the museum face arrives and the text rewraps, and both reach us here without the loop ever touching layout. */
  private sizes = new ResizeObserver((entries) => {
    for (const entry of entries) {
      this.heights.set(entry.target as HTMLElement, entry.contentRect.height)
    }
  })

  constructor(private container: HTMLElement) {}

  sync(
    mounted: MountedDisplay[],
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
  ): void {
    const seen = new Set<string>()
    const viewWidth = camera.right - camera.left
    // Locked to the plaque's painted width at any window size.
    const plaquePx = (CONFIG.plaque.width / viewWidth) * viewport.width
    // Sized from its own width, so the plaque can grow without dragging the
    // painting's title along with it.
    const titlePx = (CONFIG.plaque.titleWidth / viewWidth) * viewport.width

    for (const m of mounted) {
      const key = `${m.index}`
      seen.add(key)
      let node = this.nodes.get(key)

      if (!node) {
        node = document.createElement('div')
        node.className = 'placard'
        node.innerHTML = '<span class="placard-name"></span>'
        node.querySelector('.placard-name')!.textContent = m.display.description
        node.dataset.slug = m.display.slug
        this.container.appendChild(node)
        this.nodes.set(key, node)
      }

      let title = this.titles.get(key)
      if (!title) {
        title = document.createElement('div')
        title.className = 'placard-title script'
        this.sizes.observe(title)
        title.textContent = m.display.title
        this.container.appendChild(title)
        this.titles.set(key, title)
      }

      // Teeny tiny against the brass, so a whole description fits on it; what
      // still will not fit is ellipsed, because the plaque is a label and the
      // artist's page is where the long version lives.
      this.place(node, m.centerX, m.plaqueY, camera, viewport, plaquePx * 0.86, Math.max(7, plaquePx * 0.058), 'center')

      /* Its own width: wide enough for a title, and unaffected by the plaque. Hung by its lower edge — the title is never trimmed, so it must grow upward into the empty wall rather than down onto the painting. */
      this.place(title, m.centerX, m.titleY, camera, viewport, titlePx, Math.max(12, titlePx * 0.069), 'bottom')
    }

    for (const map of [this.nodes, this.titles]) {
      for (const [key, el] of map) {
        if (seen.has(key)) continue
        // The observer holds its targets, so walking the hall would accumulate
        // one dead title per wall passed without this.
        this.sizes.unobserve(el)
        el.remove()
        map.delete(key)
      }
    }
  }

  /*  Projects a world point and writes the result straight onto the element. Anything far enough off-screen is hidden rather than positioned, so the browser never lays out labels nobody can see. `anchor` picks which edge of the element the world point pins: 'center' for a label that sits on its mark, 'bottom' for one that hangs from it and grows upward. */
  private place(
    node: HTMLElement,
    x: number,
    y: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    widthPx: number,
    fontSize: number,
    anchor: 'center' | 'bottom',
  ): void {
    this.projected.set(x, y, 0.03)
    this.projected.project(camera)

    if (this.projected.x < -1.7 || this.projected.x > 1.7) {
      node.style.opacity = '0'
      return
    }

    const sx = viewport.left + (this.projected.x * 0.5 + 0.5) * viewport.width
    const sy = viewport.top + (-this.projected.y * 0.5 + 0.5) * viewport.height

    node.style.width = `${widthPx}px`
    node.style.fontSize = `${fontSize}px`

    let screenY = sy
    if (anchor === 'bottom') {
      // A title long enough to need several lines grows up the wall, and a very
      // long one would grow off the top of it. Pushing it back down costs a
      // little of the painting's top edge, which is cheaper than losing words.
      const height = this.heights.get(node) ?? node.offsetHeight
      screenY = Math.max(screenY, viewport.top + height + 4)
    }

    node.style.transform =
      `translate3d(${sx.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) translate(-50%, ${anchor === 'bottom' ? '-100%' : '-50%'})`
    node.style.opacity = '1'
  }

  clear(): void {
    this.sizes.disconnect()
    for (const node of this.nodes.values()) node.remove()
    for (const node of this.titles.values()) node.remove()
    this.nodes.clear()
    this.titles.clear()
  }
}

/* The words in the visitor centre — the board over the door, the way-finder, and the button on the help booth's counter. Painted wood is a texture in the scene; the writing on it is DOM here, for the same reasons the plaques are: it is selectable, readable to a screen reader, and it stays sharp at any zoom. The button is the one node in this layer that takes a pointer, since the layer itself does not. */
export class LobbySigns {
  private sign = document.createElement('div')
  private direction = document.createElement('div')
  private help = document.createElement('button')
  private projected = new THREE.Vector3()

  constructor(
    container: HTMLElement,
    private marks: LobbyMarks,
    onOpenHelp: () => void,
  ) {
    this.sign.className = 'lobby-sign'
    this.sign.textContent = 'Visitor Center'

    this.direction.className = 'lobby-direction'
    // The arrow is a glyph rather than an image: it is a word here, not an
    // icon, and it must wrap and scale with the line it belongs to.
    this.direction.innerHTML = '<span>To Exhibition</span><span aria-hidden="true">\u2192</span>'

    this.help.type = 'button'
    this.help.className = 'lobby-help-button'
    this.help.textContent = 'View help guide'
    this.help.addEventListener('click', onOpenHelp)

    for (const node of [this.sign, this.direction, this.help]) container.appendChild(node)
  }

  sync(camera: THREE.OrthographicCamera, viewport: Viewport): void {
    const viewWidth = camera.right - camera.left
    const perUnit = viewport.width / viewWidth

    this.place(this.sign, this.marks.sign, perUnit, camera, viewport, 0.12)
    this.place(this.direction, this.marks.direction, perUnit, camera, viewport, 0.136)

    // The button is the one node here that takes a pointer, and only while it
    // is actually on screen — an invisible one parked off the left edge would
    // still swallow the drag that scrolls the hall.
    const onScreen = this.place(this.help, this.marks.help, perUnit, camera, viewport, 0.089)
    this.help.style.pointerEvents = onScreen ? 'auto' : 'none'
    // The pill is drawn by this element rather than by the booth's art, which
    // has only an empty counter behind it, so it needs a real height.
    this.help.style.height = `${(this.marks.help.height * perUnit).toFixed(1)}px`
  }

  /*  Centred on its mark and sized in world units, so a sign occupies the same
      part of the board it is written on at every screen size. Anything far
      enough off-screen is hidden rather than positioned — the visitor centre
      is behind you for most of a visit, and its three signs should not cost a
      layout per frame for the whole walk. */
  private place(
    node: HTMLElement,
    mark: { x: number; y: number; width: number },
    perUnit: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    fontRatio: number,
  ): boolean {
    this.projected.set(mark.x, mark.y, 0.03)
    this.projected.project(camera)

    if (this.projected.x < -1.7 || this.projected.x > 1.7) {
      node.style.opacity = '0'
      return false
    }

    const widthPx = mark.width * perUnit
    node.style.width = `${widthPx.toFixed(1)}px`
    node.style.fontSize = `${Math.max(8, widthPx * fontRatio).toFixed(1)}px`
    node.style.transform =
      `translate3d(${(viewport.left + (this.projected.x * 0.5 + 0.5) * viewport.width).toFixed(1)}px, ` +
      `${(viewport.top + (-this.projected.y * 0.5 + 0.5) * viewport.height).toFixed(1)}px, 0)` +
      ' translate(-50%, -50%)'
    node.style.opacity = '1'
    return true
  }

  clear(): void {
    for (const node of [this.sign, this.direction, this.help]) node.remove()
  }
}
