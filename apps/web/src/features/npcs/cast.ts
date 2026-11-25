export interface NpcCharacter {
  id: string
  name: string
  role: string
  asset: string
  anchorX: number
  /** World units the painted feet cover in one six-cel walk loop, measured from the sheet. */
  stride: number
}

// Every cel is 256×224, six cels per walk loop at 8 fps, standing on the shared ground row 208.
export const FRAME = { width: 256, height: 224, count: 6, fps: 8, anchorY: 208 } as const

// The idle cels share the walk registration. The holds let the NPC breathe and blink.
export const IDLE = {
  count: 4,
  timeline: [
    { cel: 0, until: 620 },
    { cel: 1, until: 1020 },
    { cel: 0, until: 1470 },
    { cel: 2, until: 1890 },
    { cel: 0, until: 2420 },
    { cel: 3, until: 2540 },
    { cel: 0, until: 3200 },
  ],
} as const

export function idleCel(elapsedMs: number): number {
  const duration = IDLE.timeline[IDLE.timeline.length - 1].until
  const time = elapsedMs % duration
  return IDLE.timeline.find(({ until }) => time < until)?.cel ?? 0
}

// The sheet's 192 px reference figure stands 0.68 world units tall, half the hall player.
export const WORLD_PER_PX = 0.68 / 192

export const CAST: readonly NpcCharacter[] = [
  { id: 'pip', name: 'Pip', role: 'Stamp clerk', asset: 'npcs/pip-walk', anchorX: 146, stride: 0.355 },
  { id: 'bram', name: 'Bram', role: 'Bellhop', asset: 'npcs/bram-walk', anchorX: 146, stride: 0.355 },
  { id: 'thimble', name: 'Thimble', role: 'Textile mender', asset: 'npcs/thimble-walk', anchorX: 123, stride: 0.497 },
  { id: 'fig', name: 'Fig', role: 'Frame repairer', asset: 'npcs/fig-walk', anchorX: 141, stride: 0.532 },
  { id: 'moss', name: 'Moss', role: 'Pond sketcher', asset: 'npcs/moss-walk', anchorX: 125, stride: 0.557 },
  { id: 'hazel', name: 'Hazel', role: 'Framer', asset: 'npcs/hazel-walk', anchorX: 157, stride: 0.570 },
  { id: 'percy', name: 'Percy', role: 'Post carrier', asset: 'npcs/percy-walk', anchorX: 130, stride: 0.475 },
  { id: 'dot', name: 'Dot', role: 'Gallery registrar', asset: 'npcs/dot-walk', anchorX: 123, stride: 0.491 },
  { id: 'mabel', name: 'Mabel', role: 'Night guard', asset: 'npcs/mabel-walk', anchorX: 124, stride: 0.519 },
  { id: 'clove', name: 'Clove', role: 'Gallery guide', asset: 'npcs/clove-walk', anchorX: 123, stride: 0.360 },
  { id: 'nell', name: 'Nell', role: 'Archivist', asset: 'npcs/nell-walk', anchorX: 120, stride: 0.542 },
  { id: 'miso', name: 'Miso', role: 'Storeroom keeper', asset: 'npcs/miso-walk', anchorX: 132, stride: 0.481 },
  { id: 'pearl', name: 'Pearl', role: 'Painting caretaker', asset: 'npcs/pearl-walk', anchorX: 135, stride: 0.583 },
]

// The six residents follow one shared schedule; the seven wanderers stay local to each browser.
export const RESIDENT_IDS = ['clove', 'mabel', 'pearl', 'nell', 'percy', 'hazel'] as const
export const WANDERER_IDS = ['pip', 'bram', 'thimble', 'fig', 'moss', 'dot', 'miso'] as const

// The mean painted gait across the walk sheets (see stride on each cast member).
export const NPC_WALK_SPEED = 0.55

const BY_ID = new Map(CAST.map((character) => [character.id, character]))

/** A cast member by id; an unknown id is a data bug, so it throws rather than returning a placeholder. */
export function castMember(id: string): NpcCharacter {
  const character = BY_ID.get(id)
  if (!character) throw new Error(`Unknown NPC: ${id}`)
  return character
}
