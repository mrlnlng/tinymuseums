import type Phaser from 'phaser'
import type { HallSliceDto } from '@tiny/core'
import type { EffectName } from '@/features/sound/hooks/useSoundEffects'
import { CONFIG } from '@/features/hall/scene/config'
import { createHelm, type Helm } from '@/features/hall/scene/helm'
import { createMatcha, type Matcha } from '@/features/hall/scene/matcha'
import {
  CafeLink,
  ComingSoonNote,
  FunZoneSign,
  GiftShopSigns,
  GuestBoardNotes,
  LobbySigns,
  Placards,
  type Viewport,
} from '@/features/hall/scene/overlay'
import { createSitting, type Sitting } from '@/features/hall/scene/sitting'
import { SliceFeed } from '@/features/hall/scene/streaming'
import type { TapIntent, TapWorld } from '@/features/hall/scene/tap'
import type { Traversal } from '@/features/hall/scene/traversal'
import type { OpenPiece } from '@/features/hall/hooks/useHallScene'
import { reachLandmark, reachPainting, track } from '@/shared/lib/visit'
import { addOpaqueTexture, createBackdrop, type Backdrop } from './backdrop'
import { createOcclusion } from './occlusion'
import { createCafe, type Cafe } from './cafe'
import { createSpriteCharacter, type SpriteCharacter } from './character'
import { createComingSoon, type ComingSoon } from './comingsoon'
import { createGiftShop, type GiftShop } from './giftshop'
import { createGuestBoard, type GuestBoard } from './guestboard'
import { createLobby, type Lobby } from './lobby'
import { HallWorld, type MountedDisplay } from './world'
import { phaserCamera, ViewProjector, type View } from './view'
import type { GameAssets, GameScenery } from './assets'
import { setEntranceFrames } from './harness'

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
  world: HallWorld | null
  tapWorld: TapWorld | null
  character: SpriteCharacter | null
  act: ((intent: TapIntent) => void) | null
  dispose: (() => void) | null
}

export interface HallSceneDeps {
  runtime: HallRuntime
  assets: GameAssets
  initialSlice: HallSliceDto
  overlayHost: HTMLElement
  characterHost: HTMLElement
  guestBoardNotesHost: HTMLElement | null
  traversal: Traversal
  governor: { sample(frameMs: number, isSettled: boolean): void }
  isSuspended: () => boolean
  sound: () => HallSound
  onReady: () => void
  onIntroDone: () => void
  onFirstMove: () => void
  onOpenPiece: (piece: OpenPiece) => void
  onLeave: () => void
  onOpenHelp: () => void
  onFindCoin: () => void
  onOpenGuestBoard: () => void
  onOpenSketchGame: () => void
  onGuestBoardHung: () => void
}

const BACKDROP_LENGTH = 600
const WALLPAPER_KEY = 'hall-wallpaper'
const FLOOR_KEY = 'hall-floor'

const OPENING_MAX_WAIT_MS = 5000
const SCENERY_MAX_WAIT_MS = 5000
const SETTLE_AFTER_READY_MS = 3000
const QUIET_AFTER_SECONDS = 2
const WALKING_SPEED = 0.12

const VIEWED_WITHIN_UNITS = 3.0
const VIEW_CHECK_MS = 250

const GIFT_SHOP_URL = 'https://www.inspiratiq.art/'
const CAFE_URL = 'https://buymeacoffee.com/inspiratiq'

export function createHallGameScene(P: PhaserModule, deps: HallSceneDeps) {
  return class HallGameScene extends P.Scene {
    private world!: HallWorld
    private character!: SpriteCharacter
    private occlusion = createOcclusion(() => [deps.overlayHost, deps.guestBoardNotesHost])
    private sliceFeed!: SliceFeed
    private lobby: Lobby | null = null
    private scenery: GameScenery | null = null
    private helm: Helm | null = null
    private matcha: Matcha | null = null
    private giftShop: GiftShop | null = null
    private giftShopSigns: GiftShopSigns | null = null
    private cafe: Cafe | null = null
    private cafeLink: CafeLink | null = null
    private guestBoard: GuestBoard | null = null
    private guestBoardNotes: GuestBoardNotes | null = null
    private funZoneSign: FunZoneSign | null = null
    private comingSoon: ComingSoon | null = null
    private comingSoonNote: ComingSoonNote | null = null
    private sitting: Sitting | null = null
    private backdrop: Backdrop | null = null
    private placards: Placards | null = null
    private lobbySigns: LobbySigns | null = null
    private sceneryGate = 0
    private sceneryWaitStart = 0
    private fontsReady = false
    private openingStart = 0
    private isReady = false
    private isDisposed = false
    private readyAt = Infinity
    private lastFrameAt = 0
    private throttledFrames = 0
    private restX: number | null = null
    private hasMoved = false
    private readonly viewedDisplays = new Set<number>()
    private lastViewCheck = 0

    constructor() {
      super({ key: 'hall' })
    }

    create(): void {
      this.cameras.main.setOrigin(0, 0)
      deps.assets.registerEntrance(this)
      setEntranceFrames(deps.assets.frames)
      addOpaqueTexture(this, WALLPAPER_KEY, deps.assets.wallpaper)
      addOpaqueTexture(this, FLOOR_KEY, deps.assets.floor)

      this.backdrop = createBackdrop(this, deps.assets, BACKDROP_LENGTH)
      this.world = new HallWorld(this, deps.assets)
      this.world.ingestSlice(deps.initialSlice)
      this.character = createSpriteCharacter(this, deps.assets)
      this.lobby = createLobby(this, deps.assets)
      this.placards = new Placards(deps.overlayHost)
      this.lobbySigns = new LobbySigns(deps.overlayHost, this.lobby.marks)

      deps.traversal.reset(CONFIG.lobby.startX)

      this.sliceFeed = new SliceFeed({
        sliceSize: CONFIG.loading.sliceSize,
        fetchSlice: async (epochId, after, limit) => {
          const response = await fetch(`/api/hall?epoch=${epochId}&after=${after}&limit=${limit}`)
          if (!response.ok) throw new Error(`hall slice ${response.status}`)
          return (await response.json()) as HallSliceDto
        },
        onSlice: (slice) => this.world.ingestSlice(slice),
      })

      this.sceneryWaitStart = performance.now()
      this.sceneryGate = window.setInterval(() => this.checkSceneryGate(), 250)

      void document.fonts.ready.then(() => {
        this.fontsReady = true
      })
      this.openingStart = performance.now()
      this.lastFrameAt = performance.now()

      deps.runtime.world = this.world
      deps.runtime.tapWorld = this.buildTapWorld()
      deps.runtime.character = this.character
      deps.runtime.act = (intent) => this.act(intent)
      deps.runtime.dispose = () => this.disposeAll()
    }

    // The nearest displays open the door first, but a slow slice must not hold the
    // scenery hostage forever.
    private checkSceneryGate(): void {
      const { loaded, total } = this.world.stats()
      const nearestReady = loaded >= Math.min(2, total)
      if (!nearestReady && performance.now() - this.sceneryWaitStart < SCENERY_MAX_WAIT_MS) return
      window.clearInterval(this.sceneryGate)
      this.sceneryGate = 0
      this.requestScenery()
    }

    private requestScenery(): void {
      void deps.assets
        .loadGameScenery()
        .then((loaded) => {
          if (this.isDisposed) {
            loaded.dispose(this)
            return
          }
          deps.assets.registerScenery(this)
          this.scenery = loaded
          this.helm = createHelm(loaded, deps.characterHost, this.world)
          this.matcha = createMatcha(loaded, deps.characterHost, () => this.cafe)
        })
        .catch(() => {})
    }

    private buildTapWorld(): TapWorld {
      return {
        hitDoor: (point) => this.lobby?.hitTestDoorAt(point) ?? false,
        hitLobbyCat: (point) => this.lobby?.hitTestCatAt(point) ?? false,
        hitCoin: (point) => this.world.hitTestCoinAt(point),
        hitPainting: (point) => {
          const hit = this.world.hitTestAt(point)
          if (!hit) return null
          return {
            slug: hit.mounted.display.slug,
            artistId: hit.mounted.display.artistId,
            pieceId: hit.pieceId,
          }
        },
        hitPedestal: (point) =>
          this.world.hitTestPedestalAt(point) as unknown as ReturnType<TapWorld['hitPedestal']>,
        acceptsHelm: (pedestal) => this.helm?.accepts(pedestal) ?? false,
        hitMatcha: (point) => this.matcha !== null && (this.cafe?.hitTestMatchaAt(point) ?? false),
        hitCafeCat: (point) => this.cafe?.hitTestCatAt(point) ?? false,
        hitDesktop: (point) => this.guestBoard?.hitTestDesktopAt(point) ?? false,
        hitBeanbag: (point) =>
          this.sitting !== null &&
          (this.guestBoard?.hitTestBeanbagAt(point, this.sitting.occupied) ?? false),
        hitGuestBoard: (point) => this.guestBoard?.hitTestAt(point) ?? false,
      }
    }

    private act(intent: TapIntent): void {
      switch (intent.kind) {
        case 'leave':
          track('leave')
          deps.sound().play('click')
          deps.onLeave()
          return

        case 'help':
          track('help')
          deps.sound().play('click')
          deps.onOpenHelp()
          return

        case 'coin':
          this.world.markCoinFound()
          track('coin')
          deps.sound().play('coin')
          deps.onFindCoin()
          return

        case 'painting':
          track('painting')
          deps.sound().play('painting-open')
          deps.onOpenPiece({
            slug: intent.slug,
            artistId: intent.artistId,
            pieceId: intent.pieceId,
          })
          return

        case 'helm':
          this.helm?.take(intent.pedestal)
          track('helm')
          return

        case 'statue':
          track('statue')
          if (intent.pedestal.voice) deps.sound().play(intent.pedestal.voice)
          intent.pedestal.chime()
          return

        case 'matcha':
          this.matcha?.toggle()
          track('matcha')
          deps.sound().play('click')
          return

        case 'cafe-cat':
          track('cafe_cat')
          deps.sound().play('cafe-hello')
          return

        case 'sketch':
          track('sketch_open')
          deps.sound().play('click')
          deps.onOpenSketchGame()
          return

        case 'beanbag':
          this.sitting?.act()
          track('beanbag')
          deps.sound().play('click')
          return

        case 'guest-board':
          track('guest_board')
          deps.sound().play('click')
          deps.onOpenGuestBoard()
          return
      }
    }

    private raiseGiftShop(): void {
      const x = this.world.layout.giftShopX
      if (x === null || this.giftShop || !this.scenery) return
      this.giftShop = createGiftShop(this, deps.assets, this.scenery, x)
      this.giftShopSigns = new GiftShopSigns(deps.overlayHost, this.giftShop.marks, GIFT_SHOP_URL)
    }

    private raiseGuestBoard(): void {
      const x = this.world.layout.guestBoardX
      if (x === null || this.guestBoard || !this.scenery) return
      const board = createGuestBoard(this, deps.assets, this.scenery, x)
      this.guestBoard = board
      this.funZoneSign = new FunZoneSign(deps.overlayHost, board.signMark)
      this.sitting = createSitting(this.scenery, board, deps.traversal, this.character, () => this.helm, {
        prepare: () => deps.sound().prepare('jump'),
        hop: () => deps.sound().play('jump'),
      })
      const layer = deps.guestBoardNotesHost
      if (layer) this.guestBoardNotes = new GuestBoardNotes(layer, board.mark)
      deps.onGuestBoardHung()
    }

    private raiseComingSoon(): void {
      const x = this.world.layout.comingSoonX
      if (x === null || this.comingSoon || !this.scenery) return
      this.comingSoon = createComingSoon(this, deps.assets, this.scenery, x)
      this.comingSoonNote = new ComingSoonNote(deps.overlayHost, this.comingSoon.noteMark)
    }

    private raiseCafe(): void {
      const x = this.world.layout.cafeX
      if (x === null || this.cafe || !this.scenery) return
      this.cafe = createCafe(this, this.scenery, x)
      this.cafeLink = new CafeLink(deps.overlayHost, this.cafe.marks, CAFE_URL)
    }

    private openingReady(now: number): boolean {
      if (now - this.openingStart > OPENING_MAX_WAIT_MS) return true
      const { loaded, total } = this.world.stats()
      return this.fontsReady && loaded >= Math.min(1, total)
    }

    private recordProgress(cameraX: number): void {
      const { cafeX, guestBoardX, giftShopX } = this.world.layout
      const reached = (x: number | null) => x !== null && cameraX >= x - VIEWED_WITHIN_UNITS
      if (reached(cafeX)) reachLandmark('cafe')
      if (reached(guestBoardX)) reachLandmark('guest_board')
      if (reached(giftShopX)) reachLandmark('gift_shop')
    }

    private recordDisplayView(cameraX: number): void {
      let nearest: MountedDisplay | null = null
      let nearestDistance = Infinity
      for (const mounted of this.world.getMounted()) {
        const distance = Math.abs(mounted.centerX - cameraX)
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearest = mounted
        }
      }
      if (!nearest || nearestDistance >= VIEWED_WITHIN_UNITS) return
      if (this.viewedDisplays.has(nearest.index)) return

      this.viewedDisplays.add(nearest.index)
      reachPainting(nearest.index + 1)
      void fetch('/api/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'display_view', artistId: nearest.display.artistId }),
      }).catch(() => {})
    }

    update(time: number): void {
      const frameMs = time - this.lastFrameAt
      this.lastFrameAt = time
      // A capped loop's long frames are not a slow device; the first frame after the cap lifts spans it too.
      if (this.throttledFrames === 0) deps.governor.sample(frameMs, time - this.readyAt > SETTLE_AFTER_READY_MS)
      else this.throttledFrames -= 1
      const dt = Math.min(0.05, Math.max(0, frameMs / 1000))

      if (!this.isReady) {
        if (this.openingReady(time)) {
          this.isReady = true
          this.readyAt = time
          deps.runtime.ready = true
          deps.onReady()
          deps.traversal.playIntro(CONFIG.lobby.startX - CONFIG.lobby.introWalk, CONFIG.lobby.startX)
        }
      } else {
        deps.traversal.setSuspended(deps.isSuspended())
        deps.traversal.update(dt, this.world.layout.totalLength)
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

      const cameraX = deps.traversal.cameraX
      const camera = this.cameras.main
      const at = phaserCamera(cameraX, deps.runtime.view, deps.runtime.density)
      camera.setOrigin(0, 0)
      camera.setZoom(at.zoom)
      camera.setScroll(at.scrollX, at.scrollY)
      this.backdrop?.sync(deps.traversal.cameraX, deps.runtime.view)

      const projector = new ViewProjector(cameraX, deps.runtime.view, deps.runtime.viewport)
      this.sitting?.update(dt, cameraX, deps.runtime.view.viewWidth / 2)
      this.character.update(dt, deps.traversal.x, deps.traversal.walkVelocity, projector)
      this.helm?.update(dt, this.character, projector)
      this.matcha?.update(dt, this.character, projector)
      deps.sound().setWalking(Math.abs(deps.traversal.walkVelocity) > WALKING_SPEED)

      this.world.update(time, dt, cameraX)
      if (!deps.isSuspended()) this.world.releaseCoin()

      this.raiseGiftShop()
      this.raiseGuestBoard()
      this.raiseCafe()
      this.raiseComingSoon()

      const mounted = this.world.getMounted() as unknown as Parameters<Placards['sync']>[0]
      this.placards?.sync(mounted, projector)
      this.lobbySigns?.sync(projector)
      this.giftShopSigns?.sync(projector)
      this.cafeLink?.sync(projector)
      this.guestBoardNotes?.sync(projector)
      this.funZoneSign?.sync(projector)
      this.comingSoonNote?.sync(projector)
      this.occlusion.update(this.character.bunny())

      this.lobby?.update(dt, cameraX)
      const cafeX = this.world.layout.cafeX
      const nearCafe =
        cafeX !== null && Math.abs(cafeX - cameraX) < CONFIG.virtualization.loadRadiusUnits
      if (nearCafe) deps.sound().prepare('cafe-hello')
      for (const voice of this.world.nearbyVoices()) deps.sound().prepare(voice)
      this.cafe?.update(dt, cameraX)

      deps.runtime.known = this.world.layout.known
      if (this.world.needsMore(cameraX)) {
        this.sliceFeed.maybeFetch(this.world.epochId, this.world.nextIndex)
      }
      if (time - this.lastViewCheck >= VIEW_CHECK_MS) {
        this.lastViewCheck = time
        this.recordDisplayView(cameraX)
        this.recordProgress(cameraX)
      }

      const quiet = deps.isSuspended() || deps.traversal.idleSeconds > QUIET_AFTER_SECONDS
      const limit = quiet ? 30 : 0
      if (this.game.loop.fpsLimit !== limit) {
        const loop = this.game.loop
        queueMicrotask(() => {
          if (!this.isDisposed) loop.setFPSLimit(limit)
        })
      }
      if (limit !== 0) this.throttledFrames = 2
      if (deps.isSuspended()) this.game.loop.sleep()
    }

    private disposeAll(): void {
      this.occlusion.clear()
      this.isDisposed = true
      deps.runtime.world = null
      deps.runtime.tapWorld = null
      deps.runtime.character = null
      deps.runtime.act = null
      deps.runtime.dispose = null
      window.clearInterval(this.sceneryGate)
      this.sceneryGate = 0
      deps.sound().setWalking(false)
      this.placards?.clear()
      this.lobbySigns?.clear()
      this.giftShopSigns?.clear()
      this.cafeLink?.clear()
      this.guestBoardNotes?.clear()
      this.funZoneSign?.clear()
      this.comingSoonNote?.clear()
      this.world?.dispose()
      this.lobby?.dispose()
      this.giftShop?.dispose()
      this.sitting?.dispose()
      this.character?.dispose()
      this.guestBoard?.dispose()
      this.cafe?.dispose()
      this.comingSoon?.dispose()
      this.backdrop?.dispose()
      this.helm?.dispose()
      this.matcha?.dispose()
      this.scenery?.dispose(this)
    }
  }
}
