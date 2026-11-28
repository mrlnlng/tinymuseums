import { restamp, type Outfit } from '@tiny/core/slots'
import { itemIdFor } from '@tiny/core/economy'
import type { SlotHandle } from '@/shared/lib/slots'
import { allowedCharacter, owns, walletReady, type OwnedSnapshot } from '../../economy/lib/ownership.ts'
import type { AtelierRoom, ClothingItem } from './atelier'
import type { Character, Look } from './character'
import type { CharacterKind } from './rig'
import { layerOf, toggle, type Layers } from './layers.ts'

// One red cardigan, refitted to every character (2026-11-27). The old colourways are retired.
export const CARDIGANS = ['cardigan-red'] as const
export const HIBISCUS = ['hibiscus-blue', 'hibiscus-yellow', 'hibiscus-pink'] as const
export const COSTUMES = [
  'kiki', ...CARDIGANS, 'blue-floral', 'flower-crown',
  'gold-sequin', 'gold-cape', ...HIBISCUS, 'blue-cap', 'daisy-clip', 'tutu',
] as const

/** The costumes fitted to each character's rig; the others stay on their stands. */
export const FITS: Record<CharacterKind, readonly string[]> = {
  bunny: COSTUMES,
  cat: COSTUMES,
  otter: COSTUMES,
  bruce: COSTUMES,
}

export function lookOf(outfit: Outfit): Look {
  const known = (id: string | null) => id !== null && (COSTUMES as readonly string[]).includes(id) ? id : null
  return { kind: outfit.character.v, costume: known(outfit.costume.v), bow: known(outfit.bow.v), top: known(outfit.top.v) }
}

export function ownedLook(look: Look, snapshot: OwnedSnapshot | null): Look {
  if (!walletReady(snapshot)) return look
  const piece = (slot: 'costume' | 'bow', id: string | null) =>
    id !== null && owns(snapshot, itemIdFor(slot, id)) ? id : null
  return {
    kind: allowedCharacter(snapshot, look.kind) ? look.kind : 'bunny',
    costume: piece('costume', look.costume),
    bow: piece('bow', look.bow),
    // A top is a costume in the catalog; it is only worn on its own layer.
    top: piece('costume', look.top),
  }
}

export function shouldRewriteOutfit(look: Look, snapshot: OwnedSnapshot | null): boolean {
  if (!walletReady(snapshot)) return false
  const next = ownedLook(look, snapshot)
  return next.kind !== look.kind || next.costume !== look.costume || next.bow !== look.bow || next.top !== look.top
}

export function followOutfit(
  character: Character,
  outfit: SlotHandle<Outfit>,
  busy: () => boolean,
  applied: () => void,
  filter: (look: Look) => Look = (look) => look,
): { sync(): void; dispose(): void } {
  let applying = false
  let disposed = false
  let failed: string | null = null
  function sync(): void {
    if (disposed || applying || busy()) return
    const look = filter(lookOf(outfit.snapshot()))
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

/**
 * Where worn pieces sit. A headpiece has its own place. Clothes stack in two layers: a dress or
 * set, and a top (the cardigan) over it. A tap puts a piece on its own place or layer and leaves
 * the rest as it is; tapping a worn piece takes it off. See `layers.ts` for the cape rule.
 */
export type WornSlot = 'costume' | 'bow' | 'top'

/** The item as it should be worn after a tap, or null when it doesn't fit this character. */
export function toggleWorn(look: Look, item: ClothingItem, fits: (id: string) => boolean): Look | null {
  if (!fits(item.id)) return null
  if (item.slot === 'bow') return { ...look, bow: look.bow === item.id ? null : item.id }
  return { ...look, ...toggle({ costume: look.costume, top: look.top }, item.id) }
}

/** The outfit document after a change: only the places that changed are restamped. */
function restampChanged(o: Outfit, next: Look): Outfit {
  const places = ['costume', 'bow', 'top'] as const
  return places.reduce((doc, place) => (doc[place].v === next[place] ? doc : { ...doc, [place]: restamp(doc[place], next[place]) }), o)
}

export interface Wardrobe {
  readonly busy: boolean
  reflect(): void
  tapItem(item: ClothingItem): void
  /** Puts on a whole outfit (both layers) and headpiece at once, as chosen in the closet. */
  dress(layers: Layers, bow: string | null): void
  tapDisplay(kind: CharacterKind): void
  dispose(): void
}

interface Options {
  character: Character
  room: AtelierRoom
  outfit: SlotHandle<Outfit>
  onChange: (change: 'costume_on' | 'costume_off' | 'character') => void
  onIdle: () => void
}

/** Outfit changes never hold traversal or fade the working character out. */
export function createWardrobe({ character, room, outfit, onChange, onIdle }: Options): Wardrobe {
  let queue = Promise.resolve()
  let pending = 0
  let disposed = false
  function reflect(): void {
    const { kind, costume, bow, top } = character.look
    const fitted = (id: string | null) => id !== null && FITS[kind].includes(id) ? id : null
    room.setWorn(fitted(costume), fitted(bow), fitted(top))
    room.setVisitor(kind)
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
    tapItem(item) {
      enqueue(async () => {
        const next = toggleWorn(character.look, item, (id) => FITS[character.look.kind].includes(id))
        if (next === null) return
        const place = item.slot === 'bow' ? 'bow' : layerOf(item.id)
        const wearing = character.look[place] === item.id
        if (!await character.wear(next)) return
        if (disposed) return
        // Only the places that changed are restamped; the rest stay exactly as they were.
        outfit.update((o) => restampChanged(o, next))
        onChange(wearing ? 'costume_off' : 'costume_on')
      })
    },
    dress(layers, bow) {
      enqueue(async () => {
        const { kind } = character.look
        const fit = (id: string | null) => id !== null && FITS[kind].includes(id) ? id : null
        const next = { ...character.look, costume: fit(layers.costume), top: fit(layers.top), bow: fit(bow) }
        const look = character.look
        if (next.costume === look.costume && next.bow === look.bow && next.top === look.top) return
        if (!await character.wear(next)) return
        if (disposed) return
        // Stacking: a changed place is replaced; an unchanged one keeps its old stamp.
        outfit.update((o) => restampChanged(o, next))
        onChange(next.costume === null && next.bow === null && next.top === null ? 'costume_off' : 'costume_on')
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
