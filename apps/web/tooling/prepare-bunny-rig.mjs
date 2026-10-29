import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const body = await readFile(new URL('public/assets/bunny-rig-v4.glb', root))
const hash = createHash('sha256').update(body).digest('hex').slice(0, 10)
const file = `bunny-rig-v4.${hash}.glb`
await mkdir(new URL('public/immutable/', root), { recursive: true })
await writeFile(new URL(`public/immutable/${file}`, root), body)
const path = new URL('src/generated/asset-manifest.json', root)
const before = await readFile(path, 'utf8')
const manifest = JSON.parse(before)
manifest.models = { ...manifest.models, bunnyRig: { src: file } }
const after = JSON.stringify(manifest, null, 2) + '\n'
if (after !== before) await writeFile(path, after)
console.log(`${fileURLToPath(new URL(`public/immutable/${file}`, root))} (${body.length} bytes)`)
