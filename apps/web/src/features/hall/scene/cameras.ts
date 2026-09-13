import * as THREE from 'three'
import { CONFIG, centerYFor } from './config'

export class CameraRig {
  readonly camera: THREE.OrthographicCamera

  frustumHeight = CONFIG.world.viewHeight

  constructor(width: number, height: number) {
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200)
    this.resize(width, height)
  }

  resize(width: number, height: number): void {
    const aspect = width / height
    const { viewHeight, minVisibleWidth } = CONFIG.world

    this.frustumHeight = Math.max(viewHeight, minVisibleWidth / aspect)

    const h = this.frustumHeight
    this.camera.left = (-h * aspect) / 2
    this.camera.right = (h * aspect) / 2
    this.camera.top = h / 2
    this.camera.bottom = -h / 2
    this.camera.updateProjectionMatrix()
  }

  get viewWidth(): number {
    return this.camera.right - this.camera.left
  }

  sync(x: number): void {
    this.camera.position.set(x, centerYFor(this.frustumHeight), 24)
    this.camera.updateMatrixWorld()
  }
}
