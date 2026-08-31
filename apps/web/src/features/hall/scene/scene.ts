import * as THREE from 'three'
import type { HallPieceDto, HallSliceDto } from '@tiny/core'
import { loadDisplayTexture, type Assets } from './assets'
import { CONFIG } from './config'
import { computeLayout, type HallLayout } from './layout'
import { createPedestal, type Pedestal } from './pedestal'

/* Owns what exists in the hall: each slot is one framed work the server rendered to its own image; the client loads it, hangs it, and frees it when the visitor walks away. */

interface SlotRuntime {
  index: number
  piece: HallPieceDto
  status: 'idle' | 'loading' | 'ready' | 'error'
  texture?: THREE.Texture
  /** When texture loading began; the pedestal's dwell floor runs from here. */
  startedAt?: number
  readyAt?: number
}

/* One painting, hung on its own wall — the plane is the framed image at the piece's own canvas proportion, hanging from a common top edge so the row stays level. */
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
  private pedestals = new Map<number, Pedestal>()

  constructor(
    private scene: THREE.Scene,
    private assets: Assets,
  ) {}

  /** Adds paintings from an API slice and extends the hall's geometry. */
  ingestSlice(slice: HallSliceDto): void {
    this.epochId = slice.epochId
    this.nextIndex = slice.nextIndex
    this.totalSlots = slice.totalSlots

    for (const slot of slice.slots) {
      if (this.slots.has(slot.index)) continue
      this.slots.set(slot.index, { index: slot.index, piece: slot.display, status: 'idle' })
    }

    this.rebuildLayout()
  }

  private rebuildLayout(): void {
    const widths: number[] = []
    for (let i = 0; this.slots.has(i); i++) {
      widths.push(this.slots.get(i)!.piece.canvas.w)
    }
    this.layout = computeLayout(widths)

    for (const mount of this.mounted.values()) {
      const x = this.layout.centerX[mount.index]
      if (x !== undefined) mount.group.position.x = x
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

  update(now: number, dt: number, cameraX: number): void {
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
        if (now >= Math.max(slot.readyAt ?? now, earliest)) this.mount(slot)
      }
    }

    this.updatePedestals(dt, cameraX)
  }

  private beginLoad(slot: SlotRuntime, now: number): void {
    slot.status = 'loading'
    slot.startedAt = now

    loadDisplayTexture(slot.piece.image.url)
      .then((texture) => {
        slot.texture = texture
        slot.status = 'ready'
        slot.readyAt = performance.now()
      })
      .catch(() => {
        slot.status = 'error'
      })
  }

  private mount(slot: SlotRuntime): void {
    const centerX = this.layout.centerX[slot.index]
    if (centerX === undefined || !slot.texture) return

    const piece = slot.piece
    const group = new THREE.Group()
    group.position.set(centerX, 0, 0)

    /* Walls hang from a common top edge rather than a common centre, so the row stays level; the plane is the server's framed image at the piece's own proportion. */
    const top = CONFIG.displayTopY
    const height = piece.canvas.h
    const width = piece.canvas.w
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: slot.texture, transparent: true, opacity: 1 }),
    )
    mesh.position.set(0, top - height / 2, 0)
    mesh.userData.slotIndex = slot.index
    group.add(mesh)

    // The plaque beneath the drawing: the text on it is DOM, positioned by
    // Placards; the sprite hangs below the plane's bottom edge, above the rope.
    const plaqueHeight = CONFIG.plaque.width / this.assets.aspect.plaque
    const plaqueY = top - height - CONFIG.plaque.gap - plaqueHeight / 2
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

    /* The rope, stretched across this painting without stretching its posts: cut into three vertical slices and rebuilt, so the posts keep their drawn proportions and only the swag stretches. The cuts at 0.24 and 0.78 fall in empty space beside each post. */
    const ropeHeight = CONFIG.rope.height
    const ropeNaturalWidth = ropeHeight * this.assets.aspect.rope

    const CUTS = [0, 0.24, 0.78, 1] as const
    const endWidths = [
      (CUTS[1] - CUTS[0]) * ropeNaturalWidth,
      (CUTS[3] - CUTS[2]) * ropeNaturalWidth,
    ]
    // The swag takes whatever the posts leave; on a painting too narrow to need
    // stretching it keeps its own width. `ropeSpan` is deliberately wider than
    // the frame so the rope reads as crossing the screen.
    const ropeSpan = Math.max(width, CONFIG.piece.ropeWidth)
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

    this.scene.add(group)
    this.mounted.set(slot.index, {
      index: slot.index,
      display: piece,
      group,
      mesh,
      centerX,
      width,
      height,
      plaqueY,
      titleY: top + CONFIG.displayTitleGap,
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

      // Pending while the painting on its far side is not yet hanging. The only
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
      const material = obj.material as THREE.MeshBasicMaterial
      /* Per-wall textures are freed with their wall — the rope's slices are cloned per wall (the crop depends on the width), so without this walking the hall would leak a texture per wall passed. Scenery textures the loader owns are left alone. */
      if (material.map?.userData.ownedByDisplay) material.map.dispose()
      material.dispose()
    })

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

    return { mounted, pieceId: mounted.display.pieceId }
  }

  getMounted(): MountedDisplay[] {
    return [...this.mounted.values()]
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
