'use client'

import { useEffect, useRef } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import { runLandingCat } from './cat'

const POKEABLE = '[data-poke], .landing-cat, .landing-perfume, .landing-jewelry, .landing-book'

type Mote = { x: number; y: number; r: number; vy: number; phase: number; speed: number; alpha: number }

type Mist = { x: number; y: number; vx: number; vy: number; age: number; life: number; r: number; alpha: number }

function glowSprite(): HTMLCanvasElement {
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 64
  const g = sprite.getContext('2d')!
  const fill = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  fill.addColorStop(0, 'rgba(255, 240, 205, 1)')
  fill.addColorStop(0.25, 'rgba(255, 226, 170, 0.55)')
  fill.addColorStop(1, 'rgba(255, 210, 150, 0)')
  g.fillStyle = fill
  g.fillRect(0, 0, 64, 64)
  return sprite
}

function mistSprite(): HTMLCanvasElement {
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 64
  const g = sprite.getContext('2d')!
  const fill = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  fill.addColorStop(0, 'rgba(255, 247, 250, 0.95)')
  fill.addColorStop(0.45, 'rgba(255, 214, 232, 0.55)')
  fill.addColorStop(1, 'rgba(255, 198, 222, 0)')
  g.fillStyle = fill
  g.fillRect(0, 0, 64, 64)
  return sprite
}

export default function LandingFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { isEnabled, volume } = useSound()
  const soundRef = useRef({ isEnabled, volume })
  soundRef.current = { isEnabled, volume }

  useEffect(() => {
    const canvas = canvasRef.current
    const root = canvas?.closest<HTMLElement>('.landing')
    const g = canvas?.getContext('2d')
    if (!canvas || !root || !g) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprite = glowSprite()
    const mist = mistSprite()
    let width = 0
    let height = 0
    let unit = 1
    let motes: Mote[] = []
    let puffs: Mist[] = []
    let audioCtx: AudioContext | null = null

    function resize(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = root!.clientWidth
      height = root!.clientHeight
      unit = width > height ? Math.min(width / 100, height / 56.25) : Math.min(width / 100, height / 200) * 2.4
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      g!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(32, Math.max(12, (width * height) / 30000)))
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (0.35 + Math.random() ** 2 * 1.5) * unit * 0.24,
        vy: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.8,
        alpha: 0.06 + Math.random() * 0.26,
      }))
    }

    // The camera follows a mouse; when the pointer rests, it eases back to centre.
    let pointerAt = -Infinity
    let targetX = 0
    let targetY = 0
    let camX = 0
    let camY = 0

    function onPointerMove(event: PointerEvent): void {
      if (event.pointerType !== 'mouse') return
      const frame = root!.getBoundingClientRect()
      targetX = ((event.clientX - frame.left) / frame.width) * 2 - 1
      targetY = ((event.clientY - frame.top) / frame.height) * 2 - 1
      pointerAt = performance.now()
    }

    // A short band-passed noise burst, made on the spot so it stays a gesture sound.
    function psst(): void {
      const { isEnabled, volume } = soundRef.current
      if (!isEnabled || volume <= 0) return
      const Ctor =
        window.AudioContext ??
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!Ctor) return
      try {
        audioCtx ??= new Ctor()
      } catch {
        return
      }
      const ctx = audioCtx
      if (!ctx) return
      if (ctx.state === 'suspended') void ctx.resume().catch(() => {})

      const seconds = 0.25
      const length = Math.max(1, Math.round(ctx.sampleRate * seconds))
      const noise = ctx.createBuffer(1, length, ctx.sampleRate)
      const samples = noise.getChannelData(0)
      for (let i = 0; i < length; i += 1) samples[i] = Math.random() * 2 - 1

      const source = ctx.createBufferSource()
      source.buffer = noise
      const band = ctx.createBiquadFilter()
      band.type = 'bandpass'
      band.frequency.value = 2600
      band.Q.value = 0.9
      const gain = ctx.createGain()
      const now = ctx.currentTime
      const peak = 0.2 * (0.4 + volume * 0.6)
      gain.gain.setValueAtTime(0.0001, now)
      gain.gain.exponentialRampToValueAtTime(peak, now + 0.025)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25)
      source.connect(band)
      band.connect(gain)
      gain.connect(ctx.destination)
      source.start(now)
      source.stop(now + 0.26)
    }

    function spawnMist(target: HTMLElement): void {
      const frame = root!.getBoundingClientRect()
      const rect = target.getBoundingClientRect()
      const x = rect.left - frame.left + rect.width * 0.52
      const y = rect.top - frame.top + rect.height * 0.1
      for (let i = 0; i < 22; i += 1) {
        const spread = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5
        puffs.push({
          x: x + (Math.random() - 0.5) * rect.width * 0.14,
          y: y + (Math.random() - 0.5) * rect.height * 0.06,
          vx: spread * 0.4 * rect.width,
          vy: -(0.45 + Math.random() * 0.7) * rect.height,
          age: 0,
          life: 0.75 + Math.random() * 0.45,
          r: (0.03 + Math.random() * 0.05) * rect.width,
          alpha: 0.18 + Math.random() * 0.3,
        })
      }
    }

    function onClick(event: MouseEvent): void {
      const target = event.target as Element

      const start = target.closest('a.landing-button.is-start')
      if (start) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        const frame = root!.getBoundingClientRect()
        const x = event.clientX - frame.left
        const y = event.clientY - frame.top
        root!.style.setProperty('--leave-x', `${x}px`)
        root!.style.setProperty('--leave-y', `${y}px`)
        root!.classList.add('is-leaving')
        return
      }

      const poked = target.closest<HTMLElement>(POKEABLE)
      if (!poked) return
      poked.classList.remove('is-poked')
      void poked.offsetWidth
      poked.classList.add('is-poked')
      if (poked.classList.contains('landing-perfume')) {
        psst()
        if (!still) spawnMist(poked)
      }
    }

    let frameId = 0
    let last = performance.now()

    let lastX = ''
    let lastY = ''

    function tick(now: number): void {
      frameId = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000

      if (now - pointerAt > 4000) {
        targetX = 0
        targetY = 0
      }
      const ease = 1 - Math.exp(-dt * 2.2)
      camX += (targetX - camX) * ease
      camY += (targetY - camY) * ease
      const x = camX.toFixed(4)
      const y = camY.toFixed(4)
      if (x !== lastX) root!.style.setProperty('--px', x)
      if (y !== lastY) root!.style.setProperty('--py', y)
      lastX = x
      lastY = y

      g!.clearRect(0, 0, width, height)
      g!.globalCompositeOperation = 'lighter'

      for (const mote of motes) {
        mote.y -= mote.vy * unit * dt
        mote.x += Math.sin(t * mote.speed + mote.phase) * unit * 0.5 * dt
        if (mote.y < -mote.r * 4) {
          mote.y = height + mote.r * 4
          mote.x = Math.random() * width
        }
        const size = mote.r * 3.5
        g!.globalAlpha = mote.alpha * (0.75 + 0.25 * Math.sin(t * mote.speed * 0.9 + mote.phase))
        g!.drawImage(sprite, mote.x - camX * mote.r * 6 - size / 2, mote.y - camY * mote.r * 4 - size / 2, size, size)
      }

      if (puffs.length > 0) {
        g!.globalCompositeOperation = 'source-over'
        for (let i = puffs.length - 1; i >= 0; i -= 1) {
          const puff = puffs[i]
          puff.age += dt
          if (puff.age >= puff.life) {
            puffs.splice(i, 1)
            continue
          }
          puff.x += puff.vx * dt
          puff.y += puff.vy * dt
          puff.vx *= Math.max(0, 1 - 1.6 * dt)
          puff.vy += 2.4 * unit * dt
          const fade = puff.age / puff.life
          const size = puff.r * (3.2 + fade * 2.6)
          g!.globalAlpha = puff.alpha * Math.min(1, puff.age / 0.1) * (1 - fade) ** 1.3
          g!.drawImage(mist, puff.x - size / 2, puff.y - size / 2, size, size)
        }
      }
      g!.globalAlpha = 1
    }

    function onVisibility(): void {
      cancelAnimationFrame(frameId)
      if (document.visibilityState === 'visible' && !still) {
        last = performance.now()
        frameId = requestAnimationFrame(tick)
      }
    }

    const observer = new ResizeObserver(resize)
    observer.observe(root)
    resize()
    root.addEventListener('click', onClick)
    const stopCat = still ? null : runLandingCat(root)
    if (!still) {
      root.addEventListener('pointermove', onPointerMove)
      document.addEventListener('visibilitychange', onVisibility)
      frameId = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      stopCat?.()
      root.removeEventListener('click', onClick)
      root.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      root.classList.remove('is-leaving')
      if (audioCtx) void audioCtx.close()
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="landing-fx" aria-hidden="true" />
      <div className="landing-vignette" aria-hidden="true" />
      <div className="landing-iris" aria-hidden="true" />
    </>
  )
}
