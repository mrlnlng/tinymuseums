// usage: node tooling/npc-sheets/npc-sheet.cjs <artist-sheet.png> <outDir> tooling/npc-sheets/<npc>.json
const sharp = require('sharp')
const [src, out, cfgPath] = process.argv.slice(2)
const CFG = require(require('path').resolve(cfgPath))
const CW = 256, CH = 224, FOOT = 207, HEIGHT = 190, ANCHOR_X = 131
const { WALK, STAND, NAME, DARK = 300 } = CFG
// Eye search boxes in source pixels on the standing frame: [x0, y0, x1, y1, lash direction].
const EYES = CFG.EYES

;(async () => {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const W = info.width, H = info.height
  const a = (x, y) => data[(y * W + x) * 4 + 3]
  const frames = []
  for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
    const [cx, cy, cw, ch] = [c * W / 4, r * H / 2, W / 4, H / 2].map(Math.round)
    const cols = new Array(cw).fill(0), rows = new Array(ch).fill(0)
    for (let y = cy; y < cy + ch; y++) for (let x = cx; x < cx + cw; x++) if (a(x, y) > 20) { cols[x - cx]++; rows[y - cy]++ }
    // Stray specks on the canvas are a few pixels; a real figure fills hundreds per row and column.
    const span = (arr) => { let lo = -1, hi = -1; arr.forEach((n, i) => { if (n >= 30) { if (lo < 0) lo = i; hi = i } }); return [lo, hi] }
    let [x0, x1] = span(cols), [y0, y1] = span(rows)
    if (x0 >= 0) { x0 += cx; x1 += cx; y0 += cy; y1 += cy }
    if (x0 < 0) continue
    // Register on the head: the opaque span of a row through the face, just below the ears.
    const headY = Math.round(y0 + (y1 - y0) * 0.3)
    let hx0 = 1e9, hx1 = -1
    for (let x = x0; x <= x1; x++) if (a(x, headY) > 20) { hx0 = Math.min(hx0, x); hx1 = Math.max(hx1, x) }
    frames.push({ x0, x1, y0, y1, headCx: (hx0 + hx1) / 2 })
  }
  if (frames.length !== 7) throw new Error(`expected 7 frames, found ${frames.length}`)
  if (CFG.NO_MOUTH) for (const f of frames) eraseMouth(data, W, f)
  const k = HEIGHT / Math.max(...frames.map((f) => f.y1 - f.y0 + 1))

  const blinked = Buffer.from(data)
  for (const [ex0, ey0, ex1, ey1, lash] of EYES) closeEye(blinked, W, ex0, ey0, ex1, ey1, lash)

  const cel = async (buf, f) => {
    const w = Math.round((f.x1 - f.x0 + 1) * k), h = Math.round((f.y1 - f.y0 + 1) * k)
    const img = await sharp(buf, { raw: { width: W, height: H, channels: 4 } })
      .extract({ left: f.x0, top: f.y0, width: f.x1 - f.x0 + 1, height: f.y1 - f.y0 + 1 })
      .resize(w, h, { kernel: 'lanczos3' }).png().toBuffer()
    const left = Math.round(ANCHOR_X - (f.headCx - f.x0) * k), top = FOOT + 1 - h
    if (left < 0 || left + w > CW || top < 0) throw new Error(`frame overflows cel: ${left},${top},${w},${h}`)
    return sharp({ create: { width: CW, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite([{ input: img, left, top }]).raw().toBuffer()
  }
  const sheet = async (cels, name) => {
    const comps = cels.map((input, i) => ({ input, raw: { width: CW, height: CH, channels: 4 }, left: i * CW, top: 0 }))
    await sharp({ create: { width: CW * cels.length, height: CH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
      .composite(comps).png({ compressionLevel: 9 }).toFile(`${out}/${name}`)
  }

  await sheet(await Promise.all(WALK.map((i) => cel(data, frames[i]))), NAME + '-walk.png')
  const stand = await cel(data, frames[STAND])
  // Idle cels: neutral, inhale (lean forward, stretch), exhale (lean back, settle), blink.
  await sheet([stand, warp(stand, 3, 1.015), warp(stand, -3, 0.99), await cel(blinked, frames[STAND])], NAME + '-idle.png')
  console.log('scale', k.toFixed(4))
})()

// Shear the figure so its top moves `lean` px while the feet stay planted, and scale its height by `stretch`.
function warp(buf, lean, stretch) {
  const out = Buffer.alloc(buf.length)
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) {
    const rise = FOOT + 1 - y
    const sy = FOOT + 1 - rise / stretch, sx = x - (lean * rise) / HEIGHT
    const px = sample(buf, sx, sy)
    px.forEach((v, c) => (out[(y * CW + x) * 4 + c] = v))
  }
  return out
}

// Bilinear sample over premultiplied alpha so transparent edges don't darken.
function sample(buf, x, y) {
  const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0
  const acc = [0, 0, 0, 0]
  for (const [dx, dy, wt] of [[0, 0, (1 - fx) * (1 - fy)], [1, 0, fx * (1 - fy)], [0, 1, (1 - fx) * fy], [1, 1, fx * fy]]) {
    const xx = x0 + dx, yy = y0 + dy
    if (xx < 0 || yy < 0 || xx >= CW || yy >= CH) continue
    const i = (yy * CW + xx) * 4, al = buf[i + 3] / 255
    acc[0] += buf[i] * al * wt; acc[1] += buf[i + 1] * al * wt; acc[2] += buf[i + 2] * al * wt; acc[3] += al * wt
  }
  if (acc[3] <= 0) return [0, 0, 0, 0]
  return [acc[0] / acc[3], acc[1] / acc[3], acc[2] / acc[3], acc[3] * 255].map(Math.round)
}

// Fill the eye (dark pupil and its highlight) with the surrounding fur, then draw a closed lid in the pupil colour.
function closeEye(buf, W, x0, y0, x1, y1, lash) {
  const at = (x, y) => (y * W + x) * 4
  const dark = (x, y) => { const i = at(x, y); return buf[i + 3] > 128 && buf[i] + buf[i + 1] + buf[i + 2] < DARK }
  const light = (x, y) => { const i = at(x, y); return buf[i] + buf[i + 1] + buf[i + 2] > 600 }
  const mask = new Set()
  let ink = [0, 0, 0], inkN = 0, mx0 = 1e9, mx1 = -1, my0 = 1e9, my1 = -1
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (dark(x, y) || light(x, y)) {
    if (dark(x, y)) { const i = at(x, y); ink[0] += buf[i]; ink[1] += buf[i + 1]; ink[2] += buf[i + 2]; inkN++ }
    mx0 = Math.min(mx0, x); mx1 = Math.max(mx1, x); my0 = Math.min(my0, y); my1 = Math.max(my1, y)
  }
  if (!inkN) throw new Error(`no eye found in ${x0},${y0}`)
  ink = ink.map((v) => Math.round(v / inkN))
  // Grow the mask a few px past the eye so the anti-aliased fringe goes too.
  for (let y = my0 - 4; y <= my1 + 4; y++) for (let x = mx0 - 4; x <= mx1 + 4; x++) {
    let near = false
    for (let dy = -4; dy <= 4 && !near; dy++) for (let dx = -4; dx <= 4 && !near; dx++)
      near = x + dx >= x0 && x + dx <= x1 && y + dy >= y0 && y + dy <= y1 && (dark(x + dx, y + dy) || light(x + dx, y + dy))
    if (near) mask.add(y * W + x)
  }
  inpaint(buf, W, mask)
  // A gentle downward lid curve with a flick at the outer corner.
  const cx = (mx0 + mx1) / 2, half = (mx1 - mx0) / 2 + 4, cy = my0 + (my1 - my0) * 0.55, sag = (my1 - my0) * 0.12, r = 7
  const stamp = (px, py) => {
    for (let y = Math.floor(py - r - 1); y <= py + r + 1; y++) for (let x = Math.floor(px - r - 1); x <= px + r + 1; x++) {
      const cover = Math.max(0, Math.min(1, r + 0.5 - Math.hypot(x - px, y - py)))
      if (!cover) continue
      const i = at(x, y)
      for (let c = 0; c < 3; c++) buf[i + c] = Math.round(buf[i + c] * (1 - cover) + ink[c] * cover)
    }
  }
  for (let t = -1; t <= 1; t += 0.01) stamp(cx + t * half, cy + sag * (1 - t * t))
  if (!lash) return
  const ox = cx + lash * half
  for (let t = 0; t <= 1; t += 0.02) stamp(ox + lash * t * 16, cy - t * 18)
}

// Onion-peel inpaint: each pass fills masked pixels touching known fur with their average.
function inpaint(buf, W, mask) {
  while (mask.size) {
    const filled = []
    for (const p of mask) {
      const x = p % W, y = (p / W) | 0, sum = [0, 0, 0]
      let n = 0
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const q = (y + dy) * W + x + dx
        if (mask.has(q)) continue
        const i = q * 4; sum[0] += buf[i]; sum[1] += buf[i + 1]; sum[2] += buf[i + 2]; n++
      }
      if (n) filled.push([p, sum.map((v) => v / n)])
    }
    if (!filled.length) break
    for (const [p, c] of filled) { const i = p * 4; buf[i] = c[0]; buf[i + 1] = c[1]; buf[i + 2] = c[2]; buf[i + 3] = 255; mask.delete(p) }
  }
}

// The mouth is the dark stroke just under the beak; paint it over with the surrounding feathers.
function eraseMouth(buf, W, f) {
  const at = (x, y) => (y * W + x) * 4
  let bx0 = 1e9, bx1 = -1, by1 = -1
  // The beak is the orange in the head; the orange strap starts lower, past 35% of the figure.
  for (let y = f.y0; y < f.y0 + (f.y1 - f.y0) * 0.35; y++) for (let x = f.x0; x <= f.x1; x++) {
    const i = at(x, y)
    if (buf[i + 3] > 200 && buf[i] > 200 && buf[i + 1] > 130 && buf[i + 1] < 200 && buf[i + 2] < 130) {
      bx0 = Math.min(bx0, x); bx1 = Math.max(bx1, x); by1 = Math.max(by1, y)
    }
  }
  if (by1 < 0) throw new Error(`no beak in frame at ${f.x0},${f.y0}`)
  const dark = (x, y) => { const i = at(x, y); return buf[i + 3] > 128 && buf[i] + buf[i + 1] + buf[i + 2] < 200 }
  const box = [bx0 - 10, by1 + 2, bx1 + 25, by1 + 100], mask = new Set()
  for (let y = box[1]; y <= box[3]; y++) for (let x = box[0]; x <= box[2]; x++) if (dark(x, y))
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) mask.add((y + dy) * W + x + dx)
  if (!mask.size) throw new Error(`no mouth under beak at ${bx0},${by1}`)
  inpaint(buf, W, mask)
}
