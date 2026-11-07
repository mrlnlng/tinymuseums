export type LoadResult<Art> = { ok: true; art: Art } | { ok: false; error: unknown }

export interface HeldArt<Art> {
  loading: Promise<LoadResult<Art>>
  /** True once the art has finished loading, so a room built from it has nothing left to wait for. */
  readonly loaded: boolean
}

export interface ArtCacheOptions<Id, Art> {
  load(id: Id): Promise<Art>
  unload(id: Id, art: Art): void
  keepMs: number
  setTimer?(run: () => void, ms: number): unknown
  clearTimer?(timer: unknown): void
}

export interface ArtCache<Id, Art> {
  /** Starts loading ahead of use; the art is dropped after `keepMs` unless a room acquires it. */
  prefetch(id: Id): void
  acquire(id: Id): HeldArt<Art>
  /** Gives back an acquired load; the art stays for `keepMs` in case the visitor comes back. */
  release(id: Id): void
  has(id: Id): boolean
  clear(): void
}

interface Slot<Art> extends HeldArt<Art> {
  loaded: boolean
  users: number
  timer: unknown
}

/** Room art shared between visits: loaded once, reused while warm, unloaded once nobody needs it. */
export function createArtCache<Id, Art>(options: ArtCacheOptions<Id, Art>): ArtCache<Id, Art> {
  const setTimer = options.setTimer ?? ((run, ms) => setTimeout(run, ms))
  const clearTimer = options.clearTimer ?? ((timer) => clearTimeout(timer as ReturnType<typeof setTimeout>))
  const slots = new Map<Id, Slot<Art>>()

  function drop(id: Id, slot: Slot<Art>): void {
    if (slots.get(id) !== slot) return
    slots.delete(id)
    clearTimer(slot.timer)
    void slot.loading.then((result) => {
      if (result.ok) options.unload(id, result.art)
    })
  }

  function expireLater(id: Id, slot: Slot<Art>): void {
    clearTimer(slot.timer)
    slot.timer = setTimer(() => {
      if (slot.users === 0) drop(id, slot)
    }, options.keepMs)
  }

  function hold(id: Id): Slot<Art> {
    const existing = slots.get(id)
    if (existing) return existing
    const slot = { loaded: false, users: 0, timer: undefined } as Slot<Art>
    slot.loading = options.load(id).then(
      (art): LoadResult<Art> => {
        slot.loaded = true
        return { ok: true, art }
      },
      (error: unknown): LoadResult<Art> => {
        // A failed load is forgotten, so the next visit tries again.
        if (slots.get(id) === slot) {
          slots.delete(id)
          clearTimer(slot.timer)
        }
        return { ok: false, error }
      },
    )
    slots.set(id, slot)
    return slot
  }

  return {
    prefetch(id) {
      const slot = hold(id)
      if (slot.users === 0) expireLater(id, slot)
    },
    acquire(id) {
      const slot = hold(id)
      slot.users += 1
      clearTimer(slot.timer)
      return slot
    },
    release(id) {
      const slot = slots.get(id)
      if (!slot || slot.users === 0) return
      slot.users -= 1
      if (slot.users === 0) expireLater(id, slot)
    },
    has(id) {
      return slots.has(id)
    },
    clear() {
      for (const [id, slot] of [...slots]) {
        slot.users = 0
        drop(id, slot)
      }
    },
  }
}
