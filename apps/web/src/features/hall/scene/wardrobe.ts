import { restamp, type Outfit } from '@tiny/core/slots'
import type { SlotHandle } from '@/shared/lib/slots'
import type { AtelierRoom, ClothingPart } from './atelier'
import type { Character, Look } from './character'
import type { CharacterKind } from './rig'

export const COSTUMES = ['kiki'] as const

export function lookOf(outfit: Outfit): Look {
  const known = (id: string | null) => id !== null && (COSTUMES as readonly string[]).includes(id) ? id : null
  return { kind: outfit.character.v, costume: known(outfit.costume.v), bow: known(outfit.bow.v) }
}

export function followOutfit(
  character: Character,
  outfit: SlotHandle<Outfit>,
  busy: () => boolean,
  applied: () => void,
): { sync(): void; dispose(): void } {
  let applying = false
  let disposed = false
  let failed: string | null = null
  function sync(): void {
    if (disposed || applying || busy()) return
    const look = lookOf(outfit.snapshot())
    const key = JSON.stringify(look)
    if (key === JSON.stringify(character.look) || key === failed) return
    applying = true
    void character.wear(look).then((ok) => {
      applying = false
      if (disposed) return
      failed = ok ? null : key
      applied()
      sync()
    })
  }
  const unsubscribe = outfit.subscribe(sync)
  return { sync, dispose() { disposed = true; unsubscribe() } }
}

export interface Wardrobe {
  readonly busy: boolean
  reflect(): void
  tapFeatured(part: ClothingPart): void
  tapDisplay(kind: CharacterKind): void
  dispose(): void
}

interface Options {
  character: Character
  room: AtelierRoom
  outfit: SlotHandle<Outfit>
  costume: string
  onChange: (change: 'costume_on' | 'costume_off' | 'character') => void
  onIdle: () => void
}

/** Outfit changes never hold traversal or fade the working character out. */
export function createWardrobe({ character, room, outfit, costume, onChange, onIdle }: Options): Wardrobe {
  let queue = Promise.resolve()
  let pending = 0
  let disposed = false
  function reflect(): void {
    room.setDressed(character.look.costume !== costume, character.look.bow !== costume)
    room.setVisitor(character.look.kind)
  }
  function enqueue(change: () => Promise<void>): void {
    pending++
    queue = queue.then(async () => { if (!disposed) await change() })
      .catch((error) => { console.warn('[atelier] Could not change outfit', error) })
      .finally(() => {
        pending--
        if (disposed) return
        character.setOpacity(1)
        reflect()
        if (pending === 0) onIdle()
      })
  }
  reflect()
  return {
    get busy() { return pending > 0 },
    reflect,
    tapFeatured(part) {
      enqueue(async () => {
        const key = part === 'dress' ? 'costume' : 'bow'
        const wearing = character.look[key] === costume
        const value = wearing ? null : costume
        if (!await character.wear({ ...character.look, [key]: value })) return
        if (disposed) return
        outfit.update((o) => ({ ...o, [key]: restamp(o[key], value) }))
        onChange(wearing ? 'costume_off' : 'costume_on')
      })
    },
    tapDisplay(kind) {
      enqueue(async () => {
        if (kind === character.look.kind) return
        if (!await character.wear({ ...character.look, kind })) return
        if (disposed) return
        outfit.update((o) => ({ ...o, character: restamp(o.character, kind) }))
        onChange('character')
      })
    },
    dispose() { disposed = true },
  }
}
