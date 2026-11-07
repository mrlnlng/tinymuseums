import type * as THREE from 'three'
import { disposeAtelierArt, loadAtelierArt, type AtelierArt } from '@/features/hall/scene/atelier'
import { loadAssets, type Assets } from '@/features/hall/scene/assets'
import { loadGalleryDoor, loadGalleryPillar } from '@/features/hall/scene/gallery-door'
import { disposeCozyArt, loadCozyArt, type CozyArt } from './themes/cozy'
import type { RoomId } from './types'

/**
 * Each room's art, loaded apart from the room itself, so the stage can fetch it before
 * the visitor reaches the door and keep it for a while after they leave.
 * Rooms build from this art but never dispose it; only `unload` does.
 */
export interface RoomArt<Art> {
  load(renderer: THREE.WebGLRenderer): Promise<Art>
  unload(art: Art): void
}

export interface HallArt {
  assets: Assets
  door: HTMLImageElement
  pillar: HTMLImageElement
  renderer: THREE.WebGLRenderer
}

export interface AtelierArtwork {
  art: AtelierArt
  door: HTMLImageElement
}

export interface PersonalArt {
  cozy: CozyArt
  door: HTMLImageElement
}

export interface ArtByRoom {
  hall: HallArt
  atelier: AtelierArtwork
  personal: PersonalArt
}

export const ROOM_ART: { [K in RoomId]: RoomArt<ArtByRoom[K]> } = {
  hall: {
    async load(renderer) {
      const [assets, door, pillar] = await Promise.all([loadAssets(renderer), loadGalleryDoor(), loadGalleryPillar()])
      return { assets, door, pillar, renderer }
    },
    unload({ assets }) {
      for (const texture of Object.values(assets.textures)) texture.dispose()
      for (const sprite of assets.pedestals) sprite.texture.dispose()
      for (const sprite of assets.helpCat) sprite.texture.dispose()
    },
  },
  atelier: {
    async load() {
      const [art, door] = await Promise.all([loadAtelierArt(), loadGalleryDoor()])
      return { art, door }
    },
    unload({ art }) {
      disposeAtelierArt(art)
    },
  },
  personal: {
    async load() {
      const [cozy, door] = await Promise.all([loadCozyArt(), loadGalleryDoor()])
      return { cozy, door }
    },
    unload({ cozy }) {
      disposeCozyArt(cozy)
    },
  },
}
