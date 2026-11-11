'use client'

import { useEffect, useRef } from 'react'

const POKEABLE = '[data-poke], .landing-cat, .landing-perfume, .landing-jewelry, .landing-book'
const SHINY = '.landing-perfume, .landing-jewelry, .landing-portrait, .welcome-plaque, .landing-button.is-start'

type Mote = { x: number; y: number; r: number; vy: number; phase: number; speed: number; alpha: number }
type Spark = { x: number; y: number; vx: number; vy: number; size: number; life: number; age: number; spin: number; hue: string; gravity: number }

const SPARK_HUES = ['#fff6d8', '#ffd98a', '#ffc4ed', '#ffffff']

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

function star(g: CanvasRenderingContext2D, size: number): void {
  const waist = size * 0.16
  g.beginPath()
  g.moveTo(0, -size)
  g.quadraticCurveTo(waist, -waist, size, 0)
  g.quadraticCurveTo(waist, waist, 0, size)
  g.quadraticCurveTo(-waist, waist, -size, 0)
  g.quadraticCurveTo(-waist, -waist, 0, -size)
  g.fill()
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
    const sparks: Spark[] = []

    function resize(): void {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = root!.clientWidth
      height = root!.clientHeight
      unit = width > height ? Math.min(width / 100, height / 56.25) : Math.min(width / 100, height / 200) * 2.4
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      g!.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(70, Math.max(26, (width * height) / 16000)))
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: (0.35 + Math.random() ** 2 * 1.5) * unit * 0.24,
        vy: 0.15 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.8,
        alpha: 0.12 + Math.random() * 0.5,
      }))
    }

    function burst(x: number, y: number, count: number): void {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const force = (0.6 + Math.random() * 1.6) * unit * 9
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * force,
          vy: Math.sin(angle) * force - unit * 6,
          size: (0.5 + Math.random() * 0.9) * unit * 0.8,
          life: 0.55 + Math.random() * 0.5,
          age: 0,
          spin: Math.random() * Math.PI,
          hue: SPARK_HUES[i % SPARK_HUES.length],
          gravity: unit * 26,
        })
      }
    }

    function twinkle(): void {
      const shiny = root!.querySelectorAll<HTMLElement>(SHINY)
      const target = shiny[Math.floor(Math.random() * shiny.length)]
      if (!target) return
      const box = target.getBoundingClientRect()
      const frame = root!.getBoundingClientRect()
      sparks.push({
        x: box.left - frame.left + Math.random() * box.width,
        y: box.top - frame.top + Math.random() * box.height * 0.8,
        vx: 0,
        vy: -unit * 0.6,
        size: (0.7 + Math.random() * 0.9) * unit * 0.85,
        life: 0.9 + Math.random() * 0.6,
        age: 0,
        spin: Math.random() * Math.PI,
        hue: SPARK_HUES[Math.floor(Math.random() * SPARK_HUES.length)],
        gravity: 0,
      })
    }

    // The camera follows a mouse; without one it drifts on its own so a phone's scene still has depth.
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
      const frame = root!.getBoundingClientRect()
      const x = event.clientX - frame.left
      const y = event.clientY - frame.top

      const start = target.closest('a.landing-button.is-start')
      if (start) {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
        root!.style.setProperty('--leave-x', `${x}px`)
        root!.style.setProperty('--leave-y', `${y}px`)
        root!.classList.add('is-leaving')
        if (!still) burst(x, y, 26)
        return
      }

      const poked = target.closest<HTMLElement>(POKEABLE)
      if (!poked) return
      poked.classList.remove('is-poked')
      void poked.offsetWidth
      poked.classList.add('is-poked')
      if (!still) burst(x, y, 14)
    }

    let frameId = 0
    let last = performance.now()
    let nextTwinkle = 1.8

    function tick(now: number): void {
      frameId = requestAnimationFrame(tick)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const t = now / 1000

      if (now - pointerAt > 4000) {
        targetX = Math.sin(t * 0.21) * 0.55
        targetY = Math.sin(t * 0.33 + 1.3) * 0.35
      }
      const ease = 1 - Math.exp(-dt * 3.2)
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
        const size = mote.r * 8
        g!.globalAlpha = mote.alpha * (0.55 + 0.45 * Math.sin(t * mote.speed * 2.1 + mote.phase))
        g!.drawImage(sprite, mote.x - camX * mote.r * 6 - size / 2, mote.y - camY * mote.r * 4 - size / 2, size, size)
      }

      nextTwinkle -= dt
      if (nextTwinkle <= 0) {
        twinkle()
        nextTwinkle = 0.25 + Math.random() * 0.7
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i]
        spark.age += dt
        if (spark.age >= spark.life) {
          sparks.splice(i, 1)
          continue
        }
        spark.vy += spark.gravity * dt
        spark.x += spark.vx * dt
        spark.y += spark.vy * dt
        spark.vx *= 1 - dt * 1.8
        const life = spark.age / spark.life
        const swell = Math.sin(Math.PI * Math.min(1, life * 1.15))
        g!.globalAlpha = swell
        g!.fillStyle = spark.hue
        g!.save()
        g!.translate(spark.x, spark.y)
        g!.rotate(spark.spin + life * 1.4)
        star(g!, spark.size * (0.35 + swell * 0.9))
        g!.restore()
        const halo = spark.size * 5 * swell
        g!.globalAlpha = swell * 0.5
        g!.drawImage(sprite, spark.x - halo / 2, spark.y - halo / 2, halo, halo)
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
