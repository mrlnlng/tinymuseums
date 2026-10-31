import type * as THREE from 'three'
import { EMOTES } from '@tiny/core/presence/wire'
import { randomSeed } from '@tiny/core/presence'
import { presence as presenceSlot } from '@tiny/core/slots'
import type { Character } from '@/features/hall/scene/character'
import type { Viewport } from '@/features/hall/scene/overlay'
import type { Traversal } from '@/features/hall/scene/traversal'
import { defaultStore } from '@/shared/lib/slots'
import { createRemoteVisitors } from '../scene/remote-visitors'
import { onEmoteRequest, setInRoom } from './emote-events'
import { createPresence } from './presence'

interface Options {
  /** `hall-e<epoch>` or `atelier`. */
  room: string
  /** The character host: other visitors draw behind the local one in it. */
  host: HTMLElement
  character: Character
  traversal: Traversal
}

export interface Room {
  update(dt: number, camera: THREE.OrthographicCamera, viewport: Viewport): void
  dispose(): void
}

/** Shares this page's room with other visitors: call update once a frame after the character's. */
export function joinRoom({ room, host, character, traversal }: Options): Room {
  const prefs = defaultStore().getSlot(presenceSlot)
  if (prefs.snapshot().seed === null) prefs.update((current) => ({ ...current, seed: randomSeed() }))
  const seed = prefs.snapshot().seed ?? randomSeed()

  let facing: 1 | -1 = 1
  const presence = createPresence({
    room,
    seed,
    self: () => ({ x: traversal.x, vx: traversal.walkVelocity, facing, look: character.look }),
    walkAlone: () => prefs.snapshot().walkAlone.v,
    visible: () => document.visibilityState === 'visible',
  })
  const remote = createRemoteVisitors(host)

  function emote(e: (typeof EMOTES)[number]): void {
    if (presence.emote(e)) remote.showOwnEmote(e)
  }
  const stopEmotes = onEmoteRequest(emote)
  const onKey = (event: KeyboardEvent) => {
    const target = event.target instanceof Element ? event.target : null
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
    if (target?.closest('input, textarea, select, [contenteditable="true"]') || document.querySelector('[aria-modal="true"]')) return
    const index = Number(event.key) - 1
    if (index >= 0 && index < EMOTES.length) emote(EMOTES[index])
  }
  window.addEventListener('keydown', onKey)

  return {
    update(dt, camera, viewport) {
      if (Math.abs(traversal.walkVelocity) > 0.12) facing = traversal.walkVelocity > 0 ? 1 : -1
      presence.tick()
      setInRoom(presence.status === 'open')
      remote.update(dt, presence.visitors(), traversal.x, camera, viewport)
    },
    dispose() {
      setInRoom(false)
      stopEmotes()
      window.removeEventListener('keydown', onKey)
      presence.dispose()
      remote.dispose()
    },
  }
}
