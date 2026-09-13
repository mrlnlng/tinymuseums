import * as THREE from 'three'

export interface AssetManifest {
  room: { wallColor: string }
  bunnyWalk: { byFacing: { left: string[]; right: string[] } }
  pedestals: Array<{ file: string }>
}

const IMAGE_FILES = {
  rope: 'rope.png',
  plaque: 'plaque.png',
  floor: 'floor.png',
  door: 'door.png',
  helpCenter: 'help-center.png',
  giftShop: 'gift-shop.png',
  cafeFront: 'cafe/front.png',
  cafeSign: 'cafe/sign-removebg.png',
  cafeMenu: 'cafe/menu.png',
  cafePoster: 'cafe/buy-coffee.png',
  cafeThanks: 'cafe/thanks-board.png',
  guestBoard: 'guestboard/board-hall.png',
  musicNotes: 'music-notes.svg',
  helmStand: 'pedestal-4-bare.png',
  coin: 'coin.png',
} as const

export const HELM_PEDESTAL_FILE = 'pedestal-4.png'

export type AssetName = keyof typeof IMAGE_FILES

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
  images: Record<AssetName, HTMLImageElement>
  textures: Record<AssetName, THREE.Texture>
  aspect: Record<AssetName, number>
  walk: { left: HTMLImageElement[]; right: HTMLImageElement[] }
  bunnyIdle: { left: HTMLImageElement; right: HTMLImageElement }
  helm: HTMLImageElement
  matcha: HTMLImageElement
  pedestals: PedestalSprite[]
  cafeCat: Sprite[]
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load ${src}`))
    img.src = src
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

export async function loadAssets(base = '/assets'): Promise<Assets> {
  const manifestResponse = await fetch(`${base}/manifest.json`)
  if (!manifestResponse.ok) throw new Error('assets/manifest.json is missing')
  const manifest = (await manifestResponse.json()) as AssetManifest

  const names = Object.keys(IMAGE_FILES) as AssetName[]

  const { left: leftFiles, right: rightFiles } = manifest.bunnyWalk.byFacing

  const [
    staticImages,
    walkLeft,
    walkRight,
    pedestalImages,
    idleLeft,
    idleRight,
    catImages,
    helm,
    matcha,
  ] = await Promise.all([
    Promise.all(names.map((n) => loadImage(`${base}/${IMAGE_FILES[n]}`))),
    Promise.all(leftFiles.map((f) => loadImage(`${base}/${f}`))),
    Promise.all(rightFiles.map((f) => loadImage(`${base}/${f}`))),
    Promise.all(manifest.pedestals.map((p) => loadImage(`${base}/${p.file}`))),
    loadImage(`${base}/bunny-left.png`).catch(() => loadImage(`${base}/bunny.png`)),
    loadImage(`${base}/bunny-right.png`).catch(() => loadImage(`${base}/bunny.png`)),
    Promise.all(CAFE_CAT_FRAMES.map((f) => loadImage(`${base}/${f}`))),
    loadImage(`${base}/helm.png`),
    loadImage(`${base}/matcha.png`),
  ])

  const images = {} as Record<AssetName, HTMLImageElement>
  const textures = {} as Record<AssetName, THREE.Texture>
  const aspect = {} as Record<AssetName, number>

  names.forEach((name, i) => {
    const img = staticImages[i]
    images[name] = img
    aspect[name] = img.naturalWidth / img.naturalHeight
    textures[name] = toTexture(img)
  })

  textures.floor.wrapS = THREE.RepeatWrapping
  textures.floor.wrapT = THREE.ClampToEdgeWrapping

  const toSprite = (img: HTMLImageElement): Sprite => ({
    texture: toTexture(img),
    aspect: img.naturalWidth / img.naturalHeight,
  })

  return {
    manifest,
    images,
    textures,
    aspect,
    walk: { left: walkLeft, right: walkRight },
    bunnyIdle: { left: idleLeft, right: idleRight },
    helm,
    matcha,
    pedestals: pedestalImages.map((img, i) => ({
      ...toSprite(img),
      file: manifest.pedestals[i].file,
    })),
    cafeCat: catImages.map(toSprite),
  }
}

export function loadDisplayTexture(url: string): Promise<THREE.Texture> {
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
