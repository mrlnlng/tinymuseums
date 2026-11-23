import type { DoorRoom, DoorStyle } from '@tiny/core/rooms'
import manifest from '@/generated/asset-manifest.json'
import { assetUrl, builtUrl } from '@/shared/lib/assets'
import { doorsOf } from './doors'

/** Where each style's picture comes from. */
export function doorArtUrl(style: DoorStyle): string {
  if (style === 'forest') return assetUrl('pond/forest-door')
  if (style === 'front') return '/assets/door.png'
  return builtUrl(manifest.galleryDoor.src)
}

const pending = new Map<DoorStyle, Promise<HTMLImageElement>>()

export function loadDoorArt(style: DoorStyle): Promise<HTMLImageElement> {
  const existing = pending.get(style)
  if (existing) return existing
  const request = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    // CDN images need CORS permission before WebGL can use them as textures.
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`The ${style} door could not load.`))
    image.src = doorArtUrl(style)
  }).catch((error) => { pending.delete(style); throw error })
  pending.set(style, request)
  return request
}

export type DoorArt = Partial<Record<DoorStyle, HTMLImageElement>>

/** The pictures a room's doors need, loaded with the rest of its art. */
export async function loadRoomDoorArt(room: DoorRoom): Promise<DoorArt> {
  const styles = [...new Set(doorsOf(room).map((door) => door.style))]
  const images = await Promise.all(styles.map(loadDoorArt))
  return Object.fromEntries(styles.map((style, i) => [style, images[i]]))
}
