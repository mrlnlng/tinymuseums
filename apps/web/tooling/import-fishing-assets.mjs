import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createHash } from 'node:crypto'

const source = process.argv[2]
if (!source) throw new Error('Usage: node apps/web/tooling/import-fishing-assets.mjs <source-dir>')
const root = fileURLToPath(new URL('../../../', import.meta.url))
process.chdir(root)
const target = resolve('apps/web/public/assets/pond')
await mkdir(target, { recursive: true })
await mkdir('apps/web/public/immutable', { recursive: true })

// Export only this drop, preserving every unrelated entry in the runtime manifest.
async function buildImage(name, file, height) {
  const variants = await Promise.all([2, 3].map(async (density) => {
    const input = sharp(file).resize({ height: density === 3 ? height : Math.round(height * 2 / 3), withoutEnlargement: true })
    const { data, info } = await input.webp({ quality: 90, alphaQuality: 100, effort: 6, lossless: name !== 'pond/scene' }).toBuffer({ resolveWithObject: true })
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 10)
    const src = `${name.replaceAll('/', '-')}@${density}x.${hash}.webp`
    await writeFile(resolve('apps/web/public/immutable', src), data)
    return { w: info.width, h: info.height, src }
  }))
  return { w: variants[1].w, h: variants[1].h, x2: variants[0], x3: variants[1] }
}
const scene = await sharp(resolve(source, 'Untitled_Artwork-129.png')).metadata()
if (scene.width !== 2995 || scene.height !== 2023) throw new Error('Expected the 2995×2023 fishing scene; remeasure its shoreline for another export')
await copyFile(resolve(source, 'Untitled_Artwork-129.png'), resolve(target, 'scene.png'))

// Clockwise, just inside the painted water. The front shore also bounds walking.
const water = [
  [0.35, 0.67], [0.5, 0.665], [0.68, 0.67], [0.745, 0.68], [0.78, 0.69],
  [0.799, 0.70], [0.79, 0.72], [0.793, 0.74], [0.808, 0.76], [0.816, 0.78],
  [0.804, 0.80], [0.77, 0.82], [0.68, 0.84], [0.61, 0.85], [0.5, 0.854],
  [0.39, 0.85], [0.31, 0.84], [0.25, 0.82], [0.23, 0.80], [0.225, 0.78],
  [0.214, 0.76], [0.203, 0.74], [0.225, 0.72], [0.275, 0.71], [0.279, 0.69], [0.30, 0.68],
]
const layout = { scene: { width: scene.width, height: scene.height, feet: 0.895 }, water, shore: water.slice(5), rippleY: 0.75 }
const heights = { scene: scene.height }
for (const [name, number] of [['sparkles', 130], ['splash', 131], ['lily', 132]]) {
  const input = resolve(source, `Untitled_Artwork-${number}.png`)
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  if (info.width !== scene.width || info.height !== scene.height) throw new Error(`${name} must share the environment's canvas`)
  let left = info.width, top = info.height, right = -1, bottom = -1
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (!data[(y * info.width + x) * 4 + 3]) continue
    left = Math.min(left, x); top = Math.min(top, y)
    right = Math.max(right, x); bottom = Math.max(bottom, y)
  }
  if (right < left) throw new Error(`${name} is empty`)
  const width = right - left + 1, height = bottom - top + 1
  await sharp(input).extract({ left, top, width, height }).png({ compressionLevel: 9 }).toFile(resolve(target, `${name}.png`))
  layout[name] = { x: left / info.width, y: top / info.height, w: width / info.width, h: height / info.height }
  heights[name] = height
}
await writeFile(resolve(target, 'layout.json'), JSON.stringify(layout, null, 2) + '\n')
const manifestPath = resolve('apps/web/src/generated/asset-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const name of ['scene', 'sparkles', 'lily', 'splash']) {
  manifest.images[`pond/${name}`] = await buildImage(`pond/${name}`, resolve(target, `${name}.png`), heights[name])
  console.log(`pond/${name}: source imported and runtime exports rebuilt`)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
