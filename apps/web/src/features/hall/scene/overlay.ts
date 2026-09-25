import * as THREE from 'three'
import { CONFIG } from './config'
import type { CafeMarks } from './cafe'
import type { Mark } from './board'
import type { GiftShopMarks } from './giftshop'
import type { LobbyMarks } from './lobby'
import type { MountedDisplay } from './scene'

export interface Viewport {
  width: number
  height: number
  left: number
  top: number
}

const projected = new THREE.Vector3()

type StyledProperty = 'width' | 'fontSize' | 'transform' | 'opacity'

const written = new WeakMap<HTMLElement, Partial<Record<StyledProperty, string>>>()

function writeStyle(node: HTMLElement, property: StyledProperty, value: string): void {
  let last = written.get(node)
  if (!last) {
    last = {}
    written.set(node, last)
  }
  if (last[property] === value) return
  last[property] = value
  node.style[property] = value
}

function toScreen(
  x: number,
  y: number,
  camera: THREE.OrthographicCamera,
  viewport: Viewport,
): { x: number; y: number } | null {
  projected.set(x, y, 0.03)
  projected.project(camera)
  if (projected.x < -1.7 || projected.x > 1.7) return null

  return {
    x: viewport.left + (projected.x * 0.5 + 0.5) * viewport.width,
    y: viewport.top + (-projected.y * 0.5 + 0.5) * viewport.height,
  }
}

export class Placards {
  private nodes = new Map<number, HTMLElement>()
  private titles = new Map<number, HTMLElement>()
  private seen = new Set<number>()
  private heights = new WeakMap<HTMLElement, number>()

  private sizes = new ResizeObserver((entries) => {
    for (const entry of entries) {
      this.heights.set(entry.target as HTMLElement, entry.contentRect.height)
    }
  })

  constructor(private container: HTMLElement) {}

  sync(
    mounted: readonly MountedDisplay[],
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
  ): void {
    const seen = this.seen
    seen.clear()
    const viewWidth = camera.right - camera.left
    const plaquePx = (CONFIG.plaque.width / viewWidth) * viewport.width
    const titlePx = (CONFIG.plaque.titleWidth / viewWidth) * viewport.width

    for (const m of mounted) {
      const key = m.index
      seen.add(key)
      let node = this.nodes.get(key)

      if (!node) {
        node = document.createElement('div')
        node.className = 'placard'
        node.innerHTML = '<span class="placard-name"></span>'
        node.querySelector('.placard-name')!.textContent = m.display.description
        node.dataset.slug = m.display.slug
        this.container.appendChild(node)
        this.nodes.set(key, node)
      }

      let title = this.titles.get(key)
      if (!title) {
        title = document.createElement('div')
        title.className = 'placard-title script'
        this.sizes.observe(title)
        title.textContent = m.display.title
        this.container.appendChild(title)
        this.titles.set(key, title)
      }

      this.place(node, m.centerX, m.plaqueY, camera, viewport, plaquePx * 0.78, Math.max(7, plaquePx * 0.058), 'center')

      this.place(title, m.centerX, m.titleY, camera, viewport, titlePx, Math.max(12, titlePx * 0.069), 'bottom')
    }

    for (const map of [this.nodes, this.titles]) {
      for (const [key, el] of map) {
        if (seen.has(key)) continue
        this.sizes.unobserve(el)
        el.remove()
        map.delete(key)
      }
    }
  }

  private place(
    node: HTMLElement,
    x: number,
    y: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    widthPx: number,
    fontSize: number,
    anchor: 'center' | 'bottom',
  ): void {
    const at = toScreen(x, y, camera, viewport)
    if (!at) {
      writeStyle(node, 'opacity', '0')
      return
    }

    writeStyle(node, 'width', `${widthPx}px`)
    writeStyle(node, 'fontSize', `${fontSize}px`)

    let screenY = at.y
    if (anchor === 'bottom') {
      const height = this.heights.get(node) ?? node.offsetHeight
      screenY = Math.max(screenY, viewport.top + height + 4)
    }

    writeStyle(
      node,
      'transform',
      `translate3d(${at.x.toFixed(1)}px, ${screenY.toFixed(1)}px, 0) translate(-50%, ${anchor === 'bottom' ? '-100%' : '-50%'})`,
    )
    writeStyle(node, 'opacity', '1')
  }

  clear(): void {
    this.sizes.disconnect()
    for (const node of this.nodes.values()) node.remove()
    for (const node of this.titles.values()) node.remove()
    this.nodes.clear()
    this.titles.clear()
  }
}

export class LobbySigns {
  private sign = document.createElement('div')
  private direction = document.createElement('div')

  constructor(
    container: HTMLElement,
    private marks: LobbyMarks,
  ) {
    this.sign.className = 'lobby-sign'
    this.sign.textContent = 'Visitor Center'

    this.direction.className = 'lobby-direction'
    this.direction.innerHTML = '<span>To Exhibition</span><span aria-hidden="true">\u2192</span>'

    for (const node of [this.sign, this.direction]) container.appendChild(node)
  }

  sync(camera: THREE.OrthographicCamera, viewport: Viewport): void {
    const viewWidth = camera.right - camera.left
    const perUnit = viewport.width / viewWidth

    this.place(this.sign, this.marks.sign, perUnit, camera, viewport, 0.12)
    this.place(this.direction, this.marks.direction, perUnit, camera, viewport, 0.136)
  }

  private place(
    node: HTMLElement,
    mark: { x: number; y: number; width: number },
    perUnit: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    fontRatio: number,
  ): boolean {
    const at = toScreen(mark.x, mark.y, camera, viewport)
    if (!at) {
      writeStyle(node, 'opacity', '0')
      return false
    }

    const widthPx = mark.width * perUnit
    writeStyle(node, 'width', `${widthPx.toFixed(1)}px`)
    writeStyle(node, 'fontSize', `${Math.max(8, widthPx * fontRatio).toFixed(1)}px`)
    writeStyle(
      node,
      'transform',
      `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0) translate(-50%, -50%)`,
    )
    writeStyle(node, 'opacity', '1')
    return true
  }

  clear(): void {
    for (const node of [this.sign, this.direction]) node.remove()
  }
}

export class GiftShopSigns {
  private note = document.createElement('p')
  private sign = document.createElement('div')
  private link = document.createElement('a')
  private isLinkOnScreen: boolean | null = null
  private linkHeight = ''

  constructor(
    container: HTMLElement,
    private marks: GiftShopMarks,
    href: string,
  ) {
    this.note.className = 'gift-shop-note'
    this.note.textContent =
      'You have reached the end of the exhibit! Exit through the gift shop to grab a print of your favorite piece. Thank you for coming, see you next time!'

    this.sign.className = 'gift-shop-sign'
    this.sign.textContent = 'Gift shop'

    this.link.className = 'gift-shop-button'
    this.link.href = href
    this.link.target = '_blank'
    this.link.rel = 'noreferrer noopener'
    this.link.innerHTML =
      '<img class="gift-shop-basket" src="/assets/icon-basket.svg" alt="" aria-hidden="true">' +
      '<span>View gift shop</span>'

    for (const node of [this.note, this.sign, this.link]) container.appendChild(node)
  }

  sync(camera: THREE.OrthographicCamera, viewport: Viewport): void {
    const viewWidth = camera.right - camera.left
    const perUnit = viewport.width / viewWidth

    this.place(this.note, this.marks.note, perUnit, camera, viewport, 0.065)
    this.place(this.sign, this.marks.sign, perUnit, camera, viewport, 0.134)

    const onScreen = this.place(this.link, this.marks.button, perUnit, camera, viewport, 0.09)
    if (onScreen !== this.isLinkOnScreen) {
      this.isLinkOnScreen = onScreen
      this.link.style.pointerEvents = onScreen ? 'auto' : 'none'
    }

    const height = `${(this.marks.button.height * perUnit).toFixed(1)}px`
    if (height !== this.linkHeight) {
      this.linkHeight = height
      this.link.style.height = height
    }
  }

  private place(
    node: HTMLElement,
    mark: { x: number; y: number; width: number },
    perUnit: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
    fontRatio: number,
  ): boolean {
    const at = toScreen(mark.x, mark.y, camera, viewport)
    if (!at) {
      writeStyle(node, 'opacity', '0')
      return false
    }

    const widthPx = mark.width * perUnit
    writeStyle(node, 'width', `${widthPx.toFixed(1)}px`)
    writeStyle(node, 'fontSize', `${Math.max(8, widthPx * fontRatio).toFixed(1)}px`)
    writeStyle(
      node,
      'transform',
      `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0) translate(-50%, -50%)`,
    )
    writeStyle(node, 'opacity', '1')
    return true
  }

  clear(): void {
    for (const node of [this.note, this.sign, this.link]) node.remove()
  }
}

export class CafeLink {
  private poster = document.createElement('a')
  private isOnScreen: boolean | null = null
  private posterHeight = ''

  constructor(container: HTMLElement, private marks: CafeMarks, href: string) {
    this.poster.className = 'cafe-poster-link'
    this.poster.href = href
    this.poster.target = '_blank'
    this.poster.rel = 'noreferrer noopener'
    this.poster.setAttribute(
      'aria-label',
      'Buy us a coffee — opens Buy Me a Coffee in a new tab',
    )
    container.appendChild(this.poster)
  }

  sync(camera: THREE.OrthographicCamera, viewport: Viewport): void {
    const viewWidth = camera.right - camera.left
    const perUnit = viewport.width / viewWidth

    const at = toScreen(this.marks.poster.x, this.marks.poster.y, camera, viewport)
    if (!at) {
      writeStyle(this.poster, 'opacity', '0')
      if (this.isOnScreen !== false) {
        this.isOnScreen = false
        this.poster.style.pointerEvents = 'none'
      }
      return
    }

    const widthPx = this.marks.poster.width * perUnit
    writeStyle(this.poster, 'width', `${widthPx.toFixed(1)}px`)
    writeStyle(
      this.poster,
      'transform',
      `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0) translate(-50%, -50%)`,
    )
    writeStyle(this.poster, 'opacity', '1')

    if (this.isOnScreen !== true) {
      this.isOnScreen = true
      this.poster.style.pointerEvents = 'auto'
    }

    const height = `${(this.marks.poster.height * perUnit).toFixed(1)}px`
    if (height !== this.posterHeight) {
      this.posterHeight = height
      this.poster.style.height = height
    }
  }

  clear(): void {
    this.poster.remove()
  }
}

export class GuestBoardNotes {
  constructor(
    private layer: HTMLElement,
    private mark: Mark,
  ) {}

  sync(camera: THREE.OrthographicCamera, viewport: Viewport): void {
    const at = toScreen(this.mark.x, this.mark.y, camera, viewport)
    if (!at) {
      writeStyle(this.layer, 'opacity', '0')
      return
    }

    const perUnit = viewport.width / (camera.right - camera.left)
    writeStyle(this.layer, 'width', `${(this.mark.width * perUnit).toFixed(1)}px`)
    writeStyle(
      this.layer,
      'transform',
      `translate3d(${at.x.toFixed(1)}px, ${at.y.toFixed(1)}px, 0) translate(-50%, -50%)`,
    )
    writeStyle(this.layer, 'opacity', '1')
  }

  clear(): void {
    writeStyle(this.layer, 'opacity', '0')
  }
}
