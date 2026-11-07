import { CONFIG } from './config'
import type { JumpPose } from './rig-motion'

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
  private leashed = true
  private lastFootX = 0

  private introducing = false

  private walking = false

  private heldAt: number | null = null

  private following = false

  idleSeconds = 0

  private worldPerPixel = 0.0084
  private viewWidth = 9

  // While the keys drive the bunny, the camera stops pulling it back to the middle.
  private steering = false
  private stride = 0

  /** How far the bunny is off the floor, in world units. */
  height = 0
  private rise = 0
  private jumpQueued = false
  private jumped = false
  private crouchedFor = -1
  private landedFor = -1
  private readonly pose: JumpPose = { squash: 0, rise: 0, lift: 0, airborne: false }

  private detachWindow = () => {}

  attach(element: HTMLElement): void {
    const keydown = (e: KeyboardEvent) => {
      const target = e.target instanceof Element ? e.target : null
      if (target?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('[aria-modal="true"]')) return
      this.idleSeconds = 0
      if (e.repeat) return
      const key = e.key.toLowerCase()
      if (JUMP_KEYS.has(key)) {
        // Space on a focused button presses the button instead.
        if (target?.closest('button, a, [role="button"]')) return
        if (key === ' ') e.preventDefault()
        this.jump()
        return
      }
      this.keys.add(key)
    }
    const keyup = (e: KeyboardEvent) => this.keys.delete(e.key.toLowerCase())
    const blur = () => this.keys.clear()
    window.addEventListener('keydown', keydown)
    window.addEventListener('keyup', keyup)
    window.addEventListener('blur', blur)
    // The element goes with its page; the window does not, so its listeners are removed.
    this.detachWindow = () => {
      window.removeEventListener('keydown', keydown)
      window.removeEventListener('keyup', keyup)
      window.removeEventListener('blur', blur)
    }

    element.addEventListener('pointerdown', (e) => {
      this.idleSeconds = 0
      if (this.locked) return
      this.following = false
      this.steering = false
      this.dragging = true
      this.lastPointerX = e.clientX
      this.dragVelocity = 0
      this.velocity = 0
      try {
        element.setPointerCapture(e.pointerId)
      } catch {
        // The pointer can already be gone by the time pointerdown is handled.
      }
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
        this.steering = false
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

  detach(): void {
    this.detachWindow()
    this.keys.clear()
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
      this.stride = 0
      this.jumpQueued = false
    }
  }

  /** With the leash off the camera can roam away from the character, as when decorating. */
  setLeashed(leashed: boolean): void {
    this.leashed = leashed
  }

  hold(x: number | null, follow = false): void {
    this.heldAt = x
    this.following = x !== null && follow
    if (x !== null) this.steering = false
    if (x !== null) this.walking = true
  }

  get isHeld(): boolean {
    return this.heldAt !== null && this.x === this.heldAt && !this.walking
  }

  get isSteered(): boolean {
    return this.keyInput() !== 0
  }

  get isFollowing(): boolean {
    return this.following
  }

  get isIntro(): boolean {
    return this.introducing
  }

  setView(worldPerPixel: number, viewWidth: number): void {
    if (Number.isFinite(worldPerPixel) && worldPerPixel > 0) this.worldPerPixel = worldPerPixel
    if (Number.isFinite(viewWidth) && viewWidth > 0) this.viewWidth = viewWidth
  }

  reset(x: number): void {
    this.cameraX = x
    this.x = x
    this.velocity = 0
    this.walkVelocity = 0
    this.lastFootX = x
    this.walking = false
    this.introducing = false
    this.heldAt = null
    this.following = false
    this.dragging = false
    this.steering = false
    this.stride = 0
    this.height = 0
    this.rise = 0
    this.crouchedFor = -1
    this.landedFor = -1
  }

  playIntro(startX: number, targetX: number): void {
    this.cameraX = targetX
    this.x = startX
    this.lastFootX = startX
    this.velocity = 0
    this.walkVelocity = 0
    this.walking = true
    this.introducing = true
    this.steering = false
    this.stride = 0
  }

  update(dt: number, min: number, max: number): void {
    const input = this.keyInput()
    if (!this.locked && this.heldAt === null && (input !== 0 || (this.steering && this.stride !== 0))) {
      this.steer(dt, input, min, max)
    } else if (!this.locked) {
      this.moveCamera(dt, min, max)
    }
    if (!this.steering) this.walkToward(dt)
    this.enforceLeash()
    this.updateJump(dt)
    if (this.following) {
      this.cameraX = this.x
      this.velocity = 0
    }

    this.walkVelocity = (this.walking || this.steering) && dt > 0 ? (this.x - this.lastFootX) / dt : 0
    this.lastFootX = this.x

    if (this.introducing && !this.walking) this.introducing = false

    const resting =
      !this.locked &&
      !this.dragging &&
      !this.walking &&
      this.keys.size === 0 &&
      this.height === 0 &&
      Math.abs(this.velocity) < 0.01
    this.idleSeconds = resting ? this.idleSeconds + dt : 0
  }

  /** Queues a jump; false when the character cannot jump now (held, locked or in the air). */
  jump(): boolean {
    if (this.locked || this.heldAt !== null || this.height > 0) return false
    this.jumpQueued = true
    this.idleSeconds = 0
    return true
  }

  /** True once for each jump that leaves the floor, for its sound. */
  takeJump(): boolean {
    const jumped = this.jumped
    this.jumped = false
    return jumped
  }

  get isAirborne(): boolean {
    return this.height > 0
  }

  /** The squash, stretch and height of the jump, for the character's pose. */
  get jumpPose(): JumpPose {
    const { height, gravity, crouchSeconds, landSeconds, squash, stretch, landSquash } = CONFIG.jump
    const launch = Math.sqrt(2 * gravity * height)
    const pose = this.pose
    pose.airborne = this.height > 0
    pose.lift = this.height / height
    pose.rise = pose.airborne ? clamp(this.rise / launch, -1, 1) : 0
    if (this.crouchedFor >= 0) {
      pose.squash = -squash * Math.sin((Math.PI / 2) * Math.min(1, this.crouchedFor / crouchSeconds))
    } else if (pose.airborne) {
      pose.squash = stretch * Math.abs(pose.rise)
    } else if (this.landedFor >= 0) {
      // Squash on touching down, then a small overshoot back to standing.
      const t = this.landedFor / landSeconds
      pose.squash = -landSquash * Math.cos(t * Math.PI * 1.5) * (1 - t)
    } else {
      pose.squash = 0
    }
    return pose
  }

  private updateJump(dt: number): void {
    const { height, gravity, crouchSeconds, landSeconds } = CONFIG.jump
    const canJump = !this.locked && this.heldAt === null
    if (this.jumpQueued && this.height === 0 && this.crouchedFor < 0 && canJump) this.crouchedFor = 0
    this.jumpQueued = false

    if (this.crouchedFor >= 0) {
      if (!canJump) this.crouchedFor = -1
      else if ((this.crouchedFor += dt) >= crouchSeconds) {
        this.crouchedFor = -1
        this.landedFor = -1
        this.rise = Math.sqrt(2 * gravity * height)
        this.height = this.rise * dt
        this.jumped = true
      }
    }

    if (this.landedFor >= 0 && (this.landedFor += dt) >= landSeconds) this.landedFor = -1
    if (this.height === 0) return
    this.rise -= gravity * dt
    this.height += this.rise * dt
    if (this.height <= 0) {
      this.height = 0
      this.rise = 0
      this.landedFor = 0
    }
  }

  private keyInput(): number {
    const left = this.keys.has('arrowleft') || this.keys.has('a')
    const right = this.keys.has('arrowright') || this.keys.has('d')
    return (right ? 1 : 0) - (left ? 1 : 0)
  }

  private steer(dt: number, input: number, min: number, max: number): void {
    const { keyWalkSpeed, keyAccel, lookAhead } = CONFIG.move
    this.steering = true
    this.following = false
    this.walking = false
    this.velocity = 0

    const change = input * keyWalkSpeed - this.stride
    const most = keyAccel * dt
    this.stride += clamp(change, -most, most)
    this.x += this.stride * dt
    if (this.x <= min || this.x >= max) {
      this.x = clamp(this.x, min, max)
      this.stride = 0
    }

    // The camera holds still until the bunny comes within lookAhead of the edge it walks toward.
    // Near the room's ends the window narrows, so the camera still reaches the end walls.
    const slack = Math.max(0, this.viewWidth / 2 - this.viewWidth * lookAhead)
    const ahead = Math.min(slack, this.x - min)
    const behind = Math.min(slack, max - this.x)
    const want = clamp(this.cameraX, this.x - behind, this.x + ahead)
    const gap = want - this.cameraX
    // A bunny already outside the window (after a drag) is caught up gently, not snapped to.
    const next = Math.abs(gap) > 0.5 ? this.cameraX + gap * Math.min(1, dt * 12) : want
    this.cameraX = clamp(next, min, max)
  }

  private moveCamera(dt: number, min: number, max: number): void {
    if (!this.dragging) {
      this.velocity -= this.velocity * Math.min(1, CONFIG.move.damping * dt)
    }

    this.velocity = clamp(this.velocity, -CONFIG.move.maxScrollSpeed, CONFIG.move.maxScrollSpeed)
    if (!this.dragging) this.cameraX += this.velocity * dt

    if (this.cameraX < min) {
      this.cameraX = min
      this.velocity = 0
    } else if (this.cameraX > max) {
      this.cameraX = max
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
    if (this.heldAt !== null || !this.leashed || this.steering) return
    const max = CONFIG.character.maxTrailDistance
    const gap = this.cameraX - this.x
    if (Math.abs(gap) <= max) return

    this.x = this.cameraX - Math.sign(gap) * max
    this.walking = true
  }
}

const JUMP_KEYS = new Set([' ', 'w', 'arrowup'])

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}
