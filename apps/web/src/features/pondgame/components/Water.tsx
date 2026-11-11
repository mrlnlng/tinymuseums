'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { assetUrl } from '@/shared/lib/assets'
import Angler from './Angler'
import layout from '../../../../public/assets/pond/layout.json'
import {
  FLIGHT_SECONDS,
  isPerfectPower,
  landingForPower,
  type FishingPhase,
  type FishingState,
  type FishPoint,
  type ReelState,
} from '../lib/machine.ts'
import type { ShadowSize } from '../lib/tables.ts'

/** Stable rod drawing units, with the new painting's aspect ratio. */
const STAGE = { width: 1668 * layout.scene.width / layout.scene.height, height: 1668 }
const SPRITE = { width: 380, height: 552 }
/** The raised right paw in bunny-right.png, measured from the sprite. */
const PAW_IN_SPRITE = { x: 350, y: 238 }

interface Pose {
  /** The bunny's box as fractions of the world: right edge, bottom edge, height. */
  right: number
  bottom: number
  height: number
  rodLength: number
  /** Line weight, so the rod's outline matches the bunny's at either size. */
  ink: number
}

const POSE: Record<'wide' | 'narrow', Pose> = {
  wide: { right: 0.207, bottom: 0.82, height: 0.3, rodLength: 640, ink: 1 },
  // On the bank in front of the water's left lobe (the room's own feet line), far enough right to stay on a phone.
  narrow: { right: 0.24, bottom: 0.895, height: 0.24, rodLength: 580, ink: 0.8 },
}

/** The water's outline, traced from the scene and inset, so shadows never swim onto the grass. */
const WATER_CLIP = `polygon(${layout.water.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(', ')})`

const LILY_STYLE: CSSProperties = {
  left: `${layout.lily.x * 100}%`,
  top: `${layout.lily.y * 100}%`,
  width: `${layout.lily.w * 100}%`,
  height: `${layout.lily.h * 100}%`,
}

interface Point {
  x: number
  y: number
}

function bunnyBox(pose: Pose): { left: number; top: number; width: number; height: number } {
  const width = pose.height * (STAGE.height / STAGE.width) * (SPRITE.width / SPRITE.height)
  return { left: pose.right - width, top: pose.bottom - pose.height, width, height: pose.height }
}

function pawPoint(pose: Pose): Point {
  const box = bunnyBox(pose)
  return {
    x: (box.left + (PAW_IN_SPRITE.x / SPRITE.width) * box.width) * STAGE.width,
    y: (box.top + (PAW_IN_SPRITE.y / SPRITE.height) * box.height) * STAGE.height,
  }
}

const easeOut = (t: number) => 1 - (1 - t) ** 3

/** How far the rod leans back from its resting angle, in degrees, for the moment in the cast. */
function rodAngle(phase: FishingPhase, power: number, flight: number, tension: number): number {
  const rest = 28
  if (phase === 'charging') return rest + 30 * power
  if (phase === 'flying') return rest + 30 * power * (1 - flight) ** 2 - 12 * Math.sin(Math.PI * flight)
  if (phase === 'reeling') return rest - 7 * tension
  if (phase === 'bite') return rest - 4
  return rest
}

function quad(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y }
}

interface Rod {
  outline: string
  nodes: { a: Point; b: Point }[]
  grip: string
  reel: Point
  tip: Point
}

/** A tapered bamboo rod: a bent centre line, widened from butt to tip and outlined like the bunny. */
function buildRod(paw: Point, length: number, ink: number, angleDeg: number, bend: number, pull: Point | null): Rod {
  const angle = (angleDeg * Math.PI) / 180
  const dir = { x: Math.cos(angle), y: -Math.sin(angle) }
  const butt = { x: paw.x - dir.x * length * 0.1, y: paw.y - dir.y * length * 0.1 }
  let tip = { x: paw.x + dir.x * length, y: paw.y + dir.y * length }
  if (pull) {
    const dx = pull.x - tip.x
    const dy = pull.y - tip.y
    const d = Math.hypot(dx, dy) || 1
    const give = length * 0.16 * bend
    tip = { x: tip.x + (dx / d) * give, y: tip.y + (dy / d) * give }
  }
  const normal = { x: dir.y, y: -dir.x }
  const sag = length * (0.035 + 0.09 * bend)
  const control = {
    x: butt.x + (tip.x - butt.x) * 0.55 - normal.x * sag,
    y: butt.y + (tip.y - butt.y) * 0.55 - normal.y * sag,
  }
  const samples = 28
  const left: Point[] = []
  const right: Point[] = []
  const widthAt = (t: number) => (t < 0.18 ? 26 : 24 - 17 * t) * ink
  for (let i = 0; i <= samples; i++) {
    const t = i / samples
    const p = quad(butt, control, tip, t)
    const q = quad(butt, control, tip, Math.min(1, t + 0.01))
    const r = quad(butt, control, tip, Math.max(0, t - 0.01))
    const tx = q.x - r.x
    const ty = q.y - r.y
    const tl = Math.hypot(tx, ty) || 1
    const n = { x: -ty / tl, y: tx / tl }
    const w = widthAt(t) / 2
    left.push({ x: p.x + n.x * w, y: p.y + n.y * w })
    right.push({ x: p.x - n.x * w, y: p.y - n.y * w })
  }
  const outline = `M ${left.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')} L ${right
    .reverse()
    .map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' L ')} Z`

  const nodes = [0.34, 0.47, 0.6, 0.72, 0.84].map((t) => {
    const p = quad(butt, control, tip, t)
    const q = quad(butt, control, tip, t + 0.01)
    const tl = Math.hypot(q.x - p.x, q.y - p.y) || 1
    const n = { x: -(q.y - p.y) / tl, y: (q.x - p.x) / tl }
    const w = widthAt(t) / 2 + 1
    return { a: { x: p.x + n.x * w, y: p.y + n.y * w }, b: { x: p.x - n.x * w, y: p.y - n.y * w } }
  })

  const gripPoints: Point[] = []
  const gripBack: Point[] = []
  for (let i = 0; i <= 6; i++) {
    const t = (i / 6) * 0.2
    const p = quad(butt, control, tip, t)
    const q = quad(butt, control, tip, t + 0.01)
    const tl = Math.hypot(q.x - p.x, q.y - p.y) || 1
    const n = { x: -(q.y - p.y) / tl, y: (q.x - p.x) / tl }
    const w = (34 * ink) / 2
    gripPoints.push({ x: p.x + n.x * w, y: p.y + n.y * w })
    gripBack.push({ x: p.x - n.x * w, y: p.y - n.y * w })
  }
  const grip = `M ${gripPoints.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')} L ${gripBack
    .reverse()
    .map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' L ')} Z`

  const reelAt = quad(butt, control, tip, 0.25)
  const reel = { x: reelAt.x - normal.x * 34 * ink, y: reelAt.y - normal.y * 34 * ink }
  return { outline, nodes, grip, reel, tip }
}

interface Splash {
  id: number
  kind: 'land' | 'nibble' | 'bite'
  at: FishPoint
}

const SPLASH_SCALE: Record<Splash['kind'], number> = { land: 0.9, nibble: 0.45, bite: 1.25 }
const SPLASH_MS: Record<Splash['kind'], number> = { land: 750, nibble: 450, bite: 950 }

interface AmbientShadow {
  id: number
  x: number
  y: number
  size: number
  dx: number
  dy: number
  duration: number
  delay: number
}

function makeAmbient(narrow: boolean): AmbientShadow[] {
  const count = 3 + Math.floor(Math.random() * 3)
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: narrow ? 0.26 + Math.random() * 0.2 : 0.3 + Math.random() * 0.42,
    y: 0.76 + Math.random() * 0.08,
    size: 0.03 + Math.random() * 0.04,
    dx: (Math.random() - 0.5) * 0.14,
    dy: (Math.random() - 0.5) * 0.03,
    duration: 7 + Math.random() * 7,
    delay: -Math.random() * 8,
  }))
}

const SHADOW_CLASS: Record<ShadowSize, string> = {
  tiny: 'is-tiny',
  small: 'is-small',
  big: 'is-big',
  huge: 'is-huge',
}

export interface WaterProps {
  phase: FishingPhase
  power: number
  elapsed: FishingState['elapsed']
  landing: FishPoint
  shadow: ShadowSize | null
  armed: boolean
  nibbleActive: boolean
  reel: ReelState | null
  chest: boolean
  reduced: boolean
  narrow: boolean
  pop: { id: number; text: string } | null
}

export default function Water({
  phase,
  power,
  elapsed,
  landing,
  shadow,
  armed,
  nibbleActive,
  reel,
  chest,
  reduced,
  narrow,
  pop,
}: WaterProps) {
  const pose = POSE[narrow ? 'narrow' : 'wide']
  const box = bunnyBox(pose)
  const [rigPaw, setRigPaw] = useState<{ x: number; y: number } | null | undefined>(undefined)
  const paw = rigPaw ? { x: rigPaw.x * STAGE.width, y: rigPaw.y * STAGE.height } : pawPoint(pose)

  const [ambient, setAmbient] = useState(() => makeAmbient(narrow))
  useEffect(() => {
    setAmbient(makeAmbient(narrow))
  }, [narrow])

  const [approach, setApproach] = useState<FishPoint | null>(null)
  useEffect(() => {
    if (!armed || !shadow) {
      setApproach(null)
      return
    }
    setApproach({ x: narrow ? 0.25 : 0.27, y: 0.83 })
    const frame = requestAnimationFrame(() => {
      setApproach({ x: landing.x - 0.03, y: landing.y + 0.016 })
    })
    return () => cancelAnimationFrame(frame)
  }, [armed, shadow, landing.x, landing.y, narrow])

  const progress = reel?.progress ?? 0
  const tension = reel?.tension ?? 0
  const flight = phase === 'flying' ? Math.min(1, elapsed / FLIGHT_SECONDS) : 1
  const time = typeof performance === 'undefined' ? 0 : performance.now() / 1000
  const still = reduced

  const rest: FishPoint = { x: landing.x - progress * 0.2, y: landing.y + progress * 0.012 }
  const rod = buildRod(paw, pose.rodLength, pose.ink, rodAngle(phase, power, flight, tension), phase === 'reeling' ? tension : 0, phase === 'reeling' ? { x: rest.x * STAGE.width, y: rest.y * STAGE.height } : null)
  const tip = { x: rod.tip.x / STAGE.width, y: rod.tip.y / STAGE.height }

  let bobber: FishPoint = rest
  if (phase === 'flying') {
    const e = easeOut(flight)
    bobber = {
      x: tip.x + (landing.x - tip.x) * e,
      y: tip.y + (landing.y - tip.y) * e - 0.12 * Math.sin(Math.PI * Math.min(1, flight * 1.05)),
    }
  } else if (!still) {
    if (phase === 'waiting') bobber = { x: rest.x, y: rest.y + Math.sin(time * 2.3) * 0.0018 + (nibbleActive ? 0.006 : 0) }
    if (phase === 'bite') bobber = { x: rest.x + Math.sin(time * 40) * 0.0015, y: rest.y + 0.009 }
    if (phase === 'reeling' && reel?.runActive) bobber = { x: rest.x + Math.sin(time * 28) * 0.003 * reel.runDirection, y: rest.y }
  }

  const showBobber =
    phase === 'flying' || phase === 'waiting' || phase === 'bite' || phase === 'reeling' || phase === 'landing'

  const lineEnd = { x: bobber.x * STAGE.width, y: bobber.y * STAGE.height }
  const span = Math.hypot(lineEnd.x - rod.tip.x, lineEnd.y - rod.tip.y)
  const slack = phase === 'flying' ? 0.14 : phase === 'reeling' ? 0.06 * (1 - tension) : phase === 'bite' ? 0.02 : 0.07
  const lineControl = {
    x: (rod.tip.x + lineEnd.x) / 2,
    y: (rod.tip.y + lineEnd.y) / 2 + span * slack,
  }
  const linePath = `M ${rod.tip.x.toFixed(1)} ${rod.tip.y.toFixed(1)} Q ${lineControl.x.toFixed(1)} ${lineControl.y.toFixed(1)} ${lineEnd.x.toFixed(1)} ${lineEnd.y.toFixed(1)}`

  const [splashes, setSplashes] = useState<Splash[]>([])
  const splashId = useRef(0)
  const splashTimers = useRef(new Set<number>())
  const previous = useRef({ phase, nibbleActive })
  useEffect(() => {
    const timers = splashTimers.current
    return () => {
      for (const timer of timers) window.clearTimeout(timer)
      timers.clear()
    }
  }, [])
  useEffect(() => {
    const before = previous.current
    previous.current = { phase, nibbleActive }
    let kind: Splash['kind'] | null = null
    if (phase === 'waiting' && before.phase === 'flying') kind = 'land'
    else if (phase === 'bite' && before.phase !== 'bite') kind = 'bite'
    else if (nibbleActive && !before.nibbleActive) kind = 'nibble'
    if (!kind) return
    const id = ++splashId.current
    const entry: Splash = { id, kind, at: { x: rest.x, y: rest.y } }
    setSplashes((list) => [...list.slice(-3), entry])
    const timer = window.setTimeout(() => {
      splashTimers.current.delete(timer)
      setSplashes((list) => list.filter((item) => item.id !== id))
    }, SPLASH_MS[kind])
    splashTimers.current.add(timer)
    // Splashes fire on phase edges only; the bobber position is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, nibbleActive])

  const lateTell = reel?.lateTell ?? 'none'
  const showAim = phase === 'charging'
  const aim = landingForPower(power, narrow)
  const treasureVisible = Boolean(reel?.treasureRevealed && !reel.treasureGrabbed)

  return (
    <div className={reduced ? 'pond-world is-still' : 'pond-world'} style={{ '--pond-aspect': STAGE.width / STAGE.height } as CSSProperties} aria-hidden="true">
      <img className="pond-scene" src={assetUrl('pond/scene', { density: 3 })} alt="" draggable={false} />
      <img className="pond-sparkles" src={assetUrl('pond/sparkles', { density: 3 })} alt="" draggable={false}
        style={{ left: `${layout.sparkles.x * 100}%`, top: `${layout.sparkles.y * 100}%`, width: `${layout.sparkles.w * 100}%`, height: `${layout.sparkles.h * 100}%` }} />

      <div className="pond-water" style={{ clipPath: WATER_CLIP }}>
        {ambient.map((entry) => (
          <span
            key={entry.id}
            className="pond-shadow is-ambient"
            style={
              {
                left: `${entry.x * 100}%`,
                top: `${entry.y * 100}%`,
                width: `${entry.size * 100}%`,
                '--drift-x': `${entry.dx * 60}vw`,
                '--drift-y': `${entry.dy * 60}vh`,
                animationDuration: `${entry.duration}s`,
                animationDelay: `${entry.delay}s`,
              } as CSSProperties
            }
          />
        ))}
        {armed && shadow && approach ? (
          <span
            className={`pond-shadow is-target ${SHADOW_CLASS[shadow]}`}
            style={{ left: `${approach.x * 100}%`, top: `${approach.y * 100}%` }}
          />
        ) : null}
        {lateTell !== 'none' ? (
          <div className={`pond-glow is-${lateTell}`}>
            {lateTell === 'gold'
              ? Array.from({ length: 7 }, (_, index) => (
                  <span
                    key={index}
                    className="pond-glow-bubble"
                    style={{ left: `${30 + ((index * 9) % 44)}%`, animationDelay: `${index * 0.24}s` } as CSSProperties}
                  />
                ))
              : null}
          </div>
        ) : null}
      </div>

      <img className="pond-lily" src={assetUrl('pond/lily', { density: 3 })} alt="" style={LILY_STYLE} draggable={false} />

      {splashes.map((splash) => {
        const scale = SPLASH_SCALE[splash.kind]
        const w = layout.splash.w * scale
        const h = layout.splash.h * scale
        return (
          <img
            key={splash.id}
            className={`pond-splash is-${splash.kind}`}
            src={assetUrl('pond/splash', { density: 3 })}
            alt=""
            style={{
              left: `${(splash.at.x - w / 2) * 100}%`,
              top: `${(splash.at.y - h * 0.86) * 100}%`,
              width: `${w * 100}%`,
              height: `${h * 100}%`,
              animationDuration: `${SPLASH_MS[splash.kind]}ms`,
            }}
            draggable={false}
          />
        )
      })}

      {showAim ? (
        <span
          className={isPerfectPower(power) ? 'pond-aim is-perfect' : 'pond-aim'}
          style={{ left: `${aim.x * 100}%`, top: `${aim.y * 100}%` }}
        />
      ) : null}

      {treasureVisible ? (
        <span className="pond-treasure-bubble" style={{ left: `${bobber.x * 100 + 3}%`, top: `${bobber.y * 100 - 4}%` }} />
      ) : null}

      {chest ? <span className="pond-chest-fly" /> : null}

      <svg className="pond-rod" style={{ visibility: rigPaw === undefined ? 'hidden' : undefined }} viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="pond-bamboo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e0b077" />
            <stop offset="0.55" stopColor="#c48a52" />
            <stop offset="1" stopColor="#9a6538" />
          </linearGradient>
        </defs>
        <path d={rod.outline} fill="url(#pond-bamboo)" stroke="#3f2a22" strokeWidth={7 * pose.ink} strokeLinejoin="round" />
        {rod.nodes.map((node, index) => (
          <line
            key={index}
            x1={node.a.x}
            y1={node.a.y}
            x2={node.b.x}
            y2={node.b.y}
            stroke="#6e4527"
            strokeWidth={6 * pose.ink}
            strokeLinecap="round"
          />
        ))}
        <path d={rod.grip} fill="#dcb47d" stroke="#3f2a22" strokeWidth={7 * pose.ink} strokeLinejoin="round" />
        <g transform={`translate(${rod.reel.x} ${rod.reel.y}) scale(${pose.ink * 1.35})`}>
          <line x1="0" y1="-14" x2="0" y2="0" stroke="#3f2a22" strokeWidth="6" strokeLinecap="round" />
          <circle r="17" fill="#f2ebdf" stroke="#3f2a22" strokeWidth="5" />
          <circle r="6" fill="#c9bba3" stroke="#3f2a22" strokeWidth="3" />
          <line
            x1="0"
            y1="0"
            x2="15"
            y2="12"
            stroke="#3f2a22"
            strokeWidth="5"
            strokeLinecap="round"
            transform={phase === 'reeling' && reel?.holding && !still ? `rotate(${(time * 720) % 360})` : undefined}
          />
        </g>
        <circle cx={rod.tip.x} cy={rod.tip.y} r={6 * pose.ink} fill="#3f2a22" />
        {showBobber ? (
          <path className={reel?.runActive ? 'pond-line is-shaking' : 'pond-line'} d={linePath} fill="none" vectorEffect="non-scaling-stroke" />
        ) : null}
      </svg>

      <Angler box={box} reduced={reduced} onPaw={setRigPaw} />

      {showBobber ? (
        <>
          <span
            className={phase === 'bite' ? 'pond-bobber is-bite' : 'pond-bobber'}
            style={{ left: `${bobber.x * 100}%`, top: `${bobber.y * 100}%` }}
          />
          {nibbleActive || phase === 'bite' ? (
            <span
              key={`ring-${nibbleActive ? 'nibble' : 'bite'}`}
              className={phase === 'bite' ? 'pond-ring is-bite' : 'pond-ring'}
              style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100}%` }}
            />
          ) : null}
          {phase === 'bite' ? (
            <span className="pond-bang" style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100 - 11}%` }}>
              !
            </span>
          ) : null}
        </>
      ) : null}

      {pop ? (
        <span key={pop.id} className="pond-pop" style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100 - 7}%` }}>
          {pop.text}
        </span>
      ) : null}
    </div>
  )
}
