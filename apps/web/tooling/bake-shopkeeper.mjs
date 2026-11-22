/* Bakes the pond shopkeeper's silver coat into the otter's body textures, so the pond no
   longer recolours them pixel by pixel when it opens (~760 ms on a low-tier phone trace).

   Reads the otter model the manifest serves, recolours each body texture (the meshes whose
   extras.layer is "character") with the same fur shift the room used to run, and writes the
   changed ones to public/immutable plus `shopkeeper` in the manifest, tagged with the model
   they were baked from. Rerun after the otter model changes:
   node apps/web/tooling/bake-shopkeeper.mjs   (from the repo root) */

import { createHash } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const OUT = 'apps/web/public/immutable'
const MANIFEST = 'apps/web/src/generated/asset-manifest.json'

const COATS = {
  silver: { hue: 32, saturation: 0.32, lightness: 1.1 },
  ginger: { hue: 20, saturation: 1.45, lightness: 1.08 },
  cocoa: { hue: 16, saturation: 0.8, lightness: 0.72 },
}
const COAT_NAME = 'silver'
const COAT = COATS[COAT_NAME]

/** Shifts the brown fur and leaves the outline, eyes, cheeks and mouth as painted. */
function recolourFur(px, at) {
  const r = px[at] / 255, g = px[at + 1] / 255, b = px[at + 2] / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min || l < 0.3 || l > 0.9) return
  const d = max - min
  const s = d / (1 - Math.abs(2 * l - 1))
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4
  h = (h * 60 + 360) % 360
  // Fur and belly sit between 12° and 34°; the pink cheeks are redder and stay put.
  if (h < 12 || h > 34 || s < 0.15) return
  const nl = Math.min(0.95, l * COAT.lightness)
  const ns = Math.min(1, s * COAT.saturation)
  const c = (1 - Math.abs(2 * nl - 1)) * ns
  const hp = COAT.hue / 60
  const x = c * (1 - Math.abs((hp % 2) - 1))
  const [r1, g1, b1] = hp < 1 ? [c, x, 0] : hp < 2 ? [x, c, 0] : [0, c, x]
  const m = nl - c / 2
  px[at] = Math.round((r1 + m) * 255)
  px[at + 1] = Math.round((g1 + m) * 255)
  px[at + 2] = Math.round((b1 + m) * 255)
}

// Self-check: a mid brown turns silver-grey, and pure white (outline paper) is left alone.
{
  const brown = new Uint8ClampedArray([150, 100, 60, 255])
  recolourFur(brown, 0)
  if (brown[0] === 150 && brown[1] === 100) throw new Error('recolourFur left brown fur unchanged')
  const white = new Uint8ClampedArray([255, 255, 255, 255])
  recolourFur(white, 0)
  if (white.join() !== '255,255,255,255') throw new Error('recolourFur changed white')
}

function readGlb(buffer) {
  if (buffer.readUInt32LE(0) !== 0x46546c67) throw new Error('not a GLB')
  let offset = 12
  let json = null
  let bin = null
  while (offset < buffer.length) {
    const length = buffer.readUInt32LE(offset)
    const type = buffer.readUInt32LE(offset + 4)
    const chunk = buffer.subarray(offset + 8, offset + 8 + length)
    if (type === 0x4e4f534a) json = JSON.parse(chunk.toString('utf8'))
    else if (type === 0x004e4942) bin = chunk
    offset += 8 + length
  }
  if (!json || !bin) throw new Error('GLB without JSON or BIN chunk')
  return { json, bin }
}

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
const model = manifest.models.otterRig.src
const { json, bin } = readGlb(await readFile(join(OUT, model)))

// The rig paints with each material's emissive texture, else its base colour (rig.ts).
const bodyTextures = new Set()
for (const node of json.nodes ?? []) {
  if (node.extras?.layer !== 'character' || node.mesh === undefined) continue
  for (const primitive of json.meshes[node.mesh].primitives) {
    const material = json.materials[primitive.material]
    const texture = (material.emissiveTexture ?? material.pbrMetallicRoughness?.baseColorTexture)?.index
    if (texture !== undefined) bodyTextures.add(texture)
  }
}

const maps = {}
for (const index of bodyTextures) {
  const texture = json.textures[index]
  const image = json.images[texture.source]
  // Three names a glTF texture after the texture, else its image; paintWith matches on that.
  const name = texture.name || image.name
  if (!name) throw new Error(`body texture ${index} has no name to match at runtime`)
  const view = json.bufferViews[image.bufferView]
  const encoded = bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength)
  const { data, info } = await sharp(encoded).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const before = Buffer.from(data)
  const pixels = new Uint8ClampedArray(data.buffer, data.byteOffset, data.length)
  for (let at = 0; at < pixels.length; at += 4) if (pixels[at + 3] > 0) recolourFur(pixels, at)
  if (before.equals(data)) { console.log(`same  ${name}`); continue }
  const body = await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ lossless: true, effort: 6 }).toBuffer()
  const file = `pond-keeper-${name.replaceAll('_', '-')}.${createHash('sha256').update(body).digest('hex').slice(0, 10)}.webp`
  await writeFile(join(OUT, file), body)
  maps[name] = file
  console.log(`baked ${name} ${info.width}x${info.height} -> ${file} ${Math.round(body.length / 1024)}KB`)
}

manifest.shopkeeper = { model, coat: COAT_NAME, maps }
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`${Object.keys(maps).length} coat textures baked from ${model}`)
