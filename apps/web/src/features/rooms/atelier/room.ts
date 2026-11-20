import * as THREE from 'three'
import { outfit, restamp } from '@tiny/core/slots'
import { earn, getWalletSnapshot, subscribeWallet } from '@/features/economy/store'
import { walletReady } from '@/features/economy/lib/ownership'
import { createAtelierRoom } from '@/features/hall/scene/atelier'
import { CONFIG } from '@/features/hall/scene/config'
import { GALLERY_DOOR } from '@/features/hall/scene/gallery-door'
import { keepStamps } from '@/features/hall/scene/keep-stamps'
import { createLiveReflection } from '@/features/hall/scene/mirror-reflection'
import { createWardrobe, followOutfit, lookOf, ownedLook, type Wardrobe } from '@/features/hall/scene/wardrobe'
import { atelierRoomInfo } from '@/features/npcs/room-places'
import { defaultStore } from '@/shared/lib/slots'
import { track } from '@/shared/lib/visit'
import type { AtelierArtwork } from '../art'
import type { SpotPainting } from '@tiny/core'
import type { CharacterKind } from '@/features/hall/scene/rig'
import type { JoinedRoom, RoomDef } from '../types'

/** How the page reaches into the room: it hears when the mirror is tapped, and asks the room to change character. */
export interface AtelierHooks {
  onMirror(): void
  onCloset(): void
  become: { current: ((kind: CharacterKind) => void) | null }
  /** Puts on what was chosen in the closet. */
  dress: { current: ((costume: string | null, bow: string | null) => void) | null }
  /** Opens or shuts the wardrobe's doors with the closet. */
  wardrobeDoors: { current: ((open: boolean) => void) | null }
}

const SPARKLE_TINTS = ['#fbd99a', '#f7a8c4', '#fff4dc']

/** A short burst of sparkles over the visitor when their outfit changes. */
function sparkle(host: HTMLElement): void {
  const figure = host.querySelector<HTMLElement>('.hall-bunny-rig:not([hidden]), .hall-bunny:not([hidden])')
  if (!figure || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const at = figure.getBoundingClientRect()
  const origin = host.getBoundingClientRect()
  const burst = document.createElement('div')
  burst.className = 'atelier-sparkle'
  burst.style.left = `${at.left + at.width / 2 - origin.left}px`
  burst.style.top = `${at.top + at.height * 0.45 - origin.top}px`
  for (let i = 0; i < 9; i++) {
    const star = document.createElement('span')
    const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.5
    const reach = at.height * (0.45 + Math.random() * 0.2)
    star.style.setProperty('--dx', `${Math.cos(angle) * reach}px`)
    star.style.setProperty('--dy', `${Math.sin(angle) * reach}px`)
    star.style.setProperty('--tint', SPARKLE_TINTS[i % SPARKLE_TINTS.length])
    star.style.setProperty('--size', `${14 + Math.random() * 10}px`)
    star.style.animationDelay = `${Math.random() * 0.12}s`
    burst.append(star)
  }
  host.append(burst)
  window.setTimeout(() => burst.remove(), 1100)
}

/** The fashion area, its frames showing the paintings the owner published to them. */
export function createAtelierRoomDef(spots: Readonly<Record<string, SpotPainting>>, hooks: AtelierHooks): RoomDef<AtelierArtwork> {
  return {
    id: 'atelier',
    className: 'atelier',
    clearColor: '#3a0707',
    minLoadingMs: 2800,
    doors: {
      gallery: { x: GALLERY_DOOR.atelierX, clearX: GALLERY_DOOR.atelierX + GALLERY_DOOR.clear, label: 'To the hall' },
    },

    build(ctx, { art, door }) {
      const room = createAtelierRoom(ctx.scene, art, ctx.overlay, door, spots)
      const outfitSlot = defaultStore().getSlot(outfit)
      let wardrobe: Wardrobe | null = null
      const follower = followOutfit(
        ctx.character,
        outfitSlot,
        () => wardrobe?.busy ?? true,
        () => wardrobe?.reflect(),
      )
      wardrobe = createWardrobe({
        character: ctx.character,
        room,
        outfit: outfitSlot,
        onChange: (change) => { track(change); sparkle(ctx.characterHost) },
        onIdle: follower.sync,
      })
      const closet = wardrobe
      function openMirror(): void {
        room.markMirrorSeen()
        hooks.onMirror()
      }
      hooks.become.current = (kind) => closet.tapDisplay(kind)
      hooks.dress.current = (costume, bow) => closet.dress(costume, bow)
      hooks.wardrobeDoors.current = (open) => room.setWardrobeOpen(open)
      const reflection = createLiveReflection(ctx.characterHost, ctx.character)
      const corner = new THREE.Vector3()

      // Walking out, anything unkept leaves the visitor and flies home before the room goes.
      let leaving = false
      function leaveByDoor(): void {
        if (leaving) return
        leaving = true
        track('stairs')
        const snapshot = getWalletSnapshot()
        const look = lookOf(outfitSlot.snapshot())
        const figure = ctx.characterHost.querySelector<HTMLElement>('.hall-bunny-rig:not([hidden]), .hall-bunny:not([hidden])')
        const flight = figure ? room.flyHome(keepStamps(look, snapshot), figure.getBoundingClientRect()) : 0
        if (flight > 0) {
          const kept = ownedLook(look, snapshot)
          outfitSlot.update((o) => ({
            ...o,
            character: restamp(o.character, kept.kind),
            costume: restamp(o.costume, kept.costume),
            bow: restamp(o.bow, kept.bow),
          }))
        }
        window.setTimeout(() => ctx.leave('gallery'), flight)
      }
      let disposed = false
      const stopWallet = subscribeWallet(() => {
        const snapshot = getWalletSnapshot()
        room.setOwned(walletReady(snapshot) ? snapshot.items : null)
      })
      const snapshot = getWalletSnapshot()
      room.setOwned(walletReady(snapshot) ? snapshot.items : null)

      void ctx.character.ready.finally(() => {
        if (!disposed && !closet.busy) closet.reflect()
      })

      // Each collection is its own room, joined wall to wall; the stage builds the ones near the camera.
      const joinedRooms: JoinedRoom[] = room.rooms.map(({ key, label, startX, endX }) => ({
        key,
        startX,
        endX,
        label,
        tint: key === 'entrance' ? 'atelierEntrance' : 'collection',
        build() {
          const teardown = room.buildRoom(key)
          return { hitTest: () => null, update() {}, dispose: teardown }
        },
      }))

      room.setActions({
        onItem: (item) => { if (!ctx.isQuiet()) closet.tapItem(item) },
        onMirror: () => { if (!ctx.isQuiet()) openMirror() },
        onWardrobe: () => { if (!ctx.isQuiet()) hooks.onCloset() },
        onLeave: () => { if (!ctx.isQuiet()) leaveByDoor() },
      })

      return {
        floor: { kind: 'strip', minX: GALLERY_DOOR.atelierX, maxX: () => CONFIG.atelier.max - 0.45 },
        npc: { info: () => atelierRoomInfo(GALLERY_DOOR.atelierX) },
        cameraBounds: {
          minX: GALLERY_DOOR.atelierX - Math.max(
            GALLERY_DOOR.height * door.naturalWidth / door.naturalHeight,
            CONFIG.lobby.sign.width,
          ) / 2 - 0.15,
          maxX: () => CONFIG.atelier.max + 0.15,
        },
        presence: { key: 'atelier' },
        joined: () => joinedRooms,

        onShown() {
          closet.reflect()
          track('atelier')
          earn('secret', { feature: 'atelier' })
        },

        hitTest(raycaster) {
          const item = room.hitTestItem(raycaster)
          if (item) return { activate: () => closet.tapItem(item) }
          if (room.hitTestMirror(raycaster)) return { activate: openMirror }
          if (room.hitTestWardrobe(raycaster)) return { activate: () => hooks.onCloset() }
          if (room.hitTestDoor(raycaster)) {
            return { activate: leaveByDoor }
          }
          return null
        },

        update(frame) {
          room.update(frame.dt, ctx.traversal.x)
          room.sync(frame.camera, frame.viewport, !frame.quiet)
          // The glass and the wall's foot on screen, in the character host's pixels, as the character draws itself.
          const toScreenX = (x: number) => (corner.set(x, 0, 0).project(frame.camera).x * 0.5 + 0.5) * frame.viewport.width
          const toScreenY = (y: number) => (-corner.set(0, y, 0).project(frame.camera).y * 0.5 + 0.5) * frame.viewport.height
          const glass = room.mirrorGlass()
          reflection.update(frame.dt, glass && {
            left: toScreenX(glass.left),
            right: toScreenX(glass.right),
            top: toScreenY(glass.top),
            bottom: toScreenY(glass.bottom),
          }, toScreenY(0))
        },

        dispose() {
          disposed = true
          hooks.become.current = null
          hooks.dress.current = null
          hooks.wardrobeDoors.current = null
          reflection.dispose()
          stopWallet()
          follower.dispose()
          closet.dispose()
          room.dispose()
        },
      }
    },
  }
}
