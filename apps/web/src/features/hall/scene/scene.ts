import * as THREE from 'three'
import type { HallPieceDto, HallSliceDto } from '@tiny/core'
import { disposeDisplayTexture, loadDisplayTexture, prefersAvif, type Assets } from './assets'
import { FIRST_PAINTING_MARK } from '@/shared/lib/vitals-marks'
import { CONFIG } from './config'
import { computeLayout, type HallLayout } from './layout'
import { createPedestal, type Pedestal } from './pedestal'
import { pickPainted } from './hit'
import { createHiddenCoin, type HiddenCoin } from './coin'

interface SlotRuntime {
  index: number
  piece: HallPieceDto
  status: 'idle' | 'loading' | 'ready' | 'error'
  texture?: THREE.Texture
  startedAt?: number
  readyAt?: number
  inRangeAt?: number
  attempts?: number
  retryAt?: number
}

const MAX_TEXTURE_ATTEMPTS = 4
const MAX_CONCURRENT_LOADS = 2

function retryDelayMs(attempts: number): number {
  return Math.min(8000, 500 * 2 ** attempts)
}

function wallSize(piece: HallPieceDto): { width: number; height: number } {
  const scale = CONFIG.piece.scale
  return { width: piece.canvas.w * scale, height: piece.canvas.h * scale }
}

export interface MountedDisplay {
  index: number
  display: HallPieceDto
  group: THREE.Group
  mesh: THREE.Mesh
  centerX: number
  width: number
  height: number
  plaqueY: number
  titleY: number
}

export interface PieceHit {
  mounted: MountedDisplay
  pieceId: string
}

export class HallScene {
  layout: HallLayout = computeLayout([])
  epochId = 0
  nextIndex: number | null = 0
  totalSlots = 0

  private slots = new Map<number, SlotRuntime>()
  private mounted = new Map<number, MountedDisplay>()
  private inFlight = 0
  onTextureReady: ((texture: THREE.Texture) => void) | null = null
  private pedestals = new Map<number, Pedestal>()
  private mountedList: MountedDisplay[] = []
  private bareHelmStand: number | null = null
  private coin: HiddenCoin

  constructor(
    private scene: THREE.Scene,
    private assets: Assets,
  ) {
    this.coin = createHiddenCoin(assets)
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
      widths.push(wallSize(this.slots.get(i)!.piece).width)
    }
    const isComplete = this.nextIndex === null && widths.length === this.totalSlots
    this.layout = computeLayout(widths, isComplete)

    for (const mount of this.mounted.values()) {
      const x = this.layout.centerX[mount.index]
      if (x !== undefined) mount.group.position.x = x
    }
    for (const [i, pedestal] of this.pedestals) {
      const x = this.layout.pedestalX[i]
      if (x !== undefined) pedestal.group.position.x = x
    }
  }

  needsMore(visitorX: number): boolean {
    if (this.nextIndex === null) return false
    const laid = this.layout.known
    if (laid === 0) return true
    const lastCenter = this.layout.centerX[laid - 1] ?? 0
    return visitorX > lastCenter - CONFIG.loading.prefetchAheadUnits
  }

  update(now: number, dt: number, cameraX: number): void {
    const { mountRadiusUnits, loadRadiusUnits } = CONFIG.virtualization
    const wanted: { slot: SlotRuntime; distance: number }[] = []
    let mountedThisFrame = false

    for (const slot of this.slots.values()) {
      const centerX = this.layout.centerX[slot.index]
      if (centerX === undefined) continue

      const distance = Math.abs(centerX - cameraX)

      if (distance > loadRadiusUnits) {
        // An exhausted slot is reset too, so walking back gives it fresh attempts.
        if (this.mounted.has(slot.index) || slot.status === 'error') this.unmount(slot.index)
        continue
      }

      if (slot.status === 'idle') {
        wanted.push({ slot, distance })
        continue
      }

      if (slot.status === 'error') {
        const attempts = slot.attempts ?? 0
        if (attempts < MAX_TEXTURE_ATTEMPTS && now >= (slot.retryAt ?? 0)) {
          wanted.push({ slot, distance })
        }
        continue
      }

      if (distance > mountRadiusUnits) {
        if (this.mounted.has(slot.index)) this.unmountMesh(slot.index)
        continue
      }
      if (slot.inRangeAt === undefined) slot.inRangeAt = now

      if (slot.status === 'ready' && !this.mounted.has(slot.index)) {
        const arrivedAt = slot.inRangeAt ?? now
        const earliest = arrivedAt + CONFIG.statue.minDwellMs
        if (!mountedThisFrame && now >= Math.max(slot.readyAt ?? now, earliest)) {
          this.mount(slot)
          mountedThisFrame = true
        }
      }
    }

    wanted.sort((a, b) => a.distance - b.distance)
    for (const { slot } of wanted) {
      if (this.inFlight >= MAX_CONCURRENT_LOADS) break
      this.beginLoad(slot, now)
    }

    this.updatePedestals(dt, cameraX)
    this.coin.update(dt)
  }

  private beginLoad(slot: SlotRuntime, now: number): void {
    slot.status = 'loading'
    slot.startedAt = now
    this.inFlight += 1

    const { url, avifUrl } = slot.piece.image
    loadDisplayTexture(prefersAvif() && avifUrl ? avifUrl : url)
      .finally(() => {
        this.inFlight -= 1
      })
      .then((texture) => {
        this.onTextureReady?.(texture)
        slot.texture = texture
        slot.status = 'ready'
        slot.readyAt = performance.now()
        slot.attempts = 0
      })
      .catch(() => {
        const attempts = (slot.attempts ?? 0) + 1
        slot.status = 'error'
        slot.attempts = attempts
        slot.retryAt = performance.now() + retryDelayMs(attempts)
      })
  }

  private mount(slot: SlotRuntime): void {
    const centerX = this.layout.centerX[slot.index]
    if (centerX === undefined || !slot.texture) return
    if (performance.getEntriesByName(FIRST_PAINTING_MARK).length === 0) performance.mark(FIRST_PAINTING_MARK)

    const piece = slot.piece
    const group = new THREE.Group()
    group.position.set(centerX, 0, 0)

    const bottom = CONFIG.displayBottomY
    const { width, height } = wallSize(piece)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: slot.texture, transparent: true, opacity: 1 }),
    )
    mesh.position.set(0, bottom + height / 2, 0)
    mesh.userData.slotIndex = slot.index
    group.add(mesh)

    const plaqueHeight = CONFIG.plaque.width / this.assets.aspect.plaque
    const plaqueY = bottom - CONFIG.plaque.gap - plaqueHeight / 2
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(CONFIG.plaque.width, plaqueHeight),
      new THREE.MeshBasicMaterial({
        map: this.assets.textures.plaque,
        transparent: true,
        opacity: 1,
      }),
    )
    plaque.position.set(0, plaqueY, CONFIG.plaque.z)
    group.add(plaque)

    const ropeHeight = CONFIG.rope.height
    const ropeNaturalWidth = ropeHeight * this.assets.aspect.rope

    const CUTS = [0, 0.24, 0.78, 1] as const
    const endWidths = [
      (CUTS[1] - CUTS[0]) * ropeNaturalWidth,
      (CUTS[3] - CUTS[2]) * ropeNaturalWidth,
    ]
    const ropeSpan = width
    const middleWidth = Math.max(
      (CUTS[2] - CUTS[1]) * ropeNaturalWidth,
      ropeSpan - endWidths[0] - endWidths[1],
    )

    const sliceWidths = [endWidths[0], middleWidth, endWidths[1]]
    const totalWidth = sliceWidths[0] + sliceWidths[1] + sliceWidths[2]

    let cursorX = -totalWidth / 2
    for (let i = 0; i < 3; i++) {
      const sliceTexture = this.assets.textures.rope.clone()
      sliceTexture.repeat.set(CUTS[i + 1] - CUTS[i], 1)
      sliceTexture.offset.set(CUTS[i], 0)
      sliceTexture.userData.ownedByDisplay = true
      sliceTexture.needsUpdate = true

      const slice = new THREE.Mesh(
        new THREE.PlaneGeometry(sliceWidths[i], ropeHeight),
        new THREE.MeshBasicMaterial({ map: sliceTexture, transparent: true, opacity: 1 }),
      )
      slice.position.set(cursorX + sliceWidths[i] / 2, CONFIG.rope.centerY, CONFIG.rope.z)
      group.add(slice)
      cursorX += sliceWidths[i]
    }

    this.coin.attach({
      index: slot.index,
      group,
      width,
      height,
      bottom,
      pedestalDx: this.pedestalAfter(centerX, width),
    })

    this.scene.add(group)
    this.mountedList = []
    this.mounted.set(slot.index, {
      index: slot.index,
      display: piece,
      group,
      mesh,
      centerX,
      width,
      height,
      plaqueY,
      titleY: bottom + height + CONFIG.displayTitleGap,
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
          this.assets,
          this.layout.pedestalX[i],
          i,
          this.bareHelmStand === i,
        )
        this.scene.add(pedestal.group)
        this.pedestals.set(i, pedestal)
      }

      pedestal.setPending(!this.mounted.has(i + 1))
      pedestal.update(dt)
    }
  }

  private unmountMesh(index: number): void {
    const mount = this.mounted.get(index)
    if (!mount) return

    this.scene.remove(mount.group)
    this.coin.detach(index)
    mount.group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.geometry.dispose()
      const material = obj.material as THREE.MeshBasicMaterial
      if (material.map?.userData.ownedByDisplay) material.map.dispose()
      material.dispose()
    })

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
      disposeDisplayTexture(slot.texture)
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
    this.scene.remove(pedestal.group)
    pedestal.dispose()
    this.pedestals.delete(index)
  }

  hitTest(raycaster: THREE.Raycaster): PieceHit | null {
    const meshes = [...this.mounted.values()].map((m) => m.mesh)
    const hits = raycaster.intersectObjects(meshes, false)
    if (hits.length === 0) return null

    const hit = hits[0]
    if (!hit.uv) return null
    const mounted = this.mounted.get(hit.object.userData.slotIndex as number)
    if (!mounted) return null

    return { mounted, pieceId: mounted.display.pieceId }
  }

  hitTestPedestal(raycaster: THREE.Raycaster): Pedestal | null {
    const sprites = [...this.pedestals.values()].map((p) => p.sprite)
    const hit = pickPainted(raycaster, sprites)
    if (!hit) return null
    return [...this.pedestals.values()].find((p) => p.sprite === hit.object) ?? null
  }

  setBareHelmStand(index: number | null): void {
    const previous = this.bareHelmStand
    this.bareHelmStand = index
    if (previous !== null) this.pedestals.get(previous)?.setBare(false)
    if (index !== null) this.pedestals.get(index)?.setBare(true)
  }

  helmStandPoint(index: number, out: THREE.Vector3): THREE.Vector3 | null {
    const x = this.layout.pedestalX[index]
    if (x === undefined) return null
    const { stand } = CONFIG.helm
    const height = CONFIG.pedestal.height
    const width = height * (stand.drawing[0] / stand.drawing[1])
    return out.set(
      x + (stand.x / stand.drawing[0] - 0.5) * width,
      CONFIG.pedestal.centerY + (0.5 - stand.y / stand.drawing[1]) * height,
      CONFIG.pedestal.z,
    )
  }

  private pedestalAfter(centerX: number, width: number): number | null {
    const gapCentre = centerX + width / 2 + CONFIG.piece.gap / 2
    const x = this.layout.pedestalX.find((px) => Math.abs(px - gapCentre) < 1e-3)
    return x === undefined ? null : x - centerX
  }

  hitTestCoin(raycaster: THREE.Raycaster): boolean {
    const wall = this.coin.index === null ? undefined : this.mounted.get(this.coin.index)
    if (!wall) return false
    return this.coin.tap(raycaster, [wall.mesh, ...[...this.pedestals.values()].map((p) => p.sprite)])
  }

  releaseCoin(): void {
    this.coin.release()
  }

  getMounted(): readonly MountedDisplay[] {
    return this.mountedList
  }

  stats(): { mounted: number; loaded: number; total: number } {
    let loaded = 0
    for (const slot of this.slots.values()) if (slot.status === 'ready') loaded++
    return { mounted: this.mounted.size, loaded, total: this.totalSlots }
  }

  dispose(): void {
    for (const index of [...this.mounted.keys()]) this.unmount(index)
    for (const index of [...this.pedestals.keys()]) this.removePedestal(index)
  }
}
