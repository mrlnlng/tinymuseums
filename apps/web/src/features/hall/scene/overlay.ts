import * as THREE from 'three'
import { CONFIG } from './config'
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
