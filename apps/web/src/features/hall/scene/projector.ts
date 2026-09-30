import * as THREE from 'three'
import type { Viewport } from './overlay'

export interface ScreenPoint {
  x: number
  y: number
}

export interface Projector {
  readonly viewport: Viewport
  readonly viewWidth: number
  readonly viewHeight: number
  readonly pxPerUnit: number
  toScreen(x: number, y: number, out?: ScreenPoint): ScreenPoint
}

const projected = new THREE.Vector3()

export class OrthographicProjector implements Projector {
  readonly viewWidth: number
  readonly viewHeight: number
  readonly pxPerUnit: number

  constructor(
    private readonly camera: THREE.OrthographicCamera,
    readonly viewport: Viewport,
  ) {
    this.viewWidth = camera.right - camera.left
    this.viewHeight = camera.top - camera.bottom
    this.pxPerUnit = viewport.width / this.viewWidth
  }

  toScreen(x: number, y: number, out?: ScreenPoint): ScreenPoint {
    projected.set(x, y, 0)
    projected.project(this.camera)
    const point = out ?? { x: 0, y: 0 }
    point.x = this.viewport.left + (projected.x * 0.5 + 0.5) * this.viewport.width
    point.y = this.viewport.top + (-projected.y * 0.5 + 0.5) * this.viewport.height
    return point
  }
}
