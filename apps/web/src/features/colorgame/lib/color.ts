export interface Oklab {
  L: number
  a: number
  b: number
}

export interface Oklch {
  L: number
  C: number
  h: number
}

export interface Rgb {
  r: number
  g: number
  b: number
}

export const GAMUT_EPSILON = 1e-4

export function srgbToLinear(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
}

export function linearToSrgb(channel: number): number {
  return channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055
}

/** Björn Ottosson's published linear-sRGB to OKLab transform. */
export function linearRgbToOklab(r: number, g: number, b: number): Oklab {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const lRoot = Math.cbrt(l)
  const mRoot = Math.cbrt(m)
  const sRoot = Math.cbrt(s)

  return {
    L: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  }
}

export function oklabToLinearRgb(lab: Oklab): Rgb {
  const lRoot = lab.L + 0.3963377774 * lab.a + 0.2158037573 * lab.b
  const mRoot = lab.L - 0.1055613458 * lab.a - 0.0638541728 * lab.b
  const sRoot = lab.L - 0.0894841775 * lab.a - 1.291485548 * lab.b

  const l = lRoot ** 3
  const m = mRoot ** 3
  const s = sRoot ** 3

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

export function srgbToOklab(rgb: Rgb): Oklab {
  return linearRgbToOklab(
    srgbToLinear(rgb.r),
    srgbToLinear(rgb.g),
    srgbToLinear(rgb.b),
  )
}

export function oklabToSrgb(lab: Oklab): Rgb {
  const linear = oklabToLinearRgb(lab)
  return {
    r: linearToSrgb(linear.r),
    g: linearToSrgb(linear.g),
    b: linearToSrgb(linear.b),
  }
}

export function oklchToOklab(color: Oklch): Oklab {
  const radians = (color.h * Math.PI) / 180
  return {
    L: color.L,
    a: color.C * Math.cos(radians),
    b: color.C * Math.sin(radians),
  }
}

export function oklabToOklch(lab: Oklab): Oklch {
  const C = Math.hypot(lab.a, lab.b)
  const h = ((Math.atan2(lab.b, lab.a) * 180) / Math.PI + 360) % 360
  return { L: lab.L, C, h }
}

/** True when the color's linear-sRGB channels all fit inside the display gamut. */
export function inGamut(lab: Oklab, epsilon = GAMUT_EPSILON): boolean {
  const { r, g, b } = oklabToLinearRgb(lab)
  return [r, g, b].every(
    (channel) => channel >= -epsilon && channel <= 1 + epsilon,
  )
}

export function toHex(lab: Oklab): string {
  const { r, g, b } = oklabToSrgb(lab)
  const byte = (channel: number) =>
    Math.round(Math.min(1, Math.max(0, channel)) * 255)
      .toString(16)
      .padStart(2, '0')
  return `#${byte(r)}${byte(g)}${byte(b)}`
}

export function hexToOklab(hex: string): Oklab {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((part) => part + part)
          .join('')
      : value
  return srgbToOklab({
    r: parseInt(full.slice(0, 2), 16) / 255,
    g: parseInt(full.slice(2, 4), 16) / 255,
    b: parseInt(full.slice(4, 6), 16) / 255,
  })
}

export function deltaE(a: Oklab, b: Oklab): number {
  return Math.hypot(a.L - b.L, a.a - b.a, a.b - b.b)
}
