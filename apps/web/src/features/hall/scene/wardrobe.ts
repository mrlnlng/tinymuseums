import * as THREE from 'three'
import manifest from '@/generated/asset-manifest.json'
import { restamp, type Outfit } from '@tiny/core/slots'
import { builtUrl } from '@/shared/lib/assets'
import type { SlotHandle } from '@/shared/lib/slots'
import type { AtelierRoom } from './atelier'
import type { Attachment } from './carried'
import type { Character, Look, Pose } from './character'
import { CONFIG } from './config'
import type { Viewport } from './overlay'
import type { CharacterKind } from './rig'
import type { Traversal } from './traversal'

/** Costumes that exist as art; a saved id outside this list is worn as none. */
export const COSTUMES = ['kiki'] as const

const FLIGHT_SECONDS = 0.8
const PAUSE_SECONDS = 0.3
const FADE_SECONDS = 0.3

// Where a costume settles on each character: the middle of the body, at the dress's width.
const BODY: Attachment = {
  rig: {
    bunny: { bone: 'hips', x: 940, y: 1380, width: 1100, rotation: 0 },
    cat: { bone: 'hips', x: 950, y: 1420, width: 1000, rotation: 0 },
  },
  facing: 'right',
  width: 300,
  walk: { x: 190, y: 360, rotation: 0 },
  idle: { x: 190, y: 360, rotation: 0 },
  sit: { x: 190, y: 360, rotation: 0, width: 300, flip: 1 },
}

export function lookOf(outfit: Outfit): Look {
  const costume = outfit.costume.v
  return {
    kind: outfit.character.v,
    costume: costume !== null && (COSTUMES as readonly string[]).includes(costume) ? costume : null,
  }
}

/**
 * Keeps the visitor in the saved outfit as it changes after load (sign-in, another tab or
 * device), whenever no try-on or change of character is mid-way.
 */
export function followOutfit(
  character: Character,
  outfit: SlotHandle<Outfit>,
  busy: () => boolean,
  applied: () => void,
): { sync(): void; dispose(): void } {
  let applying = false
  let disposed = false
  // One change at a time; when it lands, look again, since the saved outfit may have moved on.
  function sync(): void {
    if (disposed || applying || busy()) return
    const look = lookOf(outfit.snapshot())
    if (look.kind === character.look.kind && look.costume === character.look.costume) return
    applying = true
    void character.wear(look).then(() => {
      applying = false
      if (disposed) return
      applied()
      sync()
    })
  }
  const unsubscribe = outfit.subscribe(sync)
  return {
    sync,
    dispose() {
      disposed = true
      unsubscribe()
    },
  }
}

export interface Wardrobe {
  readonly busy: boolean
  /** Set the form and the displays from what the visitor now wears. */
  reflect(): void
  tapFeatured(): void
  tapDisplay(kind: CharacterKind): void
  update(dt: number, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

interface Options {
  character: Character
  room: AtelierRoom
  traversal: Traversal
  outfit: SlotHandle<Outfit>
  host: HTMLElement
  costume: string
  onChange: (change: 'costume_on' | 'costume_off' | 'character') => void
  /** Called when a sequence ends, so a change that arrived meanwhile can be applied. */
  onIdle: () => void
}

type Step =
  | { kind: 'idle' }
  | { kind: 'wait' }
  | { kind: 'walk'; then: () => void }
  | { kind: 'pause'; left: number; then: () => void }
  | { kind: 'fly'; elapsed: number; toBody: boolean; done: () => void }
  | { kind: 'fade'; elapsed: number; apply: (opacity: number) => void; out: boolean; done: () => void }

export function createWardrobe({ character, room, traversal, outfit, host, costume, onChange, onIdle }: Options): Wardrobe {
  const { featured } = CONFIG.atelier

  const sprite = document.createElement('img')
  sprite.className = 'hall-carried hall-costume'
  sprite.alt = ''
  sprite.setAttribute('aria-hidden', 'true')
  sprite.src = builtUrl(manifest.atelier.costumeKiki.src)
  sprite.hidden = true
  host.appendChild(sprite)
  const aspect = manifest.atelier.costumeKiki.height / manifest.atelier.costumeKiki.width

  let step: Step = { kind: 'idle' }
  const world = new THREE.Vector3()
  const onForm: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }
  const onBody: Pose = { x: 0, y: 0, width: 0, rotation: 0, flip: 1 }

  function reflect(): void {
    room.setDressed(character.look.costume !== costume)
    room.setVisitor(character.look.kind)
  }
  reflect()

  function walkTo(x: number, then: () => void): void {
    traversal.hold(x, true)
    step = { kind: 'walk', then }
  }

  // A step's ending may wait on a rig load; park until it hands over, so it runs once.
  function settle(done: () => void): void {
    step = { kind: 'wait' }
    done()
  }

  function finish(): void {
    traversal.hold(null)
    step = { kind: 'idle' }
    reflect()
    onIdle()
  }

  function fade(out: boolean, apply: (opacity: number) => void, done: () => void): void {
    step = { kind: 'fade', elapsed: 0, apply, out, done }
  }

  function place(pose: Pose): void {
    sprite.style.width = `${pose.width.toFixed(1)}px`
    sprite.style.transform =
      `translate3d(${pose.x.toFixed(1)}px, ${pose.y.toFixed(1)}px, 0) rotate(${pose.rotation.toFixed(1)}deg)` +
      ` translate(${(-pose.width / 2).toFixed(1)}px, ${((-pose.width * aspect) / 2).toFixed(1)}px)`
  }

  return {
    get busy() {
      return step.kind !== 'idle'
    },

    reflect,

    tapFeatured() {
      if (step.kind !== 'idle') return
      const wearing = character.look.costume === costume
      walkTo(featured.standX, () => {
        step = {
          kind: 'pause',
          left: PAUSE_SECONDS,
          then: () => {
            if (wearing) void character.wear({ kind: character.look.kind, costume: null })
            else room.setDressed(false)
            step = {
              kind: 'fly',
              elapsed: 0,
              toBody: !wearing,
              done: () => {
                sprite.hidden = true
                if (wearing) {
                  outfit.update((o) => ({ ...o, costume: restamp(o.costume, null) }))
                  onChange('costume_off')
                  finish()
                  return
                }
                void character.wear({ kind: character.look.kind, costume }).then((ok) => {
                  if (ok) {
                    outfit.update((o) => ({ ...o, costume: restamp(o.costume, costume) }))
                    onChange('costume_on')
                  }
                  finish()
                })
              },
            }
            sprite.hidden = false
          },
        }
      })
    },

    tapDisplay(kind) {
      if (step.kind !== 'idle' || kind === character.look.kind) return
      const from = character.look
      // The visitor steps up in front of the chosen figure and takes its place.
      walkTo(room.displayX(kind), () => {
        step = {
          kind: 'pause',
          left: PAUSE_SECONDS,
          then: () => {
            // The visitor and the chosen figure fade together, then the visitor comes back as it
            // and their old self takes its place on its own platform.
            fade(
              true,
              (opacity) => {
                character.setOpacity(opacity)
                room.setFigureOpacity(kind, opacity)
              },
              () => {
                void character.wear({ kind, costume: from.costume }).then((ok) => {
                  const shown: CharacterKind = ok ? from.kind : kind
                  if (ok) {
                    room.setVisitor(kind)
                    room.setFigureOpacity(kind, 1)
                    outfit.update((o) => ({ ...o, character: restamp(o.character, kind) }))
                    onChange('character')
                  }
                  fade(
                    false,
                    (opacity) => {
                      character.setOpacity(opacity)
                      room.setFigureOpacity(shown, opacity)
                    },
                    finish,
                  )
                })
              },
            )
          },
        }
      })
    },

    update(dt, camera, viewport) {
      if (step.kind === 'walk') {
        if (traversal.isHeld) step.then()
        else if (!traversal.isFollowing) finish()
        return
      }
      if (step.kind === 'pause') {
        step.left -= dt
        if (step.left <= 0) step.then()
        return
      }
      if (step.kind === 'fade') {
        step.elapsed += dt
        const t = Math.min(1, step.elapsed / FADE_SECONDS)
        step.apply(step.out ? 1 - t : t)
        if (t >= 1) settle(step.done)
        return
      }
      if (step.kind !== 'fly') return

      const width = room.costumePoint(world)
      world.project(camera)
      onForm.x = (world.x * 0.5 + 0.5) * viewport.width
      onForm.y = (-world.y * 0.5 + 0.5) * viewport.height
      onForm.width = (width * viewport.height) / (camera.top - camera.bottom)
      character.attach(BODY, onBody)
      onBody.rotation = 0

      step.elapsed += dt
      const progress = Math.min(1, step.elapsed / FLIGHT_SECONDS)
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
      const from = step.toBody ? onForm : onBody
      const to = step.toBody ? onBody : onForm
      const lift = Math.sin(progress * Math.PI) * 0.06 * viewport.height
      // A soft settle rather than the helmet's spin: a slight sway that comes to rest.
      const sway = Math.sin(progress * Math.PI * 2) * 6 * (1 - progress)
      place({
        x: from.x + (to.x - from.x) * eased,
        y: from.y + (to.y - from.y) * eased - lift,
        width: from.width + (to.width - from.width) * eased,
        rotation: sway,
        flip: 1,
      })
      if (progress >= 1) settle(step.done)
    },

    dispose() {
      sprite.remove()
    },
  }
}
