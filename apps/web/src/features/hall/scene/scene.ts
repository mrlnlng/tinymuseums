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
  /** When the image was asked for. Diagnostic, and the load's own clock. */
  startedAt?: number
  readyAt?: number
  /*  When the wall first came close enough to hang. The pedestal's dwell floor
      runs from here rather than from `startedAt`, so a painting downloaded well
      ahead of the visitor is hung the moment they arrive at it. */
  inRangeAt?: number
}

/* How large a piece hangs on the wall: the server renders every frame to one target size, and `piece.scale` is the client's say over how much of the wall that fills — enlarging it here rather than re-rendering keeps the images cached across a change of mind. */
function wallSize(piece: HallPieceDto): { width: number; height: number } {
  const scale = CONFIG.piece.scale
  return { width: piece.canvas.w * scale, height: piece.canvas.h * scale }
}

/* One painting, hung on its own wall — the plane is the framed image at the piece's own canvas proportion, standing on a common lower edge so every plaque in the hall is at one height. */
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
  /*  What is hanging, as an array, rebuilt only when something is hung or taken
      down. The frame loop asks for this every frame and used to get a fresh copy
      of the map's values each time — an array allocated sixty times a second to
      hold four or five items that had not changed. */
  private mountedList: MountedDisplay[] = []

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
      widths.push(wallSize(this.slots.get(i)!.piece).width)
    }
    /*  Complete means the server has no more slices *and* everything it
        promised is laid out contiguously from zero — only then does the hall
        have a last painting for the gift shop to stand past. */
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

  /** True when the visitor is close enough to the end to need another slice. */
  needsMore(visitorX: number): boolean {
    if (this.nextIndex === null) return false
    const laid = this.layout.known
    if (laid === 0) return true
    const lastCenter = this.layout.centerX[laid - 1] ?? 0
    return visitorX > lastCenter - CONFIG.loading.prefetchAheadUnits
  }

  update(now: number, dt: number, cameraX: number): void {
    const { mountRadiusUnits, loadRadiusUnits } = CONFIG.virtualization

    for (const slot of this.slots.values()) {
      const centerX = this.layout.centerX[slot.index]
      if (centerX === undefined) continue

      const distance = Math.abs(centerX - cameraX)

      /*  Right out of range: give the image back. Note this is the *load*
          radius, not the mount radius — a wall walked past is kept downloaded
          for a good while yet, so turning round and walking back does not pay
          for the same painting twice. */
      if (distance > loadRadiusUnits) {
        if (this.mounted.has(slot.index)) this.unmount(slot.index)
        continue
      }

      // Fetching starts far out and costs nothing on screen until it lands.
      if (slot.status === 'idle') {
        this.beginLoad(slot, now)
        continue
      }

      // Hanging it — geometry, and the texture upload to the GPU — waits until
      // the wall is close enough to be worth the video memory, and ends as soon
      // as it is not. The painting itself stays downloaded either way.
      if (distance > mountRadiusUnits) {
        if (this.mounted.has(slot.index)) this.unmountMesh(slot.index)
        continue
      }
      if (slot.inRangeAt === undefined) slot.inRangeAt = now

      if (slot.status === 'ready' && !this.mounted.has(slot.index)) {
        /*  The pedestal's dwell floor runs from whenever the wall came into
            mounting range, not from when its download began: a painting fetched
            two screens back is already in hand by the time the visitor reaches
            it, and should not be held behind a pedestal for a beat it spent
            waiting. */
        const arrivedAt = slot.inRangeAt ?? now
        const earliest = arrivedAt + CONFIG.statue.minDwellMs
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

    /*  Walls hang from a common *lower* edge rather than a common centre or a
        common top, so every plaque in the hall sits at one height; the plane is
        the server's framed image at the piece's own proportion. */
    const bottom = CONFIG.displayBottomY
    const { width, height } = wallSize(piece)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      new THREE.MeshBasicMaterial({ map: slot.texture, transparent: true, opacity: 1 }),
    )
    mesh.position.set(0, bottom + height / 2, 0)
    mesh.userData.slotIndex = slot.index
    group.add(mesh)

    /*  The plaque beneath the drawing: the text on it is DOM, positioned by
        Placards; the sprite hangs below the plane's bottom edge and *behind*
        the rope, which is where the mockups put it — the rope is furniture on
        the floor and the plaque is on the wall behind it. */
    const plaqueHeight = CONFIG.plaque.width / this.assets.aspect.plaque
    // Off the common lower edge, so this is the same height on every wall.
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

    /* The rope, stretched across this painting without stretching its posts: cut into three vertical slices and rebuilt, so the posts keep their drawn proportions and only the swag stretches. The cuts at 0.24 and 0.78 fall in empty space beside each post. */
    const ropeHeight = CONFIG.rope.height
    const ropeNaturalWidth = ropeHeight * this.assets.aspect.rope

    const CUTS = [0, 0.24, 0.78, 1] as const
    const endWidths = [
      (CUTS[1] - CUTS[0]) * ropeNaturalWidth,
      (CUTS[3] - CUTS[2]) * ropeNaturalWidth,
    ]
    /*  The rope is strung to the painting it stands in front of: exactly the
        width of the frame above it, so the two posts line up with the frame's
        outer edges instead of standing out past them. It used to be given a
        width of its own, wider than any frame, from when the walls were far
        enough apart that a rope had to reach across the screen to read as one. */
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
      // Just above this painting's own top edge, wherever that has come out.
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

  /*  Takes the wall down but keeps its image. The two are separated because
      they cost different things: the geometry, the rope's per-wall texture
      slices and the GPU upload go as soon as the wall is out of mounting range,
      while the downloaded painting is worth holding on to much longer. */
  private unmountMesh(index: number): void {
    const mount = this.mounted.get(index)
    if (!mount) return

    this.scene.remove(mount.group)
    mount.group.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return
      obj.geometry.dispose()
      const material = obj.material as THREE.MeshBasicMaterial
      /* Per-wall textures are freed with their wall — the rope's slices are cloned per wall (the crop depends on the width), so without this walking the hall would leak a texture per wall passed. Scenery textures the loader owns are left alone, and so is the painting's own, which the slot still holds. */
      if (material.map?.userData.ownedByDisplay) material.map.dispose()
      material.dispose()
    })

    this.mounted.delete(index)
    this.mountedList = [...this.mounted.values()]
    // Hung again from a standing start, so it serves its dwell beat afresh.
    const slot = this.slots.get(index)
    if (slot) slot.inRangeAt = undefined
  }

  /** Takes the wall down and gives the painting itself back. */
  private unmount(index: number): void {
    this.unmountMesh(index)

    const slot = this.slots.get(index)
    if (slot?.texture) {
      slot.texture.dispose()
      slot.texture = undefined
      slot.status = 'idle'
      slot.readyAt = undefined
    }
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
