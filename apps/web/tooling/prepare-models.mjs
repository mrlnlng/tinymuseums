import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

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
  const viewOrder = [...usedViews].sort((a, b) => a - b)
  const viewIndex = new Map(viewOrder.map((old, i) => [old, i]))
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

async function rig(name) {
  return { src: await write(name, 'glb', slimGlb(await master(`${name}.glb`))) }
}

async function image(name, options = {}) {
  const input = sharp(await master(`atelier/${name}.png`))
  const { width, height } = await input.metadata()
  const body = await input.webp({ quality: 90, alphaQuality: 100, effort: 6, ...options }).toBuffer()
  return { src: await write(`atelier-${name}`, 'webp', body), width, height }
}

const models = {
  bunnyRig: await rig('bunny-rig-kiki'),
  catRig: await rig('cat-rig-kiki'),
  bunnyRigBow: { src: await write('bunny-rig-bow', 'png', await master('bunny-rig-bow.png')) },
}

const atelier = {
  staircase: await image('staircase', { lossless: true }),
  mannequin: await image('mannequin-bare', { lossless: true }),
  mannequinDressed: await image('mannequin-kiki', { lossless: true }),
  mannequinDress: await image('mannequin-dress', { lossless: true }),
  mannequinBow: await image('mannequin-bow', { lossless: true }),
  railing: await image('railing', { lossless: true }),
  platform: await image('platform', { lossless: true }),
  spotlight: await image('spotlight'),
  wallpaper: await image('wallpaper'),
  column: await image('column', { lossless: true }),
  costumeKiki: await image('costume-kiki', { lossless: true }),
  catStanding: await image('cat-standing', { lossless: true }),
}

const path = new URL('src/generated/asset-manifest.json', root)
const before = await readFile(path, 'utf8')
const manifest = JSON.parse(before)
manifest.models = { ...manifest.models, ...models }
manifest.atelier = atelier
const after = JSON.stringify(manifest, null, 2) + '\n'
if (after !== before) await writeFile(path, after)
