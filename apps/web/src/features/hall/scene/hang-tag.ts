import * as THREE from 'three'

// A shop price tag: a small upright card with clipped top corners and a reinforced hole, hanging
// straight down from a thin string loop tied to the piece. It is drawn into the scene, so visitors
// walk in front of it, and sways a little on its string.

const W = 160
const H = 270
/** Where the string is tied, in canvas px; the tag swings about this point. */
const KNOT = { x: 80, y: 6 }
const CARD = { left: 22, right: 138, top: 40, bottom: 262, corner: 22 }
const HOLE = { x: 80, y: 64, r: 9 }

export interface HangTagStyle {
  font: string
  coin: HTMLImageElement | null
}

export interface HangTag {
  /** Positioned at the knot; rotate it to sway the tag. */
  pivot: THREE.Group
  setLabel(text: string): void
  setVisible(visible: boolean): void
  redraw(): void
  dispose(): void
}

/** `width` is the card's width in world units; `knot` is where its string is tied. */
export function createHangTag(style: HangTagStyle, knot: { x: number; y: number }, width: number, z: number): HangTag {
  const canvas = document.createElement('canvas')
  canvas.width = W * 2
  canvas.height = H * 2
  const ctx = canvas.getContext('2d')!
  ctx.scale(2, 2)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  const scale = width / (CARD.right - CARD.left)
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(W * scale, H * scale),
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }),
  )
  mesh.position.set((W / 2 - KNOT.x) * scale, -(H / 2 - KNOT.y) * scale, 0)
  const pivot = new THREE.Group()
  pivot.position.set(knot.x, knot.y, z)
  pivot.add(mesh)
  let label = ''

  function draw(): void {
    ctx.clearRect(0, 0, W, H)
    // The string: a narrow loop from the knot down through the hole.
    ctx.strokeStyle = 'rgba(240, 214, 165, 0.85)'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(KNOT.x, KNOT.y)
    ctx.bezierCurveTo(KNOT.x - 9, 24, HOLE.x - 6, HOLE.y - 20, HOLE.x - 2, HOLE.y - 2)
    ctx.moveTo(KNOT.x, KNOT.y)
    ctx.bezierCurveTo(KNOT.x + 9, 24, HOLE.x + 6, HOLE.y - 20, HOLE.x + 2, HOLE.y - 2)
    ctx.stroke()

    const { left, right, top, bottom, corner } = CARD
    const card = () => {
      ctx.beginPath()
      ctx.moveTo(left + corner, top)
      ctx.lineTo(right - corner, top)
      ctx.lineTo(right, top + corner)
      ctx.lineTo(right, bottom - 6)
      ctx.quadraticCurveTo(right, bottom, right - 6, bottom)
      ctx.lineTo(left + 6, bottom)
      ctx.quadraticCurveTo(left, bottom, left, bottom - 6)
      ctx.lineTo(left, top + corner)
      ctx.closePath()
    }
    ctx.save()
    ctx.shadowColor = 'rgba(30, 4, 4, 0.25)'
    ctx.shadowBlur = 4
    ctx.shadowOffsetY = 2
    ctx.fillStyle = '#f2e2c4'
    card()
    ctx.fill()
    ctx.restore()
    ctx.strokeStyle = '#e2c08a'
    ctx.lineWidth = 1.5
    card()
    ctx.stroke()

    // The reinforced hole the string runs through.
    ctx.fillStyle = '#e9c98f'
    ctx.beginPath()
    ctx.arc(HOLE.x, HOLE.y, HOLE.r + 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#5a1a0e'
    ctx.beginPath()
    ctx.arc(HOLE.x, HOLE.y, HOLE.r - 2, 0, Math.PI * 2)
    ctx.fill()

    const coin = 46
    if (style.coin?.complete && style.coin.naturalWidth > 0) ctx.drawImage(style.coin, W / 2 - coin / 2, 94, coin, coin)
    ctx.fillStyle = '#6b3a1e'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    let size = 60
    ctx.font = `${size}px ${style.font}`
    while (size > 24 && ctx.measureText(label).width > right - left - 16) {
      size -= 2
      ctx.font = `${size}px ${style.font}`
    }
    ctx.fillText(label, W / 2, 188)
    ctx.strokeStyle = '#e2c08a'
    ctx.lineWidth = 1.2
    ctx.beginPath()
    ctx.moveTo(left + 24, 228)
    ctx.lineTo(right - 24, 228)
    ctx.stroke()
    texture.needsUpdate = true
  }

  return {
    pivot,
    setLabel(text) {
      if (text === label) return
      label = text
      draw()
    },
    setVisible(visible) {
      pivot.visible = visible
    },
    redraw: draw,
    dispose() {
      texture.dispose()
      mesh.geometry.dispose()
      mesh.material.dispose()
    },
  }
}
