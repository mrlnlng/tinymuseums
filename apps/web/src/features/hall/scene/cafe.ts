import * as THREE from 'three'
import type { Assets } from './assets'
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

export function createCafe(scene: THREE.Scene, assets: Assets, x: number): Cafe {
  const { counter, sign, menu, poster, thanks, cat, catFrameMs } = CONFIG.cafe
  const group = new THREE.Group()

  const counterMesh = plane(
    counter.height * assets.aspect.cafeFront,
    counter.height,
    assets.textures.cafeFront,
    x + counter.dx,
    counter.centerY,
    counter.z,
  )
  group.add(counterMesh)

  group.add(
    plane(
      sign.width,
      sign.width / assets.aspect.cafeSign,
      assets.textures.cafeSign,
      x + sign.dx,
      sign.centerY,
      sign.z,
    ),
  )

  const menuWidth = menu.height * assets.aspect.cafeMenu
  const menuMesh = plane(
    menuWidth,
    menu.height,
    assets.textures.cafeMenu,
    x + menu.dx,
    menu.centerY,
    menu.z,
  )
  group.add(menuMesh)
  const { u, v } = CONFIG.matcha.menuColumn

  group.add(
    plane(
      poster.height * assets.aspect.cafePoster,
      poster.height,
      assets.textures.cafePoster,
      x + poster.dx,
      poster.centerY,
      poster.z,
    ),
  )

  group.add(
    plane(
      thanks.height * assets.aspect.cafeThanks,
      thanks.height,
      assets.textures.cafeThanks,
      x + thanks.dx,
      thanks.centerY,
      thanks.z,
    ),
  )

  const catFrames = assets.cafeCat.map((s) => s.texture)
  const catAspect = assets.cafeCat[0]?.aspect ?? 1
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
      if (pickPainted(raycaster, [catMesh])) return false
      const uv = raycaster.intersectObject(menuMesh, false)[0]?.uv
      return !!uv && uv.x >= u[0] && uv.x <= u[1] && uv.y >= v[0] && uv.y <= v[1]
    },

    matchaPoint(out) {
      return out.set(
        x + menu.dx + ((u[0] + u[1]) / 2 - 0.5) * menuWidth,
        menu.centerY + ((v[0] + v[1]) / 2 - 0.5) * menu.height,
        menu.z,
      )
    },

    marks: {
      poster: {
        x: x + poster.dx,
        y: poster.centerY,
        width: poster.height * assets.aspect.cafePoster,
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
