import * as THREE from 'three'
import { HELM_PEDESTAL_FILE, type Assets } from './assets'
import { CONFIG } from './config'

/* The pedestal between two displays: scenery first, loading cue second — a faint breath, nothing more. Variants are picked by index so a stretch of hall looks the same every time. */

/*  Two of the five things standing on the pedestals make a sound, and the
    visitor finds that out by tapping one: the owl hoots, and the lyre is
    played. The other three — Totoro under his ginkgo leaves, the helmet and
    the urn — are quiet, and stay scenery.

    Keyed by drawing rather than by position in the manifest, so that adding a
    sixth pedestal or reordering the five cannot hand the owl the harp. */
export type PedestalVoice = 'harp' | 'owl'

const VOICES: Readonly<Record<string, PedestalVoice>> = {
  'pedestal-1.png': 'owl',
  'pedestal-3.png': 'harp',
}

export interface Pedestal {
  /** Its place along the hall, which is how the hall remembers a stand left bare. */
  index: number
  group: THREE.Group
  /** The sprite itself, which is what a tap is tested against. */
  sprite: THREE.Mesh
  /** The sound this one makes when tapped, or null if it is only scenery. */
  voice: PedestalVoice | null
  /** Whether this is the helmet pedestal, whose helm the bunny can take. */
  holdsHelm: boolean
  /** Shows the stand without its helm, or with it back on. Helmet pedestals only. */
  setBare(bare: boolean): void
  setPending(pending: boolean): void
  /** Sounds it: sends up the puff of notes that goes with the sound effect. */
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

  // The bare stand shares the helmeted drawing's canvas, so swapping moves nothing.
  const holdsHelm = chosen.file === HELM_PEDESTAL_FILE
  const setBare = (next: boolean): void => {
    if (!holdsHelm) return
    material.map = next ? assets.textures.helmStand : chosen.texture
  }
  setBare(bare)

  /*  The notes, built only for the two pedestals that can sound: an urn has
      nothing to say, and a mesh per pedestal in a long hall is worth not
      making. Parked at zero opacity rather than hidden, because that is the
      state the fade begins and ends at anyway. */
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

/*  The puff of notes: it appears beside whatever is standing on the pedestal,
    drifts up the wall, and is gone — the length of the sound that sent it, so
    the last note fades about when the last note is heard. Fading in quickly
    and out slowly is what makes it read as a sound leaving rather than a
    picture being shown. */
function createNotes(assets: Assets): Notes {
  const { notes: spec } = CONFIG.pedestal
  const width = spec.width
  const height = width / assets.aspect.musicNotes

  const geometry = new THREE.PlaneGeometry(width, height)
  const material = new THREE.MeshBasicMaterial({
    map: assets.textures.musicNotes,
    transparent: true,
    opacity: 0,
    /*  Never mind what is in front: the notes are the answer to a tap and
        have to be visible even where they drift over the pedestal's own
        drawing. */
    depthTest: false,
  })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.visible = false

  /*  Measured from the pedestal's own centre, which is where the group sits:
      up beside the object on top rather than over it, so the owl is not
      covered by the noise it is making. */
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
      /*  In over the first fifth, out over the last half, full in between. */
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
