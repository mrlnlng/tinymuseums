import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
await mkdir(new URL('public/immutable/', root), { recursive: true })

async function emit(name, ext) {
  const body = await readFile(new URL(`public/assets/${name}.${ext}`, root))
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 10)
  const file = `${name}.${hash}.${ext}`
  await writeFile(new URL(`public/immutable/${file}`, root), body)
  console.log(`${fileURLToPath(new URL(`public/immutable/${file}`, root))} (${body.length} bytes)`)
  return file
}

const bunnyRig = { src: await emit('bunny-rig-v4', 'glb') }
const bunnyRigBow = { src: await emit('bunny-rig-bow', 'png') }
const path = new URL('src/generated/asset-manifest.json', root)
const before = await readFile(path, 'utf8')
const manifest = JSON.parse(before)
manifest.models = { ...manifest.models, bunnyRig, bunnyRigBow }
const after = JSON.stringify(manifest, null, 2) + '\n'
if (after !== before) await writeFile(path, after)
