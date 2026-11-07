import { outfit } from '@tiny/core/slots'
import { earn, getWalletSnapshot, subscribeWallet } from '@/features/economy/store'
import { walletReady } from '@/features/economy/lib/ownership'
import { createAtelierRoom } from '@/features/hall/scene/atelier'
import { CONFIG } from '@/features/hall/scene/config'
import { GALLERY_DOOR } from '@/features/hall/scene/gallery-door'
import { createWardrobe, followOutfit, type Wardrobe } from '@/features/hall/scene/wardrobe'
import { defaultStore } from '@/shared/lib/slots'
import { track } from '@/shared/lib/visit'
import type { AtelierArtwork } from '../art'
import type { RoomDef } from '../types'

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

export const atelierRoom: RoomDef<AtelierArtwork> = {
  id: 'atelier',
  className: 'atelier',
  clearColor: '#3a0707',
  minLoadingMs: 2800,
  doors: {
    gallery: { x: GALLERY_DOOR.atelierX, clearX: GALLERY_DOOR.atelierX + GALLERY_DOOR.clear },
  },

  build(ctx, { art, door }) {
    const room = createAtelierRoom(ctx.scene, art, ctx.overlay, door)
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
      onMisfit: (item, kind) => room.showMisfit(item, kind),
      onIdle: follower.sync,
    })
    const closet = wardrobe
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

    room.setActions({
      onItem: (item) => { if (!ctx.isQuiet()) closet.tapItem(item) },
      onCharacter: (kind) => { if (!ctx.isQuiet()) closet.tapDisplay(kind) },
      onLeave: () => { if (!ctx.isQuiet()) { track('stairs'); ctx.leave('gallery') } },
    })

    return {
      floor: { kind: 'strip', minX: GALLERY_DOOR.atelierX, maxX: () => CONFIG.atelier.max },
      presence: { key: 'atelier' },

      onShown() {
        closet.reflect()
        track('atelier')
        earn('secret', { feature: 'atelier' })
      },

      hitTest(raycaster) {
        const item = room.hitTestItem(raycaster)
        if (item) return { activate: () => closet.tapItem(item) }
        const kind = room.hitTestDisplay(raycaster)
        if (kind) return { activate: () => closet.tapDisplay(kind) }
        if (room.hitTestDoor(raycaster)) {
          return { activate: () => { track('stairs'); ctx.leave('gallery') } }
        }
        return null
      },

      update(frame) {
        room.update(frame.dt, ctx.traversal.x)
        room.sync(frame.camera, frame.viewport, !frame.quiet)
      },

      dispose() {
        disposed = true
        stopWallet()
        follower.dispose()
        closet.dispose()
        room.dispose()
      },
    }
  },
}
