import * as THREE from 'three'
import type { WorldPoint } from './hit'
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
  toWorld(screenX: number, screenY: number, out?: WorldPoint): WorldPoint
}

const projected = new THREE.Vector3()
const unprojected = new THREE.Vector3()

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

  toWorld(screenX: number, screenY: number, out?: WorldPoint): WorldPoint {
    const ndcX = ((screenX - this.viewport.left) / this.viewport.width) * 2 - 1
    const ndcY = -((screenY - this.viewport.top) / this.viewport.height) * 2 + 1
    unprojected.set(ndcX, ndcY, 0).unproject(this.camera)
    const point = out ?? { x: 0, y: 0 }
    point.x = unprojected.x
    point.y = unprojected.y
    return point
  }
}
