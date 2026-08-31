import * as THREE from 'three'
import { CONFIG } from './config'
import type { MountedDisplay } from './scene'

export interface Viewport {
  width: number
  height: number
  left: number
  top: number
}

/* One placard per painting: the title above the plane, the statement on the plaque beneath it. The plaque is a scene sprite; the text on it is real DOM — selectable, readable, crawlable — updated in one imperative pass per frame, because routing it through a render cycle at 60fps makes overlays swim. */
export class Placards {
  private nodes = new Map<string, HTMLElement>()
  private titles = new Map<string, HTMLElement>()
  private projected = new THREE.Vector3()

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
        node.querySelector('.placard-name')!.textContent = m.display.statement
        node.dataset.slug = m.display.slug
        this.container.appendChild(node)
        this.nodes.set(key, node)
      }

      let title = this.titles.get(key)
      if (!title) {
        title = document.createElement('div')
        title.className = 'placard-title script'
        title.textContent = m.display.title
        this.container.appendChild(title)
        this.titles.set(key, title)
      }

      // Set small against the plaque so a whole statement fits on it.
      this.place(node, m.centerX, m.plaqueY, camera, viewport, plaquePx * 0.84, Math.max(8, plaquePx * 0.061))

      // Its own width: wide enough for a title, and unaffected by the plaque.
      this.place(title, m.centerX, m.titleY, camera, viewport, titlePx, Math.max(11, titlePx * 0.121))
    }

    for (const map of [this.nodes, this.titles]) {
      for (const [key, el] of map) {
        if (seen.has(key)) continue
        el.remove()
        map.delete(key)
      }
    }
  }

  /*  Projects a world point and writes the result straight onto the element. Anything far enough off-screen is hidden rather than positioned, so the browser never lays out labels nobody can see. */
  private place(
    node: HTMLElement,
    x: number,
    y: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    widthPx: number,
    fontSize: number,
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
    node.style.transform =
      `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`
    node.style.opacity = '1'
  }

  clear(): void {
    for (const node of this.nodes.values()) node.remove()
    for (const node of this.titles.values()) node.remove()
    this.nodes.clear()
    this.titles.clear()
  }
}
