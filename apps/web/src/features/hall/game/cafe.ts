import type Phaser from 'phaser'
import type { Mark } from '../scene/board.ts'
import { CONFIG } from '../scene/config.ts'
import type { GameFrame, GameScenery } from './assets.ts'
import { addPlane, destroyPlanes, planeMask, type Plane } from './board.ts'
import { hitsAt, pickAt, type WorldPoint } from './hit.ts'

export interface CafeMarks {
  poster: Mark & { height: number }
}

export interface CafeScenery {
  aspect: {
    cafeFront: number
    cafeSign: number
    cafeMenu: number
    cafePoster: number
    cafeThanks: number
  }
  frameOf(fileOrStem: string): GameFrame
  cafeCat: GameFrame[]
}

export type CafePlaneName = 'counter' | 'sign' | 'menu' | 'poster' | 'thanks' | 'cat'

export interface CafePlaneSpec {
  key: string
  frame: string
  width: number
  height: number
  x: number
  y: number
  z: number
}

export interface CafeGeometry {
  counterWidth: number
  planes: Record<CafePlaneName, CafePlaneSpec>
  marks: CafeMarks
}

export interface CafePoint extends WorldPoint {
  z?: number
}

export interface Cafe {
  x: number
  marks: CafeMarks
  hitTestCatAt(point: WorldPoint): boolean
  hitTestMatchaAt(point: WorldPoint): boolean
  matchaPoint(out: CafePoint): CafePoint
  update(dt: number, cameraX: number): void
  dispose(): void
}

const FILES = {
  counter: 'cafe/front.png',
  sign: 'cafe/sign-removebg.png',
  menu: 'cafe/menu.png',
  poster: 'cafe/buy-matcha.png',
  thanks: 'cafe/thanks-board.png',
} as const

const PLANE_ORDER: readonly CafePlaneName[] = ['counter', 'sign', 'menu', 'poster', 'thanks', 'cat']

function spec(
  frame: GameFrame,
  width: number,
  height: number,
  x: number,
  y: number,
  z: number,
): CafePlaneSpec {
  return { key: frame.key, frame: frame.frame, width, height, x, y, z }
}

export function cafeGeometry(scenery: CafeScenery, x: number): CafeGeometry {
  const { counter, sign, menu, poster, thanks, cat } = CONFIG.cafe
  const counterWidth = counter.height * scenery.aspect.cafeFront
  const catAspect = scenery.cafeCat[0]?.aspect ?? 1

  return {
    counterWidth,
    planes: {
      counter: spec(
        scenery.frameOf(FILES.counter),
        counterWidth,
        counter.height,
        x + counter.dx,
        counter.centerY,
        counter.z,
      ),
      sign: spec(
        scenery.frameOf(FILES.sign),
        sign.width,
        sign.width / scenery.aspect.cafeSign,
        x + sign.dx,
        sign.centerY,
        sign.z,
      ),
      menu: spec(
        scenery.frameOf(FILES.menu),
        menu.height * scenery.aspect.cafeMenu,
        menu.height,
        x + menu.dx,
        menu.centerY,
        menu.z,
      ),
      poster: spec(
        scenery.frameOf(FILES.poster),
        poster.height * scenery.aspect.cafePoster,
        poster.height,
        x + poster.dx,
        poster.centerY,
        poster.z,
      ),
      thanks: spec(
        scenery.frameOf(FILES.thanks),
        thanks.height * scenery.aspect.cafeThanks,
        thanks.height,
        x + thanks.dx,
        thanks.centerY,
        thanks.z,
      ),
      cat: spec(
        scenery.cafeCat[0],
        cat.height * catAspect,
        cat.height,
        x + cat.dx,
        cat.feetY + cat.height / 2,
        cat.z,
      ),
    },
    marks: {
      poster: {
        x: x + poster.dx,
        y: poster.centerY,
        width: poster.height * scenery.aspect.cafePoster,
        height: poster.height,
      },
    },
  }
}

export function cafeCatFrame(elapsed: number, catFrameMs: number, count: number): number {
  return Math.floor(elapsed / (catFrameMs / 1000)) % count
}

function makePlane(scene: Phaser.Scene, plane: CafePlaneSpec): Plane {
  return addPlane(
    scene,
    { key: plane.key, frame: plane.frame },
    plane.width,
    plane.height,
    plane.x,
    plane.y,
    plane.z,
  )
}

export function createCafe(scene: Phaser.Scene, scenery: GameScenery, x: number): Cafe {
  const { counter, catFrameMs } = CONFIG.cafe
  const { u, v, center } = CONFIG.matcha.cup
  const geometry = cafeGeometry(scenery, x)
  const planes = geometry.planes
  const built: Record<CafePlaneName, Plane> = {
    counter: makePlane(scene, planes.counter),
    sign: makePlane(scene, planes.sign),
    menu: makePlane(scene, planes.menu),
    poster: makePlane(scene, planes.poster),
    thanks: makePlane(scene, planes.thanks),
    cat: makePlane(scene, planes.cat),
  }
  const catFrames = scenery.cafeCat

  let catElapsed = 0
  let catFrame = 0

  return {
    x,

    marks: geometry.marks,

    hitTestCatAt(point) {
      return pickAt(point, [built.counter, built.cat])?.plane === built.cat
    },

    hitTestMatchaAt(point) {
      const uv = hitsAt(point, [built.counter])[0]?.uv
      return !!uv && uv.u >= u[0] && uv.u <= u[1] && uv.v >= v[0] && uv.v <= v[1]
    },

    matchaPoint(out) {
      out.x = x + counter.dx + (center[0] - 0.5) * geometry.counterWidth
      out.y = counter.centerY + (center[1] - 0.5) * counter.height
      out.z = counter.z
      return out
    },

    update(dt, cameraX) {
      const far = Math.abs(cameraX - x) > CONFIG.virtualization.mountRadiusUnits + 2
      if (far || catFrames.length === 0) return

      catElapsed += dt
      const next = cafeCatFrame(catElapsed, catFrameMs, catFrames.length)
      if (next !== catFrame) {
        catFrame = next
        const frame = catFrames[catFrame]
        built.cat.image.setTexture(frame.key, frame.frame)
        built.cat.mask = planeMask(scene, frame)
      }
    },

    dispose() {
      destroyPlanes(PLANE_ORDER.map((name) => built[name]))
    },
  }
}
