import { CONFIG } from './config'
import { stepBox, type Flight } from './flights'

const { stairs } = CONFIG
const PX = 160
const INK = '#4b2311'
const WOOD = '#7a3a1b'
const TREAD = '#b86a3c'
const GOLD = '#f0a21a'
const GOLD_DARK = '#c9780a'
const RAIL_HEIGHT = 0.95
const SOFFIT = 0.85

/** The drawn flight: its art, the railing alone (drawn over the character), and where both go. */
export interface StairArt {
  art: HTMLCanvasElement
  rail: HTMLCanvasElement
  left: number
  base: number
  width: number
  height: number
}

/** A stairwell opening in the floor, from the floor's top edge down, behind a flight going down. */
export interface Well {
  top: number
  width: number
}

export function drawStairs(flight: Flight, well?: Well): StairArt {
  const { rise, run } = stairs
  const sign = flight.down ? -1 : 1
  const last = stepBox(flight, flight.count)
  const reach = flight.count * run
  const leftEdge = Math.min(flight.foot - reach, well ? flight.foot - well.width : Infinity) - 0.1
  const rightEdge = flight.foot + 0.2
  const railTop = flight.floorY + (flight.down ? 0 : rise) + RAIL_HEIGHT + 0.25
  const top = Math.max(railTop, flight.down ? (well?.top ?? railTop) : last.top + RAIL_HEIGHT + 0.25)
  const bottom = flight.down ? last.top - SOFFIT - 0.2 : flight.floorY - 0.05
  const width = rightEdge - leftEdge
  const height = top - bottom

  const canvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
    const c = document.createElement('canvas')
    c.width = Math.ceil(width * PX)
    c.height = Math.ceil(height * PX)
    const ctx = c.getContext('2d')!
    // World units, y up.
    ctx.setTransform(PX, 0, 0, -PX, -leftEdge * PX, top * PX)
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    return [c, ctx]
  }
  const [art, ctx] = canvas()
  const [rail, railCtx] = canvas()

  // The line through each step's outer edge, which the handrail and soffit follow.
  const nosing = (x: number) => flight.floorY + sign * rise * ((flight.foot - x) / run + (flight.down ? 0 : 1))

  if (well) {
    const gradient = ctx.createLinearGradient(0, well.top, 0, bottom)
    gradient.addColorStop(0, '#2e0707')
    gradient.addColorStop(1, '#120101')
    ctx.fillStyle = gradient
    ctx.fillRect(flight.foot - well.width, bottom, well.width, well.top - bottom)
    // The far lip of the opening and the floor's cut edge beside the top step.
    ctx.fillStyle = '#5a2a14'
    ctx.fillRect(flight.foot - well.width, well.top - 0.07, well.width, 0.07)
    ctx.fillRect(flight.foot - 0.06, flight.floorY - SOFFIT, 0.06, well.top - flight.floorY + SOFFIT)
  }

  // The flight's side: the stepped profile, then the soffit back to the floor.
  ctx.beginPath()
  ctx.moveTo(flight.foot, flight.floorY)
  for (let i = 1; i <= flight.count; i++) {
    const box = stepBox(flight, i)
    ctx.lineTo(flight.foot - (i - 1) * run, box.top)
    ctx.lineTo(flight.foot - i * run, box.top)
  }
  const end = flight.foot - reach
  if (flight.down) {
    ctx.lineTo(end, nosing(end) - SOFFIT)
    ctx.lineTo(flight.foot, flight.floorY - SOFFIT)
  } else {
    ctx.lineTo(end, nosing(end) - SOFFIT)
    // The lowest steps stand solid on the floor.
    const meets = flight.foot - ((SOFFIT - rise) / rise) * run
    ctx.lineTo(meets, flight.floorY)
  }
  ctx.closePath()
  ctx.fillStyle = WOOD
  ctx.fill()
  ctx.lineWidth = 0.035
  ctx.strokeStyle = INK
  ctx.stroke()

  for (let i = 1; i <= flight.count; i++) {
    const box = stepBox(flight, i)
    ctx.fillStyle = TREAD
    ctx.fillRect(box.left, box.top - 0.075, run, 0.075)
    ctx.strokeStyle = INK
    ctx.lineWidth = 0.022
    ctx.beginPath()
    ctx.moveTo(box.left, box.top - 0.075)
    ctx.lineTo(box.right, box.top - 0.075)
    // The riser below each step's outer edge.
    const riserX = flight.down ? box.left : box.right
    ctx.moveTo(riserX, box.top)
    ctx.lineTo(riserX, box.top - sign * rise)
    ctx.stroke()
  }

  // The railing: a newel post at the foot, balusters on each step, and the handrail.
  function drawRail(c: CanvasRenderingContext2D): void {
    const post = flight.foot - 0.08
    const railAt = (x: number) => nosing(x) + RAIL_HEIGHT
    c.strokeStyle = '#e8920f'
    c.lineWidth = 0.045
    c.beginPath()
    for (let i = 1; i <= flight.count; i++) {
      const box = stepBox(flight, i)
      const x = (box.left + box.right) / 2
      c.moveTo(x, box.top)
      c.lineTo(x, railAt(x))
    }
    c.stroke()
    c.lineWidth = 0.1
    c.strokeStyle = GOLD_DARK
    c.beginPath()
    c.moveTo(post, railAt(post) - 0.015)
    c.lineTo(end, railAt(end) - 0.015)
    c.stroke()
    c.lineWidth = 0.075
    c.strokeStyle = GOLD
    c.beginPath()
    c.moveTo(post, railAt(post) + 0.01)
    c.lineTo(end, railAt(end) + 0.01)
    c.stroke()
    const capY = railAt(post) + 0.14
    c.fillStyle = GOLD_DARK
    c.fillRect(post - 0.07, flight.floorY, 0.14, capY - flight.floorY)
    c.fillStyle = GOLD
    c.fillRect(post - 0.05, flight.floorY, 0.07, capY - flight.floorY)
    c.beginPath()
    c.arc(post, capY + 0.06, 0.09, 0, Math.PI * 2)
    c.fillStyle = '#f6b636'
    c.fill()
    c.lineWidth = 0.02
    c.strokeStyle = GOLD_DARK
    c.stroke()
  }
  drawRail(ctx)
  drawRail(railCtx)

  return { art, rail, left: leftEdge, base: bottom, width, height }
}
