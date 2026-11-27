import * as THREE from 'three'

/** A handful of soft petals drifting down in front of the hall's door to the pond. */
export interface DoorPetals {
  update(now: number, dt: number): void
  dispose(): void
}

interface Petal {
  originX: number
  y: number
  speed: number
  sway: number
  swaySpeed: number
  phase: number
  angle: number
  spin: number
  size: number
}

export interface PondDoor {
  /** The door's centre, foot and full height, so the petals fall across it. */
  x: number
  width: number
  base: number
  height: number
}

const COUNT = 7
const STILL_COUNT = 5
const Z = 0.36
const FALL_MARGIN = 0.35

function mulberry(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** One small, soft petal, painted once and shared by every instance. */
function petalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ink = canvas.getContext('2d')
  if (ink) {
    ink.translate(32, 32)
    ink.rotate(-0.45)
    const wash = ink.createLinearGradient(0, -24, 0, 26)
    wash.addColorStop(0, '#ffd9e7')
    wash.addColorStop(0.55, '#f7a8c4')
    wash.addColorStop(1, '#e77aa2')
    ink.fillStyle = wash
    ink.beginPath()
    ink.moveTo(0, -24)
    ink.bezierCurveTo(20, -19, 24, 4, 0, 25)
    ink.bezierCurveTo(-24, 4, -20, -19, 0, -24)
    ink.fill()
    ink.strokeStyle = 'rgba(190, 80, 120, 0.28)'
    ink.lineWidth = 1.5
    ink.beginPath()
    ink.moveTo(0, -18)
    ink.quadraticCurveTo(3, 2, 0, 20)
    ink.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  return texture
}

/**
 * Draws the petals with one instanced mesh and one shared texture: a handful of quads, updated in
 * place, so the decoration costs one draw call on a phone. With reduced motion the petals rest on
 * the floor instead of falling.
 */
export function createDoorPetals(scene: THREE.Scene, door: PondDoor, still: boolean): DoorPetals {
  const random = mulberry(0x5eed0f10 ^ Math.round(door.x * 1000))
  const count = still ? STILL_COUNT : COUNT
  const texture = petalTexture()
  const geometry = new THREE.PlaneGeometry(1, 1)
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    opacity: 0.92,
  })
  const mesh = new THREE.InstancedMesh(geometry, material, count)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false
  mesh.renderOrder = 1
  scene.add(mesh)

  const floor = door.base + 0.04
  const top = door.base + door.height
  const span = door.width + 0.7
  const dummy = new THREE.Object3D()

  const petals: Petal[] = Array.from({ length: count }, () => {
    const size = 0.055 + random() * 0.04
    return {
      originX: door.x + (random() - 0.5) * span,
      y: still ? floor + size * 0.15 : floor + random() * (top + FALL_MARGIN - floor),
      speed: 0.07 + random() * 0.08,
      sway: 0.05 + random() * 0.12,
      swaySpeed: 0.35 + random() * 0.35,
      phase: random() * Math.PI * 2,
      angle: still ? Math.PI / 2 + (random() - 0.5) * 0.5 : random() * Math.PI * 2,
      spin: (random() - 0.5) * 0.9,
      size,
    }
  })

  function place(petal: Petal, now: number, index: number): void {
    const sway = still ? 0 : Math.sin(now * 0.001 * petal.swaySpeed + petal.phase) * petal.sway
    const angle = still ? petal.angle : petal.angle + now * 0.001 * petal.spin
    dummy.position.set(petal.originX + sway, petal.y, Z)
    dummy.rotation.set(0, 0, angle)
    dummy.scale.set(petal.size, petal.size * 0.82, 1)
    dummy.updateMatrix()
    mesh.setMatrixAt(index, dummy.matrix)
  }

  for (let i = 0; i < petals.length; i++) place(petals[i], 0, i)
  mesh.instanceMatrix.needsUpdate = true

  return {
    update(now, dt) {
      if (still) return
      const step = Math.min(Math.max(dt, 0), 0.05)
      for (let i = 0; i < petals.length; i++) {
        const petal = petals[i]
        petal.y -= petal.speed * step
        if (petal.y < floor - petal.size) {
          petal.originX = door.x + (random() - 0.5) * span
          petal.y = top + FALL_MARGIN + random() * 0.4
          petal.phase = random() * Math.PI * 2
        }
        place(petal, now, i)
      }
      mesh.instanceMatrix.needsUpdate = true
    },
    dispose() {
      scene.remove(mesh)
      mesh.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
    },
  }
}
