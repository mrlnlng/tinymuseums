// Renders the doorway drawn by draw.py (SVG on stdin) to the atelier's transparent door sprite.
// Pass a path to also save a preview of it against the room's wall colour.
import { text } from 'node:stream/consumers'
import { chromium } from 'playwright'

const svg = await text(process.stdin)
const [, width, height] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number)
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width, height } })
await page.setContent(`<body style="margin:0;background:transparent">${svg}</body>`)
await page.screenshot({ path: new URL('../../public/assets/atelier/door.png', import.meta.url).pathname, omitBackground: true })
if (process.argv[2]) {
  await page.evaluate(() => { document.body.style.background = '#3d0808' })
  await page.screenshot({ path: process.argv[2] })
}
await browser.close()
