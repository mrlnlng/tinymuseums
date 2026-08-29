import { CONFIG } from './config'
import type { HallLayout } from './layout'
import { nearestSlot } from './layout'

/**
 * Moving through the hall.
 *
 * The camera is what input drives; the bunny follows it on foot.
 *
 * The obvious arrangement is the other way round — drag the visitor, let the
 * camera trail them — and it looks wrong, because the visitor then moves at
 * whatever speed the finger moves. A walk cycle cannot match a finger. Nothing
 * about the animation can be tuned to fix that; the character is being dragged,
 * not walking.
 *
 * Inverting it fixes the cause. A drag scrolls the hall, exactly like scrolling
 * anything else on a phone. The bunny notices it has been left behind and walks
 * over at its own pace, so its feet always agree with its speed. A small drag
 * leaves it standing still; a flick sends it walking after you and arriving a
 * moment later.
 */
export class Traversal {
  /** Where the camera is looking. This is what input moves. */
  cameraX = 0
  /** Where the bunny is standing. Derived: it walks toward the camera. */
  x = 0

  /** Scroll momentum, in world units per second. Belongs to the camera. */
  velocity = 0

  /**
   * The bunny's own walking speed, measured from how far it actually moved.
   * This is what drives the walk cycle and which way it faces.
   */
  walkVelocity = 0

  private keys = new Set<string>()
  private dragging = false
  private lastPointerX = 0
  private dragVelocity = 0
  private suspended = false
  private lastFootX = 0

  /** True from the opening walk-in until the bunny reaches the first display. */
  private introducing = false

  /** Hysteresis: once walking, keep walking until properly arrived. */
  private walking = false

  /**
   * World units per screen pixel, set from the live camera and viewport, so a
   * drag moves exactly the wall under the finger on any device.
   */
  private worldPerPixel = 0.0084

  attach(element: HTMLElement): void {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return
      this.keys.add(e.key.toLowerCase())
    })
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()))
    window.addEventListener('blur', () => this.keys.clear())

    element.addEventListener('pointerdown', (e) => {
      if (this.locked) return
      this.dragging = true
      this.lastPointerX = e.clientX
      this.dragVelocity = 0
      // Grabbing the hall stops it dead, the way grabbing a scrolling list does.
      this.velocity = 0
      element.setPointerCapture(e.pointerId)
    })

    element.addEventListener('pointermove', (e) => {
      if (!this.dragging) return
      const dx = e.clientX - this.lastPointerX
      this.lastPointerX = e.clientX
      // Dragging right pulls the hall right, so the view moves left.
      const delta = -dx * this.worldPerPixel
      this.cameraX += delta
      this.dragVelocity = delta * 60
    })

    const endDrag = (e: PointerEvent) => {
      if (!this.dragging) return
      this.dragging = false
      this.velocity = clamp(this.dragVelocity, -CONFIG.move.maxScrollSpeed, CONFIG.move.maxScrollSpeed)
      if (element.hasPointerCapture(e.pointerId)) element.releasePointerCapture(e.pointerId)
    }
    element.addEventListener('pointerup', endDrag)
    element.addEventListener('pointercancel', endDrag)

    element.addEventListener(
      'wheel',
      (e) => {
        if (this.locked) return
        e.preventDefault()
        const amount = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
        // Wheel deltas run large, so this is deliberately below 1:1.
        const step = amount * this.worldPerPixel * CONFIG.move.wheelFactor
        this.cameraX += step
        this.velocity = clamp(
          this.velocity + step * 8,
          -CONFIG.move.maxScrollSpeed,
          CONFIG.move.maxScrollSpeed,
        )
      },
      { passive: false },
    )
  }

  private get locked(): boolean {
    return this.suspended || this.introducing
  }

  /** Held while the walk-through is open, so the hall does not drift behind it. */
  setSuspended(suspended: boolean): void {
    this.suspended = suspended
    if (suspended) {
      this.keys.clear()
      this.dragging = false
      this.velocity = 0
    }
  }

  get isMoving(): boolean {
    return Math.abs(this.velocity) > 0.05 || this.dragging || this.walking
  }

  get isIntro(): boolean {
    return this.introducing
  }

  /** Keeps drag 1:1 with the wall at whatever size the screen currently is. */
  setWorldPerPixel(value: number): void {
    if (Number.isFinite(value) && value > 0) this.worldPerPixel = value
  }

  /** Places camera and visitor together, with no walking and no momentum. */
  reset(x: number): void {
    this.cameraX = x
    this.x = x
    this.velocity = 0
    this.walkVelocity = 0
    this.lastFootX = x
    this.walking = false
    this.introducing = false
  }

  /**
   * The opening: the camera sits on the first display and the bunny walks in
   * from off to the left. It is the ordinary follow behaviour with input held
   * off — not a special animation path.
   */
  playIntro(startX: number, targetX: number): void {
    this.cameraX = targetX
    this.x = startX
    this.lastFootX = startX
    this.velocity = 0
    this.walkVelocity = 0
    this.walking = true
    this.introducing = true
  }

  update(dt: number, layout: HallLayout): void {
    if (!this.locked) this.moveCamera(dt, layout)
    this.walkToward(dt)
    this.enforceLeash()

    this.walkVelocity = dt > 0 ? (this.x - this.lastFootX) / dt : 0
    this.lastFootX = this.x

    if (this.introducing && !this.walking) this.introducing = false
  }

  /** Keys, momentum, snapping and bounds — all acting on the camera. */
  private moveCamera(dt: number, layout: HallLayout): void {
    const left = this.keys.has('arrowleft') || this.keys.has('a')
    const right = this.keys.has('arrowright') || this.keys.has('d')
    const input = (right ? 1 : 0) - (left ? 1 : 0)

    if (input !== 0) {
      this.velocity += input * CONFIG.move.accel * dt
    } else if (!this.dragging) {
      this.velocity -= this.velocity * Math.min(1, CONFIG.move.damping * dt)
    }

    this.velocity = clamp(this.velocity, -CONFIG.move.maxScrollSpeed, CONFIG.move.maxScrollSpeed)
    if (!this.dragging) this.cameraX += this.velocity * dt

    if (
      CONFIG.snap.enabled &&
      input === 0 &&
      !this.dragging &&
      Math.abs(this.velocity) < CONFIG.snap.engageBelowSpeed
    ) {
      const target = layout.centerX[nearestSlot(layout, this.cameraX)]
      this.cameraX += (target - this.cameraX) * Math.min(1, CONFIG.snap.strength * dt)
    }

    // The hall has ends. Walking into one should stop, not wrap.
    if (this.cameraX < 0) {
      this.cameraX = 0
      this.velocity = 0
    } else if (this.cameraX > layout.totalLength) {
      this.cameraX = layout.totalLength
      this.velocity = 0
    }
  }

  /**
   * The bunny walks to wherever the camera is looking.
   *
   * Hysteresis rather than a plain deadzone: it starts walking only once it is
   * meaningfully behind, then keeps going until it has properly arrived. A
   * bare deadzone leaves it twitching in and out of its walk cycle on every
   * small nudge.
   */
  private walkToward(dt: number): void {
    if (this.suspended) {
      this.walking = false
      return
    }

    const { followStartDistance, followStopDistance, arriveSeconds } = CONFIG.character
    const gap = this.cameraX - this.x
    const distance = Math.abs(gap)

    if (!this.walking && distance > followStartDistance) this.walking = true
    if (this.walking && distance <= followStopDistance) {
      this.walking = false
      this.x = this.cameraX
      return
    }
    if (!this.walking) return

    // Ease into the destination instead of stopping dead on it, but never
    // exceed a walking pace — the whole point is that it looks like walking.
    const speed = Math.min(CONFIG.move.maxSpeed, distance / arriveSeconds)
    const step = Math.sign(gap) * speed * dt
    this.x = Math.abs(step) >= distance ? this.cameraX : this.x + step
  }

  /**
   * Keeps the bunny within reach of the view.
   *
   * A hard flick scrolls faster than anything can walk, so without a limit the
   * character is left behind indefinitely. Dragging it forward here is not
   * visible — at this distance it is already off-screen — and it still has to
   * walk the last stretch once the hall stops.
   */
  private enforceLeash(): void {
    const max = CONFIG.character.maxTrailDistance
    const gap = this.cameraX - this.x
    if (Math.abs(gap) <= max) return

    this.x = this.cameraX - Math.sign(gap) * max
    // It is behind by definition, so it should be on its feet.
    this.walking = true
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}
