import type { LayoutName, Placement } from './types.ts'

/**
 * Layout templates.
 *
 * The artist picks which works hang and which template arranges them; the
 * server composes from that. A full drag-and-place composer would produce the
 * same `Placement[]`, so it becomes an upgrade to this data rather than a
 * rewrite of it.
 *
 * Canvas sizes are world units — the same units the hall renderer uses, so a
 * display's physical size on the wall is decided here and nowhere else.
 */

/**
 * The frame image's drawn aspect — frame.png is 1480 x 2091 in the current
 * asset pack. Must match `frame.size` in packages/core/assets/manifest.json:
 * a previous hardcoded value (2550 / 3300) went stale when the art was
 * replaced, and the compositor stretched every frame to the old ratio.
 */
export const FRAME_ASPECT = 1480 / 2091

export interface LayoutSpec {
  name: LayoutName
  label: string
  capacity: number
  canvas: { w: number; h: number }
  /** Frame height as a fraction of canvas height. */
  frameHeight: number
}

export const LAYOUTS: Record<LayoutName, LayoutSpec> = {
  single: { name: 'single', label: 'One work, centred', capacity: 1, canvas: { w: 2.9, h: 3.2 }, frameHeight: 0.88 },
  pair: { name: 'pair', label: 'Two, side by side', capacity: 2, canvas: { w: 4.4, h: 3.2 }, frameHeight: 0.74 },
  trio: { name: 'trio', label: 'Three, salon hang', capacity: 3, canvas: { w: 5.9, h: 3.2 }, frameHeight: 0.62 },
  quad: { name: 'quad', label: 'Four, salon hang', capacity: 4, canvas: { w: 7.4, h: 3.2 }, frameHeight: 0.56 },
}

export const LAYOUT_NAMES = Object.keys(LAYOUTS) as LayoutName[]

export function isLayoutName(value: string): value is LayoutName {
  return value in LAYOUTS
}

/**
 * Salon hangs are never perfectly level. These offsets are fixed rather than
 * random so a republish of the same composition produces the same image.
 */
const VERTICAL_OFFSETS: Record<LayoutName, number[]> = {
  single: [0],
  pair: [-0.018, 0.018],
  trio: [0.022, -0.026, 0.014],
  quad: [-0.02, 0.016, -0.012, 0.022],
}

export function composeLayout(layout: LayoutName, pieceIds: string[]): Placement[] {
  const spec = LAYOUTS[layout]
  const used = pieceIds.slice(0, spec.capacity)
  if (used.length === 0) return []

  const h = spec.frameHeight
  // Frame width in canvas-normalised terms, preserving the asset's aspect.
  const w = (h * spec.canvas.h * FRAME_ASPECT) / spec.canvas.w

  const gap = 0.03
  const total = used.length * w + (used.length - 1) * gap
  const startX = (1 - total) / 2
  const offsets = VERTICAL_OFFSETS[layout]

  return used.map((pieceId, i) => ({
    pieceId,
    x: startX + i * (w + gap),
    y: (1 - h) / 2 + (offsets[i] ?? 0),
    w,
    h,
  }))
}

/** The smallest layout that fits this many works. */
export function layoutForCount(count: number): LayoutName {
  if (count >= 4) return 'quad'
  if (count === 3) return 'trio'
  if (count === 2) return 'pair'
  return 'single'
}
