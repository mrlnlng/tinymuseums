import type * as THREE from 'three'

/** What the perf readout shows, also readable as `window.__tmPerf.snapshot()`. */
export interface PerfSnapshot {
  room: string | null
  fps: number
  frameMs: { avg: number; worst: number }
  stageMs: { avg: number; worst: number }
  drawCalls: number
  triangles: number
  textures: number
  geometries: number
  overlayNodes: number
  heapMb: number | null
  /** The last time from opening a room until it was playable. */
  lastOpen: { room: string; ms: number; warm: boolean; viaDoor: boolean } | null
}

export interface PerfMeter {
  frame(frameMs: number, stageMs: number, room: string | null): void
  rendered(info: THREE.WebGLInfo): void
  opened(room: string, ms: number, warm: boolean, viaDoor: boolean): void
  dispose(): void
}

const WINDOW_MS = 1000

function isEnabled(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has('perf')) window.localStorage.setItem('tm:perf', '1')
    return window.localStorage.getItem('tm:perf') === '1'
  } catch {
    return new URLSearchParams(window.location.search).has('perf')
  }
}

/** A small corner readout, turned on with `?perf` (remembered) and off with `?perf=off`. */
export function createPerfMeter(overlay: HTMLElement): PerfMeter {
  try {
    if (new URLSearchParams(window.location.search).get('perf') === 'off') window.localStorage.removeItem('tm:perf')
  } catch {}
  const enabled = isEnabled()

  let frames: { at: number; frameMs: number; stageMs: number }[] = []
  let info = { drawCalls: 0, triangles: 0, textures: 0, geometries: 0 }
  let room: string | null = null
  let lastOpen: PerfSnapshot['lastOpen'] = null

  function snapshot(): PerfSnapshot {
    const now = performance.now()
    frames = frames.filter((f) => now - f.at <= WINDOW_MS)
    const n = Math.max(1, frames.length)
    const sum = (key: 'frameMs' | 'stageMs') => frames.reduce((total, f) => total + f[key], 0)
    const worst = (key: 'frameMs' | 'stageMs') => frames.reduce((most, f) => Math.max(most, f[key]), 0)
    const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory
    return {
      room,
      fps: frames.length,
      frameMs: { avg: sum('frameMs') / n, worst: worst('frameMs') },
      stageMs: { avg: sum('stageMs') / n, worst: worst('stageMs') },
      ...info,
      overlayNodes: overlay.getElementsByTagName('*').length,
      heapMb: memory ? memory.usedJSHeapSize / 2 ** 20 : null,
      lastOpen,
    }
  }

  const global = window as Window & { __tmPerf?: { snapshot(): PerfSnapshot } }
  global.__tmPerf = { snapshot }

  let panel: HTMLElement | null = null
  let timer = 0
  if (enabled) {
    panel = document.createElement('pre')
    panel.className = 'perf-readout'
    panel.setAttribute('aria-hidden', 'true')
    document.body.append(panel)
    const ms = (value: number) => value.toFixed(1)
    timer = window.setInterval(() => {
      const s = snapshot()
      const open = s.lastOpen
        ? `${s.lastOpen.room} ${Math.round(s.lastOpen.ms)}ms${s.lastOpen.warm ? ' warm' : ''}${s.lastOpen.viaDoor ? ' door' : ''}`
        : '-'
      panel!.textContent = [
        `${s.room ?? '-'}  ${s.fps} fps`,
        `frame ${ms(s.frameMs.avg)} / ${ms(s.frameMs.worst)} ms`,
        `stage ${ms(s.stageMs.avg)} / ${ms(s.stageMs.worst)} ms`,
        `draws ${s.drawCalls}  tris ${s.triangles}`,
        `tex ${s.textures}  geo ${s.geometries}`,
        `overlay ${s.overlayNodes}${s.heapMb === null ? '' : `  heap ${Math.round(s.heapMb)}MB`}`,
        `open ${open}`,
      ].join('\n')
    }, 500)
  }

  return {
    frame(frameMs, stageMs, current) {
      room = current
      frames.push({ at: performance.now(), frameMs, stageMs })
      if (frames.length > 240) frames = frames.slice(-120)
    },
    rendered(rendererInfo) {
      info = {
        drawCalls: rendererInfo.render.calls,
        triangles: rendererInfo.render.triangles,
        textures: rendererInfo.memory.textures,
        geometries: rendererInfo.memory.geometries,
      }
    },
    opened(openedRoom, ms, warm, viaDoor) {
      lastOpen = { room: openedRoom, ms, warm, viaDoor }
    },
    dispose() {
      window.clearInterval(timer)
      panel?.remove()
      if (global.__tmPerf?.snapshot === snapshot) delete global.__tmPerf
    },
  }
}
