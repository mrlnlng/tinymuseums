import type * as THREE from 'three'
import type { HallSliceDto } from '@tiny/core'
import type { Item } from '@tiny/core/presence/wire'
import { outfit } from '@tiny/core/slots'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import { earn, getWalletSnapshot, subscribeWallet } from '@/features/economy/store'
import { loadScenery, type Scenery } from '@/features/hall/scene/assets'
import { createHallAmbience } from '@/features/hall/scene/ambience'
import { createBackdrop } from '@/features/hall/scene/backdrop'
import { createCafe, type Cafe } from '@/features/hall/scene/cafe'
import { CONFIG, centerYFor } from '@/features/hall/scene/config'
import { createDoorPetals, type DoorPetals } from '@/features/hall/scene/petals'
import { createGiftShop, type GiftShop } from '@/features/hall/scene/giftshop'
import { createGuestBoard, type GuestBoard } from '@/features/hall/scene/guestboard'
import { createHelm, type Helm } from '@/features/hall/scene/helm'
import { GALLERY_DOOR } from '@/features/hall/scene/gallery-door'
import { createLobby } from '@/features/hall/scene/lobby'
import { createHallDoors, createLobbyPillar } from '@/features/hall/scene/lobby-gallery-door'
import { createMatcha, type Matcha } from '@/features/hall/scene/matcha'
import {
  CafeLink,
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
import { hallRoomInfo } from '@/features/npcs/room-places'
import type { Room } from '@/features/presence/lib/join-room'
import { defaultStore } from '@/shared/lib/slots'
import { reachLandmark, reachPainting, track } from '@/shared/lib/visit'
import type { HallArt } from '../art'
import { doorName, doorWidth, type DoorGuide, type DoorRoom } from '@tiny/core/rooms'
import { createDoorGuides } from '@/features/hall/scene/door-guide'
import { doorDefs, doorsOf } from '../doors'
import type { Interaction, JoinedContents, JoinedRoom, RoomDef } from '../types'
import { hallIsReady } from './opening'


const SCENERY_MAX_WAIT_MS = 5000
const VIEWED_WITHIN_UNITS = 3.0

const GIFT_SHOP_URL = 'https://www.inspiratiq.art/'

const CAFE_URL = 'https://buymeacoffee.com/inspiratiq'

export interface OpenPiece {
  slug: string
  artistId: string
  pieceId: string
}

/** A conversation with the guide keeping a door; `go` takes the visitor through it. */
export interface GuideTalk {
  guide: DoorGuide
  to: DoorRoom
  go(): void
}

export interface HallCallbacks {
  onOpenPiece(piece: OpenPiece): void
  onTalkToGuide(talk: GuideTalk): void
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

/** Where a guide beside a door set into the wall stands: just in front of the wall's foot. */
const GUIDE_AT_WALL = -0.08

/** A guest's guide mentions the room they could open for themselves. */
const ACCOUNT_INVITE = 'Psst, you can have your very own room here! Make an account to open it.'

function withAccountInvite(guide: DoorGuide): DoorGuide {
  if (defaultStore().getMemberSnapshot() !== null || guide.lines.includes(ACCOUNT_INVITE)) return guide
  return { ...guide, lines: [...guide.lines, ACCOUNT_INVITE] }
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
    doors: doorDefs('hall'),

    initialLook() {
      return ownedLook(lookOf(defaultStore().getSlot(outfit).snapshot()), getWalletSnapshot())
    },

    build(ctx, { assets, door, doorArt, pillar, renderer }) {
      const callbacks = () => options.callbacks()
      const scene = ctx.scene
      const overlayHost = ctx.overlay
      const characterHost = ctx.characterHost
      const traversal = ctx.traversal
      let disposed = false
      let presence: Room | null = null

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const backdrop = createBackdrop(scene, assets)
      const ambience = createHallAmbience(scene, backdrop, reducedMotion)
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

      function enterDoor(id: string): void {
        if (ctx.isQuiet() || traversal.isIntro) return
        track('stairs')
        ctx.sound.play('click')
        ctx.leave(id)
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

      const tapWith = (phase: 'hover' | 'tap' | undefined, tap: () => boolean): Interaction | null =>
        phase === 'tap' && !traversal.isIntro ? { silent: true, activate: tap } : null

      function entranceRoom(): JoinedContents {
        const lobby = createLobby(scene, assets)
        const signs = new LobbySigns(overlayHost, lobby.marks)
        const lobbyPillar = createLobbyPillar(scene, pillar)
        function tap(raycaster: THREE.Raycaster): boolean {
          if (lobby.hitTestDoor(raycaster)) {
            track('leave')
            ctx.sound.play('click')
            callbacks().onLeave()
            return true
          }
          if (lobby.hitTestCat(raycaster)) {
            track('help')
            earn('secret', { feature: 'help' })
            ctx.sound.play('open')
            callbacks().onOpenHelp()
            return true
          }
          return false
        }
        return {
          hitTest: (raycaster, phase) => tapWith(phase, () => tap(raycaster)),
          update(frame) {
            signs.sync(frame.camera, frame.viewport)
            lobby.update(frame.dt, traversal.cameraX)
          },
          dispose() {
            signs.clear()
            lobbyPillar.dispose()
            lobby.dispose()
          },
        }
      }

      /** A gallery holds the hall's paintings; nothing else is hung in it now. */
      function galleryRoom(key: string): JoinedContents {
        hall.setGalleryBuilt(key, true)
        return {
          hitTest: () => null,
          update() {},
          dispose() {
            hall.setGalleryBuilt(key, false)
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
            ctx.sound.play('open')
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
            ctx.sound.play('open')
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

      /** A part of the hall with the doors standing in it, which are tried before anything else there. */
      function buildRoom(room: HallRoomSpan): JoinedContents {
        const standing = doorsOf('hall').filter(({ x }) => x >= room.startX && x < room.endX)
        const inside = standing
          .map((d) => ({ id: d.id, x: d.x, label: d.label, name: doorName(d), scale: d.scale, image: doorArt[d.style] ?? door, locked: d.guide !== null, inset: d.under }))
        const contents = buildRoomContents(room)
        if (inside.length === 0) return contents
        const doors = createHallDoors(scene, overlayHost, enterDoor, inside, assets)
        // A few petals drift in front of the door to the pond, so it catches the eye.
        const petals: DoorPetals[] = standing
          .filter((d) => d.to === 'pond')
          .map((d) => createDoorPetals(
            scene,
            {
              x: d.x,
              width: doorWidth(d),
              base: GALLERY_DOOR.lobbyBase,
              height: GALLERY_DOOR.height * d.scale,
            },
            reducedMotion,
          ))
        // A guide stands just past their door's right-hand post, feet level with the door's: at the
        // wall for a door set into it, out on the floor for one standing there.
        const guides = createDoorGuides(
          overlayHost,
          standing.flatMap((d) => (d.guide ? [{
            door: d.id,
            npc: d.guide.npc,
            x: d.x + doorWidth(d) / 2 + 0.22,
            floorY: d.under ? GUIDE_AT_WALL : GALLERY_DOOR.lobbyBase,
          }] : [])),
          (id) => {
            const kept = doorsOf('hall').find((d) => d.id === id)
            if (!kept?.guide || ctx.isQuiet() || traversal.isIntro) return
            ctx.sound.play('chat')
            callbacks().onTalkToGuide({ guide: withAccountInvite(kept.guide), to: kept.to, go: () => enterDoor(id) })
          },
        )
        return {
          ...contents,
          hitTest(raycaster, phase) {
            const through = doors.hitTest(raycaster)
            if (through) return tapWith(phase, () => { enterDoor(through); return true })
            return contents.hitTest(raycaster, phase)
          },
          update(frame) {
            doors.sync(frame.camera, frame.viewport, !ctx.isQuiet() && !traversal.isIntro)
            guides.sync(frame.camera, frame.viewport, !ctx.isQuiet() && !traversal.isIntro, traversal.x)
            for (const petal of petals) petal.update(frame.now, frame.dt)
            contents.update(frame)
          },
          dispose() {
            for (const petal of petals) petal.dispose()
            guides.dispose()
            doors.dispose()
            contents.dispose()
          },
        }
      }

      function buildRoomContents(room: HallRoomSpan): JoinedContents {
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
        // Nothing nearby left to load (as at a narrow entrance) needs no waiting for.
        const nearestReady = loaded >= Math.min(2, total) || (hall.viewArt(traversal.cameraX, ctx.rig.viewWidth) !== 'pending' && hall.pendingLoads === 0)
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
      let wasAirborne = false

      const openingStart = performance.now()
      let fontsReady = false
      void document.fonts.ready.then(() => { fontsReady = true })

      return {
        floor: { kind: 'strip', minX: CONFIG.lobby.minX, maxX: () => hall.layout.totalLength },
        npc: { info: () => hallRoomInfo(hall.layout, GALLERY_DOOR.lobbyX) },
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
          // One hall room for everyone: epochs reseal on every publish, which split visitors who loaded
          // before and after. "e0" keeps the name the deployed room server already accepts.
          key: 'hall-e0',
          pose: () => ({ sit: sitting?.seated ?? false, helm: helm?.worn ?? false, cup: matcha?.held ?? false }),
          scenery: () =>
            scenery && {
              seat: guestBoard ? { ...guestBoard.seat, plain: scenery.bunnySit.plain, helm: scenery.bunnySit.helm } : undefined,
              helm: { image: scenery.helm, attachment: CONFIG.helm.worn },
              cup: { image: scenery.matcha, attachment: CONFIG.matcha.held },
            },
        },

        isReady(now) {
          return hallIsReady({
            waitedMs: now - openingStart,
            viaDoor: ctx.arrival.kind === 'door',
            warm: ctx.warm,
            fontsReady,
            art: hall.viewArt(traversal.cameraX, ctx.rig.viewWidth),
          })
        },

        isBusy: () => hall.isFading(),

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

          const viewTop = centerYFor(ctx.rig.frustumHeight) + ctx.rig.frustumHeight / 2
          backdrop.update(traversal.cameraX, ctx.rig.viewWidth, viewTop)
          const airborne = traversal.isAirborne
          if (wasAirborne && !airborne) {
            ambience.puff(traversal.x, CONFIG.character.centerY - CONFIG.character.height / 2 + 0.06)
          }
          wasAirborne = airborne
          ambience.update(frame.now, frame.dt, frame.camera, viewTop)
          hall.update(frame.now, frame.dt, traversal.cameraX)
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
          ambience.dispose()
          backdrop.dispose()
          helm?.dispose()
          matcha?.dispose()
          scenery?.dispose()
        },
      }
    },
  }
}
