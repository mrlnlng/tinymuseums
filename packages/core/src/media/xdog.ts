export interface XdogOptions {
  sigma: number
  k: number
  p: number
  epsilon: number
  phi: number
  maxCoverage: number
}

export const XDOG_DEFAULTS: XdogOptions = {
  sigma: 1.6,
  k: 1.6,
  p: 40,
  epsilon: -0.15,
  phi: 12,
  maxCoverage: 0.16,
}

function kernel(sigma: number): Float32Array {
  const radius = Math.max(1, Math.ceil(sigma * 3))
  const weights = new Float32Array(radius * 2 + 1)
  let sum = 0
  for (let i = -radius; i <= radius; i++) {
    const w = Math.exp(-(i * i) / (2 * sigma * sigma))
    weights[i + radius] = w
    sum += w
  }
  for (let i = 0; i < weights.length; i++) weights[i] /= sum
  return weights
}

function blur(src: Float32Array, width: number, height: number, sigma: number): Float32Array {
  const weights = kernel(sigma)
  const radius = (weights.length - 1) / 2
  const temp = new Float32Array(src.length)
  const out = new Float32Array(src.length)

  for (let y = 0; y < height; y++) {
    const row = y * width
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let i = -radius; i <= radius; i++) {
        const sx = Math.min(width - 1, Math.max(0, x + i))
        acc += src[row + sx] * weights[i + radius]
      }
      temp[row + x] = acc
    }
  }
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let acc = 0
      for (let i = -radius; i <= radius; i++) {
        const sy = Math.min(height - 1, Math.max(0, y + i))
        acc += temp[sy * width + x] * weights[i + radius]
      }
      out[y * width + x] = acc
    }
  }
  return out
}

export function toGray(rgba: Uint8ClampedArray | Uint8Array, width: number, height: number): Float32Array {
  const gray = new Float32Array(width * height)
  for (let i = 0; i < gray.length; i++) {
    const o = i * 4
    gray[i] = (0.299 * rgba[o] + 0.587 * rgba[o + 1] + 0.114 * rgba[o + 2]) / 255
  }
  return gray
}

// Winnemöller et al., "XDoG: An eXtended difference-of-Gaussians compendium" (2012), the p-form.
export function xdogInk(
  gray: Float32Array,
  width: number,
  height: number,
  options: XdogOptions = XDOG_DEFAULTS,
): Float32Array {
  const { sigma, k, p, phi, maxCoverage } = options
  const narrow = blur(gray, width, height, sigma)
  const wide = blur(gray, width, height, sigma * k)
  const response = new Float32Array(gray.length)
  for (let i = 0; i < response.length; i++) response[i] = (1 + p) * narrow[i] - p * wide[i]

  // Busy, textured paintings would otherwise ink most of the page; keeping only
  // the strongest edges holds every sketch to a similar density.
  const sorted = Float32Array.from(response).sort()
  const cap = sorted[Math.floor(maxCoverage * (sorted.length - 1))]
  const epsilon = Math.min(options.epsilon, cap)

  const ink = new Float32Array(gray.length)
  for (let i = 0; i < ink.length; i++) {
    const d = response[i]
    const tone = d >= epsilon ? 1 : 1 + Math.tanh(phi * (d - epsilon))
    ink[i] = Math.min(1, Math.max(0, 1 - tone))
  }
  return ink
}
