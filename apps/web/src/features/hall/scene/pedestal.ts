import * as THREE from 'three'
import type { Assets } from './assets'
import { CONFIG } from './config'

/* The pedestal between two displays: scenery first, loading cue second — a faint breath, nothing more. Variants are picked by index so a stretch of hall looks the same every time. */

export interface Pedestal {
  group: THREE.Group
  setPending(pending: boolean): void
  update(dt: number): void
  dispose(): void
}

export function createPedestal(assets: Assets, x: number, variant: number): Pedestal {
  const options = assets.pedestals.length > 0 ? assets.pedestals : null
  const chosen = options
    ? options[((variant % options.length) + options.length) % options.length]
    : { texture: assets.textures.plaque, aspect: assets.aspect.plaque }

  const height = CONFIG.pedestal.height
  const width = height * chosen.aspect

  const geometry = new THREE.PlaneGeometry(width, height)
  const material = new THREE.MeshBasicMaterial({ map: chosen.texture, transparent: true })
  const sprite = new THREE.Mesh(geometry, material)

  const group = new THREE.Group()
  group.position.set(x, CONFIG.pedestal.centerY, CONFIG.pedestal.z)
  group.add(sprite)

  let pending = false
  let elapsed = 0

  return {
    group,

    setPending(next: boolean) {
      pending = next
      if (!next) {
        sprite.position.y = 0
        material.opacity = 1
      }
    },

    update(dt: number) {
      if (!pending) return
      elapsed += dt
      sprite.position.y = Math.sin(elapsed * 2.4) * 0.022
      material.opacity = 0.88 + Math.sin(elapsed * 2.4) * 0.08
    },

    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
