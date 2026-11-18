import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

// Imports the personal room's art from the 2026-11-17 custom_home drop.
const source = process.argv[2]
if (!source) throw new Error('Usage: node apps/web/tooling/import-home-assets.mjs <custom_home-dir>')
const drop = resolve(source)
const root = fileURLToPath(new URL('../../../', import.meta.url))
process.chdir(root)
const target = resolve('apps/web/public/assets/home')
await mkdir(target, { recursive: true })
await mkdir('apps/web/public/immutable', { recursive: true })

const FURNITURE = {
  armchair: 'basic_furniture/chair_2.png',
  chair: 'basic_furniture/chair.png',
  cubby: 'basic_furniture/shelf_2.png',
  'gold-frame': 'basic_furniture/frame.png',
  hanger: 'basic_furniture/hanger.png',
  mug: 'basic_furniture/mug.png',
  plant: 'basic_furniture/plant_pot.png',
  'round-table': 'basic_furniture/table.png',
  rug: 'basic_furniture/carpet.png',
  'side-table': 'basic_furniture/table_2.png',
  'tulip-vase': 'basic_furniture/vase.png',
  'wall-hooks': 'basic_furniture/wall_hooks.png',
  'wall-shelf': 'basic_furniture/shelf.png',
  window: 'basic_furniture/window.png',
}

/** Behind the ornate damask, whose own background is transparent. */
const ORNATE_PAPER = { r: 249, g: 238, b: 222 }

/**
 * Seamless tiles, found by matching columns (and rows) against shifted copies of the art:
 * pink stripes repeat every 190px, the floral every 2994×569, the damask about 745×741,
 * and the panelling every 1253px (14 panels). The panelling's master has a seam at 1502.
 * The short skirting's wood grain never repeats, so the room mirrors it instead.
 */
const SURFACES = {
  'wallpaper-pink-stripes': () =>
    sharp(resolve(drop, 'wallpaper/pink_stripes.png')).extract({ left: 0, top: 0, width: 380, height: 380 }),
  'wallpaper-blue-floral': () =>
    sharp(resolve(drop, 'wallpaper/blue_floral.png')).extract({ left: 0, top: 0, width: 2994, height: 1138 }).resize(1497, 569),
  'wallpaper-ornate': async () => {
    const tile = await sharp(resolve(drop, 'wallpaper/ornate.png')).extract({ left: 2, top: 0, width: 745, height: 741 }).png().toBuffer()
    return sharp({ create: { width: 745, height: 741, channels: 4, background: { ...ORNATE_PAPER, alpha: 1 } } }).composite([{ input: tile }])
  },
  'baseboard-tall': () =>
    sharp(resolve(drop, 'baseboard/tall_baseboard.png')).extract({ left: 0, top: 0, width: 1253, height: 360 }).resize(627, 180),
  'baseboard-short': () =>
    sharp(resolve(drop, 'baseboard/short_baseboard.png')).extract({ left: 32, top: 0, width: 1590, height: 57 }),
}

/** The doorway exists only in the mock, so it is lifted from there where it stands. */
const DOOR = { left: 16, top: 122, width: 292, height: 526 }
/**
 * Wall, wainscot and skirting colours around the door; anything near these and reachable from the
 * edge is not door. The crop stops at the floor line, whose brown is too close to the door's.
 */
/** In crop rows: one against plain wall, the chair rail's top, and the plinths at the foot. */
const DOOR_PROBE_ROW = 300
const DOOR_RAIL_ROW = 330
const DOOR_PLINTH_ROWS = 30
const DOOR_PLINTH_FLARE = 6
const DOOR_BACKDROP =[[250, 225, 189], [216, 142, 96], [198, 110, 81], [98, 34, 31]]

async function cutDoor() {
  const { data, info } = await sharp(resolve(drop, 'mock_basic_home.png'))
    .extract(DOOR)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info
  const isBackdrop = (i) => {
    const r = data[i * 4]
    const g = data[i * 4 + 1]
    const b = data[i * 4 + 2]
    return DOOR_BACKDROP.some(([br, bg, bb]) => Math.abs(r - br) + Math.abs(g - bg) + Math.abs(b - bb) < 45)
  }
  const outside = new Uint8Array(width * height)
  const queue = []
  const visit = (x, y) => {
    const i = y * width + x
    if (outside[i] || !isBackdrop(i)) return
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
  while (queue.length > 0) {
    const i = queue.pop()
    const x = i % width
    const y = (i - x) / width
    if (x > 0) visit(x - 1, y)
    if (x < width - 1) visit(x + 1, y)
    if (y > 0) visit(x, y - 1)
    if (y < height - 1) visit(x, y + 1)
  }
  for (let i = 0; i < outside.length; i++) if (outside[i]) data[i * 4 + 3] = 0

  // Below the chair rail the backdrop is striped and grained, so each row is clipped to the posts'
  // width, measured against the plain wall; only the flared plinths may reach past it, in frame tan.
  const opaque = (x, y) => data[(y * width + x) * 4 + 3] > 0
  const probe = DOOR_PROBE_ROW
  let left = 0
  let right = width - 1
  while (left < width && !opaque(left, probe)) left++
  while (right > 0 && !opaque(right, probe)) right--
  const tan = (i) => Math.abs(data[i * 4] - 224) + Math.abs(data[i * 4 + 1] - 184) + Math.abs(data[i * 4 + 2] - 136) < 50
  for (let y = DOOR_RAIL_ROW; y < height; y++) {
    const plinth = y >= height - DOOR_PLINTH_ROWS
    for (let x = 0; x < width; x++) {
      const i = y * width + x
      const inside = x >= left && x <= right
      const flare = plinth && x >= left - DOOR_PLINTH_FLARE && x <= right + DOOR_PLINTH_FLARE && tan(i)
      if (!inside && !flare) data[i * 4 + 3] = 0
    }
  }
  return sharp(data, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 0 })
    .resize({ height: 1040, kernel: 'lanczos3' })
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

const masters = { door: await cutDoor() }
for (const [name, file] of Object.entries(FURNITURE)) masters[name] = sharp(resolve(drop, file)).trim({ threshold: 0 })
for (const [name, make] of Object.entries(SURFACES)) masters[name] = await make()

const manifestPath = resolve('apps/web/src/generated/asset-manifest.json')
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'))
for (const [name, image] of Object.entries(masters)) {
  const path = resolve(target, `${name}.png`)
  await image.png({ compressionLevel: 9 }).toFile(path)
  const entry = await buildImage(`home/${name}`, path)
  manifest.images[`home/${name}`] = entry
  console.log(`home/${name}: ${entry.w}×${entry.h}`)
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
