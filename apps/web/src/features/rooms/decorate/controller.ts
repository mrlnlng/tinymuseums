import * as THREE from 'three'
import type { Placement } from '@tiny/core/rooms'
import type { Character } from '@/features/hall/scene/character'
import { centerYFor } from '@/features/hall/scene/config'
import type { Traversal } from '@/features/hall/scene/traversal'
import type { GhostOptions, PlacementLayer } from '../themes/cozy'

export interface DecorLive {
  camera: THREE.OrthographicCamera
  canvas: HTMLCanvasElement
  layer: PlacementLayer
  traversal: Traversal
  character: Character
  minX: number
  maxX: number
  onPlacements?(placements: Placement[]): void
}

export interface ScreenBox {
  left: number
  top: number
  bottom: number
}

export interface DecorController {
  attach(live: DecorLive): void
  detach(): void
  isLive(): boolean
  isEditing(): boolean
  /** Edit mode lifts the floor clear of the drawer, which covers this share of the frame's height. */
  setEditing(editing: boolean, drawerShare?: number): void
  tick(now: number, dt: number): void
  rise(): number
  setPlacements(placements: Placement[]): void
  pick(clientX: number, clientY: number): Placement | null
  worldXAt(clientX: number): number
  worldYAt(clientY: number): number
  panBy(dxPixels: number): void
  /** Glides the view to centre on a world x. */
  panTo(x: number): void
  /** The world x range the view shows now. */
  viewRange(): { left: number; right: number } | null
  ghost(placement: Placement | null, options?: GhostOptions): void
  highlight(zone: string | null, valid: boolean): void
  select(id: string | null): void
  hide(id: string | null): void
  bounce(id: string): void
  setCharacterOpacity(opacity: number): void
  /** Where a placement is drawn, in pixels from the canvas's top left. */
  screenBox(id: string): ScreenBox | null
  /** A world point in pixels from the canvas's top left. */
  screenPoint(x: number, y: number): { left: number; top: number } | null
  /** The world x at the middle of the view. */
  centerX(): number
}

/** The lowest thing on the floor, the carpet's front edge, sits about here. */
const FLOOR_FRONT_Y = -0.95
const GAP_ABOVE_DRAWER = 0.05

export function createDecorController(): DecorController {
  let live: DecorLive | null = null
  let placements: Placement[] | null = null
  let opacity: number | null = null
  let editing = false
  let drawerShare = 0
  let rise = 0
  /** After decorating, the view glides back to the character before the leash comes back on. */
  let returning = false
  let glideTo: number | null = null
  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  function canvasRect(): DOMRect | null {
    return live ? live.canvas.getBoundingClientRect() : null
  }

  function targetRise(): number {
    if (!live || !editing) return 0
    const height = live.camera.top - live.camera.bottom
    const share = 1 - drawerShare - GAP_ABOVE_DRAWER
    // Put the floor's front edge at `share` of the way down the frame.
    const center = FLOOR_FRONT_Y + share * height - height / 2
    return Math.min(0, center - centerYFor(height))
  }

  function toScreen(x: number, y: number): { left: number; top: number } | null {
    const rect = canvasRect()
    if (!live || !rect || rect.width <= 0 || rect.height <= 0) return null
    const camera = live.camera
    const halfWidth = (camera.right - camera.left) / 2
    const halfHeight = (camera.top - camera.bottom) / 2
    if (halfWidth === 0 || halfHeight === 0) return null
    const ndcX = (x - camera.position.x) / halfWidth
    const ndcY = (y - camera.position.y) / halfHeight
    return { left: ((ndcX + 1) / 2) * rect.width, top: ((1 - ndcY) / 2) * rect.height }
  }

  return {
    attach(next) {
      live = next
      if (placements) {
        next.layer.set(placements)
        next.onPlacements?.(placements)
      }
      if (opacity !== null) next.character.setOpacity(opacity)
    },

    detach() {
      if (live) {
        live.layer.ghost(null)
        live.layer.highlight(null, true)
        live.layer.select(null)
        live.layer.hide(null)
        live.character.setOpacity(1)
        live.traversal.setLeashed(true)
      }
      live = null
      editing = false
      returning = false
      glideTo = null
      rise = 0
    },

    isLive() {
      return live !== null
    },

    isEditing() {
      return editing
    },

    setEditing(next, share = 0) {
      if (next && !editing) {
        returning = false
        live?.traversal.setLeashed(false)
      } else if (!next && editing) {
        returning = true
        glideTo = null
      }
      editing = next
      drawerShare = Math.max(0, Math.min(0.6, share))
    },

    tick(_now, dt) {
      const target = targetRise()
      rise += (target - rise) * Math.min(1, dt * 7)
      if (Math.abs(target - rise) < 0.001) rise = target
      if (glideTo !== null && live) {
        const gap = glideTo - live.traversal.cameraX
        live.traversal.velocity = 0
        if (Math.abs(gap) < 0.02) {
          live.traversal.cameraX = glideTo
          glideTo = null
        } else {
          live.traversal.cameraX += gap * Math.min(1, dt * 6)
        }
      }
      if (returning && live) {
        const traversal = live.traversal
        const gap = traversal.x - traversal.cameraX
        if (Math.abs(gap) < 0.02) {
          traversal.cameraX = traversal.x
          traversal.setLeashed(true)
          returning = false
        } else {
          traversal.cameraX += gap * Math.min(1, dt * 5)
          traversal.velocity = 0
        }
      }
    },

    rise() {
      return rise
    },

    setPlacements(next) {
      placements = next
      live?.layer.set(next)
      live?.onPlacements?.(next)
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

    worldYAt(clientY) {
      if (!live) return 0
      const rect = canvasRect()
      if (!rect || rect.height <= 0) return live.camera.position.y
      const ndc = -(((clientY - rect.top) / rect.height) * 2 - 1)
      return live.camera.position.y + (ndc * (live.camera.top - live.camera.bottom)) / 2
    },

    panBy(dxPixels) {
      const rect = canvasRect()
      if (!live || !rect || rect.width <= 0 || dxPixels === 0) return
      const step = dxPixels * ((live.camera.right - live.camera.left) / rect.width)
      const next = Math.min(live.maxX, Math.max(live.minX, live.traversal.cameraX - step))
      live.traversal.cameraX = next
      live.traversal.velocity = 0
      glideTo = null
    },

    panTo(x) {
      if (!live) return
      glideTo = Math.min(live.maxX, Math.max(live.minX, x))
    },

    viewRange() {
      if (!live) return null
      const half = (live.camera.right - live.camera.left) / 2
      return { left: live.camera.position.x - half, right: live.camera.position.x + half }
    },

    ghost(placement, options) {
      live?.layer.ghost(placement, options)
    },

    highlight(zone, valid) {
      live?.layer.highlight(zone, valid)
    },

    select(id) {
      live?.layer.select(id)
    },

    hide(id) {
      live?.layer.hide(id)
    },

    bounce(id) {
      live?.layer.bounce(id)
    },

    setCharacterOpacity(value) {
      opacity = value
      live?.character.setOpacity(value)
    },

    screenBox(id) {
      const bounds = live?.layer.bounds(id)
      if (!bounds) return null
      const top = toScreen(bounds.x, bounds.top)
      const bottom = toScreen(bounds.x, bounds.bottom)
      if (!top || !bottom) return null
      return { left: top.left, top: top.top, bottom: bottom.top }
    },

    screenPoint(x, y) {
      return toScreen(x, y)
    },

    centerX() {
      return live ? live.camera.position.x : 0
    },
  }
}
