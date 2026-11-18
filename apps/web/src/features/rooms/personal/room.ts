import { THEMES, WEAR, type Placement } from '@tiny/core/rooms'
import { GALLERY_DOOR, createGalleryDoor } from '@/features/hall/scene/gallery-door'
import { placeLabel, writeStyle } from '@/features/hall/scene/overlay'
import type { DecorController } from '../decorate/controller'
import { cozyLevel } from '../decorate/logic'
import {
  type RoomLight,
  cozyTheme,
  createCozyBackdrop,
  createPlacementLayer,
} from '../themes/cozy'
import { darknessAt } from '../themes/room-light'
import type { PersonalArt } from '../art'
import type { RoomDef } from '../types'

const DOOR_X = 1.0
const DOOR_BASE = -0.02
const DOOR_CLEAR = 0.85
const MIN_X = 0.6
/** Visitors stop this short of the right wall. */
const WALK_GAP = 0.6
const ROOM_LEFT = 0
/** Engraved on the door's brass plate: centred at 0.496 of its width and 0.627 of its height. */
const DOOR_SIGN = { x: DOOR_X - 0.006, y: DOOR_BASE + 0.627 * GALLERY_DOOR.height, width: 0.42 }
const NAME_SIGN = { x: 1.9, y: 4.1, width: 4.2 }

export interface PersonalRoomOptions {
  slug: string
  placements: Placement[]
  ownerName?: string | null
  shareKey?: string
  decor?: DecorController
  /** The room's current length; it grows when the owner knocks a wall through. */
  width: () => number
}

function nameSignText(ownerName: string | null | undefined): string {
  return ownerName ? `${ownerName}’s room` : 'A cozy room'
}

/** Long names shrink so the sign stays about as wide as a short one. */
const NAME_FITS = 20

function nameScale(text: string): number {
  return Math.max(0.55, Math.min(1, NAME_FITS / text.length))
}

/** The closet's darkness: thicker the more dirt is left, and gone once it's clean. */
export function gloomFor(placements: readonly Placement[]): number {
  // Wear is only worn-looking; it doesn't make the room darker.
  const dirt = placements.filter((placement) => placement.kind === 'mess' && !WEAR[placement.ref]).length
  return dirt === 0 ? 0 : Math.min(0.86, 0.4 + dirt * 0.07)
}

/** The room's light: its attic windows and bare bulbs. */
function lightOf(placements: readonly Placement[]): RoomLight {
  const props = placements.filter((placement) => placement.kind === 'prop')
  const pane = THEMES.cozy.props['attic-window']
  return {
    gloom: gloomFor(placements),
    suns: pane
      ? props
          .filter((placement) => placement.ref === 'attic-window')
          .map((window) => ({ x: window.x, y: window.y ?? 2.3 - pane.height / 2, width: pane.width, height: pane.height }))
      : [],
    lamps: props.filter((placement) => placement.ref === 'bare-bulb').map((bulb) => ({ x: bulb.x, y: (bulb.y ?? 2.3) + 0.2 })),
  }
}

export function createPersonalRoom({ slug, placements, ownerName, shareKey, decor, width }: PersonalRoomOptions): RoomDef<PersonalArt> {
  return {
    id: 'personal',
    className: 'cozy',
    clearColor: '#f6e7cf',
    gatesItself: false,
    doors: {
      hall: { x: DOOR_X, clearX: DOOR_X + DOOR_CLEAR },
    },

    build(ctx, { cozy, door }) {
      let shownWidth = width()
      const backdrop = createCozyBackdrop(ctx.scene, cozy, shownWidth)
      let arrangement: readonly Placement[] = placements
      let lit = lightOf(arrangement)
      function light(): void {
        lit = lightOf(arrangement)
        backdrop.setLight(lit)
      }

      /** The visitor and the signs take the room's light where they are: dim in the dark, warm in it. */
      const shadeAt = (x: number, y: number) => darknessAt(lit, shownWidth, x, y)
      function signFilter(dark: number): string {
        return dark > 0.02 ? `brightness(${(1 - dark * 0.7).toFixed(2)}) sepia(${(dark * 0.45).toFixed(2)})` : ''
      }
      function shade(): void {
        const dark = shadeAt(ctx.traversal.x, 0.1)
        ctx.character.setShade(1 - dark * 0.72, lit.gloom > 0 ? 0.12 + dark * 0.35 : dark * 0.3)
        writeStyle(nameSign, 'filter', signFilter(shadeAt(NAME_SIGN.x, NAME_SIGN.y)))
        writeStyle(doorSign, 'filter', signFilter(shadeAt(DOOR_SIGN.x, DOOR_SIGN.y)))
      }
      backdrop.setFinishes(placements)
      light()
      const layer = createPlacementLayer(ctx.scene, cozy, cozyTheme, () => shownWidth)
      layer.set(placements)
      const hallDoor = createGalleryDoor(ctx.scene, door, DOOR_X, DOOR_BASE)

      const doorSign = document.createElement('div')
      doorSign.className = 'room-door-plate'
      doorSign.textContent = 'Museum'
      const nameSign = document.createElement('div')
      nameSign.className = 'room-sign room-name-sign'
      const nameLine = document.createElement('span')
      nameLine.className = 'room-name-sign-name'
      nameLine.textContent = nameSignText(ownerName)
      nameLine.style.fontSize = `${(1.25 * nameScale(nameLine.textContent)).toFixed(3)}em`
      const levelLine = document.createElement('span')
      levelLine.className = 'room-name-sign-level'
      nameSign.append(nameLine, levelLine)
      ctx.overlay.append(doorSign, nameSign)

      function showArrangement(next: Placement[]): void {
        arrangement = next
        backdrop.setFinishes(next)
        light()
        showLevel(next)
      }

      function showLevel(next: Placement[]): void {
        const level = cozyLevel(next)
        levelLine.textContent = `${'♥'.repeat(level.hearts)}${'♡'.repeat(level.maxHearts - level.hearts)} ${level.name}`
      }
      showLevel(placements)

      const canvas = ctx.overlay.parentElement?.querySelector<HTMLCanvasElement>('canvas.hall-canvas')
      if (decor && canvas) {
        decor.attach({
          camera: ctx.rig.camera,
          canvas,
          layer,
          traversal: ctx.traversal,
          character: ctx.character,
          minX: MIN_X,
          get maxX() {
            return width() - WALK_GAP
          },
          onPlacements: showArrangement,
        })
      }

      return {
        floor: { kind: 'strip', minX: MIN_X, maxX: () => width() - WALK_GAP },
        cameraBounds: { minX: ROOM_LEFT, maxX: () => width() },

        presence: { key: slug, ticketKey: shareKey },

        onShown() {
          if (ctx.arrival.kind === 'opening') {
            ctx.traversal.reset(DOOR_X + DOOR_CLEAR)
            return true
          }
        },

        hitTest(raycaster) {
          if (decor?.isEditing()) return null
          if (hallDoor.hitTest(raycaster)) {
            return { activate: () => ctx.leave('hall') }
          }
          return null
        },

        update(frame) {
          backdrop.update(frame.now)
          shade()
          const nextWidth = width()
          if (nextWidth !== shownWidth) {
            shownWidth = nextWidth
            backdrop.setWidth(nextWidth)
            light()
          }
          decor?.tick(frame.now, frame.dt)
          layer.update(frame.now)
          const perUnit = frame.viewport.width / (frame.camera.right - frame.camera.left)
          placeLabel(doorSign, DOOR_SIGN, perUnit, frame.camera, frame.viewport, 0.2)
          // While decorating the view lifts and the sign would slide under the corner buttons.
          if (decor?.isEditing()) writeStyle(nameSign, 'opacity', '0')
          else placeLabel(nameSign, NAME_SIGN, perUnit, frame.camera, frame.viewport, 0.04)
        },

        cameraRise() {
          return decor?.rise() ?? 0
        },

        dispose() {
          ctx.character.setShade(1, 0)
          decor?.detach()
          doorSign.remove()
          nameSign.remove()
          layer.dispose()
          backdrop.dispose()
          hallDoor.dispose()
        },
      }
    },
  }
}
