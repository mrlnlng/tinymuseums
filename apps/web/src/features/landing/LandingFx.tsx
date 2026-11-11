'use client'

import { useEffect, useRef } from 'react'

const POKEABLE = '[data-poke], .landing-cat, .landing-perfume, .landing-jewelry, .landing-book'

type Mote = { x: number; y: number; r: number; vy: number; phase: number; speed: number; alpha: number }

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

export default function LandingFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = canvas?.closest<HTMLElement>('.landing')
    const g = canvas?.getContext('2d')
    if (!canvas || !root || !g) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprite = glowSprite()
    let width = 0
    let height = 0
    let unit = 1
    let motes: Mote[] = []

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
    }

    let frameId = 0
    let last = performance.now()

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
      root!.style.setProperty('--px', camX.toFixed(4))
      root!.style.setProperty('--py', camY.toFixed(4))

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
    if (!still) {
      root.addEventListener('pointermove', onPointerMove)
      document.addEventListener('visibilitychange', onVisibility)
      frameId = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(frameId)
      observer.disconnect()
      root.removeEventListener('click', onClick)
      root.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('visibilitychange', onVisibility)
      root.classList.remove('is-leaving')
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
