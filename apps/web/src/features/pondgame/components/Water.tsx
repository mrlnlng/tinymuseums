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
}

const POSE: Record<'wide' | 'narrow', Pose> = {
  wide: { right: 0.207, bottom: 0.82, height: 0.3, rodLength: 640 },
  // On the bank in front of the water's left lobe (the room's own feet line), far enough right to stay on a phone.
  narrow: { right: 0.24, bottom: 0.895, height: 0.24, rodLength: 580 },
}

/** The water's outline, traced from the scene and inset, so shadows never swim onto the grass. */
const WATER_CLIP = `polygon(${layout.water.map(([x, y]) => `${x * 100}% ${y * 100}%`).join(', ')})`

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

const REST_LEAN = 28
/** How much of the rod's swing comes from the arm; the wrist does the rest. */
const ARM_SHARE = 0.55

/** How far the rod leans back from its resting angle, in degrees, for the moment in the cast. */
function rodAngle(phase: FishingPhase, power: number, flight: number, tension: number): number {
  const rest = REST_LEAN
  if (phase === 'charging') return rest + 30 * power
  if (phase === 'flying') return rest + 30 * power * (1 - flight) ** 2 - 12 * Math.sin(Math.PI * flight)
  if (phase === 'reeling') return rest - 7 * tension
  if (phase === 'bite') return rest - 4
  return rest
}

/** The painted rod, measured in its own pixels: where the paw holds it and where the line leaves. */
const ROD = layout.rod
const ROD_GRIP = { x: ROD.grip.x * ROD.width, y: ROD.grip.y * ROD.height }
const ROD_TIP = { x: ROD.tip.x * ROD.width, y: ROD.tip.y * ROD.height }
const ROD_REACH = Math.hypot(ROD_TIP.x - ROD_GRIP.x, ROD_TIP.y - ROD_GRIP.y)
/** The angle the rod is drawn at, in degrees above the horizon. */
const ROD_DRAWN = (Math.atan2(ROD_GRIP.y - ROD_TIP.y, ROD_TIP.x - ROD_GRIP.x) * 180) / Math.PI

function box(entry: { x: number; y: number; w: number; h: number }): CSSProperties {
  return { left: `${entry.x * 100}%`, top: `${entry.y * 100}%`, width: `${entry.w * 100}%`, height: `${entry.h * 100}%` }
}

const LEFT_STYLE: CSSProperties = {
  right: `${(1 - layout.left.overlap) * 100}%`,
  width: `${layout.left.w * 100}%`,
}

/** Where the catch bucket stands on the bank: its foot, and its height, as fractions of the world. */
const BUCKET: Record<'wide' | 'narrow', { x: number; bottom: number; height: number }> = {
  wide: { x: 0.9, bottom: 0.865, height: 0.2 },
  narrow: { x: 0.345, bottom: 0.985, height: 0.115 },
}
const BUCKET_ASPECT = 777 / 774

const SIGN_ASPECT = 1366 / 1156
const SCORE_ASPECT = 922 / 1070
/** The pond's name hangs low over the bridge, just covering its middle post, and the day's tally is staked beside it. */
const SIGN_WIDTH = 0.25
const SIGN_STYLE: CSSProperties = {
  left: `${(layout.bridge.x + layout.bridge.w / 2 - SIGN_WIDTH / 2) * 100}%`,
  bottom: `${(1 - layout.bridge.y - 0.01) * 100}%`,
  width: `${SIGN_WIDTH * 100}%`,
  aspectRatio: SIGN_ASPECT,
}
const SCORE_STYLE: CSSProperties = {
  left: `${(layout.bridge.x + layout.bridge.w + 0.004) * 100}%`,
  bottom: `${(1 - layout.bridge.y - layout.bridge.h - 0.012) * 100}%`,
  width: '14%',
  aspectRatio: SCORE_ASPECT,
}
/** A phone sees only the left of the painting, so both signs move in beside the angler. */
const SIGN_STYLE_NARROW: CSSProperties = { ...SIGN_STYLE, left: '13.5%', width: '20%' }
const SCORE_STYLE_NARROW: CSSProperties = { ...SCORE_STYLE, left: '34.5%', bottom: '54.5%', width: '12%' }

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

interface Glint {
  id: number
  x: number
  y: number
  width: number
  duration: number
  delay: number
}

function makeGlints(narrow: boolean): Glint[] {
  return Array.from({ length: narrow ? 5 : 8 }, (_, id) => ({
    id,
    x: narrow ? 0.24 + Math.random() * 0.26 : 0.3 + Math.random() * 0.44,
    y: 0.735 + Math.random() * 0.12,
    width: 0.022 + Math.random() * 0.03,
    duration: 3.6 + Math.random() * 3.4,
    delay: -Math.random() * 7,
  }))
}

interface Petal {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  sway: number
}

/** Blossom from the trees on the left, let go a petal at a time. */
function makePetals(): Petal[] {
  return Array.from({ length: 9 }, (_, id) => ({
    id,
    x: 0.02 + Math.random() * 0.4,
    y: 0.04 + Math.random() * 0.24,
    size: 0.006 + Math.random() * 0.005,
    duration: 9 + Math.random() * 8,
    delay: -Math.random() * 17,
    sway: 0.04 + Math.random() * 0.07,
  }))
}

/** The line warms from white to red as it nears breaking. */
function lineColour(tension: number): string {
  const t = Math.max(0, Math.min(1, (tension - 0.45) / 0.45))
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t)
  return `rgb(${mix(244, 255)} ${mix(250, 92)} ${mix(248, 70)})`
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
  /** Fish landed this visit; the bucket hops when it goes up. */
  catches: number
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
  catches,
}: WaterProps) {
  const pose = POSE[narrow ? 'narrow' : 'wide']
  const bunny = bunnyBox(pose)
  const bucket = BUCKET[narrow ? 'narrow' : 'wide']
  const [rigPaw, setRigPaw] = useState<{ x: number; y: number } | null | undefined>(undefined)
  const paw = rigPaw ? { x: rigPaw.x * STAGE.width, y: rigPaw.y * STAGE.height } : pawPoint(pose)

  const [ambient, setAmbient] = useState(() => makeAmbient(narrow))
  useEffect(() => {
    setAmbient(makeAmbient(narrow))
  }, [narrow])

  const [glints, setGlints] = useState(() => makeGlints(narrow))
  useEffect(() => {
    setGlints(makeGlints(narrow))
  }, [narrow])
  const [petals] = useState(makePetals)

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
  const lean = rodAngle(phase, power, flight, tension)
  const leanRad = (lean * Math.PI) / 180
  const rodTip = { x: paw.x + Math.cos(leanRad) * pose.rodLength, y: paw.y - Math.sin(leanRad) * pose.rodLength }
  const rodScale = pose.rodLength / ROD_REACH
  const rodStyle: CSSProperties = {
    left: `${((paw.x - ROD_GRIP.x * rodScale) / STAGE.width) * 100}%`,
    top: `${((paw.y - ROD_GRIP.y * rodScale) / STAGE.height) * 100}%`,
    width: `${((ROD.width * rodScale) / STAGE.width) * 100}%`,
    transformOrigin: `${ROD.grip.x * 100}% ${ROD.grip.y * 100}%`,
    transform: `rotate(${(ROD_DRAWN - lean).toFixed(2)}deg)`,
    visibility: rigPaw === undefined ? 'hidden' : undefined,
  }
  const tip = { x: rodTip.x / STAGE.width, y: rodTip.y / STAGE.height }

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
  const span = Math.hypot(lineEnd.x - rodTip.x, lineEnd.y - rodTip.y)
  const slack = phase === 'flying' ? 0.14 : phase === 'reeling' ? 0.06 * (1 - tension) : phase === 'bite' ? 0.02 : 0.07
  const lineControl = {
    x: (rodTip.x + lineEnd.x) / 2,
    y: (rodTip.y + lineEnd.y) / 2 + span * slack,
  }
  const linePath = `M ${rodTip.x.toFixed(1)} ${rodTip.y.toFixed(1)} Q ${lineControl.x.toFixed(1)} ${lineControl.y.toFixed(1)} ${lineEnd.x.toFixed(1)} ${lineEnd.y.toFixed(1)}`

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
    else if (phase === 'landing' && before.phase === 'reeling') kind = 'bite'
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
      {narrow ? null : <img className="pond-scene pond-scene-left" src={assetUrl('pond/scene-left', { density: 3 })} alt="" style={LEFT_STYLE} draggable={false} />}
      <img className="pond-scene" src={assetUrl('pond/scene', { density: 3 })} alt="" draggable={false} />
      <img className="pond-bridge" src={assetUrl('pond/bridge', { density: 3 })} alt="" style={box(layout.bridge)} draggable={false} />
      <img className="pond-sign" src={assetUrl('pond/pond-sign', { density: 3 })} alt="" style={narrow ? SIGN_STYLE_NARROW : SIGN_STYLE} draggable={false} />
      <div className="pond-score" style={narrow ? SCORE_STYLE_NARROW : SCORE_STYLE}>
        <img src={assetUrl('pond/score-sign', { density: 3 })} alt="" draggable={false} />
        <span key={catches} className={catches > 0 ? 'pond-score-count is-fresh' : 'pond-score-count'}>{catches}</span>
      </div>
      <img className="pond-sparkles" src={assetUrl('pond/sparkles', { density: 3 })} alt="" style={box(layout.sparkles)} draggable={false} />

      <div className="pond-water" style={{ clipPath: WATER_CLIP }}>
        {glints.map((glint) => (
          <span
            key={`glint-${glint.id}`}
            className="pond-glint"
            style={{
              left: `${glint.x * 100}%`,
              top: `${glint.y * 100}%`,
              width: `${glint.width * 100}%`,
              animationDuration: `${glint.duration}s`,
              animationDelay: `${glint.delay}s`,
            }}
          />
        ))}
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
            className={`pond-shadow is-target ${SHADOW_CLASS[shadow]}${phase === 'reeling' ? (reel?.runActive ? ' is-running' : ' is-hooked') : ''}`}
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

      <img className="pond-lily" src={assetUrl('pond/lily', { density: 3 })} alt="" style={box(layout.lily)} draggable={false} />

      {phase === 'bite' ? <span className="pond-focus" style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100}%` }} /> : null}

      {phase === 'waiting' && !nibbleActive ? (
        <span className="pond-ripples" style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100}%` }}>
          <i />
          <i />
        </span>
      ) : null}

      {phase === 'reeling' ? (
        <span
          className={reel?.runActive ? 'pond-churn is-run' : 'pond-churn'}
          style={{ left: `${bobber.x * 100}%`, top: `${rest.y * 100}%`, '--pull': Math.max(0.25, tension).toFixed(2) } as CSSProperties}
        >
          <i />
          <i />
          <i />
        </span>
      ) : null}

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

      <img
        key={`bucket-${catches}`}
        className={catches > 0 ? 'pond-bucket is-fresh' : 'pond-bucket'}
        src={assetUrl('pond/bucket', { density: 3 })}
        alt=""
        style={{
          left: `${bucket.x * 100}%`,
          top: `${(bucket.bottom - bucket.height) * 100}%`,
          height: `${bucket.height * 100}%`,
          aspectRatio: BUCKET_ASPECT,
        }}
        draggable={false}
      />

      <img className="pond-rod-art" src={assetUrl('pond/rod', { density: 3 })} alt="" style={rodStyle} draggable={false} />
      {showBobber ? (
        <svg className="pond-rod" viewBox={`0 0 ${STAGE.width} ${STAGE.height}`} preserveAspectRatio="none" aria-hidden="true">
          <path
            className={reel?.runActive ? 'pond-line is-shaking' : 'pond-line'}
            d={linePath}
            fill="none"
            vectorEffect="non-scaling-stroke"
            style={phase === 'reeling' ? { stroke: lineColour(tension), strokeWidth: `${(1.8 + tension * 1.4).toFixed(2)}px` } : undefined}
          />
        </svg>
      ) : null}

      <Angler box={bunny} reduced={reduced} swing={(lean - REST_LEAN) * ARM_SHARE} onPaw={setRigPaw} />

      {showBobber ? (
        <>
          <img
            className={phase === 'bite' ? 'pond-bobber is-bite' : phase === 'flying' ? 'pond-bobber is-flying' : 'pond-bobber'}
            src={assetUrl(phase === 'flying' ? 'pond/float-hook' : 'pond/float', { density: 3 })}
            alt=""
            style={{ left: `${bobber.x * 100}%`, top: `${bobber.y * 100}%` }}
            draggable={false}
          />
          {nibbleActive || phase === 'bite' ? (
            <span
              key={`ring-${nibbleActive ? 'nibble' : 'bite'}`}
              className={phase === 'bite' ? 'pond-ring is-bite' : 'pond-ring'}
              style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100}%` }}
            />
          ) : null}
          {phase === 'bite' ? (
            <span className="pond-bang" style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100 - 9}%` }}>
              <b>!</b>
            </span>
          ) : null}
        </>
      ) : null}

      {reduced
        ? null
        : petals.map((petal) => (
            <span
              key={`petal-${petal.id}`}
              className="pond-petal"
              style={
                {
                  left: `${petal.x * 100}%`,
                  top: `${petal.y * 100}%`,
                  width: `${petal.size * 100}%`,
                  '--sway': `${petal.sway * 60}vw`,
                  animationDuration: `${petal.duration}s`,
                  animationDelay: `${petal.delay}s`,
                } as CSSProperties
              }
            />
          ))}

      {pop ? (
        <span key={pop.id} className="pond-pop" style={{ left: `${rest.x * 100}%`, top: `${rest.y * 100 - 7}%` }}>
          {pop.text}
        </span>
      ) : null}
    </div>
  )
}
