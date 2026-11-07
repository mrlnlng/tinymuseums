import sharp from 'sharp'

// Bare and dressed mannequins share one canvas, so wearing a costume only swaps the texture.
// Units are the master mannequin's pixels (173 × 525); the output is drawn at SCALE.
export const MANNEQUIN_CANVAS = { padX: 62, padTop: 45, scale: 3, form: { width: 173, height: 525 } }

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

// The display dress from the mocks (mannequin_kiki/kiki_costume.png). In 7.png and 8.png it is
// drawn one mock pixel per art pixel on a form 454 px tall, its top 59 form px below the knob.
const dressWidth = Math.round(246 * (form.height / 454) * scale)
const dress = await resized('atelier/kiki-dress-display.png', dressWidth)

await compose('mannequin-bare', [body])
const dressLayer = { input: dress, left: Math.round(centerX - dressWidth / 2), top: (padTop + 59) * scale }
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


// The floral exports share a canvas and their own, slimmer mannequin. Keep that
// alignment, including its neck and stand, instead of stretching clothes over Kiki's form.
const floralSource = new URL('atelier/floral-cardigan-mannequin.png', root).pathname
const sourceSize = { width: 1668, height: 2388 }
const mask = Buffer.from(`<svg width="1668" height="2388"><path fill="white" d="M0 0H1668V490H0Z M0 1504H1668V2388H0Z"/></svg>`)
const neckAndStand = await sharp(floralSource).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
const torso = Buffer.from(`<svg width="1668" height="2388">
<path fill="#bf8a5b" d="M809 1300H864V1560H809Z"/>
<path fill="#f4d9ba" d="M750 380H916Q912 455 1000 520Q1030 570 1010 690L970 950Q1020 1250 980 1320Q840 1390 680 1320Q640 1250 690 950L650 690Q630 570 665 520Q750 455 750 380Z"/>
<path d="M760 463Q834 510 910 463" fill="none" stroke="#edc3a2" stroke-width="7"/>
</svg>`)
const blank = () => sharp({ create: { ...sourceSize, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
const bare = await blank().composite([{ input: torso }, { input: neckAndStand }]).png().toBuffer()
const blue = await sharp(bare).composite([{ input: await sharp(new URL('atelier/blue-floral-dress-display.png', root).pathname).toBuffer() }]).png().toBuffer()
// The floral forms span 974 source px across 263 canvas units; wider canvases take in more on each side.
const floralWidth = Math.round(974 * (width / scale) / 263)
async function floralForm(name, input) {
  await sharp(input).extract({ left: Math.round(345 - (floralWidth - 974) / 2), top: 74, width: floralWidth, height: 2110 })
    .resize(width, height, { fit: 'fill' }).png({ compressionLevel: 9 })
    .toFile(new URL(`atelier/${name}.png`, root).pathname)
}
await floralForm('mannequin-floral-bare', bare)
await floralForm('mannequin-blue-floral', blue)
await floralForm('mannequin-floral-cardigan', floralSource)
const gold = await sharp(bare).composite([{ input: new URL('atelier/gold-sequin-set-display.png', root).pathname }]).png().toBuffer()
await floralForm('mannequin-gold-sequin', gold)
await floralForm('mannequin-gold-cape', await sharp(gold).composite([{ input: new URL('atelier/gold-sequin-cape-display.png', root).pathname }]).png().toBuffer())
for (const name of ['flower-crown', 'hibiscus-blue', 'hibiscus-yellow', 'hibiscus-pink', 'blue-cap', 'daisy-clip']) {
  await sharp(new URL(`atelier/${name}.png`, root).pathname).trim()
    .png({ compressionLevel: 9 }).toFile(new URL(`atelier/${name}-trimmed.png`, root).pathname)
}

// In bruce_mock_scene.png the tutu is on the plain form, 0.261 form px per art px, the art's
// corner at (-131.4, -57.7) form px from the form's top left.
const tutuScale = 0.2611 * scale
const tutuSized = await sharp(new URL('atelier/tutu-display.png', root).pathname)
  .resize({ width: Math.round(1668 * tutuScale), kernel: 'lanczos3' }).png().toBuffer()
const tutu = await sharp(tutuSized)
  .extract({ left: Math.round((131.4 - padX) * scale), top: Math.round((57.7 - padTop) * scale), width, height })
  .png().toBuffer()
await compose('mannequin-tutu', [body, { input: tutu, left: 0, top: 0 }])
