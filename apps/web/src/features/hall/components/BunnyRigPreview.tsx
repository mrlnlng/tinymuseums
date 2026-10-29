'use client'

import { useEffect, useRef, useState } from 'react'
import { loadBunnyRig } from '../scene/bunny-rig'

export default function BunnyRigPreview() {
  const host = useRef<HTMLDivElement>(null)
  const playback = useRef({ phase: 0, playing: true, facing: 'right' as 'left' | 'right' })
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')
  const [playing, setPlaying] = useState(true)
  const [facing, setFacing] = useState<'left' | 'right'>('right')

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.style.cssText = 'height: min(65vh, 593px); width: auto; display: block; margin: auto'
    host.current?.appendChild(canvas)
    let disposed = false
    let frame = 0
    let teardown = () => {}
    void loadBunnyRig(canvas).then((rig) => {
      if (disposed) { rig.dispose(); return }
      teardown = rig.dispose
      let previous = performance.now()
      function draw(now: number) {
        const dt = Math.min(0.05, (now - previous) / 1000)
        previous = now
        const state = playback.current
        if (state.playing) state.phase = (state.phase + dt) % 1
        rig.render(state.phase, state.facing, 593, window.devicePixelRatio)
        canvas.dataset.phase = String(state.phase)
        canvas.dataset.facing = state.facing
        frame = requestAnimationFrame(draw)
      }
      frame = requestAnimationFrame(draw)
      setReady(true)
    }).catch((failure) => { if (!disposed) setError(String(failure)) })
    return () => { disposed = true; cancelAnimationFrame(frame); teardown(); canvas.remove() }
  }, [])

  return (
    <main style={{ minHeight: '100vh', padding: 24, background: '#f5f0e8', textAlign: 'center' }}>
      <h1>Bunny rig — approved v4 walk</h1>
      <p>{error || (ready ? 'Loaded directly from the supplied GLB' : 'Loading rig…')}</p>
      <div ref={host} data-testid="rig-preview" />
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', padding: 16 }}>
        <button onClick={() => {
          playback.current.playing = !playing
          setPlaying(!playing)
        }}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => {
          const next = facing === 'right' ? 'left' : 'right'
          playback.current.facing = next
          setFacing(next)
        }}>Face {facing === 'right' ? 'left' : 'right'}</button>
        <label>Pose <input aria-label="Walk phase" type="range" min="0" max="100" defaultValue="0" onChange={(event) => {
          playback.current.phase = Number(event.target.value) / 100
          playback.current.playing = false
          setPlaying(false)
        }} /></label>
      </div>
      <a href="/museum">Open the museum</a>
    </main>
  )
}
