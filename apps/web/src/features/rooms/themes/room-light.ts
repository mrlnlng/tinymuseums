export interface RoomLight {
  /** How dirty-dark the room is, 0 to 1. */
  gloom: number
  /** Windows: centre x, bottom y, width and height. */
  suns: { x: number; y: number; width: number; height: number }[]
  /** Bare bulbs, where they glow. */
  lamps: { x: number; y: number }[]
}

/** Where the back wall meets the ceiling. */
export const CEILING = 4.55

const smooth = (from: number, to: number, value: number): number => {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)))
  return t * t * (3 - 2 * t)
}

const pool = (dx: number, dy: number, rx: number, ry: number): number => Math.exp(-((dx / rx) ** 2 + (dy / ry) ** 2))

/**
 * How much the dark covers a point of the room, 0 to 1. Every light is a broad pool rather than
 * a spotlight, so the whole room reads; the corners, the ceiling and the side walls stay deepest.
 */
export function darknessAt(light: RoomLight, right: number, x: number, y: number): number {
  const dirty = Math.max(0, Math.min(1, light.gloom))
  const ambient = dirty * 0.8

  const inside = Math.min(x, right - x)
  const corner = inside < 0 ? 0.42 + Math.min(0.3, -inside * 0.08) : 0.2 * (1 - smooth(0, 1.6, inside))
  const ceiling = y > CEILING ? 0.5 + 0.25 * smooth(CEILING, CEILING + 1.5, y) : 0.3 * smooth(2.8, CEILING, y)
  const front = 0.22 * smooth(-0.4, -2.2, y)
  const skirting = 0.12 * Math.exp(-(((y - 0.04) / 0.22) ** 2))
  const occlusion = 1 - (1 - corner) * (1 - ceiling) * (1 - front) * (1 - skirting)
  let dark = 1 - (1 - ambient) * (1 - occlusion * (0.45 + 0.6 * dirty))

  let unlit = 1
  for (const sun of light.suns) unlit *= 1 - 0.62 * pool(x - sun.x, y - sun.y - sun.height / 2, 3.2, 2.8)
  for (const lamp of light.lamps) unlit *= 1 - 0.42 * pool(x - lamp.x, y - lamp.y + 0.4, 1.9, 1.9)
  dark *= unlit
  return Math.max(0, Math.min(1, dark))
}
