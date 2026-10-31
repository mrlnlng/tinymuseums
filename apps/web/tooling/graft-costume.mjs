// Moves the costume layers of one rig export onto another rig with the same skeleton and layer
// canvas, so a costume fitted once (the kiki export) dresses a repainted character.

function parse(glb) {
  const jsonLength = glb.readUInt32LE(12)
  const json = JSON.parse(glb.subarray(20, 20 + jsonLength).toString('utf8'))
  const binStart = 20 + jsonLength
  const bin = glb.subarray(binStart + 8, binStart + 8 + glb.readUInt32LE(binStart))
  return { json, bin }
}

function serialize(json, bin) {
  const padded = Buffer.concat([bin, Buffer.alloc((4 - (bin.length % 4)) % 4)])
  json.buffers = [{ byteLength: padded.length }]
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8')
  jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc((4 - (jsonBytes.length % 4)) % 4, 0x20)])
  const header = Buffer.alloc(12)
  header.writeUInt32LE(0x46546c67, 0)
  header.writeUInt32LE(2, 4)
  header.writeUInt32LE(12 + 8 + jsonBytes.length + 8 + padded.length, 8)
  const chunk = (length, type) => {
    const h = Buffer.alloc(8)
    h.writeUInt32LE(length, 0)
    h.writeUInt32LE(type, 4)
    return h
  }
  return Buffer.concat([header, chunk(jsonBytes.length, 0x4e4f534a), jsonBytes, chunk(padded.length, 0x004e4942), padded])
}

// Column-major 4 × 4 matrices, as glTF stores them.
function compose({ translation: t = [0, 0, 0], rotation: q = [0, 0, 0, 1], scale: s = [1, 1, 1], matrix }) {
  if (matrix) return matrix
  const [x, y, z, w] = q
  return [
    (1 - 2 * (y * y + z * z)) * s[0], 2 * (x * y + z * w) * s[0], 2 * (x * z - y * w) * s[0], 0,
    2 * (x * y - z * w) * s[1], (1 - 2 * (x * x + z * z)) * s[1], 2 * (y * z + x * w) * s[1], 0,
    2 * (x * z + y * w) * s[2], 2 * (y * z - x * w) * s[2], (1 - 2 * (x * x + y * y)) * s[2], 0,
    t[0], t[1], t[2], 1,
  ]
}

function multiply(a, b) {
  const out = new Array(16).fill(0)
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]
  return out
}

// Rigid transforms only: rotation (with any scale) plus translation.
function invert(m) {
  const a = [m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]
  const det = a[0] * (a[4] * a[8] - a[5] * a[7]) - a[3] * (a[1] * a[8] - a[2] * a[7]) + a[6] * (a[1] * a[5] - a[2] * a[4])
  const i = [
    (a[4] * a[8] - a[5] * a[7]) / det, (a[2] * a[7] - a[1] * a[8]) / det, (a[1] * a[5] - a[2] * a[4]) / det,
    (a[5] * a[6] - a[3] * a[8]) / det, (a[0] * a[8] - a[2] * a[6]) / det, (a[2] * a[3] - a[0] * a[5]) / det,
    (a[3] * a[7] - a[4] * a[6]) / det, (a[1] * a[6] - a[0] * a[7]) / det, (a[0] * a[4] - a[1] * a[3]) / det,
  ]
  const [tx, ty, tz] = [m[12], m[13], m[14]]
  return [
    i[0], i[1], i[2], 0, i[3], i[4], i[5], 0, i[6], i[7], i[8], 0,
    -(i[0] * tx + i[3] * ty + i[6] * tz), -(i[1] * tx + i[4] * ty + i[7] * tz), -(i[2] * tx + i[5] * ty + i[8] * tz), 1,
  ]
}

function worldMatrices(json) {
  const parent = new Map()
  json.nodes.forEach((node, i) => (node.children ?? []).forEach((child) => parent.set(child, i)))
  const world = (i) => (parent.has(i) ? multiply(world(parent.get(i)), compose(json.nodes[i])) : compose(json.nodes[i]))
  return { world, parent }
}

/**
 * Copies every costume mesh from `source` into `target`. Skinned layers bind to the target's
 * skin (same joints in the same order); rigid layers hang from the same-named bone, keeping
 * their place on the canvas. `paws` names target base layers repeated above the costume, and
 * `relabel` rewrites each copied layer's extras.
 */
export function graftCostume(targetGlb, sourceGlb, { skip = [], paws = [], relabel = (extras) => extras } = {}) {
  const target = parse(targetGlb)
  const source = parse(sourceGlb)
  const t = target.json
  const s = source.json
  for (const key of ['accessors', 'bufferViews', 'images', 'textures', 'materials', 'meshes']) t[key] ??= []
  t.extensionsUsed = [...new Set([...(t.extensionsUsed ?? []), ...(s.extensionsUsed ?? [])])]
  const sourceJoints = s.skins[0].joints.map((i) => s.nodes[i].name)
  const targetJoints = t.skins[0].joints.map((i) => t.nodes[i].name)
  if (sourceJoints.join() !== targetJoints.join()) throw new Error('graftCostume: the skeletons differ')

  const chunks = [target.bin]
  let length = target.bin.length
  const viewMap = new Map()
  function copyView(index) {
    if (viewMap.has(index)) return viewMap.get(index)
    const view = s.bufferViews[index]
    const bytes = source.bin.subarray(view.byteOffset ?? 0, (view.byteOffset ?? 0) + view.byteLength)
    const padding = (4 - (length % 4)) % 4
    if (padding) chunks.push(Buffer.alloc(padding))
    length += padding
    t.bufferViews.push({ ...view, buffer: 0, byteOffset: length })
    chunks.push(bytes)
    length += bytes.length
    viewMap.set(index, t.bufferViews.length - 1)
    return t.bufferViews.length - 1
  }
  const accessorMap = new Map()
  function copyAccessor(index) {
    if (!accessorMap.has(index)) {
      const accessor = { ...s.accessors[index] }
      if (accessor.sparse) throw new Error('graftCostume: sparse accessor')
      if (accessor.bufferView !== undefined) accessor.bufferView = copyView(accessor.bufferView)
      t.accessors.push(accessor)
      accessorMap.set(index, t.accessors.length - 1)
    }
    return accessorMap.get(index)
  }
  const textureMap = new Map()
  function copyTexture(index) {
    if (!textureMap.has(index)) {
      const texture = { ...s.textures[index] }
      const image = { ...s.images[texture.source] }
      if (image.bufferView === undefined) throw new Error('graftCostume: image by URI')
      image.bufferView = copyView(image.bufferView)
      t.images.push(image)
      texture.source = t.images.length - 1
      if (texture.sampler !== undefined) {
        t.samplers = t.samplers ?? []
        t.samplers.push(s.samplers[texture.sampler])
        texture.sampler = t.samplers.length - 1
      }
      t.textures.push(texture)
      textureMap.set(index, t.textures.length - 1)
    }
    return textureMap.get(index)
  }
  function copyMaterial(index) {
    const material = JSON.parse(JSON.stringify(s.materials[index]))
    const remap = (node) => {
      if (!node || typeof node !== 'object') return
      for (const [key, value] of Object.entries(node)) {
        if (key.endsWith('Texture') && value && typeof value.index === 'number') value.index = copyTexture(value.index)
        else remap(value)
      }
    }
    remap(material)
    t.materials.push(material)
    return t.materials.length - 1
  }
  function copyMesh(index) {
    const mesh = JSON.parse(JSON.stringify(s.meshes[index]))
    for (const primitive of mesh.primitives) {
      for (const key of Object.keys(primitive.attributes)) primitive.attributes[key] = copyAccessor(primitive.attributes[key])
      if (primitive.indices !== undefined) primitive.indices = copyAccessor(primitive.indices)
      if (primitive.material !== undefined) primitive.material = copyMaterial(primitive.material)
    }
    t.meshes.push(mesh)
    return t.meshes.length - 1
  }

  const sourceWorld = worldMatrices(s)
  const targetWorld = worldMatrices(t)
  const byName = (json, name) => json.nodes.findIndex((node) => node.name === name)
  const rootIndex = t.scenes[t.scene ?? 0].nodes[0]
  const root = t.nodes[rootIndex]

  s.nodes.forEach((node, i) => {
    if (node.mesh === undefined || node.extras?.layer !== 'costume' || skip.includes(node.extras.part)) return
    const extras = relabel(node.extras)
    const name = extras.costume === node.extras.costume ? node.name : `${node.name}_${extras.costume}`
    const copy = { name, mesh: copyMesh(node.mesh), extras }
    if (node.skin !== undefined) {
      copy.skin = 0
      t.nodes.push(copy)
      root.children.push(t.nodes.length - 1)
      return
    }
    if (!sourceWorld.parent.has(i)) throw new Error(`graftCostume: ${node.name} hangs from no bone`)
    const boneName = s.nodes[sourceWorld.parent.get(i)].name
    const bone = byName(t, boneName)
    if (bone < 0) throw new Error(`graftCostume: no bone ${boneName}`)
    copy.matrix = multiply(invert(targetWorld.world(bone)), sourceWorld.world(i))
    t.nodes.push(copy)
    t.nodes[bone].children = [...(t.nodes[bone].children ?? []), t.nodes.length - 1]
  })

  for (const { layer, costume, part, draw_order } of paws) {
    const index = byName(t, layer)
    const { children, ...node } = t.nodes[index] ?? {}
    const bone = targetWorld.parent.get(index)
    if (bone === undefined || children?.length) throw new Error(`graftCostume: ${layer} is not a leaf layer on a bone`)
    t.nodes.push({ ...node, name: `${layer}_${costume}`, extras: { layer: 'costume', costume, part, draw_order, hides: '' } })
    t.nodes[bone].children.push(t.nodes.length - 1)
  }

  return serialize(t, Buffer.concat(chunks))
}
