import { CONFIG } from './config'

export class Traversal {
  cameraX = 0
  x = 0

  velocity = 0

  walkVelocity = 0

  private keys = new Set<string>()
  private dragging = false
  private lastPointerX = 0
  private dragVelocity = 0
  private suspended = false
  private lastFootX = 0

  private introducing = false

  private walking = false

  private heldAt: number | null = null

  private following = false

  idleSeconds = 0

  private worldPerPixel = 0.0084

  attach(element: HTMLElement): void {
    window.addEventListener('keydown', (e) => {
      this.idleSeconds = 0
      if (e.repeat) return
      this.keys.add(e.key.toLowerCase())
    })
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()))
    window.addEventListener('blur', () => this.keys.clear())

    element.addEventListener('pointerdown', (e) => {
      this.idleSeconds = 0
      if (this.locked) return
      this.following = false
      this.dragging = true
      this.lastPointerX = e.clientX
      this.dragVelocity = 0
      this.velocity = 0
      element.setPointerCapture(e.pointerId)
    })

    element.addEventListener('pointermove', (e) => {
      if (!this.dragging) return
      const dx = e.clientX - this.lastPointerX
      this.lastPointerX = e.clientX
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
        this.following = false
        const amount = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
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

  setSuspended(suspended: boolean): void {
    this.suspended = suspended
    if (suspended) {
      this.keys.clear()
      this.dragging = false
      this.velocity = 0
    }
  }

  hold(x: number | null, follow = false): void {
    this.heldAt = x
    this.following = x !== null && follow
    if (x !== null) this.walking = true
  }

  get isHeld(): boolean {
    return this.heldAt !== null && this.x === this.heldAt && !this.walking
  }

  get isIntro(): boolean {
    return this.introducing
  }

  setWorldPerPixel(value: number): void {
    if (Number.isFinite(value) && value > 0) this.worldPerPixel = value
  }

  reset(x: number): void {
    this.cameraX = x
    this.x = x
    this.velocity = 0
    this.walkVelocity = 0
    this.lastFootX = x
    this.walking = false
    this.introducing = false
  }

  playIntro(startX: number, targetX: number): void {
    this.cameraX = targetX
    this.x = startX
    this.lastFootX = startX
    this.velocity = 0
    this.walkVelocity = 0
    this.walking = true
    this.introducing = true
  }

  update(dt: number, totalLength: number): void {
    if (!this.locked) this.moveCamera(dt, totalLength)
    this.walkToward(dt)
    this.enforceLeash()
    if (this.following) {
      this.cameraX = this.x
      this.velocity = 0
    }

    this.walkVelocity = this.walking && dt > 0 ? (this.x - this.lastFootX) / dt : 0
    this.lastFootX = this.x

    if (this.introducing && !this.walking) this.introducing = false

    const resting =
      !this.locked &&
      !this.dragging &&
      !this.walking &&
      this.keys.size === 0 &&
      Math.abs(this.velocity) < 0.01
    this.idleSeconds = resting ? this.idleSeconds + dt : 0
  }

  private moveCamera(dt: number, totalLength: number): void {
    const left = this.keys.has('arrowleft') || this.keys.has('a')
    const right = this.keys.has('arrowright') || this.keys.has('d')
    const input = (right ? 1 : 0) - (left ? 1 : 0)

    if (input !== 0) {
      this.following = false
      this.velocity += input * CONFIG.move.accel * dt
    } else if (!this.dragging) {
      this.velocity -= this.velocity * Math.min(1, CONFIG.move.damping * dt)
    }

    this.velocity = clamp(this.velocity, -CONFIG.move.maxScrollSpeed, CONFIG.move.maxScrollSpeed)
    if (!this.dragging) this.cameraX += this.velocity * dt

    if (this.cameraX < 0) {
      this.cameraX = 0
      this.velocity = 0
    } else if (this.cameraX > totalLength) {
      this.cameraX = totalLength
      this.velocity = 0
    }
  }

  private walkToward(dt: number): void {
    if (this.suspended) {
      this.walking = false
      return
    }

    const { followStartDistance, followStopDistance, arriveSeconds } = CONFIG.character
    const target = this.heldAt ?? this.cameraX
    const gap = target - this.x
    const distance = Math.abs(gap)

    if (!this.walking && distance > followStartDistance) this.walking = true
    if (this.walking && distance <= followStopDistance) {
      this.walking = false
      this.x = target
      return
    }
    if (!this.walking) return

    const speed = Math.min(CONFIG.move.maxSpeed, distance / arriveSeconds)
    const step = Math.sign(gap) * speed * dt
    this.x = Math.abs(step) >= distance ? target : this.x + step
  }

  private enforceLeash(): void {
    if (this.heldAt !== null) return
    const max = CONFIG.character.maxTrailDistance
    const gap = this.cameraX - this.x
    if (Math.abs(gap) <= max) return

    this.x = this.cameraX - Math.sign(gap) * max
    this.walking = true
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}
