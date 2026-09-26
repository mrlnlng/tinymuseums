import * as THREE from 'three'
import manifestJson from '../../../../public/assets/manifest.json'
import optimized from '../../../../public/assets/optimized.json'
import { supportsAvif } from '@/shared/lib/avif'

export type AssetManifest = typeof manifestJson

export const manifest: AssetManifest = manifestJson

// scripts/optimize-assets.ts writes .webp and .avif beside each .png, but only
// where they actually beat the original; these list the ones that did.
const WEBP = new Set<string>(optimized.webp)
const AVIF = new Set<string>(optimized.avif)


let useAvif = false

function assetUrl(base: string, file: string): string {
  const stem = file.replace(/\.png$/, '')
  if (useAvif && AVIF.has(stem)) return `${base}/${stem}.avif`
  return WEBP.has(stem) ? `${base}/${stem}.webp` : `${base}/${file}`
}

const ENTRANCE_FILES = {
  rope: 'rope.png',
  plaque: 'plaque.png',
  floor: 'floor.png',
  wallpaper: 'wallpaper.png',
  door: 'door.png',
  helpCenter: 'help-center.png',
  musicNotes: 'music-notes.svg',
  helmStand: 'pedestal-4-bare.png',
  coin: 'coin.png',
} as const

const SCENERY_FILES = {
  giftShop: 'gift-shop.png',
  cafeFront: 'cafe/front.png',
  cafeSign: 'cafe/sign-removebg.png',
  cafeMenu: 'cafe/menu.png',
  cafePoster: 'cafe/buy-matcha.png',
  cafeThanks: 'cafe/thanks-board.png',
  guestBoard: 'guestboard/board-hall.png',
  sitArea: 'guestboard/sit-area.png',
} as const

export const HELM_PEDESTAL_FILE = 'pedestal-4.png'

export type EntranceName = keyof typeof ENTRANCE_FILES
export type SceneryName = keyof typeof SCENERY_FILES

const HELP_CAT_FRAMES = [1, 2, 3, 4, 5, 6].map((n) => `help/cat-${n}.png`)

const CAFE_CAT_FRAMES = [
  'cafe/cat-1.png',
  'cafe/cat-2.png',
  'cafe/cat-3.png',
  'cafe/cat-4.png',
] as const

export interface Sprite {
  texture: THREE.Texture
  aspect: number
}

export interface PedestalSprite extends Sprite {
  file: string
}

export interface Assets {
  manifest: AssetManifest
  textures: Record<EntranceName, THREE.Texture>
  aspect: Record<EntranceName, number>
  walk: { left: HTMLImageElement[]; right: HTMLImageElement[] }
  bunnyIdle: { left: HTMLImageElement; right: HTMLImageElement }
  pedestals: PedestalSprite[]
  helpCat: Sprite[]
}

export interface Scenery {
  textures: Record<SceneryName, THREE.Texture>
  aspect: Record<SceneryName, number>
  helm: HTMLImageElement
  matcha: HTMLImageElement
  bunnySit: { plain: HTMLImageElement; helm: HTMLImageElement }
  cafeCat: Sprite[]
  dispose(): void
}

const RETRY_DELAYS_MS = [300, 900]

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

async function loadRetrying(src: string): Promise<HTMLImageElement> {
  let failure: unknown
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
    try {
      return await loadImage(attempt === 0 ? src : `${src}?retry=${attempt}`)
    } catch (error) {
      failure = error
      if (attempt < RETRY_DELAYS_MS.length) await wait(RETRY_DELAYS_MS[attempt])
    }
  }
  throw failure
}

let blank: Promise<HTMLImageElement> | null = null

function blankImage(): Promise<HTMLImageElement> {
  if (!blank) {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    blank = loadImage(canvas.toDataURL())
  }
  return blank
}

// One unreachable sprite must not cost the visitor the whole museum, so a failed
// image falls back to a transparent pixel and the rest of the hall still opens.
async function loadTolerant(sources: readonly string[]): Promise<HTMLImageElement[]> {
  const settled = await Promise.allSettled(sources.map(loadRetrying))
  if (settled.every((result) => result.status === 'fulfilled')) {
    return settled.map((result) => result.value)
  }

  const fallback = await blankImage()
  return settled.map((result, i) => {
    if (result.status === 'fulfilled') return result.value
    console.warn(`[hall] giving up on ${sources[i]}`, result.reason)
    return fallback
  })
}

function toTexture(img: HTMLImageElement): THREE.Texture {
  const texture = new THREE.Texture(img)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.needsUpdate = true
  return texture
}

function toSprite(img: HTMLImageElement): Sprite {
  return { texture: toTexture(img), aspect: img.naturalWidth / img.naturalHeight }
}

function indexBy<K extends string>(
  names: readonly K[],
  images: HTMLImageElement[],
): { textures: Record<K, THREE.Texture>; aspect: Record<K, number> } {
  const textures = {} as Record<K, THREE.Texture>
  const aspect = {} as Record<K, number>
  names.forEach((name, i) => {
    const img = images[i]
    textures[name] = toTexture(img)
    aspect[name] = img.naturalWidth / img.naturalHeight
  })
  return { textures, aspect }
}

export async function loadAssets(base = '/assets'): Promise<Assets> {
  useAvif = await supportsAvif()
  const names = Object.keys(ENTRANCE_FILES) as EntranceName[]
  const { left: leftFiles, right: rightFiles } = manifest.bunnyWalk.byFacing

  const [entrance, walkLeft, walkRight, pedestalImages, idleLeft, idleRight, helpCat] = await Promise.all([
    loadTolerant(names.map((n) => assetUrl(base, ENTRANCE_FILES[n]))),
    loadTolerant(leftFiles.map((f) => assetUrl(base, f))),
    loadTolerant(rightFiles.map((f) => assetUrl(base, f))),
    loadTolerant(manifest.pedestals.map((p) => assetUrl(base, p.file))),
    loadRetrying(assetUrl(base, 'bunny-left.png')).catch(() => loadRetrying(assetUrl(base, 'bunny.png'))),
    loadRetrying(assetUrl(base, 'bunny-right.png')).catch(() => loadRetrying(assetUrl(base, 'bunny.png'))),
    loadTolerant(HELP_CAT_FRAMES.map((f) => assetUrl(base, f))),
  ])

  const { textures, aspect } = indexBy(names, entrance)

  textures.floor.wrapS = THREE.RepeatWrapping
  textures.floor.wrapT = THREE.ClampToEdgeWrapping

  return {
    manifest,
    textures,
    aspect,
    walk: { left: walkLeft, right: walkRight },
    bunnyIdle: { left: idleLeft, right: idleRight },
    pedestals: pedestalImages.map((img, i) => ({
      ...toSprite(img),
      file: manifest.pedestals[i].file,
    })),
    helpCat: helpCat.map(toSprite),
  }
}

// The cafe, gift shop and guest board sit far down the hall; they load behind the
// opening scene rather than in front of it.
export async function loadScenery(base = '/assets'): Promise<Scenery> {
  const names = Object.keys(SCENERY_FILES) as SceneryName[]

  const [boards, catImages, helm, matcha, sitting] = await Promise.all([
    loadTolerant(names.map((n) => assetUrl(base, SCENERY_FILES[n]))),
    loadTolerant(CAFE_CAT_FRAMES.map((f) => assetUrl(base, f))),
    loadRetrying(assetUrl(base, 'helm.png')),
    loadRetrying(assetUrl(base, 'matcha.png')),
    loadTolerant(['bunny-sit.png', 'bunny-sit-helm.png'].map((f) => assetUrl(base, f))),
  ])

  const { textures, aspect } = indexBy(names, boards)
  const cafeCat = catImages.map(toSprite)

  return {
    textures,
    aspect,
    helm,
    matcha,
    bunnySit: { plain: sitting[0], helm: sitting[1] },
    cafeCat,
    dispose() {
      for (const texture of Object.values(textures) as THREE.Texture[]) texture.dispose()
      for (const sprite of cafeCat) sprite.texture.dispose()
    },
  }
}

export async function loadDisplayTexture(url: string): Promise<THREE.Texture> {
  try {
    return await fetchDisplayTexture(url)
  } catch (error) {
    const ownOrigin = sameOriginUrl(url)
    if (ownOrigin === null) throw error
    return fetchDisplayTexture(ownOrigin)
  }
}

// WebGL refuses any cross-origin image that did not come back with CORS
// headers, so a CDN that answers without them leaves a hole in the wall that
// retrying cannot close. The app serves the same object from its own origin,
// where CORS does not apply at all.
function sameOriginUrl(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.origin === window.location.origin) return null
    return `/api/media${parsed.pathname}`
  } catch {
    return null
  }
}

async function fetchDisplayTexture(url: string): Promise<THREE.Texture> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await bitmapTexture(url)
    } catch {
      // Fall through to the element loader below.
    }
  }
  return elementTexture(url)
}

// Decoding off the main thread keeps the walk smooth while a wall arrives. The
// bitmap is pre-flipped because UNPACK_FLIP_Y_WEBGL forces a slow re-upload path.
async function bitmapTexture(url: string): Promise<THREE.Texture> {
  const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
  if (!response.ok) throw new Error(`Could not load display image ${url}`)

  const bitmap = await createImageBitmap(await response.blob(), {
    imageOrientation: 'flipY',
    premultiplyAlpha: 'none',
  })

  const texture = new THREE.Texture(bitmap)
  texture.flipY = false
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

function elementTexture(url: string): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader()
    loader.setCrossOrigin('anonymous')
    loader.load(
      url,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 4
        resolve(texture)
      },
      undefined,
      () => reject(new Error(`Could not load display image ${url}`)),
    )
  })
}

export function disposeDisplayTexture(texture: THREE.Texture): void {
  const source = texture.image as unknown
  texture.dispose()
  if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) source.close()
}
