import * as THREE from 'three'
import manifestJson from '../../../../public/assets/manifest.json'
import { supportsAvif } from '@/shared/lib/avif'
import {
  assetUrl as builtAssetUrl,
  atlasSheets,
  builtUrl,
  ktx2TranscoderPath,
  spriteMasks,
  type AssetName,
  type AtlasGroup,
} from '@/shared/lib/assets'
import { registerSpriteMask, type SpriteRegion } from './hit'
import { sameOriginUrl } from '@/features/hall/lib/media'

export type AssetManifest = typeof manifestJson

export const manifest: AssetManifest = manifestJson

let useAvif = false

export function prefersAvif(): boolean {
  return useAvif
}

function assetUrl(file: string): string {
  return builtAssetUrl(file.replace(/\.(png|svg)$/, '') as AssetName, { avif: useAvif })
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
  comingSoon: 'coming-soon.png',
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
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
  })
}

export async function loadRetrying(src: string): Promise<HTMLImageElement> {
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
export async function loadTolerant(sources: readonly string[]): Promise<HTMLImageElement[]> {
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

function stem(file: string): string {
  return file.replace(/\.(png|svg)$/, '')
}

interface CompressedLoader {
  loadAsync(url: string): Promise<THREE.Texture>
}

let ktx2: CompressedLoader | null = null

async function prepareKtx2(renderer: THREE.WebGLRenderer): Promise<void> {
  const transcoder = ktx2TranscoderPath()
  if (!transcoder || ktx2) return
  const { KTX2Loader } = await import('three/examples/jsm/loaders/KTX2Loader.js')
  ktx2 = new KTX2Loader().setTranscoderPath(transcoder).detectSupport(renderer)
}

async function loadCompressed(url: string): Promise<THREE.Texture | null> {
  if (!ktx2) return null
  try {
    const texture = await ktx2.loadAsync(url)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    texture.magFilter = THREE.LinearFilter
    return texture
  } catch (error) {
    console.warn(`[hall] ${url} did not transcode; using the image sheet`, error)
    return null
  }
}

async function loadSheetImage(url: string): Promise<THREE.Texture> {
  const image = await loadRetrying(url).catch(async (error) => {
    console.warn(`[hall] giving up on ${url}`, error)
    return blankImage()
  })
  return toTexture(image)
}

// Each sprite is a clone of its sheet's texture showing one region, so a sheet is
// uploaded to the GPU once however many sprites it holds.
async function loadSheets(group: AtlasGroup): Promise<Map<string, Sprite>> {
  const sprites = new Map<string, Sprite>()
  await Promise.all(
    atlasSheets(group).map(async (sheet) => {
      const texture =
        (sheet.ktx2 ? await loadCompressed(builtUrl(sheet.ktx2)) : null) ??
        (await loadSheetImage(builtUrl(useAvif && sheet.avif ? sheet.avif : sheet.src)))
      for (const [name, [x, y, w, h]] of Object.entries(sheet.sprites)) {
        const region: SpriteRegion = { name, u0: x / sheet.w, v0: 1 - (y + h) / sheet.h, du: w / sheet.w, dv: h / sheet.h }
        const sprite = texture.clone()
        sprite.offset.set(region.u0, region.v0)
        sprite.repeat.set(region.du, region.dv)
        sprite.userData.sprite = region
        sprite.needsUpdate = true
        sprites.set(name, { texture: sprite, aspect: w / h })
      }
    }),
  )
  return sprites
}

let masks: Promise<void> | null = null

function loadMasks(): Promise<void> {
  masks ??= (async () => {
    const { url, sprites } = spriteMasks()
    const image = await loadRetrying(url)
    const canvas = document.createElement('canvas')
    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return
    ctx.drawImage(image, 0, 0)
    for (const [name, [x, y, w, h]] of Object.entries(sprites)) {
      const { data } = ctx.getImageData(x, y, w, h)
      const alpha = new Uint8Array(w * h)
      for (let i = 0; i < alpha.length; i++) alpha[i] = data[i * 4]
      registerSpriteMask(name, w, h, alpha)
    }
  })().catch((error) => console.warn('[hall] no sprite masks; taps fall back to whole sprites', error))
  return masks
}

function pick<K extends string>(
  names: readonly K[],
  files: Record<K, string>,
  sheets: Map<string, Sprite>,
  standalone: Map<string, HTMLImageElement>,
): { textures: Record<K, THREE.Texture>; aspect: Record<K, number> } {
  const textures = {} as Record<K, THREE.Texture>
  const aspect = {} as Record<K, number>
  for (const name of names) {
    const sprite = sheets.get(stem(files[name])) ?? toSprite(standalone.get(files[name])!)
    textures[name] = sprite.texture
    aspect[name] = sprite.aspect
  }
  return { textures, aspect }
}

async function loadStandalone(files: string[]): Promise<Map<string, HTMLImageElement>> {
  const images = await loadTolerant(files.map((f) => assetUrl(f)))
  return new Map(files.map((f, i) => [f, images[i]]))
}

function inSheets(group: AtlasGroup): Set<string> {
  return new Set(atlasSheets(group).flatMap((sheet) => Object.keys(sheet.sprites)))
}

function spriteFrom(sheets: Map<string, Sprite>, file: string): Sprite {
  const sprite = sheets.get(stem(file))
  if (!sprite) throw new Error(`${file} is not in an atlas`)
  return sprite
}

export async function loadAssets(renderer: THREE.WebGLRenderer): Promise<Assets> {
  useAvif = await supportsAvif()
  await prepareKtx2(renderer).catch((error) => console.warn('[hall] KTX2 unavailable', error))
  const names = Object.keys(ENTRANCE_FILES) as EntranceName[]
  const { left: leftFiles, right: rightFiles } = manifest.bunnyWalk.byFacing

  const packed = inSheets('entrance')
  const [sheets, standalone, walkRight, idleLeft, idleRight] = await Promise.all([
    loadSheets('entrance'),
    loadStandalone(names.map((n) => ENTRANCE_FILES[n]).filter((f) => !packed.has(stem(f)))),
    loadTolerant(rightFiles.map((f) => assetUrl(f))),
    loadRetrying(assetUrl('bunny-left.png')).catch(() => loadRetrying(assetUrl('bunny.png'))),
    loadRetrying(assetUrl('bunny-right.png')).catch(() => loadRetrying(assetUrl('bunny.png'))),
  ])
  void loadMasks()

  const walkLeft: HTMLImageElement[] = []
  void loadTolerant(leftFiles.map((f) => assetUrl(f))).then((images) => walkLeft.push(...images))

  const { textures, aspect } = pick(names, ENTRANCE_FILES, sheets, standalone)

  textures.floor.wrapS = THREE.RepeatWrapping
  textures.floor.wrapT = THREE.ClampToEdgeWrapping

  return {
    manifest,
    textures,
    aspect,
    walk: { left: walkLeft, right: walkRight },
    bunnyIdle: { left: idleLeft, right: idleRight },
    pedestals: manifest.pedestals.map((p) => ({ ...spriteFrom(sheets, p.file), file: p.file })),
    helpCat: HELP_CAT_FRAMES.map((f) => spriteFrom(sheets, f)),
  }
}

// The cafe, gift shop and guest board sit far down the hall; they load behind the
// opening scene rather than in front of it.
export async function loadScenery(): Promise<Scenery> {
  const names = Object.keys(SCENERY_FILES) as SceneryName[]

  const [sheets, helm, matcha, sitting] = await Promise.all([
    loadSheets('scenery'),
    loadRetrying(assetUrl('helm.png')),
    loadRetrying(assetUrl('matcha.png')),
    loadTolerant(['bunny-sit.png', 'bunny-sit-helm.png'].map((f) => assetUrl(f))),
  ])

  const { textures, aspect } = pick(names, SCENERY_FILES, sheets, new Map())
  const cafeCat = CAFE_CAT_FRAMES.map((f) => spriteFrom(sheets, f))

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
