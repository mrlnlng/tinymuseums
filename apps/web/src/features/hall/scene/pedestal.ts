import * as THREE from 'three'
import { HELM_PEDESTAL_FILE, type Assets } from './assets'
import { CONFIG } from './config'

export type PedestalVoice = 'harp' | 'owl'

const VOICES: Readonly<Record<string, PedestalVoice>> = {
  'pedestal-1.png': 'owl',
  'pedestal-3.png': 'harp',
}

export interface Pedestal {
  index: number
  group: THREE.Group
  sprite: THREE.Mesh
  voice: PedestalVoice | null
  holdsHelm: boolean
  setBare(bare: boolean): void
  setPending(pending: boolean): void
  chime(): void
  update(dt: number): void
  dispose(): void
}

export function createPedestal(
  assets: Assets,
  x: number,
  variant: number,
  bare = false,
): Pedestal {
  const options = assets.pedestals.length > 0 ? assets.pedestals : null
  const chosen = options
    ? options[((variant % options.length) + options.length) % options.length]
    : { texture: assets.textures.plaque, aspect: assets.aspect.plaque, file: '' }

  const height = CONFIG.pedestal.height
  const width = height * chosen.aspect

  const geometry = new THREE.PlaneGeometry(width, height)
  const material = new THREE.MeshBasicMaterial({ map: chosen.texture, transparent: true })
  const sprite = new THREE.Mesh(geometry, material)

  const group = new THREE.Group()
  group.position.set(x, CONFIG.pedestal.centerY, CONFIG.pedestal.z)
  group.add(sprite)

  const voice = VOICES[chosen.file] ?? null

  const holdsHelm = chosen.file === HELM_PEDESTAL_FILE
  const setBare = (next: boolean): void => {
    if (!holdsHelm) return
    material.map = next ? assets.textures.helmStand : chosen.texture
  }
  setBare(bare)

  const notes = voice ? createNotes(assets) : null
  if (notes) group.add(notes.mesh)

  let pending = false
  let elapsed = 0

  return {
    index: variant,
    group,
    sprite,
    voice,
    holdsHelm,
    setBare,

    setPending(next: boolean) {
      pending = next
      if (!next) {
        sprite.position.y = 0
        material.opacity = 1
      }
    },

    chime() {
      notes?.start()
    },

    update(dt: number) {
      notes?.update(dt)
      if (!pending) return
      elapsed += dt
      sprite.position.y = Math.sin(elapsed * 2.4) * 0.022
      material.opacity = 0.88 + Math.sin(elapsed * 2.4) * 0.08
    },

    dispose() {
      geometry.dispose()
      material.dispose()
      notes?.dispose()
    },
  }
}

interface Notes {
  mesh: THREE.Mesh
  start(): void
  update(dt: number): void
  dispose(): void
}

function createNotes(assets: Assets): Notes {
  const { notes: spec } = CONFIG.pedestal
  const width = spec.width
  const height = width / assets.aspect.musicNotes

  const geometry = new THREE.PlaneGeometry(width, height)
  const material = new THREE.MeshBasicMaterial({
    map: assets.textures.musicNotes,
    transparent: true,
    opacity: 0,
    depthTest: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.visible = false

  const restY = spec.offsetY

  let elapsed = 0
  let sounding = false

  const place = (progress: number): void => {
    mesh.position.set(spec.offsetX, restY + spec.rise * progress, spec.z)
  }

  place(0)

  return {
    mesh,

    start() {
      elapsed = 0
      sounding = true
      mesh.visible = true
      place(0)
      material.opacity = 0
    },

    update(dt: number) {
      if (!sounding) return
      elapsed += dt

      const progress = elapsed / spec.seconds
      if (progress >= 1) {
        sounding = false
        mesh.visible = false
        material.opacity = 0
        return
      }

      place(progress)
      const rising = Math.min(1, progress / 0.2)
      const falling = Math.min(1, (1 - progress) / 0.5)
      material.opacity = Math.min(rising, falling)
    },

    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}
