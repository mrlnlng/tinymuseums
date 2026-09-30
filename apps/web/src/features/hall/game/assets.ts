import { supportsAvif } from '@/shared/lib/avif'
import { assetUrl as builtAssetUrl, type AssetName } from '@/shared/lib/assets'
import {
  loadRetrying,
  loadTolerant,
  manifest,
  type AssetManifest,
} from '@/features/hall/scene/assets'

export interface GameAssets {
  manifest: AssetManifest
  wallpaper: HTMLImageElement
  floor: HTMLImageElement
  walk: { left: HTMLImageElement[]; right: HTMLImageElement[] }
  bunnyIdle: { left: HTMLImageElement; right: HTMLImageElement }
  dispose(): void
}

let useAvif = false

function assetUrl(file: string): string {
  return builtAssetUrl(file.replace(/\.(png|svg)$/, '') as AssetName, { avif: useAvif })
}

export async function loadGameAssets(): Promise<GameAssets> {
  useAvif = await supportsAvif()
  const { left: leftFiles, right: rightFiles } = manifest.bunnyWalk.byFacing

  const [materials, walkRight, idleLeft, idleRight] = await Promise.all([
    loadTolerant([assetUrl('wallpaper.png'), assetUrl('floor.png')]),
    loadTolerant(rightFiles.map((f) => assetUrl(f))),
    loadRetrying(assetUrl('bunny-left.png')).catch(() => loadRetrying(assetUrl('bunny.png'))),
    loadRetrying(assetUrl('bunny-right.png')).catch(() => loadRetrying(assetUrl('bunny.png'))),
  ])
  const [wallpaper, floor] = materials

  const walkLeft: HTMLImageElement[] = []
  void loadTolerant(leftFiles.map((f) => assetUrl(f))).then((images) => walkLeft.push(...images))

  return {
    manifest,
    wallpaper,
    floor,
    walk: { left: walkLeft, right: walkRight },
    bunnyIdle: { left: idleLeft, right: idleRight },
    dispose() {},
  }
}
