import type Phaser from 'phaser'
import type { HallPieceDto, HallSliceDto } from '@tiny/core'
import type { EffectName } from '@/features/sound/hooks/useSoundEffects'
import type { Character } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import { computeLayout, type HallLayout } from '@/features/hall/scene/layout'
import { needsMore, SliceFeed } from '@/features/hall/scene/streaming'
import type { Traversal } from '@/features/hall/scene/traversal'
import type { Viewport } from '@/features/hall/scene/overlay'
import { createBackdrop } from './backdrop'
import type { GameAssets } from './assets'
import { setEntranceFrames } from './harness'
import { phaserCamera, ViewProjector, type View } from './view'

export type PhaserModule = typeof import('phaser')

export interface HallSound {
  play(name: EffectName): void
  prepare(name: EffectName): void
  setWalking(value: boolean): void
}

export interface HallRuntime {
  cssWidth: number
  cssHeight: number
  density: number
  view: View
  viewport: Viewport
  ready: boolean
  known: number
}

export interface HallSceneDeps {
  runtime: HallRuntime
  assets: GameAssets
  initialSlice: HallSliceDto
  character: Character
  traversal: Traversal
  governor: { sample(frameMs: number, isSettled: boolean): void }
  isSuspended: () => boolean
  sound: () => HallSound
  onReady: () => void
  onIntroDone: () => void
  onFirstMove: () => void
}

const BACKDROP_LENGTH = 600
const WALLPAPER_KEY = 'hall-wallpaper'
const FLOOR_KEY = 'hall-floor'

const OPENING_MAX_WAIT_MS = 5000
const SETTLE_AFTER_READY_MS = 3000
const QUIET_AFTER_SECONDS = 2
const WALKING_SPEED = 0.12

export function createHallGameScene(P: PhaserModule, deps: HallSceneDeps) {
  return class HallGameScene extends P.Scene {
    private slots = new Map<number, HallPieceDto>()
    private epochId = 0
    private nextIndex: number | null = 0
    private totalSlots = 0
    private layout: HallLayout = computeLayout([])
    private sliceFeed!: SliceFeed
    private fontsReady = false
    private backdropDrawn = false
    private openingStart = 0
    private isReady = false
    private readyAt = Infinity
    private lastFrameAt = 0
    private restX: number | null = null
    private hasMoved = false
    private isQuiet = false

    constructor() {
      super({ key: 'hall' })
    }

    create(): void {
      this.cameras.main.setOrigin(0, 0)
      deps.assets.registerEntrance(this)
      setEntranceFrames(deps.assets.frames)
      if (!this.textures.exists(WALLPAPER_KEY)) this.textures.addImage(WALLPAPER_KEY, deps.assets.wallpaper)
      if (!this.textures.exists(FLOOR_KEY)) this.textures.addImage(FLOOR_KEY, deps.assets.floor)

      createBackdrop(this, deps.assets, BACKDROP_LENGTH)
      this.backdropDrawn = true
      this.openingStart = performance.now()
      this.lastFrameAt = performance.now()

      void document.fonts.ready.then(() => {
        this.fontsReady = true
      })

      this.sliceFeed = new SliceFeed({
        sliceSize: CONFIG.loading.sliceSize,
        fetchSlice: async (epochId, after, limit) => {
          const response = await fetch(`/api/hall?epoch=${epochId}&after=${after}&limit=${limit}`)
          if (!response.ok) throw new Error(`hall slice ${response.status}`)
          return (await response.json()) as HallSliceDto
        },
        onSlice: (slice) => this.ingestSlice(slice),
      })

      const entrance = CONFIG.lobby.startX
      deps.traversal.reset(entrance)
      this.ingestSlice(deps.initialSlice)
    }

    private ingestSlice(slice: HallSliceDto): void {
      this.epochId = slice.epochId
      this.nextIndex = slice.nextIndex
      this.totalSlots = slice.totalSlots

      for (const slot of slice.slots) {
        if (this.slots.has(slot.index)) continue
        this.slots.set(slot.index, slot.display)
      }
      this.rebuildLayout()
    }

    private rebuildLayout(): void {
      const widths: number[] = []
      for (let i = 0; this.slots.has(i); i++) {
        widths.push(this.slots.get(i)!.canvas.w * CONFIG.piece.scale)
      }
      const isComplete = this.nextIndex === null && widths.length === this.totalSlots
      this.layout = computeLayout(widths, isComplete)
    }

    private openingReady(now: number): boolean {
      if (now - this.openingStart > OPENING_MAX_WAIT_MS) return true
      return this.fontsReady && this.backdropDrawn
    }

    update(time: number): void {
      const frameMs = time - this.lastFrameAt
      this.lastFrameAt = time
      deps.governor.sample(frameMs, time - this.readyAt > SETTLE_AFTER_READY_MS)
      const dt = Math.min(0.05, Math.max(0, frameMs / 1000))

      if (!this.isReady) {
        if (this.openingReady(time)) {
          this.isReady = true
          this.readyAt = time
          deps.runtime.ready = true
          deps.onReady()
          deps.traversal.playIntro(
            CONFIG.lobby.startX - CONFIG.lobby.introWalk,
            CONFIG.lobby.startX,
          )
        }
      } else {
        deps.traversal.setSuspended(deps.isSuspended())
        deps.traversal.update(dt, this.layout.totalLength)
      }

      if (this.restX === null && !deps.traversal.isIntro) {
        this.restX = deps.traversal.cameraX
        deps.onIntroDone()
      } else if (
        this.restX !== null &&
        !this.hasMoved &&
        Math.abs(deps.traversal.cameraX - this.restX) > 0.05
      ) {
        this.hasMoved = true
        deps.onFirstMove()
      }

      const camera = this.cameras.main
      const at = phaserCamera(deps.traversal.cameraX, deps.runtime.view, deps.runtime.density)
      camera.setOrigin(0, 0)
      camera.setZoom(at.zoom)
      camera.setScroll(at.scrollX, at.scrollY)

      const projector = new ViewProjector(
        deps.traversal.cameraX,
        deps.runtime.view,
        deps.runtime.viewport,
      )
      deps.character.update(dt, deps.traversal.x, deps.traversal.walkVelocity, projector)
      deps.sound().setWalking(Math.abs(deps.traversal.walkVelocity) > WALKING_SPEED)

      deps.runtime.known = this.layout.known
      if (
        needsMore({
          nextIndex: this.nextIndex,
          known: this.layout.known,
          centerX: this.layout.centerX,
          visitorX: deps.traversal.cameraX,
          prefetchAheadUnits: CONFIG.loading.prefetchAheadUnits,
        })
      ) {
        this.sliceFeed.maybeFetch(this.epochId, this.nextIndex)
      }

      this.isQuiet = deps.isSuspended() || deps.traversal.idleSeconds > QUIET_AFTER_SECONDS
    }
  }
}
