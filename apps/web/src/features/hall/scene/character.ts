import * as THREE from 'three'
import type { Assets } from './assets'
import type { Attachment } from './carried'
import { CONFIG } from './config'
import type { Viewport } from './overlay'
import type { BunnyRig, RigAttachmentPose } from './bunny-rig'
import { createRigState, rigFacing, stepRigState } from './rig-motion'

export interface Pose {
  x: number
  y: number
  width: number
  rotation: number
  flip: number
}

export interface Perch {
  image: HTMLImageElement
  x: number
  y: number
  height: number
  seated: boolean
}

export interface Character {
  readonly idleImage: HTMLImageElement
  perch(perch: Perch | null): void
  attach(attachment: Attachment, out: Pose): Pose
  update(
    dt: number,
    x: number,
    velocity: number,
    camera: THREE.OrthographicCamera,
    viewport: Viewport,
  ): void
  dispose(): void
}

export function createCharacter(assets: Assets, host: HTMLElement): Character {
  const idle = assets.bunnyIdle
  const cycle = (side: 'left' | 'right'): HTMLImageElement[] =>
    assets.walk[side].length > 0 ? assets.walk[side] : [idle[side]]

  const sprite = document.createElement('img')
  sprite.className = 'hall-bunny'
  sprite.alt = ''
  sprite.setAttribute('aria-hidden', 'true')
  sprite.src = idle.right.src
  host.appendChild(sprite)

  const canvas = document.createElement('canvas')
  canvas.className = 'hall-bunny hall-bunny-rig'
  canvas.setAttribute('aria-hidden', 'true')
  canvas.hidden = true
  host.appendChild(canvas)
  let rig: BunnyRig | null = null
  let disposed = false
  let rigFailed = false
  let usingRig = false
  let rigLeft = 0
  let rigTop = 0
  let rigHeight = ''
  let rigTransform = ''
  const rigPose: RigAttachmentPose = { x: 0, y: 0, width: 0, rotation: 0 }

  function loseRig(): void {
    rigFailed = true
    usingRig = false
    rig?.dispose()
    rig = null
    canvas.hidden = true
    sprite.hidden = false
  }

  function contextLost(event: Event): void {
    event.preventDefault()
    if (!disposed) loseRig()
  }
  canvas.addEventListener('webglcontextlost', contextLost)

  // Keep the sprites visible until both the model and its painted textures are ready.
  void import('./bunny-rig')
    .then(({ loadBunnyRig }) => loadBunnyRig(canvas))
    .then((loaded) => {
      if (disposed || rigFailed) loaded.dispose()
      else rig = loaded
    })
    .catch((error) => {
      if (!disposed) console.warn('[hall] bunny rig unavailable; using sprite fallback', error)
    })

  const projected = new THREE.Vector3()

  let distance = 0
  const motion = createRigState()
  let facing: 'left' | 'right' = 'right'
  let currentSrc = idle.right.src
  let currentImage = idle.right
  let moving = false
  let screenX = 0
  let screenY = 0
  let scale = 1
  let currentHeight = ''
  let currentTransform = ''
  let perched: Perch | null = null

  function setFrame(image: HTMLImageElement): void {
    currentImage = image
    if (currentSrc === image.src) return
    currentSrc = image.src
    sprite.src = image.src
  }

  return {
    get idleImage() {
      return idle[facing]
    },

    perch(perch) {
      perched = perch
    },

    attach(attachment, out) {
      if (usingRig && rig && attachment.rig && rig.projectAttachment(attachment.rig, rigPose)) {
        out.x = rigLeft + rigPose.x
        out.y = rigTop + rigPose.y
        out.width = rigPose.width
        out.flip = rigFacing(motion) === attachment.facing ? 1 : -1
        out.rotation = attachment.rig.rotation + rigPose.rotation / out.flip
        return out
      }
      const { naturalWidth, naturalHeight } = currentImage
      if (perched?.seated) {
        const { sit } = attachment
        out.x = screenX + (sit.x - naturalWidth / 2) * scale
        out.y = screenY + (sit.y - naturalHeight / 2) * scale
        out.width = sit.width * scale
        out.rotation = sit.rotation
        out.flip = sit.flip
        return out
      }

      const place = moving ? attachment.walk : attachment.idle
      const asDrawn = facing === attachment.facing
      const drawnX = asDrawn ? place.x : naturalWidth - place.x
      out.x = screenX + (drawnX - naturalWidth / 2) * scale
      out.y = screenY + (place.y - naturalHeight / 2) * scale
      out.width = attachment.width * scale
      out.rotation = place.rotation
      out.flip = asDrawn ? 1 : -1
      return out
    },

    update(dt, x, velocity, camera, viewport) {
      const speed = Math.abs(velocity)
      moving = !perched && speed > 0.12

      distance += speed * dt
      if (perched) {
        setFrame(perched.image)
      } else if (moving) {
        facing = velocity > 0 ? 'right' : 'left'
        const frames = cycle(facing)
        const step = Math.floor(distance * CONFIG.character.cyclesPerUnit * frames.length)
        setFrame(frames[((step % frames.length) + frames.length) % frames.length])
      } else {
        setFrame(idle[facing])
      }

      usingRig = rig !== null && !perched
      // Play the approved one-second clip at its authored speed. The old sprite
      // distance clock accelerated the rig's ears and body more than twofold.
      if (rig) stepRigState(motion, dt, moving, facing, speed / CONFIG.move.maxSpeed, rig.cycleSeconds)
      // The approved clip already supplies its own bob; do not add the old sprite bob.
      const float = moving && !usingRig
        ? Math.sin(distance * CONFIG.character.cyclesPerUnit * Math.PI * 2) * CONFIG.character.bob
        : 0

      if (perched) projected.set(perched.x, perched.y, 0)
      else projected.set(x, CONFIG.character.centerY + float, 0)
      projected.project(camera)

      screenX = (projected.x * 0.5 + 0.5) * viewport.width
      screenY = (-projected.y * 0.5 + 0.5) * viewport.height

      const frustumHeight = camera.top - camera.bottom
      const worldHeight = perched ? perched.height : CONFIG.character.height
      const heightPx = (worldHeight / frustumHeight) * viewport.height
      const height = `${heightPx.toFixed(1)}px`
      if (height !== currentHeight) {
        currentHeight = height
        sprite.style.height = height
      }

      const transform =
        `translate3d(${screenX.toFixed(1)}px, ${screenY.toFixed(1)}px, 0)` +
        ' translate(-50%, -50%)'
      if (transform !== currentTransform) {
        currentTransform = transform
        sprite.style.transform = transform
      }
      scale = heightPx / currentImage.naturalHeight

      if (usingRig && rig) {
        try {
          // Size the rig so its standing bunny fills the old sprite's box, feet on its bottom edge.
          const canvasHeight = heightPx * rig.spriteScale
          rigLeft = screenX - (canvasHeight * rig.aspect) / 2
          rigTop = screenY + heightPx / 2 - canvasHeight * rig.feet
          const nextHeight = `${canvasHeight.toFixed(1)}px`
          if (nextHeight !== rigHeight) {
            rigHeight = nextHeight
            canvas.style.height = nextHeight
          }
          const nextTransform = `translate3d(${rigLeft.toFixed(1)}px, ${rigTop.toFixed(1)}px, 0)`
          if (nextTransform !== rigTransform) {
            rigTransform = nextTransform
            canvas.style.transform = nextTransform
          }
          rig.render(motion, dt, canvasHeight, window.devicePixelRatio)
          canvas.dataset.facing = rigFacing(motion)
          canvas.dataset.state = moving ? 'walk' : 'idle'
        } catch (error) {
          console.warn('[hall] bunny rig render failed; using sprite fallback', error)
          loseRig()
        }
      }
      canvas.hidden = !usingRig
      sprite.hidden = usingRig
    },

    dispose() {
      disposed = true
      canvas.removeEventListener('webglcontextlost', contextLost)
      rig?.dispose()
      canvas.remove()
      sprite.remove()
    },
  }
}
