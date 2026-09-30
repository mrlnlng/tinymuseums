import type Phaser from 'phaser'
import type { HallPieceDto, HallSliceDto } from '@tiny/core'
import { FIRST_PAINTING_MARK } from '../../../shared/lib/vitals-marks.ts'
import { supportsAvif } from '../../../shared/lib/avif.ts'
import { sameOriginUrl } from '../lib/media.ts'
import { CONFIG } from '../scene/config.ts'
import { computeLayout, type HallLayout } from '../scene/layout.ts'
import {
  needsMore,
  planStreaming,
  type MountSnapshot,
  type SlotRuntime,
  type SlotSnapshot,
} from '../scene/streaming.ts'
import { addPlane, planeMask, ropeSlices, type Plane, type PlaneRef } from './board.ts'
import { hitsAt, pickAt, type WorldPoint } from './hit.ts'
import { placeholderTexture } from './placeholder.ts'
import { createPedestal, type Pedestal, type PedestalVoice } from './pedestal.ts'
import { createHiddenCoin, type CoinWall, type HiddenCoin } from './coin.ts'
import { PPU } from './view.ts'
import type { GameAssets } from './assets.ts'

const MAX_TEXTURE_ATTEMPTS = 4
const CROSSFADE_MS = 300
const MAX_CONCURRENT_LOADS = 2

const PLAQUE_FILE = 'plaque.png'
const ROPE_FILE = 'rope.png'

const ROPE_CUTS = [0, 0.24, 0.78, 1] as const

function retryDelayMs(attempts: number): number {
  return Math.min(8000, 500 * 2 ** attempts)
}

function markFirstPainting(): void {
  if (performance.getEntriesByName(FIRST_PAINTING_MARK).length === 0) {
    performance.mark(FIRST_PAINTING_MARK)
  }
}

export interface PlaneRect {
  x: number
  y: number
  width: number
  height: number
  z: number
}

export interface DisplayGeometry {
  index: number
  width: number
  height: number
  plaqueHeight: number
  plaqueY: number
  titleY: number
  painting: PlaneRect
  plaque: PlaneRect
  rope: PlaneRect[]
}

export function pieceSize(canvas: { w: number; h: number }): { width: number; height: number } {
  const scale = CONFIG.piece.scale
  return { width: canvas.w * scale, height: canvas.h * scale }
}

export function ropeRects(aspect: number, span: number, x: number): PlaneRect[] {
  const { height, centerY, z } = CONFIG.rope
  const naturalWidth = height * aspect
  const ends = [
    (ROPE_CUTS[1] - ROPE_CUTS[0]) * naturalWidth,
    (ROPE_CUTS[3] - ROPE_CUTS[2]) * naturalWidth,
  ]
  const middle = Math.max((ROPE_CUTS[2] - ROPE_CUTS[1]) * naturalWidth, span - ends[0] - ends[1])
  const widths = [ends[0], middle, ends[1]]
  const total = widths[0] + widths[1] + widths[2]

  const rects: PlaneRect[] = []
  let cursor = x - total / 2
  for (let i = 0; i < 3; i++) {
    rects.push({ x: cursor + widths[i] / 2, y: centerY, width: widths[i], height, z })
    cursor += widths[i]
  }
  return rects
}

export function displayGeometry(
  index: number,
  canvas: { w: number; h: number },
  centerX: number,
  plaqueAspect: number,
  ropeAspect: number,
): DisplayGeometry {
  const bottom = CONFIG.displayBottomY
  const { width, height } = pieceSize(canvas)
  const plaqueHeight = CONFIG.plaque.width / plaqueAspect
  const plaqueY = bottom - CONFIG.plaque.gap - plaqueHeight / 2

  return {
    index,
    width,
    height,
    plaqueHeight,
    plaqueY,
    titleY: bottom + height + CONFIG.displayTitleGap,
    painting: { x: centerX, y: bottom + height / 2, width, height, z: 0 },
    plaque: {
      x: centerX,
      y: plaqueY,
      width: CONFIG.plaque.width,
      height: plaqueHeight,
      z: CONFIG.plaque.z,
    },
    rope: ropeRects(ropeAspect, width, centerX),
  }
}

export interface DisplayTexture {
  key: string
  texture: Phaser.Textures.Texture
  bitmap: ImageBitmap | null
}

export interface MountedDisplay {
  index: number
  display: HallPieceDto
  centerX: number
  width: number
  height: number
  plaqueY: number
  titleY: number
  showsPlaceholder: boolean
  painting: Plane
  plaque: Plane
  ropes: Plane[]
  placeholderKey: string | null
  fade?: { image: Phaser.GameObjects.Image; key: string; startedAt: number }
}

export interface PieceHit {
  mounted: MountedDisplay
  pieceId: string
}

export interface WorldPoint3 {
  x: number
  y: number
  z: number
}

let textureSeq = 0

function nextKey(prefix: string): string {
  textureSeq += 1
  return `${prefix}-${textureSeq}`
}

async function bitmapTexture(
  scene: Phaser.Scene,
  url: string,
  key: string,
): Promise<DisplayTexture> {
  const response = await fetch(url, { mode: 'cors', credentials: 'omit' })
  if (!response.ok) throw new Error(`Could not load display image ${url}`)

  const bitmap = await createImageBitmap(await response.blob(), { premultiplyAlpha: 'none' })
  const texture = scene.textures.addImage(key, bitmap as unknown as HTMLImageElement)
  if (!texture) throw new Error(`Could not add display image ${url}`)
  return { key, texture, bitmap }
}

function elementTexture(
  scene: Phaser.Scene,
  url: string,
  key: string,
): Promise<DisplayTexture> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const texture = scene.textures.addImage(key, image)
      if (texture) resolve({ key, texture, bitmap: null })
      else reject(new Error(`Could not add display image ${url}`))
    }
    image.onerror = () => reject(new Error(`Could not load display image ${url}`))
    image.src = url
  })
}

async function fetchDisplayTexture(
  scene: Phaser.Scene,
  url: string,
  key: string,
): Promise<DisplayTexture> {
  if (typeof createImageBitmap === 'function') {
    try {
      return await bitmapTexture(scene, url, key)
    } catch {}
  }
  return elementTexture(scene, url, key)
}

async function loadDisplayTexture(
  scene: Phaser.Scene,
  url: string,
  key: string,
): Promise<DisplayTexture> {
  try {
    return await fetchDisplayTexture(scene, url, key)
  } catch (error) {
    const ownOrigin = sameOriginUrl(url)
    if (ownOrigin === null) throw error
    return fetchDisplayTexture(scene, ownOrigin, key)
  }
}

function disposeDisplayTexture(scene: Phaser.Scene, texture: DisplayTexture): void {
  scene.textures.remove(texture.key)
  texture.bitmap?.close()
}

export class HallWorld {
  layout: HallLayout = computeLayout([])
  epochId = 0
  nextIndex: number | null = 0
  totalSlots = 0
  onTextureReady: ((texture: Phaser.Textures.Texture) => void) | null = null

  private slots = new Map<number, SlotRuntime<DisplayTexture>>()
  private mounted = new Map<number, MountedDisplay>()
  private inFlight = 0
  private pedestals = new Map<number, Pedestal>()
  private mountedList: MountedDisplay[] = []
  private bareHelmStand: number | null = null
  private coin: HiddenCoin
  private useAvif = false
  private scene: Phaser.Scene
  private assets: GameAssets

  constructor(scene: Phaser.Scene, assets: GameAssets) {
    this.scene = scene
    this.assets = assets
    this.coin = createHiddenCoin(scene, assets)
    void supportsAvif().then((value) => {
      this.useAvif = value
    })
  }

  ingestSlice(slice: HallSliceDto): void {
    this.epochId = slice.epochId
    this.nextIndex = slice.nextIndex
    this.totalSlots = slice.totalSlots
    this.coin.choose(slice.totalSlots)

    for (const slot of slice.slots) {
      if (this.slots.has(slot.index)) continue
      this.slots.set(slot.index, { index: slot.index, piece: slot.display, status: 'idle' })
    }

    this.rebuildLayout()
  }

  private rebuildLayout(): void {
    const widths: number[] = []
    for (let i = 0; this.slots.has(i); i++) {
      widths.push(pieceSize(this.slots.get(i)!.piece.canvas).width)
    }
    const isComplete = this.nextIndex === null && widths.length === this.totalSlots
    this.layout = computeLayout(widths, isComplete)

    for (const mount of this.mounted.values()) {
      const x = this.layout.centerX[mount.index]
      if (x === undefined) continue
      const dx = x - mount.painting.x
      if (dx === 0) continue
      for (const plane of [mount.painting, mount.plaque, ...mount.ropes]) {
        plane.x += dx
        plane.image.setX(plane.image.x + dx * PPU)
      }
      if (mount.fade) mount.fade.image.setX(mount.fade.image.x + dx * PPU)
      if (this.coin.index === mount.index) this.coin.move(dx)
    }

    for (const [i, pedestal] of this.pedestals) {
      const x = this.layout.pedestalX[i]
      if (x !== undefined) pedestal.move(x - pedestal.x)
    }
  }

  needsMore(visitorX: number): boolean {
    return needsMore({
      nextIndex: this.nextIndex,
      known: this.layout.known,
      centerX: this.layout.centerX,
      visitorX,
      prefetchAheadUnits: CONFIG.loading.prefetchAheadUnits,
    })
  }

  update(now: number, dt: number, cameraX: number): void {
    const { mountRadiusUnits, loadRadiusUnits } = CONFIG.virtualization

    const slots: SlotSnapshot[] = []
    for (const slot of this.slots.values()) {
      slots.push({
        index: slot.index,
        status: slot.status,
        hasThumbhash: Boolean(slot.piece.image.thumbhash),
        hasTexture: Boolean(slot.texture),
        attempts: slot.attempts ?? 0,
        retryAt: slot.retryAt ?? 0,
        readyAt: slot.readyAt,
        inRangeAt: slot.inRangeAt,
        centerX: this.layout.centerX[slot.index],
      })
    }

    const mounts: MountSnapshot[] = []
    for (const mount of this.mounted.values()) {
      mounts.push({
        index: mount.index,
        showsPlaceholder: mount.showsPlaceholder,
        fading: Boolean(mount.fade),
      })
    }

    const actions = planStreaming({
      slots,
      mounts,
      cameraX,
      now,
      inFlight: this.inFlight,
      mountRadiusUnits,
      loadRadiusUnits,
      minDwellMs: CONFIG.statue.minDwellMs,
      maxConcurrentLoads: MAX_CONCURRENT_LOADS,
      maxTextureAttempts: MAX_TEXTURE_ATTEMPTS,
    })

    for (const action of actions) {
      switch (action.kind) {
        case 'unmount':
          this.unmount(action.index)
          break
        case 'mount': {
          const slot = this.slots.get(action.index)
          if (slot) this.mount(slot)
          break
        }
        case 'fade': {
          const mount = this.mounted.get(action.index)
          const slot = this.slots.get(action.index)
          if (mount && slot?.texture) this.beginFade(mount, slot.texture, now)
          break
        }
        case 'unmountMesh':
          this.unmountMesh(action.index)
          break
        case 'enterRange': {
          const slot = this.slots.get(action.index)
          if (slot) slot.inRangeAt = now
          break
        }
        case 'load': {
          const slot = this.slots.get(action.index)
          if (slot) this.beginLoad(slot, now)
          break
        }
      }
    }

    this.updateFades(now)
    this.updatePedestals(dt, cameraX)
    this.coin.update(dt)
  }

  private beginFade(mount: MountedDisplay, texture: DisplayTexture, now: number): void {
    const fade = addPlane(
      this.scene,
      { key: texture.key },
      mount.width,
      mount.height,
      mount.painting.x,
      mount.painting.y,
      mount.painting.z + 0.001,
    )
    fade.image.setAlpha(0)
    mount.fade = { image: fade.image, key: texture.key, startedAt: now }
  }

  private updateFades(now: number): void {
    for (const mount of this.mountedList) {
      if (!mount.fade) continue
      const t = Math.min(1, (now - mount.fade.startedAt) / CROSSFADE_MS)
      mount.fade.image.setAlpha(1 - (1 - t) ** 2)
      if (t < 1) continue

      mount.painting.image.setTexture(mount.fade.key)
      mount.painting.image.setDisplaySize(mount.width * PPU, mount.height * PPU)
      mount.painting.mask = planeMask(this.scene, { key: mount.fade.key })
      mount.fade.image.destroy()
      if (mount.placeholderKey) {
        this.scene.textures.remove(mount.placeholderKey)
        mount.placeholderKey = null
      }
      mount.fade = undefined
      mount.showsPlaceholder = false
      markFirstPainting()
    }
  }

  private beginLoad(slot: SlotRuntime<DisplayTexture>, now: number): void {
    slot.status = 'loading'
    slot.startedAt = now
    this.inFlight += 1

    const { url, avifUrl } = slot.piece.image
    const key = nextKey('hall-display')

    loadDisplayTexture(this.scene, this.useAvif && avifUrl ? avifUrl : url, key)
      .finally(() => {
        this.inFlight -= 1
      })
      .then((texture) => {
        this.onTextureReady?.(texture.texture)
        slot.texture = texture
        slot.status = 'ready'
        slot.readyAt = performance.now()
        slot.attempts = 0
      })
      .catch(() => {
        if (this.scene.textures.exists(key)) this.scene.textures.remove(key)
        const attempts = (slot.attempts ?? 0) + 1
        slot.status = 'error'
        slot.attempts = attempts
        slot.retryAt = performance.now() + retryDelayMs(attempts)
      })
  }

  private mount(slot: SlotRuntime<DisplayTexture>): void {
    const centerX = this.layout.centerX[slot.index]
    if (centerX === undefined) return

    const texture = slot.texture
    let placeholderKey: string | null = null
    if (!texture) {
      const hash = slot.piece.image.thumbhash
      if (!hash) return
      const key = nextKey('hall-placeholder')
      if (!placeholderTexture(this.scene, key, hash)) return
      placeholderKey = key
    } else {
      markFirstPainting()
    }

    const piece = slot.piece
    const geometry = displayGeometry(
      slot.index,
      piece.canvas,
      centerX,
      this.assets.aspect.plaque,
      this.assets.aspect.rope,
    )

    const paintingRef: PlaneRef = texture ? { key: texture.key } : { key: placeholderKey! }
    const painting = addPlane(
      this.scene,
      paintingRef,
      geometry.painting.width,
      geometry.painting.height,
      geometry.painting.x,
      geometry.painting.y,
      geometry.painting.z,
    )

    const plaqueRef = this.assets.frameOf(PLAQUE_FILE)
    const plaque = addPlane(
      this.scene,
      { key: plaqueRef.key, frame: plaqueRef.frame },
      geometry.plaque.width,
      geometry.plaque.height,
      geometry.plaque.x,
      geometry.plaque.y,
      geometry.plaque.z,
    )

    const ropeRef = this.assets.frameOf(ROPE_FILE)
    const ropes = ropeSlices(
      this.scene,
      { key: ropeRef.key, frame: ropeRef.frame },
      this.assets.aspect.rope,
      geometry.width,
      centerX,
    ).planes

    const wall: CoinWall = {
      index: slot.index,
      centerX,
      width: geometry.width,
      height: geometry.height,
      bottom: CONFIG.displayBottomY,
      pedestalDx: this.pedestalAfter(centerX, geometry.width),
    }
    this.coin.attach(wall)

    this.mounted.set(slot.index, {
      index: slot.index,
      display: piece,
      centerX,
      width: geometry.width,
      height: geometry.height,
      plaqueY: geometry.plaqueY,
      titleY: geometry.titleY,
      showsPlaceholder: !texture,
      painting,
      plaque,
      ropes,
      placeholderKey,
    })
    this.mountedList = [...this.mounted.values()]
  }

  private updatePedestals(dt: number, cameraX: number): void {
    const { mountRadiusUnits } = CONFIG.virtualization

    for (let i = 0; i < this.layout.pedestalX.length; i++) {
      const distance = Math.abs(this.layout.pedestalX[i] - cameraX)

      if (distance > mountRadiusUnits) {
        if (this.pedestals.has(i)) this.removePedestal(i)
        continue
      }

      let pedestal = this.pedestals.get(i)
      if (!pedestal) {
        pedestal = createPedestal(
          this.scene,
          this.assets,
          this.layout.pedestalX[i],
          i,
          this.bareHelmStand === i,
        )
        this.pedestals.set(i, pedestal)
      }

      pedestal.setPending(!this.mounted.has(i + 1))
      pedestal.update(dt)
    }
  }

  private unmountMesh(index: number): void {
    const mount = this.mounted.get(index)
    if (!mount) return

    this.coin.detach(index)
    mount.painting.image.destroy()
    mount.plaque.image.destroy()
    for (const rope of mount.ropes) rope.image.destroy()
    mount.fade?.image.destroy()
    if (mount.placeholderKey) this.scene.textures.remove(mount.placeholderKey)
    mount.placeholderKey = null

    this.mounted.delete(index)
    this.mountedList = [...this.mounted.values()]
    const slot = this.slots.get(index)
    if (slot) slot.inRangeAt = undefined
  }

  private unmount(index: number): void {
    this.unmountMesh(index)

    const slot = this.slots.get(index)
    if (!slot) return

    if (slot.texture) {
      disposeDisplayTexture(this.scene, slot.texture)
      slot.texture = undefined
    }
    slot.status = 'idle'
    slot.readyAt = undefined
    slot.attempts = 0
    slot.retryAt = undefined
  }

  private removePedestal(index: number): void {
    const pedestal = this.pedestals.get(index)
    if (!pedestal) return
    pedestal.dispose()
    this.pedestals.delete(index)
  }

  hitTestAt(point: WorldPoint): PieceHit | null {
    const planes = [...this.mounted.values()].map((m) => m.painting)
    const hits = hitsAt(point, planes)
    if (hits.length === 0) return null

    const mounted = [...this.mounted.values()].find((m) => m.painting === hits[0].plane)
    if (!mounted) return null

    return { mounted, pieceId: mounted.display.pieceId }
  }

  hitTestPedestalAt(point: WorldPoint): Pedestal | null {
    const sprites = [...this.pedestals.values()].map((p) => p.sprite)
    const hit = pickAt(point, sprites)
    if (!hit) return null
    return [...this.pedestals.values()].find((p) => p.sprite === hit.plane) ?? null
  }

  setBareHelmStand(index: number | null): void {
    const previous = this.bareHelmStand
    this.bareHelmStand = index
    if (previous !== null) this.pedestals.get(previous)?.setBare(false)
    if (index !== null) this.pedestals.get(index)?.setBare(true)
  }

  helmStandPoint(index: number, out?: WorldPoint3): WorldPoint3 | null {
    const x = this.layout.pedestalX[index]
    if (x === undefined) return null
    const { stand } = CONFIG.helm
    const height = CONFIG.pedestal.height
    const width = height * (stand.drawing[0] / stand.drawing[1])
    const point = out ?? { x: 0, y: 0, z: 0 }
    point.x = x + (stand.x / stand.drawing[0] - 0.5) * width
    point.y = CONFIG.pedestal.centerY + (0.5 - stand.y / stand.drawing[1]) * height
    point.z = CONFIG.pedestal.z
    return point
  }

  private pedestalAfter(centerX: number, width: number): number | null {
    const gapCentre = centerX + width / 2 + CONFIG.piece.gap / 2
    const x = this.layout.pedestalX.find((px) => Math.abs(px - gapCentre) < 1e-3)
    return x === undefined ? null : x - centerX
  }

  hitTestCoinAt(point: WorldPoint): boolean {
    const wall = this.coin.index === null ? undefined : this.mounted.get(this.coin.index)
    if (!wall) return false
    return this.coin.hitAt(point, [
      wall.painting,
      ...[...this.pedestals.values()].map((p) => p.sprite),
    ])
  }

  markCoinFound(): void {
    this.coin.markFound()
  }

  releaseCoin(): void {
    this.coin.release()
  }

  getMounted(): readonly MountedDisplay[] {
    return this.mountedList
  }

  nearbyVoices(): PedestalVoice[] {
    const voices: PedestalVoice[] = []
    for (const pedestal of this.pedestals.values()) if (pedestal.voice) voices.push(pedestal.voice)
    return voices
  }

  stats(): { mounted: number; loaded: number; total: number } {
    let loaded = 0
    for (const slot of this.slots.values()) if (slot.status === 'ready') loaded++
    return { mounted: this.mounted.size, loaded, total: this.totalSlots }
  }

  dispose(): void {
    for (const index of [...this.mounted.keys()]) this.unmount(index)
    for (const index of [...this.pedestals.keys()]) this.removePedestal(index)
    for (const slot of this.slots.values()) {
      if (!slot.texture) continue
      disposeDisplayTexture(this.scene, slot.texture)
      slot.texture = undefined
    }
  }
}

export { HallWorld as HallScene }
