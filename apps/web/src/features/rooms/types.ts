import type * as THREE from 'three'
import type { CameraRig } from '@/features/hall/scene/cameras'
import type { Character, Look } from '@/features/hall/scene/character'
import type { Viewport } from '@/features/hall/scene/overlay'
import type { Traversal } from '@/features/hall/scene/traversal'
import type { Pose, Room } from '@/features/presence/lib/join-room'
import type { VisitorScenery } from '@/features/presence/scene/remote-visitors'
import type { EffectName } from '@/features/sound/hooks/useSoundEffects'

export type RoomId = 'hall' | 'atelier' | 'personal' | 'pond'

export interface DoorRef {
  room: RoomId
  door: string
}

/** Where a door stands on its room's floor, and where a visitor coming through it stops. */
export interface DoorDef {
  x: number
  clearX: number
  /** Where it leads, for the map. */
  label?: string
}

/** How the map draws a row of joined rooms: each room's look, matching its walls. */
export type MapTint = 'entrance' | 'gallery' | 'cafe' | 'giftShop' | 'atelierEntrance' | 'collection' | 'bruce'

/** The ground a visitor may stand on. Flat rooms are a strip; rooms with depth will add walkable areas. */
export interface StripFloor {
  kind: 'strip'
  minX: number
  maxX(): number
}

export type Floor = StripFloor

/** Where a room with depth draws the visitor: raised toward the horizon and shrunk with distance. */
export interface Stance {
  lift: number
  scale: number
  /** Overrides the walk speed the legs and facing follow, for walking into the picture. */
  walk: number | null
}

/** How the visitor came in: through a linked door, or the room's own opening (the hall's front door). */
export type Arrival = { kind: 'door'; door: string } | { kind: 'opening' }

export interface Interaction {
  /** Returning false means the tap wasn't this room's after all, so the stage asks the next one. */
  activate(): void | boolean
  /** A room that plays its own tap sounds sets this, so the stage does not add a click. */
  silent?: boolean
}

export interface RoomSound {
  play(name: EffectName): void
  prepare(name: EffectName): void
  setWalking(isWalking: boolean): void
}

export interface RoomContext {
  scene: THREE.Scene
  overlay: HTMLElement
  characterHost: HTMLElement
  character: Character
  traversal: Traversal
  rig: CameraRig
  sound: RoomSound
  arrival: Arrival
  /** The room's art was already loaded when the visitor arrived, so there is no loading wait to show. */
  warm: boolean
  /** Walk out through one of this room's doors; the stage follows the link to the next room. */
  leave(door: string): void
  /** True while taps should be ignored: loading, passing through a door, or a dialog is open. */
  isQuiet(): boolean
}

export interface Frame {
  now: number
  dt: number
  camera: THREE.OrthographicCamera
  viewport: Viewport
  quiet: boolean
}

export interface RoomContents {
  floor: Floor
  /** Illustrated edges of the room; the whole camera window stays within these bounds. */
  cameraBounds?: { minX: number; maxX(): number }
  presence: { key: string; ticketKey?: string; pose?: () => Pose; scenery?: () => VisitorScenery | null }
  /** Extra gate on top of the stage's own (fonts, character rig, minimum loading time). */
  isReady?(now: number): boolean
  /** An opaque activity covers this scene; keep presence alive without drawing the hidden world. */
  isCovered?(): boolean
  /** Runs once the room is shown, before the visitor walks in. Returning true means the room placed the visitor itself. */
  onShown?(): boolean | void
  /** Runs after the camera syncs and before the character updates, every frame. */
  beforeCharacterUpdate?(frame: Frame): void
  /** The presence room once the stage has joined it. */
  onJoined?(room: Room): void
  /** Runs on pointerdown before a tap is recognised, for preloading and audio warm-up. */
  pointerDown?(raycaster: THREE.Raycaster): void
  /** `tap` asks for the click interaction; without it the stage is testing hover. */
  hitTest(raycaster: THREE.Raycaster, phase?: 'hover' | 'tap'): Interaction | null
  update(frame: Frame): void
  /** Where the visitor stands in depth; rooms without it keep the visitor on the floor line. */
  stance?(): Stance | null
  /** Lifts or lowers the camera from the room's usual framing, in world units. */
  cameraRise?(): number
  /** Rooms joined to this one wall to wall; the stage builds those near the camera and removes the rest. */
  joined?(): readonly JoinedRoom[]
  dispose(): void
}

/** What a joined room builds: its own things, on the floor and in the presence of the room it joins. */
export type JoinedContents = Pick<RoomContents, 'hitTest' | 'update' | 'dispose'> &
  Partial<Pick<RoomContents, 'pointerDown' | 'beforeCharacterUpdate'>>

/**
 * A room joined wall to wall to the room the visitor entered: no door and no transition, so a row
 * of joined rooms reads as one long room. Doors, by contrast, lead to a different place.
 */
export interface JoinedRoom {
  key: string
  startX: number
  endX: number
  /** Its name on the map, and how the map draws it. */
  label?: string
  tint?: MapTint
  build(ctx: RoomContext): JoinedContents
}

/** A room's art comes from `ROOM_ART[id]` in `art.ts`, so the stage can load it ahead of the room. */
export interface RoomDef<Art = unknown> {
  id: RoomId
  className?: string
  clearColor: string
  /** Keep the loading screen up at least this long when the art had to load, so its animation reads. */
  minLoadingMs?: number
  /** The room's isReady alone decides when it shows, without waiting for fonts or the character rig. */
  gatesItself?: boolean
  doors: Record<string, DoorDef>
  /** The look the visitor starts in; the hall drops pieces its wallet does not own. */
  initialLook?(): Look
  build(ctx: RoomContext, art: Art): RoomContents
}
