import type * as THREE from 'three'
import type { CameraRig } from '@/features/hall/scene/cameras'
import type { Character, Look } from '@/features/hall/scene/character'
import type { Viewport } from '@/features/hall/scene/overlay'
import type { Traversal } from '@/features/hall/scene/traversal'
import type { Pose, Room } from '@/features/presence/lib/join-room'
import type { VisitorScenery } from '@/features/presence/scene/remote-visitors'
import type { EffectName } from '@/features/sound/hooks/useSoundEffects'

export type RoomId = 'hall' | 'atelier' | 'personal'

export interface DoorRef {
  room: RoomId
  door: string
}

/** Where a door stands on its room's floor, and where a visitor coming through it stops. */
export interface DoorDef {
  x: number
  clearX: number
}

/** The ground a visitor may stand on. Flat rooms are a strip; rooms with depth will add walkable areas. */
export interface StripFloor {
  kind: 'strip'
  minX: number
  maxX(): number
}

export type Floor = StripFloor

/** How the visitor came in: through a linked door, or the room's own opening (the hall's front door). */
export type Arrival = { kind: 'door'; door: string } | { kind: 'opening' }

export interface Interaction {
  activate(): void
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
  presence: { key: string; ticketKey?: string; pose?: () => Pose; scenery?: () => VisitorScenery | null }
  /** Extra gate on top of the stage's own (fonts, character rig, minimum loading time). */
  isReady?(now: number): boolean
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
  /** Lifts or lowers the camera from the room's usual framing, in world units. */
  cameraRise?(): number
  dispose(): void
}

export interface RoomDef<Art = unknown> {
  id: RoomId
  className?: string
  clearColor: string
  /** Keep the loading screen up at least this long, so its animation reads even when cached. */
  minLoadingMs?: number
  /** The room's isReady alone decides when it shows, without waiting for fonts or the character rig. */
  gatesItself?: boolean
  doors: Record<string, DoorDef>
  /** Receives the renderer when a room's art needs GPU upload while loading. */
  load(renderer?: THREE.WebGLRenderer): Promise<Art>
  unload?(art: Art): void
  /** The look the visitor starts in; the hall drops pieces its wallet does not own. */
  initialLook?(): Look
  build(ctx: RoomContext, art: Art): RoomContents
}
