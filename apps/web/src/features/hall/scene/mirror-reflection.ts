import type { Character } from './character'
import type { CharacterKind, Rig } from './rig'

/** The mirror's glass on screen, in the character host's pixels. */
export interface GlassRect {
  left: number
  top: number
  right: number
  bottom: number
}

export interface LiveReflection {
  /**
   * Draws the visitor in the glass; a null glass hides the reflection. `wallFoot` is where the
   * wall meets the floor on screen: the visitor stands that far in front of it, so their image
   * stands as far behind it, its feet as far above that line as theirs are below.
   */
  update(dt: number, glass: GlassRect | null, wallFoot: number): void
  dispose(): void
}

/** Twice as far off, the image is drawn a little smaller. */
const DEPTH_SCALE = 0.92

/**
 * A second rig that copies the visitor's every step into the mirror. It has its own WebGL
 * context, so it only draws while the visitor is in front of the glass.
 */
export function createLiveReflection(host: HTMLElement, character: Character): LiveReflection {
  const frame = document.createElement('div')
  frame.className = 'mirror-reflection'
  frame.setAttribute('aria-hidden', 'true')
  frame.hidden = true
  // First in the host, so the visitor and everyone else draw over their reflection.
  host.prepend(frame)

  let rig: Rig | null = null
  let canvas: HTMLCanvasElement | null = null
  let loading: CharacterKind | null = null
  let dressed = ''
  let disposed = false

  function follow(): void {
    const { kind, costume, bow, top } = character.look
    if (rig && rig.kind === kind) {
      const key = `${costume}|${bow}|${top}`
      if (key !== dressed) {
        dressed = key
        rig.setCostume(costume, bow, top)
      }
      return
    }
    if (loading === kind) return
    loading = kind
    const next = document.createElement('canvas')
    void import('./rig').then(({ loadRig }) => loadRig(next, kind)).then((loaded) => {
      if (disposed || loading !== kind) {
        loaded.dispose()
        return
      }
      rig?.dispose()
      canvas?.remove()
      rig = loaded
      canvas = next
      frame.append(next)
      dressed = ''
      loading = null
    }).catch((error) => {
      if (loading === kind) loading = null
      console.warn('[atelier] The mirror could not load its reflection', error)
    })
  }

  return {
    update(dt, glass, wallFoot) {
      if (disposed) return
      follow()
      if (!glass || !rig || !canvas || character.drawnHeight <= 0) {
        if (!frame.hidden) frame.hidden = true
        return
      }
      const canvasHeight = character.drawnHeight * DEPTH_SCALE * rig.spriteScale
      const width = canvasHeight * rig.aspect
      const pose = character.drawnPose
      // Stand as far behind the wall as the visitor stands in front, then rise as high as they jump.
      const lift = (pose.ground - pose.feet) * DEPTH_SCALE
      const feet = wallFoot - Math.max(0, pose.ground - wallFoot) - lift
      const left = pose.x - width / 2
      const top = feet - canvasHeight * rig.feet
      const middle = feet - character.drawnHeight * DEPTH_SCALE / 2
      // Written only on change: rewriting hidden every frame forced a style recalc each frame.
      if (left > glass.right || left + width < glass.left) {
        if (!frame.hidden) frame.hidden = true
        return
      }
      if (frame.hidden) frame.hidden = false
      frame.style.transform = `translate3d(${glass.left.toFixed(1)}px, ${glass.top.toFixed(1)}px, 0)`
      frame.style.width = `${(glass.right - glass.left).toFixed(1)}px`
      frame.style.height = `${(glass.bottom - glass.top).toFixed(1)}px`
      canvas.style.height = `${canvasHeight.toFixed(1)}px`
      // A somersault turns the body about its middle, as the visitor's own canvas turns.
      canvas.style.transformOrigin = `${(pose.x - left).toFixed(1)}px ${(middle - top).toFixed(1)}px`
      canvas.style.transform = `translate3d(${(left - glass.left).toFixed(1)}px, ${(top - glass.top).toFixed(1)}px, 0)` +
        (pose.rotation ? ` rotate(${pose.rotation.toFixed(2)}deg)` : '')
      rig.render(character.motion, dt, canvasHeight, window.devicePixelRatio)
    },
    dispose() {
      disposed = true
      rig?.dispose()
      frame.remove()
    },
  }
}
