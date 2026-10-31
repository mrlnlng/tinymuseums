'use client'

import { useEffect, useRef, useState } from 'react'
import { clearRigLayer, createRigLayer, loadRig, type CharacterKind, type Rig } from '../scene/rig'
import { createRigState, stepRigState } from '../scene/rig-motion'

// Development only: N rigs walking at once, each with its own WebGL context or all drawn into
// one layer (?mode=layer|separate&n=8), to measure what remote visitors would cost.
const KINDS: CharacterKind[] = ['bunny', 'cat', 'otter']

interface Stats {
  mode: string
  n: number
  loaded: number
  failed: number
  fps: number
  frameMs: number
  renderMs: number
}

declare global {
  interface Window {
    __crowd?: Stats
  }
}

export default function CrowdPreview() {
  const host = useRef<HTMLDivElement>(null)
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const mode = params.get('mode') === 'separate' ? 'separate' : 'layer'
    const n = Math.max(1, Math.min(16, Number(params.get('n') ?? 8)))
    const box = host.current!.getBoundingClientRect()
    const layer = mode === 'layer' ? createRigLayer() : undefined
    if (layer) {
      layer.domElement.style.cssText = 'position: absolute; top: 0; left: 0'
      layer.setPixelRatio(window.devicePixelRatio)
      layer.setSize(box.width, box.height)
      host.current!.appendChild(layer.domElement)
    }
    const walkers: { rig: Rig; canvas: HTMLCanvasElement | null; motion: ReturnType<typeof createRigState>; x: number; dir: number; pause: number }[] = []
    const result: Stats = { mode, n, loaded: 0, failed: 0, fps: 0, frameMs: 0, renderMs: 0 }
    window.__crowd = result
    let disposed = false
    let frame = 0

    for (let i = 0; i < n; i++) {
      const canvas = layer ? null : document.createElement('canvas')
      if (canvas) {
        canvas.style.cssText = 'position: absolute; bottom: 0; height: 200px; width: auto'
        host.current?.appendChild(canvas)
      }
      const kind = KINDS[i % KINDS.length]
      void loadRig(canvas, kind, layer).then(
        (rig) => {
          if (disposed) return rig.dispose()
          const costume = rig.costumes[i % (rig.costumes.length + 1)] ?? null
          rig.setCostume(costume, costume === 'kiki' ? 'kiki' : null)
          walkers.push({ rig, canvas, motion: createRigState(), x: (i / n) * 300, dir: i % 2 ? 1 : -1, pause: 0 })
          result.loaded++
        },
        () => { result.failed++ },
      )
    }

    let previous = performance.now()
    let frames = 0
    let frameTotal = 0
    let renderTotal = 0
    let windowStart = previous
    function draw(now: number) {
      frame = requestAnimationFrame(draw)
      const dt = Math.min(0.05, (now - previous) / 1000)
      frameTotal += now - previous
      previous = now
      const started = performance.now()
      if (layer) clearRigLayer(layer)
      for (const w of walkers) {
        if (w.pause > 0) w.pause -= dt
        else {
          w.x += w.dir * 60 * dt
          if (w.x < 0 || w.x > 300) { w.dir *= -1; w.pause = Math.random() * 1.5 }
        }
        const moving = w.pause <= 0
        stepRigState(w.motion, dt, moving, w.dir > 0 ? 'right' : 'left', 0.8, w.rig.cycleSeconds)
        w.rig.render(w.motion, dt, 200, window.devicePixelRatio, { left: w.x, top: box.height - 200 })
        if (w.canvas) w.canvas.style.transform = `translateX(${w.x.toFixed(1)}px)`
      }
      renderTotal += performance.now() - started
      frames++
      if (now - windowStart >= 1000) {
        result.fps = Math.round((frames * 1000) / (now - windowStart))
        result.frameMs = +(frameTotal / frames).toFixed(1)
        result.renderMs = +(renderTotal / frames).toFixed(2)
        setStats({ ...result })
        frames = 0
        frameTotal = 0
        renderTotal = 0
        windowStart = now
      }
    }
    frame = requestAnimationFrame(draw)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      for (const w of walkers) { w.rig.dispose(); w.canvas?.remove() }
      layer?.dispose()
      layer?.forceContextLoss()
      layer?.domElement.remove()
    }
  }, [])

  return (
    <main style={{ padding: 16, fontFamily: 'monospace', background: '#f6ead2', minHeight: '100vh' }}>
      <p>
        {stats
          ? `${stats.mode} · ${stats.loaded}/${stats.n} rigs${stats.failed ? ` · ${stats.failed} failed` : ''} · ${stats.fps} fps · frame ${stats.frameMs} ms · rigs ${stats.renderMs} ms`
          : 'loading…'}
      </p>
      <p>
        <a href="?mode=layer&n=8">layer × 8</a> · <a href="?mode=separate&n=8">separate × 8</a> ·{' '}
        <a href="?mode=layer&n=16">layer × 16</a> · <a href="?mode=separate&n=16">separate × 16</a>
      </p>
      <div ref={host} style={{ position: 'relative', height: 260, overflow: 'hidden' }} />
    </main>
  )
}
