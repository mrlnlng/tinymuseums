import * as THREE from 'three'
import { CONFIG, viewCenterY } from './config'

/**
 * A single orthographic camera. Flat 2D is the chosen direction, so there is
 * no perspective mode and no parallax rig to switch between.
 *
 * The camera's vertical centre is derived from where the wall meets the floor
 * in the mockups, so the hall's proportions hold at any window size.
 */
export class CameraRig {
  readonly camera: THREE.OrthographicCamera

  constructor(width: number, height: number) {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200)
    this.resize(width, height)
  }

  resize(width: number, height: number): void {
    const aspect = width / height
    const h = CONFIG.world.viewHeight
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
    this.camera.position.set(x, viewCenterY(), 24)
    this.camera.updateMatrixWorld()
  }
}
