'use client'

import { useEffect, useRef, useState } from 'react'
import { outfit } from '@tiny/core/slots'
import { getWalletSnapshot } from '@/features/economy/store'
import type { Look } from '@/features/hall/scene/character'
import type { CharacterKind, Rig, RigAttachment, RigAttachmentPose } from '@/features/hall/scene/rig'
import { createRigState } from '@/features/hall/scene/rig-motion'
import { FITS, lookOf, ownedLook } from '@/features/hall/scene/wardrobe'
import { assetUrl } from '@/shared/lib/assets'
import { defaultStore } from '@/shared/lib/slots'

/** Each rig's front paw in its rest pose, in the author's layer canvas, measured from the models. */
const GRIP: Record<CharacterKind, RigAttachment> = {
  bunny: { bone: 'arm_R', x: 1422, y: 1417, width: 1, rotation: 0 },
  cat: { bone: 'arm_R', x: 1416, y: 1442, width: 1, rotation: 0 },
  otter: { bone: 'arm_R', x: 1403, y: 1460, width: 1, rotation: 0 },
  bruce: { bone: 'arm_R', x: 1386, y: 1490, width: 1, rotation: 0 },
}

/** The fishing hat on each rig's head in its rest pose, in the same layer canvas. */
const HAT: Record<CharacterKind, { x: number; y: number; width: number }> = {
  bunny: { x: 218, y: 250, width: 1133 },
  cat: { x: 218, y: 250, width: 1133 },
  otter: { x: 218, y: 250, width: 1133 },
  bruce: { x: 218, y: 250, width: 1133 },
}
const HAT_ASPECT = 1063 / 697

export interface Box {
  left: number
  top: number
  width: number
  height: number
}

/** The visitor's own character and outfit, as the room dresses them. */
export function currentLook(): Look {
  const look = ownedLook(lookOf(defaultStore().getSlot(outfit).snapshot()), getWalletSnapshot())
  const fitted = (id: string | null) => (id !== null && FITS[look.kind].includes(id) ? id : null)
  return { kind: look.kind, costume: fitted(look.costume), bow: fitted(look.bow) }
}

/**
 * The visitor at the water's edge, drawn with their own rig so a cat or an otter fishes as itself.
 * `box` is the standing figure's box as fractions of the world; the paw is reported in world fractions.
 */
export default function Angler({ box, reduced, onPaw }: { box: Box; reduced: boolean; onPaw(paw: { x: number; y: number } | null | undefined): void }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [frame, setFrame] = useState<Box | null>(null)
  const [failed, setFailed] = useState(false)
  const onPawRef = useRef(onPaw)
  onPawRef.current = onPaw
  const boxRef = useRef(box)
  boxRef.current = box
  const reducedRef = useRef(reduced)
  reducedRef.current = reduced

  useEffect(() => {
    const host = hostRef.current
    const world = host?.parentElement
    if (!host || !world) return
    onPawRef.current(undefined)
    setFrame(null)
    // A fresh canvas per mount: a disposed rig loses its WebGL context with it.
    const canvas = document.createElement('canvas')
    host.append(canvas)
    const look = currentLook()
    let rig: Rig | null = null
    let disposed = false
    let raf = 0
    let timer = 0
    const motion = createRigState('right')
    const pose: RigAttachmentPose = { x: 0, y: 0, width: 0, rotation: 0 }

    void import('@/features/hall/scene/rig').then(({ loadRig }) => loadRig(canvas, look.kind)).then(async (loaded) => {
      if (disposed) { loaded.dispose(); return }
      loaded.setCostume(look.costume, look.bow)
      // A costume keeps its own headwear; everyone else borrows the pond's hat.
      if (!look.costume) {
        const hat = HAT[look.kind]
        await loaded.wear([{ bone: 'head', image: assetUrl('pond/fishing-hat', { density: 3 }), ...hat, height: hat.width / HAT_ASPECT, drawOrder: 12 }])
        if (disposed) { loaded.dispose(); return }
      }
      rig = loaded
      let last = performance.now()
      let reported = 0
      let lastFrame = ''
      const draw = (now: number) => {
        if (!rig || disposed) return
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now
        // Resizing changes placement, not the rig's lifetime or WebGL context.
        const box = boxRef.current
        const height = box.height * rig.spriteScale
        const worldAspect = world.clientWidth / Math.max(1, world.clientHeight)
        const width = height * rig.aspect / worldAspect
        const frame = { left: box.left + box.width / 2 - width / 2, top: box.top + box.height - height * rig.feet, width, height }
        const key = `${frame.left},${frame.top},${frame.width},${frame.height}`
        if (key !== lastFrame) {
          lastFrame = key
          onPawRef.current(undefined)
          setFrame(frame)
        }
        const px = canvas.clientHeight
        const c = canvas.getBoundingClientRect()
        const w = world.getBoundingClientRect()
        const placed = w.width > 0 && w.height > 0 && Math.abs(c.height - frame.height * w.height) < 1 && Math.abs(c.width - frame.width * w.width) < 1
        if (px > 0 && placed) {
          rig.render(motion, reducedRef.current ? 0 : dt, px, window.devicePixelRatio)
          // The paw breathes a little; report it now and then, not every frame.
          if (now - reported > 250 && rig.projectAttachment(GRIP[look.kind], pose)) {
            reported = now
            onPawRef.current({ x: (c.left + pose.x - w.left) / w.width, y: (c.top + pose.y - w.top) / w.height })
          }
        }
        if (!reducedRef.current || !placed) raf = requestAnimationFrame(draw)
        else timer = window.setTimeout(() => { raf = requestAnimationFrame(draw) }, 500)
      }
      raf = requestAnimationFrame(draw)
    }).catch((error: unknown) => {
      console.warn('[pond] angler rig unavailable; showing the bunny', error)
      onPawRef.current(null)
      if (!disposed) setFailed(true)
    })

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
      rig?.dispose()
      canvas.remove()
    }
  }, [])

  return (
    <>
      <div
        ref={hostRef}
        className="pond-angler"
        aria-hidden="true"
        style={frame ? {
          left: `${frame.left * 100}%`,
          top: `${frame.top * 100}%`,
          width: `${frame.width * 100}%`,
          height: `${frame.height * 100}%`,
        } : { visibility: 'hidden', inset: 0 }}
      />
      {failed ? (
        <div
          className="pond-bunny"
          style={{ left: `${box.left * 100}%`, top: `${box.top * 100}%`, width: `${box.width * 100}%`, height: `${box.height * 100}%` }}
        >
          <img src={assetUrl('bunny-right')} alt="" draggable={false} />
        </div>
      ) : null}
    </>
  )
}
