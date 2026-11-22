/* Adds KTX2 (Basis UASTC) copies of the shipped lossy atlas sheets, in place.
   A GPU-compressed sheet uploads with no decode or RGBA copy: a phone trace spent
   5.6 s in texSubImage2D on these sheets.

   scripts/optimize-assets.ts can build the same with ASSET_KTX2=1, but it wipes
   public/immutable and rewrites the whole manifest, dropping what later tools
   (prepare-models, compose-atelier, bake-pond-path) add. This only adds files and
   `ktx2` fields. Same encoder settings and transcoder as the optimiser; a sheet
   keeps KTX2 only if every sprite is as faithful to the lossless original as the
   AVIF that ships today (within the optimiser's 0.001 slack).

   Run from the repo root: node apps/web/tooling/ktx2-atlases.mjs

   Tried on gamma 2026-11-21 and removed: texture upload time did not drop (the
   pond's textures, not these sheets, were the cost) and a phone's first visit
   grew by ~1.9 MB. Rerun only if a trace shows these sheets' uploads mattering. */

import { createHash } from 'node:crypto'
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { encodeToKTX2 } from 'ktx2-encoder'
import sharp from 'sharp'

const OUT = 'apps/web/public/immutable'
const MANIFEST = 'apps/web/src/generated/asset-manifest.json'
const THREE_BASIS = 'node_modules/three/examples/jsm/libs/basis'
const THREE_VERSION = JSON.parse(await readFile('node_modules/three/package.json', 'utf8')).version
const TRANSCODER_DIR = `basis-${THREE_VERSION}`
const FIDELITY_SLACK = 0.001
const RGBA32 = 13

async function loadTranscoder() {
  const path = join(process.cwd(), THREE_BASIS, 'basis_transcoder.js')
  const module = { exports: {} }
  new Function('module', 'exports', 'require', '__filename', '__dirname', await readFile(path, 'utf8'))(
    module, module.exports, createRequire(path), path, dirname(path),
  )
  const instance = await module.exports({ wasmBinary: await readFile(join(THREE_BASIS, 'basis_transcoder.wasm')) })
  instance.initializeBasis()
  return instance
}
const { KTX2File } = await loadTranscoder()

async function decodeKtx2(ktx2) {
  const file = new KTX2File(ktx2)
  try {
    const width = file.getWidth()
    const height = file.getHeight()
    if (!file.startTranscoding()) throw new Error('KTX2 transcoding failed to start')
    const out = new Uint8Array(file.getImageTranscodedSizeInBytes(0, 0, 0, RGBA32))
    if (!file.transcodeImage(out, 0, 0, 0, RGBA32, 0, -1, -1)) throw new Error('KTX2 transcoding failed')
    return await sharp(Buffer.from(out), { raw: { width, height, channels: 4 } }).flip().png().toBuffer()
  } finally {
    file.close()
    file.delete()
  }
}

async function encodeUastc(png) {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return encodeToKTX2(new Uint8Array(png), {
    isUASTC: true,
    uastcLDRQualityLevel: 2,
    needSupercompression: true,
    generateMipmap: true,
    isKTX2File: true,
    isSetKTX2SRGBTransferFunc: true,
    isPerceptual: true,
    isYFlip: true,
    enableDebug: false,
    imageDecoder: async () => ({ data: new Uint8Array(data), width: info.width, height: info.height }),
  })
}

// Copied from the optimiser: mean SSIM of luma over 8px windows, alpha over grey, flat windows skipped.
async function fidelity(reference, encoded) {
  const read = async (input) => {
    const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
    const luma = new Float64Array(info.width * info.height)
    for (let i = 0; i < luma.length; i++) {
      const a = data[i * 4 + 3] / 255
      const c = (k) => data[i * 4 + k] * a + 128 * (1 - a)
      luma[i] = 0.299 * c(0) + 0.587 * c(1) + 0.114 * c(2)
    }
    return { luma, width: info.width, height: info.height }
  }
  const [A, B] = await Promise.all([read(reference), read(encoded)])
  const { width, height } = A
  const C1 = (0.01 * 255) ** 2
  const C2 = (0.03 * 255) ** 2
  let total = 0
  let windows = 0
  for (let y = 0; y + 8 <= height; y += 4) {
    for (let x = 0; x + 8 <= width; x += 4) {
      let ma = 0, mb = 0
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
        const k = (y + j) * width + x + i
        ma += A.luma[k]
        mb += B.luma[k]
      }
      ma /= 64
      mb /= 64
      let va = 0, vb = 0, cov = 0
      for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
        const k = (y + j) * width + x + i
        const da = A.luma[k] - ma
        const db = B.luma[k] - mb
        va += da * da
        vb += db * db
        cov += da * db
      }
      va /= 63
      vb /= 63
      cov /= 63
      if (va < 1 && vb < 1) continue
      total += ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2))
      windows += 1
    }
  }
  return windows ? total / windows : 1
}

const cut = (sheet, [left, top, width, height]) => sharp(sheet).extract({ left, top, width, height }).png().toBuffer()

const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'))
let kept = 0
for (const [group, densities] of Object.entries(manifest.atlases)) {
  for (const density of ['x2', 'x3']) {
    for (const sheet of densities[density]) {
      const label = `${group} ${density} ${sheet.src}`
      if (!sheet.avif) { console.log(`skip  ${label} (no AVIF sheet to beat; UASTC cannot match a lossless one)`); continue }
      const original = await readFile(join(OUT, sheet.src))
      // The gate needs the true pixels: a lossless webp carries a VP8L chunk near the start.
      if (!original.subarray(0, 64).includes('VP8L')) throw new Error(`${label}: fallback is not lossless webp`)
      const png = await sharp(original).png().toBuffer()
      const avif = await sharp(await readFile(join(OUT, sheet.avif))).png().toBuffer()
      const ktx2 = Buffer.from(await encodeUastc(png))
      const decoded = await decodeKtx2(ktx2)
      let worst = Infinity
      let passes = true
      for (const [name, rect] of Object.entries(sheet.sprites)) {
        const reference = await cut(png, rect)
        const target = await fidelity(reference, await cut(avif, rect))
        const got = await fidelity(reference, await cut(decoded, rect))
        worst = Math.min(worst, got - target)
        if (got < target - FIDELITY_SLACK) { passes = false; console.log(`  ${name}: ktx2 ${got.toFixed(5)} < avif ${target.toFixed(5)}`) }
      }
      if (!passes) { delete sheet.ktx2; console.log(`fail  ${label}`); continue }
      const file = `${sheet.src.split('.')[0]}.${createHash('sha256').update(ktx2).digest('hex').slice(0, 10)}.ktx2`
      await writeFile(join(OUT, file), ktx2)
      sheet.ktx2 = file
      kept += 1
      const kb = (n) => `${Math.round(n / 1024)}KB`
      console.log(`keep  ${label} -> ${file} ${kb(ktx2.length)} (avif ${kb((await readFile(join(OUT, sheet.avif))).length)}), worst sprite margin ${worst.toFixed(5)}`)
    }
  }
}

if (kept) {
  await mkdir(join(OUT, TRANSCODER_DIR), { recursive: true })
  for (const file of ['basis_transcoder.js', 'basis_transcoder.wasm']) await copyFile(join(THREE_BASIS, file), join(OUT, TRANSCODER_DIR, file))
  manifest.ktx2 = { transcoder: `${TRANSCODER_DIR}/` }
}
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`${kept} sheet(s) with KTX2; manifest ktx2 = ${JSON.stringify(manifest.ktx2)}`)
