import * as THREE from 'three'
import layout from '../../../../public/assets/pond/layout.json'
import { POND_LANDMARKS } from './landmarks'
import { FAR_LIFT, depthAtLift, liftAt, pathHalfWidth, pathX, scaleAt } from './depth'
import type { PondArt } from './art'

/** Where the painting sits in the world, so the living layers line up with it. */
export interface PondGround {
  sceneWidth: number
  sceneHeight: number
  groundY: number
  minX: number
  maxX: number
  yAt(fractionFromTop: number): number
}

export interface PondAmbience {
  update(now: number, dt: number, camera: THREE.OrthographicCamera): void
  dispose(): void
}

type Ink = CanvasRenderingContext2D

function mulberry(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Drawn at several times its nominal size, so it stays sharp on dense phone screens. */
function painted(width: number, height: number, draw: (ink: Ink) => void, density = 3): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width * density
  canvas.height = height * density
  const ink = canvas.getContext('2d')
  if (ink) {
    ink.scale(density, density)
    draw(ink)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

const GRASS = ['#5a912f', '#6a9d33', '#78a938', '#86b43d', '#9cc44a']
const BLOOMS = [
  { petal: '#fff7e8', heart: '#f6c445' },
  { petal: '#f79abd', heart: '#fbe08a' },
  { petal: '#c3acef', heart: '#fff2b8' },
  { petal: '#ffd966', heart: '#f08a3c' },
]

function blade(ink: Ink, x: number, base: number, height: number, lean: number, width: number, colour: string): void {
  const tipX = x + lean * height * 0.45
  ink.fillStyle = colour
  ink.beginPath()
  ink.moveTo(x - width / 2, base)
  ink.quadraticCurveTo(x - width / 2 + lean * height * 0.18, base - height * 0.6, tipX, base - height)
  ink.quadraticCurveTo(x + width / 2 + lean * height * 0.2, base - height * 0.55, x + width / 2, base)
  ink.closePath()
  ink.fill()
}

function bloom(ink: Ink, x: number, y: number, size: number, kind: (typeof BLOOMS)[number], random: () => number): void {
  const petals = 5
  const turn = random() * Math.PI
  ink.fillStyle = kind.petal
  for (let i = 0; i < petals; i++) {
    const angle = turn + (i / petals) * Math.PI * 2
    ink.beginPath()
    ink.ellipse(x + Math.cos(angle) * size * 0.55, y + Math.sin(angle) * size * 0.5, size * 0.52, size * 0.36, angle, 0, Math.PI * 2)
    ink.fill()
  }
  ink.fillStyle = kind.heart
  ink.beginPath()
  ink.arc(x, y, size * 0.3, 0, Math.PI * 2)
  ink.fill()
}

/** The base of every plant melts into the lawn rather than ending on a line. */
function rooted(ink: Ink, width: number, height: number, band: number): void {
  ink.globalCompositeOperation = 'destination-out'
  const fade = ink.createLinearGradient(0, height * (1 - band), 0, height)
  fade.addColorStop(0, 'rgba(0, 0, 0, 0)')
  fade.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ink.fillStyle = fade
  ink.fillRect(0, height * (1 - band), width, height * band)
  ink.globalCompositeOperation = 'source-over'
}

function tuftTexture(seed: number, flowers: number): THREE.CanvasTexture {
  const random = mulberry(seed)
  return painted(192, 192, (ink) => {
    const blades = 18 + Math.floor(random() * 8)
    for (let i = 0; i < blades; i++) {
      const offset = (random() - 0.5) * 120
      const tall = (42 + random() * 62) * (1 - Math.abs(offset) / 150)
      blade(ink, 96 + offset, 192, tall, offset / 110 + (random() - 0.5) * 0.7, 13 + random() * 10, GRASS[Math.floor(random() * GRASS.length)])
    }
    for (let i = 0; i < flowers; i++) {
      const x = 44 + random() * 104
      const tall = 74 + random() * 56
      const lean = (random() - 0.5) * 0.5
      ink.strokeStyle = GRASS[1]
      ink.lineWidth = 3.5
      ink.lineCap = 'round'
      ink.beginPath()
      ink.moveTo(x, 190)
      ink.quadraticCurveTo(x + lean * 20, 190 - tall * 0.5, x + lean * tall * 0.4, 190 - tall)
      ink.stroke()
      bloom(ink, x + lean * tall * 0.4, 190 - tall, 11 + random() * 6, BLOOMS[Math.floor(random() * BLOOMS.length)], random)
    }
    rooted(ink, 192, 192, 0.16)
  })
}

function reedTexture(seed: number): THREE.CanvasTexture {
  const random = mulberry(seed)
  return painted(160, 320, (ink) => {
    for (let i = 0; i < 9; i++) {
      blade(ink, 80 + (random() - 0.5) * 70, 320, 150 + random() * 150, (random() - 0.5) * 0.5, 9 + random() * 6, ['#3f7a2e', '#55923a', '#74a840'][Math.floor(random() * 3)])
    }
    for (let i = 0; i < 3; i++) {
      const x = 42 + i * 36 + (random() - 0.5) * 14
      const top = 34 + random() * 70
      ink.strokeStyle = '#5c8a34'
      ink.lineWidth = 4
      ink.beginPath()
      ink.moveTo(x, 318)
      ink.lineTo(x + 3, top)
      ink.stroke()
      ink.fillStyle = '#7a4a2a'
      ink.beginPath()
      ink.roundRect(x - 4, top + 6, 14, 46, 7)
      ink.fill()
      ink.fillStyle = '#a06a3e'
      ink.beginPath()
      ink.roundRect(x - 2, top + 9, 5, 38, 3)
      ink.fill()
    }
    rooted(ink, 160, 320, 0.1)
  })
}

function glowTexture(): THREE.CanvasTexture {
  return painted(64, 64, (ink) => {
    const glow = ink.createRadialGradient(32, 32, 0, 32, 32, 32)
    glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
    glow.addColorStop(0.25, 'rgba(255, 255, 255, 0.55)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ink.fillStyle = glow
    ink.fillRect(0, 0, 64, 64)
  }, 1)
}

function shadowTexture(): THREE.CanvasTexture {
  return painted(128, 64, (ink) => {
    ink.translate(64, 32)
    ink.scale(1, 0.5)
    const shade = ink.createRadialGradient(0, 0, 0, 0, 0, 64)
    shade.addColorStop(0, 'rgba(30, 62, 24, 0.62)')
    shade.addColorStop(0.55, 'rgba(30, 62, 24, 0.3)')
    shade.addColorStop(1, 'rgba(30, 62, 24, 0)')
    ink.fillStyle = shade
    ink.fillRect(-64, -64, 128, 128)
  }, 1)
}

function rayTexture(): THREE.CanvasTexture {
  return painted(128, 512, (ink) => {
    const down = ink.createLinearGradient(0, 0, 0, 512)
    down.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
    down.addColorStop(0.55, 'rgba(255, 255, 255, 0.5)')
    down.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ink.fillStyle = down
    ink.fillRect(0, 0, 128, 512)
    ink.globalCompositeOperation = 'destination-in'
    const across = ink.createLinearGradient(0, 0, 128, 0)
    across.addColorStop(0, 'rgba(0, 0, 0, 0)')
    across.addColorStop(0.5, 'rgba(0, 0, 0, 1)')
    across.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ink.fillStyle = across
    ink.fillRect(0, 0, 128, 512)
  }, 1)
}

function vignetteTexture(): THREE.CanvasTexture {
  return painted(256, 256, (ink) => {
    const shade = ink.createRadialGradient(128, 118, 70, 128, 128, 190)
    shade.addColorStop(0, 'rgba(18, 48, 30, 0)')
    shade.addColorStop(0.7, 'rgba(18, 48, 30, 0.1)')
    shade.addColorStop(1, 'rgba(18, 48, 30, 0.42)')
    ink.fillStyle = shade
    ink.fillRect(0, 0, 256, 256)
    const sun = ink.createRadialGradient(40, 20, 0, 40, 20, 170)
    sun.addColorStop(0, 'rgba(255, 244, 190, 0.2)')
    sun.addColorStop(1, 'rgba(255, 244, 190, 0)')
    ink.fillStyle = sun
    ink.fillRect(0, 0, 256, 256)
  }, 1)
}

/** Leaves close to the viewer: broad and dark. */
function frontTexture(seed: number): THREE.CanvasTexture {
  const random = mulberry(seed)
  return painted(256, 128, (ink) => {
    for (let i = 0; i < 16; i++) {
      const offset = (random() - 0.5) * 200
      const tall = (50 + random() * 66) * (1 - Math.abs(offset) / 240)
      blade(ink, 128 + offset, 132, tall, offset / 150 + (random() - 0.5) * 0.9, 20 + random() * 18, ['#2f6a25', '#3a782a', '#46852e'][Math.floor(random() * 3)])
    }
  })
}

function petalTexture(): THREE.CanvasTexture {
  return painted(48, 48, (ink) => {
    ink.fillStyle = '#ffffff'
    ink.beginPath()
    ink.moveTo(24, 4)
    ink.bezierCurveTo(44, 12, 42, 38, 24, 44)
    ink.bezierCurveTo(6, 38, 4, 12, 24, 4)
    ink.fill()
    ink.fillStyle = 'rgba(215, 90, 140, 0.35)'
    ink.beginPath()
    ink.ellipse(24, 34, 7, 8, 0, 0, Math.PI * 2)
    ink.fill()
  })
}

function wingTexture(): THREE.CanvasTexture {
  return painted(64, 96, (ink) => {
    ink.fillStyle = '#ffffff'
    ink.beginPath()
    ink.moveTo(2, 50)
    ink.bezierCurveTo(8, 6, 58, -4, 60, 26)
    ink.bezierCurveTo(62, 44, 30, 52, 2, 50)
    ink.fill()
    ink.beginPath()
    ink.moveTo(2, 50)
    ink.bezierCurveTo(30, 50, 54, 62, 46, 82)
    ink.bezierCurveTo(38, 98, 10, 84, 2, 50)
    ink.fill()
    ink.fillStyle = 'rgba(80, 41, 29, 0.28)'
    ink.beginPath()
    ink.ellipse(42, 24, 8, 6, -0.4, 0, Math.PI * 2)
    ink.fill()
    ink.beginPath()
    ink.ellipse(32, 70, 6, 5, 0.5, 0, Math.PI * 2)
    ink.fill()
  })
}

function starTexture(): THREE.CanvasTexture {
  return painted(64, 64, (ink) => {
    ink.fillStyle = '#fff3d2'
    ink.beginPath()
    ink.moveTo(32, 2)
    ink.quadraticCurveTo(38, 26, 62, 32)
    ink.quadraticCurveTo(38, 38, 32, 62)
    ink.quadraticCurveTo(26, 38, 2, 32)
    ink.quadraticCurveTo(26, 26, 32, 2)
    ink.fill()
  })
}

function ringTexture(): THREE.CanvasTexture {
  return painted(128, 128, (ink) => {
    ink.strokeStyle = 'rgba(255, 255, 255, 0.95)'
    ink.lineWidth = 5
    ink.beginPath()
    ink.arc(64, 64, 56, 0, Math.PI * 2)
    ink.stroke()
    ink.strokeStyle = 'rgba(255, 255, 255, 0.5)'
    ink.lineWidth = 3
    ink.beginPath()
    ink.arc(64, 64, 38, 0.4, Math.PI * 1.7)
    ink.stroke()
  })
}

function fishTexture(body: string, patch: string | null): THREE.CanvasTexture {
  return painted(128, 64, (ink) => {
    ink.fillStyle = body
    ink.beginPath()
    ink.ellipse(72, 32, 40, 17, 0, 0, Math.PI * 2)
    ink.fill()
    ink.beginPath()
    ink.moveTo(38, 32)
    ink.quadraticCurveTo(14, 6, 6, 10)
    ink.quadraticCurveTo(18, 32, 6, 54)
    ink.quadraticCurveTo(14, 58, 38, 32)
    ink.fill()
    if (patch) {
      ink.fillStyle = patch
      ink.beginPath()
      ink.ellipse(84, 26, 14, 9, 0.3, 0, Math.PI * 2)
      ink.fill()
      ink.beginPath()
      ink.ellipse(56, 36, 9, 7, -0.2, 0, Math.PI * 2)
      ink.fill()
      ink.fillStyle = '#50291d'
      ink.beginPath()
      ink.arc(100, 28, 2.6, 0, Math.PI * 2)
      ink.fill()
    }
  })
}

const WATER_VERTEX = `
varying vec2 vAt;
void main() {
  vAt = position.xy;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const WATER_FRAGMENT = `
uniform float uTime;
uniform vec2 uCentre;
uniform vec2 uRadius;
varying vec2 vAt;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p) { return noise(p) * 0.6 + noise(p * 2.1 + 3.7) * 0.3 + noise(p * 4.3 + 9.1) * 0.1; }
void main() {
  vec2 p = (vAt - uCentre) / uRadius;
  float inside = 1.0 - smoothstep(0.62, 1.0, length(p));
  vec2 q = vec2(vAt.x * 1.3, vAt.y * 8.5);
  float a = fbm(q + vec2(uTime * 0.11, uTime * 0.035));
  float b = fbm(q * 1.6 - vec2(uTime * 0.08, 0.0) + 5.2);
  float streak = smoothstep(0.6, 0.7, a * 0.62 + b * 0.38);
  float swell = pow(sin(vAt.y * 13.0 + a * 5.0 - uTime * 0.55) * 0.5 + 0.5, 7.0);
  float depth = smoothstep(0.35, 0.75, fbm(q * 0.45 + vec2(-uTime * 0.03, 2.0)));
  vec3 colour = mix(vec3(0.2, 0.55, 0.78), vec3(1.0, 1.0, 0.97), step(0.001, streak + swell));
  float alpha = max(streak * 0.62, swell * 0.2);
  alpha = max(alpha, (1.0 - step(0.001, streak + swell)) * depth * 0.1);
  gl_FragColor = vec4(colour, alpha * inside);
}`

function insidePolygon(points: number[][], x: number, y: number): boolean {
  let inside = false
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [xi, yi] = points[i]
    const [xj, yj] = points[j]
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

const WATER = layout.water
const WATER_BOX = {
  left: Math.min(...WATER.map(([x]) => x)),
  right: Math.max(...WATER.map(([x]) => x)),
  top: Math.min(...WATER.map(([, y]) => y)),
  bottom: Math.max(...WATER.map(([, y]) => y)),
}

/**
 * Everything in the garden that moves: light on the water, fish under it, plants in the wind,
 * petals, pollen and butterflies. The painting stays untouched underneath.
 */
export function createPondAmbience(group: THREE.Group, art: PondArt, ground: PondGround, lily: THREE.Mesh, still: boolean): PondAmbience {
  const { sceneWidth: W, sceneHeight: H, groundY, yAt } = ground
  const random = mulberry(20241110)
  const textures: THREE.Texture[] = []
  const keep = <T extends THREE.Texture>(texture: T): T => {
    textures.push(texture)
    return texture
  }
  const unit = new THREE.PlaneGeometry(1, 1)
  const rootedUnit = new THREE.PlaneGeometry(1, 1).translate(0, 0.5, 0)
  const sprite = (map: THREE.Texture, options: { additive?: boolean; opacity?: number; colour?: string; rooted?: boolean } = {}): THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> => {
    const material = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthWrite: false,
      opacity: options.opacity ?? 1,
      color: options.colour ?? '#ffffff',
      blending: options.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    })
    const mesh = new THREE.Mesh(options.rooted ? rootedUnit : unit, material)
    group.add(mesh)
    return mesh
  }

  const fractionOf = (x: number, depth: number) => ({ x: x / W, y: layout.scene.feet - liftAt(depth) / H })
  const inWater = (x: number, depth: number, margin = 0.012): boolean => {
    const at = fractionOf(x, depth)
    return [[0, 0], [margin, 0], [-margin, 0], [0, margin * 1.5], [0, -margin * 1.5]]
      .some(([dx, dy]) => insidePolygon(WATER, at.x + dx, at.y + dy))
  }
  const onPath = (x: number, depth: number): boolean => POND_LANDMARKS.some(({ path }) =>
    path && depth > -0.25 && Math.abs(x - pathX(path, Math.max(0, depth))) < pathHalfWidth(path, depth) + 0.3)
  const underProp = (x: number, depth: number): boolean => POND_LANDMARKS.some((landmark) => {
    const reach = (landmark.width * scaleAt(landmark.depth)) / 2 + 0.35
    if (landmark.kind === 'exit') return Math.abs(x - landmark.x) < reach + 0.5
    const left = landmark.kind === 'fishmonger' ? reach * 1.7 : reach
    return depth > 0.72 && x > landmark.x - left && x < landmark.x + reach
  })

  // Props stand on the lawn rather than floating over it.
  const shade = keep(shadowTexture())
  for (const landmark of POND_LANDMARKS) {
    const scale = scaleAt(landmark.depth)
    const width = landmark.width * scale * (landmark.kind === 'exit' ? 1.15 : 1.1)
    const shadow = sprite(shade, { opacity: 0.9 })
    shadow.scale.set(width, width * 0.2, 1)
    shadow.position.set(landmark.x, groundY + liftAt(landmark.depth) + 0.03 * scale, -0.26)
  }

  // Light moving on the water.
  const shape = new THREE.Shape(WATER.map(([x, y]) => new THREE.Vector2(x * W, yAt(y))))
  const waterGeometry = new THREE.ShapeGeometry(shape)
  const waterCentre = new THREE.Vector2(((WATER_BOX.left + WATER_BOX.right) / 2) * W, yAt((WATER_BOX.top + WATER_BOX.bottom) / 2))
  const waterRadius = new THREE.Vector2(((WATER_BOX.right - WATER_BOX.left) / 2) * W, ((WATER_BOX.bottom - WATER_BOX.top) / 2) * H)
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uCentre: { value: waterCentre }, uRadius: { value: waterRadius } },
    vertexShader: WATER_VERTEX,
    fragmentShader: WATER_FRAGMENT,
    transparent: true,
    depthWrite: false,
  })
  const water = new THREE.Mesh(waterGeometry, waterMaterial)
  water.position.z = -0.45
  group.add(water)

  const waterPoint = (spread = 0.62) => {
    for (let i = 0; i < 20; i++) {
      const angle = random() * Math.PI * 2
      const reach = Math.sqrt(random()) * spread
      const x = waterCentre.x + Math.cos(angle) * waterRadius.x * reach
      const y = waterCentre.y + Math.sin(angle) * waterRadius.y * reach
      if (insidePolygon(WATER, x / W, layout.scene.feet - (y - groundY) / H)) return { x, y }
    }
    return { x: waterCentre.x, y: waterCentre.y }
  }
  /** Things further back on the water are drawn smaller. */
  const waterScale = (y: number) => 0.72 + 0.28 * (1 - (y - (waterCentre.y - waterRadius.y)) / (waterRadius.y * 2))

  const shadowFish = keep(fishTexture('#1d5f86', null))
  const swimmers = Array.from({ length: 5 }, (_, index) => {
    const mesh = sprite(shadowFish, { opacity: 0.3 })
    const home = waterPoint(0.5)
    return {
      mesh,
      home,
      reachX: 0.7 + random() * 1.3,
      reachY: 0.06 + random() * 0.14,
      speed: (0.1 + random() * 0.12) * (index % 2 ? 1 : -1),
      phase: random() * Math.PI * 2,
      size: 0.42 + random() * 0.3,
    }
  })

  const ringMap = keep(ringTexture())
  const rings = Array.from({ length: 6 }, () => {
    const mesh = sprite(ringMap, { opacity: 0 })
    mesh.position.z = -0.44
    return { mesh, age: 9, size: 1 }
  })
  const ripple = (x: number, y: number, size: number) => {
    const ring = rings.find((candidate) => candidate.age >= 1) ?? rings[0]
    ring.age = 0
    ring.size = size * waterScale(y)
    ring.mesh.position.x = x
    ring.mesh.position.y = y
  }
  let nextRipple = 1.5

  const koi = sprite(keep(fishTexture('#f3862f', '#fff6e4')), { opacity: 0 })
  koi.position.z = -0.33
  const leap = { age: 9, from: { x: 0, y: 0 }, way: 1, height: 0.5, wait: 5 + random() * 4 }

  // Smaller pads keep the big lily company, and they all ride the water.
  const pads = [
    { x: 0.262, y: 0.772, w: 0.062, flip: -1 },
    { x: 0.432, y: 0.702, w: 0.05, flip: 1 },
    { x: 0.468, y: 0.812, w: 0.07, flip: -1 },
    { x: 0.762, y: 0.735, w: 0.046, flip: 1 },
  ].map((pad, index) => {
    const mesh = sprite(art.lily)
    const width = pad.w * W
    const height = width * (layout.lily.h * H) / (layout.lily.w * W)
    mesh.scale.set(width * pad.flip, height, 1)
    mesh.position.set(pad.x * W, yAt(pad.y), -0.36)
    return { mesh, y: mesh.position.y, phase: index * 1.7, sway: 0.012 }
  })
  pads.push({ mesh: lily as THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>, y: lily.position.y, phase: 4.2, sway: 0.016 })

  // Grass, wildflowers and reeds that lean with the breeze.
  const tuftMaps = [0, 0, 1, 2, 3, 0, 2].map((flowers, index) => keep(tuftTexture(41 + index * 17, flowers)))
  const reedMaps = [0, 1, 2].map((index) => keep(reedTexture(7 + index * 13)))
  const plants: { mesh: THREE.Mesh; phase: number; bend: number; x: number; depth: number }[] = []
  const spots: { x: number; depth: number; size: number; map: THREE.Texture; reed: boolean }[] = []
  // Plants gather in drifts, as they do in a meadow, with open lawn between.
  const drifts = Array.from({ length: 26 }, () => ({
    x: ground.minX - 1.4 + random() * (ground.maxX - ground.minX + 2.6),
    depth: -0.2 + Math.pow(random(), 0.8) * 1.25,
    flowers: random() < 0.6,
  }))
  for (let attempt = 0; attempt < 1600 && spots.length < 120; attempt++) {
    const drift = drifts[attempt % drifts.length]
    const x = drift.x + (random() - 0.5) * 1.9
    const depth = drift.depth + (random() - 0.5) * 0.3
    if (depth < -0.22 || depth > 1.08) continue
    if (inWater(x, depth, 0.02) || onPath(x, depth) || underProp(x, depth)) continue
    if (spots.some((spot) => Math.abs(spot.x - x) < 0.3 && Math.abs(spot.depth - depth) < 0.07)) continue
    const map = tuftMaps[drift.flowers ? Math.floor(random() * tuftMaps.length) : random() < 0.5 ? 0 : 1]
    spots.push({ x, depth, size: 0.5 + random() * 0.3, map, reed: false })
  }
  const reedBeds: [number, number][] = [
    [0.205, 0.745], [0.218, 0.775], [0.236, 0.715], [0.268, 0.7], [0.29, 0.682], [0.325, 0.672],
    [0.705, 0.672], [0.75, 0.68], [0.785, 0.69], [0.802, 0.712], [0.812, 0.755], [0.818, 0.785],
  ]
  for (const [fx, fy] of reedBeds) {
    const lift = (layout.scene.feet - fy) * H
    spots.push({ x: fx * W + (random() - 0.5) * 0.12, depth: depthAtLift(lift), size: 0.5 + random() * 0.2, map: reedMaps[Math.floor(random() * 3)], reed: true })
  }
  spots.sort((a, b) => b.depth - a.depth)
  spots.forEach((spot, index) => {
    const mesh = sprite(spot.map, { rooted: true })
    const scale = scaleAt(spot.depth)
    const width = spot.size * scale * (random() < 0.5 ? -1 : 1)
    mesh.scale.set(width, Math.abs(width) * (spot.reed ? 2 : 1), 1)
    mesh.position.set(spot.x, groundY + liftAt(spot.depth) - 0.03 * scale, -0.29 + index * 0.0002)
    plants.push({ mesh, phase: random() * Math.PI * 2, bend: spot.reed ? 0.05 : 0.075, x: spot.x, depth: spot.depth })
  })

  // Sun through the canopy.
  const rayMap = keep(rayTexture())
  const rays: { mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; phase: number; strength: number; lean: number }[] = []
  for (let x = ground.minX - 1; x < ground.maxX + 2; x += 1.5 + random() * 1.7) {
    const mesh = sprite(rayMap, { additive: true, colour: '#fff0b8', opacity: 0 })
    const lean = 0.34 + (random() - 0.5) * 0.06
    mesh.scale.set(1.1 + random() * 1.7, H * 0.78, 1)
    mesh.position.set(x, yAt(0.36), -0.31)
    mesh.rotation.z = lean
    rays.push({ mesh, phase: random() * Math.PI * 2, strength: 0.15 + random() * 0.13, lean })
  }

  // Pollen drifting through the light.
  const glow = keep(glowTexture())
  const motes = Array.from({ length: still ? 0 : 54 }, () => {
    const mesh = sprite(glow, { additive: true, colour: random() < 0.5 ? '#fff6c8' : '#ffffff', opacity: 0 })
    const size = 0.04 + random() * 0.07
    mesh.scale.set(size, size, 1)
    return {
      mesh,
      x: ground.minX - 2 + random() * (ground.maxX - ground.minX + 4),
      y: groundY + 0.2 + random() * 4.4,
      rise: 0.03 + random() * 0.07,
      drift: 0.05 + random() * 0.1,
      phase: random() * Math.PI * 2,
      glow: 0.35 + random() * 0.5,
    }
  })

  // Blossom shaken loose from the trees.
  const petalMap = keep(petalTexture())
  const petalTints = ['#ff9cc0', '#ffc4d8', '#f77fae', '#ffe3ec']
  const span = ground.maxX - ground.minX + 5
  const petals = Array.from({ length: still ? 0 : 30 }, () => {
    const mesh = sprite(petalMap, { colour: petalTints[Math.floor(random() * petalTints.length)], opacity: 0 })
    mesh.position.z = -0.15
    const petal = { mesh, x: 0, y: 0, land: 0, fall: 0, drift: 0, phase: 0, size: 0, rest: 0 }
    const start = (fresh: boolean) => {
      petal.x = ground.minX - 2.5 + random() * span
      petal.land = groundY - 0.2 + random() * (FAR_LIFT + 0.3)
      petal.y = fresh ? petal.land + random() * 5 : yAt(0.08 + random() * 0.36)
      petal.fall = 0.28 + random() * 0.3
      petal.drift = 0.12 + random() * 0.22
      petal.phase = random() * Math.PI * 2
      petal.size = 0.07 + random() * 0.06
      petal.rest = 0
    }
    start(true)
    return { petal, start }
  })

  // The gate back to the museum: stars that twinkle in its doorway and a sign that swings on its chains.
  const gate = POND_LANDMARKS.find((landmark) => landmark.kind === 'exit')!
  const gateHeight = gate.width / gate.aspect
  const GATE = { w: 920, h: 1369 }
  const gateAt = (px: number, py: number) => ({
    x: gate.x + (px / GATE.w - 0.5) * gate.width,
    y: groundY + (1 - py / GATE.h) * gateHeight,
  })
  const gatePx = gate.width / GATE.w
  const doorGlow = sprite(glow, { additive: true, colour: '#8d86ff', opacity: 0.2 })
  const glowAt = gateAt(460, 1010)
  doorGlow.position.set(glowAt.x, glowAt.y, -0.195)
  doorGlow.scale.set(470 * gatePx, 900 * gatePx, 1)
  const starMap = keep(starTexture())
  const gateStars = [
    [326, 668, 26], [582, 808, 34], [352, 1018, 22], [562, 1098, 16], [482, 598, 14], [300, 880, 12], [600, 610, 10],
    [532, 648, 5], [310, 858, 5], [442, 918, 4], [612, 968, 5], [392, 1168, 4], [520, 1230, 5], [330, 1250, 4],
  ].map(([px, py, radius], index) => {
    const mesh = radius > 8 ? sprite(starMap) : sprite(glow, { colour: '#fff3d2' })
    const at = gateAt(px, py)
    mesh.position.set(at.x, at.y, -0.19)
    return { mesh, size: radius * (radius > 8 ? 2 : 3.2) * gatePx, phase: index * 2.4, speed: 0.9 + (index % 4) * 0.35 }
  })
  const gateMotes = Array.from({ length: still ? 0 : 7 }, () => {
    const mesh = sprite(glow, { additive: true, colour: '#cfc8ff', opacity: 0 })
    mesh.position.z = -0.188
    return { mesh, px: 250 + random() * 420, t: random(), speed: 0.05 + random() * 0.06, phase: random() * 6, size: (16 + random() * 16) * gatePx }
  })
  const signSwing = new THREE.Group()
  const signPivot = gateAt(460, 222)
  signSwing.position.set(signPivot.x, signPivot.y, -0.185)
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(400 * gatePx, 296 * gatePx).translate(0, -148 * gatePx, 0),
    new THREE.MeshBasicMaterial({ map: art.gateSign, transparent: true, depthWrite: false }),
  )
  signSwing.add(signMesh)
  group.add(signSwing)
  const gatePetals = Array.from({ length: still ? 0 : 6 }, () => {
    const mesh = sprite(petalMap, { colour: petalTints[Math.floor(random() * petalTints.length)], opacity: 0 })
    mesh.position.z = -0.15
    return { mesh, x: 0, y: 0, land: 0, phase: random() * 6, wait: random() * 6, size: 0.06 + random() * 0.04, drift: 0 }
  })

  // The journal's lantern burns with a small unsteady flame.
  const journal = POND_LANDMARKS.find((landmark) => landmark.kind === 'fishdex')!
  const journalWidth = journal.width * scaleAt(journal.depth)
  const lanternX = journal.x + (1128 / 1380 - 0.5) * journalWidth
  const lanternY = groundY + liftAt(journal.depth) + (1 - 195 / 770) * (journalWidth / journal.aspect)
  const lantern = sprite(glow, { additive: true, colour: '#ffc45e', opacity: 0.5 })
  lantern.position.set(lanternX, lanternY, -0.19)
  const flame = sprite(glow, { additive: true, colour: '#fff2b0', opacity: 0.7 })
  flame.position.set(lanternX, lanternY, -0.189)

  // Butterflies wander between the flowers.
  const wing = keep(wingTexture())
  const flutter = [
    { home: -3.3, colour: '#fff8ec' },
    { home: 2.9, colour: '#ffe58a' },
    { home: 8.9, colour: '#c9b5f5' },
    { home: 11.4, colour: '#ffb3cf' },
    { home: 5.6, colour: '#fff8ec' },
  ].slice(0, still ? 0 : 5).map(({ home, colour }) => {
    const body = new THREE.Group()
    const wings = [1, -1].map((side) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1.5).translate(0.5, 0, 0),
        new THREE.MeshBasicMaterial({ map: wing, transparent: true, depthWrite: false, color: colour }),
      )
      mesh.userData.side = side
      body.add(mesh)
      return mesh
    })
    body.position.set(home, groundY + 1.4, -0.14)
    group.add(body)
    return {
      body,
      wings,
      home,
      x: home + (random() - 0.5) * 2,
      y: groundY + 0.8 + random() * 1.6,
      vx: 0,
      vy: 0,
      goal: { x: home, y: groundY + 1.5 },
      until: 0,
      phase: random() * 10,
      size: 0.13 + random() * 0.04,
    }
  })

  // The edges of the view fall into shade, and near leaves slide past faster than the garden behind them.
  const vignette = sprite(keep(vignetteTexture()))
  vignette.position.z = -0.13
  const frontMaps = [0, 1, 2].map((index) => keep(frontTexture(91 + index * 29)))
  const fronts: { mesh: THREE.Mesh; x: number; phase: number }[] = []
  for (let x = ground.minX - 4; x < ground.maxX + 6; x += 1.5 + random() * 1.9) {
    const mesh = sprite(frontMaps[Math.floor(random() * 3)], { rooted: true })
    const width = (1.5 + random() * 1.1) * (random() < 0.5 ? -1 : 1)
    mesh.scale.set(width, Math.abs(width) * (0.4 + random() * 0.16), 1)
    mesh.position.z = -0.125
    fronts.push({ mesh, x, phase: random() * Math.PI * 2 })
  }

  let clock = 0

  function update(now: number, dt: number, camera: THREE.OrthographicCamera): void {
    const step = still ? 0 : Math.min(dt, 0.05)
    clock += step
    const t = still ? 0 : now / 1000
    waterMaterial.uniforms.uTime.value = t

    for (const swimmer of swimmers) {
      const angle = swimmer.phase + t * swimmer.speed
      const y = swimmer.home.y + Math.sin(angle * 2) * swimmer.reachY
      const size = swimmer.size * waterScale(y)
      const heading = Math.cos(angle) * swimmer.speed >= 0 ? 1 : -1
      swimmer.mesh.position.set(swimmer.home.x + Math.sin(angle) * swimmer.reachX, y, -0.46)
      swimmer.mesh.scale.set(size * heading * (1 + 0.04 * Math.sin(t * 5 + swimmer.phase)), size * 0.5, 1)
      const edge = Math.abs(swimmer.mesh.position.x - waterCentre.x) / waterRadius.x
      swimmer.mesh.material.opacity = 0.3 * (1 - THREE.MathUtils.smoothstep(edge, 0.62, 0.86))
    }

    if (!still) {
      nextRipple -= step
      if (nextRipple <= 0) {
        const at = waterPoint(0.7)
        ripple(at.x, at.y, 0.5 + random() * 0.5)
        nextRipple = 1.8 + random() * 3.4
      }
      leap.wait -= step
      if (leap.wait <= 0 && leap.age >= 1) {
        leap.age = 0
        leap.from = waterPoint(0.45)
        leap.way = random() < 0.5 ? -1 : 1
        leap.height = 0.42 + random() * 0.3
        leap.wait = 9 + random() * 12
        ripple(leap.from.x, leap.from.y, 0.7)
      }
    }
    for (const ring of rings) {
      if (ring.age >= 1) {
        ring.mesh.material.opacity = 0
        continue
      }
      ring.age += step / 2.2
      const grow = 0.25 + 0.75 * (1 - Math.pow(1 - ring.age, 2))
      ring.mesh.scale.set(ring.size * grow, ring.size * grow * 0.3, 1)
      ring.mesh.material.opacity = 0.7 * (1 - ring.age) * Math.min(1, ring.age * 8)
    }
    if (leap.age < 1) {
      const was = leap.age
      leap.age += step / 0.85
      const k = Math.min(1, leap.age)
      const size = 0.5 * waterScale(leap.from.y)
      const slope = leap.height * 4 * (1 - 2 * k)
      koi.position.x = leap.from.x + leap.way * 0.6 * k
      koi.position.y = leap.from.y + leap.height * 4 * k * (1 - k)
      koi.rotation.z = Math.atan2(slope, 0.6) * leap.way
      koi.scale.set(size * leap.way, size * 0.5, 1)
      koi.material.opacity = Math.min(1, k * 10, (1 - k) * 10)
      if (was < 1 && leap.age >= 1) ripple(koi.position.x, leap.from.y, 0.95)
    } else {
      koi.material.opacity = 0
    }

    for (const pad of pads) {
      pad.mesh.position.y = pad.y + Math.sin(t * 0.9 + pad.phase) * pad.sway
      pad.mesh.rotation.z = Math.sin(t * 0.6 + pad.phase * 1.3) * 0.018
    }

    for (const plant of plants) {
      const gust = Math.sin(plant.x * 0.45 - t * 0.7) * 0.5 + 0.5
      plant.mesh.rotation.z = (Math.sin(t * 1.5 + plant.phase) * 0.45 + gust * gust * 0.9 - 0.2) * plant.bend
    }

    for (const ray of rays) {
      ray.mesh.material.opacity = ray.strength * (0.62 + 0.38 * Math.sin(t * 0.32 + ray.phase))
      ray.mesh.rotation.z = ray.lean + Math.sin(t * 0.16 + ray.phase) * 0.012
    }

    for (const mote of motes) {
      mote.y += mote.rise * step
      mote.x += mote.drift * step
      if (mote.y > groundY + 4.8) mote.y = groundY + 0.1
      if (mote.x > ground.maxX + 2) mote.x = ground.minX - 2
      mote.mesh.position.set(mote.x + Math.sin(clock * 0.5 + mote.phase) * 0.18, mote.y, -0.16)
      mote.mesh.material.opacity = mote.glow * (0.4 + 0.6 * Math.pow(Math.sin(clock * 0.9 + mote.phase) * 0.5 + 0.5, 2))
    }

    for (const { petal, start } of petals) {
      if (petal.y > petal.land) {
        petal.y -= petal.fall * step
        petal.x += (petal.drift + Math.sin(clock * 1.4 + petal.phase) * 0.3) * step
        petal.mesh.rotation.z = Math.sin(clock * 1.7 + petal.phase) * 0.9
        petal.mesh.scale.set(petal.size * Math.cos(clock * 2.3 + petal.phase), petal.size, 1)
        petal.mesh.material.opacity = Math.min(0.95, (yAt(0.02) - petal.y) * 2)
      } else {
        petal.rest += step
        petal.mesh.scale.set(petal.size, petal.size * 0.45, 1)
        petal.mesh.material.opacity = 0.9 * Math.max(0, 1 - petal.rest / 2.4)
        if (petal.rest > 2.4) start(false)
      }
      petal.mesh.position.x = petal.x
      petal.mesh.position.y = petal.y
    }

    for (const twinkle of gateStars) {
      const pulse = Math.sin(t * twinkle.speed + twinkle.phase) * 0.5 + 0.5
      const size = twinkle.size * (0.62 + 0.5 * pulse)
      twinkle.mesh.scale.set(size, size, 1)
      twinkle.mesh.rotation.z = Math.sin(t * 0.4 + twinkle.phase) * 0.25
      twinkle.mesh.material.opacity = still ? 1 : 0.4 + 0.6 * pulse
    }
    doorGlow.material.opacity = 0.16 + 0.1 * Math.sin(t * 0.8)
    const flicker = still ? 0.6 : 0.55 + 0.25 * Math.sin(t * 7.3) * Math.sin(t * 3.1 + 1) + 0.2 * Math.sin(t * 1.3)
    lantern.scale.setScalar(journalWidth * (0.3 + 0.08 * flicker))
    lantern.material.opacity = 0.3 + 0.3 * flicker
    flame.scale.set(journalWidth * 0.07, journalWidth * (0.09 + 0.03 * flicker), 1)
    flame.material.opacity = 0.45 + 0.4 * flicker
    for (const mote of gateMotes) {
      mote.t = (mote.t + mote.speed * step) % 1
      const at = gateAt(mote.px + Math.sin(clock * 0.9 + mote.phase) * 26, 1300 - mote.t * 760)
      mote.mesh.position.x = at.x
      mote.mesh.position.y = at.y
      mote.mesh.scale.set(mote.size, mote.size, 1)
      mote.mesh.material.opacity = 0.75 * Math.sin(mote.t * Math.PI)
    }
    signSwing.rotation.z = Math.sin(t * 1.25) * 0.045 + Math.sin(t * 0.47 + 1) * 0.02
    for (const petal of gatePetals) {
      if (petal.wait > 0) {
        petal.wait -= step
        petal.mesh.material.opacity = 0
        if (petal.wait <= 0) {
          const from = gateAt(60 + random() * 800, 120 + random() * 380)
          petal.x = from.x
          petal.y = from.y
          petal.land = groundY - 0.15 + random() * 0.3
          petal.drift = (random() - 0.3) * 0.3
        }
        continue
      }
      petal.y -= 0.34 * step
      petal.x += (petal.drift + Math.sin(clock * 1.5 + petal.phase) * 0.28) * step
      petal.mesh.position.x = petal.x
      petal.mesh.position.y = petal.y
      petal.mesh.rotation.z = Math.sin(clock * 1.8 + petal.phase) * 0.9
      petal.mesh.scale.set(petal.size * Math.cos(clock * 2.4 + petal.phase), petal.size, 1)
      petal.mesh.material.opacity = Math.min(0.95, (petal.y - petal.land) * 3)
      if (petal.y <= petal.land) petal.wait = 1 + random() * 5
    }

    const viewWidth = camera.right - camera.left
    const viewHeight = camera.top - camera.bottom
    const floor = camera.position.y + camera.bottom
    vignette.position.x = camera.position.x + (camera.left + camera.right) / 2
    vignette.position.y = camera.position.y + (camera.top + camera.bottom) / 2
    vignette.scale.set(viewWidth * 1.04, viewHeight * 1.04, 1)
    for (const front of fronts) {
      front.mesh.position.x = front.x + (camera.position.x - front.x) * -0.35
      front.mesh.position.y = floor - 0.12
      front.mesh.rotation.z = Math.sin(t * 0.8 + front.phase) * 0.02
    }

    for (const fly of flutter) {
      fly.until -= step
      if (fly.until <= 0) {
        const low = random() < 0.35
        fly.goal = { x: fly.home + (random() - 0.5) * 4.4, y: groundY + (low ? 0.25 + random() * 0.4 : 0.9 + random() * 2.1) }
        fly.until = 1.6 + random() * 2.8
      }
      fly.vx += ((fly.goal.x - fly.x) * 0.9 - fly.vx * 1.5) * step
      fly.vy += ((fly.goal.y - fly.y) * 0.9 - fly.vy * 1.5) * step
      fly.x += fly.vx * step
      fly.y += fly.vy * step
      const beat = Math.sin(clock * 17 + fly.phase)
      fly.body.position.set(fly.x, fly.y + beat * 0.02, -0.14)
      fly.body.rotation.z = THREE.MathUtils.clamp(fly.vx * 0.5, -0.5, 0.5) * -1 + 0.15
      for (const mesh of fly.wings) {
        const side = mesh.userData.side as number
        mesh.scale.set(side * fly.size * (0.25 + 0.75 * Math.abs(beat)), fly.size, 1)
      }
    }
  }


  return {
    update,
    dispose() {
      for (const texture of textures) texture.dispose()
      unit.dispose()
      rootedUnit.dispose()
    },
  }
}
