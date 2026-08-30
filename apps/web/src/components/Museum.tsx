'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'motion/react'
import type { HallSliceDto } from '@tiny/core'
import { loadAssets } from '@/hall/assets'
import { createBackdrop } from '@/hall/backdrop'
import { CameraRig } from '@/hall/cameras'
import { createCharacter } from '@/hall/character'
import { CONFIG } from '@/hall/config'
import { Placards, type Viewport } from '@/hall/overlay'
import { HallScene } from '@/hall/scene'
import { Traversal } from '@/hall/traversal'
import { useSound } from './SoundProvider'
import Walkthrough from './Walkthrough'

/**
 * The hall.
 *
 * Three.js draws the room; the plaque text is real DOM projected over it each
 * frame. Everything inside the effect is imperative on purpose — routing
 * camera position through React state at sixty frames per second is what makes
 * overlays swim against the geometry they belong to.
 */

/** The wall and floor span far more than the hall ever needs, so they never rebuild. */
const BACKDROP_LENGTH = 600

interface Props {
  initialSlice: HallSliceDto
}

interface OpenPiece {
  slug: string
  artistId: string
  pieceId: string
}

export default function Museum({ initialSlice }: Props) {
  const hostRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const characterRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<OpenPiece | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [ready, setReady] = useState(false)
  const readyRef = useRef(false)

  /**
   * The frame loop is imperative and never restarts, so it cannot close over
   * the sound context directly — the callbacks change identity whenever the
   * mute preference does. A ref refreshed each render keeps the loop pointed
   * at the current ones without rebuilding the scene.
   */
  const sound = useSound()
  const soundRef = useRef(sound)
  soundRef.current = sound

  // The frame loop must not restart when the walk-through opens, so the
  // suspend flag is passed to the loop through a ref rather than a dependency.
  const suspendedRef = useRef(false)
  suspendedRef.current = open !== null

  // Opening a work stops the hall, so it must stop the footsteps too — the
  // loop keeps running otherwise, and the bunny is standing still behind an
  // open painting.
  useEffect(() => {
    if (open !== null) soundRef.current.setWalking(false)
  }, [open])

  useEffect(() => {
    const host = hostRef.current
    const overlayHost = overlayRef.current
    const characterHost = characterRef.current
    if (!host || !overlayHost || !characterHost) return

    let disposed = false
    let frameHandle = 0
    let cleanup = () => {}

    void (async () => {
      let assets
      try {
        assets = await loadAssets()
      } catch (loadError) {
        if (!disposed) setError((loadError as Error).message)
        return
      }
      if (disposed) return

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(new THREE.Color(assets.manifest.room.wallColor))
      renderer.domElement.className = 'hall-canvas'
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const backdrop = createBackdrop(scene, assets, BACKDROP_LENGTH)
      const hall = new HallScene(scene, assets)
      hall.ingestSlice(initialSlice)

      // Not added to the scene: the bunny is a DOM sprite in a layer above the
      // plaque overlay, so nothing can be painted in front of it.
      const character = createCharacter(assets, characterHost)

      const placards = new Placards(overlayHost)
      const traversal = new Traversal()
      traversal.attach(renderer.domElement)

      let viewport: Viewport = { width: 1, height: 1, left: 0, top: 0 }
      const rig = new CameraRig(1, 1)

      /**
       * The hall fills its host exactly. The screen frame owns the size, so
       * this measures rather than computes — one place decides how big a
       * screen is, and it is the stylesheet.
       */
      const applyViewport = (): void => {
        const rect = host.getBoundingClientRect()
        const width = Math.max(1, Math.round(rect.width))
        const height = Math.max(1, Math.round(rect.height))
        if (width === viewport.width && height === viewport.height) return

        // Placards are positioned inside the host, so their origin is 0,0.
        viewport = { width, height, left: 0, top: 0 }
        renderer.setSize(width, height)
        rig.resize(width, height)
        // Keep dragging 1:1 with the wall at this screen size.
        traversal.setWorldPerPixel(rig.viewWidth / width)
      }

      applyViewport()

      const resizeObserver = new ResizeObserver(applyViewport)
      resizeObserver.observe(host)

      const firstCenter = hall.layout.centerX[0] ?? 0
      // The bunny enters from exactly as far back as it is ever allowed to
      // trail, so the opening and the leash are the same number.
      const introStart = firstCenter - CONFIG.character.maxTrailDistance
      traversal.reset(firstCenter)

      // --- fetching more of the hall ---

      let fetching = false
      async function fetchMore(): Promise<void> {
        if (fetching || hall.nextIndex === null) return
        fetching = true
        try {
          const url = `/api/hall?epoch=${hall.epochId}&after=${hall.nextIndex}&limit=${CONFIG.loading.sliceSize}`
          const response = await fetch(url)
          if (response.ok) hall.ingestSlice((await response.json()) as HallSliceDto)
        } catch {
          // Walking on will retry; the pedestal holds in the meantime.
        } finally {
          fetching = false
        }
      }

      // --- opening a work ---

      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2()
      let pressX = 0
      let pressY = 0
      let pressAt = 0

      const onPointerDown = (e: PointerEvent) => {
        pressX = e.clientX
        pressY = e.clientY
        pressAt = performance.now()
      }

      const onPointerUp = (e: PointerEvent) => {
        const moved = Math.hypot(e.clientX - pressX, e.clientY - pressY)
        // A drag that ends over a work is not a request to open it. The
        // threshold is finger-sized, not mouse-sized: a thumb tap routinely
        // travels several pixels and would otherwise be swallowed as a drag.
        const slop = e.pointerType === 'touch' ? 12 : 6
        if (
          moved > slop ||
          performance.now() - pressAt > 600 ||
          suspendedRef.current ||
          traversal.isIntro
        ) {
          return
        }

        // Read the rect at event time: the frame moves when the window resizes
        // or the page scrolls, and a stale offset aims the ray at the wrong work.
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, rig.camera)

        const hit = hall.hitTest(raycaster)
        if (!hit) return

        soundRef.current.play('painting-open')
        setOpen({
          slug: hit.mounted.display.slug,
          artistId: hit.mounted.display.artistId,
          pieceId: hit.pieceId,
        })
      }

      renderer.domElement.addEventListener('pointerdown', onPointerDown)
      renderer.domElement.addEventListener('pointerup', onPointerUp)

      // --- frame loop ---

      let last = performance.now()
      const seenDisplays = new Set<number>()

      function frame(now: number): void {
        frameHandle = requestAnimationFrame(frame)
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now

        if (!readyRef.current) {
          const stats = hall.stats()
          if (stats.mounted > 0 || stats.total === 0) {
            readyRef.current = true
            setReady(true)
            traversal.playIntro(introStart, firstCenter)
          }
        } else {
          traversal.setSuspended(suspendedRef.current)
          traversal.update(dt, hall.layout)
        }

        rig.sync(traversal.cameraX)
        // After rig.sync: the sprite is positioned by projecting through the
        // camera, so the camera must already be where it is going this frame.
        // walkVelocity is the bunny's own pace, measured from how far it
        // actually walked — never the scroll speed of the hall.
        character.update(dt, traversal.x, traversal.walkVelocity, rig.camera, viewport)

        // Footsteps follow the bunny's own pace, not the hall's scroll speed —
        // the same number the walk cycle runs on, so what you hear matches what
        // you see. The threshold is the one the sprite uses to decide it is
        // walking at all, so sound and animation start and stop together.
        soundRef.current.setWalking(Math.abs(traversal.walkVelocity) > 0.12)
        hall.update(now, dt, traversal.cameraX)
        placards.sync(hall.getMounted(), rig.camera, viewport)

        if (hall.needsMore(traversal.cameraX)) void fetchMore()

        // Count a display as viewed once, when the visitor is actually at it.
        // The hall is laid out per piece now, so the nearest display is found by
        // its span midpoint rather than by a slot index.
        const mountedList = hall.getMounted()
        let nearestMounted = null
        let nearestDist = Infinity
        for (const m of mountedList) {
          const d = Math.abs(m.centerX - traversal.cameraX)
          if (d < nearestDist) {
            nearestDist = d
            nearestMounted = m
          }
        }
        if (nearestMounted && !seenDisplays.has(nearestMounted.index) && nearestDist < 3.0) {
          seenDisplays.add(nearestMounted.index)
          void fetch('/api/events', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              kind: 'display_view',
              artistId: nearestMounted.display.artistId,
            }),
          }).catch(() => {})
        }

        renderer.render(scene, rig.camera)
      }

      frameHandle = requestAnimationFrame(frame)

      cleanup = () => {
        cancelAnimationFrame(frameHandle)
        soundRef.current.setWalking(false)
        resizeObserver.disconnect()
        renderer.domElement.removeEventListener('pointerdown', onPointerDown)
        renderer.domElement.removeEventListener('pointerup', onPointerUp)
        placards.clear()
        hall.dispose()
        backdrop.dispose()
        character.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })()

    return () => {
      disposed = true
      cleanup()
    }
    // initialSlice is the server-rendered first page and never changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div 
      className="museum"
      initial={{ opacity: 0 }}
      animate={{ opacity: ready ? 1 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="hall-host" ref={hostRef} />
      <div className="hall-overlay" ref={overlayRef} />
      {/* Above the plaques, so the visitor is never painted over. */}
      <div className="hall-character" ref={characterRef} />

      {error ? <div className="hall-error">{error}</div> : null}

      <AnimatePresence>
        {open ? (
          <Walkthrough
            key="walkthrough"
            slug={open.slug}
            artistId={open.artistId}
            initialPieceId={open.pieceId}
            onClose={() => setOpen(null)}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  )
}
