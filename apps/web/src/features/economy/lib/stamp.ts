// The museum's currency is stamps: a cream postage stamp with punched perforations, a rose
// panel and a heart, tilted as if just stuck down. One SVG serves the page and the price tags
// drawn into the scene, so they always match.

const W = 44
const H = 52
const HOLE = 2.3

/** One side of the stamp, from (x0, y0) to (x1, y1), with `holes` bites taken out of it. */
function perforated(x0: number, y0: number, x1: number, y1: number, holes: number): string {
  const dx = (x1 - x0) / holes
  const dy = (y1 - y0) / holes
  const length = Math.hypot(dx, dy)
  const ux = dx / length
  const uy = dy / length
  let d = ''
  for (let i = 0; i < holes; i++) {
    const cx = x0 + dx * (i + 0.5)
    const cy = y0 + dy * (i + 0.5)
    d += ` L ${(cx - ux * HOLE).toFixed(2)} ${(cy - uy * HOLE).toFixed(2)}`
    d += ` A ${HOLE} ${HOLE} 0 0 0 ${(cx + ux * HOLE).toFixed(2)} ${(cy + uy * HOLE).toFixed(2)}`
  }
  return `${d} L ${x1} ${y1}`
}

const EDGE =
  `M 0 0${perforated(0, 0, W, 0, 6)}${perforated(W, 0, W, H, 7)}${perforated(W, H, 0, H, 6)}${perforated(0, H, 0, 0, 7)} Z`

const HEART = 'M22 33.5 C 14.5 28.5 13 24.6 14.6 21.9 C 16.3 19 20 19.4 22 22.4 C 24 19.4 27.7 19 29.4 21.9 C 31 24.6 29.5 28.5 22 33.5 Z'

export const STAMP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 54 62">
<g transform="rotate(-6 22 26)">
<path d="${EDGE}" fill="#fff6e6" stroke="#7a4a33" stroke-width="1.8" stroke-linejoin="round"/>
<rect x="7" y="7" width="30" height="38" rx="2.5" fill="#f5a3bd" stroke="#7a4a33" stroke-width="1.4"/>
<rect x="9.6" y="9.6" width="24.8" height="32.8" rx="1.5" fill="none" stroke="#fff6e6" stroke-width="0.9" stroke-dasharray="1.6 1.4" opacity="0.8"/>
<path d="${HEART}" fill="#fff6e6"/>
</g>
</svg>`

/** The stamp's width over its height, as drawn. */
export const STAMP_ASPECT = 54 / 62

export const STAMP_URL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(STAMP_SVG)}`

export function stampLabel(amount: number): string {
  return `${amount} ${amount === 1 ? 'stamp' : 'stamps'}`
}
