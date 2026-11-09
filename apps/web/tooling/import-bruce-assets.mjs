import { copyFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

// Split the supplied framed paintings into interchangeable artwork and frame layers.
// Keep the native frame canvases and both signs' shared canvas for room alignment.
const source = process.argv[2]
if (!source) throw new Error('Usage: node apps/web/tooling/import-bruce-assets.mjs <source-dir>')
const target = fileURLToPath(new URL('../public/assets/atelier/', import.meta.url))
for (const { file, painting, frame, opening } of [
  { file: 'file1.png', painting: 'bruce-painting-garden', frame: 'bruce-frame-blue',
    opening: { left: 101, top: 110, width: 508, height: 728 } },
  { file: 'file.png', painting: 'bruce-painting-pond', frame: 'bruce-frame-cream',
    opening: { left: 61, top: 69, width: 281, height: 401 } },
]) {
  const input = resolve(source, file)
  const { width, height } = await sharp(input).metadata()
  const { left, top, width: w, height: h } = opening
  const mask = Buffer.from(`<svg width="${width}" height="${height}"><rect x="${left}" y="${top}" width="${w}" height="${h}" fill="white"/></svg>`)
  await sharp(input).extract(opening).png({ compressionLevel: 9 })
    .toFile(resolve(target, `${painting}.png`))
  await sharp(input).composite([{ input: mask, blend: 'dest-out' }])
    .png({ compressionLevel: 9 }).toFile(resolve(target, `${frame}.png`))
}
await copyFile(resolve(source, 'file2.png'), resolve(target, 'bruce-tag.png'))
await copyFile(resolve(source, 'file3.png'), resolve(target, 'tag-blank.png'))
