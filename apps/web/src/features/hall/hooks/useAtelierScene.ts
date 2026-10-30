'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { outfit } from '@tiny/core/slots'
import { createAtelierRoom, loadAtelierArt, type AtelierArt } from '@/features/hall/scene/atelier'
import { loadCharacterSprites, type CharacterSprites } from '@/features/hall/scene/assets'
import { CameraRig } from '@/features/hall/scene/cameras'
import { createCharacter } from '@/features/hall/scene/character'
import { CONFIG } from '@/features/hall/scene/config'
import type { Viewport } from '@/features/hall/scene/overlay'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { createStairway } from '@/features/hall/scene/stairway'
import { Traversal } from '@/features/hall/scene/traversal'
import { createWardrobe, followOutfit, lookOf, type Wardrobe } from '@/features/hall/scene/wardrobe'
import { useSound } from '@/features/sound/components/SoundProvider'
import { defaultStore } from '@/shared/lib/slots'
import { track } from '@/shared/lib/visit'

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600
const WALKING_SPEED = 0.12
// Long enough for the loading animation to read, even when everything is cached.
const MIN_LOADING_MS = 1200
const MAX_RIG_WAIT_MS = 8000
const WALL_COLOR = '#3a0707'

export interface AtelierHosts {
  canvas: React.RefObject<HTMLDivElement | null>
  overlay: React.RefObject<HTMLDivElement | null>
  character: React.RefObject<HTMLDivElement | null>
}

interface Options {
  hosts: AtelierHosts
  /** Called once the dip covers the screen on the way downstairs. */
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
      try {
        ;[art, sprites] = await Promise.all([loadAtelierArt(), loadCharacterSprites()])
      } catch (loadError) {
        if (!isDisposed) setError((loadError as Error).message)
        return
      }
      if (isDisposed) {
        for (const texture of [...Object.values(art.maps), art.floor, art.plaque]) texture.dispose()
        return
      }

      const renderer = new THREE.WebGLRenderer({ antialias: false })
      const pixelRatio = createPixelRatioGovernor(renderer, window.devicePixelRatio)
      renderer.setClearColor(new THREE.Color(WALL_COLOR))
      renderer.domElement.className = 'hall-canvas'
      canvasHost.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const room = createAtelierRoom(scene, art, sprites, overlayHost)
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
      const stairway = createStairway({ traversal, flight: room.flight, end: 'top', clearX: atelier.arriveX, dip })

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
        traversal,
        outfit: outfitSlot,
        host: characterHost,
        costume: atelier.featured.costume,
        onChange: (change) => track(change),
        onIdle: follower.sync,
      })
      const closet = wardrobe

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

      const quiet = () => !ready || stairway.busy || closet.busy

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
        if (room.hitTestFeatured(raycaster)) {
          soundRef.current.play('click')
          closet.tapFeatured()
          return
        }
        const kind = room.hitTestDisplay(raycaster)
        if (kind) {
          soundRef.current.play('click')
          closet.tapDisplay(kind)
          return
        }
        if (room.hitTestStairs(raycaster)) {
          soundRef.current.play('click')
          track('stairs')
          stairway.leave(() => onLeaveRef.current())
        }
      }

      // Anything that answers a tap says so under a mouse.
      function handlePointerMove(event: PointerEvent): void {
        if (event.pointerType !== 'mouse' || event.buttons !== 0) return
        aim(event)
        const live = !quiet() && (room.hitTestFeatured(raycaster) || room.hitTestDisplay(raycaster) !== null || room.hitTestStairs(raycaster))
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
            track('atelier')
            stairway.arrive()
          }
        } else {
          traversal.setSuspended(stairway.locked)
          traversal.update(dt, atelier.min, atelier.max)
        }

        const moving = stairway.update(dt)
        const cameraX = moving?.x ?? traversal.cameraX
        rig.sync(cameraX, moving?.rise ?? 0)
        character.update(dt, moving?.x ?? traversal.x, moving?.velocity ?? traversal.walkVelocity, rig.camera, viewport, moving?.centerY)
        closet.update(dt, rig.camera, viewport)
        room.update(dt, traversal.x)
        room.sync(rig.camera, viewport)
        soundRef.current.setWalking(Math.abs(moving?.velocity ?? traversal.walkVelocity) > WALKING_SPEED)
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
        stairway.dispose()
        room.dispose()
        character.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    void build()

    return () => {
      isDisposed = true
      teardown()
    }
  }, [])

  return { isReady, error }
}
