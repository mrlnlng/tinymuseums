import * as THREE from 'three'
import type { Assets } from './assets'
import { disposeBoards, plane, stretchedBoard, type Mark } from './board'
import { CONFIG } from './config'

export interface LobbyMarks {
  sign: Mark
  direction: Mark
  help: Mark & { height: number }
}

export interface Lobby {
  marks: LobbyMarks
  hitTestDoor(raycaster: THREE.Raycaster): boolean
  update(dt: number, cameraX: number): void
  dispose(): void
}

const POST_BOX = { width: 240, height: 233 }
const POST_PANEL = { x: 120, y: 88, width: 190 }

const POST_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 233">
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

export function createLobby(scene: THREE.Scene, assets: Assets): Lobby {
  const { door, sign, post, booth, helpButton, cat, catFrameMs } = CONFIG.lobby
  const group = new THREE.Group()

  const doorMesh = plane(
    door.height * assets.aspect.door,
    door.height,
    assets.textures.door,
    door.x,
    door.centerY,
    door.z,
  )
  group.add(doorMesh)

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

  group.add(
    plane(
      booth.height * assets.aspect.helpCenter,
      booth.height,
      assets.textures.helpCenter,
      booth.x,
      booth.centerY,
      booth.z,
    ),
  )

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

  scene.add(group)

  let catElapsed = 0
  let catFrame = 0

  const perUnit = post.width / POST_BOX.width
  const marks: LobbyMarks = {
    sign: { x: sign.x, y: sign.centerY, width: sign.width * 0.76 },
    direction: {
      x: post.x + (POST_PANEL.x - POST_BOX.width / 2) * perUnit,
      y: post.top - POST_PANEL.y * (postHeight / POST_BOX.height),
      width: POST_PANEL.width * perUnit,
    },
    help: {
      x: booth.x,
      y: booth.centerY + helpButton.dy,
      width: helpButton.width,
      height: helpButton.height,
    },
  }

  return {
    marks,

    hitTestDoor(raycaster) {
      return raycaster.intersectObject(doorMesh, false).length > 0
    },

    update(dt, cameraX) {
      const far = Math.abs(cameraX - booth.x) > CONFIG.virtualization.mountRadiusUnits
      if (far || catFrames.length === 0) return

      catElapsed += dt
      const next = Math.floor(catElapsed / (catFrameMs / 1000)) % catFrames.length
      if (next !== catFrame) {
        catFrame = next
        catMaterial.map = catFrames[catFrame]
      }
    },

    dispose() {
      for (const texture of catFrames) texture.dispose()
      disposeBoards(scene, group)
    },
  }
}
