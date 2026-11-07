import { restamp, type Outfit } from '@tiny/core/slots'
import { itemIdFor } from '@tiny/core/economy'
import type { SlotHandle } from '@/shared/lib/slots'
import { allowedCharacter, owns, walletReady, type OwnedSnapshot } from '../../economy/lib/ownership.ts'
import type { AtelierRoom, ClothingItem } from './atelier'
import type { Character, Look } from './character'
import type { CharacterKind } from './rig'

export const CARDIGANS = ['cardigan-red', 'cardigan-forest-green', 'cardigan-navy-blue', 'cardigan-butter-yellow'] as const
export const HIBISCUS = ['hibiscus-blue', 'hibiscus-yellow', 'hibiscus-pink'] as const
export const COSTUMES = [
  'kiki', ...CARDIGANS, 'blue-floral', 'floral-cardigan', 'flower-crown',
  'gold-sequin', 'gold-cape', ...HIBISCUS, 'blue-cap', 'daisy-clip', 'tutu',
] as const

/** The costumes fitted to each character's rig; the others stay on their stands. */
export const FITS: Record<CharacterKind, readonly string[]> = {
  bunny: COSTUMES,
  cat: COSTUMES,
  otter: COSTUMES,
  bruce: ['tutu'],
}

export function lookOf(outfit: Outfit): Look {
  const known = (id: string | null) => id !== null && (COSTUMES as readonly string[]).includes(id) ? id : null
  return { kind: outfit.character.v, costume: known(outfit.costume.v), bow: known(outfit.bow.v) }
}

export function ownedLook(look: Look, snapshot: OwnedSnapshot | null): Look {
  if (!walletReady(snapshot)) return look
  const piece = (slot: 'costume' | 'bow', id: string | null) =>
    id !== null && owns(snapshot, itemIdFor(slot, id)) ? id : null
  return {
    kind: allowedCharacter(snapshot, look.kind) ? look.kind : 'bunny',
    costume: piece('costume', look.costume),
    bow: piece('bow', look.bow),
  }
}

export function shouldRewriteOutfit(look: Look, snapshot: OwnedSnapshot | null): boolean {
  if (!walletReady(snapshot)) return false
  const next = ownedLook(look, snapshot)
  return next.kind !== look.kind || next.costume !== look.costume || next.bow !== look.bow
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

export interface Wardrobe {
  readonly busy: boolean
  reflect(): void
  tapItem(item: ClothingItem): void
  tapDisplay(kind: CharacterKind): void
  dispose(): void
}

interface Options {
  character: Character
  room: AtelierRoom
  outfit: SlotHandle<Outfit>
  onChange: (change: 'costume_on' | 'costume_off' | 'character') => void
  onMisfit: (item: ClothingItem, kind: CharacterKind) => void
  onIdle: () => void
}

/** Outfit changes never hold traversal or fade the working character out. */
export function createWardrobe({ character, room, outfit, onChange, onMisfit, onIdle }: Options): Wardrobe {
  let queue = Promise.resolve()
  let pending = 0
  let disposed = false
  function reflect(): void {
    const { kind, costume, bow } = character.look
    const fitted = (id: string | null) => id !== null && FITS[kind].includes(id) ? id : null
    room.setWorn(fitted(costume), fitted(bow))
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
    tapItem({ slot: key, id }) {
      enqueue(async () => {
        const { kind } = character.look
        if (!FITS[kind].includes(id)) {
          onMisfit({ slot: key, id }, kind)
          return
        }
        const wearing = character.look[key] === id
        const value = wearing ? null : id
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
