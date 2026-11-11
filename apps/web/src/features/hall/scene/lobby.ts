import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { CONFIG } from './config'
import { pickPainted } from './hit'
import { groundShadow } from './shadow'

export interface LobbyMarks {
  sign: Mark
  direction: Mark
}

export interface Lobby {
  marks: LobbyMarks
  hitTestDoor(raycaster: THREE.Raycaster): boolean
  hitTestCat(raycaster: THREE.Raycaster): boolean
  update(dt: number, cameraX: number): void
  dispose(): void
}

const POST_BOX = { width: 240, height: 233 }
const POST_PANEL = { x: 120, y: 88, width: 190 }

const TREE_TOPPER = [0.502, 0.066] as const
const TREE_ORNAMENTS: readonly [number, number][] = [
  [0.495, 0.286], [0.657, 0.373], [0.338, 0.416],
  [0.49, 0.537], [0.744, 0.555], [0.23, 0.607],
  [0.109, 0.667], [0.205, 0.754], [0.778, 0.702],
]

const POST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="233" viewBox="0 0 240 233">
  <g fill="#c06a12" stroke="#5d3218" stroke-width="6" stroke-linejoin="round">
    <path d="M105 2h30l4 229h-38z"/>
    <g transform="rotate(-1.6 120 88)">
      <path d="M12 16h216a9 9 0 0 1 9 9v118a9 9 0 0 1-9 9H12a9 9 0 0 1-9-9V25a9 9 0 0 1 9-9z"/>
      <path d="M23 29h194a5 5 0 0 1 5 5v100a5 5 0 0 1-5 5H23a5 5 0 0 1-5-5V34a5 5 0 0 1 5-5z" fill="#fae3c0" stroke-width="0"/>
      <g fill="#5d3218" stroke-width="0">
        <circle cx="32" cy="43" r="4.5"/><circle cx="208" cy="43" r="4.5"/>
        <circle cx="32" cy="125" r="4.5"/><circle cx="208" cy="125" r="4.5"/>
      </g>
    </g>
  </g>
</svg>`

function svgTexture(svg: string): THREE.Texture {
  const texture = new THREE.TextureLoader().load(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`,
  )
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.userData.ownedByBoard = true
  return texture
}

function sparklePainted(width: number, height: number, draw: (ink: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ink = canvas.getContext('2d')
  if (ink) draw(ink)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 4
  return texture
}

function treeGlowTexture(): THREE.CanvasTexture {
  return sparklePainted(64, 64, (ink) => {
    const glow = ink.createRadialGradient(32, 32, 0, 32, 32, 32)
    glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
    glow.addColorStop(0.3, 'rgba(255, 255, 255, 0.5)')
    glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ink.fillStyle = glow
    ink.fillRect(0, 0, 64, 64)
  })
}

function treeStarTexture(): THREE.CanvasTexture {
  return sparklePainted(64, 64, (ink) => {
    ink.fillStyle = '#fff4d6'
    ink.beginPath()
    ink.moveTo(32, 2)
    ink.quadraticCurveTo(38, 26, 62, 32)
    ink.quadraticCurveTo(38, 38, 32, 62)
    ink.quadraticCurveTo(26, 38, 2, 32)
    ink.quadraticCurveTo(26, 26, 32, 2)
    ink.fill()
  })
}

interface TreeSparkles {
  group: THREE.Group
  update(t: number, still: boolean): void
  dispose(): void
}

/** The tree's topper and ornaments, drawn just above its painted plane. */
function createTreeSparkles(width: number, height: number, x: number, y: number, z: number): TreeSparkles {
  const settings = CONFIG.lobby.treeLights
  const group = new THREE.Group()
  group.position.set(x, y, z + 0.01)

  const glowMap = treeGlowTexture()
  const starMap = treeStarTexture()
  const geometry = new THREE.PlaneGeometry(1, 1)
  const glowMaterial = new THREE.MeshBasicMaterial({
    map: glowMap,
    color: '#ffd8a0',
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const starMaterial = new THREE.MeshBasicMaterial({
    map: starMap,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const glintMaterial = new THREE.MeshBasicMaterial({
    map: starMap,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  glowMaterial.opacity = settings.topperMinOpacity
  starMaterial.opacity = 0.5

  const at = (u: number, v: number): [number, number] => [(u - 0.5) * width, (0.5 - v) * height]
  const topper = at(TREE_TOPPER[0], TREE_TOPPER[1])
  const glow = new THREE.Mesh(geometry, glowMaterial)
  glow.position.set(topper[0], topper[1], 0)
  glow.scale.setScalar(settings.topperGlow)
  group.add(glow)

  const flare = new THREE.Mesh(geometry, starMaterial)
  flare.position.set(topper[0], topper[1], 0.001)
  flare.scale.setScalar(settings.topperStar)
  group.add(flare)

  const glints = TREE_ORNAMENTS.map(([u, v]) => {
    const point = at(u, v)
    const mesh = new THREE.Mesh(geometry, glintMaterial)
    mesh.position.set(point[0], point[1], 0.002)
    mesh.scale.setScalar(0)
    group.add(mesh)
    return mesh
  })

  return {
    group,

    update(t, still) {
      if (still) {
        glowMaterial.opacity = (settings.topperMinOpacity + settings.topperMaxOpacity) / 2
        starMaterial.opacity = 0.65
        flare.rotation.z = 0
        for (const glint of glints) glint.scale.setScalar(0)
        return
      }

      glowMaterial.opacity = settings.topperMinOpacity
        + (settings.topperMaxOpacity - settings.topperMinOpacity) * (0.5 + 0.5 * Math.sin(t * 0.55))
      starMaterial.opacity = 0.5 + 0.25 * Math.sin(t * 0.8 + 1.7)
      flare.rotation.z = t * 0.32

      const { waveSeconds, pauseSeconds, flashSeconds, size } = settings.ornament
      const cycle = t % (waveSeconds + pauseSeconds)
      const step = waveSeconds / glints.length
      for (let i = 0; i < glints.length; i++) {
        const progress = (cycle - i * step) / flashSeconds
        const visible = cycle >= i * step && progress < 1
        glints[i].scale.setScalar(visible ? size * Math.sin(Math.PI * progress) : 0)
      }
    },

    dispose() {
      group.removeFromParent()
      geometry.dispose()
      glowMaterial.dispose()
      starMaterial.dispose()
      glintMaterial.dispose()
      glowMap.dispose()
      starMap.dispose()
    },
  }
}

export function createLobby(scene: THREE.Scene, assets: Assets): Lobby {
  const { door, sign, post, booth, cat, tree, catFrameMs } = CONFIG.lobby
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const group = new THREE.Group()
  const shadows: THREE.Mesh[] = []

  const doorWidth = door.height * assets.aspect.door
  const doorMesh = plane(
    doorWidth,
    door.height,
    assets.textures.door,
    door.x,
    door.centerY,
    door.z,
  )
  group.add(doorMesh)
  shadows.push(groundShadow(doorWidth * 0.75, door.x, Math.min(-0.02, door.centerY - door.height / 2 + 0.03)))

  const treeWidth = tree.height * assets.aspect.christmasTree
  group.add(
    plane(
      treeWidth,
      tree.height,
      assets.textures.christmasTree,
      tree.x,
      tree.centerY,
      tree.z,
    ),
  )
  shadows.push(groundShadow(treeWidth * 0.5, tree.x, Math.min(-0.02, tree.centerY - tree.height / 2 + 0.03)))

  group.add(
    stretchedBoard(
      assets.textures.plaque,
      assets.aspect.plaque,
      sign.x,
      sign.centerY,
      sign.z,
      sign.width,
      sign.height,
    ),
  )

  const postHeight = post.top - post.foot
  const postTexture = svgTexture(POST_SVG)
  const postMesh = plane(
    post.width,
    postHeight,
    postTexture,
    post.x,
    post.foot + postHeight / 2,
    post.z,
  )
  group.add(postMesh)
  shadows.push(groundShadow(0.45, post.x, Math.min(-0.02, post.foot + 0.03)))

  const boothWidth = booth.height * assets.aspect.helpCenter
  const boothMesh = plane(
    boothWidth,
    booth.height,
    assets.textures.helpCenter,
    booth.x,
    booth.centerY,
    booth.z,
  )
  group.add(boothMesh)
  shadows.push(groundShadow(boothWidth * 0.9, booth.x, Math.min(-0.02, booth.centerY - booth.height / 2 + 0.03)))

  const catFrames = assets.helpCat.map((s) => s.texture)
  const catMesh = plane(
    cat.height * (assets.helpCat[0]?.aspect ?? 1),
    cat.height,
    catFrames[0],
    booth.x + cat.dx,
    cat.centerY,
    cat.z,
  )
  const catMaterial = catMesh.material as THREE.MeshBasicMaterial
  group.add(catMesh)

  for (const shadow of shadows) group.add(shadow)
  const sparkles = createTreeSparkles(treeWidth, tree.height, tree.x, tree.centerY, tree.z)
  group.add(sparkles.group)

  scene.add(group)

  let catElapsed = 0
  let catFrame = 0
  let treeElapsed = 0

  const perUnit = post.width / POST_BOX.width
  const marks: LobbyMarks = {
    sign: { x: sign.x, y: sign.centerY, width: sign.width * 0.76 },
    direction: {
      x: post.x + (POST_PANEL.x - POST_BOX.width / 2) * perUnit,
      y: post.top - POST_PANEL.y * (postHeight / POST_BOX.height),
      width: POST_PANEL.width * perUnit,
    },
  }

  return {
    marks,

    hitTestDoor(raycaster) {
      return raycaster.intersectObject(doorMesh, false).length > 0
    },

    hitTestCat(raycaster) {
      return pickPainted(raycaster, [boothMesh, catMesh])?.object === catMesh
    },

    update(dt, cameraX) {
      const catNear = Math.abs(cameraX - booth.x) <= CONFIG.virtualization.mountRadiusUnits
      if (catNear && catFrames.length > 0) {
        catElapsed += dt
        const next = Math.floor(catElapsed / (catFrameMs / 1000)) % catFrames.length
        if (next !== catFrame) {
          catFrame = next
          catMaterial.map = catFrames[catFrame]
        }
      }

      if (Math.abs(cameraX - tree.x) <= CONFIG.virtualization.mountRadiusUnits) {
        treeElapsed += dt
        sparkles.update(treeElapsed, still)
      }
    },

    dispose() {
      group.remove(sparkles.group)
      sparkles.dispose()
      for (const shadow of shadows) {
        group.remove(shadow)
        shadow.geometry.dispose()
      }
      disposeBoards(scene, group)
    },
  }
}
