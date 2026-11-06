import * as THREE from 'three'
import type { Placement } from '@tiny/core'
import type { Character } from '@/features/hall/scene/character'
import type { Traversal } from '@/features/hall/scene/traversal'
import { cozyZoneAnchor, type PlacementLayer } from '../themes/cozy'

export interface DecorLive {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  canvas: HTMLCanvasElement
  layer: PlacementLayer
  traversal: Traversal
  character: Character
  minX: number
  maxX: number
}

export interface ScreenPoint {
  left: number
  top: number
}

export interface DecorController {
  attach(live: DecorLive): void
  detach(): void
  isLive(): boolean
  setPlacements(placements: Placement[]): void
  pick(clientX: number, clientY: number): Placement | null
  worldXAt(clientX: number): number
  panBy(dxPixels: number): void
  ghost(placement: Placement | null): void
  highlight(zone: string | null, valid: boolean): void
  setCharacterOpacity(opacity: number): void
  screenPointAt(x: number, zone: string): ScreenPoint | null
}

export function createDecorController(): DecorController {
  let live: DecorLive | null = null
  let placements: Placement[] | null = null
  let opacity: number | null = null
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function canvasRect(): DOMRect | null {
    return live ? live.canvas.getBoundingClientRect() : null
  }

  function worldPixel(): number {
    const rect = canvasRect()
    if (!live || !rect || rect.width <= 0) return 0
    return (live.camera.right - live.camera.left) / rect.width
  }

  return {
    attach(next) {
      live = next
      if (placements) next.layer.set(placements)
      if (opacity !== null) next.character.setOpacity(opacity)
    },

    detach() {
      if (live) {
        live.layer.ghost(null)
        live.layer.highlight(null, true)
        live.character.setOpacity(1)
      }
      live = null
    },

    isLive() {
      return live !== null
    },

    setPlacements(next) {
      placements = next
      live?.layer.set(next)
    },

    pick(clientX, clientY) {
      if (!live) return null
      const rect = canvasRect()
      if (!rect || rect.width <= 0 || rect.height <= 0) return null
      pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
      live.camera.updateMatrixWorld()
      raycaster.setFromCamera(pointer, live.camera)
      return live.layer.pick(raycaster)
    },

    worldXAt(clientX) {
      if (!live) return 0
      const rect = canvasRect()
      if (!rect || rect.width <= 0) return live.camera.position.x
      const ndc = ((clientX - rect.left) / rect.width) * 2 - 1
      return live.camera.position.x + (ndc * (live.camera.right - live.camera.left)) / 2
    },

    panBy(dxPixels) {
      if (!live || dxPixels === 0) return
      const step = dxPixels * worldPixel()
      const next = Math.min(live.maxX, Math.max(live.minX, live.traversal.cameraX - step))
      live.traversal.cameraX = next
      live.traversal.velocity = 0
      live.camera.position.x = next
      live.camera.updateMatrixWorld()
    },

    ghost(placement) {
      live?.layer.ghost(placement)
    },

    highlight(zone, valid) {
      live?.layer.highlight(zone, valid)
    },

    setCharacterOpacity(value) {
      opacity = value
      live?.character.setOpacity(value)
    },

    screenPointAt(x, zone) {
      if (!live) return null
      const rect = canvasRect()
      if (!rect || rect.width <= 0 || rect.height <= 0) return null
      const camera = live.camera
      const halfWidth = (camera.right - camera.left) / 2
      const halfHeight = (camera.top - camera.bottom) / 2
      if (halfWidth === 0 || halfHeight === 0) return null
      const ndcX = (x - camera.position.x) / halfWidth
      const ndcY = (cozyZoneAnchor(zone) - camera.position.y) / halfHeight
      return {
        left: ((ndcX + 1) / 2) * rect.width,
        top: ((1 - ndcY) / 2) * rect.height,
      }
    },
  }
}
