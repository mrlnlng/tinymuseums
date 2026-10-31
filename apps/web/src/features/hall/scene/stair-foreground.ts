import * as THREE from 'three'
import type { Viewport } from './overlay'

/** A foreground railing crosses the visitor only while they are on the stairs. */
export function createStairForeground(host: HTMLElement, flight: { left: number; base: number; width: number; height: number }) {
  const image = document.createElement('img')
  image.className = 'hall-stair-foreground'
  image.alt = ''
  image.hidden = true
  host.append(image)
  const point = new THREE.Vector3()
  return {
    sync(camera: THREE.OrthographicCamera, viewport: Viewport, onStairs: boolean) {
      image.hidden = !onStairs || !image.src
      if (image.hidden) return
      const scale = viewport.height / (camera.top - camera.bottom)
      point.set(flight.left, flight.base + flight.height, 0).project(camera)
      const left = (point.x * 0.5 + 0.5) * viewport.width
      const top = (-point.y * 0.5 + 0.5) * viewport.height
      image.style.width = `${flight.width * scale}px`
      image.style.height = `${flight.height * scale}px`
      image.style.transform = `translate3d(${left}px, ${top}px, 0)`
    },
    setSource(src: string) { image.src = src },
    dispose() { image.remove() },
  }
}
