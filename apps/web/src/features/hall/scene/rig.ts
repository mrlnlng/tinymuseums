import { setCostumeVisibility } from './costume-visibility'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js'
import { modelUrl } from '@/shared/lib/assets'
import type { RigState } from './rig-motion'

export type CharacterKind = 'bunny' | 'cat' | 'otter' | 'bruce'

interface Frame {
  width: number
  top: number
  bottom: number
  spriteTop: number
  feet: number
  centerX: number
}

interface RigSpec {
  model: 'bunnyRig' | 'catRig' | 'otterRig' | 'bruceRig'
  // A fixed frame in layer-canvas px, rather than reframing each animated pose. The standing
  // character spans spriteTop to feet, which callers size like the old sprite's full box; the
  // rest leaves room for ear twitches, the turn hop, the shadow and costumes. centerX is the
  // body's middle.
  frame: Frame
  squashY: number
  // The bunny's chest bow lives on the 1668 × 2388 layer canvas outside the export; costumes
  // hide it by this name.
  chestBow?: { name: string; bone: string; x: number; y: number; width: number; height: number; knotX: number; knotY: number; drawOrder: number }
  blink: { groups: readonly (readonly string[])[] }
  feet: readonly { bone: string; x: number; y: number }[]
  shadow: { x: number; y: number; width: number; height: number }
}

const SPECS: Record<CharacterKind, RigSpec> = {
  bunny: {
    model: 'bunnyRig',
    frame: { width: 1520, top: 48, bottom: 2262, spriteTop: 248, feet: 2162, centerX: 872 },
    squashY: 2143,
    chestBow: { name: 'bowtie', bone: 'chest', x: 809, y: 1146, width: 469, height: 581, knotX: 1005, knotY: 1262, drawOrder: 12 },
    blink: { groups: [['bunny_eye_L'], ['bunny_eye_R']] },
    feet: [{ bone: 'leg_L', x: 660, y: 2110 }, { bone: 'leg_R', x: 1180, y: 2120 }],
    shadow: { x: 900, y: 2128, width: 820, height: 110 },
  },
  cat: {
    model: 'catRig',
    frame: { width: 1740, top: 100, bottom: 2245, spriteTop: 225, feet: 2145, centerX: 840 },
    squashY: 2125,
    blink: { groups: [['cat_eye_L', 'cat_pupil_L'], ['cat_eye_R', 'cat_pupil_R']] },
    feet: [{ bone: 'leg_L', x: 720, y: 2120 }, { bone: 'leg_R', x: 1150, y: 2110 }],
    shadow: { x: 935, y: 2128, width: 860, height: 110 },
  },
  // Drawn on the same canvas scale as the bunny, so the otter stands a little shorter.
  otter: {
    model: 'otterRig',
    frame: { width: 1640, top: 100, bottom: 2280, spriteTop: 266, feet: 2170, centerX: 800 },
    squashY: 2150,
    blink: { groups: [['otter_eye_L'], ['otter_eye_R']] },
    feet: [{ bone: 'leg_L', x: 705, y: 2150 }, { bone: 'leg_R', x: 1200, y: 2116 }],
    shadow: { x: 900, y: 2150, width: 880, height: 110 },
  },
  bruce: {
    model: 'bruceRig',
    frame: { width: 1740, top: 100, bottom: 2262, spriteTop: 250, feet: 2162, centerX: 834 },
    squashY: 2143,
    blink: { groups: [['bruce_eye_L'], ['bruce_eye_R']] },
    feet: [{ bone: 'leg_L', x: 685, y: 2140 }, { bone: 'leg_R', x: 1133, y: 2080 }],
    shadow: { x: 910, y: 2140, width: 880, height: 110 },
  },
}

const canvasToModel = (x: number, y: number) => new THREE.Vector3((x - 834) / 1000, (1194 - y) / 1000, 0)

export interface RigAttachment {
  bone: string
  /** Position and width in the author's 1668 × 2388 layer canvas. */
  x: number
  y: number
  width: number
  rotation: number
}

export interface RigAttachmentPose {
  x: number
  y: number
  width: number
  rotation: number
}

export interface Rig {
  readonly kind: CharacterKind
  /** Canvas width over height. */
  readonly aspect: number
  /** Canvas height for a standing character one unit tall, as the old sprite was drawn. */
  readonly spriteScale: number
  /** Where the feet sit, as a fraction of the canvas height from its top. */
  readonly feet: number
  readonly cycleSeconds: number
  readonly costumes: readonly string[]
  setCostume(id: string | null, bow?: string | null): void
  /** `at` is the top-left corner in CSS pixels, for a rig drawn into a layer. */
  render(state: RigState, dt: number, height: number, pixelRatio: number, at?: { left: number; top: number }): void
  projectAttachment(anchor: RigAttachment, out: RigAttachmentPose): boolean
  /**
   * The floor shadow from the last render, in canvas heights from the canvas's middle and the
   * feet. The rig fades its own shadow out in the air, where the caller draws this one on the floor.
   */
  readonly floorShadow: { x: number; y: number; width: number; height: number }
  dispose(): void
}

function createRenderer(canvas?: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setClearColor(0, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  return renderer
}

/**
 * One transparent WebGL canvas that many rigs draw into, each in its own rectangle, so a crowd
 * costs one context. Clear it once per frame with `clearRigLayer`, then render each rig with
 * its top-left corner in the layer's CSS pixels.
 */
export function createRigLayer(canvas?: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = createRenderer(canvas)
  renderer.autoClear = false
  return renderer
}

export function clearRigLayer(layer: THREE.WebGLRenderer): void {
  layer.setScissorTest(false)
  layer.clear()
  layer.setScissorTest(true)
}

interface Resources {
  geometries: Set<THREE.BufferGeometry>
  materials: Set<THREE.Material>
  textures: Set<THREE.Texture>
}

const newResources = (): Resources => ({ geometries: new Set(), materials: new Set(), textures: new Set() })

function releaseTexture(texture: THREE.Texture): void {
  texture.dispose()
  const image = texture.image as { close?: () => void } | undefined
  image?.close?.()
}

function release(resources: Resources): void {
  for (const geometry of resources.geometries) geometry.dispose()
  for (const material of resources.materials) material.dispose()
  for (const texture of resources.textures) releaseTexture(texture)
}

function paintedMap(map: THREE.Texture): THREE.Texture {
  map.colorSpace = THREE.SRGBColorSpace
  // The source has dark RGB outside its alpha silhouette. Generated mipmaps
  // blend those pixels into the white face and expose a false neck outline.
  // Supersample the small canvas instead, preserving the painted layer joins.
  map.minFilter = THREE.LinearFilter
  map.magFilter = THREE.LinearFilter
  map.generateMipmaps = false
  map.wrapS = THREE.ClampToEdgeWrapping
  map.wrapT = THREE.ClampToEdgeWrapping
  return map
}

function paintedMaterial(map: THREE.Texture): THREE.MeshBasicMaterial {
  const material = new THREE.MeshBasicMaterial({
    map,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    toneMapped: false,
  })
  material.forceSinglePass = true
  return material
}

/** A character's model with its painted materials, before any one rig poses it. */
interface Template {
  scene: THREE.Group
  clip: THREE.AnimationClip
  bowMap: THREE.Texture | null
  resources: Resources
}

async function loadTemplate(kind: CharacterKind): Promise<Template> {
  const spec = SPECS[kind]
  const bowLoad = spec.chestBow
    ? new THREE.TextureLoader().loadAsync(modelUrl('bunnyRigBow')).catch((error) => {
        console.warn('[hall] bunny bow unavailable', error)
        return null
      })
    : Promise.resolve(null)
  let gltf
  let bowMap
  try {
    [gltf, bowMap] = await Promise.all([new GLTFLoader().loadAsync(modelUrl(spec.model)), bowLoad])
  } catch (error) {
    void bowLoad.then((texture) => texture?.dispose())
    throw error
  }

  const resources = newResources()
  const unusedTextures = new Set<THREE.Texture>()
  gltf.scene.traverse((node) => {
    if (node.userData.layer === 'costume') node.visible = false
    if (!(node instanceof THREE.Mesh)) return
    resources.geometries.add(node.geometry)
    const original = (Array.isArray(node.material) ? node.material : [node.material]) as THREE.MeshStandardMaterial[]
    const replacements = original.map((material) => {
      const map = material.emissiveMap ?? material.map
      if (!map) throw new Error(`Missing painted texture on ${node.name}`)
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) unusedTextures.add(value)
      }
      material.dispose()
      resources.textures.add(paintedMap(map))
      const painted = paintedMaterial(map)
      resources.materials.add(painted)
      return painted
    })
    node.material = Array.isArray(node.material) ? replacements : replacements[0]
    node.renderOrder = Number(node.userData.draw_order ?? 0)
    // Animated ears/feet can leave the bind-pose bounds.
    node.frustumCulled = false
  })
  for (const texture of unusedTextures) {
    if (!resources.textures.has(texture)) releaseTexture(texture)
  }
  if (bowMap) resources.textures.add(paintedMap(bowMap))

  const clip = gltf.animations.find((animation) => animation.name === 'walk')
  if (!clip) {
    release(resources)
    throw new Error(`The ${kind} rig has no walk clip`)
  }
  return { scene: gltf.scene, clip, bowMap, resources }
}

// A layer's rigs share each character's model, so a crowd parses and uploads it once.
const layerTemplates = new WeakMap<THREE.WebGLRenderer, Map<CharacterKind, Promise<Template>>>()

function sharedTemplate(layer: THREE.WebGLRenderer, kind: CharacterKind): Promise<Template> {
  let templates = layerTemplates.get(layer)
  if (!templates) {
    templates = new Map()
    layerTemplates.set(layer, templates)
  }
  let template = templates.get(kind)
  if (!template) {
    const cache = templates
    template = loadTemplate(kind)
    template.catch(() => cache.delete(kind))
    templates.set(kind, template)
  }
  return template
}

/** Releases a layer and the models its rigs shared; dispose its rigs first. */
export function disposeRigLayer(layer: THREE.WebGLRenderer): void {
  for (const template of layerTemplates.get(layer)?.values() ?? []) {
    void template.then((loaded) => release(loaded.resources), () => {})
  }
  layerTemplates.delete(layer)
  layer.dispose()
  layer.forceContextLoss()
}

/** Without `layer` the rig owns a WebGL context on `canvas`; with it, it draws into the layer. */
export async function loadRig(canvas: HTMLCanvasElement | null, kind: CharacterKind, layer?: THREE.WebGLRenderer): Promise<Rig> {
  const spec = SPECS[kind]
  const { frame } = spec
  if (!canvas && !layer) throw new Error('loadRig needs a canvas or a layer')
  const renderer = layer ?? createRenderer(canvas!)
  const releaseRenderer = () => {
    if (layer) return
    renderer.dispose()
    renderer.forceContextLoss()
  }
  const layerSize = new THREE.Vector2()

  let template: Template
  try {
    template = await (layer ? sharedTemplate(layer, kind) : loadTemplate(kind))
  } catch (error) {
    releaseRenderer()
    throw error
  }
  const model = layer ? cloneSkinned(template.scene) : template.scene
  const { clip, bowMap } = template
  // What this rig adds to the model: its shadow and the chest bow.
  const own = newResources()
  const skeletons = new Set<THREE.Skeleton>()
  const costumeParts = new Map<string, THREE.Object3D[]>()
  model.traverse((node) => {
    if (node.userData.layer === 'costume') {
      const id = String(node.userData.costume)
      costumeParts.set(id, [...(costumeParts.get(id) ?? []), node])
    }
    if (node instanceof THREE.SkinnedMesh) skeletons.add(node.skeleton)
  })

  const scene = new THREE.Scene()
  scene.add(model)
  const frameHeight = frame.bottom - frame.top
  const halfHeight = frameHeight / 2000
  const halfWidth = frame.width / 2000
  const bodyX = canvasToModel(frame.centerX, 0).x
  const camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 100)
  const squashY = canvasToModel(0, spec.squashY).y
  camera.position.set(bodyX, canvasToModel(0, (frame.top + frame.bottom) / 2).y, 10)
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
  const mixer = new THREE.AnimationMixer(model)
  const walkAction = mixer.clipAction(clip).play()
  // Frame 0 of the walk is the standing pose; blending towards it eases each stop.
  const restAction = mixer.clipAction(clip.clone()).play()
  const anchors = new Map<RigAttachment, { at: THREE.Object3D; right: THREE.Object3D }>()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  let width = 0
  let height = 0
  let ratio = 0
  let lastFacing = 'right'

  // Create sockets against the rest skeleton before applying animation.
  model.updateMatrixWorld(true)
  const restInverse = new Map<string, THREE.Matrix4>()
  model.traverse((node) => {
    if (node instanceof THREE.Bone) restInverse.set(node.name, node.matrixWorld.clone().invert())
  })

  const bowPivot = new THREE.Object3D()
  const bowSpec = spec.chestBow
  const bowBone = bowSpec ? model.getObjectByName(bowSpec.bone) : undefined
  const bowInverse = bowSpec ? restInverse.get(bowSpec.bone) : undefined
  let chestBow: THREE.Mesh | null = null
  if (bowSpec && bowMap && bowBone && bowInverse) {
    const geometry = new THREE.PlaneGeometry(bowSpec.width / 1000, bowSpec.height / 1000)
    own.geometries.add(geometry)
    const material = paintedMaterial(bowMap)
    own.materials.add(material)
    chestBow = new THREE.Mesh(geometry, material)
    chestBow.name = bowSpec.name
    chestBow.renderOrder = bowSpec.drawOrder
    chestBow.frustumCulled = false
    chestBow.position.copy(canvasToModel(bowSpec.x + bowSpec.width / 2, bowSpec.y + bowSpec.height / 2))
    chestBow.applyMatrix4(bowInverse)
    bowBone.add(chestBow)
    bowPivot.position.copy(canvasToModel(bowSpec.knotX, bowSpec.knotY)).applyMatrix4(bowInverse)
    bowBone.add(bowPivot)
    model.updateMatrixWorld(true)
    bowPivot.attach(chestBow)
  }

  // Each blinker scales about its own centre.
  const blinkers: THREE.Object3D[] = []
  const box = new THREE.Box3()
  for (const names of spec.blink.groups) {
    const meshes = names.flatMap((name) => {
      const mesh = model.getObjectByName(name)
      return mesh instanceof THREE.Mesh && mesh.parent ? [mesh] : []
    })
    if (meshes.length === 0) continue
    box.makeEmpty()
    for (const mesh of meshes) box.expandByObject(mesh)
    const pivot = new THREE.Object3D()
    meshes[0].parent!.add(pivot)
    pivot.position.copy(meshes[0].parent!.worldToLocal(box.getCenter(a)))
    model.updateMatrixWorld(true)
    for (const mesh of meshes) pivot.attach(mesh)
    blinkers.push(pivot)
  }

  const baseHidden = new Set<THREE.Object3D>()
  function setCostume(id: string | null, bow: string | null = id): void {
    setCostumeVisibility(costumeParts, baseHidden, name => model.getObjectByName(name), id, bow)
  }

  const shadowCanvas = document.createElement('canvas')
  shadowCanvas.width = 128
  shadowCanvas.height = 32
  const shadowPaint = shadowCanvas.getContext('2d')
  if (shadowPaint) {
    shadowPaint.setTransform(1, 0, 0, 0.25, 0, 0)
    const gradient = shadowPaint.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(60, 30, 20, 0.45)')
    gradient.addColorStop(0.6, 'rgba(60, 30, 20, 0.28)')
    gradient.addColorStop(1, 'rgba(60, 30, 20, 0)')
    shadowPaint.fillStyle = gradient
    shadowPaint.fillRect(0, 0, 128, 128)
  }
  const shadowGeometry = new THREE.PlaneGeometry(spec.shadow.width / 1000, spec.shadow.height / 1000)
  own.geometries.add(shadowGeometry)
  const shadowTexture = paintedMap(new THREE.CanvasTexture(shadowCanvas))
  own.textures.add(shadowTexture)
  const shadowMaterial = paintedMaterial(shadowTexture)
  own.materials.add(shadowMaterial)
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
  const shadowAt = canvasToModel(spec.shadow.x, spec.shadow.y)
  shadow.position.copy(shadowAt)
  // Above the broom, which is drawn behind everything at order 0.
  shadow.renderOrder = 1
  shadow.frustumCulled = false
  scene.add(shadow)

  const feet = spec.feet.flatMap((foot) => {
    const bone = model.getObjectByName(foot.bone)
    const inverse = restInverse.get(foot.bone)
    if (!bone || !inverse) return []
    const rest = canvasToModel(foot.x, foot.y)
    return [{ bone, local: rest.clone().applyMatrix4(inverse), restY: rest.y }]
  })

  const hips = model.getObjectByName('hips')
  const head = model.getObjectByName('head')
  const chest = model.getObjectByName('chest')
  const ears = ['ear_L', 'ear_R'].map((name) => model.getObjectByName(name))
  const [armBack, armFront] = ['arm_L', 'arm_R'].map((name) => model.getObjectByName(name))
  const [legBack, legFront] = ['leg_L', 'leg_R'].map((name) => model.getObjectByName(name))
  const tail = model.getObjectByName('tail')
  const floorShadow = { x: 0, y: 0, width: 0, height: 0 }
  // The mixer only rewrites a bone when its clip value changes, so idle offsets are undone
  // before the next update. They stay applied between renders for attachments.
  const posed = [hips, head, ...ears, armBack, armFront, legBack, legFront, tail].flatMap((node) =>
    node ? [{ node, scale: new THREE.Vector3(), quaternion: new THREE.Quaternion() }] : [],
  )
  const zAxis = new THREE.Vector3(0, 0, 1)
  const turnQuaternion = new THREE.Quaternion()
  let clock = 0
  let nextBlink = 2 + Math.random() * 3
  let blinkAt = -1
  let nextTwitch = 3 + Math.random() * 4
  let twitchAt = -1
  let twitchEar = 0
  let bowAngle = 0
  let bowSpin = 0
  let lastSpeed = 0
  let lastSign = 0
  let posedOnce = false

  function rotateInPlane(bone: THREE.Object3D | undefined, angle: number): void {
    if (bone && angle) bone.quaternion.premultiply(turnQuaternion.setFromAxisAngle(zAxis, angle))
  }

  // Angles are for a character facing right; the mirrored model turns them for the left.
  function poseJump(air: number, rise: number, squash: number): void {
    // Positive turns a bone counterclockwise on screen: ears lean back, legs and arms swing forward.
    const deg = -Math.PI / 180
    // Ears and tail trail the motion: swept back going up, floating forward coming down.
    const trail = 24 * rise * air
    // A crouch or a landing tips the ears forward.
    const dip = 70 * Math.min(0, squash)
    rotateInPlane(ears[0], deg * (trail + 6 * air + dip))
    rotateInPlane(ears[1], deg * (trail - 4 * air + dip))
    rotateInPlane(tail, deg * -18 * rise * air)
    rotateInPlane(head, deg * 7 * rise * air)
    // Arms fly up and out, more on the way down; legs tuck, the front one forward.
    const reach = (32 + 14 * Math.max(0, -rise)) * air
    rotateInPlane(armFront, deg * reach)
    rotateInPlane(armBack, deg * -reach)
    rotateInPlane(legFront, deg * (18 + 8 * rise) * air)
    rotateInPlane(legBack, deg * -(22 + 10 * rise) * air)
  }

  // The chest and its parents only rotate in the drawing plane.
  function planeAngle(node: THREE.Object3D): number {
    let angle = 0
    for (let at: THREE.Object3D | null = node; at && at !== model; at = at.parent) {
      angle += 2 * Math.atan2(at.quaternion.z, at.quaternion.w)
    }
    return Math.atan2(Math.sin(angle), Math.cos(angle))
  }

  function dispose(): void {
    walkAction.stop()
    restAction.stop()
    mixer.stopAllAction()
    mixer.uncacheRoot(model)
    release(own)
    for (const skeleton of skeletons) skeleton.dispose()
    if (!layer) release(template.resources)
    releaseRenderer()
  }

  return {
    kind,
    aspect: frame.width / frameHeight,
    spriteScale: frameHeight / (frame.feet - frame.spriteTop),
    feet: (frame.feet - frame.top) / frameHeight,
    cycleSeconds: clip.duration,
    costumes: [...costumeParts.keys()],
    setCostume,
    render(state, dt, nextHeight, pixelRatio, at) {
      const nextRatio = Math.min(3, Math.max(2, pixelRatio))
      const nextWidth = nextHeight * frame.width / frameHeight
      const resized = height !== nextHeight || ratio !== nextRatio
      if (resized) {
        width = nextWidth
        height = nextHeight
        ratio = nextRatio
        if (!layer) {
          renderer.setPixelRatio(ratio)
          renderer.setSize(width, height, false)
        }
      }
      clock += dt
      const walk = state.walk * state.walk * (3 - 2 * state.walk)
      const idle = 1 - walk
      walkAction.time = (((state.phase % 1) + 1) % 1) * clip.duration
      walkAction.setEffectiveWeight(walk)
      restAction.time = 0
      restAction.setEffectiveWeight(idle)
      if (posedOnce) {
        for (const bone of posed) {
          bone.node.scale.copy(bone.scale)
          bone.node.quaternion.copy(bone.quaternion)
        }
      }
      posedOnce = true
      mixer.update(0)
      for (const bone of posed) {
        bone.scale.copy(bone.node.scale)
        bone.quaternion.copy(bone.node.quaternion)
      }

      // Turning squeezes the character through edge-on with a small hop.
      const across = Math.sin((state.turn * Math.PI) / 2)
      const sign = across >= 0 ? 1 : -1
      const hop = 1 - across * across
      // A jump squashes the body against the floor and stretches it in the air, keeping its volume.
      const squash = state.squash
      model.scale.set(sign * Math.max(0.04, Math.abs(across)) * (1 - 0.6 * squash), (1 + 0.05 * hop) * (1 + squash), 1)
      model.position.y = squashY * (1 - model.scale.y) + 0.03 * hop
      // Keep the body, not the mirror line, in the middle of the frame for either facing.
      camera.position.x = bodyX * model.scale.x
      camera.updateMatrixWorld()

      const breath = Math.sin((clock * Math.PI * 2) / 2.8)
      if (hips) {
        hips.scale.y *= 1 + 0.018 * breath * idle
        hips.scale.x *= 1 - 0.008 * breath * idle
      }
      rotateInPlane(head, (Math.PI / 180) * 1.2 * Math.sin((clock * Math.PI * 2) / 2.8 - 0.6) * idle)

      if (clock >= nextTwitch) {
        twitchAt = clock
        twitchEar = Math.random() < 0.5 ? 0 : 1
        nextTwitch = clock + 3 + Math.random() * 5
      }
      const twitch = clock - twitchAt
      if (twitchAt >= 0 && twitch < 0.36) {
        const flick = twitch < 0.2 ? Math.sin((Math.PI * twitch) / 0.2) : -0.5 * Math.sin((Math.PI * (twitch - 0.2)) / 0.16)
        rotateInPlane(ears[twitchEar], (Math.PI / 180) * 8 * flick * (twitchEar === 0 ? 1 : -1) * idle)
      }

      if (state.air > 0 || squash !== 0) poseJump(state.air, state.rise, squash)

      if (clock >= nextBlink) {
        blinkAt = clock
        nextBlink = clock + 2.2 + Math.random() * 3.5
      }
      const blink = clock - blinkAt
      const lid = blinkAt >= 0 && blink < 0.14 ? 1 - 0.88 * Math.sin((Math.PI * blink) / 0.14) : 1
      for (const eye of blinkers) eye.scale.y = lid

      model.updateMatrixWorld(true)

      // The bow hangs from its knot and trails the chest's sway, starts, stops and turns.
      if (dt > 0 && chest && chestBow?.visible) {
        const body = planeAngle(chest)
        // Keep the spring stable through long frames, such as after a background tab.
        const step = Math.min(dt, 1 / 30)
        const accel = (state.speed - lastSpeed) / dt
        if (lastSign && sign !== lastSign) bowSpin -= 1.5
        bowSpin += (-70 * (bowAngle - body) - 5 * bowSpin) * step - accel * dt
        bowAngle += bowSpin * step
        const trail = Math.max(-0.2, Math.min(0.2, bowAngle - body))
        bowAngle = body + trail
        bowPivot.rotation.z = trail + (Math.PI / 180) * 1.5 * Math.sin(clock * 1.9) * (0.4 + 0.6 * idle)
        bowPivot.updateMatrixWorld(true)
      }
      lastSpeed = state.speed
      lastSign = sign

      let lift = 0
      for (const foot of feet) {
        const y = model.worldToLocal(foot.bone.localToWorld(a.copy(foot.local))).y
        lift = Math.max(lift, y - foot.restY)
      }
      lift += 0.03 * hop
      shadow.position.x = shadowAt.x * model.scale.x
      shadow.scale.set(Math.max(0.6, Math.abs(across)) * (1 - 2.5 * lift), 1 - 2.5 * lift, 1)
      shadowMaterial.opacity = Math.max(0, 1 - 6 * lift) * (1 - state.air)
      floorShadow.x = ((spec.shadow.x - frame.centerX) * model.scale.x) / frameHeight
      floorShadow.y = (spec.shadow.y - frame.feet) / frameHeight
      floorShadow.width = (spec.shadow.width * Math.max(0.6, Math.abs(across))) / frameHeight
      floorShadow.height = spec.shadow.height / frameHeight

      if (layer) {
        // WebGL counts up from the bottom left.
        const bottom = renderer.getSize(layerSize).y - (at?.top ?? 0) - height
        renderer.setViewport(at?.left ?? 0, bottom, width, height)
        renderer.setScissor(at?.left ?? 0, bottom, width, height)
      }
      renderer.render(scene, camera)
      lastFacing = sign < 0 ? 'left' : 'right'
    },

    floorShadow,

    projectAttachment(anchor, out) {
      let socket = anchors.get(anchor)
      if (!socket) {
        const bone = model.getObjectByName(anchor.bone)
        const inverse = restInverse.get(anchor.bone)
        if (!bone || !inverse) return false
        const at = new THREE.Object3D()
        const right = new THREE.Object3D()
        at.name = `socket_${anchor.bone}_${anchors.size}`
        at.position.copy(canvasToModel(anchor.x, anchor.y)).applyMatrix4(inverse)
        right.position.copy(canvasToModel(anchor.x + anchor.width, anchor.y)).applyMatrix4(inverse)
        bone.add(at, right)
        socket = { at, right }
        anchors.set(anchor, socket)
      }
      socket.at.getWorldPosition(a).project(camera)
      socket.right.getWorldPosition(b).project(camera)
      out.x = (a.x * 0.5 + 0.5) * width
      out.y = (-a.y * 0.5 + 0.5) * height
      const dx = (b.x - a.x) * width / 2
      const dy = -(b.y - a.y) * height / 2
      const sign = lastFacing === 'left' ? -1 : 1
      out.width = Math.hypot(dx, dy)
      out.rotation = Math.atan2(dy * sign, dx * sign) * 180 / Math.PI
      return true
    },

    dispose,
  }
}
