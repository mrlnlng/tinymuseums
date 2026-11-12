import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createHash } from 'node:crypto'

const source = process.argv[2]
if (!source) throw new Error('Usage: node apps/web/tooling/import-hall-assets.mjs <drop-dir>')
const drop = resolve(source)
const root = fileURLToPath(new URL('../../../', import.meta.url))
process.chdir(root)
const target = resolve('apps/web/public/assets/hall')
await mkdir(target, { recursive: true })
await mkdir('apps/web/public/immutable', { recursive: true })

const EXPECTED = {
  'wallpaper.png': [2186, 1096],
  'baseboard.png': [1026, 38],
  'purple_curtains.png': [1903, 275],
  'christmas_tree.png': [416, 577],
}
const file = (name) => resolve(drop, name)

for (const [name, [width, height]] of Object.entries(EXPECTED)) {
  const info = await sharp(file(name)).metadata()
  if (info.width !== width || info.height !== height) {
    throw new Error(`${name} is ${info.width}×${info.height}; expected ${width}×${height}`)
  }
}

/** The source PNGs are one repeated tile, so keep only the pixels that tile seamlessly. */
const WALLPAPER = { left: 0, top: 0, width: 1093, height: 551 }
const WALLPAPER_COLOR = '#741633'
/** The damask is redrawn in a lighter rose than the wall, as the atelier's is, and inked more heavily. */
const WALLPAPER_LINE = { color: '#ad2f55', gain: 1.7 }
const BASEBOARD = { left: 19, top: 0, width: 987, height: 35 }
const CURTAIN = { left: 0, top: 8, width: 1903, height: 238 }

// Export only this drop, preserving every unrelated entry in the runtime manifest.
async function buildImage(name, image, height, lossless, heights = [height, height]) {
  const variants = await Promise.all([2, 3].map(async (density) => {
    const input = sharp(image).resize({ height: heights[density === 3 ? 1 : 0], withoutEnlargement: true })
    const { data, info } = await input.webp({ quality: 92, alphaQuality: 100, effort: 6, lossless }).toBuffer({ resolveWithObject: true })
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 10)
    const src = `${name.replaceAll('/', '-')}@${density}x.${hash}.webp`
    await writeFile(resolve('apps/web/public/immutable', src), data)
    return { w: info.width, h: info.height, src }
  }))
  return { w: variants[1].w, h: variants[1].h, x2: variants[0], x3: variants[1] }
}

/** A column is transparent when every pixel in it falls below the alpha threshold. */
async function trimColumns(image) {
  const { data, info } = await sharp(image).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const opaque = (x) => {
    for (let y = 0; y < info.height; y++) if (data[(y * info.width + x) * 4 + 3] >= 8) return true
    return false
  }
  let left = 0
  let right = info.width - 1
  while (left <= right && !opaque(left)) left++
  while (right >= left && !opaque(right)) right--
  if (right < left) throw new Error('curtain has no visible columns')
  return { left, top: 0, width: right - left + 1, height: info.height }
}

const masters = []
async function save(name, image, options = {}) {
  const path = resolve(target, `${name}.png`)
  const info = await image.png({ compressionLevel: 9 }).toFile(path)
  masters.push({ name, path, height: info.height, ...options })
  return info
}

const wallpaperAlpha = await sharp(file('wallpaper.png'))
  .extract(WALLPAPER)
  .extractChannel('alpha')
  .linear(WALLPAPER_LINE.gain, 0)
  .raw()
  .toBuffer()
const wallpaperInk = await sharp({
  create: { width: WALLPAPER.width, height: WALLPAPER.height, channels: 3, background: WALLPAPER_LINE.color },
})
  .joinChannel(wallpaperAlpha, { raw: { width: WALLPAPER.width, height: WALLPAPER.height, channels: 1 } })
  .png()
  .toBuffer()
await save('wallpaper', sharp(wallpaperInk).flatten({ background: WALLPAPER_COLOR }), {
  x2Height: 378,
})
await save('baseboard', sharp(file('baseboard.png')).extract(BASEBOARD))

const curtainCrop = await sharp(file('purple_curtains.png')).extract(CURTAIN).png().toBuffer()
await save('curtain', sharp(curtainCrop).extract(await trimColumns(curtainCrop)), { lossless: false })

await copyFile(file('christmas_tree.png'), resolve(target, 'christmas-tree.png'))
const tree = await sharp(resolve(target, 'christmas-tree.png')).metadata()
masters.push({ name: 'christmas-tree', path: resolve(target, 'christmas-tree.png'), height: tree.height, lossless: false })

const manifestPath = resolve('apps/web/src/generated/asset-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const master of masters) {
  const name = `hall/${master.name}`
  const entry = await buildImage(
    name,
    master.path,
    master.height,
    master.lossless ?? true,
    [master.x2Height ?? master.height, master.x3Height ?? master.height],
  )
  manifest.images[name] = entry
  console.log(`${name}: ${entry.w}×${entry.h}`)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
