import type Phaser from 'phaser'
import type { Mark } from '../scene/board.ts'
import type { GameAssets, GameScenery } from './assets.ts'
import { addPlane, destroyPlanes, stretchedBoard } from './board.ts'
import { hitsAt, pickAt, type WorldPoint } from './hit.ts'
import { CONFIG } from '../scene/config.ts'

export interface Seat {
  x: number
  y: number
  height: number
}

export interface GuestBoard {
  x: number
  mark: Mark
  signMark: Mark
  seat: Seat
  hitTestAt(point: WorldPoint): boolean
  hitTestBeanbagAt(point: WorldPoint, occupied: boolean): boolean
  hitTestDesktopAt(point: WorldPoint): boolean
  dispose(): void
}

export interface GuestBoardAspects {
  board: number
  sitArea: number
  plaque: number
}

export interface PlaneSpec {
  texture: 'guestBoard' | 'plaque' | 'sitArea'
  slice?: [number, number]
  x: number
  y: number
  width: number
  height: number
  z: number
}

export interface GuestBoardGeometry {
  planes: PlaneSpec[]
  mark: Mark
  signMark: Mark
  seat: Seat
}

const BOARD = 'guestboard/board-hall'
const PLAQUE = 'plaque'
const SIT_AREA = 'guestboard/sit-area'

const CUTS = [0, 0.28, 0.72, 1] as const

export function guestBoardGeometry(x: number, aspects: GuestBoardAspects): GuestBoardGeometry {
  const { board, sign, signText, sitArea, seat } = CONFIG.guestBoard

  const boardPlane: PlaneSpec = {
    texture: 'guestBoard',
    x: x + board.dx,
    y: board.centerY,
    width: board.width,
    height: board.width / aspects.board,
    z: board.z,
  }

  const natural = sign.height * aspects.plaque
  const ends = [(CUTS[1] - CUTS[0]) * natural, (CUTS[3] - CUTS[2]) * natural]
  const middle = Math.max((CUTS[2] - CUTS[1]) * natural, sign.width - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]

  const signPlanes: PlaneSpec[] = []
  let cursor = x + sign.dx - total / 2
  for (let i = 0; i < 3; i++) {
    signPlanes.push({
      texture: 'plaque',
      slice: [CUTS[i], CUTS[i + 1]],
      x: cursor + widths[i] / 2,
      y: sign.centerY,
      width: widths[i],
      height: sign.height,
      z: sign.z,
    })
    cursor += widths[i]
  }

  const sitPlane: PlaneSpec = {
    texture: 'sitArea',
    x: x + sitArea.dx,
    y: sitArea.centerY,
    width: sitArea.height * aspects.sitArea,
    height: sitArea.height,
    z: sitArea.z,
  }

  return {
    planes: [boardPlane, ...signPlanes, sitPlane],
    mark: { x: x + board.dx, y: board.centerY, width: board.width },
    signMark: { x: x + signText.dx, y: signText.centerY, width: signText.width },
    seat: { x: x + seat.dx, y: seat.centerY, height: seat.height },
  }
}

export function createGuestBoard(
  scene: Phaser.Scene,
  assets: GameAssets,
  scenery: GameScenery,
  x: number,
): GuestBoard {
  const { sign, sitArea } = CONFIG.guestBoard
  const boardFrame = scenery.frameOf(BOARD)
  const sitFrame = scenery.frameOf(SIT_AREA)
  const plaqueFrame = assets.frameOf(PLAQUE)
  const geometry = guestBoardGeometry(x, {
    board: boardFrame.aspect,
    sitArea: sitFrame.aspect,
    plaque: plaqueFrame.aspect,
  })

  const [boardSpec] = geometry.planes
  const sitSpec = geometry.planes[geometry.planes.length - 1]
  const boardPlane = addPlane(
    scene,
    boardFrame,
    boardSpec.width,
    boardSpec.height,
    boardSpec.x,
    boardSpec.y,
    boardSpec.z,
  )
  const signBoard = stretchedBoard(
    scene,
    plaqueFrame,
    plaqueFrame.aspect,
    x + sign.dx,
    sign.centerY,
    sign.z,
    sign.width,
    sign.height,
  )
  const sitPlane = addPlane(
    scene,
    sitFrame,
    sitSpec.width,
    sitSpec.height,
    sitSpec.x,
    sitSpec.y,
    sitSpec.z,
  )

  const { u, v, occupiedTop } = sitArea.beanbag
  const { desktop } = sitArea

  return {
    x,
    mark: geometry.mark,
    signMark: geometry.signMark,
    seat: geometry.seat,

    hitTestAt(point) {
      return pickAt(point, [boardPlane]) !== null
    },

    hitTestBeanbagAt(point, occupied) {
      const uv = hitsAt(point, [sitPlane])[0]?.uv
      const top = occupied ? occupiedTop : v[1]
      return !!uv && uv.u >= u[0] && uv.u <= u[1] && uv.v >= v[0] && uv.v <= top
    },

    hitTestDesktopAt(point) {
      const uv = hitsAt(point, [sitPlane])[0]?.uv
      return (
        !!uv &&
        uv.u >= desktop.u[0] &&
        uv.u <= desktop.u[1] &&
        uv.v >= desktop.v[0] &&
        uv.v <= desktop.v[1]
      )
    },

    dispose() {
      destroyPlanes([boardPlane, sitPlane, ...signBoard.planes])
    },
  }
}
