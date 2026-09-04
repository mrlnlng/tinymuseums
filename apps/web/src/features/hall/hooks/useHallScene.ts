'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type { HallSliceDto } from '@tiny/core'
import { loadAssets, type Assets } from '@/features/hall/scene/assets'
import { createBackdrop } from '@/features/hall/scene/backdrop'
import { CameraRig } from '@/features/hall/scene/cameras'
import { createCharacter } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import { createGiftShop, type GiftShop } from '@/features/hall/scene/giftshop'
import { createLobby } from '@/features/hall/scene/lobby'
import {
  GiftShopSigns,
  LobbySigns,
  Placards,
  type Viewport,
} from '@/features/hall/scene/overlay'
import { HallScene } from '@/features/hall/scene/scene'
import { Traversal } from '@/features/hall/scene/traversal'
import { useSound } from '@/features/sound/components/SoundProvider'

/* Builds and runs the hall, imperatively on purpose: routing camera position through React state at 60fps makes overlays swim. The hook leaves the component with nothing but markup. */

/** The wall and floor span more than the hall ever needs, so they never rebuild. */
const BACKDROP_LENGTH = 600

/** A tap this far from where it started is a drag, not a request to open. */
const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600

/** Close enough to a wall to count as having looked at it. */
const VIEWED_WITHIN_UNITS = 3.0

/** Above this pace the visitor is walking, and the footsteps run. */
const WALKING_SPEED = 0.12

/*  Where the gift shop at the end of the hall sends the visitor. One address
    for the whole museum: the shop belongs to the museum, not to an artist —
    an artist's own link is the "Shop print" button on their work. */
const GIFT_SHOP_URL = 'https://www.inspiratiq.art/'

export interface OpenPiece {
  slug: string
  artistId: string
  pieceId: string
}

export interface HallHosts {
  canvas: React.RefObject<HTMLDivElement | null>
  overlay: React.RefObject<HTMLDivElement | null>
  character: React.RefObject<HTMLDivElement | null>
}

interface Options {
  hosts: HallHosts
  initialSlice: HallSliceDto
  /** True while a work or the help guide is open, holding the hall still. */
  isSuspended: boolean
  onOpenPiece: (piece: OpenPiece) => void
  /** The visitor tapped the door at the head of the hall. */
  onLeave: () => void
  /** The visitor asked the help booth for the guide. */
  onOpenHelp: () => void
}

export function useHallScene({
  hosts,
  initialSlice,
  isSuspended,
  onOpenPiece,
  onLeave,
  onOpenHelp,
}: Options) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /* The frame loop never restarts, so anything it reads that can change is reached through a ref — putting these in the dependency list would rebuild the whole scene whenever a work opened. */
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

      /*  No multisampling. Everything in this scene is an axis-aligned quad, and
          every edge you can actually see is drawn inside a texture's own alpha —
          the frames, the rope, the pedestals. MSAA smooths polygon edges, of
          which there are none on screen, and charges for it in fragments: at two
          device pixels per CSS pixel on a phone that is the most expensive thing
          the renderer was doing for no visible difference. */
      const renderer = new THREE.WebGLRenderer({ antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(new THREE.Color(assets.manifest.room.wallColor))
      renderer.domElement.className = 'hall-canvas'
      canvasHost.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const backdrop = createBackdrop(scene, assets, BACKDROP_LENGTH)
      const lobby = createLobby(scene, assets)
      const hall = new HallScene(scene, assets)
      hall.ingestSlice(initialSlice)

      // Not in the scene: the bunny is a DOM sprite above the plaque overlay,
      // so nothing can be painted in front of it.
      const character = createCharacter(assets, characterHost)
      const placards = new Placards(overlayHost)
      const lobbySigns = new LobbySigns(overlayHost, lobby.marks, () => onOpenHelpRef.current())
      const traversal = new Traversal()
      traversal.attach(renderer.domElement)

      let viewport: Viewport = { width: 1, height: 1, left: 0, top: 0 }
      const rig = new CameraRig(1, 1)

      /** The hall fills its host exactly, so this measures rather than computes. */
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
        // Keeps dragging 1:1 with the wall at this screen size.
        traversal.setWorldPerPixel(rig.viewWidth / width)
      }

      applyViewport()
      const resizeObserver = new ResizeObserver(applyViewport)
      resizeObserver.observe(canvasHost)

      /*  A visit starts in the visitor centre, not at the first wall: the
          camera parks on the door and the bunny walks on from off the left,
          the same arrival it always played, one room earlier. */
      const entrance = CONFIG.lobby.startX
      const introStart = entrance - CONFIG.lobby.introWalk
      traversal.reset(entrance)

      let isFetching = false
      async function fetchNextSlice(): Promise<void> {
        if (isFetching || hall.nextIndex === null) return
        isFetching = true
        try {
          const response = await fetch(
            `/api/hall?epoch=${hall.epochId}&after=${hall.nextIndex}&limit=${CONFIG.loading.sliceSize}`,
          )
          if (response.ok) hall.ingestSlice((await response.json()) as HallSliceDto)
        } catch {
          // Walking on will retry; the wall holds in the meantime.
        } finally {
          isFetching = false
        }
      }

      /*  The gift shop cannot be built with the rest of the scene: it stands
          past the last painting, and which painting that is only becomes known
          when the final slice lands. It is built once, the first frame after
          the layout can say where it goes. */
      let giftShop: GiftShop | null = null
      let giftShopSigns: GiftShopSigns | null = null

      /*  An arrow rather than a declaration, which is the style everything else
          in here uses: a hoisted declaration could in principle run before the
          host was checked for null, so the checked host is only in scope for a
          function created after the check. */
      const raiseGiftShop = (): void => {
        const x = hall.layout.giftShopX
        if (x === null || giftShop) return
        giftShop = createGiftShop(scene, assets, x)
        giftShopSigns = new GiftShopSigns(overlayHost, giftShop.marks, GIFT_SHOP_URL)
      }

      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      let pressX = 0
      let pressY = 0
      let pressedAt = 0

      function handlePointerDown(event: PointerEvent): void {
        pressX = event.clientX
        pressY = event.clientY
        pressedAt = performance.now()
      }

      function handlePointerUp(event: PointerEvent): void {
        // A drag that ends over a work is not a request to open it. The
        // threshold is finger-sized, not mouse-sized.
        const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
        const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
        const tooSlow = performance.now() - pressedAt > TAP_TIMEOUT_MS
        if (moved > slop || tooSlow || isSuspendedRef.current || traversal.isIntro) return

        // Read the rect at event time: a stale offset aims the ray at the
        // wrong work once the window has moved.
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, rig.camera)

        /*  The door first: it stands at the head of the hall where no wall
            does, so nothing is shadowed by testing it before them. */
        if (lobby.hitTestDoor(raycaster)) {
          // The click sound is delegated off real controls, and the door is a
          // plane in the scene, so it says so itself.
          soundRef.current.play('click')
          onLeaveRef.current()
          return
        }

        const hit = hall.hitTest(raycaster)
        if (!hit) return

        soundRef.current.play('painting-open')
        onOpenPieceRef.current({
          slug: hit.mounted.display.slug,
          artistId: hit.mounted.display.artistId,
          pieceId: hit.pieceId,
        })
      }

      renderer.domElement.addEventListener('pointerdown', handlePointerDown)
      renderer.domElement.addEventListener('pointerup', handlePointerUp)

      const viewedDisplays = new Set<number>()
      /*  Walking past a wall is not a sixty-times-a-second question. This scans
          every mounted display to find the nearest one, and the thing it is
          looking for takes a second of walking to become true, so it is asked
          four times a second instead of sixty. */
      const VIEW_CHECK_MS = 250
      let lastViewCheck = 0

      /** Counts a wall as seen once, when the visitor is actually at it. */
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
      let lastFrameAt = performance.now()

      function renderFrame(now: number): void {
        frameHandle = requestAnimationFrame(renderFrame)
        const dt = Math.min(0.05, (now - lastFrameAt) / 1000)
        lastFrameAt = now

        if (!isReadyRef.current) {
          const stats = hall.stats()
          if (stats.mounted > 0 || stats.total === 0) {
            isReadyRef.current = true
            setIsReady(true)
            traversal.playIntro(introStart, entrance)
          }
        } else {
          traversal.setSuspended(isSuspendedRef.current)
          traversal.update(dt, hall.layout.totalLength)
        }

        rig.sync(traversal.cameraX)
        // After rig.sync: the sprite is placed by projecting through the
        // camera, so the camera must already be where it is going this frame.
        character.update(dt, traversal.x, traversal.walkVelocity, rig.camera, viewport)
        // The bunny's own pace, never the hall's scroll speed, so what you
        // hear matches the feet you can see.
        soundRef.current.setWalking(Math.abs(traversal.walkVelocity) > WALKING_SPEED)

        hall.update(now, dt, traversal.cameraX)
        raiseGiftShop()
        placards.sync(hall.getMounted(), rig.camera, viewport)
        lobbySigns.sync(rig.camera, viewport)
        giftShopSigns?.sync(rig.camera, viewport)

        if (hall.needsMore(traversal.cameraX)) void fetchNextSlice()
        if (now - lastViewCheck >= VIEW_CHECK_MS) {
          lastViewCheck = now
          recordDisplayView(traversal.cameraX)
        }

        renderer.render(scene, rig.camera)
      }

      frameHandle = requestAnimationFrame(renderFrame)

      teardown = () => {
        cancelAnimationFrame(frameHandle)
        soundRef.current.setWalking(false)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
        renderer.domElement.removeEventListener('pointerup', handlePointerUp)
        placards.clear()
        lobbySigns.clear()
        giftShopSigns?.clear()
        hall.dispose()
        lobby.dispose()
        giftShop?.dispose()
        backdrop.dispose()
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
    // Mount-once: the scene is built against the first render's hosts, and
    // everything the loop reads that can change is behind refs.
  }, [])

  return { isReady, error }
}
