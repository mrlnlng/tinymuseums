import { CONFIG } from './config'

export interface HallForeground {
  update(now: number, cameraX: number, viewWidth: number): void
  dispose(): void
}

const TAU = Math.PI * 2

function mulberry(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Out-of-focus fairy lights in front of the characters, so the hall gains a little depth of field. */
export function createHallForeground(host: HTMLElement, still: boolean): HallForeground {
  const settings = CONFIG.ambience.foreground
  const random = mulberry(20261111)
  const root = document.createElement('div')
  root.style.position = 'absolute'
  root.style.inset = '0'
  root.style.overflow = 'hidden'
  root.style.pointerEvents = 'none'
  root.style.zIndex = String(settings.zIndex)

  const orbs = Array.from({ length: settings.count }, (_, index) => {
    const size = settings.minSize + random() * (settings.maxSize - settings.minSize)
    const orb = document.createElement('div')
    orb.style.position = 'absolute'
    orb.style.left = '0'
    orb.style.top = '0'
    orb.style.width = `${size}px`
    orb.style.height = `${size}px`
    orb.style.borderRadius = '50%'
    orb.style.background = 'radial-gradient(circle, rgba(255, 220, 160, 0.55) 0%, rgba(255, 196, 128, 0.2) 45%, rgba(255, 196, 128, 0) 70%)'
    orb.style.mixBlendMode = 'screen'
    orb.style.willChange = 'transform'
    orb.style.pointerEvents = 'none'
    root.appendChild(orb)
    return {
      el: orb,
      size,
      anchor: ((index + random()) / settings.count - 0.5) * settings.anchorSpan,
      top: random(),
      phase: random() * TAU,
      speed: 0.3 + random() * 0.4,
    }
  })
  host.appendChild(root)

  let width = Math.max(1, host.clientWidth)
  let height = Math.max(1, host.clientHeight)
  const observer = typeof ResizeObserver === 'undefined'
    ? null
    : new ResizeObserver(() => {
      width = Math.max(1, host.clientWidth)
      height = Math.max(1, host.clientHeight)
    })
  observer?.observe(host)

  return {
    update(now, cameraX, viewWidth) {
      const pixelsPerUnit = width / Math.max(1, viewWidth)
      const band = height * settings.topShare
      const t = now / 1000
      for (const orb of orbs) {
        const wrap = width + orb.size
        const raw = (orb.anchor - cameraX) * pixelsPerUnit * settings.parallax
        const x = ((raw % wrap) + wrap) % wrap
        const y = orb.top * Math.max(0, band - orb.size)
        const opacity = still
          ? settings.stillOpacity
          : settings.minOpacity
            + (settings.maxOpacity - settings.minOpacity) * (0.5 + 0.5 * Math.sin(t * orb.speed + orb.phase))
        orb.el.style.transform = `translate3d(${(x - orb.size / 2).toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        orb.el.style.opacity = opacity.toFixed(3)
      }
    },
    dispose() {
      observer?.disconnect()
      root.remove()
    },
  }
}
