import type Phaser from 'phaser'
import type { Mark } from '../scene/board.ts'
import { CONFIG } from '../scene/config.ts'
import type { GameAssets } from './assets.ts'
import { addPlane, destroyPlanes, planeMask, stretchedBoard, type Plane } from './board.ts'
import { hitsAt, pickAt, type WorldPoint } from './hit.ts'

export interface LobbyMarks {
  sign: Mark
  direction: Mark
}

export interface Lobby {
  marks: LobbyMarks
  hitTestDoorAt(point: WorldPoint): boolean
  hitTestCatAt(point: WorldPoint): boolean
  update(dt: number, cameraX: number): void
  dispose(): void
}

export interface LobbyFrame {
  key: string
  frame: string
  aspect: number
}

export interface LobbyAssets {
  aspect: { door: number; plaque: number; helpCenter: number }
  helpCat: LobbyFrame[]
  frameOf(fileOrStem: string): LobbyFrame
}

export interface LobbyPlaneSpec {
  name: string
  key: string
  frame: string
  width: number
  height: number
  x: number
  y: number
  z: number
}

export interface LobbyGeometry {
  planes: LobbyPlaneSpec[]
  marks: LobbyMarks
}

const POST_BOX = { width: 240, height: 233 }
const POST_PANEL = { x: 120, y: 88, width: 190 }
const POST_KEY = 'hall-lobby-post'

const POST_RASTER = 512

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

const CUTS = [0, 0.28, 0.72, 1] as const

function signSlices(
  ref: LobbyFrame,
  aspect: number,
  x: number,
  y: number,
  z: number,
  width: number,
  height: number,
): LobbyPlaneSpec[] {
  const natural = height * aspect
  const ends = [(CUTS[1] - CUTS[0]) * natural, (CUTS[3] - CUTS[2]) * natural]
  const middle = Math.max((CUTS[2] - CUTS[1]) * natural, width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]
  const planes: LobbyPlaneSpec[] = []

  let cursor = x - total / 2
  for (let i = 0; i < 3; i++) {
    planes.push({
      name: `sign-${i}`,
      key: ref.key,
      frame: `${ref.frame}~${CUTS[i]}~${CUTS[i + 1]}`,
      width: widths[i],
      height,
      x: cursor + widths[i] / 2,
      y,
      z,
    })
    cursor += widths[i]
  }

  return planes
}

export function catFrameAt(elapsed: number, count: number, frameMs: number): number {
  return Math.floor(elapsed / (frameMs / 1000)) % count
}

export function lobbyGeometry(assets: LobbyAssets): LobbyGeometry {
  const { door, sign, post, booth, cat } = CONFIG.lobby
  const doorFrame = assets.frameOf('door.png')
  const plaque = assets.frameOf('plaque.png')
  const boothFrame = assets.frameOf('help-center.png')
  const catFrame = assets.helpCat[0]
  const postHeight = post.top - post.foot

  const planes: LobbyPlaneSpec[] = [
    {
      name: 'door',
      key: doorFrame.key,
      frame: doorFrame.frame,
      width: door.height * assets.aspect.door,
      height: door.height,
      x: door.x,
      y: door.centerY,
      z: door.z,
    },
    ...signSlices(plaque, assets.aspect.plaque, sign.x, sign.centerY, sign.z, sign.width, sign.height),
    {
      name: 'post',
      key: POST_KEY,
      frame: '__BASE',
      width: post.width,
      height: postHeight,
      x: post.x,
      y: post.foot + postHeight / 2,
      z: post.z,
    },
    {
      name: 'booth',
      key: boothFrame.key,
      frame: boothFrame.frame,
      width: booth.height * assets.aspect.helpCenter,
      height: booth.height,
      x: booth.x,
      y: booth.centerY,
      z: booth.z,
    },
    {
      name: 'cat',
      key: catFrame.key,
      frame: catFrame.frame,
      width: cat.height * (catFrame?.aspect ?? 1),
      height: cat.height,
      x: booth.x + cat.dx,
      y: cat.centerY,
      z: cat.z,
    },
  ]

  const perUnit = post.width / POST_BOX.width
  return {
    planes,
    marks: {
      sign: { x: sign.x, y: sign.centerY, width: sign.width * 0.76 },
      direction: {
        x: post.x + (POST_PANEL.x - POST_BOX.width / 2) * perUnit,
        y: post.top - POST_PANEL.y * (postHeight / POST_BOX.height),
        width: POST_PANEL.width * perUnit,
      },
    },
  }
}

function specNamed(planes: readonly LobbyPlaneSpec[], name: string): LobbyPlaneSpec {
  const found = planes.find((plane) => plane.name === name)
  if (!found) throw new Error(`lobby plane ${name}`)
  return found
}

function addSpec(scene: Phaser.Scene, spec: LobbyPlaneSpec): Plane {
  return addPlane(
    scene,
    { key: spec.key, frame: spec.frame },
    spec.width,
    spec.height,
    spec.x,
    spec.y,
    spec.z,
  )
}

export function createLobby(scene: Phaser.Scene, assets: GameAssets): Lobby {
  const { sign: signCfg, post, booth, cat, catFrameMs } = CONFIG.lobby
  const geometry = lobbyGeometry(assets)
  const plaque = assets.frameOf('plaque.png')
  const catFrames = assets.helpCat

  const doorPlane = addSpec(scene, specNamed(geometry.planes, 'door'))
  const signBoard = stretchedBoard(
    scene,
    plaque,
    assets.aspect.plaque,
    signCfg.x,
    signCfg.centerY,
    signCfg.z,
    signCfg.width,
    signCfg.height,
  )
  const boothPlane = addSpec(scene, specNamed(geometry.planes, 'booth'))
  const catPlane = addSpec(scene, specNamed(geometry.planes, 'cat'))

  let postPlane: Plane | null = null
  let disposed = false

  function addPost(): void {
    if (disposed || postPlane || !scene.textures.exists(POST_KEY)) return
    postPlane = addSpec(scene, specNamed(geometry.planes, 'post'))
  }

  if (scene.textures.exists(POST_KEY)) {
    addPost()
  } else {
    const image = new Image()
    image.onload = () => {
      if (disposed) return
      if (!scene.textures.exists(POST_KEY)) {
        // An SVG image uploaded straight to WebGL can come out blank; rasterise it first.
        const canvas = document.createElement('canvas')
        canvas.width = POST_RASTER
        canvas.height = POST_RASTER
        canvas.getContext('2d')?.drawImage(image, 0, 0, POST_RASTER, POST_RASTER)
        scene.textures.addCanvas(POST_KEY, canvas)
      }
      addPost()
    }
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(POST_SVG)}`
  }

  let catElapsed = 0
  let catFrame = 0

  return {
    marks: geometry.marks,

    hitTestDoorAt(point) {
      return hitsAt(point, [doorPlane]).length > 0
    },

    hitTestCatAt(point) {
      return pickAt(point, [boothPlane, catPlane])?.plane === catPlane
    },

    update(dt, cameraX) {
      const far = Math.abs(cameraX - booth.x) > CONFIG.virtualization.mountRadiusUnits
      if (far || catFrames.length === 0) return

      catElapsed += dt
      const next = catFrameAt(catElapsed, catFrames.length, catFrameMs)
      if (next !== catFrame) {
        catFrame = next
        const frame = catFrames[catFrame]
        catPlane.image.setTexture(frame.key, frame.frame)
        catPlane.mask = planeMask(scene, { key: frame.key, frame: frame.frame })
      }
    },

    dispose() {
      disposed = true
      destroyPlanes([
        doorPlane,
        ...signBoard.planes,
        ...(postPlane ? [postPlane] : []),
        boothPlane,
        catPlane,
      ])
      if (scene.textures.exists(POST_KEY)) scene.textures.remove(POST_KEY)
    },
  }
}
