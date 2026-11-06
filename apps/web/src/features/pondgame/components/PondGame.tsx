'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import MinigameFrame from '@/features/minigames/components/MinigameFrame'
import { useSound } from '@/features/sound/components/SoundProvider'
import { collect, earn } from '@/features/economy/store'
import { assetUrl, type AssetName } from '@/shared/lib/assets'
import { depthAtY, feetY, scaleAt, type FloorPoint } from '@/features/rooms/floor'
import manifestJson from '../../../../public/assets/manifest.json'
import {
  cast,
  createFishingState,
  reel,
  tick,
  type FishingPhase,
  type FishingState,
} from '../lib/fishing'
import {
  castSpot,
  createPondWorld,
  POND_CENTRE,
  POND_RADIUS_D,
  POND_RADIUS_X,
  POND_VIEW,
  step,
  walkTo,
  type PondWorld,
} from '../lib/world'

interface PondGameProps {
  onClose: () => void
  onCatch?: (fishId: string) => void
}

interface SpriteSet {
  walkLeft: HTMLImageElement[]
  walkRight: HTMLImageElement[]
  idleLeft: HTMLImageElement
  idleRight: HTMLImageElement
}

interface Scene {
  world: PondWorld
  fishing: FishingState
  bobber: FloorPoint | null
  walkClock: number
  time: number
  sprites: SpriteSet | null
  still: boolean
}

interface Toast {
  message: string
  note?: string
}

const REEDS = [
  { x: 2.15, d: 0.62, stems: 3 },
  { x: 2.62, d: 0.88, stems: 2 },
  { x: 9.65, d: 0.7, stems: 3 },
  { x: 10.15, d: 1.05, stems: 2 },
  { x: 1.25, d: 2.25, stems: 2 },
  { x: 10.75, d: 2.55, stems: 2 },
  { x: 4.05, d: 3.62, stems: 3 },
  { x: 8.3, d: 3.58, stems: 2 },
] as const

const ROCKS = [
  { x: 1.45, d: 1.45, r: 0.24 },
  { x: 10.55, d: 1.7, r: 0.2 },
  { x: 3.1, d: 3.78, r: 0.16 },
  { x: 9.35, d: 3.66, r: 0.22 },
] as const

const TOAST_MS = 2200
const BUNNY_ASPECT = 382 / 593

function spriteName(file: string): AssetName {
  return file.replace(/\.png$/, '') as AssetName
}

function loadSprite(file: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error(`Failed to load ${file}`))
    image.src = assetUrl(spriteName(file))
  })
}

function ellipse(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
): void {
  ctx.beginPath()
  ctx.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2)
}

function drawReed(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  stems: number,
): void {
  ctx.strokeStyle = '#6f8a5a'
  ctx.lineCap = 'round'
  for (let i = 0; i < stems; i++) {
    const offset = (i - (stems - 1) / 2) * scale * 0.12
    const height = scale * (0.9 + i * 0.12)
    const lean = (i % 2 === 0 ? 1 : -1) * scale * 0.1
    ctx.lineWidth = Math.max(1.2, scale * 0.04)
    ctx.beginPath()
    ctx.moveTo(x + offset, y)
    ctx.quadraticCurveTo(x + offset + lean * 0.4, y - height * 0.55, x + offset + lean, y - height)
    ctx.stroke()
    ctx.fillStyle = '#8b6b45'
    ctx.beginPath()
    ctx.ellipse(x + offset + lean, y - height, scale * 0.05, scale * 0.12, lean * 0.002, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawRock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  radius: number,
): void {
  const r = radius * scale
  ctx.fillStyle = 'rgba(109, 64, 46, 0.14)'
  ellipse(ctx, x, y, r * 1.15, r * 0.32)
  ctx.fill()
  ctx.fillStyle = '#b9b49b'
  ellipse(ctx, x, y - r * 0.42, r, r * 0.62)
  ctx.fill()
  ctx.fillStyle = '#d0cbb2'
  ellipse(ctx, x - r * 0.28, y - r * 0.62, r * 0.38, r * 0.22)
  ctx.fill()
}

function drawBobber(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, bite: boolean): void {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)'
  ctx.lineWidth = Math.max(0.8, scale * 0.018)
  ellipse(ctx, x, y, scale * 0.16, scale * 0.05)
  ctx.stroke()
  ctx.fillStyle = '#fff6e3'
  ctx.strokeStyle = '#9a7361'
  ctx.lineWidth = Math.max(0.8, scale * 0.018)
  ctx.beginPath()
  ctx.arc(x, y, scale * 0.075, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = '#c0533a'
  ctx.beginPath()
  ctx.arc(x, y - scale * 0.02, scale * 0.045, 0, Math.PI * 2)
  ctx.fill()
  if (bite) {
    ctx.fillStyle = '#c0533a'
    ctx.font = `700 ${Math.max(13, scale * 0.22)}px ui-rounded, system-ui, sans-serif`
    ctx.textAlign = 'center'
    ctx.fillText('!', x, y - scale * 0.22)
  }
}

function drawPlayer(ctx: CanvasRenderingContext2D, scene: Scene, x: number, y: number, scale: number): void {
  const { world, sprites } = scene
  const height = 1.9 * scale
  const width = height * BUNNY_ASPECT
  ctx.fillStyle = 'rgba(109, 64, 46, 0.18)'
  ellipse(ctx, x, y, width * 0.34, width * 0.1)
  ctx.fill()

  let image: HTMLImageElement | null = null
  if (sprites) {
    if (world.moving) {
      const frames = world.facing === 'left' ? sprites.walkLeft : sprites.walkRight
      if (frames.length > 0) image = frames[Math.floor(scene.walkClock * 7) % frames.length]
    } else {
      image = world.facing === 'left' ? sprites.idleLeft : sprites.idleRight
    }
  }

  if (image && image.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x - width / 2, y - height, width, height)
    return
  }

  ctx.fillStyle = '#fffaf0'
  ellipse(ctx, x, y - height * 0.3, width * 0.3, height * 0.26)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(x - width * 0.15, y - height * 0.65, width * 0.09, height * 0.3, -0.18, 0, Math.PI * 2)
  ctx.ellipse(x + width * 0.15, y - height * 0.65, width * 0.09, height * 0.3, 0.18, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#6d402e'
  const eye = world.facing === 'left' ? -1 : 1
  ctx.beginPath()
  ctx.arc(x + eye * width * 0.1, y - height * 0.38, Math.max(1, width * 0.025), 0, Math.PI * 2)
  ctx.fill()
}

function drawScene(ctx: CanvasRenderingContext2D, width: number, height: number, scene: Scene): void {
  const unit = width / 12
  const yOf = (d: number) => height - feetY(POND_VIEW, d) * unit
  const groundTop = yOf(4)

  const sky = ctx.createLinearGradient(0, 0, 0, groundTop)
  sky.addColorStop(0, '#f9f0da')
  sky.addColorStop(1, '#f4e6c8')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, groundTop + 1)

  ctx.fillStyle = 'rgba(246, 217, 160, 0.55)'
  ctx.beginPath()
  ctx.arc(width * 0.82, height * 0.11, unit * 0.7, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#e3e7ce'
  ctx.beginPath()
  ctx.ellipse(width * 0.25, groundTop + unit * 0.12, unit * 2.7, unit * 0.7, 0, Math.PI, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#d7dfbe'
  ctx.beginPath()
  ctx.ellipse(width * 0.62, groundTop + unit * 0.22, unit * 2.1, unit * 0.55, 0, Math.PI, Math.PI * 2)
  ctx.fill()

  const grass = ctx.createLinearGradient(0, groundTop, 0, height)
  grass.addColorStop(0, '#b5c496')
  grass.addColorStop(0.45, '#a3b785')
  grass.addColorStop(1, '#8fa677')
  ctx.fillStyle = grass
  ctx.fillRect(0, groundTop, width, height - groundTop)

  const pondX = POND_CENTRE.x * unit
  const pondY = yOf(POND_CENTRE.d)
  const pondRx = POND_RADIUS_X * unit
  const depthRatio = (POND_VIEW.farY - POND_VIEW.nearY) / POND_VIEW.depth
  const pondRy = POND_RADIUS_D * depthRatio * unit

  ctx.fillStyle = 'rgba(109, 64, 46, 0.12)'
  ellipse(ctx, pondX, pondY + pondRy * 0.16, pondRx + unit * 0.52, pondRy + unit * 0.34)
  ctx.fill()
  ctx.fillStyle = '#e9dcc2'
  ellipse(ctx, pondX, pondY, pondRx + unit * 0.42, pondRy + unit * 0.3)
  ctx.fill()
  ctx.fillStyle = '#f2e8d2'
  ellipse(ctx, pondX, pondY, pondRx + unit * 0.18, pondRy + unit * 0.13)
  ctx.fill()

  const water = ctx.createLinearGradient(0, pondY - pondRy, 0, pondY + pondRy)
  water.addColorStop(0, '#b9dade')
  water.addColorStop(0.55, '#9dc8cd')
  water.addColorStop(1, '#8ab9c1')
  ctx.fillStyle = water
  ellipse(ctx, pondX, pondY, pondRx, pondRy)
  ctx.fill()
  ctx.strokeStyle = '#7faeb7'
  ctx.lineWidth = Math.max(1, unit * 0.03)
  ctx.stroke()

  ctx.save()
  ellipse(ctx, pondX, pondY, pondRx, pondRy)
  ctx.clip()
  for (let i = 0; i < 4; i++) {
    const phase = scene.still ? 0.3 + i * 0.16 : (scene.time * 0.16 + i * 0.25) % 1
    const size = 0.2 + phase * 0.8
    ctx.strokeStyle = `rgba(247, 252, 244, ${(1 - phase) * 0.32})`
    ctx.lineWidth = Math.max(0.8, unit * 0.018)
    ellipse(ctx, pondX, pondY + (i - 1.5) * pondRy * 0.24, pondRx * size, pondRy * size)
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)'
  ctx.beginPath()
  ctx.ellipse(pondX - pondRx * 0.3, pondY - pondRy * 0.34, pondRx * 0.28, pondRy * 0.12, -0.1, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()

  const drawables: { d: number; draw: () => void }[] = []
  for (const reed of REEDS) {
    const scale = unit * scaleAt(POND_VIEW, reed.d) * 0.85
    drawables.push({
      d: reed.d,
      draw: () => drawReed(ctx, reed.x * unit, yOf(reed.d), scale, reed.stems),
    })
  }
  for (const rock of ROCKS) {
    const scale = unit * scaleAt(POND_VIEW, rock.d) * 0.85
    drawables.push({
      d: rock.d,
      draw: () => drawRock(ctx, rock.x * unit, yOf(rock.d), scale, rock.r),
    })
  }
  if (scene.bobber) {
    const bobber = scene.bobber
    const bite = scene.fishing.phase === 'bite'
    const bob = scene.still ? 0 : Math.sin(scene.time * 3.6) * unit * 0.025
    drawables.push({
      d: bobber.d,
      draw: () =>
        drawBobber(
          ctx,
          bobber.x * unit,
          yOf(bobber.d) + bob + (bite ? unit * 0.05 : 0),
          unit * 0.9,
          bite,
        ),
    })
  }
  drawables.push({
    d: scene.world.player.d,
    draw: () =>
      drawPlayer(
        ctx,
        scene,
        scene.world.player.x * unit,
        yOf(scene.world.player.d),
        unit * scaleAt(POND_VIEW, scene.world.player.d),
      ),
  })
  drawables.sort((a, b) => b.d - a.d)
  for (const item of drawables) item.draw()
}

export default function PondGame({ onClose, onCatch }: PondGameProps) {
  const { play } = useSound()
  const isStill = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const worldRef = useRef<PondWorld>(createPondWorld())
  const fishingRef = useRef<FishingState>(createFishingState())
  const bobberRef = useRef<FloorPoint | null>(null)
  const keysRef = useRef(new Set<string>())
  const spritesRef = useRef<SpriteSet | null>(null)
  const walkClockRef = useRef(0)
  const canCastRef = useRef(false)
  const rewardedRef = useRef(false)
  const catchesRef = useRef(0)
  const toastTimerRef = useRef(0)
  const toastKeyRef = useRef(0)
  const guestNoteShownRef = useRef(false)

  const [sprites, setSprites] = useState<SpriteSet | null>(null)
  const [phase, setPhase] = useState<FishingPhase>('idle')
  const [canCast, setCanCast] = useState(false)
  const [catches, setCatches] = useState(0)
  const [toast, setToast] = useState<Toast | null>(null)

  useEffect(() => {
    spritesRef.current = sprites
  }, [sprites])

  useEffect(() => {
    let cancelled = false
    const { left, right } = manifestJson.bunnyWalk.byFacing
    Promise.all([
      Promise.all(left.map(loadSprite)),
      Promise.all(right.map(loadSprite)),
      loadSprite('bunny-left.png'),
      loadSprite('bunny-right.png'),
    ])
      .then(([walkLeft, walkRight, idleLeft, idleRight]) => {
        if (!cancelled) setSprites({ walkLeft, walkRight, idleLeft, idleRight })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => window.clearTimeout(toastTimerRef.current)
  }, [])

  const showToast = useCallback((message: string, note?: string) => {
    setToast({ message, note })
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), TOAST_MS)
  }, [])

  const handleClose = useCallback(() => {
    if (!rewardedRef.current) {
      rewardedRef.current = true
      if (catchesRef.current > 0) earn('game', { game: 'pond', score: catchesRef.current })
    }
    onClose()
  }, [onClose])

  const doCast = useCallback(() => {
    if (fishingRef.current.phase !== 'idle') return
    const spot = castSpot(worldRef.current.player)
    if (!spot) return
    bobberRef.current = spot
    const next = cast(fishingRef.current)
    fishingRef.current = next
    setPhase(next.phase)
    play('click')
  }, [play])

  const doReel = useCallback(() => {
    const before = fishingRef.current
    const next = reel(before)
    if (next === before) return
    fishingRef.current = next
    setPhase(next.phase)
    if (next.phase === 'caught' && next.fish) {
      const fish = next.fish
      catchesRef.current += 1
      setCatches(catchesRef.current)
      showToast(`You caught a ${fish.name.toLowerCase()}!`)
      onCatch?.(fish.id)
      play('harp')
      const toastKey = ++toastKeyRef.current
      void collect(`prop:fish-${fish.id}`).then((result) => {
        if (toastKeyRef.current !== toastKey) return
        if (result.ok) {
          if (result.collected) {
            showToast(
              `You caught a ${fish.name.toLowerCase()}!`,
              `New for your room: ${fish.name} trophy`,
            )
          }
        } else if (result.reason === 'guest' && !guestNoteShownRef.current) {
          guestNoteShownRef.current = true
          showToast(
            `You caught a ${fish.name.toLowerCase()}!`,
            'Sign in to keep fish trophies for your room',
          )
        }
      })
    } else if (next.phase === 'escaped' && next.escape === 'early') {
      showToast('Too early — it slipped away.')
      play('click')
    }
  }, [onCatch, play, showToast])

  const act = useCallback(() => {
    if (fishingRef.current.phase === 'idle') doCast()
    else doReel()
  }, [doCast, doReel])

  useEffect(() => {
    const isTyping = (target: EventTarget | null) =>
      target instanceof HTMLElement &&
      (target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable)

    const down = (event: KeyboardEvent) => {
      if (isTyping(event.target)) return
      const key = event.key.toLowerCase()
      if (key === ' ' || key === 'spacebar') {
        if (event.repeat) return
        if (event.target instanceof HTMLButtonElement) return
        event.preventDefault()
        act()
        return
      }
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd'].includes(key)) {
        keysRef.current.add(key)
        event.preventDefault()
      }
    }
    const up = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase())
    }
    const blur = () => keysRef.current.clear()

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
    }
  }, [act])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let frame = 0
    let last = performance.now()

    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
      last = now

      const fishing = fishingRef.current
      const canMove = fishing.phase === 'idle' || fishing.phase === 'caught' || fishing.phase === 'escaped'
      const keys = keysRef.current
      const dx = canMove
        ? (keys.has('arrowright') || keys.has('d') ? 1 : 0) -
          (keys.has('arrowleft') || keys.has('a') ? 1 : 0)
        : 0
      const dd = canMove
        ? (keys.has('arrowup') || keys.has('w') ? 1 : 0) -
          (keys.has('arrowdown') || keys.has('s') ? 1 : 0)
        : 0
      const world = step(worldRef.current, { dx, dd }, dt)
      worldRef.current = world
      if (world.moving) walkClockRef.current += dt

      const previousPhase = fishing.phase
      const advanced = tick(fishing, dt)
      if (advanced !== fishing) {
        fishingRef.current = advanced
        if (advanced.phase !== previousPhase) {
          setPhase(advanced.phase)
          if (advanced.phase === 'escaped' && previousPhase === 'bite') {
            showToast('It slipped away…')
            play('click')
          } else if (advanced.phase === 'idle') {
            bobberRef.current = null
          }
        }
      }

      const nextCanCast = castSpot(world.player) !== null && fishingRef.current.phase === 'idle'
      if (nextCanCast !== canCastRef.current) {
        canCastRef.current = nextCanCast
        setCanCast(nextCanCast)
      }

      const bounds = canvas.getBoundingClientRect()
      if (bounds.width > 0 && bounds.height > 0) {
        const dpr = Math.min(3, window.devicePixelRatio || 1)
        const pixelWidth = Math.round(bounds.width * dpr)
        const pixelHeight = Math.round(bounds.height * dpr)
        if (canvas.width !== pixelWidth) canvas.width = pixelWidth
        if (canvas.height !== pixelHeight) canvas.height = pixelHeight
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
          ctx.clearRect(0, 0, bounds.width, bounds.height)
          drawScene(ctx, bounds.width, bounds.height, {
            world,
            fishing: fishingRef.current,
            bobber: bobberRef.current,
            walkClock: walkClockRef.current,
            time: now / 1000,
            sprites: spritesRef.current,
            still: Boolean(isStill),
          })
        }
      }

      frame = window.requestAnimationFrame(loop)
    }

    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [isStill, play, showToast])

  const handlePointerDown = useCallback((event: PointerEvent<HTMLCanvasElement>) => {
    const fishing = fishingRef.current
    if (fishing.phase !== 'idle' && fishing.phase !== 'caught' && fishing.phase !== 'escaped') return
    const canvas = event.currentTarget
    canvas.focus({ preventScroll: true })
    const bounds = canvas.getBoundingClientRect()
    if (bounds.width <= 0 || bounds.height <= 0) return
    const unit = bounds.width / 12
    const x = ((event.clientX - bounds.left) / bounds.width) * 12
    const screenY = (bounds.height - (event.clientY - bounds.top)) / unit
    const d = depthAtY(POND_VIEW, screenY)
    worldRef.current = walkTo(worldRef.current, { x, d })
  }, [])

  const showButton = canCast || phase !== 'idle'
  const buttonLabel = phase === 'idle' ? 'Cast' : 'Reel'
  const buttonDisabled =
    phase === 'idle' ? !canCast : !(phase === 'casting' || phase === 'waiting' || phase === 'bite')
  const hint =
    phase === 'bite'
      ? 'A bite! Press Space or Reel.'
      : phase === 'casting' || phase === 'waiting'
        ? 'Watch the bobber…'
        : phase === 'caught'
          ? 'Caught! Cast again in a moment.'
          : phase === 'escaped'
            ? 'It got away. Try again.'
            : canCast
              ? 'Cast into the pond.'
              : 'Walk to the water’s edge.'

  return (
    <MinigameFrame
      label="Pond"
      onClose={handleClose}
      cardClassName={isStill ? 'pond-game is-still' : 'pond-game'}
      header={
        <>
          <span className="sketchbook-round pond-heading">Pond</span>
          <span className="pond-catch" aria-live="polite">
            {catches} caught
          </span>
        </>
      }
    >
      <div className="pond-stage">
        <canvas
          ref={canvasRef}
          className="pond-canvas"
          tabIndex={0}
          aria-label="Pond scene. Arrow keys or WASD walk, Space casts and reels."
          onPointerDown={handlePointerDown}
        />
        {toast ? (
          <p className="pond-toast" role="status">
            {toast.message}
            {toast.note ? (
              <>
                <br />
                {toast.note}
              </>
            ) : null}
          </p>
        ) : null}
      </div>

      <div className="pond-controls">
        <p className="pond-hint" aria-live="polite">
          {hint}
        </p>
        {showButton ? (
          <button
            type="button"
            className="button pond-cast"
            onClick={act}
            disabled={buttonDisabled}
          >
            {buttonLabel}
          </button>
        ) : null}
      </div>
    </MinigameFrame>
  )
}
