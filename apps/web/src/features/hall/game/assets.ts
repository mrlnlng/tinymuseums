import type Phaser from 'phaser'
import { supportsAvif } from '@/shared/lib/avif'
import {
  assetUrl as builtAssetUrl,
  atlasSheets,
  builtUrl,
  type AssetName,
} from '@/shared/lib/assets'
import {
  CAFE_CAT_FRAMES,
  ENTRANCE_FILES,
  HELP_CAT_FRAMES,
  SCENERY_FILES,
  loadMasks,
  loadRetrying,
  loadTolerant,
  manifest,
  stem,
  type AssetManifest,
  type EntranceName,
  type SceneryName,
} from '@/features/hall/scene/assets'

export interface GameFrame {
  key: string
  frame: string
  aspect: number
}

export interface GameAssets {
  manifest: AssetManifest
  wallpaper: HTMLImageElement
  floor: HTMLImageElement
  walk: { left: HTMLImageElement[]; right: HTMLImageElement[] }
  bunnyIdle: { left: HTMLImageElement; right: HTMLImageElement }
  aspect: Record<EntranceName, number>
  pedestals: Array<GameFrame & { file: string }>
  helpCat: GameFrame[]
  frames: string[]
  frameOf(fileOrStem: string): GameFrame
  registerEntrance(scene: Phaser.Scene): void
  loadGameScenery(): Promise<GameScenery>
  registerScenery(scene: Phaser.Scene): void
  dispose(scene?: Phaser.Scene): void
}

export interface GameScenery {
  aspect: Record<SceneryName, number>
  helm: HTMLImageElement
  matcha: HTMLImageElement
  bunnySit: { plain: HTMLImageElement; helm: HTMLImageElement }
  cafeCat: GameFrame[]
  frameOf(fileOrStem: string): GameFrame
  register(scene: Phaser.Scene): void
  dispose(scene?: Phaser.Scene): void
}

interface SheetEntry {
  key: string
  sprites: Record<string, [number, number, number, number]>
  image: HTMLImageElement
}

const BASE_FRAME = '__BASE'

let useAvif = false

function assetUrl(file: string): string {
  return builtAssetUrl(file.replace(/\.(png|svg)$/, '') as AssetName, { avif: useAvif })
}

function sheetUrl(sheet: { src: string; avif?: string }): string {
  return builtUrl(useAvif && sheet.avif ? sheet.avif : sheet.src)
}

function registerSheets(scene: Phaser.Scene, entries: readonly SheetEntry[], added: Set<string>): void {
  for (const { key, sprites, image } of entries) {
    if (scene.textures.exists(key)) continue
    const texture = scene.textures.addImage(key, image)
    if (!texture) continue
    for (const [name, [x, y, w, h]] of Object.entries(sprites)) texture.add(name, 0, x, y, w, h)
    added.add(key)
  }
}

function registerImage(scene: Phaser.Scene, key: string, image: HTMLImageElement, added: Set<string>): void {
  if (scene.textures.exists(key)) return
  if (scene.textures.addImage(key, image)) added.add(key)
}

function removeAdded(scene: Phaser.Scene | undefined, added: Set<string>): void {
  if (scene) {
    for (const key of added) if (scene.textures.exists(key)) scene.textures.remove(key)
  }
  added.clear()
}

function frameMap(
  sheets: ReturnType<typeof atlasSheets>,
  group: string,
  images: readonly HTMLImageElement[],
): { entries: SheetEntry[]; frames: Record<string, GameFrame> } {
  const frames: Record<string, GameFrame> = {}
  const entries = sheets.map((sheet, i) => {
    const key = `atlas-${group}-${i}`
    for (const [name, [x, y, w, h]] of Object.entries(sheet.sprites)) {
      frames[name] = { key, frame: name, aspect: w / h }
    }
    return { key, sprites: sheet.sprites, image: images[i] }
  })
  return { entries, frames }
}

function singleFrame(key: string, image: HTMLImageElement): GameFrame {
  return { key, frame: BASE_FRAME, aspect: image.naturalWidth / image.naturalHeight }
}

export async function loadGameAssets(): Promise<GameAssets> {
  useAvif = await supportsAvif()
  const { left: leftFiles, right: rightFiles } = manifest.bunnyWalk.byFacing

  const names = Object.keys(ENTRANCE_FILES) as EntranceName[]
  const sheets = atlasSheets('entrance')
  const packed = new Set(sheets.flatMap((sheet) => Object.keys(sheet.sprites)))
  const standaloneFiles = names.map((n) => ENTRANCE_FILES[n]).filter((f) => !packed.has(stem(f)))

  const [materials, walkRight, idleLeft, idleRight, sheetImages, standaloneImages] = await Promise.all([
    loadTolerant([assetUrl('wallpaper.png'), assetUrl('floor.png')]),
    loadTolerant(rightFiles.map((f) => assetUrl(f))),
    loadRetrying(assetUrl('bunny-left.png')).catch(() => loadRetrying(assetUrl('bunny.png'))),
    loadRetrying(assetUrl('bunny-right.png')).catch(() => loadRetrying(assetUrl('bunny.png'))),
    loadTolerant(sheets.map(sheetUrl)),
    loadTolerant(standaloneFiles.map((f) => assetUrl(f))),
  ])
  const [wallpaper, floor] = materials

  void loadMasks()

  const walkLeft: HTMLImageElement[] = []
  void loadTolerant(leftFiles.map((f) => assetUrl(f))).then((images) => walkLeft.push(...images))

  const { entries, frames } = frameMap(sheets, 'entrance', sheetImages)
  for (let i = 0; i < standaloneFiles.length; i++) {
    const key = stem(standaloneFiles[i])
    frames[key] = singleFrame(key, standaloneImages[i])
  }

  const frameOf = (fileOrStem: string): GameFrame => frames[stem(fileOrStem)]
  const aspect = {} as Record<EntranceName, number>
  for (const name of names) aspect[name] = frameOf(ENTRANCE_FILES[name]).aspect

  const added = new Set<string>()
  let scenery: GameScenery | null = null

  return {
    manifest,
    wallpaper,
    floor,
    walk: { left: walkLeft, right: walkRight },
    bunnyIdle: { left: idleLeft, right: idleRight },
    aspect,
    pedestals: manifest.pedestals.map((p) => ({ ...frameOf(p.file), file: p.file })),
    helpCat: HELP_CAT_FRAMES.map((f) => frameOf(f)),
    frames: Object.keys(frames),
    frameOf,

    registerEntrance(scene) {
      registerSheets(scene, entries, added)
      for (let i = 0; i < standaloneFiles.length; i++) {
        registerImage(scene, stem(standaloneFiles[i]), standaloneImages[i], added)
      }
    },

    async loadGameScenery() {
      scenery ??= await loadScenery()
      return scenery
    },

    registerScenery(scene) {
      scenery?.register(scene)
    },

    dispose(scene) {
      removeAdded(scene, added)
      scenery?.dispose(scene)
    },
  }
}

async function loadScenery(): Promise<GameScenery> {
  const names = Object.keys(SCENERY_FILES) as SceneryName[]
  const sheets = atlasSheets('scenery')
  const singles = ['helm.png', 'matcha.png', 'bunny-sit.png', 'bunny-sit-helm.png'] as const

  const [sheetImages, images] = await Promise.all([
    loadTolerant(sheets.map(sheetUrl)),
    loadTolerant(singles.map((f) => assetUrl(f))),
  ])
  const [helm, matcha, sitPlain, sitHelm] = images

  const { entries, frames } = frameMap(sheets, 'scenery', sheetImages)
  const singleEntries = [
    { key: 'helm', image: helm },
    { key: 'matcha', image: matcha },
    { key: 'bunny-sit', image: sitPlain },
    { key: 'bunny-sit-helm', image: sitHelm },
  ]
  for (const { key, image } of singleEntries) frames[key] = singleFrame(key, image)

  const frameOf = (fileOrStem: string): GameFrame => frames[stem(fileOrStem)]
  const aspect = {} as Record<SceneryName, number>
  for (const name of names) aspect[name] = frameOf(SCENERY_FILES[name]).aspect

  const added = new Set<string>()
  return {
    aspect,
    helm,
    matcha,
    bunnySit: { plain: sitPlain, helm: sitHelm },
    cafeCat: CAFE_CAT_FRAMES.map((f) => frameOf(f)),
    frameOf,

    register(scene) {
      registerSheets(scene, entries, added)
      for (const { key, image } of singleEntries) registerImage(scene, key, image, added)
    },

    dispose(scene) {
      removeAdded(scene, added)
    },
  }
}
