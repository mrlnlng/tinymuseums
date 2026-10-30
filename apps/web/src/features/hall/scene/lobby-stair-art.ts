import * as THREE from 'three'
import { CONFIG } from './config'
import { LOBBY_EXTENSION, lobbyDrawing, lobbyTreads } from './flights'

/** Extend the supplied drawing with equally sized treads instead of enlarging every step. */
export function extendLobbyStairArt(source: CanvasImageSource): { texture: THREE.CanvasTexture; railing: string } {
  const [width, height] = lobbyDrawing
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  const join = CONFIG.stairs.landing.x
  const upper = lobbyTreads.slice(CONFIG.stairs.treads.length - 1)
  const top = upper.at(-1)![1]
  // The original curved underside continues upward along the added flight.
  ctx.fillStyle = '#793f1e'
  ctx.beginPath()
  ctx.moveTo(join, upper[0][1])
  for (let i = 0; i < upper.length; i++) {
    const [x, y] = upper[i]
    ctx.lineTo(x, y)
    ctx.lineTo(upper[i + 1]?.[0] ?? width, y)
  }
  ctx.lineTo(width, top + 180)
  ctx.bezierCurveTo(width - 280, top + 260, join + 170, upper[0][1] + 50, join, upper[0][1] + 150)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#a65c34'
  for (let i = 0; i < upper.length; i++) {
    const [x, y] = upper[i]
    ctx.fillRect(x, y, (upper[i + 1]?.[0] ?? width) - x, 12)
  }
  // Preserve the source's lower steps, curved rail, colours and painted edges exactly.
  ctx.drawImage(source, 0, 0, join, CONFIG.stairs.drawing[1], 0, LOBBY_EXTENSION, join, CONFIG.stairs.drawing[1])
  const pixels = ctx.getImageData(join - 1, LOBBY_EXTENSION, 1, CONFIG.stairs.drawing[1]).data
  let railY = LOBBY_EXTENSION + 60
  for (let y = 0; y < CONFIG.stairs.drawing[1]; y++) {
    const i = y * 4
    if (pixels[i] > 140 && pixels[i + 1] > 70 && pixels[i + 2] < 35 && pixels[i + 3] > 100) { railY = LOBBY_EXTENSION + y + 14; break }
  }
  const rise = -74 / 94
  ctx.strokeStyle = '#ed9800'
  ctx.lineWidth = 11
  for (const [x, y] of upper.slice(1)) {
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, railY + (x - join) * rise)
    ctx.stroke()
  }
  ctx.lineWidth = 28
  ctx.beginPath()
  ctx.moveTo(join - 2, railY)
  ctx.lineTo(width, railY + (width - join) * rise)
  ctx.stroke()

  const railing = document.createElement('canvas')
  railing.width = width
  railing.height = height
  const rail = railing.getContext('2d')!
  const image = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < image.data.length; i += 4) {
    if (!(image.data[i] > 140 && image.data[i + 1] > 70 && image.data[i + 2] < 35)) image.data[i + 3] = 0
  }
  rail.putImageData(image, 0, 0)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return { texture, railing: railing.toDataURL() }
}
