/** Where a room sits along the floor of the rooms it is joined to. */
export interface RoomSpan {
  key: string
  startX: number
  endX: number
}

export interface NearbyReach {
  /** Build a room once it is this many view widths beyond the edge of the screen. */
  loadScreens: number
  /** Remove it again once it is more than this many view widths beyond the edge. */
  unloadScreens: number
}

export interface Nearby {
  /** Reconciles the near set with where the camera is; returns true when it changed. */
  update(rooms: readonly RoomSpan[], cameraX: number, viewWidth: number): boolean
  isLoaded(key: string): boolean
  /** Whether the room holding this point is near. */
  covers(x: number): boolean
  loaded(): readonly string[]
}

function gapTo(room: RoomSpan, x: number): number {
  if (x < room.startX) return room.startX - x
  if (x > room.endX) return x - room.endX
  return 0
}

/**
 * Tracks which of a row of rooms are near the camera. The remove distance is larger than the
 * build distance, so walking back and forth at a join doesn't build and drop the same room.
 */
export function createNearby(reach: NearbyReach): Nearby {
  let loaded = new Set<string>()
  let spans: readonly RoomSpan[] = []

  return {
    update(rooms, cameraX, viewWidth) {
      spans = rooms
      const half = viewWidth / 2
      const loadAt = half + viewWidth * reach.loadScreens
      const unloadAt = half + viewWidth * Math.max(reach.loadScreens, reach.unloadScreens)
      const next = new Set<string>()
      for (const room of rooms) {
        const gap = gapTo(room, cameraX)
        if (gap <= loadAt || (loaded.has(room.key) && gap <= unloadAt)) next.add(room.key)
      }
      const changed = next.size !== loaded.size || [...next].some((key) => !loaded.has(key))
      loaded = next
      return changed
    },
    isLoaded(key) {
      return loaded.has(key)
    },
    covers(x) {
      const first = spans[0]
      if (first !== undefined && x < first.startX) return loaded.has(first.key)
      for (const room of spans) {
        if (x >= room.startX && x < room.endX) return loaded.has(room.key)
      }
      const last = spans[spans.length - 1]
      return last !== undefined && x >= last.endX && loaded.has(last.key)
    },
    loaded() {
      return [...loaded]
    },
  }
}
