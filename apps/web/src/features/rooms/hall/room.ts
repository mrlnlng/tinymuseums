import type * as THREE from 'three'
import type { HallSliceDto } from '@tiny/core'
import type { Item } from '@tiny/core/presence/wire'
import { outfit } from '@tiny/core/slots'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import { earn, getWalletSnapshot, subscribeWallet } from '@/features/economy/store'
import { loadScenery, type Scenery } from '@/features/hall/scene/assets'
import { createBackdrop } from '@/features/hall/scene/backdrop'
import { createCafe, type Cafe } from '@/features/hall/scene/cafe'
import { createComingSoon, type ComingSoon } from '@/features/hall/scene/comingsoon'
import { CONFIG, centerYFor } from '@/features/hall/scene/config'
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
import type { HallLayout, HallRoomSpan } from '@/features/hall/scene/layout'
import { HallScene } from '@/features/hall/scene/scene'
import { createSitting, type Sitting } from '@/features/hall/scene/sitting'
import { followOutfit, lookOf, ownedLook } from '@/features/hall/scene/wardrobe'
import type { Room } from '@/features/presence/lib/join-room'
import { defaultStore } from '@/shared/lib/slots'
import { reachLandmark, reachPainting, track } from '@/shared/lib/visit'
import type { HallArt } from '../art'
import type { Interaction, JoinedContents, JoinedRoom, RoomDef } from '../types'


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

/** A hall room's name on the map. */
function mapLabel(room: HallRoomSpan): string {
  if (room.kind === 'gallery') return `Gallery ${room.key.slice('gallery-'.length)}`
  return { entrance: 'The entrance', cafe: 'The café', giftShop: 'The gift shop' }[room.kind]
}

export function createHallRoom(options: HallRoomOptions): RoomDef<HallArt> {
  return {
    id: 'hall',
    gatesItself: true,
    clearColor: CONFIG.wall.color,
    doors: {
      atelier: { x: GALLERY_DOOR.lobbyX, clearX: GALLERY_DOOR.lobbyX + GALLERY_DOOR.clear, label: 'To the fashion area' },
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

      const backdrop = createBackdrop(scene, assets)
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

      function enterAtelier(): void {
        if (ctx.isQuiet() || traversal.isIntro) return
        track('stairs')
        ctx.sound.play('click')
        ctx.leave('atelier')
      }

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

      // Built by the cafe room; the hall reads them for presence poses, the matcha and the beanbag.
      let cafe: Cafe | null = null
      let guestBoard: GuestBoard | null = null
      let sitting: Sitting | null = null

      /** Gallery rooms built right now; only their paintings and pedestals are kept. */
      const builtGalleries = new Set<string>()
      const near = (x: number): boolean => {
        const room = hall.layout.rooms.find((r) => x >= r.startX && x < r.endX)
        return room !== undefined && builtGalleries.has(room.key)
      }
      const tapWith = (phase: 'hover' | 'tap' | undefined, tap: () => boolean): Interaction | null =>
        phase === 'tap' && !traversal.isIntro ? { silent: true, activate: tap } : null

      function entranceRoom(): JoinedContents {
        const lobby = createLobby(scene, assets)
        const signs = new LobbySigns(overlayHost, lobby.marks)
        const galleryDoor = createLobbyGalleryDoor(scene, overlayHost, enterAtelier, door, pillar, assets)
        function tap(raycaster: THREE.Raycaster): boolean {
          if (galleryDoor.hitTest(raycaster) && !lobby.hitTestDoor(raycaster)) {
            enterAtelier()
            return true
          }
          if (lobby.hitTestDoor(raycaster)) {
            track('leave')
            ctx.sound.play('click')
            callbacks().onLeave()
            return true
          }
          if (lobby.hitTestCat(raycaster)) {
            track('help')
            earn('secret', { feature: 'help' })
            ctx.sound.play('click')
            callbacks().onOpenHelp()
            return true
          }
          return false
        }
        return {
          hitTest: (raycaster, phase) => tapWith(phase, () => tap(raycaster)),
          update(frame) {
            signs.sync(frame.camera, frame.viewport)
            galleryDoor.sync(frame.camera, frame.viewport, !ctx.isQuiet() && !traversal.isIntro)
            lobby.update(frame.dt, traversal.cameraX)
          },
          dispose() {
            signs.clear()
            galleryDoor.dispose()
            lobby.dispose()
          },
        }
      }

      /** A gallery's paintings and pedestals come and go with it through `near`; the last one also holds Coming Soon. */
      function galleryRoom(key: string): JoinedContents {
        builtGalleries.add(key)
        let comingSoon: ComingSoon | null = null
        let note: ComingSoonNote | null = null
        return {
          hitTest: () => null,
          update(frame) {
            const x = hall.layout.comingSoonX
            const span = hall.layout.rooms.find((r) => r.key === key)
            if (!comingSoon && scenery && x !== null && span && x >= span.startX && x < span.endX) {
              comingSoon = createComingSoon(scene, assets, scenery, x)
              note = new ComingSoonNote(overlayHost, comingSoon.noteMark)
            }
            note?.sync(frame.camera, frame.viewport)
          },
          dispose() {
            builtGalleries.delete(key)
            note?.clear()
            comingSoon?.dispose()
          },
        }
      }

      /** The cafe and the guest board beside it, with the beanbag that goes with the board. */
      function cafeRoom(): JoinedContents {
        let link: CafeLink | null = null
        let sign: FunZoneSign | null = null
        let notes: GuestBoardNotes | null = null
        function raise(): void {
          const cafeX = hall.layout.cafeX
          const boardX = hall.layout.guestBoardX
          if (cafe || !scenery || cafeX === null || boardX === null) return
          cafe = createCafe(scene, scenery, cafeX)
          link = new CafeLink(overlayHost, cafe.marks, CAFE_URL)
          guestBoard = createGuestBoard(scene, assets, scenery, boardX)
          sign = new FunZoneSign(overlayHost, guestBoard.signMark)
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
          if (layer) notes = new GuestBoardNotes(layer, guestBoard.mark)
          callbacks().onGuestBoardHung()
        }
        function tap(raycaster: THREE.Raycaster): boolean {
          if (cafe?.hitTestCat(raycaster)) {
            track('cafe_cat')
            earn('secret', { feature: 'cafe_cat' })
            ctx.sound.play('cafe-hello')
            return true
          }
          if (guestBoard?.hitTestDesktop(raycaster)) {
            track('sketch_open')
            ctx.sound.play('click')
            callbacks().onOpenComputer()
            return true
          }
          if (sitting?.tap(raycaster)) {
            track('beanbag')
            earn('secret', { feature: 'beanbag' })
            ctx.sound.play('click')
            return true
          }
          if (guestBoard?.hitTest(raycaster)) {
            track('guest_board')
            ctx.sound.play('click')
            callbacks().onOpenGuestBoard()
            return true
          }
          return false
        }
        return {
          hitTest: (raycaster, phase) => tapWith(phase, () => tap(raycaster)),
          update(frame) {
            raise()
            link?.sync(frame.camera, frame.viewport)
            notes?.sync(frame.camera, frame.viewport)
            sign?.sync(frame.camera, frame.viewport)
            if (cafe) ctx.sound.prepare('cafe-hello')
            cafe?.update(frame.dt, traversal.cameraX)
          },
          dispose() {
            sitting?.dispose()
            link?.clear()
            sign?.clear()
            notes?.clear()
            cafe?.dispose()
            guestBoard?.dispose()
            cafe = null
            guestBoard = null
            sitting = null
          },
        }
      }

      function giftShopRoom(): JoinedContents {
        let giftShop: GiftShop | null = null
        let signs: GiftShopSigns | null = null
        return {
          hitTest: () => null,
          update(frame) {
            const x = hall.layout.giftShopX
            if (!giftShop && scenery && x !== null) {
              giftShop = createGiftShop(scene, assets, scenery, x)
              signs = new GiftShopSigns(overlayHost, giftShop.marks, GIFT_SHOP_URL)
            }
            signs?.sync(frame.camera, frame.viewport)
          },
          dispose() {
            signs?.clear()
            giftShop?.dispose()
          },
        }
      }

      function buildRoom(room: HallRoomSpan): JoinedContents {
        switch (room.kind) {
          case 'entrance':
            return entranceRoom()
          case 'gallery':
            return galleryRoom(room.key)
          case 'cafe':
            return cafeRoom()
          case 'giftShop':
            return giftShopRoom()
        }
      }

      // Rebuilt only when the layout changes, as more paintings arrive.
      let joinedFor: HallLayout | null = null
      let joinedRooms: JoinedRoom[] = []
      function joined(): readonly JoinedRoom[] {
        if (joinedFor === hall.layout) return joinedRooms
        joinedFor = hall.layout
        joinedRooms = hall.layout.rooms.map((room) => ({ ...room, label: mapLabel(room), tint: room.kind, build: () => buildRoom(room) }))
        return joinedRooms
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

      /** Taps on what belongs to the whole hall: paintings, the coin, pedestals and the matcha. */
      function tap(raycaster: THREE.Raycaster): boolean {
        if (hall.hitTestCoin(raycaster)) {
          track('coin')
          earn('coin')
          ctx.sound.play('coin')
          callbacks().onFindCoin()
          return true
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
          return true
        }

        const pedestal = hall.hitTestPedestal(raycaster)
        if (pedestal && helm?.tap(pedestal)) {
          track('helm')
          earn('secret', { feature: 'helm' })
          return true
        }
        if (pedestal?.voice) {
          track('statue')
          earn('secret', { feature: 'statue' })
          ctx.sound.play(pedestal.voice)
          pedestal.chime()
          return true
        }

        if (matcha?.tap(raycaster)) {
          track('matcha')
          earn('secret', { feature: 'matcha' })
          ctx.sound.play('click')
          return true
        }
        return false
      }

      let restX: number | null = null
      let hasMoved = false

      const openingStart = performance.now()
      let fontsReady = false
      void document.fonts.ready.then(() => { fontsReady = true })

      return {
        floor: { kind: 'strip', minX: CONFIG.lobby.minX, maxX: () => hall.layout.totalLength },
        cameraBounds: {
          minX: GALLERY_DOOR.lobbyX - Math.max(
            GALLERY_DOOR.height * door.naturalWidth / door.naturalHeight,
            CONFIG.lobby.sign.width,
          ) / 2 - 0.15,
          maxX: () => {
            const { giftShopX, totalLength } = hall.layout
            if (giftShopX === null) return totalLength
            const { counter, note, sign } = CONFIG.giftShop
            return giftShopX + Math.max(
              counter.dx + counter.height * (scenery?.aspect.giftShop ?? 1) / 2,
              note.dx + note.width / 2,
              sign.dx + sign.width / 2,
            ) + 0.15
          },
        },

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

        hitTest: (raycaster, phase) => tapWith(phase, () => tap(raycaster)),

        joined,

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

          backdrop.update(
            traversal.cameraX,
            ctx.rig.viewWidth,
            centerYFor(ctx.rig.frustumHeight) + ctx.rig.frustumHeight / 2,
          )
          hall.update(frame.now, frame.dt, traversal.cameraX, near)
          if (!ctx.isQuiet()) hall.releaseCoin()
          placards.sync(hall.getMounted(), frame.camera, frame.viewport)
          for (const voice of hall.nearbyVoices()) ctx.sound.prepare(voice)

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
          hall.dispose()
          backdrop.dispose()
          helm?.dispose()
          matcha?.dispose()
          scenery?.dispose()
        },
      }
    },
  }
}
