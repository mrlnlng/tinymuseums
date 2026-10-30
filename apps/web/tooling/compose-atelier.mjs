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
const dressMeta = await sharp(dress).metadata()
const bowWidth = 118 * scale
const bow = await resized('costumes/kiki/bow.png', bowWidth)
const bowMeta = await sharp(bow).metadata()

await compose('mannequin-bare', [body])
const dressLayer = { input: dress, left: Math.round(centerX - dressWidth / 2), top: (padTop + 175) * scale }
const bowLayer = {
  input: bow,
  left: Math.round(centerX - bowWidth / 2 + 6),
  top: Math.round((padTop + 8) * scale - bowMeta.height / 2 + 10),
}
await compose('mannequin-kiki', [body, dressLayer, bowLayer])
await compose('mannequin-dress', [dressLayer])
await compose('mannequin-bow', [bowLayer])

// Isolate the existing golden railing for the foreground pass during a climb.
const stairSource = sharp(new URL('atelier/staircase.png', root).pathname)
const { data: rail, info } = await stairSource.ensureAlpha().raw().toBuffer({ resolveWithObject: true })
for (let i = 0; i < rail.length; i += 4) {
  if (!(rail[i] > 140 && rail[i + 1] > 70 && rail[i + 2] < 35)) rail[i + 3] = 0
}
await sharp(rail, { raw: info }).png().toFile(new URL('atelier/railing.png', root).pathname)



// The atelier's bare Ionic column is the helmet pedestal cut below the stand's plate.
const column = await sharp(new URL('pedestal-4-bare.png', root).pathname)
  .extract({ left: 0, top: 654, width: 821, height: 1299 - 654 })
  .png()
  .toBuffer()
await sharp(column)
  .trim()
  .png({ compressionLevel: 9 })
  .toFile(new URL('atelier/column.png', root).pathname)

// What flies between the form and the character: the bow over the dress, as on the form.
{
  const w = dressWidth
  const bowTop = 0
  const dressTop = Math.round(bowMeta.height * 0.62)
  await sharp({ create: { width: w, height: dressTop + dressMeta.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([
      { input: dress, left: 0, top: dressTop },
      { input: bow, left: Math.round((w - bowWidth) / 2), top: bowTop },
    ])
    .png({ compressionLevel: 9 })
    .toFile(new URL('atelier/costume-kiki.png', root).pathname)
}

// The waiting cat is the rig's rest pose (walk frame 1), facing the visitor arriving from the left.
await sharp(new URL('atelier/cat-standing-source.png', root).pathname).trim().png({ compressionLevel: 9 })
  .toFile(new URL('atelier/cat-standing.png', root).pathname)
