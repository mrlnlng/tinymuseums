import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const source = process.argv[2]
if (!source) throw new Error('Usage: node apps/web/tooling/import-landing-assets.mjs <drop-dir>')
const drop = resolve(source)
const root = fileURLToPath(new URL('../../../', import.meta.url))
process.chdir(root)
const target = resolve('apps/web/public/assets/landing')
await mkdir(target, { recursive: true })
await mkdir('apps/web/public/immutable', { recursive: true })

const EXPECTED = {
  'book.png': [502, 395],
  'home_mock.png': [1970, 1118],
}
for (const [name, [width, height]] of Object.entries(EXPECTED)) {
  const info = await sharp(resolve(drop, name)).metadata()
  if (info.width !== width || info.height !== height) {
    throw new Error(`${name} is ${info.width}×${info.height}; expected ${width}×${height}`)
  }
}

/** The cat was never delivered on its own layer, so it is lifted from the mock where it stands. */
const CAT = { left: 13, top: 655, width: 240, height: 425 }
const CAT_INK = 62

/**
 * Nothing else in that corner is near-black, ribbon red or ear pink, so those pixels and whatever
 * they enclose (eyes, nose) are the cat. The mock's left edge crops it, and the cut keeps that edge.
 */
async function cutCat() {
  const { data, info } = await sharp(resolve(drop, 'home_mock.png'))
    .extract(CAT)
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const ink = new Uint8Array(width * height)
  for (let i = 0; i < ink.length; i++) {
    const r = data[i * channels]
    const g = data[i * channels + 1]
    const b = data[i * channels + 2]
    const fur = Math.max(r, g, b) < CAT_INK
    const ribbon = r > 190 && g < 95 && b < 80
    const ear = r > 225 && g > 110 && g < 200 && b > 100 && b < 190
    ink[i] = fur || ribbon || ear ? 1 : 0
  }

  const outside = new Uint8Array(width * height)
  const queue = []
  const visit = (x, y) => {
    const i = y * width + x
    if (ink[i] || outside[i]) return
    outside[i] = 1
    queue.push(i)
  }
  for (let x = 0; x < width; x++) {
    visit(x, 0)
    visit(x, height - 1)
  }
  for (let y = 0; y < height; y++) {
    visit(0, y)
    visit(width - 1, y)
  }
  while (queue.length) {
    const i = queue.pop()
    const x = i % width
    const y = (i - x) / width
    if (x > 0) visit(x - 1, y)
    if (x < width - 1) visit(x + 1, y)
    if (y > 0) visit(x, y - 1)
    if (y < height - 1) visit(x, y + 1)
  }

  // The jewellery box beside the cat has a few matching flecks; only the largest body is the cat.
  const body = new Int32Array(width * height)
  const sizes = [0]
  for (let start = 0; start < body.length; start++) {
    if (outside[start] || body[start]) continue
    const label = sizes.length
    let size = 0
    const stack = [start]
    body[start] = label
    while (stack.length) {
      const i = stack.pop()
      size++
      const x = i % width
      for (const next of [x > 0 ? i - 1 : -1, x < width - 1 ? i + 1 : -1, i - width, i + width]) {
        if (next < 0 || next >= body.length || outside[next] || body[next]) continue
        body[next] = label
        stack.push(next)
      }
    }
    sizes.push(size)
  }
  const cat = sizes.indexOf(Math.max(...sizes))

  let top = height
  let bottom = -1
  let right = -1
  const solid = Buffer.alloc(width * height)
  for (let i = 0; i < solid.length; i++) {
    if (body[i] !== cat) continue
    solid[i] = 255
    const x = i % width
    const y = (i - x) / width
    top = Math.min(top, y)
    bottom = Math.max(bottom, y)
    right = Math.max(right, x)
  }
  if (bottom < 0) throw new Error('no cat found in the mock')
  const alpha = await sharp(solid, { raw: { width, height, channels: 1 } })
    .blur(0.6)
    .extractChannel(0)
    .raw()
    .toBuffer()

  const rgba = Buffer.alloc(width * height * 4)
  for (let i = 0; i < solid.length; i++) {
    const inside = solid[i] === 255
    rgba[i * 4] = inside ? data[i * channels] : 0
    rgba[i * 4 + 1] = inside ? data[i * channels + 1] : 0
    rgba[i * 4 + 2] = inside ? data[i * channels + 2] : 0
    rgba[i * 4 + 3] = i % width === 0 ? solid[i] : alpha[i]
  }
  const pad = 2
  const y0 = Math.max(0, top - pad)
  return sharp(rgba, { raw: { width, height, channels: 4 } }).extract({
    left: 0,
    top: y0,
    width: Math.min(width, right + 1 + pad),
    height: Math.min(height, bottom + 1 + pad) - y0,
  })
}

async function buildImage(name, path) {
  const { data, info } = await sharp(path)
    .webp({ quality: 92, alphaQuality: 100, effort: 6 })
    .toBuffer({ resolveWithObject: true })
  const hash = createHash('sha256').update(data).digest('hex').slice(0, 10)
  const src = `${name.replaceAll('/', '-')}@2x.${hash}.webp`
  await writeFile(resolve('apps/web/public/immutable', src), data)
  return { w: info.width, h: info.height, x2: { w: info.width, h: info.height, src } }
}

const masters = {
  book: sharp(resolve(drop, 'book.png')).trim({ threshold: 0 }),
  cat: await cutCat(),
}

const manifestPath = resolve('apps/web/src/generated/asset-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const [name, image] of Object.entries(masters)) {
  const path = resolve(target, `${name}.png`)
  await image.png({ compressionLevel: 9 }).toFile(path)
  const entry = await buildImage(`landing/${name}`, path)
  manifest.images[`landing/${name}`] = entry
  console.log(`landing/${name}: ${entry.w}×${entry.h}`)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
