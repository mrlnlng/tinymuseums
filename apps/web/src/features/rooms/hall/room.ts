import type * as THREE from 'three'
import type { HallSliceDto } from '@tiny/core'
import type { Item } from '@tiny/core/presence/wire'
import { outfit } from '@tiny/core/slots'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import { earn, getWalletSnapshot, subscribeWallet } from '@/features/economy/store'
import { loadScenery, manifest, type Scenery } from '@/features/hall/scene/assets'
import { createBackdrop } from '@/features/hall/scene/backdrop'
import { createCafe, type Cafe } from '@/features/hall/scene/cafe'
import { createComingSoon, type ComingSoon } from '@/features/hall/scene/comingsoon'
import { CONFIG } from '@/features/hall/scene/config'
import { createGiftShop, type GiftShop } from '@/features/hall/scene/giftshop'
import { createGuestBoard, type GuestBoard } from '@/features/hall/scene/guestboard'
import { createHelm, type Helm } from '@/features/hall/scene/helm'
import { GALLERY_DOOR } from '@/features/hall/scene/gallery-door'
import { createLobby } from '@/features/hall/scene/lobby'
import { createLobbyGalleryDoor } from '@/features/hall/scene/lobby-gallery-door'
import { createMatcha, type Matcha } from '@/features/hall/scene/matcha'
import {
  CafeLink,
  ComingSoonNote,
  FunZoneSign,
  GiftShopSigns,
  GuestBoardNotes,
  LobbySigns,
  Placards,
} from '@/features/hall/scene/overlay'
import { HallScene } from '@/features/hall/scene/scene'
import { createSitting, type Sitting } from '@/features/hall/scene/sitting'
import { followOutfit, lookOf, ownedLook } from '@/features/hall/scene/wardrobe'
import type { Room } from '@/features/presence/lib/join-room'
import { defaultStore } from '@/shared/lib/slots'
import { reachLandmark, reachPainting, track } from '@/shared/lib/visit'
import type { HallArt } from '../art'
import type { RoomDef } from '../types'

const BACKDROP_LENGTH = 600

const SCENERY_MAX_WAIT_MS = 5000
const OPENING_MAX_WAIT_MS = 5000
const VIEWED_WITHIN_UNITS = 3.0

const GIFT_SHOP_URL = 'https://www.inspiratiq.art/'

const CAFE_URL = 'https://buymeacoffee.com/inspiratiq'

export interface OpenPiece {
  slug: string
  artistId: string
  pieceId: string
}

export interface HallCallbacks {
  onOpenPiece(piece: OpenPiece): void
  onLeave(): void
  onOpenHelp(): void
  onFindCoin(): void
  onOpenGuestBoard(): void
  onGuestBoardHung(): void
  onIntroDone(): void
  onFirstMove(): void
  onOpenComputer(): void
}

export interface HallRoomOptions {
  initialSlice: HallSliceDto
  guestBoardNotes: () => HTMLElement | null
  callbacks: () => HallCallbacks
}

/** The pedestals whose helmet another visitor is wearing. */
function takenStands(items: Item[]): Set<number> {
  const stands = new Set<number>()
  for (const item of items) if (item.startsWith('helm-')) stands.add(Number(item.slice(5)))
  return stands
}

export function createHallRoom(options: HallRoomOptions): RoomDef<HallArt> {
  return {
    id: 'hall',
    gatesItself: true,
    clearColor: manifest.room.wallColor,
    doors: {
      atelier: { x: GALLERY_DOOR.lobbyX, clearX: GALLERY_DOOR.lobbyX + GALLERY_DOOR.clear },
    },

    initialLook() {
      return ownedLook(lookOf(defaultStore().getSlot(outfit).snapshot()), getWalletSnapshot())
    },

    build(ctx, { assets, door, pillar, renderer }) {
      const callbacks = () => options.callbacks()
      const scene = ctx.scene
      const overlayHost = ctx.overlay
      const characterHost = ctx.characterHost
      const traversal = ctx.traversal
      let disposed = false
      let presence: Room | null = null

      const backdrop = createBackdrop(scene, assets, BACKDROP_LENGTH)
      const lobby = createLobby(scene, assets)
      const hall = new HallScene(scene, assets)
      hall.ingestSlice(options.initialSlice)
      hall.onTextureReady = (texture) => renderer.initTexture(texture)

      const outfitSlot = defaultStore().getSlot(outfit)
      const follower = followOutfit(
        ctx.character,
        outfitSlot,
        () => false,
        () => {},
        (look) => ownedLook(look, getWalletSnapshot()),
      )
      const stopWallet = subscribeWallet(follower.sync)
      const placards = new Placards(overlayHost)
      const lobbySigns = new LobbySigns(overlayHost, lobby.marks)

      function enterAtelier(): void {
        if (ctx.isQuiet() || traversal.isIntro) return
        track('stairs')
        ctx.sound.play('click')
        ctx.leave('atelier')
      }

      const galleryDoor = createLobbyGalleryDoor(scene, overlayHost, enterAtelier, door, pillar, assets)

      const entrance = CONFIG.lobby.startX
      const introStart = entrance - CONFIG.lobby.introWalk
      traversal.reset(entrance)

      let isFetching = false
      let sliceFailures = 0
      let sliceRetryAt = 0

      // needsMore() stays true until a slice lands, so a failure without this
      // backoff would refire the request on every frame.
      async function fetchNextSlice(): Promise<void> {
        if (isFetching || hall.nextIndex === null) return
        if (performance.now() < sliceRetryAt) return
        isFetching = true
        try {
          const response = await fetch(
            `/api/hall?epoch=${hall.epochId}&after=${hall.nextIndex}&limit=${CONFIG.loading.sliceSize}`,
          )
          if (!response.ok) throw new Error(`hall slice ${response.status}`)
          hall.ingestSlice((await response.json()) as HallSliceDto)
          sliceFailures = 0
        } catch {
          sliceFailures += 1
          sliceRetryAt = performance.now() + Math.min(10000, 500 * 2 ** sliceFailures)
        } finally {
          isFetching = false
        }
      }

      let scenery: Scenery | null = null
      let helm: Helm | null = null
      let matcha: Matcha | null = null

      let giftShop: GiftShop | null = null
      let giftShopSigns: GiftShopSigns | null = null

      let cafe: Cafe | null = null
      let cafeLink: CafeLink | null = null

      let guestBoard: GuestBoard | null = null
      let guestBoardNotes: GuestBoardNotes | null = null
      let funZoneSign: FunZoneSign | null = null
      let comingSoon: ComingSoon | null = null
      let comingSoonNote: ComingSoonNote | null = null
      let sitting: Sitting | null = null

      const raiseGiftShop = (): void => {
        const x = hall.layout.giftShopX
        if (x === null || giftShop || !scenery) return
        giftShop = createGiftShop(scene, assets, scenery, x)
        giftShopSigns = new GiftShopSigns(overlayHost, giftShop.marks, GIFT_SHOP_URL)
      }

      const raiseGuestBoard = (): void => {
        const x = hall.layout.guestBoardX
        if (x === null || guestBoard || !scenery) return
        guestBoard = createGuestBoard(scene, assets, scenery, x)
        funZoneSign = new FunZoneSign(overlayHost, guestBoard.signMark)
        sitting = createSitting(
          scenery,
          guestBoard,
          traversal,
          ctx.character,
          () => helm,
          {
            prepare: () => ctx.sound.prepare('jump'),
            hop: () => ctx.sound.play('jump'),
          },
          { taken: () => presence?.taken('seat') ?? false, claim: (on) => presence?.want('seat', on) },
        )
        const layer = options.guestBoardNotes()
        if (layer) guestBoardNotes = new GuestBoardNotes(layer, guestBoard.mark)
        callbacks().onGuestBoardHung()
      }

      const raiseComingSoon = (): void => {
        const x = hall.layout.comingSoonX
        if (x === null || comingSoon || !scenery) return
        comingSoon = createComingSoon(scene, assets, scenery, x)
        comingSoonNote = new ComingSoonNote(overlayHost, comingSoon.noteMark)
      }

      const raiseCafe = (): void => {
        const x = hall.layout.cafeX
        if (x === null || cafe || !scenery) return
        cafe = createCafe(scene, scenery, x)
        cafeLink = new CafeLink(overlayHost, cafe.marks, CAFE_URL)
      }

      const requestScenery = (): void => {
        void loadScenery()
          .then((loaded) => {
            if (disposed) {
              loaded.dispose()
              return
            }
            scenery = loaded
            helm = createHelm(loaded, characterHost, hall, {
              taken: (stand) => presence?.taken(`helm-${stand}`) ?? false,
              claim: (stand, on) => presence?.want(`helm-${stand}`, on),
            })
            matcha = createMatcha(loaded, characterHost, () => cafe)
          })
          .catch(() => {})
      }

      const sceneryWaitStart = performance.now()
      const sceneryGate = window.setInterval(() => {
        const { loaded, total } = hall.stats()
        const nearestReady = loaded >= Math.min(2, total)
        if (!nearestReady && performance.now() - sceneryWaitStart < SCENERY_MAX_WAIT_MS) return
        window.clearInterval(sceneryGate)
        requestScenery()
      }, 250)

      const viewedDisplays = new Set<number>()
      const VIEW_CHECK_MS = 250
      let lastViewCheck = 0

      function recordProgress(cameraX: number): void {
        const { cafeX, guestBoardX, giftShopX } = hall.layout
        const reached = (x: number | null) => x !== null && cameraX >= x - VIEWED_WITHIN_UNITS
        if (reached(cafeX)) reachLandmark('cafe')
        if (reached(guestBoardX)) reachLandmark('guest_board')
        if (reached(giftShopX)) reachLandmark('gift_shop')
      }

      function recordDisplayView(cameraX: number): void {
        let nearest = null
        let nearestDistance = Infinity
        for (const mounted of hall.getMounted()) {
          const distance = Math.abs(mounted.centerX - cameraX)
          if (distance < nearestDistance) {
            nearestDistance = distance
            nearest = mounted
          }
        }
        if (!nearest || nearestDistance >= VIEWED_WITHIN_UNITS) return
        if (viewedDisplays.has(nearest.index)) return

        viewedDisplays.add(nearest.index)
        reachPainting(nearest.index + 1)
        void fetch('/api/events', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ kind: 'display_view', artistId: nearest.display.artistId }),
        }).catch(() => {})
      }

      function tap(raycaster: THREE.Raycaster): void {
        if (galleryDoor.hitTest(raycaster) && !lobby.hitTestDoor(raycaster)) {
          enterAtelier()
          return
        }

        if (lobby.hitTestDoor(raycaster)) {
          track('leave')
          ctx.sound.play('click')
          callbacks().onLeave()
          return
        }

        if (lobby.hitTestCat(raycaster)) {
          track('help')
          earn('secret', { feature: 'help' })
          ctx.sound.play('click')
          callbacks().onOpenHelp()
          return
        }

        if (hall.hitTestCoin(raycaster)) {
          track('coin')
          earn('coin')
          ctx.sound.play('coin')
          callbacks().onFindCoin()
          return
        }

        const hit = hall.hitTest(raycaster)
        if (hit) {
          track('painting')
          earn('art', { pieceId: hit.pieceId })
          ctx.sound.play('painting-open')
          callbacks().onOpenPiece({
            slug: hit.mounted.display.slug,
            artistId: hit.mounted.display.artistId,
            pieceId: hit.pieceId,
          })
          return
        }

        const pedestal = hall.hitTestPedestal(raycaster)
        if (pedestal && helm?.tap(pedestal)) {
          track('helm')
          earn('secret', { feature: 'helm' })
          return
        }
        if (pedestal?.voice) {
          track('statue')
          earn('secret', { feature: 'statue' })
          ctx.sound.play(pedestal.voice)
          pedestal.chime()
          return
        }

        if (matcha?.tap(raycaster)) {
          track('matcha')
          earn('secret', { feature: 'matcha' })
          ctx.sound.play('click')
          return
        }

        if (cafe?.hitTestCat(raycaster)) {
          track('cafe_cat')
          earn('secret', { feature: 'cafe_cat' })
          ctx.sound.play('cafe-hello')
          return
        }

        if (guestBoard?.hitTestDesktop(raycaster)) {
          track('sketch_open')
          ctx.sound.play('click')
          callbacks().onOpenComputer()
          return
        }

        if (sitting?.tap(raycaster)) {
          track('beanbag')
          earn('secret', { feature: 'beanbag' })
          ctx.sound.play('click')
          return
        }

        if (guestBoard?.hitTest(raycaster)) {
          track('guest_board')
          ctx.sound.play('click')
          callbacks().onOpenGuestBoard()
        }
      }

      let restX: number | null = null
      let hasMoved = false

      const openingStart = performance.now()
      let fontsReady = false
      void document.fonts.ready.then(() => { fontsReady = true })

      return {
        floor: { kind: 'strip', minX: CONFIG.lobby.minX, maxX: () => hall.layout.totalLength },

        presence: {
          key: `hall-e${options.initialSlice.epochId}`,
          pose: () => ({ sit: sitting?.seated ?? false, helm: helm?.worn ?? false, cup: matcha?.held ?? false }),
          scenery: () =>
            scenery && {
              seat: guestBoard ? { ...guestBoard.seat, plain: scenery.bunnySit.plain, helm: scenery.bunnySit.helm } : undefined,
              helm: { image: scenery.helm, attachment: CONFIG.helm.worn },
              cup: { image: scenery.matcha, attachment: CONFIG.matcha.held },
            },
        },

        isReady(now) {
          if (ctx.arrival.kind === 'door' && !ctx.warm && now - openingStart < 2800) return false
          if (now - openingStart > OPENING_MAX_WAIT_MS) return true
          const { loaded, total } = hall.stats()
          return fontsReady && loaded >= Math.min(1, total)
        },

        onShown() {
          if (ctx.arrival.kind !== 'opening') return
          traversal.playIntro(introStart, entrance)
          return true
        },

        onJoined(room) {
          presence = room
        },

        pointerDown(raycaster) {
          ctx.sound.prepare('jump')
          if (ctx.isQuiet() || traversal.isIntro) return
          const hit = hall.hitTest(raycaster)
          if (hit) loadArtistPieces(hit.mounted.display.slug).catch(() => {})
        },

        hitTest(raycaster, phase) {
          if (phase !== 'tap' || traversal.isIntro) return null
          return { silent: true, activate: () => tap(raycaster) }
        },

        beforeCharacterUpdate(frame) {
          if (restX === null && !traversal.isIntro) {
            restX = traversal.cameraX
            callbacks().onIntroDone()
          } else if (restX !== null && !hasMoved && !ctx.isQuiet() && Math.abs(traversal.cameraX - restX) > 0.05) {
            hasMoved = true
            callbacks().onFirstMove()
          }
          sitting?.update(frame.dt, traversal.cameraX, ctx.rig.viewWidth / 2)
        },

        update(frame) {
          if (presence) hall.setTakenHelmStands(takenStands(presence.heldByOthers()))
          helm?.update(frame.dt, ctx.character, frame.camera, frame.viewport)
          matcha?.update(frame.dt, ctx.character, frame.camera, frame.viewport)

          hall.update(frame.now, frame.dt, traversal.cameraX)
          if (!ctx.isQuiet()) hall.releaseCoin()
          raiseGiftShop()
          raiseGuestBoard()
          raiseCafe()
          raiseComingSoon()
          placards.sync(hall.getMounted(), frame.camera, frame.viewport)
          lobbySigns.sync(frame.camera, frame.viewport)
          galleryDoor.sync(frame.camera, frame.viewport, !ctx.isQuiet() && !traversal.isIntro)
          giftShopSigns?.sync(frame.camera, frame.viewport)
          cafeLink?.sync(frame.camera, frame.viewport)
          guestBoardNotes?.sync(frame.camera, frame.viewport)
          funZoneSign?.sync(frame.camera, frame.viewport)
          comingSoonNote?.sync(frame.camera, frame.viewport)

          lobby.update(frame.dt, traversal.cameraX)
          const cafeX = hall.layout.cafeX
          const nearCafe =
            cafeX !== null && Math.abs(cafeX - traversal.cameraX) < CONFIG.virtualization.loadRadiusUnits
          if (nearCafe) ctx.sound.prepare('cafe-hello')
          for (const voice of hall.nearbyVoices()) ctx.sound.prepare(voice)
          cafe?.update(frame.dt, traversal.cameraX)

          if (hall.needsMore(traversal.cameraX)) void fetchNextSlice()
          if (frame.now - lastViewCheck >= VIEW_CHECK_MS) {
            lastViewCheck = frame.now
            recordDisplayView(traversal.cameraX)
            recordProgress(traversal.cameraX)
          }
        },

        dispose() {
          disposed = true
          window.clearInterval(sceneryGate)
          stopWallet()
          follower.dispose()
          placards.clear()
          lobbySigns.clear()
          giftShopSigns?.clear()
          cafeLink?.clear()
          guestBoardNotes?.clear()
          funZoneSign?.clear()
          comingSoonNote?.clear()
          hall.dispose()
          lobby.dispose()
          galleryDoor.dispose()
          giftShop?.dispose()
          sitting?.dispose()
          guestBoard?.dispose()
          cafe?.dispose()
          comingSoon?.dispose()
          backdrop.dispose()
          helm?.dispose()
          matcha?.dispose()
          scenery?.dispose()
        },
      }
    },
  }
}
