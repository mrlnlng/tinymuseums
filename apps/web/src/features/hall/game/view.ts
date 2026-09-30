import { CONFIG, centerYFor } from '../scene/config.ts'
import type { WorldPoint } from '../scene/hit.ts'
import type { Viewport } from '../scene/overlay.ts'
import type { Projector, ScreenPoint } from '../scene/projector.ts'

export const PPU = 100

export interface View {
  frustumHeight: number
  viewWidth: number
  pxPerUnit: number
  centerY: number
}

export function computeView(cssWidth: number, cssHeight: number): View {
  const aspect = cssWidth / cssHeight
  const { viewHeight, minVisibleWidth } = CONFIG.world
  const frustumHeight = Math.max(viewHeight, minVisibleWidth / aspect)
  const viewWidth = (frustumHeight * aspect) / 2 - (-frustumHeight * aspect) / 2

  return {
    frustumHeight,
    viewWidth,
    pxPerUnit: cssWidth / viewWidth,
    centerY: centerYFor(frustumHeight),
  }
}

export class ViewProjector implements Projector {
  readonly viewWidth: number
  readonly viewHeight: number
  readonly pxPerUnit: number
  readonly viewport: Viewport

  private readonly cameraX: number
  private readonly centerY: number

  constructor(cameraX: number, view: View, viewport: Viewport) {
    this.cameraX = cameraX
    this.centerY = view.centerY
    this.viewWidth = view.viewWidth
    this.viewHeight = view.frustumHeight
    this.pxPerUnit = viewport.width / view.viewWidth
    this.viewport = viewport
  }

  toScreen(x: number, y: number, out?: ScreenPoint): ScreenPoint {
    const point = out ?? { x: 0, y: 0 }
    point.x = this.viewport.left + this.viewport.width * (0.5 + (x - this.cameraX) / this.viewWidth)
    point.y =
      this.viewport.top + this.viewport.height * (0.5 - (y - this.centerY) / this.viewHeight)
    return point
  }

  toWorld(screenX: number, screenY: number, out?: WorldPoint): WorldPoint {
    const point = out ?? { x: 0, y: 0 }
    const ndcX = ((screenX - this.viewport.left) / this.viewport.width) * 2 - 1
    const ndcY = -((screenY - this.viewport.top) / this.viewport.height) * 2 + 1
    point.x = this.cameraX + ndcX * (this.viewWidth / 2)
    point.y = this.centerY + ndcY * (this.viewHeight / 2)
    return point
  }
}

export function phaserCamera(
  cameraX: number,
  view: View,
  density: number,
): { zoom: number; scrollX: number; scrollY: number } {
  return {
    zoom: (density * view.pxPerUnit) / PPU,
    scrollX: (cameraX - view.viewWidth / 2) * PPU,
    scrollY: -(view.centerY + view.frustumHeight / 2) * PPU,
  }
}

export function toPhaser(x: number, y: number): { x: number; y: number } {
  return { x: x * PPU, y: -y * PPU }
}

export function fromPhaser(px: number, py: number): { x: number; y: number } {
  return { x: px / PPU, y: -py / PPU }
}
