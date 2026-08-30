import * as THREE from 'three'
import { CONFIG } from './config'
import type { MountedDisplay } from './scene'

export interface Viewport {
  width: number
  height: number
  left: number
  top: number
}

/**
 * The artist's name, sitting on the plaque beside their display.
 *
 * The plaque itself is a sprite in the scene; the text on it is real DOM —
 * selectable, translatable, and the surface a screen reader and a crawler
 * actually see. That split is the whole reason for the hybrid approach.
 *
 * Note how it updates: one imperative pass per frame writing transforms
 * straight onto element style. Routing this through a framework's render cycle
 * at sixty frames per second is what makes overlays visibly swim against the
 * geometry they belong to.
 */
export class Placards {
  private nodes = new Map<number, HTMLElement>()
  private titles = new Map<number, HTMLElement>()
  private projected = new THREE.Vector3()

  constructor(private container: HTMLElement) {}

  sync(
    mounted: MountedDisplay[],
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
  ): void {
    const seen = new Set<number>()
    const viewWidth = camera.right - camera.left
    // Keep the label locked to the plaque's painted width at any window size.
    const plaquePx = (CONFIG.plaque.width / viewWidth) * viewport.width
    // Sized from its own width, so the plaque can grow without dragging the
    // artist's name along with it.
    const titlePx = (CONFIG.plaque.titleWidth / viewWidth) * viewport.width

    for (const m of mounted) {
      seen.add(m.index)
      let node = this.nodes.get(m.index)

      if (!node) {
        node = document.createElement('div')
        node.className = 'placard'
        node.innerHTML = '<span class="placard-name"></span>'
        node.querySelector('.placard-name')!.textContent = m.display.statement
        node.dataset.slug = m.display.slug
        this.container.appendChild(node)
        this.nodes.set(m.index, node)
      }

      let title = this.titles.get(m.index)
      if (!title) {
        title = document.createElement('div')
        title.className = 'placard-title script'
        title.textContent = m.display.artistName
        this.container.appendChild(title)
        this.titles.set(m.index, title)
      }

      /*
       * Set small against the plaque so a whole statement fits on it.
       *
       * These run to about seventy characters, and at the old ratio that came
       * to nine lines on a label clamped to two — most of the sentence was cut
       * off mid-word. At this size the longest of them takes three.
       */
      this.place(node, m.centerX, m.plaqueY, camera, viewport, plaquePx * 0.84, Math.max(8, plaquePx * 0.068))

      // Its own width: wide enough for a name, and unaffected by the plaque.
      this.place(title, m.centerX, m.titleY, camera, viewport, titlePx, Math.max(11, titlePx * 0.121))
    }

    for (const map of [this.nodes, this.titles]) {
      for (const [index, node] of map) {
        if (seen.has(index)) continue
        node.remove()
        map.delete(index)
      }
    }
  }

  /**
   * Projects a world point and writes the result straight onto the element.
   *
   * Anything far enough off-screen is hidden rather than positioned: the
   * projection stays valid well outside the frustum, so without this the
   * browser keeps laying out labels nobody can see.
   */
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
