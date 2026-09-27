import manifest from '@/generated/asset-manifest.json'

export interface BuiltImage {
  w: number
  h: number
  src: string
  avif?: string
}

export interface AssetEntry {
  w: number
  h: number
  x2: BuiltImage
  x3?: BuiltImage
}

const images = manifest.images as Record<string, AssetEntry>

export type AssetName = keyof typeof manifest.images

export function assetEntry(name: AssetName): AssetEntry {
  return images[name]
}

export function builtUrl(file: string): string {
  return `${manifest.base}${file}`
}

export function screenDensity(): 2 | 3 {
  return typeof window !== 'undefined' && window.devicePixelRatio > 2 ? 3 : 2
}

export function assetVariant(name: AssetName, density: 2 | 3 = screenDensity()): BuiltImage {
  const entry = images[name]
  return density === 3 && entry.x3 ? entry.x3 : entry.x2
}

export function assetUrl(name: AssetName, options: { density?: 2 | 3; avif?: boolean } = {}): string {
  const variant = assetVariant(name, options.density)
  return builtUrl(options.avif && variant.avif ? variant.avif : variant.src)
}

export interface PictureSources {
  src: string
  srcSet?: string
  avifSrcSet?: string
  width: number
  height: number
}

// AVIF is offered only when every density has it, or a 3x screen could be handed the 2x AVIF.
export function pictureSources(name: AssetName): PictureSources {
  const { x2, x3, w, h } = images[name]
  const variants = x3 ? [x2, x3] : [x2]
  const set = (pick: (v: BuiltImage) => string) =>
    x3 ? `${builtUrl(pick(x2))} 2x, ${builtUrl(pick(x3))} 3x` : undefined
  const hasAvif = variants.every((v) => v.avif)
  return {
    src: builtUrl(x2.src),
    srcSet: set((v) => v.src),
    avifSrcSet: hasAvif ? (x3 ? set((v) => v.avif!) : builtUrl(x2.avif!)) : undefined,
    width: w,
    height: h,
  }
}

// Loads the same file a <picture> built from pictureSources would pick.
export function preloadImage(
  name: AssetName,
  preferAvif: boolean,
  priority: 'high' | 'low' | 'auto' = 'auto',
): HTMLImageElement {
  const { src, srcSet, avifSrcSet } = pictureSources(name)
  const image = new Image()
  image.decoding = 'async'
  image.fetchPriority = priority
  if (preferAvif && avifSrcSet) {
    if (srcSet) image.srcset = avifSrcSet
    image.src = srcSet ? src : avifSrcSet
  } else {
    if (srcSet) image.srcset = srcSet
    image.src = src
  }
  return image
}

const CSS_IMAGES: AssetName[] = [
  'floor',
  'guestboard/arrow-left',
  'help-center',
  'plaque',
  'rope',
  'sticky',
]

export function cssVariableName(name: AssetName): string {
  return `--asset-${name.replaceAll('/', '-')}`
}

export function assetCssVariables(): string {
  const at2 = CSS_IMAGES.map((name) => `${cssVariableName(name)}:url(${builtUrl(images[name].x2.src)})`)
  const at3 = CSS_IMAGES.filter((name) => images[name].x3).map(
    (name) => `${cssVariableName(name)}:url(${builtUrl(images[name].x3!.src)})`,
  )
  return `:root{${at2.join(';')}}@media (min-resolution:2.5dppx){:root{${at3.join(';')}}}`
}
