import type * as THREE from 'three'
import type { Item } from '@tiny/core/presence/wire'
import { randomSeed } from '@tiny/core/presence'
import { presence as presenceSlot } from '@tiny/core/slots'
import type { Character } from '@/features/hall/scene/character'
import type { Viewport } from '@/features/hall/scene/overlay'
import type { Traversal } from '@/features/hall/scene/traversal'
import { defaultStore } from '@/shared/lib/slots'
import { createRemoteVisitors, type VisitorScenery } from '../scene/remote-visitors'
import { isMuted, onNameChange, onSayRequest, openChat, reportSay, setInRoom, setPeople } from './room-events'
import { createPresence } from './presence'
import { createTabTurn } from './tab-turn'

export interface Pose {
  sit: boolean
  helm: boolean
  cup: boolean
}

const STANDING: Pose = { sit: false, helm: false, cup: false }

interface Options {
  /** `hall-e<epoch>` or `atelier`. */
  room: string
  /** The character host: other visitors draw behind the local one in it. */
  host: HTMLElement
  character: Character
  traversal: Traversal
  /** What the local visitor is doing that others should see. */
  pose?: () => Pose
  /** What it takes to draw others sitting or carrying, once the scene has loaded it. */
  scenery?: () => VisitorScenery | null
}

export interface Room {
  update(dt: number, camera: THREE.OrthographicCamera, viewport: Viewport): void
  /** Ask the room for an item, or let it go. */
  want(item: Item, on: boolean): void
  /** Someone else in the room holds it. */
  taken(item: Item): boolean
  /** Items other visitors hold. */
  heldByOthers(): Item[]
  dispose(): void
}

/** Shares this page's room with other visitors: call update once a frame after the character's. */
export function joinRoom({ room, host, character, traversal, pose = () => STANDING, scenery = () => null }: Options): Room {
  const store = defaultStore()
  const prefs = store.getSlot(presenceSlot)
  if (prefs.snapshot().seed === null) prefs.update((current) => ({ ...current, seed: randomSeed() }))
  const seed = prefs.snapshot().seed ?? randomSeed()

  let facing: 1 | -1 = 1
  const turn = createTabTurn()
  let remoteVisitors: ReturnType<typeof createRemoteVisitors> | null = null
  const presence = createPresence({
    room,
    seed,
    self: () => ({ x: traversal.x, vx: traversal.walkVelocity, facing, look: character.look, ...pose() }),
    walkAlone: () => prefs.snapshot().walkAlone.v,
    visible: () => document.visibilityState === 'visible',
    active: turn.active,
    onSaid: (pid, name, text) => {
      if (!isMuted(pid)) remoteVisitors?.announce(`${name} says: ${text}`)
    },
    onRefused: (reason) => reportSay({ ok: false, reason }),
  })
  const remote = createRemoteVisitors(host)
  remoteVisitors = remote

  const stopSay = onSayRequest((text) => {
    const result = presence.say(text)
    reportSay(result.ok ? { ok: true } : result)
    if (!result.ok) return
    remote.showOwnMessage(result.text)
    character.bounce()
  })
  // A new name, or signing in or out, takes a fresh ticket so the others see who this is now.
  const stopNames = onNameChange(presence.reconnect)
  let memberId = store.getMemberSnapshot()?.id ?? null
  const stopMember = store.subscribeMember(() => {
    const next = store.getMemberSnapshot()?.id ?? null
    if (next === memberId) return
    memberId = next
    presence.reconnect()
  })
  const onKey = (event: KeyboardEvent) => {
    const target = event.target instanceof Element ? event.target : null
    if (event.repeat || event.metaKey || event.ctrlKey || event.altKey) return
    if (target?.closest('input, textarea, select, button, [contenteditable="true"]') || document.querySelector('[aria-modal="true"]')) return
    if (event.key !== 'Enter' || presence.status !== 'open') return
    event.preventDefault()
    openChat()
  }
  window.addEventListener('keydown', onKey)

  return {
    update(dt, camera, viewport) {
      if (Math.abs(traversal.walkVelocity) > 0.12) facing = traversal.walkVelocity > 0 ? 1 : -1
      presence.tick()
      setInRoom(presence.status === 'open')
      const visitors = presence.visitors()
      setPeople(visitors)
      remote.update(dt, visitors, traversal.x, camera, viewport, scenery())
    },
    want: presence.want,
    taken: presence.blocked,
    heldByOthers: presence.heldByOthers,
    dispose() {
      setInRoom(false)
      setPeople([])
      stopSay()
      stopNames()
      stopMember()
      window.removeEventListener('keydown', onKey)
      presence.dispose()
      turn.dispose()
      remote.dispose()
    },
  }
}
