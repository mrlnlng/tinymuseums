export interface OccluderRect {
  x: number
  y: number
  width: number
  height: number
  src: string
  rotation?: number
  flip?: number
  flight?: boolean
}

export interface Occlusion {
  update(occluders: readonly OccluderRect[]): void
  clear(): void
}

interface MaskLayer {
  image: string
  width: number
  height: number
  x: number
  y: number
}

// The bunny and carried items are drawn in the canvas, under the DOM overlays; this
// cuts their silhouettes out of each overlay layer so text sitting behind them stays
// hidden, as it was when they were DOM images stacked above them. The full-size layer
// comes first and subtracts the union of the rest. Only the unprefixed properties are
// set: -webkit-mask-composite aliases the same property with different keywords and
// would overwrite it. CSS cannot rotate a mask, so a rotated item is masked by its
// axis-aligned bounding rect while held and skipped while in flight.
export function createOcclusion(layers: () => (HTMLElement | null)[]): Occlusion {
  const written = new WeakMap<HTMLElement, string>()

  function reset(layer: HTMLElement): void {
    if (written.get(layer) === '') return
    written.set(layer, '')
    const style = layer.style
    style.maskImage = ''
    style.maskSize = ''
    style.maskPosition = ''
    style.maskRepeat = ''
    style.maskComposite = ''
  }

  function apply(layer: HTMLElement, occluders: readonly OccluderRect[]): void {
    const bounds = layer.getBoundingClientRect()
    const scale = bounds.width > 0 ? layer.offsetWidth / bounds.width : 1
    const host = layer.offsetParent?.getBoundingClientRect()
    const originX = (host?.left ?? 0) - bounds.left
    const originY = (host?.top ?? 0) - bounds.top

    const used: MaskLayer[] = []
    for (const occ of occluders) {
      const rotation = occ.rotation ?? 0
      const flip = occ.flip ?? 1
      if (rotation !== 0 && occ.flight) continue
      used.push({
        image: rotation === 0 && flip >= 0 ? `url("${occ.src}")` : 'linear-gradient(#000, #000)',
        width: occ.width * scale,
        height: occ.height * scale,
        x: (occ.x + originX) * scale,
        y: (occ.y + originY) * scale,
      })
    }
    if (used.length === 0) {
      reset(layer)
      return
    }

    const images = ['linear-gradient(#000, #000)', ...used.map((u) => u.image)]
    const sizes = ['100% 100%', ...used.map((u) => `${u.width.toFixed(1)}px ${u.height.toFixed(1)}px`)]
    const positions = ['0 0', ...used.map((u) => `${u.x.toFixed(1)}px ${u.y.toFixed(1)}px`)]
    const composite = ['subtract', ...used.map(() => 'add')]

    const image = images.join(', ')
    const size = sizes.join(', ')
    const position = positions.join(', ')
    const key = `${image}|${size}|${position}`
    if (written.get(layer) === key) return
    written.set(layer, key)

    const style = layer.style
    style.maskImage = image
    style.maskSize = size
    style.maskPosition = position
    style.maskRepeat = 'no-repeat'
    style.maskComposite = composite.join(', ')
  }

  return {
    update(occluders) {
      for (const layer of layers()) {
        if (!layer) continue
        if (occluders.length === 0) reset(layer)
        else apply(layer, occluders)
      }
    },

    clear() {
      for (const layer of layers()) if (layer) reset(layer)
    },
  }
}
