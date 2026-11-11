import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { createHash } from 'node:crypto'

const source = process.argv[2]
if (!source) throw new Error('Usage: node apps/web/tooling/import-fishing-assets.mjs <drop-dir>')
const root = fileURLToPath(new URL('../../../', import.meta.url))
process.chdir(root)
const target = resolve('apps/web/public/assets/pond')
await mkdir(target, { recursive: true })
await mkdir('apps/web/public/immutable', { recursive: true })

const layer = (number) => resolve(source, 'extended fishing scene', `Untitled_Artwork-${number}.png`)
const rodLayer = (number) => resolve(source, 'fishing rod', `Untitled_Artwork-${number}.png`)

/**
 * The extended painting is the original 2995-wide frame with 1809px more garden on its left.
 * Every position in layout.json stays a fraction of that original frame, so the walk floor,
 * casts and props keep their coordinates; the extra garden is a second image beside it.
 */
const CANVAS = { width: 4804, height: 2023 }
const FRAME = { left: 1809, width: 2995 }
/** The left strip runs a few pixels under the frame so no seam shows between them. */
const OVERLAP = 8

const canvas = await sharp(layer(133)).metadata()
if (canvas.width !== CANVAS.width || canvas.height !== CANVAS.height) {
  throw new Error('Expected the 4804×2023 extended fishing scene; remeasure the frame and shoreline for another export')
}

// Export only this drop, preserving every unrelated entry in the runtime manifest.
async function buildImage(name, file, height, lossless) {
  const variants = await Promise.all([2, 3].map(async (density) => {
    const input = sharp(file).resize({ height: density === 3 ? height : Math.round(height * 2 / 3), withoutEnlargement: true })
    const { data, info } = await input.webp({ quality: 92, alphaQuality: 100, effort: 6, lossless }).toBuffer({ resolveWithObject: true })
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 10)
    const src = `${name.replaceAll('/', '-')}@${density}x.${hash}.webp`
    await writeFile(resolve('apps/web/public/immutable', src), data)
    return { w: info.width, h: info.height, src }
  }))
  return { w: variants[1].w, h: variants[1].h, x2: variants[0], x3: variants[1] }
}

async function opaqueBox(input) {
  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  let left = info.width, top = info.height, right = -1, bottom = -1
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] < 8) continue
    left = Math.min(left, x); top = Math.min(top, y)
    right = Math.max(right, x); bottom = Math.max(bottom, y)
  }
  if (right < left) throw new Error('empty layer')
  return { left, top, width: right - left + 1, height: bottom - top + 1 }
}

const heights = {}
const lossless = new Set()
async function save(name, image, { exact = true } = {}) {
  const file = resolve(target, `${name}.png`)
  const info = await image.png({ compressionLevel: 9 }).toFile(file)
  heights[name] = info.height
  if (exact) lossless.add(name)
  return info
}

const painting = await sharp(layer(133)).composite([{ input: layer(135) }]).png().toBuffer()
await save('scene', sharp(painting).extract({ left: FRAME.left, top: 0, width: FRAME.width, height: CANVAS.height }).flatten({ background: '#6c972f' }), { exact: false })
await save('scene-left', sharp(painting).extract({ left: 0, top: 0, width: FRAME.left + OVERLAP, height: CANVAS.height }).flatten({ background: '#6c972f' }), { exact: false })

// Clockwise, just inside the painted water. The front shore also bounds walking.
const water = [
  [0.35, 0.67], [0.5, 0.665], [0.68, 0.67], [0.745, 0.68], [0.78, 0.69],
  [0.799, 0.70], [0.79, 0.72], [0.793, 0.74], [0.808, 0.76], [0.816, 0.78],
  [0.804, 0.80], [0.77, 0.82], [0.68, 0.84], [0.61, 0.85], [0.5, 0.854],
  [0.39, 0.85], [0.31, 0.84], [0.25, 0.82], [0.23, 0.80], [0.225, 0.78],
  [0.214, 0.76], [0.203, 0.74], [0.225, 0.72], [0.275, 0.71], [0.279, 0.69], [0.30, 0.68],
]
const layout = {
  scene: { width: FRAME.width, height: CANVAS.height, feet: 0.895 },
  left: { w: (FRAME.left + OVERLAP) / FRAME.width, overlap: OVERLAP / FRAME.width },
  water,
  shore: water.slice(5),
  rippleY: 0.75,
}
const framed = (box) => ({
  x: (box.left - FRAME.left) / FRAME.width,
  y: box.top / CANVAS.height,
  w: box.width / FRAME.width,
  h: box.height / CANVAS.height,
})

// The bridge sits between the hedge and the lawn, so the lawn's grass is cut out of its feet.
const bridge = await sharp(layer(134)).composite([{ input: layer(135), blend: 'dest-out' }]).png().toBuffer()
for (const [name, input] of [['bridge', bridge], ['sparkles', layer(136)], ['splash', layer(137)], ['lily', layer(138)]]) {
  const box = await opaqueBox(input)
  if (box.left < FRAME.left) throw new Error(`${name} reaches outside the original frame`)
  await save(name, sharp(input).extract(box))
  layout[name] = framed(box)
}

// The rod is held at the middle of its red grip and its line leaves from the tip.
const rodBox = await opaqueBox(rodLayer(140))
await save('rod', sharp(rodLayer(140)).extract(rodBox))
layout.rod = {
  width: rodBox.width,
  height: rodBox.height,
  grip: { x: (242 - rodBox.left) / rodBox.width, y: (756 - rodBox.top) / rodBox.height },
  tip: { x: (1578 - rodBox.left) / rodBox.width, y: (115 - rodBox.top) / rodBox.height },
}
await save('float', sharp(rodLayer(141)).extract({ left: 1562, top: 648, width: 86, height: 154 }))
await save('float-hook', sharp(rodLayer(141)).extract({ left: 1552, top: 648, width: 98, height: 270 }))
const bucketBox = await opaqueBox(resolve(source, 'file5.png'))
await save('bucket', sharp(resolve(source, 'file5.png')).extract(bucketBox))

// Props drawn apart from the painting. Their lettering is baked in with the museum's hand font.
const prop = (name) => resolve(source, 'pond_scene', 'pond_scene', `${name}.png`)
const FONT = resolve('apps/web/public/fonts/Inspiratiq_tiny_museum-Regular.otf')
const clear = { r: 0, g: 0, b: 0, alpha: 0 }
async function lettering(text, size, { centre, left, y, tilt = 0, color = '#6b3a22' }) {
  let input = await sharp({ text: { text: `<span foreground="${color}">${text}</span>`, font: `Inspiratiq_tiny_museum ${size}`, fontfile: FONT, rgba: true, dpi: 72 } }).png().toBuffer()
  if (tilt) input = await sharp(input).rotate(tilt, { background: clear }).png().toBuffer()
  const { width, height } = await sharp(input).metadata()
  return { input, left: Math.round(left ?? centre - width / 2), top: Math.round(y - height / 2) }
}
const doubled = async (file) => {
  const { width } = await sharp(file).metadata()
  return sharp(file).resize({ width: width * 2 }).png().toBuffer()
}

const stallBox = await opaqueBox(prop('fish_bait_store'))
const stall = await sharp(prop('fish_bait_store')).composite([await lettering('THE BAIT SHOP', 118, { centre: 1086, y: 1262 })]).png().toBuffer()
await save('bait-shop', sharp(stall).extract(stallBox))

const fish = await sharp(prop('pond_fish')).resize({ width: 190 }).png().toBuffer()
await save('notice-sign', sharp(await doubled(prop('pond_rules_sign'))).composite([
  await lettering('POND RULES', 96, { left: 190, y: 300 }),
  { input: fish, left: 860, top: 205 },
  await lettering('1. CAST IN THE GOLD ZONE', 54, { left: 190, y: 452 }),
  await lettering('2. WAIT FOR A BITE', 54, { left: 190, y: 544 }),
  await lettering('3. HOOK IT QUICK', 54, { left: 190, y: 636 }),
  await lettering('4. REEL IT IN, REST IF IT PULLS', 54, { left: 190, y: 728 }),
  await lettering('BOUNTIES AND RECORDS INSIDE', 54, { left: 190, y: 820 }),
]))

const bloom = await sharp(layer(139)).extract(await opaqueBox(layer(139))).resize({ width: 420 }).png().toBuffer()
const bloomHeight = (await sharp(bloom).metadata()).height
await save('pond-sign', sharp(await doubled(prop('monet_pond_sign'))).composite([
  await lettering('MONET&apos;S LILY POND', 104, { centre: 683, y: 610 }),
  { input: bloom, left: 683 - 210, top: Math.round(880 - bloomHeight / 2) },
]))
await save('score-sign', sharp(await doubled(prop('score_tracker'))).composite([
  await lettering('SCORE', 96, { centre: 490, y: 150, tilt: 5.9 }),
]))

const hatBox = await opaqueBox(resolve(source, 'file6.png'))
const hat = await save('fishing-hat', sharp(resolve(source, 'file6.png')).extract(hatBox))
layout.hat = { aspect: hat.width / hat.height }

// Marlow holds the same rod upright.
const upright = await sharp(rodLayer(140)).rotate(-64.4, { background: clear }).png().toBuffer()
const held = await save('rod-upright', sharp(upright).extract(await opaqueBox(upright)))
layout.heldRod = { aspect: held.width / held.height }

// The stepping-stone path: where its middle runs, bottom row to top, so it can be laid from a bank foot to a prop.
{
  const { data, info } = await sharp(prop('pond_path')).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const centre = []
  for (let i = 0; i <= 12; i++) {
    const y = Math.round((info.height - 1) * (1 - i / 12) * 0.96 + info.height * 0.02)
    let first = -1, last = -1
    for (let x = 0; x < info.width; x++) if (data[(y * info.width + x) * 4 + 3] > 127) { if (first < 0) first = x; last = x }
    centre.push(Number(((first + last) / 2 / info.width).toFixed(3)))
  }
  await save('stone-path', sharp(prop('pond_path')))
  layout.path = { aspect: info.width / info.height, centre }
}

await writeFile(resolve(target, 'layout.json'), JSON.stringify(layout, null, 2) + '\n')
const manifestPath = resolve('apps/web/src/generated/asset-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const name of Object.keys(heights)) {
  manifest.images[`pond/${name}`] = await buildImage(`pond/${name}`, resolve(target, `${name}.png`), heights[name], lossless.has(name))
  console.log(`pond/${name}: ${manifest.images[`pond/${name}`].w}×${manifest.images[`pond/${name}`].h}`)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
