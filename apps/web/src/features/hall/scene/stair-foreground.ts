import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { builtUrl } from '@/shared/lib/assets'
import { flightSize, type Flight } from './flights'
import type { Viewport } from './overlay'

/** A foreground railing crosses the visitor only while they are on the stairs. */
export function createStairForeground(host: HTMLElement, flight: Flight, floorEdge?: number) {
  const image = document.createElement('img')
  image.className = 'hall-stair-foreground'
  image.src = builtUrl(manifest.atelier.railing.src)
  image.alt = ''
  image.hidden = true
  host.append(image)
  const point = new THREE.Vector3()
  const { width, height } = flightSize(flight)
  return {
    sync(camera: THREE.OrthographicCamera, viewport: Viewport, onStairs: boolean) {
      image.hidden = !onStairs
      if (!onStairs) return
      const scale = viewport.height / (camera.top - camera.bottom)
      point.set(flight.left, flight.base + height, 0).project(camera)
      const left = (point.x * 0.5 + 0.5) * viewport.width
      const top = (-point.y * 0.5 + 0.5) * viewport.height
      image.style.width = `${width * scale}px`
      image.style.height = `${height * scale}px`
      image.style.transform = `translate3d(${left}px, ${top}px, 0)`
      if (floorEdge !== undefined) {
        const edge = (floorEdge - flight.left) / width * 100
        const floor = (flight.base + height) / height * 100
        image.style.clipPath = `polygon(0 0, 100% 0, 100% ${floor}%, ${edge}% ${floor}%, ${edge}% 100%, 0 100%)`
      }

    },
    setSource(src: string) { image.src = src },
    dispose() { image.remove() },
  }
}
