import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'
import { isPaintedAt } from './hit'

type Spot = 'frame' | 'rope' | 'pedestal'

interface CoinWall {
  index: number
  group: THREE.Group
  width: number
  height: number
  bottom: number
  pedestalDx: number | null
}

export interface HiddenCoin {
  readonly index: number | null
  choose(totalWalls: number): void
  attach(wall: CoinWall): void
  detach(index: number): void
  tap(raycaster: THREE.Raycaster, blockers: readonly THREE.Object3D[]): boolean
  release(): void
  update(dt: number): void
}

export function createHiddenCoin(assets: Assets): HiddenCoin {
  const spec = CONFIG.coin

  let index: number | null = null
  let spot: Spot = 'frame'
  const side = Math.random() < 0.5 ? -1 : 1
  let state: 'hidden' | 'found' | 'vanishing' | 'gone' = 'hidden'
  let mesh: THREE.Mesh | null = null
  let elapsed = 0

  function build(width: number): THREE.Mesh {
    return new THREE.Mesh(
      new THREE.PlaneGeometry(width, width / assets.aspect.coin),
      new THREE.MeshBasicMaterial({ map: assets.textures.coin, transparent: true }),
    )
  }

  return {
    get index() {
      return index
    },

    choose(totalWalls) {
      if (index !== null || totalWalls <= 0) return
      index = Math.floor(Math.random() * totalWalls)
      spot = (['frame', 'rope', 'pedestal'] as const)[Math.floor(Math.random() * 3)]
    },

    attach(wall) {
      if (state === 'gone' || wall.index !== index || mesh) return

      const here = spot === 'pedestal' && wall.pedestalDx === null ? 'frame' : spot

      if (here === 'frame') {
        mesh = build(spec.width)
        const margin = spec.frame.margin[side < 0 ? 0 : 1] * wall.width
        const hidden = (1 - spec.frame.peek) * spec.width
        mesh.position.set(
          side * (wall.width / 2 - margin - hidden + spec.width / 2),
          wall.bottom + wall.height * spec.frame.heightRatio,
          spec.frame.z,
        )
      } else if (here === 'rope') {
        mesh = build(spec.rope.width)
        mesh.position.set(side * (wall.width / 2 - spec.rope.inset), spec.rope.y, spec.rope.z)
      } else {
        mesh = build(spec.width)
        mesh.position.set(wall.pedestalDx! + side * spec.pedestal.dx, spec.pedestal.y, spec.pedestal.z)
      }
      wall.group.add(mesh)
    },

    detach(wallIndex) {
      if (wallIndex !== index) return
      mesh = null
      if (state === 'vanishing') state = 'gone'
    },

    tap(raycaster, blockers) {
      if (state !== 'hidden' || !mesh) return false
      for (const hit of raycaster.intersectObjects([mesh, ...blockers] as THREE.Object3D[], false)) {
        if (hit.object === mesh) {
          if (!isPaintedAt(hit)) return false
          state = 'found'
          return true
        }
        if (isPaintedAt(hit, true)) return false
      }
      return false
    },

    release() {
      if (state !== 'found') return
      state = 'vanishing'
      elapsed = 0
    },

    update(dt) {
      if (!mesh) return
      elapsed += dt

      if (state === 'vanishing') {
        const left = Math.max(0, 1 - elapsed / spec.vanishSeconds)
        mesh.scale.setScalar(left)
        mesh.rotation.z += dt * 9
        if (left === 0) {
          mesh.removeFromParent()
          mesh.geometry.dispose()
          ;(mesh.material as THREE.Material).dispose()
          mesh = null
          state = 'gone'
        }
        return
      }

      const t = elapsed % spec.wiggleEverySeconds
      mesh.rotation.z = Math.sin(t * 28) * 0.18 * (Math.max(0, 0.45 - t) / 0.45)
    },
  }
}
