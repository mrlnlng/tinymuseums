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
  private projected = new THREE.Vector3()

  constructor(private container: HTMLElement) {}

  sync(
    mounted: MountedDisplay[],
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    fadeOf: (index: number) => number,
  ): void {
    const seen = new Set<number>()
    const viewWidth = camera.right - camera.left
    // Keep the label locked to the plaque's painted width at any window size.
    const plaquePx = (CONFIG.plaque.width / viewWidth) * viewport.width

    for (const m of mounted) {
      seen.add(m.index)
      let node = this.nodes.get(m.index)

      if (!node) {
        node = document.createElement('div')
        node.className = 'placard'
        node.innerHTML = '<span class="placard-name"></span>'
        node.querySelector('.placard-name')!.textContent = m.display.artistName
        node.dataset.slug = m.display.slug
        this.container.appendChild(node)
        this.nodes.set(m.index, node)
      }

      this.projected.set(m.centerX, m.plaqueY, 0.03)
      this.projected.project(camera)

      if (this.projected.x < -1.7 || this.projected.x > 1.7) {
        node.style.opacity = '0'
        continue
      }

      const sx = viewport.left + (this.projected.x * 0.5 + 0.5) * viewport.width
      const sy = viewport.top + (-this.projected.y * 0.5 + 0.5) * viewport.height

      node.style.width = `${plaquePx * 0.84}px`
      node.style.fontSize = `${Math.max(7, plaquePx * 0.105)}px`
      node.style.transform = `translate3d(${sx.toFixed(1)}px, ${sy.toFixed(1)}px, 0) translate(-50%, -50%)`
      // Match the display's own fade-in rather than popping in ahead of it.
      node.style.opacity = String(fadeOf(m.index))
    }

    for (const [index, node] of this.nodes) {
      if (seen.has(index)) continue
      node.remove()
      this.nodes.delete(index)
    }
  }

  clear(): void {
    for (const node of this.nodes.values()) node.remove()
    this.nodes.clear()
  }
}
