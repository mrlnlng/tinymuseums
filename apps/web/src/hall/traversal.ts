import { CONFIG } from './config'
import type { HallLayout } from './layout'
import { nearestSlot } from './layout'

/**
 * Movement along the hall's single axis: keyboard, drag, and wheel, with
 * momentum and optional magnetic waypoints at display centres.
 *
 * Whether snapping feels considered or feels like the hall is steering for you
 * is a perception question, so it is a live toggle rather than a decision.
 */
export class Traversal {
  /** Where the visitor is standing. */
  x = 0
  velocity = 0
  /** Where the camera is looking. Trails the visitor through a deadzone. */
  cameraX = 0

  private keys = new Set<string>()
  private dragging = false
  private lastPointerX = 0
  private dragVelocity = 0
  private suspended = false

  attach(element: HTMLElement): void {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return
      this.keys.add(e.key.toLowerCase())
    })
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()))
    window.addEventListener('blur', () => this.keys.clear())

    element.addEventListener('pointerdown', (e) => {
      if (this.suspended) return
      this.dragging = true
      this.lastPointerX = e.clientX
      this.dragVelocity = 0
      element.setPointerCapture(e.pointerId)
    })

    element.addEventListener('pointermove', (e) => {
      if (!this.dragging) return
      const dx = e.clientX - this.lastPointerX
      this.lastPointerX = e.clientX
      // Dragging right pulls the hall right, which moves the visitor left.
      const delta = -dx * CONFIG.move.dragScale
      this.x += delta
      this.dragVelocity = delta * 60
    })

    const endDrag = (e: PointerEvent) => {
      if (!this.dragging) return
      this.dragging = false
      this.velocity = clamp(this.dragVelocity, -CONFIG.move.maxSpeed, CONFIG.move.maxSpeed)
      if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId)
    }
    element.addEventListener('pointerup', endDrag)
    element.addEventListener('pointercancel', endDrag)

    element.addEventListener(
      'wheel',
      (e) => {
        if (this.suspended) return
        e.preventDefault()
        const amount = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        this.x += amount * CONFIG.move.wheelScale
        this.velocity = clamp(
          this.velocity + amount * CONFIG.move.wheelScale * 8,
          -CONFIG.move.maxSpeed,
          CONFIG.move.maxSpeed,
        )
      },
      { passive: false },
    )
  }

  /** Held while the walk-through overlay is open, so the hall does not drift behind it. */
  setSuspended(suspended: boolean): void {
    this.suspended = suspended
    if (suspended) {
      this.keys.clear()
      this.dragging = false
      this.velocity = 0
    }
  }

  get isMoving(): boolean {
    return Math.abs(this.velocity) > 0.05 || this.dragging
  }

  /** Snaps the camera to the visitor without a follow animation. */
  reset(x: number): void {
    this.x = x
    this.cameraX = x
    this.velocity = 0
  }

  update(dt: number, layout: HallLayout): void {
    if (this.suspended) {
      this.followCamera(dt)
      return
    }

    const left = this.keys.has('arrowleft') || this.keys.has('a')
    const right = this.keys.has('arrowright') || this.keys.has('d')
    const input = (right ? 1 : 0) - (left ? 1 : 0)

    if (input !== 0) {
      this.velocity += input * CONFIG.move.accel * dt
    } else if (!this.dragging) {
      this.velocity -= this.velocity * Math.min(1, CONFIG.move.damping * dt)
    }

    this.velocity = clamp(this.velocity, -CONFIG.move.maxSpeed, CONFIG.move.maxSpeed)
    this.x += this.velocity * dt

    if (
      CONFIG.snap.enabled &&
      input === 0 &&
      !this.dragging &&
      Math.abs(this.velocity) < CONFIG.snap.engageBelowSpeed
    ) {
      const target = layout.centerX[nearestSlot(layout, this.x)]
      this.x += (target - this.x) * Math.min(1, CONFIG.snap.strength * dt)
    }

    // The hall has ends. Walking into one should stop, not wrap.
    const min = 0
    const max = layout.totalLength
    if (this.x < min) {
      this.x = min
      this.velocity = 0
    } else if (this.x > max) {
      this.x = max
      this.velocity = 0
    }

    this.followCamera(dt)
  }

  /**
   * Deadzone follow. The visitor moves freely within a band at the centre of
   * frame; only when they leave it does the camera begin to close the gap.
   * Without the deadzone, every small step slides the entire hall.
   */
  private followCamera(dt: number): void {
    const { followDeadzone, followLerp } = CONFIG.camera
    const offset = this.x - this.cameraX

    let target = this.cameraX
    if (offset > followDeadzone) target = this.x - followDeadzone
    else if (offset < -followDeadzone) target = this.x + followDeadzone

    this.cameraX += (target - this.cameraX) * Math.min(1, followLerp * dt)
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}
