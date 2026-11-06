import type { Placement } from '@tiny/core/rooms'
import { GALLERY_DOOR, createGalleryDoor, loadGalleryDoor } from '@/features/hall/scene/gallery-door'
import { placeLabel, writeStyle } from '@/features/hall/scene/overlay'
import type { DecorController } from '../decorate/controller'
import { cozyLevel } from '../decorate/logic'
import {
  cozyTheme,
  createCozyBackdrop,
  createPlacementLayer,
  disposeCozyArt,
  loadCozyArt,
  type CozyArt,
} from '../themes/cozy'
import type { RoomDef } from '../types'

const DOOR_X = 0.95
const DOOR_CLEAR = 0.85
const MIN_X = 0.6
const MAX_X = 19.4
/** Covers the wardrobe badge on the borrowed atelier doorway. */
const DOOR_SIGN = { x: DOOR_X, y: GALLERY_DOOR.lobbyBase + GALLERY_DOOR.height - 0.36, width: 1.15 }
const NAME_SIGN = { x: 3.5, y: 4.1, width: 4.2 }

interface PersonalArt {
  cozy: CozyArt
  door: HTMLImageElement
}

export interface PersonalRoomOptions {
  slug: string
  placements: Placement[]
  ownerName?: string | null
  shareKey?: string
  decor?: DecorController
}

function nameSignText(ownerName: string | null | undefined): string {
  return ownerName ? `${ownerName}’s room` : 'A cozy room'
}

/** Long names shrink so the sign stays about as wide as a short one. */
const NAME_FITS = 20

function nameScale(text: string): number {
  return Math.max(0.55, Math.min(1, NAME_FITS / text.length))
}

export function createPersonalRoom({ slug, placements, ownerName, shareKey, decor }: PersonalRoomOptions): RoomDef<PersonalArt> {
  return {
    id: 'personal',
    className: 'cozy',
    clearColor: '#f6e7cf',
    gatesItself: false,
    doors: {
      hall: { x: DOOR_X, clearX: DOOR_X + DOOR_CLEAR },
    },

    async load() {
      const [cozy, door] = await Promise.all([loadCozyArt(), loadGalleryDoor()])
      return { cozy, door }
    },

    unload({ cozy }) {
      disposeCozyArt(cozy)
    },

    build(ctx, { cozy, door }) {
      const backdrop = createCozyBackdrop(ctx.scene, cozy)
      const layer = createPlacementLayer(ctx.scene, cozy, cozyTheme)
      layer.set(placements)
      const hallDoor = createGalleryDoor(ctx.scene, door, DOOR_X, GALLERY_DOOR.lobbyBase)

      const doorSign = document.createElement('div')
      doorSign.className = 'room-sign room-door-sign'
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
          maxX: MAX_X,
          onPlacements: showLevel,
        })
      }

      return {
        floor: { kind: 'strip', minX: MIN_X, maxX: () => MAX_X },

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
          decor?.tick(frame.now, frame.dt)
          layer.update(frame.now)
          const perUnit = frame.viewport.width / (frame.camera.right - frame.camera.left)
          placeLabel(doorSign, DOOR_SIGN, perUnit, frame.camera, frame.viewport, 0.17)
          // While decorating the view lifts and the sign would slide under the corner buttons.
          if (decor?.isEditing()) writeStyle(nameSign, 'opacity', '0')
          else placeLabel(nameSign, NAME_SIGN, perUnit, frame.camera, frame.viewport, 0.04)
        },

        cameraRise() {
          return decor?.rise() ?? 0
        },

        dispose() {
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
