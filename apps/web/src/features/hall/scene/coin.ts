import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'
import { isPaintedAt } from './hit'

/*  The hidden coin easter egg: one coin per visit, at a random wall, tucked
    behind the frame, behind a rope post, or behind the pedestal after that
    wall. Tapping it opens the found screen; once that closes the coin shrinks
    away until the page is reloaded.

    The coin is a child of its wall's group, so it hangs and comes down with
    the wall and moves with it when the layout grows. */

type Spot = 'frame' | 'rope' | 'pedestal'

interface CoinWall {
  index: number
  group: THREE.Group
  width: number
  height: number
  bottom: number
  /** The pedestal after this wall, relative to its centre, or null if that gap is bare. */
  pedestalDx: number | null
}

export interface HiddenCoin {
  /** The wall it is hidden at, or null until the hall knows how many there are. */
  readonly index: number | null
  /** Picks the wall, once, when the hall first learns its size. */
  choose(totalWalls: number): void
  /** Hides the coin at a wall that has just been hung, if it is the one. */
  attach(wall: CoinWall): void
  /** Forgets the mesh when its wall comes down; the wall disposes it. */
  detach(index: number): void
  /** True, and marks it found, if the ray strikes the coin where it shows. */
  tap(raycaster: THREE.Raycaster, blockers: readonly THREE.Object3D[]): boolean
  /** Once the found screen has closed, shrinks it away. */
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

      // With no pedestal after this wall, the coin hides behind the frame instead.
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
      /*  What covers the coin counts only where it is actually drawn: the reach
          every drawing gets for aiming would swallow the coin peeking past a frame. */
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

      // Still for most of the cycle, then a quick rock, like something settling.
      const t = elapsed % spec.wiggleEverySeconds
      mesh.rotation.z = Math.sin(t * 28) * 0.18 * (Math.max(0, 0.45 - t) / 0.45)
    },
  }
}
