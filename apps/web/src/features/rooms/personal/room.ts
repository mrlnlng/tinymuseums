import type { Placement } from '@tiny/core'
import { createGalleryDoor, loadGalleryDoor } from '@/features/hall/scene/gallery-door'
import type { DecorController } from '../decorate/controller'
import {
  cozyTheme,
  createCozyBackdrop,
  createPlacementLayer,
  disposeCozyArt,
  loadCozyArt,
  type CozyArt,
} from '../themes/cozy'
import type { RoomDef } from '../types'

const DOOR_X = 0.9
const DOOR_CLEAR = 0.85
const DOOR_BASE = -0.71
const MIN_X = 0.6
const MAX_X = 13.4

interface PersonalArt {
  cozy: CozyArt
  door: HTMLImageElement
}

export interface PersonalRoomOptions {
  slug: string
  placements: Placement[]
  shareKey?: string
  decor?: DecorController
}

export function createPersonalRoom({ slug, placements, shareKey, decor }: PersonalRoomOptions): RoomDef<PersonalArt> {
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
      const hallDoor = createGalleryDoor(ctx.scene, door, DOOR_X, DOOR_BASE)
      const canvas = ctx.overlay.parentElement?.querySelector<HTMLCanvasElement>('canvas.hall-canvas')
      if (decor && canvas) {
        decor.attach({
          scene: ctx.scene,
          camera: ctx.rig.camera,
          canvas,
          layer,
          traversal: ctx.traversal,
          character: ctx.character,
          minX: MIN_X,
          maxX: MAX_X,
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
          if (hallDoor.hitTest(raycaster)) {
            return { activate: () => ctx.leave('hall') }
          }
          return null
        },

        update() {},

        dispose() {
          decor?.detach()
          layer.dispose()
          backdrop.dispose()
          hallDoor.dispose()
        },
      }
    },
  }
}
