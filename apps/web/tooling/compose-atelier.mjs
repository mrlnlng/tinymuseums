import sharp from 'sharp'

// Bare and dressed mannequins share one canvas, so wearing a costume only swaps the texture.
// Units are the master mannequin's pixels (173 × 525); the output is drawn at SCALE.
export const MANNEQUIN_CANVAS = { padX: 45, padTop: 45, scale: 3, form: { width: 173, height: 525 } }

const root = new URL('../public/assets/', import.meta.url)
const { padX, padTop, scale, form } = MANNEQUIN_CANVAS
const width = (form.width + 2 * padX) * scale
const height = (form.height + padTop) * scale
const centerX = (padX + 86) * scale

const resized = (file, w) => sharp(new URL(file, root).pathname).resize({ width: w, kernel: 'lanczos3' }).png().toBuffer()

async function compose(name, layers) {
  await sharp({ create: { width, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(layers)
    .png({ compressionLevel: 9 })
    .toFile(new URL(`atelier/${name}.png`, root).pathname)
  console.log(`atelier/${name}.png ${width}×${height}`)
}

const body = { input: await resized('atelier/mannequin.png', form.width * scale), left: padX * scale, top: padTop * scale }

const dressWidth = 215 * scale
const dress = await resized('costumes/kiki/dress.png', dressWidth)

await compose('mannequin-bare', [body])
const dressLayer = { input: dress, left: Math.round(centerX - dressWidth / 2), top: (padTop + 175) * scale }
await compose('mannequin-dress', [dressLayer])

// The atelier's bare Ionic column is the helmet pedestal cut below the stand's plate.
const column = await sharp(new URL('pedestal-4-bare.png', root).pathname)
  .extract({ left: 0, top: 654, width: 821, height: 1299 - 654 })
  .png()
  .toBuffer()
await sharp(column)
  .trim()
  .png({ compressionLevel: 9 })
  .toFile(new URL('atelier/column.png', root).pathname)

// The supplied damask is line work on transparency; the room's wall colour goes behind it.
await sharp(new URL('atelier/wallpaper-lines.png', root).pathname)
  .flatten({ background: '#370505' })
  .png({ compressionLevel: 9 })
  .toFile(new URL('atelier/wallpaper.png', root).pathname)
