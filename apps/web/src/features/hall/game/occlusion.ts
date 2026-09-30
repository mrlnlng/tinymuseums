export interface OccluderRect {
  x: number
  y: number
  width: number
  height: number
  src: string
}

export interface Occlusion {
  update(bunny: OccluderRect | null): void
  clear(): void
}

// The bunny is drawn in the canvas, under the DOM overlays; this cuts its silhouette
// out of each overlay layer so text sitting behind it stays hidden, as it was when the
// bunny was a DOM image stacked above them.
export function createOcclusion(layers: () => (HTMLElement | null)[]): Occlusion {
  const written = new WeakMap<HTMLElement, string>()

  function apply(layer: HTMLElement, bunny: OccluderRect | null): void {
    let key = ''
    let image = ''
    let size = ''
    let position = ''
    if (bunny) {
      const bounds = layer.getBoundingClientRect()
      const scale = bounds.width > 0 ? layer.offsetWidth / bounds.width : 1
      const host = layer.offsetParent?.getBoundingClientRect()
      const originX = (host?.left ?? 0) - bounds.left
      const originY = (host?.top ?? 0) - bounds.top
      const x = (bunny.x + originX) * scale
      const y = (bunny.y + originY) * scale
      image = `url("${bunny.src}"), linear-gradient(#000, #000)`
      size = `${(bunny.width * scale).toFixed(1)}px ${(bunny.height * scale).toFixed(1)}px, 100% 100%`
      position = `${x.toFixed(1)}px ${y.toFixed(1)}px, 0 0`
      key = `${image}|${size}|${position}`
    }
    if (written.get(layer) === key) return
    written.set(layer, key)

    const style = layer.style
    style.maskImage = image
    style.maskSize = size
    style.maskPosition = position
    style.maskRepeat = bunny ? 'no-repeat' : ''
    style.maskComposite = bunny ? 'exclude' : ''
    style.setProperty('-webkit-mask-image', image)
    style.setProperty('-webkit-mask-size', size)
    style.setProperty('-webkit-mask-position', position)
    style.setProperty('-webkit-mask-repeat', bunny ? 'no-repeat' : '')
    style.setProperty('-webkit-mask-composite', bunny ? 'xor' : '')
  }

  return {
    update(bunny) {
      for (const layer of layers()) if (layer) apply(layer, bunny)
    },

    clear() {
      for (const layer of layers()) if (layer) apply(layer, null)
    },
  }
}
