'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { HallSliceDto } from '@tiny/core'
import { loadAssets, loadScenery, type Assets, type Scenery } from '@/features/hall/scene/assets'
import { createBackdrop } from '@/features/hall/scene/backdrop'
import { CameraRig } from '@/features/hall/scene/cameras'
import { createCafe, type Cafe } from '@/features/hall/scene/cafe'
import { createCharacter } from '@/features/hall/scene/character'
import { createComingSoon, type ComingSoon } from '@/features/hall/scene/comingsoon'
import { CONFIG } from '@/features/hall/scene/config'
import { createGiftShop, type GiftShop } from '@/features/hall/scene/giftshop'
import { createGuestBoard, type GuestBoard } from '@/features/hall/scene/guestboard'
import { createHelm, type Helm } from '@/features/hall/scene/helm'
import type { WorldPoint } from '@/features/hall/scene/hit'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import { createLobby } from '@/features/hall/scene/lobby'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
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
import { HallScene } from '@/features/hall/scene/scene'
import { createSitting, type Sitting } from '@/features/hall/scene/sitting'
import { routeTap, type TapWorld } from '@/features/hall/scene/tap'
import { Traversal } from '@/features/hall/scene/traversal'
import { useSound } from '@/features/sound/components/SoundProvider'
import { reachLandmark, reachPainting, track } from '@/shared/lib/visit'

const BACKDROP_LENGTH = 600

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600
const SCENERY_MAX_WAIT_MS = 5000
const OPENING_MAX_WAIT_MS = 5000
const QUIET_AFTER_SECONDS = 2
const SETTLE_AFTER_READY_MS = 3000

const VIEWED_WITHIN_UNITS = 3.0

const WALKING_SPEED = 0.12

const GIFT_SHOP_URL = 'https://www.inspiratiq.art/'

const CAFE_URL = 'https://buymeacoffee.com/inspiratiq'

export interface OpenPiece {
  slug: string
  artistId: string
  pieceId: string
}

export interface HallHosts {
  canvas: React.RefObject<HTMLDivElement | null>
  overlay: React.RefObject<HTMLDivElement | null>
  character: React.RefObject<HTMLDivElement | null>
  guestBoardNotes: React.RefObject<HTMLDivElement | null>
}

interface Options {
  hosts: HallHosts
  initialSlice: HallSliceDto
  isSuspended: boolean
  onOpenPiece: (piece: OpenPiece) => void
  onLeave: () => void
  onOpenHelp: () => void
  onFindCoin: () => void
  onOpenGuestBoard: () => void
  onGuestBoardHung: () => void
  onIntroDone: () => void
  onFirstMove: () => void
  onOpenSketchGame: () => void
}

export function useHallScene({
  hosts,
  initialSlice,
  isSuspended,
  onOpenPiece,
  onLeave,
  onOpenHelp,
  onFindCoin,
  onOpenGuestBoard,
  onGuestBoardHung,
  onIntroDone,
  onFirstMove,
  onOpenSketchGame,
}: Options) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // The scene is built once, so anything the frame loop reads that can change is held in a ref.
  const isReadyRef = useRef(false)
  const isSuspendedRef = useRef(isSuspended)
  isSuspendedRef.current = isSuspended

  const sound = useSound()
  const soundRef = useRef(sound)
  soundRef.current = sound

  const onOpenPieceRef = useRef(onOpenPiece)
  onOpenPieceRef.current = onOpenPiece

  const onLeaveRef = useRef(onLeave)
  onLeaveRef.current = onLeave

  const onOpenHelpRef = useRef(onOpenHelp)
  onOpenHelpRef.current = onOpenHelp

  const onFindCoinRef = useRef(onFindCoin)
  onFindCoinRef.current = onFindCoin

  const onOpenGuestBoardRef = useRef(onOpenGuestBoard)
  onOpenGuestBoardRef.current = onOpenGuestBoard

  const onGuestBoardHungRef = useRef(onGuestBoardHung)
  onGuestBoardHungRef.current = onGuestBoardHung

  const onIntroDoneRef = useRef(onIntroDone)
  onIntroDoneRef.current = onIntroDone

  const onFirstMoveRef = useRef(onFirstMove)
  onFirstMoveRef.current = onFirstMove

  const onOpenSketchGameRef = useRef(onOpenSketchGame)
  onOpenSketchGameRef.current = onOpenSketchGame

  useEffect(() => {
    let isDisposed = false
    let teardown = () => {}

    async function buildScene(): Promise<void> {
      const canvasHost = hosts.canvas.current
      const overlayHost = hosts.overlay.current
      const characterHost = hosts.character.current
      if (!canvasHost || !overlayHost || !characterHost) return

      const renderer = new THREE.WebGLRenderer({ antialias: false })
      let assets: Assets
      try {
        assets = await loadAssets(renderer)
      } catch (loadError) {
        renderer.dispose()
        if (!isDisposed) setError((loadError as Error).message)
        return
      }
      if (isDisposed) {
        renderer.dispose()
        return
      }

      const pixelRatio = createPixelRatioGovernor(renderer, window.devicePixelRatio)
      renderer.setClearColor(new THREE.Color(assets.manifest.room.wallColor))
      renderer.domElement.className = 'hall-canvas'
      canvasHost.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const backdrop = createBackdrop(scene, assets, BACKDROP_LENGTH)
      const lobby = createLobby(scene, assets)
      const hall = new HallScene(scene, assets)
      hall.ingestSlice(initialSlice)
      hall.onTextureReady = (texture) => renderer.initTexture(texture)

      const character = createCharacter(assets, characterHost)
      const placards = new Placards(overlayHost)
      const lobbySigns = new LobbySigns(overlayHost, lobby.marks)
      const traversal = new Traversal()
      traversal.attach(renderer.domElement)

      let viewport: Viewport = { width: 1, height: 1, left: 0, top: 0 }
      const rig = new CameraRig(1, 1)

      function applyViewport(): void {
        const host = hosts.canvas.current
        if (!host) return
        const rect = host.getBoundingClientRect()
        const width = Math.max(1, Math.round(rect.width))
        const height = Math.max(1, Math.round(rect.height))
        if (width === viewport.width && height === viewport.height) return

        viewport = { width, height, left: 0, top: 0 }
        renderer.setSize(width, height)
        rig.resize(width, height)
        traversal.setWorldPerPixel(rig.viewWidth / width)
      }

      applyViewport()
      const resizeObserver = new ResizeObserver(applyViewport)
      resizeObserver.observe(canvasHost)

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
          character,
          () => helm,
          {
            prepare: () => soundRef.current.prepare('jump'),
            hop: () => soundRef.current.play('jump'),
          },
        )
        const layer = hosts.guestBoardNotes.current
        if (layer) guestBoardNotes = new GuestBoardNotes(layer, guestBoard.mark)
        onGuestBoardHungRef.current()
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
            if (isDisposed) {
              loaded.dispose()
              return
            }
            scenery = loaded
            helm = createHelm(loaded, characterHost, hall)
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

      let pressX = 0
      let pressY = 0
      let pressedAt = 0
      let isTap = false

      function worldPoint(event: MouseEvent): WorldPoint {
        const rect = renderer.domElement.getBoundingClientRect()
        return rig.projector(viewport).toWorld(event.clientX - rect.left, event.clientY - rect.top)
      }

      const tapWorld: TapWorld = {
        hitDoor: (point) => lobby.hitTestDoorAt(point),
        hitLobbyCat: (point) => lobby.hitTestCatAt(point),
        hitCoin: (point) => hall.hitTestCoinAt(point),
        hitPainting: (point) => {
          const hit = hall.hitTestAt(point)
          if (!hit) return null
          return { slug: hit.mounted.display.slug, artistId: hit.mounted.display.artistId, pieceId: hit.pieceId }
        },
        hitPedestal: (point) => hall.hitTestPedestalAt(point),
        acceptsHelm: (pedestal) => helm?.accepts(pedestal) ?? false,
        hitMatcha: (point) => matcha !== null && (cafe?.hitTestMatchaAt(point) ?? false),
        hitCafeCat: (point) => cafe?.hitTestCatAt(point) ?? false,
        hitDesktop: (point) => guestBoard?.hitTestDesktopAt(point) ?? false,
        hitBeanbag: (point) => sitting !== null && (guestBoard?.hitTestBeanbagAt(point, sitting.occupied) ?? false),
        hitGuestBoard: (point) => guestBoard?.hitTestAt(point) ?? false,
      }

      function handlePointerDown(event: PointerEvent): void {
        isTap = false
        soundRef.current.prepare('jump')
        pressX = event.clientX
        pressY = event.clientY
        pressedAt = performance.now()

        if (isSuspendedRef.current || traversal.isIntro) return
        const hit = hall.hitTestAt(worldPoint(event))
        if (hit) loadArtistPieces(hit.mounted.display.slug).catch(() => {})
      }

      function handlePointerUp(event: PointerEvent): void {
        const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
        const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
        const tooSlow = performance.now() - pressedAt > TAP_TIMEOUT_MS
        isTap = !(moved > slop || tooSlow || isSuspendedRef.current || traversal.isIntro)
      }

      // Taps act on click, not pointerup: on touch screens the browser's click lands on
      // whatever is under the finger afterwards, so an overlay opened on pointerup would
      // receive that click on its close-on-tap scrim and shut straight away.
      function handleClick(event: MouseEvent): void {
        if (!isTap) return
        isTap = false

        const intent = routeTap(worldPoint(event), tapWorld)
        if (!intent) return

        switch (intent.kind) {
          case 'leave':
            track('leave')
            soundRef.current.play('click')
            onLeaveRef.current()
            return

          case 'help':
            track('help')
            soundRef.current.play('click')
            onOpenHelpRef.current()
            return

          case 'coin':
            hall.markCoinFound()
            track('coin')
            soundRef.current.play('coin')
            onFindCoinRef.current()
            return

          case 'painting':
            track('painting')
            soundRef.current.play('painting-open')
            onOpenPieceRef.current({
              slug: intent.slug,
              artistId: intent.artistId,
              pieceId: intent.pieceId,
            })
            return

          case 'helm':
            helm?.take(intent.pedestal)
            track('helm')
            return

          case 'statue':
            track('statue')
            if (intent.pedestal.voice) soundRef.current.play(intent.pedestal.voice)
            intent.pedestal.chime()
            return

          case 'matcha':
            matcha?.toggle()
            track('matcha')
            soundRef.current.play('click')
            return

          case 'cafe-cat':
            track('cafe_cat')
            soundRef.current.play('cafe-hello')
            return

          case 'sketch':
            track('sketch_open')
            soundRef.current.play('click')
            onOpenSketchGameRef.current()
            return

          case 'beanbag':
            sitting?.act()
            track('beanbag')
            soundRef.current.play('click')
            return

          case 'guest-board':
            track('guest_board')
            soundRef.current.play('click')
            onOpenGuestBoardRef.current()
            return
        }
      }

      renderer.domElement.addEventListener('pointerdown', handlePointerDown)
      renderer.domElement.addEventListener('pointerup', handlePointerUp)
      renderer.domElement.addEventListener('click', handleClick)

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

      let fontsReady = false
      void document.fonts.ready.then(() => {
        fontsReady = true
      })
      const openingStart = performance.now()

      // OPENING_MAX_WAIT_MS keeps a slow painting from holding the curtain down.
      function openingReady(now: number): boolean {
        if (now - openingStart > OPENING_MAX_WAIT_MS) return true
        const { loaded, total } = hall.stats()
        return fontsReady && loaded >= Math.min(1, total)
      }

      let frameHandle = 0
      let frameCount = 0
      let lastFrameAt = performance.now()
      let readyAt = Infinity
      let restX: number | null = null
      let hasMoved = false

      function renderFrame(now: number): void {
        frameHandle = requestAnimationFrame(renderFrame)
        pixelRatio.sample(now - lastFrameAt, now - readyAt > SETTLE_AFTER_READY_MS)
        const dt = Math.min(0.05, Math.max(0, (now - lastFrameAt) / 1000))
        lastFrameAt = now

        if (!isReadyRef.current) {
          if (openingReady(now)) {
            isReadyRef.current = true
            readyAt = now
            setIsReady(true)
            traversal.playIntro(introStart, entrance)
          }
        } else {
          traversal.setSuspended(isSuspendedRef.current)
          traversal.update(dt, hall.layout.totalLength)
        }

        if (restX === null && !traversal.isIntro) {
          restX = traversal.cameraX
          onIntroDoneRef.current()
        } else if (restX !== null && !hasMoved && Math.abs(traversal.cameraX - restX) > 0.05) {
          hasMoved = true
          onFirstMoveRef.current()
        }

        rig.sync(traversal.cameraX)
        const projector = rig.projector(viewport)
        sitting?.update(dt, traversal.cameraX, rig.viewWidth / 2)
        character.update(dt, traversal.x, traversal.walkVelocity, projector)
        helm?.update(dt, character, projector)
        matcha?.update(dt, character, projector)
        soundRef.current.setWalking(Math.abs(traversal.walkVelocity) > WALKING_SPEED)

        hall.update(now, dt, traversal.cameraX)
        if (!isSuspendedRef.current) hall.releaseCoin()
        raiseGiftShop()
        raiseGuestBoard()
        raiseCafe()
        raiseComingSoon()
        placards.sync(hall.getMounted(), projector)
        lobbySigns.sync(projector)
        giftShopSigns?.sync(projector)
        cafeLink?.sync(projector)
        guestBoardNotes?.sync(projector)
        funZoneSign?.sync(projector)
        comingSoonNote?.sync(projector)

        lobby.update(dt, traversal.cameraX)
        const cafeX = hall.layout.cafeX
        const nearCafe =
          cafeX !== null && Math.abs(cafeX - traversal.cameraX) < CONFIG.virtualization.loadRadiusUnits
        if (nearCafe) soundRef.current.prepare('cafe-hello')
        for (const voice of hall.nearbyVoices()) soundRef.current.prepare(voice)
        cafe?.update(dt, traversal.cameraX)

        if (hall.needsMore(traversal.cameraX)) void fetchNextSlice()
        if (now - lastViewCheck >= VIEW_CHECK_MS) {
          lastViewCheck = now
          recordDisplayView(traversal.cameraX)
          recordProgress(traversal.cameraX)
        }

        const quiet = isSuspendedRef.current || traversal.idleSeconds > QUIET_AFTER_SECONDS
        frameCount += 1
        if (quiet && frameCount % 2 === 1) return
        renderer.render(scene, rig.camera)
      }

      frameHandle = requestAnimationFrame(renderFrame)

      teardown = () => {
        window.clearInterval(sceneryGate)
        cancelAnimationFrame(frameHandle)
        soundRef.current.setWalking(false)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
        renderer.domElement.removeEventListener('pointerup', handlePointerUp)
        renderer.domElement.removeEventListener('click', handleClick)
        placards.clear()
        lobbySigns.clear()
        giftShopSigns?.clear()
        cafeLink?.clear()
        guestBoardNotes?.clear()
        funZoneSign?.clear()
        comingSoonNote?.clear()
        hall.dispose()
        lobby.dispose()
        giftShop?.dispose()
        sitting?.dispose()
        guestBoard?.dispose()
        cafe?.dispose()
        comingSoon?.dispose()
        backdrop.dispose()
        helm?.dispose()
        matcha?.dispose()
        scenery?.dispose()
        character.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    void buildScene()

    return () => {
      isDisposed = true
      teardown()
    }
  }, [])

  return { isReady, error }
}
