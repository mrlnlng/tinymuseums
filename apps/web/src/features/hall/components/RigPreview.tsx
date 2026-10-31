'use client'

import { useEffect, useRef, useState } from 'react'
import { assetUrl } from '@/shared/lib/assets'
import { CONFIG } from '../scene/config'
import { loadRig, type CharacterKind, type Rig, type RigAttachmentPose } from '../scene/rig'
import { createRigState, rigFacing, stepRigState } from '../scene/rig-motion'

// The hall's carried props, drawn with the same anchors and maths as Character.attach.
const PROPS = [
  { name: 'helm' as const, attachment: CONFIG.helm.worn },
  { name: 'matcha' as const, attachment: CONFIG.matcha.held },
]

const NEXT: Record<CharacterKind, CharacterKind> = { bunny: 'cat', cat: 'otter', otter: 'bunny' }

export default function RigPreview() {
  const host = useRef<HTMLDivElement>(null)
  const playback = useRef({ scrub: null as number | null, playing: true, facing: 'right' as 'left' | 'right' })
  const rigRef = useRef<Rig | null>(null)
  const [kind, setKind] = useState<CharacterKind>('bunny')
  const [costume, setCostume] = useState<string | null>(null)
  const [costumes, setCostumes] = useState<readonly string[]>([])
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState(true)
  const [facing, setFacing] = useState<'left' | 'right'>('right')
  const [props, setProps] = useState(false)
  const propsRef = useRef(false)
  propsRef.current = props

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'width: 100%; height: auto; max-height: 65vh; object-fit: contain; display: block; margin: auto'
    canvas.dataset.kind = kind
    host.current?.appendChild(canvas)
    const images = PROPS.map((prop) => {
      const image = document.createElement('img')
      image.src = assetUrl(prop.name)
      image.alt = ''
      image.dataset.prop = prop.name
      image.style.cssText = 'position: absolute; top: 0; left: 0; transform-origin: 0 0; pointer-events: none'
      host.current?.appendChild(image)
      return image
    })
    const pose: RigAttachmentPose = { x: 0, y: 0, width: 0, rotation: 0 }
    let disposed = false
    let frame = 0
    let teardown = () => {}
    setError('')
    void loadRig(canvas, kind).then((rig) => {
      if (disposed) { rig.dispose(); return }
      rigRef.current = rig
      setCostumes(rig.costumes)
      teardown = rig.dispose
      const motion = createRigState()
      let previous = performance.now()
      function draw(now: number) {
        const dt = Math.min(0.05, (now - previous) / 1000)
        previous = now
        const state = playback.current
        stepRigState(motion, dt, state.playing, state.facing, 1, rig.cycleSeconds)
        // Scrubbing holds the full walk pose at the chosen phase.
        if (state.scrub !== null) {
          motion.phase = state.scrub
          motion.walk = 1
        }
        rig.render(motion, dt, 593, window.devicePixelRatio)
        const box = canvas.getBoundingClientRect()
        const origin = host.current?.getBoundingClientRect()
        const k = box.height / 593
        // object-fit: contain letterboxes the drawing inside a capped box.
        const inset = (box.width - box.height * (canvas.width / canvas.height)) / 2
        PROPS.forEach((prop, i) => {
          const image = images[i]
          const anchor = prop.attachment.rig[kind]
          image.hidden = !propsRef.current || !rig.projectAttachment(anchor, pose)
          if (image.hidden || !origin) return
          const flip = rigFacing(motion) === prop.attachment.facing ? 1 : -1
          const width = pose.width * k
          const height = width * (image.naturalHeight / Math.max(1, image.naturalWidth))
          image.style.width = `${width}px`
          image.style.transform =
            `translate(${box.left - origin.left + inset + pose.x * k}px, ${box.top - origin.top + pose.y * k}px)` +
            ` scale(${flip}, 1) rotate(${anchor.rotation + pose.rotation / flip}deg) translate(${-width / 2}px, ${-height / 2}px)`
        })
        canvas.dataset.phase = String(motion.phase)
        canvas.dataset.facing = state.facing
        canvas.dataset.ready = 'true'
        frame = requestAnimationFrame(draw)
      }
      frame = requestAnimationFrame(draw)
    }).catch((failure) => { if (!disposed) setError(String(failure)) })
    return () => {
      disposed = true
      rigRef.current = null
      cancelAnimationFrame(frame)
      teardown()
      canvas.remove()
      for (const image of images) image.remove()
    }
  }, [kind])

  useEffect(() => {
    rigRef.current?.setCostume(costume)
    const canvas = host.current?.querySelector('canvas')
    if (canvas) canvas.dataset.costume = costume ?? ''
  }, [costume, costumes])

  return (
    <main style={{ minHeight: '100vh', padding: 24, background: '#f5f0e8', textAlign: 'center' }}>
      <h1>Character rigs</h1>
      <p>{error || 'Loaded from the supplied GLBs'}</p>
      <div ref={host} data-testid="rig-preview" style={{ position: 'relative' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center', padding: 16 }}>
        <button onClick={() => setKind(NEXT[kind])}>
          Show {NEXT[kind]}
        </button>
        <select aria-label="Costume" value={costume ?? ''} onChange={(event) => setCostume(event.target.value || null)}>
          <option value="">No costume</option>
          {costumes.map((id) => <option key={id} value={id}>{id}</option>)}
        </select>
        <label><input type="checkbox" checked={props} onChange={(event) => setProps(event.target.checked)} /> Helmet and cup</label>
        <button onClick={() => {
          playback.current.playing = !playing
          playback.current.scrub = null
          setPlaying(!playing)
        }}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => {
          const next = facing === 'right' ? 'left' : 'right'
          playback.current.facing = next
          setFacing(next)
        }}>Face {facing === 'right' ? 'left' : 'right'}</button>
        <label>Pose <input aria-label="Walk phase" type="range" min="0" max="100" defaultValue="0" onChange={(event) => {
          playback.current.scrub = Number(event.target.value) / 100
          playback.current.playing = false
          setPlaying(false)
        }} /></label>
      </div>
      <a href="/museum">Open the museum</a>
    </main>
  )
}
