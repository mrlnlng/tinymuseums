import * as THREE from 'three'
import { castMember, FRAME, IDLE, idleCel, WORLD_PER_PX } from '@/features/npcs/cast'
import { assetEntry, assetUrl, type AssetName } from '@/shared/lib/assets'
import type { Viewport } from './overlay'

export interface HallGuide {
  /** The door they keep. */
  door: string
  npc: string
  /** Where they stand: along the hall, and the height of their feet, level with their door's foot. */
  x: number
  floorY: number
}

/** How near the visitor comes before a guide shows they have something to say. */
const NEAR = 1.6
const PROJECTED = new THREE.Vector3()

/** Characters standing beside their doors; tapping one starts a conversation. */
export function createDoorGuides(host: HTMLElement, guides: readonly HallGuide[], onTalk: (door: string) => void) {
  const shown = guides.map((guide) => {
    const character = castMember(guide.npc)
    const idleAsset = `npcs/${guide.npc}-idle` as AssetName
    const idle = Boolean(assetEntry(idleAsset))
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'door-guide'
    button.setAttribute('aria-label', `Talk to ${character.name}, the ${character.role.toLowerCase()}`)
    const sprite = document.createElement('span')
    sprite.className = 'door-guide-sprite'
    sprite.style.backgroundImage = `url("${assetUrl(idle ? idleAsset : (character.asset as AssetName))}")`
    const hint = document.createElement('span')
    hint.className = 'door-guide-hint'
    hint.textContent = '…'
    hint.setAttribute('aria-hidden', 'true')
    button.append(sprite, hint)
    button.addEventListener('click', () => onTalk(guide.door))
    host.append(button)
    return { guide, character, button, sprite, hint, count: idle ? IDLE.count : FRAME.count }
  })
  const startedAt = performance.now()
  const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  return {
    sync(camera: THREE.OrthographicCamera, viewport: Viewport, enabled: boolean, playerX: number) {
      const scale = WORLD_PER_PX * (viewport.height / (camera.top - camera.bottom))
      const width = FRAME.width * scale
      const height = FRAME.height * scale
      const cel = reduced ? 0 : idleCel(performance.now() - startedAt)
      for (const { guide, character, button, sprite, hint, count } of shown) {
        if (button.disabled !== !enabled) button.disabled = !enabled
        PROJECTED.set(guide.x, guide.floorY, 0).project(camera)
        const screenX = (PROJECTED.x * 0.5 + 0.5) * viewport.width
        const screenY = (-PROJECTED.y * 0.5 + 0.5) * viewport.height
        const offscreen = screenX + width < 0 || screenX - width > viewport.width
        if (button.hidden !== offscreen) button.hidden = offscreen
        if (offscreen) continue
        // Facing whoever comes near, the way a host turns to a guest.
        const facing = playerX < guide.x ? -1 : 1
        const anchorX = character.anchorX * scale
        button.style.width = `${width.toFixed(1)}px`
        button.style.height = `${height.toFixed(1)}px`
        button.style.transform = `translate3d(${(screenX - anchorX).toFixed(1)}px, ${(screenY - FRAME.anchorY * scale).toFixed(1)}px, 0)`
        sprite.style.transformOrigin = `${anchorX.toFixed(1)}px 0`
        button.style.setProperty('--feet-x', `${anchorX.toFixed(1)}px`)
        sprite.style.transform = `scaleX(${facing})`
        sprite.style.backgroundSize = `${(width * count).toFixed(1)}px ${height.toFixed(1)}px`
        sprite.style.backgroundPositionX = `${(-(cel % count) * width).toFixed(1)}px`
        const near = Math.abs(playerX - guide.x) < NEAR
        if (hint.hidden !== !near) hint.hidden = !near
      }
    },
    dispose() {
      for (const { button } of shown) button.remove()
    },
  }
}
