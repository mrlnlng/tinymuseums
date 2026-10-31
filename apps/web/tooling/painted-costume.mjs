import sharp from 'sharp'
import { Matrix4, Quaternion, Vector3 } from 'three'

// Add a painted layer to the existing skeleton. A subdivided dress blends chest/hips
// weights so it follows breathing and walking without moving with either leg.
export async function paintedCostume(glb, png, { costume, part = 'body', bone, drawOrder, hides = '', dx = 0, dy = 0, scale = 1, transform, mask }) {
  const jsonLength = glb.readUInt32LE(12)
  const json = JSON.parse(glb.subarray(20, 20 + jsonLength))
  const binStart = 28 + jsonLength
  const chunks = [glb.subarray(binStart, binStart + glb.readUInt32LE(20 + jsonLength))]
  let length = chunks[0].length
  const append = (bytes, target) => {
    const pad = (4 - length % 4) % 4
    chunks.push(Buffer.alloc(pad), bytes)
    length += pad
    const index = json.bufferViews.length
    json.bufferViews.push({ buffer: 0, byteOffset: length, byteLength: bytes.length, ...(target ? { target } : {}) })
    length += bytes.length
    return index
  }
  const accessor = (values, type, componentType, target) => {
    const sizes = { VEC2: 2, VEC3: 3, VEC4: 4, SCALAR: 1 }
    const view = append(Buffer.from(values.buffer, values.byteOffset, values.byteLength), target)
    const entry = { bufferView: view, componentType, count: values.length / sizes[type], type }
    if (type === 'VEC3') {
      entry.min = [0, 1, 2].map(k => Math.min(...values.filter((_, i) => i % 3 === k)))
      entry.max = [0, 1, 2].map(k => Math.max(...values.filter((_, i) => i % 3 === k)))
    }
    json.accessors.push(entry)
    return json.accessors.length - 1
  }
  const source = mask ? await sharp(png).composite([{ input: Buffer.from(`<svg width="1668" height="2388"><path fill="white" d="${mask}"/></svg>`), blend: 'dest-in' }]).png().toBuffer() : png
  const { data, info } = await sharp(source).trim().png().toBuffer({ resolveWithObject: true })
  const x0 = -info.trimOffsetLeft
  const y0 = -info.trimOffsetTop
  const parent = new Map()
  json.nodes.forEach((node, i) => (node.children ?? []).forEach(c => parent.set(c, i)))
  const local = node => node.matrix ? new Matrix4().fromArray(node.matrix) : new Matrix4().compose(
    new Vector3().fromArray(node.translation ?? [0, 0, 0]),
    new Quaternion().fromArray(node.rotation ?? [0, 0, 0, 1]),
    new Vector3().fromArray(node.scale ?? [1, 1, 1]),
  )
  const world = i => parent.has(i) ? world(parent.get(i)).multiply(local(json.nodes[i])) : local(json.nodes[i])
  const joints = json.skins[0].joints.map(i => json.nodes[i].name)
  const positions = [], uv = [], weights = [], indices = [], jointIndices = []
  const cols = bone ? 1 : 24, rows = bone ? 1 : 24
  for (let row = 0; row <= rows; row++) for (let col = 0; col <= cols; col++) {
    const px = x0 + col / cols * info.width
    const py = y0 + row / rows * info.height
    const x = transform ? transform.xx * (px - 834) + transform.x : (px - 834) * scale + dx + 834
    const y = transform ? transform.yy * (py - 491) + transform.yx * (px - 834) + transform.y : (py - 1194) * scale + dy + 1194
    positions.push((x - 834) / 1000, (1194 - y) / 1000, 0.02)
    uv.push(col / cols, row / rows)
    const chest = Math.max(0, Math.min(1, (1750 - y) / 450))
    jointIndices.push(joints.indexOf('chest'), joints.indexOf('hips'), 0, 0)
    weights.push(chest, 1 - chest, 0, 0)
    if (row < rows && col < cols) {
      const a = row * (cols + 1) + col, b = a + cols + 1
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
  json.images.push({ bufferView: append(data), mimeType: 'image/png' })
  json.textures.push({ source: json.images.length - 1 })
  json.materials.push({
    name: costume + '_' + part, doubleSided: true, alphaMode: 'BLEND',
    pbrMetallicRoughness: { baseColorFactor: [0, 0, 0, 1], metallicFactor: 0, roughnessFactor: 1 },
    emissiveFactor: [1, 1, 1], emissiveTexture: { index: json.textures.length - 1 },
  })
  const attributes = {
    POSITION: accessor(new Float32Array(positions), 'VEC3', 5126, 34962),
    TEXCOORD_0: accessor(new Float32Array(uv), 'VEC2', 5126, 34962),
  }
  if (!bone) {
    attributes.JOINTS_0 = accessor(new Uint8Array(jointIndices), 'VEC4', 5121, 34962)
    attributes.WEIGHTS_0 = accessor(new Float32Array(weights), 'VEC4', 5126, 34962)
  }
  json.meshes.push({ primitives: [{ attributes, indices: accessor(new Uint16Array(indices), 'SCALAR', 5123, 34963), material: json.materials.length - 1 }] })
  const node = { name: 'costume_' + costume + '_' + part, mesh: json.meshes.length - 1, extras: { layer: 'costume', costume, part, draw_order: drawOrder, hides } }
  const rootIndex = json.scenes[json.scene ?? 0].nodes[0]
  let parentIndex = rootIndex
  if (bone) {
    parentIndex = json.nodes.findIndex(n => n.name === bone)
    if (parentIndex < 0) throw new Error('Missing bone ' + bone)
    node.matrix = world(parentIndex).invert().toArray()
  } else node.skin = 0
  json.nodes.push(node)
  const owner = json.nodes[parentIndex]
  owner.children = [...(owner.children ?? []), json.nodes.length - 1]
  const pad = (4 - length % 4) % 4
  const bin = Buffer.concat([...chunks, Buffer.alloc(pad)])
  json.buffers = [{ byteLength: bin.length }]
  let body = Buffer.from(JSON.stringify(json))
  body = Buffer.concat([body, Buffer.alloc((4 - body.length % 4) % 4, 32)])
  const header = Buffer.alloc(20)
  header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4)
  header.writeUInt32LE(28 + body.length + bin.length, 8)
  header.writeUInt32LE(body.length, 12); header.writeUInt32LE(0x4e4f534a, 16)
  const binHeader = Buffer.alloc(8)
  binHeader.writeUInt32LE(bin.length, 0); binHeader.writeUInt32LE(0x004e4942, 4)
  return Buffer.concat([header, body, binHeader, bin])
}
