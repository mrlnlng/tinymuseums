import * as THREE from 'three'
import type { Scenery } from './assets'
import { disposeBoards, plane, type Mark } from './board'
import { pickPainted } from './hit'
import { CONFIG } from './config'

export interface CafeMarks {
  poster: Mark & { height: number }
}

export interface Cafe {
  x: number
  marks: CafeMarks
  hitTestCat(raycaster: THREE.Raycaster): boolean
  hitTestMatcha(raycaster: THREE.Raycaster): boolean
  matchaPoint(out: THREE.Vector3): THREE.Vector3
  update(dt: number, cameraX: number): void
  dispose(): void
}

export function createCafe(scene: THREE.Scene, scenery: Scenery, x: number): Cafe {
  const { counter, sign, menu, poster, thanks, cat, catFrameMs } = CONFIG.cafe
  const group = new THREE.Group()

  const counterWidth = counter.height * scenery.aspect.cafeFront
  const counterMesh = plane(
    counterWidth,
    counter.height,
    scenery.textures.cafeFront,
    x + counter.dx,
    counter.centerY,
    counter.z,
  )
  group.add(counterMesh)

  group.add(
    plane(
      sign.width,
      sign.width / scenery.aspect.cafeSign,
      scenery.textures.cafeSign,
      x + sign.dx,
      sign.centerY,
      sign.z,
    ),
  )

  group.add(
    plane(
      menu.height * scenery.aspect.cafeMenu,
      menu.height,
      scenery.textures.cafeMenu,
      x + menu.dx,
      menu.centerY,
      menu.z,
    ),
  )
  const { u, v, center } = CONFIG.matcha.cup

  group.add(
    plane(
      poster.height * scenery.aspect.cafePoster,
      poster.height,
      scenery.textures.cafePoster,
      x + poster.dx,
      poster.centerY,
      poster.z,
    ),
  )

  group.add(
    plane(
      thanks.height * scenery.aspect.cafeThanks,
      thanks.height,
      scenery.textures.cafeThanks,
      x + thanks.dx,
      thanks.centerY,
      thanks.z,
    ),
  )

  const catFrames = scenery.cafeCat.map((s) => s.texture)
  const catAspect = scenery.cafeCat[0]?.aspect ?? 1
  const catMesh = plane(
    cat.height * catAspect,
    cat.height,
    catFrames[0],
    x + cat.dx,
    cat.feetY + cat.height / 2,
    cat.z,
  )
  const catMaterial = catMesh.material as THREE.MeshBasicMaterial
  group.add(catMesh)

  scene.add(group)

  let catElapsed = 0
  let catFrame = 0

  return {
    x,

    hitTestCat(raycaster: THREE.Raycaster): boolean {
      return pickPainted(raycaster, [counterMesh, catMesh])?.object === catMesh
    },

    hitTestMatcha(raycaster: THREE.Raycaster): boolean {
      const uv = raycaster.intersectObject(counterMesh, false)[0]?.uv
      return !!uv && uv.x >= u[0] && uv.x <= u[1] && uv.y >= v[0] && uv.y <= v[1]
    },

    matchaPoint(out) {
      return out.set(
        x + counter.dx + (center[0] - 0.5) * counterWidth,
        counter.centerY + (center[1] - 0.5) * counter.height,
        counter.z,
      )
    },

    marks: {
      poster: {
        x: x + poster.dx,
        y: poster.centerY,
        width: poster.height * scenery.aspect.cafePoster,
        height: poster.height,
      },
    },

    update(dt, cameraX) {
      const far = Math.abs(cameraX - x) > CONFIG.virtualization.mountRadiusUnits + 2
      if (far || catFrames.length === 0) return

      catElapsed += dt
      const next = Math.floor(catElapsed / (catFrameMs / 1000)) % catFrames.length
      if (next !== catFrame) {
        catFrame = next
        catMaterial.map = catFrames[catFrame]
      }
    },

    dispose() {
      disposeBoards(scene, group)
    },
  }
}
