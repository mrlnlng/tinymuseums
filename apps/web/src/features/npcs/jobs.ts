// What each NPC is doing as it walks: the kinds of places its role takes it to, and what it does there.

/** Things on a room's floor an NPC can walk to and work at. */
export type PlaceKind = 'painting' | 'door' | 'desk' | 'board' | 'rail' | 'water' | 'seat' | 'plinth' | 'end'

export interface Place {
  x: number
  kind: PlaceKind
  /** Doors carry their door name (the key in the room's doors map, e.g. 'atelier', 'entrance'). */
  name?: string
  /** How far into the picture it stands, in the room's depth units; absent means the front floor line (0). */
  d?: number
}

/** A point on a room's floor: x along it, d into the picture (0 = the front line). */
export interface FloorSpot {
  x: number
  d: number
}

/** Rooms with depth (the pond) let NPCs walk into the picture along the room's own paths. */
export interface NpcGround {
  /** Deterministic walkable route from one spot to another, including both ends. */
  route(from: FloorSpot, to: FloorSpot): readonly FloorSpot[]
  /** How a figure at depth d is drawn: raised by lift world units and shrunk by scale. */
  place(d: number): { lift: number; scale: number }
  /** The local visitor's current depth, so NPCs further forward draw in front of them. */
  playerD(): number
}

/**
 * What a room tells the NPCs about itself, built from the room's live layout so every browser
 * showing the same room gets the same answer. Doors are Places with kind 'door' and a name.
 */
export interface NpcRoomInfo {
  minX: number
  maxX: number
  places: readonly Place[]
  ground?: NpcGround
}

export interface Job {
  /** Place kinds this NPC works at, most important first. Rooms with none of these are not its rooms. */
  visits: readonly PlaceKind[]
  /** 'tour' walks the matching places in floor order and back; 'errand' picks another one at random. */
  order: 'tour' | 'errand'
  /** Seconds spent working at each stop. */
  dwell: readonly [min: number, max: number]
  /** Shown over the NPC's head on arriving at a stop, and again just before it moves on. */
  emote: string
  /** What it shows when it meets another NPC, so a meeting reads as two roles talking. */
  meet: string
  /** Where it stands relative to a place's x, in world units, so two roles at one painting don't overlap. */
  stand: number
  /** Chance per stop to head for a door and move on to another room. */
  roam: number
}

export const JOBS: Record<string, Job> = {
  // Shared residents
  clove: { visits: ['painting', 'plinth'], order: 'tour', dwell: [8, 12], emote: '👉', meet: '😊', stand: 0.75, roam: 0.1 }, // gallery guide leads a tour
  mabel: { visits: ['door', 'end'], order: 'tour', dwell: [4, 7], emote: '🔦', meet: '👋', stand: 0.4, roam: 0.25 }, // night guard patrols
  pearl: { visits: ['painting', 'plinth'], order: 'errand', dwell: [8, 12], emote: '✨', meet: '🖼️', stand: -0.75, roam: 0.1 }, // caretaker dusts
  nell: { visits: ['board', 'desk', 'painting'], order: 'errand', dwell: [7, 11], emote: '📜', meet: '📚', stand: -0.35, roam: 0.15 }, // archivist takes notes
  percy: { visits: ['desk', 'door', 'board'], order: 'errand', dwell: [4, 6], emote: '✉️', meet: '📬', stand: 0.3, roam: 0.25 }, // post carrier
  hazel: { visits: ['painting'], order: 'errand', dwell: [8, 12], emote: '🖼️', meet: '📏', stand: 0.35, roam: 0.15 }, // framer
  // Local wanderers
  pip: { visits: ['desk', 'board'], order: 'errand', dwell: [5, 8], emote: '📮', meet: '😊', stand: -0.3, roam: 0.15 }, // stamp clerk
  thimble: { visits: ['rail', 'seat'], order: 'errand', dwell: [8, 12], emote: '🧵', meet: '✂️', stand: 0.3, roam: 0.2 }, // textile mender
  fig: { visits: ['painting'], order: 'errand', dwell: [8, 12], emote: '🔨', meet: '🔧', stand: -0.35, roam: 0.15 }, // frame repairer
  moss: { visits: ['water', 'painting', 'seat'], order: 'errand', dwell: [10, 16], emote: '✏️', meet: '🎨', stand: 0.5, roam: 0.15 }, // pond sketcher
  dot: { visits: ['painting', 'plinth'], order: 'tour', dwell: [4, 6], emote: '📋', meet: '✅', stand: 0.05, roam: 0.15 }, // registrar
  miso: { visits: ['door', 'rail', 'desk'], order: 'errand', dwell: [4, 6], emote: '📦', meet: '🙂', stand: -0.5, roam: 0.25 }, // storeroom keeper
}
