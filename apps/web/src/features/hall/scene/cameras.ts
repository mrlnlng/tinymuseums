import * as THREE from 'three'
import { CONFIG, centerYFor } from './config'

/* A single orthographic camera — flat 2D is the chosen direction, so no perspective or parallax. The height grows on tall phones to keep a minimum width on screen. */
export class CameraRig {
  readonly camera: THREE.OrthographicCamera

  /** The frustum height actually in use, which is >= CONFIG.world.viewHeight. */
  frustumHeight = CONFIG.world.viewHeight

  constructor(width: number, height: number) {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200)
    this.resize(width, height)
  }

  resize(width: number, height: number): void {
    const aspect = width / height
    const { viewHeight, minVisibleWidth } = CONFIG.world

    // Tall, narrow screens get a taller frustum so the hall stays wide enough.
    this.frustumHeight = Math.max(viewHeight, minVisibleWidth / aspect)

    const h = this.frustumHeight
    this.camera.left = (-h * aspect) / 2
    this.camera.right = (h * aspect) / 2
    this.camera.top = h / 2
    this.camera.bottom = -h / 2
    this.camera.updateProjectionMatrix()
  }

  /** Visible world width at the current aspect. */
  get viewWidth(): number {
    return this.camera.right - this.camera.left
  }

  sync(x: number): void {
    this.camera.position.set(x, centerYFor(this.frustumHeight), 24)
    this.camera.updateMatrixWorld()
  }
}
