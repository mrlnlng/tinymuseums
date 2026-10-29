import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { modelUrl } from '@/shared/lib/assets'

// Match the approved Blender camera, rather than reframing each animated pose.
export const BUNNY_RIG_FRAME = { width: 764, height: 1186, orthoHeight: 2.5 } as const

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

export interface BunnyRig {
  readonly aspect: number
  readonly cycleSeconds: number
  render(phase: number, facing: 'left' | 'right', height: number, pixelRatio: number): void
  projectAttachment(anchor: RigAttachment, out: RigAttachmentPose): boolean
  dispose(): void
}

export async function loadBunnyRig(canvas: HTMLCanvasElement): Promise<BunnyRig> {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
  renderer.setClearColor(0, 0)
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping

  let gltf
  try {
    gltf = await new GLTFLoader().loadAsync(modelUrl('bunnyRig'))
  } catch (error) {
    renderer.dispose()
    throw error
  }

  const model = gltf.scene
  const clip = gltf.animations.find((animation) => animation.name === 'walk')
  const geometries = new Set<THREE.BufferGeometry>()
  const materials = new Set<THREE.Material>()
  const textures = new Set<THREE.Texture>()
  const unusedTextures = new Set<THREE.Texture>()
  const skeletons = new Set<THREE.Skeleton>()

  model.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return
    geometries.add(node.geometry)
    const original = (Array.isArray(node.material) ? node.material : [node.material]) as THREE.MeshStandardMaterial[]
    const replacements = original.map((material) => {
      const map = material.emissiveMap ?? material.map
      if (!map) throw new Error(`Missing painted texture on ${node.name}`)
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
      for (const value of Object.values(material)) {
        if (value instanceof THREE.Texture) unusedTextures.add(value)
      }
      const replacement = new THREE.MeshBasicMaterial({
        map,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
      })
      replacement.forceSinglePass = true
      materials.add(replacement)
      material.dispose()
      return replacement
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

  // The export embeds separate base-colour copies that this unlit renderer does not use.
  for (const texture of unusedTextures) {
    if (!textures.has(texture)) releaseTexture(texture)
  }

  const scene = new THREE.Scene()
  scene.add(model)
  const halfHeight = BUNNY_RIG_FRAME.orthoHeight / 2
  const halfWidth = halfHeight * BUNNY_RIG_FRAME.width / BUNNY_RIG_FRAME.height
  const camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 0.1, 100)
  camera.position.z = 10
  camera.updateMatrixWorld()
  const mixer = new THREE.AnimationMixer(model)
  const action = clip ? mixer.clipAction(clip).play() : null
  const anchors = new Map<RigAttachment, { at: THREE.Object3D; right: THREE.Object3D }>()
  const a = new THREE.Vector3()
  const b = new THREE.Vector3()
  let width = 0
  let height = 0
  let ratio = 0
  let lastPhase = -1
  let lastFacing = ''

  // Create sockets against the rest skeleton before applying animation.
  model.updateMatrixWorld(true)
  const restInverse = new Map<string, THREE.Matrix4>()
  model.traverse((node) => {
    if (node instanceof THREE.Bone) restInverse.set(node.name, node.matrixWorld.clone().invert())
  })

  function dispose(): void {
    action?.stop()
    mixer.stopAllAction()
    mixer.uncacheRoot(model)
    for (const geometry of geometries) geometry.dispose()
    for (const material of materials) material.dispose()
    for (const skeleton of skeletons) skeleton.dispose()
    for (const texture of textures) releaseTexture(texture)
    renderer.dispose()
  }

  if (!clip) {
    dispose()
    throw new Error('The bunny rig has no walk clip')
  }

  return {
    aspect: BUNNY_RIG_FRAME.width / BUNNY_RIG_FRAME.height,
    cycleSeconds: clip.duration,
    render(phase, facing, nextHeight, pixelRatio) {
      const nextRatio = Math.min(3, Math.max(2, pixelRatio))
      const nextWidth = nextHeight * BUNNY_RIG_FRAME.width / BUNNY_RIG_FRAME.height
      const resized = height !== nextHeight || ratio !== nextRatio
      if (resized) {
        width = nextWidth
        height = nextHeight
        ratio = nextRatio
        renderer.setPixelRatio(ratio)
        renderer.setSize(width, height, false)
      }
      const normalized = ((phase % 1) + 1) % 1
      if (!resized && normalized === lastPhase && facing === lastFacing) return
      model.scale.x = facing === 'left' ? -1 : 1
      mixer.setTime(normalized * clip.duration)
      model.updateMatrixWorld(true)
      renderer.render(scene, camera)
      lastPhase = normalized
      lastFacing = facing
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
        at.position.set((anchor.x - 834) / 1000, (1194 - anchor.y) / 1000, 0).applyMatrix4(inverse)
        right.position.set((anchor.x + anchor.width - 834) / 1000, (1194 - anchor.y) / 1000, 0).applyMatrix4(inverse)
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
