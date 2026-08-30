import * as THREE from 'three'

/**
 * Scenery assets for the hall.
 *
 * The artwork itself is not here — displays arrive from the API as a single
 * flattened image the server composited. These are the fixtures: the visitor
 * and their walk cycle, the pedestals, the ropes, the plaques, and the floor.
 */

export interface AssetManifest {
  room: { wallColor: string }
  bunnyWalk: {
    files: string[]
    /** Drawn cycles per direction. The bunny is no longer a mirrored sprite. */
    byFacing?: { left: string[]; right: string[] }
  }
  pedestals: Array<{ file: string }>
}

/** Scenery drawn in the WebGL scene. The visitor is not among them — see below. */
const IMAGE_FILES = {
  rope: 'rope.png',
  plaque: 'plaque.png',
  floor: 'floor.png',
} as const

export type AssetName = keyof typeof IMAGE_FILES

export interface Sprite {
  texture: THREE.Texture
  aspect: number
}

export interface Assets {
  manifest: AssetManifest
  images: Record<AssetName, HTMLImageElement>
  textures: Record<AssetName, THREE.Texture>
  aspect: Record<AssetName, number>
  /**
   * The visitor's frames, as plain images rather than textures.
   *
   * The bunny is drawn in the DOM, above the plaque overlay, because anything
   * in the WebGL scene is painted *under* that overlay — which had text
   * appearing in front of the character as it walked past a display.
   */
  walk: { left: HTMLImageElement[]; right: HTMLImageElement[] }
  bunnyIdle: { left: HTMLImageElement; right: HTMLImageElement }
  /** Pedestal variants, so a long hall is not one object repeated. */
  pedestals: Sprite[]
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

  // The pack ships a drawn cycle per direction. Older packs did not, so the
  // single cycle stands in for both rather than failing to load at all.
  const facing = manifest.bunnyWalk.byFacing
  const leftFiles = facing?.left ?? manifest.bunnyWalk.files
  const rightFiles = facing?.right ?? manifest.bunnyWalk.files

  const [
    staticImages,
    walkLeft,
    walkRight,
    pedestalImages,
    idleLeft,
    idleRight,
  ] = await Promise.all([
    Promise.all(names.map((n) => loadImage(`${base}/${IMAGE_FILES[n]}`))),
    Promise.all(leftFiles.map((f) => loadImage(`${base}/${f}`))),
    Promise.all(rightFiles.map((f) => loadImage(`${base}/${f}`))),
    Promise.all(manifest.pedestals.map((p) => loadImage(`${base}/${p.file}`))),
    loadImage(`${base}/bunny-left.png`).catch(() => loadImage(`${base}/bunny.png`)),
    loadImage(`${base}/bunny-right.png`).catch(() => loadImage(`${base}/bunny.png`)),
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
    pedestals: pedestalImages.map(toSprite),
  }
}

/** Loads a composited display image produced by the server. */
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
