'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { outfit } from '@tiny/core/slots'
import { createAtelierRoom, disposeAtelierArt, loadAtelierArt, type AtelierArt } from '@/features/hall/scene/atelier'
import { loadCharacterSprites, type CharacterSprites } from '@/features/hall/scene/assets'
import { CameraRig } from '@/features/hall/scene/cameras'
import { createCharacter } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import type { Viewport } from '@/features/hall/scene/overlay'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { createRoomPassage } from '@/features/hall/scene/room-passage'
import { Traversal } from '@/features/hall/scene/traversal'
import { createWardrobe, followOutfit, lookOf, type Wardrobe } from '@/features/hall/scene/wardrobe'
import { useSound } from '@/features/sound/components/SoundProvider'
import { defaultStore } from '@/shared/lib/slots'
import { revealFloorTransition } from '@/features/hall/lib/floor-transition'
import { loadGalleryDoor, GALLERY_DOOR } from '@/features/hall/scene/gallery-door'
import { track } from '@/shared/lib/visit'

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600
const WALKING_SPEED = 0.12
// Long enough for the loading animation to read, even when everything is cached.
const MIN_LOADING_MS = 2800
const MAX_RIG_WAIT_MS = 8000
const WALL_COLOR = '#3a0707'

export interface AtelierHosts {
  canvas: React.RefObject<HTMLDivElement | null>
  overlay: React.RefObject<HTMLDivElement | null>
  character: React.RefObject<HTMLDivElement | null>
}

interface Options {
  hosts: AtelierHosts
  /** Called once the dip covers the screen on the way back to the museum. */
  onLeave: () => void
}

export function useAtelierScene({ hosts, onLeave }: Options) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sound = useSound()
  const soundRef = useRef(sound)
  soundRef.current = sound
  const onLeaveRef = useRef(onLeave)
  onLeaveRef.current = onLeave

  useEffect(() => {
    let isDisposed = false
    let teardown = () => {}
    const startedAt = performance.now()

    async function build(): Promise<void> {
      const canvasHost = hosts.canvas.current
      const overlayHost = hosts.overlay.current
      const characterHost = hosts.character.current
      if (!canvasHost || !overlayHost || !characterHost) return

      let art: AtelierArt
      let sprites: CharacterSprites
      let doorImage: HTMLImageElement
      try {
        ;[art, sprites, doorImage] = await Promise.all([loadAtelierArt(), loadCharacterSprites(), loadGalleryDoor()])
      } catch (loadError) {
        if (!isDisposed) { setError((loadError as Error).message); revealFloorTransition() }
        return
      }
      if (isDisposed) {
        disposeAtelierArt(art)
        return
      }

      const renderer = new THREE.WebGLRenderer({ antialias: false })
      const pixelRatio = createPixelRatioGovernor(renderer, window.devicePixelRatio)
      renderer.setClearColor(new THREE.Color(WALL_COLOR))
      renderer.domElement.className = 'hall-canvas'
      canvasHost.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const room = createAtelierRoom(scene, art, overlayHost, doorImage)
      const outfitSlot = defaultStore().getSlot(outfit)
      const character = createCharacter(sprites, characterHost, lookOf(outfitSlot.snapshot()))
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

      const dip = document.createElement('div')
      dip.className = 'floor-dip'
      dip.hidden = true
      canvasHost.parentElement?.appendChild(dip)

      const { atelier } = CONFIG
      const passage = createRoomPassage({ traversal, doorX: GALLERY_DOOR.atelierX, clearX: GALLERY_DOOR.atelierX + GALLERY_DOOR.clear, dip })

      let wardrobe: Wardrobe | null = null
      const follower = followOutfit(
        character,
        outfitSlot,
        () => wardrobe?.busy ?? true,
        () => wardrobe?.reflect(),
      )
      wardrobe = createWardrobe({
        character,
        room,
        outfit: outfitSlot,
        onChange: (change) => track(change),
        onMisfit: (item, kind) => room.showMisfit(item, kind),
        onIdle: follower.sync,
      })
      const closet = wardrobe
      room.setActions({
        onItem: (item) => { if (!quiet()) closet.tapItem(item) },
        onCharacter: (kind) => { if (!quiet()) closet.tapDisplay(kind) },
        onLeave: () => { if (!quiet()) { track('stairs'); passage.leave(() => onLeaveRef.current()) } },
      })

      let rigSettled = false
      // A saved character that fails to load falls back to the bunny; the displays follow.
      void character.ready.finally(() => {
        rigSettled = true
        if (!isDisposed && !closet.busy) closet.reflect()
      })
      let fontsReady = false
      void document.fonts.ready.then(() => {
        fontsReady = true
      })

      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      let pressX = 0
      let pressY = 0
      let pressedAt = 0
      let isTap = false
      let ready = false

      function aim(event: MouseEvent): void {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, rig.camera)
      }

      const quiet = () => !ready || passage.busy || document.querySelector('[aria-modal="true"]') !== null

      function handlePointerDown(event: PointerEvent): void {
        isTap = false
        pressX = event.clientX
        pressY = event.clientY
        pressedAt = performance.now()
      }

      function handlePointerUp(event: PointerEvent): void {
        const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
        const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
        isTap = !(moved > slop || performance.now() - pressedAt > TAP_TIMEOUT_MS || quiet())
      }

      // Taps act on click, as in the hall, so nothing opened by a tap catches its own click.
      function handleClick(event: MouseEvent): void {
        if (!isTap) return
        isTap = false
        aim(event)
        const item = room.hitTestItem(raycaster)
        if (item) {
          soundRef.current.play('click')
          closet.tapItem(item)
          return
        }
        const kind = room.hitTestDisplay(raycaster)
        if (kind) {
          soundRef.current.play('click')
          closet.tapDisplay(kind)
          return
        }
        if (room.hitTestDoor(raycaster)) {
          soundRef.current.play('click')
          track('stairs')
          passage.leave(() => onLeaveRef.current())
        }
      }

      // Anything that answers a tap says so under a mouse.
      function handlePointerMove(event: PointerEvent): void {
        if (event.pointerType !== 'mouse' || event.buttons !== 0) return
        aim(event)
        const live = !quiet() && (room.hitTestItem(raycaster) || room.hitTestDisplay(raycaster) !== null || room.hitTestDoor(raycaster))
        renderer.domElement.style.cursor = live ? 'pointer' : ''
      }

      renderer.domElement.addEventListener('pointerdown', handlePointerDown)
      renderer.domElement.addEventListener('pointerup', handlePointerUp)
      renderer.domElement.addEventListener('pointermove', handlePointerMove)
      renderer.domElement.addEventListener('click', handleClick)

      let frameHandle = 0
      let lastFrameAt = performance.now()
      let readyAt = Infinity

      function renderFrame(now: number): void {
        frameHandle = requestAnimationFrame(renderFrame)
        pixelRatio.sample(now - lastFrameAt, now - readyAt > 3000)
        const dt = Math.min(0.05, Math.max(0, (now - lastFrameAt) / 1000))
        lastFrameAt = now

        if (!ready) {
          const waited = now - startedAt
          if (fontsReady && waited >= MIN_LOADING_MS && (rigSettled || waited >= MAX_RIG_WAIT_MS)) {
            ready = true
            readyAt = now
            closet.reflect()
            setIsReady(true)
            revealFloorTransition()
            track('atelier')
            passage.arrive()
          }
        } else {
          traversal.setSuspended(passage.locked || document.querySelector('[aria-modal="true"]') !== null)
          traversal.update(dt, GALLERY_DOOR.atelierX, atelier.max)
        }

        passage.update(dt)
        const cameraX = traversal.cameraX
        rig.sync(cameraX, 0)
        character.update(dt, traversal.x, traversal.walkVelocity, rig.camera, viewport)
        room.update(dt, traversal.x)
        room.sync(rig.camera, viewport, !quiet())
        soundRef.current.setWalking(Math.abs(traversal.walkVelocity) > WALKING_SPEED)
        renderer.render(scene, rig.camera)
      }
      frameHandle = requestAnimationFrame(renderFrame)

      teardown = () => {
        cancelAnimationFrame(frameHandle)
        soundRef.current.setWalking(false)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', handlePointerDown)
        renderer.domElement.removeEventListener('pointerup', handlePointerUp)
        renderer.domElement.removeEventListener('pointermove', handlePointerMove)
        renderer.domElement.removeEventListener('click', handleClick)
        traversal.detach()
        follower.dispose()
        closet.dispose()
        passage.dispose()
        room.dispose()
        character.dispose()
        renderer.dispose()
        renderer.forceContextLoss()
        renderer.domElement.remove()
      }
    }

    void build().catch((error) => {
      if (!isDisposed) { setError(String(error)); revealFloorTransition() }
    })

    return () => {
      isDisposed = true
      teardown()
    }
  }, [])

  return { isReady, error }
}
