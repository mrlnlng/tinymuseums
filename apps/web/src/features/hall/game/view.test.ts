import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as THREE from 'three'
import { CONFIG, centerYFor } from '../scene/config.ts'
import type { Viewport } from '../scene/overlay.ts'
import { computeView, fromPhaser, phaserCamera, PPU, toPhaser, ViewProjector } from './view.ts'

// projector.ts cannot be imported under `node --test` (Node's strip-only mode rejects
// its constructor parameter properties), so this reference mirrors its toScreen/toWorld
// source verbatim, driving the real Three.js camera through project/unproject.
class ReferenceProjector {
  readonly viewWidth: number
  readonly viewHeight: number
  readonly pxPerUnit: number
  readonly viewport: Viewport

  private readonly camera: THREE.OrthographicCamera

  constructor(camera: THREE.OrthographicCamera, viewport: Viewport) {
    this.camera = camera
    this.viewport = viewport
    this.viewWidth = camera.right - camera.left
    this.viewHeight = camera.top - camera.bottom
    this.pxPerUnit = viewport.width / this.viewWidth
  }

  toScreen(x: number, y: number): { x: number; y: number } {
    const projected = new THREE.Vector3(x, y, 0).project(this.camera)
    return {
      x: this.viewport.left + (projected.x * 0.5 + 0.5) * this.viewport.width,
      y: this.viewport.top + (-projected.y * 0.5 + 0.5) * this.viewport.height,
    }
  }

  toWorld(screenX: number, screenY: number): { x: number; y: number } {
    const ndcX = ((screenX - this.viewport.left) / this.viewport.width) * 2 - 1
    const ndcY = -((screenY - this.viewport.top) / this.viewport.height) * 2 + 1
    const unprojected = new THREE.Vector3(ndcX, ndcY, 0).unproject(this.camera)
    return { x: unprojected.x, y: unprojected.y }
  }
}

function referenceCamera(width: number, height: number, x: number): THREE.OrthographicCamera {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200)
  const aspect = width / height
  const { viewHeight, minVisibleWidth } = CONFIG.world
  const frustumHeight = Math.max(viewHeight, minVisibleWidth / aspect)
  const h = frustumHeight

  camera.left = (-h * aspect) / 2
  camera.right = (h * aspect) / 2
  camera.top = h / 2
  camera.bottom = -h / 2
  camera.updateProjectionMatrix()

  camera.position.set(x, centerYFor(frustumHeight), 24)
  camera.updateMatrixWorld()

  return camera
}

const SIZES: Array<[number, number]> = []
for (let w = 280; w <= 1400; w += 37) {
  for (let h = 400; h <= 1300; h += 53) SIZES.push([w, h])
}
SIZES.push([390, 844], [430, 764], [1170, 2532])

const CAMERA_XS = [0, 3.3, 57.25]

const WORLD_YS = [-3.2, -1.1, 0, 0.7, 1.85, 3.4]

function worldXs(cameraX: number): number[] {
  return [cameraX - 5, cameraX - 2.75, cameraX - 0.5, cameraX, cameraX + 1.5, cameraX + 4.25]
}

function viewports(width: number, height: number): Viewport[] {
  return [
    { width, height, left: 0, top: 0 },
    { width, height, left: 13.5, top: 27.25 },
  ]
}

function close(actual: number, expected: number, limit: number, message: string): void {
  assert.ok(Math.abs(actual - expected) <= limit, `${message}: ${actual} vs ${expected}`)
}

test('computeView matches CameraRig.resize for every viewport size', () => {
  for (const [width, height] of SIZES) {
    const view = computeView(width, height)
    const camera = referenceCamera(width, height, 0)
    const where = `${width}x${height}`
    close(view.frustumHeight, camera.top - camera.bottom, 1e-12, `frustumHeight ${where}`)
    close(view.viewWidth, camera.right - camera.left, 1e-12, `viewWidth ${where}`)
    close(view.pxPerUnit, width / (camera.right - camera.left), 1e-12, `pxPerUnit ${where}`)
    close(view.centerY, centerYFor(view.frustumHeight), 1e-12, `centerY ${where}`)
  }
})

test('ViewProjector fields match the Three.js reference', () => {
  for (const [width, height] of SIZES) {
    const view = computeView(width, height)
    for (const cameraX of CAMERA_XS) {
      const camera = referenceCamera(width, height, cameraX)
      for (const viewport of viewports(width, height)) {
        const reference = new ReferenceProjector(camera, viewport)
        const projector = new ViewProjector(cameraX, view, viewport)
        const where = `${width}x${height} @${cameraX} left ${viewport.left}`
        close(projector.viewWidth, reference.viewWidth, 1e-12, `viewWidth ${where}`)
        close(projector.viewHeight, reference.viewHeight, 1e-12, `viewHeight ${where}`)
        close(projector.pxPerUnit, reference.pxPerUnit, 1e-12, `pxPerUnit ${where}`)
      }
    }
  }
})

test('ViewProjector.toScreen matches the Three.js reference within 1e-9 px', () => {
  for (const [width, height] of SIZES) {
    const view = computeView(width, height)
    for (const cameraX of CAMERA_XS) {
      const camera = referenceCamera(width, height, cameraX)
      for (const viewport of viewports(width, height)) {
        const reference = new ReferenceProjector(camera, viewport)
        const projector = new ViewProjector(cameraX, view, viewport)
        for (const x of worldXs(cameraX)) {
          for (const y of WORLD_YS) {
            const expected = reference.toScreen(x, y)
            const actual = projector.toScreen(x, y)
            const where = `${width}x${height} @${cameraX} world ${x},${y}`
            close(actual.x, expected.x, 1e-9, `toScreen.x ${where}`)
            close(actual.y, expected.y, 1e-9, `toScreen.y ${where}`)
          }
        }
      }
    }
  }
})

test('ViewProjector.toWorld round-trips and matches the Three.js reference within 1e-9', () => {
  for (const [width, height] of SIZES) {
    const view = computeView(width, height)
    for (const cameraX of CAMERA_XS) {
      const camera = referenceCamera(width, height, cameraX)
      for (const viewport of viewports(width, height)) {
        const reference = new ReferenceProjector(camera, viewport)
        const projector = new ViewProjector(cameraX, view, viewport)

        for (const x of worldXs(cameraX)) {
          for (const y of WORLD_YS) {
            const at = projector.toScreen(x, y)
            const back = projector.toWorld(at.x, at.y)
            const where = `${width}x${height} @${cameraX} world ${x},${y}`
            close(back.x, x, 1e-9, `toWorld round-trip x ${where}`)
            close(back.y, y, 1e-9, `toWorld round-trip y ${where}`)
          }
        }

        for (const fx of [0, 0.25, 0.5, 0.75, 1]) {
          for (const fy of [0, 0.25, 0.5, 0.75, 1]) {
            const screenX = viewport.left + fx * viewport.width
            const screenY = viewport.top + fy * viewport.height
            const expected = reference.toWorld(screenX, screenY)
            const actual = projector.toWorld(screenX, screenY)
            const where = `${width}x${height} @${cameraX} screen ${screenX},${screenY}`
            close(actual.x, expected.x, 1e-9, `toWorld.x ${where}`)
            close(actual.y, expected.y, 1e-9, `toWorld.y ${where}`)
          }
        }
      }
    }
  }
})

test('phaserCamera maps a world point to the same canvas pixel as the projector', () => {
  for (const [width, height] of SIZES) {
    const view = computeView(width, height)
    for (const cameraX of CAMERA_XS) {
      const camera = referenceCamera(width, height, cameraX)
      for (const viewport of viewports(width, height)) {
        const reference = new ReferenceProjector(camera, viewport)
        const projector = new ViewProjector(cameraX, view, viewport)
        for (const density of [1, 2, 3]) {
          const cam = phaserCamera(cameraX, view, density)
          for (const x of worldXs(cameraX)) {
            for (const y of WORLD_YS) {
              const at = projector.toScreen(x, y)
              const { x: px, y: py } = toPhaser(x, y)
              const canvasX = (px - cam.scrollX) * cam.zoom
              const canvasY = (py - cam.scrollY) * cam.zoom
              const where = `${width}x${height} @${cameraX} d${density} world ${x},${y}`
              close(canvasX / density, at.x - viewport.left, 1e-9, `phaser x ${where}`)
              close(canvasY / density, at.y - viewport.top, 1e-9, `phaser y ${where}`)
            }
          }
        }
      }
    }
  }
})

test('toPhaser and fromPhaser round-trip', () => {
  for (const x of [-57.25, -0.5, 0, 3.3, 117.75]) {
    for (const y of [-3.2, 0, 0.7, 4.25]) {
      const back = fromPhaser(toPhaser(x, y).x, toPhaser(x, y).y)
      close(back.x, x, 1e-12, `fromPhaser x ${x},${y}`)
      close(back.y, y, 1e-12, `fromPhaser y ${x},${y}`)
    }
  }
})
