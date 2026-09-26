'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { HallSliceDto } from '@tiny/core'
import { loadAssets, loadScenery, type Assets, type Scenery } from '@/features/hall/scene/assets'
import { createBackdrop } from '@/features/hall/scene/backdrop'
import { CameraRig } from '@/features/hall/scene/cameras'
import { createCafe, type Cafe } from '@/features/hall/scene/cafe'
import { createCharacter } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import { createGiftShop, type GiftShop } from '@/features/hall/scene/giftshop'
import { createGuestBoard, type GuestBoard } from '@/features/hall/scene/guestboard'
import { createHelm, type Helm } from '@/features/hall/scene/helm'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import { createLobby } from '@/features/hall/scene/lobby'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { createMatcha, type Matcha } from '@/features/hall/scene/matcha'
import {
  CafeLink,
  GiftShopSigns,
  GuestBoardNotes,
  LobbySigns,
  Placards,
  type Viewport,
} from '@/features/hall/scene/overlay'
import { HallScene } from '@/features/hall/scene/scene'
import { createSitting, type Sitting } from '@/features/hall/scene/sitting'
import { Traversal } from '@/features/hall/scene/traversal'
import { useSound } from '@/features/sound/components/SoundProvider'

const BACKDROP_LENGTH = 600

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600
const SCENERY_MAX_WAIT_MS = 5000
const QUIET_AFTER_SECONDS = 2

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

      let assets: Assets
      try {
        assets = await loadAssets()
      } catch (loadError) {
        if (!isDisposed) setError((loadError as Error).message)
        return
      }
      if (isDisposed) return

      const renderer = new THREE.WebGLRenderer({ antialias: false })
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
        guestBoard = createGuestBoard(scene, scenery, x)
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

      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      let pressX = 0
      let pressY = 0
      let pressedAt = 0

      function aim(event: PointerEvent): void {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, rig.camera)
      }

      function handlePointerDown(event: PointerEvent): void {
        soundRef.current.prepare('jump')
        pressX = event.clientX
        pressY = event.clientY
        pressedAt = performance.now()

        if (isSuspendedRef.current || traversal.isIntro) return
        aim(event)
        const hit = hall.hitTest(raycaster)
        if (hit) loadArtistPieces(hit.mounted.display.slug).catch(() => {})
      }

      function handlePointerUp(event: PointerEvent): void {
        const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
        const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
        const tooSlow = performance.now() - pressedAt > TAP_TIMEOUT_MS
        if (moved > slop || tooSlow || isSuspendedRef.current || traversal.isIntro) return

        aim(event)

        if (lobby.hitTestDoor(raycaster)) {
          soundRef.current.play('click')
          onLeaveRef.current()
          return
        }

        if (lobby.hitTestCat(raycaster)) {
          soundRef.current.play('click')
          onOpenHelpRef.current()
          return
        }

        if (hall.hitTestCoin(raycaster)) {
          soundRef.current.play('coin')
          onFindCoinRef.current()
          return
        }

        const hit = hall.hitTest(raycaster)
        if (hit) {
          soundRef.current.play('painting-open')
          onOpenPieceRef.current({
            slug: hit.mounted.display.slug,
            artistId: hit.mounted.display.artistId,
            pieceId: hit.pieceId,
          })
          return
        }

        const pedestal = hall.hitTestPedestal(raycaster)
        if (pedestal && helm?.tap(pedestal)) return
        if (pedestal?.voice) {
          soundRef.current.play(pedestal.voice)
          pedestal.chime()
          return
        }

        if (matcha?.tap(raycaster)) {
          soundRef.current.play('click')
          return
        }

        if (cafe?.hitTestCat(raycaster)) {
          soundRef.current.play('cafe-hello')
          return
        }

        if (guestBoard?.hitTestSketchBox(raycaster)) {
          soundRef.current.play('click')
          onOpenSketchGameRef.current()
          return
        }

        if (sitting?.tap(raycaster)) {
          soundRef.current.play('click')
          return
        }

        if (guestBoard?.hitTest(raycaster)) {
          soundRef.current.play('click')
          onOpenGuestBoardRef.current()
        }
      }

      renderer.domElement.addEventListener('pointerdown', handlePointerDown)
      renderer.domElement.addEventListener('pointerup', handlePointerUp)

      const viewedDisplays = new Set<number>()
      const VIEW_CHECK_MS = 250
      let lastViewCheck = 0

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
        void fetch('/api/events', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ kind: 'display_view', artistId: nearest.display.artistId }),
        }).catch(() => {})
      }

      let frameHandle = 0
      let frameCount = 0
      let lastFrameAt = performance.now()
      let restX: number | null = null
      let hasMoved = false

      function renderFrame(now: number): void {
        frameHandle = requestAnimationFrame(renderFrame)
        pixelRatio.sample(now - lastFrameAt)
        const dt = Math.min(0.05, Math.max(0, (now - lastFrameAt) / 1000))
        lastFrameAt = now

        if (!isReadyRef.current) {
          isReadyRef.current = true
          setIsReady(true)
          traversal.playIntro(introStart, entrance)
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
        sitting?.update(dt, traversal.cameraX, rig.viewWidth / 2)
        character.update(dt, traversal.x, traversal.walkVelocity, rig.camera, viewport)
        helm?.update(dt, character, rig.camera, viewport)
        matcha?.update(dt, character, rig.camera, viewport)
        soundRef.current.setWalking(Math.abs(traversal.walkVelocity) > WALKING_SPEED)

        hall.update(now, dt, traversal.cameraX)
        if (!isSuspendedRef.current) hall.releaseCoin()
        raiseGiftShop()
        raiseGuestBoard()
        raiseCafe()
        placards.sync(hall.getMounted(), rig.camera, viewport)
        lobbySigns.sync(rig.camera, viewport)
        giftShopSigns?.sync(rig.camera, viewport)
        cafeLink?.sync(rig.camera, viewport)
        guestBoardNotes?.sync(rig.camera, viewport)

        lobby.update(dt, traversal.cameraX)
        cafe?.update(dt, traversal.cameraX)

        if (hall.needsMore(traversal.cameraX)) void fetchNextSlice()
        if (now - lastViewCheck >= VIEW_CHECK_MS) {
          lastViewCheck = now
          recordDisplayView(traversal.cameraX)
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
        placards.clear()
        lobbySigns.clear()
        giftShopSigns?.clear()
        cafeLink?.clear()
        guestBoardNotes?.clear()
        hall.dispose()
        lobby.dispose()
        giftShop?.dispose()
        sitting?.dispose()
        guestBoard?.dispose()
        cafe?.dispose()
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
