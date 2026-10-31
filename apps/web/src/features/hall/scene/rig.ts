import { setCostumeVisibility } from './costume-visibility'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { modelUrl } from '@/shared/lib/assets'
import type { RigState } from './rig-motion'

export type CharacterKind = 'bunny' | 'cat' | 'otter'

interface Frame {
  width: number
  top: number
  bottom: number
  spriteTop: number
  feet: number
  centerX: number
}

interface RigSpec {
  model: 'bunnyRig' | 'catRig' | 'otterRig'
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
  render(state: RigState, dt: number, height: number, pixelRatio: number): void
  projectAttachment(anchor: RigAttachment, out: RigAttachmentPose): boolean
  dispose(): void
}

export async function loadRig(canvas: HTMLCanvasElement, kind: CharacterKind): Promise<Rig> {
  const spec = SPECS[kind]
  const { frame } = spec
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setClearColor(0, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping

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
    renderer.dispose()
    renderer.forceContextLoss()
    void bowLoad.then((texture) => texture?.dispose())
    throw error
  }

  const model = gltf.scene
  const clip = gltf.animations.find((animation) => animation.name === 'walk')
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  const unusedTextures = new Set<THREE.Texture>()
  const skeletons = new Set<THREE.Skeleton>()

  function paintedMaterial(map: THREE.Texture): THREE.MeshBasicMaterial {
    map.colorSpace = THREE.SRGBColorSpace
    // The source has dark RGB outside its alpha silhouette. Generated mipmaps
    // blend those pixels into the white face and expose a false neck outline.
    // Supersample the small canvas instead, preserving the painted layer joins.
    map.minFilter = THREE.LinearFilter
    map.magFilter = THREE.LinearFilter
    map.generateMipmaps = false
    map.wrapS = THREE.ClampToEdgeWrapping
    map.wrapT = THREE.ClampToEdgeWrapping
    textures.add(map)
    const material = new THREE.MeshBasicMaterial({
      map,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide,
      toneMapped: false,
    })
    material.forceSinglePass = true
    materials.add(material)
    return material
  }

  const costumeParts = new Map<string, THREE.Object3D[]>()
  model.traverse((node) => {
    if (node.userData.layer === 'costume') {
      const id = String(node.userData.costume)
      costumeParts.set(id, [...(costumeParts.get(id) ?? []), node])
      node.visible = false
    }
    if (!(node instanceof THREE.Mesh)) return
    geometries.add(node.geometry)
    const original = (Array.isArray(node.material) ? node.material : [node.material]) as THREE.MeshStandardMaterial[]
    const replacements = original.map((material) => {
      const map = material.emissiveMap ?? material.map
      if (!map) throw new Error(`Missing painted texture on ${node.name}`)
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) unusedTextures.add(value)
      }
      material.dispose()
      return paintedMaterial(map)
    })
    node.material = Array.isArray(node.material) ? replacements : replacements[0]
    node.renderOrder = Number(node.userData.draw_order ?? 0)
    // Animated ears/feet can leave the bind-pose bounds.
    node.frustumCulled = false
    if (node instanceof THREE.SkinnedMesh) skeletons.add(node.skeleton)
  })

  function releaseTexture(texture: THREE.Texture): void {
    texture.dispose()
    const image = texture.image as { close?: () => void } | undefined
    image?.close?.()
  }

  for (const texture of unusedTextures) {
    if (!textures.has(texture)) releaseTexture(texture)
  }

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
  const walkAction = clip ? mixer.clipAction(clip).play() : null
  // Frame 0 of the walk is the standing pose; blending towards it eases each stop.
  const restAction = clip ? mixer.clipAction(clip.clone()).play() : null
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
    geometries.add(geometry)
    chestBow = new THREE.Mesh(geometry, paintedMaterial(bowMap))
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
  } else if (bowMap) {
    bowMap.dispose()
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
  geometries.add(shadowGeometry)
  const shadowMaterial = paintedMaterial(new THREE.CanvasTexture(shadowCanvas))
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
  // The mixer only rewrites a bone when its clip value changes, so idle offsets are undone
  // before the next update. They stay applied between renders for attachments.
  const posed = [hips, head, ...ears].flatMap((node) =>
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

  // The chest and its parents only rotate in the drawing plane.
  function planeAngle(node: THREE.Object3D): number {
    let angle = 0
    for (let at: THREE.Object3D | null = node; at && at !== model; at = at.parent) {
      angle += 2 * Math.atan2(at.quaternion.z, at.quaternion.w)
    }
    return Math.atan2(Math.sin(angle), Math.cos(angle))
  }

  function dispose(): void {
    walkAction?.stop()
    restAction?.stop()
    mixer.stopAllAction()
    mixer.uncacheRoot(model)
    for (const geometry of geometries) geometry.dispose()
    for (const material of materials) material.dispose()
    for (const skeleton of skeletons) skeleton.dispose()
    for (const texture of textures) releaseTexture(texture)
    renderer.dispose()
    renderer.forceContextLoss()
  }

  if (!clip || !walkAction || !restAction) {
    dispose()
    throw new Error(`The ${kind} rig has no walk clip`)
  }

  return {
    kind,
    aspect: frame.width / frameHeight,
    spriteScale: frameHeight / (frame.feet - frame.spriteTop),
    feet: (frame.feet - frame.top) / frameHeight,
    cycleSeconds: clip.duration,
    costumes: [...costumeParts.keys()],
    setCostume,
    render(state, dt, nextHeight, pixelRatio) {
      const nextRatio = Math.min(3, Math.max(2, pixelRatio))
      const nextWidth = nextHeight * frame.width / frameHeight
      const resized = height !== nextHeight || ratio !== nextRatio
      if (resized) {
        width = nextWidth
        height = nextHeight
        ratio = nextRatio
        renderer.setPixelRatio(ratio)
        renderer.setSize(width, height, false)
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
      model.scale.set(sign * Math.max(0.04, Math.abs(across)), 1 + 0.05 * hop, 1)
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
      shadowMaterial.opacity = Math.max(0, 1 - 6 * lift)

      renderer.render(scene, camera)
      lastFacing = sign < 0 ? 'left' : 'right'
    },

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
