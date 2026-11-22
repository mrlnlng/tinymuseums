import { createHash } from 'node:crypto'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'
import { chromium } from 'playwright'
import sharp from 'sharp'

const root = fileURLToPath(new URL('../../../', import.meta.url))
process.chdir(root)
await mkdir('apps/web/public/immutable', { recursive: true })

// Frozen copy of the old runtime pathTexture 2D core. It is never shipped; bundling it
// beside the bake lets this script keep proving the baked pixels still match.
function blank(width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))
  return [canvas, canvas.getContext('2d')]
}

function softened(source, factor) {
  const [small, shrink] = blank(source.width / factor, source.height / factor)
  const [out, grow] = blank(source.width, source.height)
  if (!shrink || !grow) return source
  shrink.imageSmoothingQuality = 'high'
  shrink.drawImage(source, 0, 0, small.width, small.height)
  grow.imageSmoothingQuality = 'high'
  grow.drawImage(small, 0, 0, out.width, out.height)
  return out
}

async function originalPath(image, width, height) {
  const [source, read] = blank(width, height)
  const [stones, stoneInk] = blank(width, height)
  const [tufts, tuftInk] = blank(width, height)
  const [trail, trailInk] = blank(width, height)
  const [out, ink] = blank(width, height)
  if (!read || !stoneInk || !tuftInk || !trailInk || !ink) throw new Error('stone path needs a 2D canvas')
  let pixels
  try {
    read.drawImage(image, 0, 0, width, height)
    pixels = read.getImageData(0, 0, width, height)
  } catch (error) {
    throw new Error('stone path could not be read', { cause: error })
  }
  const stone = stoneInk.createImageData(width, height)
  const tuft = tuftInk.createImageData(width, height)
  const worn = trailInk.createImageData(width, height)
  const data = pixels.data
  const slice = width * 4 * Math.ceil(height / 24)
  for (let i = 0; i < data.length; i += 4) {
    if (i > 0 && i % slice === 0) await yieldToMain()
    const alpha = data[i + 3]
    if (alpha === 0) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const saturation = max ? (max - Math.min(r, g, b)) / max : 0
    const stoniness = Math.min(1, Math.max(0, (0.62 - saturation) / 0.4))
    worn.data[i + 3] = alpha
    if (stoniness > 0) {
      const near = (i / 4 / width) / height
      const light = Math.min(1, Math.max(0, (max / 255 - 0.5) / 0.3)) * (0.82 + 0.18 * near) + 0.14 * (1 - near)
      for (let c = 0; c < 3; c++) stone.data[i + c] = STONE_SHADE[c] + (STONE_LIGHT[c] - STONE_SHADE[c]) * Math.min(1, light)
      stone.data[i + 3] = alpha * stoniness
    } else if (r > 182) {
      for (let c = 0; c < 3; c++) tuft.data[i + c] = TUFT[c]
      tuft.data[i + 3] = alpha * 0.9
    }
  }
  stoneInk.putImageData(stone, 0, 0)
  tuftInk.putImageData(tuft, 0, 0)
  trailInk.putImageData(worn, 0, 0)
  await yieldToMain()

  stoneInk.globalCompositeOperation = 'source-atop'
  let seed = 7
  const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
  const unit = width / 2400
  for (let i = 0; i < 520; i++) {
    const x = random() * width
    const y = random() * height
    const moss = random() < 0.4
    stoneInk.fillStyle = moss ? `rgba(118, 150, 70, ${0.1 + random() * 0.14})` : `rgba(255, 250, 232, ${0.06 + random() * 0.12})`
    stoneInk.beginPath()
    stoneInk.ellipse(x, y, (18 + random() * 46) * unit, (5 + random() * 9) * unit, (random() - 0.5) * 0.5, 0, Math.PI * 2)
    stoneInk.fill()
  }
  stoneInk.globalCompositeOperation = 'source-over'

  const tinted = (layer, colour) => {
    const [copy, paint] = blank(width, height)
    if (!paint) return layer
    paint.drawImage(layer, 0, 0)
    paint.globalCompositeOperation = 'source-in'
    paint.fillStyle = colour
    paint.fillRect(0, 0, width, height)
    return copy
  }
  await yieldToMain()
  ink.globalAlpha = 0.2
  ink.drawImage(softened(softened(tinted(trail, '#c9c27a'), 24), 12), 0, 0)
  await yieldToMain()
  ink.globalAlpha = 0.55
  ink.drawImage(softened(tinted(stones, '#2f5a22'), 10), 0, 14 * unit)
  ink.globalAlpha = 1
  ink.drawImage(stones, 0, 0)
  ink.drawImage(tufts, 0, 0)
  return out
}

const ORIGINAL_SOURCE = [
  `import { yieldToMain } from '${resolve('apps/web/src/shared/lib/yield.ts').replaceAll('\\', '/')}'`,
  '',
  'const STONE_SHADE = [104, 112, 92]',
  'const STONE_LIGHT = [222, 216, 194]',
  'const TUFT = [150, 190, 72]',
  '',
  blank.toString(),
  '',
  softened.toString(),
  '',
  originalPath.toString(),
  '',
  'export { originalPath }',
].join('\n')

async function bundle(entryPoint, globalName) {
  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    write: false,
    format: 'iife',
    globalName,
    platform: 'browser',
    target: 'es2020',
    logLevel: 'silent',
    alias: { '@': resolve('apps/web/src') },
  })
  return result.outputFiles[0].text
}

async function saveVariant(name, density, file) {
  const { data, info } = await sharp(file)
    .webp({ quality: 92, alphaQuality: 100, effort: 6, lossless: true })
    .toBuffer({ resolveWithObject: true })
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 10)
  const src = `${name.replaceAll('/', '-')}@${density}x.${hash}.webp`
  await writeFile(resolve('apps/web/public/immutable', src), data)
  return { w: info.width, h: info.height, src }
}

async function rawDifference(aFile, bFile) {
  const a = await sharp(aFile).ensureAlpha().raw().toBuffer()
  const b = await sharp(bFile).ensureAlpha().raw().toBuffer()
  if (a.length !== b.length) throw new Error('raw images differ in size')
  let differing = 0
  let max = 0
  for (let i = 0; i < a.length; i += 4) {
    // Encoders may drop the colour under fully transparent pixels; nothing shows there.
    if (a[i + 3] === 0 && b[i + 3] === 0) continue
    let worst = 0
    for (let c = 0; c < 4; c++) worst = Math.max(worst, Math.abs(a[i + c] - b[i + c]))
    if (worst > 1) differing++
    if (worst > max) max = worst
  }
  return { differing, total: a.length / 4, max }
}

const manifestPath = resolve('apps/web/src/generated/asset-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
const source = manifest.images['pond/stone-path']
if (!source || !source.x2 || !source.x3) throw new Error('manifest is missing the x2/x3 pond/stone-path variants')

const temp = await mkdtemp(resolve(tmpdir(), 'bake-pond-path-'))
const browser = await chromium.launch()
try {
  await writeFile(resolve(temp, 'original.ts'), ORIGINAL_SOURCE)
  const bakeJs = await bundle(resolve('apps/web/src/features/rooms/pond/stone-path-bake.ts'), 'PondPathBake')
  const originalJs = await bundle(resolve(temp, 'original.ts'), 'OriginalPath')

  const page = await browser.newPage()
  page.on('pageerror', (error) => console.error('page error:', error.message))
  await page.setContent('<!doctype html><html><body></body></html>')
  await page.addScriptTag({ content: bakeJs })
  await page.addScriptTag({ content: originalJs })

  const baked = {}
  for (const density of [2, 3]) {
    const variant = source[`x${density}`]
    const file = resolve('apps/web/public/immutable', variant.src)
    const dataUrl = `data:image/webp;base64,${(await readFile(file)).toString('base64')}`
    const result = await page.evaluate(async ({ dataUrl }) => {
      const image = new Image()
      image.src = dataUrl
      await image.decode()
      const width = image.naturalWidth
      const height = image.naturalHeight
      const fresh = await PondPathBake.bakeStonePath(image, width, height)
      const original = await OriginalPath.originalPath(image, width, height)
      const a = fresh.getContext('2d').getImageData(0, 0, width, height).data
      const b = original.getContext('2d').getImageData(0, 0, width, height).data
      let differing = 0
      let max = 0
      for (let i = 0; i < a.length; i += 4) {
        let worst = 0
        for (let c = 0; c < 4; c++) worst = Math.max(worst, Math.abs(a[i + c] - b[i + c]))
        if (worst > 1) differing++
        if (worst > max) max = worst
      }
      return { width, height, differing, total: width * height, max, png: fresh.toDataURL('image/png') }
    }, { dataUrl })

    if (result.width !== variant.w || result.height !== variant.h) {
      throw new Error(`x${density} baked ${result.width}×${result.height}, expected ${variant.w}×${variant.h}`)
    }
    const share = result.differing / result.total
    console.log(`x${density}: ${result.differing}/${result.total} pixels differ by >1/channel (${(share * 100).toFixed(4)}%), max channel delta ${result.max}`)
    if (share > 0.001) throw new Error(`x${density} bake differs on too many pixels`)

    const png = resolve(temp, `stone-path@${density}x.png`)
    await writeFile(png, Buffer.from(result.png.split(',')[1], 'base64'))
    baked[density] = await saveVariant('pond/stone-path-baked', density, png)
    console.log(`pond/stone-path-baked@${density}x: ${baked[density].w}×${baked[density].h} ${baked[density].src}`)
    const encoded = await rawDifference(png, resolve('apps/web/public/immutable', baked[density].src))
    console.log(`x${density} lossless webp round-trip: ${encoded.differing}/${encoded.total} pixels differ by >1/channel (${(encoded.differing / encoded.total * 100).toFixed(4)}%), max channel delta ${encoded.max}`)
    if (encoded.differing / encoded.total > 0.001) throw new Error(`x${density} webp lost too much of the bake`)
  }

  manifest.images['pond/stone-path-baked'] = { w: baked[3].w, h: baked[3].h, x2: baked[2], x3: baked[3] }
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log('updated apps/web/src/generated/asset-manifest.json')
} finally {
  await browser.close()
  await rm(temp, { recursive: true, force: true })
}
