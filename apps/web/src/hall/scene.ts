import * as THREE from 'three'
import type { DisplayDto, HallSliceDto } from '@tiny/core'
import { loadDisplayTexture, type Assets } from './assets'
import { CONFIG } from './config'
import { computeLayout, type HallLayout, type SlotSize } from './layout'
import { createPedestal, type Pedestal } from './pedestal'

/**
 * Owns what exists in the hall at any moment.
 *
 * Unlike the prototype there is no client-side compositing: a display arrives
 * from the API as one flattened image the server produced, plus a region map
 * for hit testing. The client's job is to load that texture, hang it in the
 * right place, and free it when the visitor walks away.
 */

const REVEAL_MS = 320

interface SlotRuntime {
  index: number
  display: DisplayDto
  status: 'idle' | 'loading' | 'ready' | 'error'
  texture?: THREE.Texture
  /** When texture loading began; the pedestal's dwell floor runs from here. */
  startedAt?: number
  readyAt?: number
}

export interface MountedDisplay {
  index: number
  display: DisplayDto
  group: THREE.Group
  mesh: THREE.Mesh
  centerX: number
  width: number
  height: number
  mountedAt: number
  plaqueY: number
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
  private pedestals = new Map<number, Pedestal>()

  constructor(
    private scene: THREE.Scene,
    private assets: Assets,
  ) {}

  /** Adds displays from an API slice and extends the hall's geometry. */
  ingestSlice(slice: HallSliceDto): void {
    this.epochId = slice.epochId
    this.nextIndex = slice.nextIndex
    this.totalSlots = slice.totalSlots

    for (const slot of slice.slots) {
      if (this.slots.has(slot.index)) continue
      this.slots.set(slot.index, { index: slot.index, display: slot.display, status: 'idle' })
    }

    this.rebuildLayout()
  }

  private rebuildLayout(): void {
    const sizes: SlotSize[] = []
    // Only a contiguous run from zero can be positioned; a gap would put every
    // later display at the wrong place on the wall.
    for (let i = 0; this.slots.has(i); i++) {
      sizes.push({ index: i, width: this.slots.get(i)!.display.canvas.w })
    }
    this.layout = computeLayout(sizes)

    for (const mount of this.mounted.values()) {
      const x = this.layout.centerX[mount.index]
      if (x !== undefined) {
        mount.centerX = x
        mount.group.position.x = x
      }
    }
    for (const [i, pedestal] of this.pedestals) {
      const x = this.layout.pedestalX[i]
      if (x !== undefined) pedestal.group.position.x = x
    }
  }

  /** True when the visitor is close enough to the end to need another slice. */
  needsMore(visitorX: number): boolean {
    if (this.nextIndex === null) return false
    const laid = this.layout.known
    if (laid === 0) return true
    const lastCenter = this.layout.centerX[laid - 1] ?? 0
    return visitorX > lastCenter - CONFIG.loading.prefetchAheadUnits
  }

  update(now: number, dt: number, cameraX: number, _visitorX: number): void {
    const { mountRadiusUnits } = CONFIG.virtualization

    for (const slot of this.slots.values()) {
      const centerX = this.layout.centerX[slot.index]
      if (centerX === undefined) continue

      const distance = Math.abs(centerX - cameraX)

      if (distance > mountRadiusUnits) {
        if (this.mounted.has(slot.index)) this.unmount(slot.index)
        continue
      }

      if (slot.status === 'idle') {
        this.beginLoad(slot, now)
        continue
      }

      if (slot.status === 'ready' && !this.mounted.has(slot.index)) {
        const earliest = (slot.startedAt ?? now) + CONFIG.statue.minDwellMs
        if (now >= Math.max(slot.readyAt ?? now, earliest)) this.mount(slot, now)
      }
    }

    this.updatePedestals(dt, cameraX)
  }

  private beginLoad(slot: SlotRuntime, now: number): void {
    slot.status = 'loading'
    slot.startedAt = now

    loadDisplayTexture(slot.display.image.url)
      .then((texture) => {
        slot.texture = texture
        slot.status = 'ready'
        slot.readyAt = performance.now()
      })
      .catch(() => {
        slot.status = 'error'
      })
  }

  private mount(slot: SlotRuntime, now: number): void {
    const centerX = this.layout.centerX[slot.index]
    if (centerX === undefined || !slot.texture) return

    const { canvas } = slot.display
    const group = new THREE.Group()
    group.position.set(centerX, 0, 0)

    const material = new THREE.MeshBasicMaterial({
      map: slot.texture,
      transparent: true,
      opacity: 1,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(canvas.w, canvas.h), material)
    mesh.position.y = CONFIG.displayCenterY
    mesh.userData.slotIndex = slot.index
    group.add(mesh)

    // Wall label. The text on it is DOM, positioned by Placards.
    const plaqueMaterial = new THREE.MeshBasicMaterial({
      map: this.assets.textures.plaque,
      transparent: true,
      opacity: 1,
    })
    const plaque = new THREE.Mesh(
      new THREE.PlaneGeometry(CONFIG.plaque.width, CONFIG.plaque.width / this.assets.aspect.plaque),
      plaqueMaterial,
    )
    plaque.position.set(0, CONFIG.plaque.centerY, 0.02)
    group.add(plaque)

    const ropeMaterial = new THREE.MeshBasicMaterial({
      map: this.assets.textures.rope,
      transparent: true,
      opacity: 1,
    })
    const rope = new THREE.Mesh(
      new THREE.PlaneGeometry(CONFIG.rope.height * this.assets.aspect.rope, CONFIG.rope.height),
      ropeMaterial,
    )
    rope.position.set(0, CONFIG.rope.centerY, CONFIG.rope.z)
    group.add(rope)

    this.scene.add(group)
    this.mounted.set(slot.index, {
      index: slot.index,
      display: slot.display,
      group,
      mesh,
      centerX,
      width: canvas.w,
      height: canvas.h,
      mountedAt: now,
      plaqueY: CONFIG.plaque.centerY,
    })
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
        pedestal = createPedestal(this.assets, this.layout.pedestalX[i], i)
        this.scene.add(pedestal.group)
        this.pedestals.set(i, pedestal)
      }

      // Pending while the display on its far side is not yet hanging. The only
      // loading affordance in the whole product.
      pedestal.setPending(!this.mounted.has(i + 1))
      pedestal.update(dt)
    }
  }

  private unmount(index: number): void {
    const mount = this.mounted.get(index)
    if (!mount) return

    this.scene.remove(mount.group)
    mount.group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.geometry.dispose()
      ;(obj.material as THREE.Material).dispose()
    })

    // The display texture belongs to this slot; scenery textures are shared
    // and owned by the asset loader, so they are deliberately left alone.
    const slot = this.slots.get(index)
    if (slot?.texture) {
      slot.texture.dispose()
      slot.texture = undefined
      slot.status = 'idle'
    }

    this.mounted.delete(index)
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

    // Three's uv origin is bottom-left; the region map is top-left.
    const u = hit.uv.x
    const v = 1 - hit.uv.y
    const map = mounted.display.regionMap

    for (let i = map.length - 1; i >= 0; i--) {
      const r = map[i]
      if (u >= r.x && u <= r.x + r.w && v >= r.y && v <= r.y + r.h) {
        return { mounted, pieceId: r.pieceId }
      }
    }
    return null
  }

  getMounted(): MountedDisplay[] {
    return [...this.mounted.values()]
  }

  fadeOf(index: number): number {
    return 1
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
