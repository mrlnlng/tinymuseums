import type Phaser from 'phaser'
import { CONFIG } from '../scene/config.ts'
import { addPlane, type Plane, type PlaneRef } from './board.ts'
import { toPhaser, PPU } from './view.ts'
import type { GameAssets, GameFrame } from './assets.ts'

export type PedestalVoice = 'harp' | 'owl'

const VOICES: Readonly<Record<string, PedestalVoice>> = {
  'pedestal-1.png': 'owl',
  'pedestal-3.png': 'harp',
}

const HELM_PEDESTAL_FILE = 'pedestal-4.png'
const HELM_STAND_FILE = 'pedestal-4-bare.png'
const PLAQUE_FILE = 'plaque.png'
const MUSIC_NOTES_FILE = 'music-notes.svg'

export interface PedestalRect {
  x: number
  y: number
  width: number
  height: number
  z: number
}

export interface PedestalGeometry {
  sprite: PedestalRect
  notes: PedestalRect | null
  voice: PedestalVoice | null
  holdsHelm: boolean
}

export function pedestalGeometry(
  file: string,
  aspect: number,
  x: number,
  notesAspect: number,
): PedestalGeometry {
  const { height, centerY, z, notes: spec } = CONFIG.pedestal
  const width = height * aspect
  const voice = VOICES[file] ?? null

  return {
    sprite: { x, y: centerY, width, height, z },
    notes: voice
      ? {
          x: x + spec.offsetX,
          y: centerY + spec.offsetY,
          width: spec.width,
          height: spec.width / notesAspect,
          z: z + spec.z,
        }
      : null,
    voice,
    holdsHelm: file === HELM_PEDESTAL_FILE,
  }
}

export interface Pedestal {
  index: number
  x: number
  sprite: Plane
  notes: Plane | null
  voice: PedestalVoice | null
  holdsHelm: boolean
  setBare(bare: boolean): void
  setPending(pending: boolean): void
  chime(): void
  move(dx: number): void
  update(dt: number): void
  dispose(): void
}

export function createPedestal(
  scene: Phaser.Scene,
  assets: GameAssets,
  x: number,
  variant: number,
  bare = false,
): Pedestal {
  const options = assets.pedestals.length > 0 ? assets.pedestals : null
  const chosen: GameFrame & { file: string } = options
    ? options[((variant % options.length) + options.length) % options.length]
    : { ...assets.frameOf(PLAQUE_FILE), file: '' }

  const geometry = pedestalGeometry(chosen.file, chosen.aspect, x, assets.aspect.musicNotes)
  const sprite = addPlane(
    scene,
    { key: chosen.key, frame: chosen.frame },
    geometry.sprite.width,
    geometry.sprite.height,
    geometry.sprite.x,
    geometry.sprite.y,
    geometry.sprite.z,
  )

  const worn: PlaneRef = { key: chosen.key, frame: chosen.frame }
  const bareFrame = assets.frameOf(HELM_STAND_FILE)
  const setBare = (next: boolean): void => {
    if (!geometry.holdsHelm) return
    sprite.image.setTexture(next ? bareFrame.key : worn.key, next ? bareFrame.frame : worn.frame)
    sprite.image.setDisplaySize(geometry.sprite.width * PPU, geometry.sprite.height * PPU)
  }
  setBare(bare)

  const notes =
    geometry.notes === null
      ? null
      : createNotes(scene, assets.frameOf(MUSIC_NOTES_FILE), geometry.notes)

  let pending = false
  let elapsed = 0

  return {
    index: variant,
    x,
    sprite,
    notes: notes?.plane ?? null,
    voice: geometry.voice,
    holdsHelm: geometry.holdsHelm,
    setBare,

    setPending(next: boolean) {
      pending = next
      if (!next) {
        sprite.image.setY(-geometry.sprite.y * PPU)
        sprite.image.setAlpha(1)
      }
    },

    chime() {
      notes?.start()
    },

    move(dx: number) {
      if (dx === 0) return
      sprite.x += dx
      sprite.image.setX(sprite.image.x + dx * PPU)
      const note = notes?.plane
      if (note) {
        note.x += dx
        note.image.setX(note.image.x + dx * PPU)
      }
    },

    update(dt: number) {
      notes?.update(dt)
      if (!pending) return
      elapsed += dt
      const bob = Math.sin(elapsed * 2.4) * 0.022
      sprite.image.setY(-(geometry.sprite.y + bob) * PPU)
      sprite.image.setAlpha(0.88 + Math.sin(elapsed * 2.4) * 0.08)
    },

    dispose() {
      sprite.image.destroy()
      notes?.dispose()
    },
  }
}

interface Notes {
  plane: Plane
  start(): void
  update(dt: number): void
  dispose(): void
}

function createNotes(scene: Phaser.Scene, ref: PlaneRef, rect: PedestalRect): Notes {
  const { rise, seconds } = CONFIG.pedestal.notes
  const plane = addPlane(scene, ref, rect.width, rect.height, rect.x, rect.y, rect.z)
  plane.image.setVisible(false)
  plane.image.setAlpha(0)

  let elapsed = 0
  let sounding = false

  const place = (progress: number): void => {
    plane.y = rect.y + rise * progress
    const at = toPhaser(plane.x, plane.y)
    plane.image.setPosition(at.x, at.y)
  }
  place(0)

  return {
    plane,

    start() {
      elapsed = 0
      sounding = true
      plane.image.setVisible(true)
      place(0)
      plane.image.setAlpha(0)
    },

    update(dt) {
      if (!sounding) return
      elapsed += dt

      const progress = elapsed / seconds
      if (progress >= 1) {
        sounding = false
        plane.image.setVisible(false)
        plane.image.setAlpha(0)
        return
      }

      place(progress)
      const rising = Math.min(1, progress / 0.2)
      const falling = Math.min(1, (1 - progress) / 0.5)
      plane.image.setAlpha(Math.min(rising, falling))
    },

    dispose() {
      plane.image.destroy()
    },
  }
}
