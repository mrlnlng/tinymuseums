import * as THREE from 'three'
import type { Backdrop } from './backdrop'
import { CONFIG } from './config'

export interface HallAmbience {
  update(now: number, dt: number, camera: THREE.OrthographicCamera, viewTop: number): void
  puff(x: number, y: number): void
  dispose(): void
}

/** Painted bulbs on the valance tile, as (u, v) fractions from its left and top edges. */
const BULBS: readonly [number, number][] = [
  [0.0403, 0.351], [0.0837, 0.445], [0.1285, 0.505], [0.1754, 0.524],
  [0.2222, 0.513], [0.2686, 0.456], [0.3104, 0.338], [0.3491, 0.171],
  [0.3849, 0.323], [0.4263, 0.428], [0.4698, 0.495], [0.515, 0.517],
  [0.5638, 0.5], [0.6071, 0.439], [0.6537, 0.318], [0.6919, 0.351],
  [0.7353, 0.445], [0.7801, 0.505], [0.8269, 0.524], [0.8737, 0.513],
  [0.9201, 0.456], [0.962, 0.338],
]

const TAU = Math.PI * 2

function mulberry(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Stable per-bulb variation, so entering or leaving tiles never changes a bulb's twinkle. */
function hashed(tile: number, bulb: number, salt: number): number {
  let value = Math.imul(tile, 73856093) ^ Math.imul(bulb, 19349663) ^ Math.imul(salt, 83492791)
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b)
  return ((value ^ (value >>> 16)) >>> 0) / 4294967296
}

function finish(canvas: HTMLCanvasElement): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

function painted(width: number, height: number, draw: (ink: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ink = canvas.getContext('2d')
  if (ink) draw(ink)
  return finish(canvas)
}

function glowTexture(): THREE.CanvasTexture {
  return painted(64, 64, (ink) => {
    const glow = ink.createRadialGradient(32, 32, 0, 32, 32, 32)
    glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
    glow.addColorStop(0.25, 'rgba(255, 255, 255, 0.55)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ink.fillStyle = glow
    ink.fillRect(0, 0, 64, 64)
  })
}

function vignetteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ink = canvas.getContext('2d')
  if (ink) {
    const image = ink.createImageData(256, 256)
    for (let y = 0; y < 256; y++) {
      for (let x = 0; x < 256; x++) {
        const dx = Math.abs(x - 127.5) / 127.5
        const dy = Math.abs(y - 127.5) / 127.5
        // Gathered in the corners, so paintings passing the sides of the view keep their colour.
        const edge = Math.hypot(dx, dy) / Math.SQRT2
        let alpha = 0
        if (edge > 0.6) {
          const t = (edge - 0.6) / 0.4
          alpha = 0.36 * t * t * (3 - 2 * t)
        }
        const at = (y * 256 + x) * 4
        image.data[at] = 22
        image.data[at + 1] = 2
        image.data[at + 2] = 10
        image.data[at + 3] = Math.round(alpha * 255)
      }
    }
    ink.putImageData(image, 0, 0)
    const bloom = ink.createRadialGradient(128, 0, 0, 128, 0, 150)
    bloom.addColorStop(0, 'rgba(255, 214, 160, 0.10)')
    bloom.addColorStop(1, 'rgba(255, 214, 160, 0)')
    ink.fillStyle = bloom
    ink.fillRect(0, 0, 256, 256)
  }
  return finish(canvas)
}

/** Light on the valance, dust in the air and the shade that closes in at the view's edges. */
export function createHallAmbience(scene: THREE.Scene, backdrop: Backdrop, still: boolean): HallAmbience {
  const settings = CONFIG.ambience
  const random = mulberry(20261110)
  const textures: THREE.Texture[] = []
  const keep = <T extends THREE.Texture>(texture: T): T => {
    textures.push(texture)
    return texture
  }

  const glowMap = keep(glowTexture())
  const geometry = new THREE.PlaneGeometry(1, 1)
  const material = new THREE.MeshBasicMaterial({
    map: glowMap,
    color: '#ffffff',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const capacity = settings.bulbs.capacity + settings.dust.count
  const glows = new THREE.InstancedMesh(geometry, material, capacity)
  glows.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  glows.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(capacity * 3).fill(1), 3)
  glows.instanceColor.setUsage(THREE.DynamicDrawUsage)
  glows.frustumCulled = false
  glows.count = 0
  // Sorted as one object: pin its depth just in front of the valance, rather than wherever the
  // first frame's instances happened to centre it.
  glows.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, settings.bulbs.halo.z), Infinity)
  scene.add(glows)

  const haloColor = new THREE.Color(settings.bulbs.halo.color)
  const poolColor = new THREE.Color(settings.bulbs.pool.color)
  const streakColor = new THREE.Color(settings.bulbs.streak.color)
  const dustColor = new THREE.Color(settings.dust.color)
  const dummy = new THREE.Object3D()
  const tint = new THREE.Color()
  let used = 0

  function place(x: number, y: number, z: number, width: number, height: number, colour: THREE.Color, brightness: number): void {
    if (used >= capacity) return
    dummy.position.set(x, y, z)
    dummy.rotation.set(0, 0, 0)
    dummy.scale.set(width, height, 1)
    dummy.updateMatrix()
    glows.setMatrixAt(used, dummy.matrix)
    glows.setColorAt(used, tint.copy(colour).multiplyScalar(brightness))
    used++
  }

  const dust = Array.from({ length: settings.dust.count }, () => ({
    x: (random() - 0.5) * 16,
    y: settings.dust.minY + random() * 4,
    rise: settings.dust.rise * (0.7 + random() * 0.6),
    wander: settings.dust.wander * (0.6 + random() * 0.8),
    phase: random() * TAU,
    life: random(),
    lifespan: settings.dust.life.minSeconds + random() * (settings.dust.life.maxSeconds - settings.dust.life.minSeconds),
    brightness: settings.dust.minBrightness + random() * (settings.dust.maxBrightness - settings.dust.minBrightness),
    size: settings.dust.minSize + random() * (settings.dust.maxSize - settings.dust.minSize),
  }))

  const puffSettings = settings.puff
  const puffs = Array.from({ length: puffSettings.capacity }, () => {
    const material = new THREE.MeshBasicMaterial({
      map: glowMap,
      color: puffSettings.color,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.z = puffSettings.z
    mesh.visible = false
    scene.add(mesh)
    return { mesh, material, vx: 0, age: 0 }
  })
  let puffCursor = 0

  const vignetteMap = keep(vignetteTexture())
  const vignette = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({
      map: vignetteMap,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    }),
  )
  vignette.position.z = settings.vignette.z
  vignette.renderOrder = settings.vignette.renderOrder
  vignette.frustumCulled = false
  scene.add(vignette)

  return {
    update(now, dt, camera, viewTop) {
      const viewWidth = camera.right - camera.left
      const viewHeight = camera.top - camera.bottom
      const left = camera.position.x + camera.left
      const right = camera.position.x + camera.right
      const bottom = camera.position.y + camera.bottom
      const top = camera.position.y + camera.top
      const t = still ? 0 : now / 1000
      used = 0

      const curtain = backdrop.curtain()
      if (curtain.tile > 0 && curtain.height > 0) {
        const bulbDiameter = settings.bulbs.diameter * curtain.height
        const haloDiameter = settings.bulbs.halo.diameter * bulbDiameter
        const poolDiameter = settings.bulbs.pool.diameter * curtain.height
        const margin = Math.max(curtain.tile, haloDiameter)
        const first = Math.floor((left - margin - curtain.originX) / curtain.tile) - 1
        const last = Math.floor((right + margin - curtain.originX) / curtain.tile) + 1
        for (let tile = first; tile <= last; tile++) {
          for (let bulb = 0; bulb < BULBS.length; bulb++) {
            const [u, v] = BULBS[bulb]
            const x = curtain.originX + (tile + u) * curtain.tile + curtain.lean * v
            if (x < left - margin || x > right + margin) continue
            const y = curtain.top - v * curtain.height
            if (y < bottom - poolDiameter / 2 || y > top + haloDiameter / 2) continue

            const speed = settings.bulbs.twinkle.minSpeed
              + hashed(tile, bulb, 1) * (settings.bulbs.twinkle.maxSpeed - settings.bulbs.twinkle.minSpeed)
            const phase = hashed(tile, bulb, 2) * TAU
            const pulse = still ? 1 : 0.78 + 0.16 * Math.sin(t * speed + phase) + 0.06 * Math.sin(t * 6.1 * speed + phase * 3)

            place(x, y, settings.bulbs.halo.z, haloDiameter, haloDiameter, haloColor, settings.bulbs.halo.base * pulse)
            place(x, y, settings.bulbs.pool.z, poolDiameter, poolDiameter, poolColor, settings.bulbs.pool.base * pulse)
            place(
              x,
              settings.bulbs.streak.y,
              settings.bulbs.streak.z,
              settings.bulbs.streak.width,
              settings.bulbs.streak.height,
              streakColor,
              settings.bulbs.streak.base * pulse,
            )
          }
        }
      }

      const step = still ? 0 : Math.min(dt, 0.05)
      const margin = settings.dust.margin
      const dustSpan = viewWidth + margin * 2
      const dustLeft = left - margin
      for (const mote of dust) {
        if (!still) {
          mote.life += step / mote.lifespan
          if (mote.life >= 1) {
            mote.life -= 1
            mote.x = dustLeft + random() * dustSpan
            mote.y = settings.dust.minY + random() * Math.max(0.01, viewTop - settings.dust.minY)
          }
          mote.y += mote.rise * step
          if (mote.y > viewTop) mote.y = settings.dust.minY
          mote.x += Math.sin(t * 0.6 + mote.phase) * mote.wander * step
        }
        mote.x = dustLeft + (((mote.x - dustLeft) % dustSpan) + dustSpan) % dustSpan
        const fade = still ? 1 : Math.sin(Math.PI * mote.life)
        place(mote.x, mote.y, settings.dust.z, mote.size, mote.size, dustColor, mote.brightness * fade)
      }

      const puffStep = still ? 0 : Math.min(dt, 0.05)
      for (const puff of puffs) {
        if (!puff.mesh.visible) continue
        puff.age += puffStep
        if (puff.age >= puffSettings.seconds) {
          puff.mesh.visible = false
          puff.material.opacity = 0
          continue
        }
        const progress = puff.age / puffSettings.seconds
        puff.vx *= Math.exp(-puffStep * 6)
        puff.mesh.position.x += puff.vx * puffStep
        puff.mesh.position.y += (puffSettings.rise / puffSettings.seconds) * puffStep
        puff.mesh.scale.setScalar(
          puffSettings.startSize + (puffSettings.endSize - puffSettings.startSize) * progress,
        )
        puff.material.opacity = puffSettings.startOpacity * (1 - progress)
      }

      glows.count = used
      glows.instanceMatrix.needsUpdate = true
      if (glows.instanceColor) glows.instanceColor.needsUpdate = true

      vignette.position.x = camera.position.x + (camera.left + camera.right) / 2
      vignette.position.y = camera.position.y + (camera.top + camera.bottom) / 2
      vignette.scale.set(viewWidth * settings.vignette.scale, viewHeight * settings.vignette.scale, 1)
    },
    puff(x, y) {
      if (still) return
      for (let i = 0; i < puffSettings.blobs; i++) {
        const puff = puffs[puffCursor]
        puffCursor = (puffCursor + 1) % puffs.length
        const side = i < puffSettings.blobs / 2 ? -1 : 1
        puff.age = 0
        puff.vx = side * (puffSettings.speedMin + random() * (puffSettings.speedMax - puffSettings.speedMin))
        // Starting beside the feet: the visitor is drawn over the scene and would hide dust under it.
        puff.mesh.position.set(x + side * puffSettings.offset, y + random() * 0.04, puffSettings.z)
        puff.mesh.scale.setScalar(puffSettings.startSize)
        puff.material.opacity = puffSettings.startOpacity
        puff.mesh.visible = true
      }
    },
    dispose() {
      scene.remove(glows)
      glows.dispose()
      for (const puff of puffs) {
        scene.remove(puff.mesh)
        puff.material.dispose()
      }
      geometry.dispose()
      material.dispose()
      scene.remove(vignette)
      vignette.geometry.dispose()
      ;(vignette.material as THREE.Material).dispose()
      for (const texture of textures) texture.dispose()
    },
  }
}
