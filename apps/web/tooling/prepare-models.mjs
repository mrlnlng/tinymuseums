import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { graftCostume } from './graft-costume.mjs'

const root = new URL('../', import.meta.url)
await mkdir(new URL('public/immutable/', root), { recursive: true })

async function write(name, ext, body) {
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 10)
  const file = `${name}.${hash}.${ext}`
  await writeFile(new URL(`public/immutable/${file}`, root), body)
  console.log(`${fileURLToPath(new URL(`public/immutable/${file}`, root))} (${body.length} bytes)`)
  return file
}

const master = (path) => readFile(new URL(`public/assets/${path}`, root))

// The exports carry every painting twice: as the emissive map the unlit renderer draws, and as
// a base-colour map multiplied by black. Drop the base-colour copies and any identical image
// bytes, then repack the binary chunk; nodes, extras, skins and animation are untouched.
function slimGlb(glb) {
  const jsonLength = glb.readUInt32LE(12)
  const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'))
  const binStart = 20 + jsonLength
  const bin = glb.subarray(binStart + 8, binStart + 8 + glb.readUInt32LE(binStart))
  const view = (index) => {
    const v = json.bufferViews[index]
    return bin.subarray(v.byteOffset ?? 0, (v.byteOffset ?? 0) + v.byteLength)
  }

  // Only the plain layout these exports use is rewritten; anything else stops the build.
  const unsupported = (json.extensionsRequired ?? []).filter((name) => name !== 'KHR_materials_specular')
  if (unsupported.length) throw new Error(`slimGlb: unsupported required extensions ${unsupported}`)
  if ((json.buffers ?? []).length !== 1) throw new Error('slimGlb: expected exactly one buffer')
  if ((json.images ?? []).some((image) => image.bufferView === undefined)) throw new Error('slimGlb: image by URI')

  for (const material of json.materials ?? []) {
    if (material.emissiveTexture) delete material.pbrMetallicRoughness?.baseColorTexture
  }
  // Every texture reference in a material, wherever it sits: core slots and extensions alike.
  const textureRefs = []
  const collect = (node) => {
    if (!node || typeof node !== 'object') return
    for (const [key, value] of Object.entries(node)) {
      if (key.endsWith('Texture') && value && typeof value.index === 'number') textureRefs.push(value)
      else collect(value)
    }
  }
  for (const material of json.materials ?? []) collect(material)
  const keptTextures = [...new Set(textureRefs.map((ref) => ref.index))].sort((a, b) => a - b)
  const textureIndex = new Map(keptTextures.map((old, i) => [old, i]))
  for (const ref of textureRefs) ref.index = textureIndex.get(ref.index)
  json.textures = keptTextures.map((old) => json.textures[old])

  const firstImage = new Map()
  const imageFor = new Map()
  for (const texture of json.textures) {
    const key = createHash('sha256').update(view(json.images[texture.source].bufferView)).digest('hex')
    if (!firstImage.has(key)) firstImage.set(key, texture.source)
    imageFor.set(texture, firstImage.get(key))
  }
  const keptImages = [...new Set(imageFor.values())].sort((a, b) => a - b)
  const imageIndex = new Map(keptImages.map((old, i) => [old, i]))
  for (const texture of json.textures) texture.source = imageIndex.get(imageFor.get(texture))
  json.images = keptImages.map((old) => json.images[old])

  const usedViews = new Set(json.images.map((image) => image.bufferView))
  for (const accessor of json.accessors ?? []) {
    if (accessor.bufferView !== undefined) usedViews.add(accessor.bufferView)
    if (accessor.sparse) {
      usedViews.add(accessor.sparse.indices.bufferView)
      usedViews.add(accessor.sparse.values.bufferView)
    }
  }
  // Grafted colourways repeat the same geometry; identical views are stored once.
  const sameView = new Map()
  const firstView = new Map()
  for (const old of [...usedViews].sort((a, b) => a - b)) {
    const { byteStride, target } = json.bufferViews[old]
    const key = `${byteStride}:${target}:${createHash('sha256').update(view(old)).digest('hex')}`
    if (!firstView.has(key)) firstView.set(key, old)
    sameView.set(old, firstView.get(key))
  }
  const viewOrder = [...new Set(sameView.values())]
  const viewIndex = new Map([...sameView].map(([old, kept]) => [old, viewOrder.indexOf(kept)]))
  const chunks = []
  let offset = 0
  json.bufferViews = viewOrder.map((old) => {
    const bytes = view(old)
    const padding = (4 - (offset % 4)) % 4
    if (padding) chunks.push(Buffer.alloc(padding))
    offset += padding
    const next = { ...json.bufferViews[old], byteOffset: offset }
    chunks.push(bytes)
    offset += bytes.length
    return next
  })
  for (const image of json.images) image.bufferView = viewIndex.get(image.bufferView)
  for (const accessor of json.accessors ?? []) {
    if (accessor.bufferView !== undefined) accessor.bufferView = viewIndex.get(accessor.bufferView)
    if (accessor.sparse) {
      accessor.sparse.indices.bufferView = viewIndex.get(accessor.sparse.indices.bufferView)
      accessor.sparse.values.bufferView = viewIndex.get(accessor.sparse.values.bufferView)
    }
  }

  const binPadding = (4 - (offset % 4)) % 4
  const newBin = Buffer.concat([...chunks, Buffer.alloc(binPadding)])
  json.buffers = [{ byteLength: newBin.length }]
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8')
  jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc((4 - (jsonBytes.length % 4)) % 4, 0x20)])

  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(12 + 8 + jsonBytes.length + 8 + newBin.length, 8)
  const chunkHeader = (length, type) => {
    const h = Buffer.alloc(8)
    h.writeUInt32LE(length, 0)
    h.writeUInt32LE(type, 4)
    return h
  }
  return Buffer.concat([
    header,
    chunkHeader(jsonBytes.length, 0x4e4f534a),
    jsonBytes,
    chunkHeader(newBin.length, 0x004e4942),
    newBin,
  ])
}

async function rig(name, body) {
  return { src: await write(name, 'glb', slimGlb(body ?? await master(`${name}.glb`))) }
}

async function image(name, options = {}) {
  const input = sharp(await master(`atelier/${name}.png`))
  const { width, height } = await input.metadata()
  const body = await input.webp({ quality: 90, alphaQuality: 100, effort: 6, ...options }).toBuffer()
  return { src: await write(`atelier-${name}`, 'webp', body), width, height }
}

// The repainted bunny wears the kiki costume fitted to the first bunny: same skeleton and
// canvas. Its own hanging paw is repeated above the dress, as the first export did. Each
// cardigan colourway is its own costume, and hides the runtime chest bow under its collar.
let bunny = graftCostume(await master('bunny-rig-v2.glb'), await master('bunny-rig-kiki.glb'), {
  skip: ['paw'],
  paws: [{ layer: 'bunny_arm_L', costume: 'kiki', part: 'paw', draw_order: 10 }],
})
// The cat and otter wear the bunny's clothes too. The otter's arms sit where the bunny's do, so
// its clothes keep their place but draw under its lower chin; both arms are repeated over the
// dress, and a smaller Kiki bow sits on its head in place of the star.
let cat = await master('cat-rig-kiki.glb')
let otter = graftCostume(await master('otter-rig.glb'), await master('bunny-rig-kiki.glb'), {
  skip: ['paw'],
  paws: ['otter_arm_R', 'otter_arm_L'].map((layer) => ({ layer, costume: 'kiki', part: 'paw', draw_order: 9 })),
  relabel: (extras) => extras.part === 'bow' ? { ...extras, hides: 'otter_star' } : { ...extras, draw_order: 7.5 },
  fit: { bow: { dx: 120, dy: -10, scale: 0.66, pivot: [636, 659] } },
})
for (const colour of ['red', 'forest-green', 'navy-blue', 'butter-yellow']) {
  const cardigan = await master(`bunny-rig-v2-cardigan-${colour}.glb`)
  const costume = `cardigan-${colour}`
  bunny = graftCostume(bunny, cardigan, { relabel: (extras) => ({ ...extras, costume, hides: 'bowtie' }) })
  cat = graftCostume(cat, cardigan, { relabel: (extras) => ({ ...extras, costume, hides: 'cat_ribbon' }) })
  otter = graftCostume(otter, cardigan, {
    relabel: (extras) => ({ ...extras, costume, draw_order: { body: 7.5, sleeve_R: 7.6, sleeve_L: 7.7 }[extras.part] }),
  })
}

const models = {
  bunnyRig: await rig('bunny-rig-v2-dressed', bunny),
  catRig: await rig('cat-rig-dressed', cat),
  otterRig: await rig('otter-rig-dressed', otter),
  bunnyRigBow: { src: await write('bunny-rig-bow', 'png', await master('bunny-rig-bow.png')) },
}


const atelier = {
  wallpaper: await image('wallpaper'),
  carpet: await image('carpet'),
  curtains: await image('curtains'),
  shelf: await image('shelf'),
  cabinet: await image('cabinet', { lossless: true }),
  jewelryBox: await image('jewelry-box'),
  perfume: await image('perfume'),
  portraitWink: await image('portrait-wink'),
  portraitBunny: await image('portrait-bunny'),
  portraitJiji: await image('portrait-jiji'),
  portraitOtter: await image('portrait-otter'),
  ribbon: await image('ribbon'),
  mannequin: await image('mannequin-bare', { lossless: true }),
  mannequinDress: await image('mannequin-dress', { lossless: true }),
  cardiganRed: await image('mannequin-cardigan-red'),
  cardiganForestGreen: await image('mannequin-cardigan-forest-green'),
  cardiganNavyBlue: await image('mannequin-cardigan-navy-blue'),
  cardiganButterYellow: await image('mannequin-cardigan-butter-yellow'),
  broom: await image('broom'),
  platform: await image('platform', { lossless: true }),
  spotlight: await image('spotlight'),
  column: await image('column', { lossless: true }),
  pillowBlue: await image('pillow-blue'),
  pillowRed: await image('pillow-red'),
  bow: await image('bow'),
  painting: await image('painting'),
  mirror: await image('mirror'),
}

const path = new URL('src/generated/asset-manifest.json', root)
const before = await readFile(path, 'utf8')
const manifest = JSON.parse(before)
manifest.models = { ...manifest.models, ...models }
delete manifest.stairs
manifest.galleryDoor = await image('gallery-door-red', { lossless: true })
delete manifest.galleryLeadIn
manifest.atelier = atelier
manifest.atelier.plaque = { src: manifest.images.plaque.x2.src, width: manifest.images.plaque.x2.w, height: manifest.images.plaque.x2.h }
const after = JSON.stringify(manifest, null, 2) + '\n'
if (after !== before) await writeFile(path, after)
