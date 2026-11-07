import { ATELIER_ROOMS } from '../hall/scene/atelier-layout.ts'
import { CONFIG } from '../hall/scene/config.ts'
import { linkedDoor } from './links.ts'
import type { DoorDef, JoinedRoom, MapTint, RoomId } from './types.ts'

// The map in the top-left corner: the museum seen from above, like a dungeon map. Each room is a
// box with walls; rooms joined wall to wall open into each other, and a door to another place is
// a short passage between the two. Every place keeps its own row: the hall runs along the
// bottom, and the fashion area, through the door in the entrance's back wall, sits behind it.
// The map is a window onto the plan that follows the visitor's pin.

export type MapTheme = 'hall' | 'atelier'

export interface MapRoomSketch {
  key: string
  label?: string
  tint?: MapTint
  startX: number
  endX: number
  /** Not seen yet: drawn faintly, past the rooms the map knows. */
  unknown?: boolean
}

/** A place as the map draws it, in its own world units. */
export interface FloorSketch {
  id: RoomId
  rooms: readonly MapRoomSketch[]
  doors: Readonly<Record<string, DoorDef>>
}

interface PlaceInfo {
  title: string
  theme: MapTheme
  /** Rows run front to back: 0 is the hall, and each row behind it one less. */
  row: number
  /** What the map shows of the place before the visitor has been there. */
  sketch(): FloorSketch
}

const atelierX = (px: number) => (px - CONFIG.atelier.mock.originX) / CONFIG.atelier.mock.unit
/** The fashion area's door, as `GALLERY_DOOR` places it; that module loads three.js, so it is repeated here. */
const ATELIER_DOOR = { x: -3.1, clear: 0.85 }

export const MAP_PLACES: Partial<Record<RoomId, PlaceInfo>> = {
  hall: {
    title: 'The hall',
    theme: 'hall',
    row: 0,
    sketch: () => ({
      id: 'hall',
      rooms: [
        { key: 'entrance', label: 'The entrance', tint: 'entrance', startX: CONFIG.lobby.minX, endX: CONFIG.lobby.length },
        { key: 'beyond', tint: 'gallery', startX: CONFIG.lobby.length, endX: CONFIG.lobby.length + CONFIG.galleryRoom.maxWidth, unknown: true },
      ],
      doors: { atelier: { x: CONFIG.lobby.minX, clearX: CONFIG.lobby.minX + ATELIER_DOOR.clear } },
    }),
  },
  atelier: {
    title: 'The fashion area',
    theme: 'atelier',
    row: -1,
    sketch: () => ({
      id: 'atelier',
      rooms: ATELIER_ROOMS.map(({ key, startX, endX, collection }) => ({
        key,
        label: collection?.title ?? 'The entrance',
        tint: key === 'entrance' ? 'atelierEntrance' : key === 'bruce' ? 'bruce' : 'collection',
        startX: atelierX(startX),
        endX: atelierX(endX),
      })),
      doors: { gallery: { x: ATELIER_DOOR.x, clearX: ATELIER_DOOR.x + ATELIER_DOOR.clear } },
    }),
  },
}

/** Map pixels per world unit, a room's depth, the gap between rows, and a passage's width. */
export const MAP_SCALE = 5
const ROOM_DEPTH = 30
const ROW_GAP = 14
const PASSAGE = 10
const WALL = 3

export interface PlannedRoom {
  place: RoomId
  key: string
  label?: string
  tint: MapTint
  unknown: boolean
  x: number
  y: number
  w: number
  h: number
}

/** A gap in the wall two joined rooms share. */
export interface PlannedOpening { x: number; y: number; h: number; left: PlannedRoom; right: PlannedRoom }

/** The way between two places: a passage from one row to the next, with the door in it. */
export interface PlannedPassage { x: number; y: number; h: number; from: PlannedRoom; to: PlannedRoom }

export interface MapPlan {
  rooms: PlannedRoom[]
  openings: PlannedOpening[]
  passages: PlannedPassage[]
  /** Each place's world x to map x: mapX = (x + offset) * MAP_SCALE. */
  offsets: Map<RoomId, number>
  rowY: Map<RoomId, number>
  bounds: { left: number; top: number; right: number; bottom: number }
}

const FALLBACK_TINT: Record<MapTheme, MapTint> = { hall: 'gallery', atelier: 'collection' }

/** The room x is in; before the first room or past the last, the nearest end room. */
export function roomAt<R extends { startX: number; endX: number }>(rooms: readonly R[], x: number): R | null {
  for (const room of rooms) if (x >= room.startX && x < room.endX) return room
  if (rooms.length === 0) return null
  return x < rooms[0].startX ? rooms[0] : rooms[rooms.length - 1]
}

/** Where a door's passage meets its room: in the doorway, kept clear of the room's corners. */
export function doorPoint(floor: FloorSketch, door: string): number | null {
  const def = floor.doors[door]
  if (!def) return null
  const x = (def.x + def.clearX) / 2
  const room = roomAt(floor.rooms, x)
  if (!room) return x
  const margin = (PASSAGE / 2 + WALL) / MAP_SCALE
  return Math.min(room.endX - margin, Math.max(room.startX + margin, x))
}

/**
 * Lays the places out from above. The hall sits at the origin; every other place is put on its
 * row so that its end of a door lines up with the end already placed.
 */
export function planMap(floors: readonly FloorSketch[]): MapPlan {
  const byId = new Map(floors.map((floor) => [floor.id, floor]))
  const offsets = new Map<RoomId, number>()
  const queue: RoomId[] = []
  const start = byId.has('hall') ? 'hall' : floors[0]?.id
  if (start) { offsets.set(start, 0); queue.push(start) }
  const links: { a: RoomId; aDoor: string; b: RoomId; bDoor: string }[] = []
  const linked = new Set<string>()
  while (queue.length > 0) {
    const id = queue.shift()!
    const floor = byId.get(id)!
    for (const door of Object.keys(floor.doors)) {
      const to = linkedDoor({ room: id, door })
      const other = to && byId.get(to.room)
      if (!to || !other) continue
      const key = [`${id}:${door}`, `${to.room}:${to.door}`].sort().join('|')
      if (!linked.has(key)) { linked.add(key); links.push({ a: id, aDoor: door, b: to.room, bDoor: to.door }) }
      if (offsets.has(to.room)) continue
      const here = doorPoint(floor, door)
      const there = doorPoint(other, to.door)
      if (here === null || there === null) continue
      offsets.set(to.room, here + offsets.get(id)! - there)
      queue.push(to.room)
    }
  }

  const placed = floors.filter((floor) => offsets.has(floor.id) && MAP_PLACES[floor.id])
  const rows = [...new Set(placed.map((floor) => MAP_PLACES[floor.id]!.row))].sort((a, b) => a - b)
  const rowY = new Map<RoomId, number>()
  for (const floor of placed) rowY.set(floor.id, rows.indexOf(MAP_PLACES[floor.id]!.row) * (ROOM_DEPTH + ROW_GAP))

  const rooms: PlannedRoom[] = []
  const openings: PlannedOpening[] = []
  const byPlace = new Map<RoomId, PlannedRoom[]>()
  for (const floor of placed) {
    const info = MAP_PLACES[floor.id]!
    const offset = offsets.get(floor.id)!
    const y = rowY.get(floor.id)!
    const own: PlannedRoom[] = []
    for (const room of floor.rooms) {
      if (room.endX <= room.startX) continue
      const planned: PlannedRoom = {
        place: floor.id,
        key: room.key,
        label: room.label,
        tint: room.tint ?? FALLBACK_TINT[info.theme],
        unknown: room.unknown ?? false,
        x: (room.startX + offset) * MAP_SCALE,
        y,
        w: (room.endX - room.startX) * MAP_SCALE,
        h: ROOM_DEPTH,
      }
      const previous = own[own.length - 1]
      if (previous && Math.abs(previous.x + previous.w - planned.x) < 0.5) {
        openings.push({ x: planned.x, y: y + ROOM_DEPTH * 0.25, h: ROOM_DEPTH * 0.5, left: previous, right: planned })
      }
      own.push(planned)
      rooms.push(planned)
    }
    byPlace.set(floor.id, own)
  }

  const passages: PlannedPassage[] = []
  for (const link of links) {
    const aFloor = byId.get(link.a)!
    const point = doorPoint(aFloor, link.aDoor)
    if (point === null || !offsets.has(link.b) || !rowY.has(link.a) || !rowY.has(link.b)) continue
    const x = (point + offsets.get(link.a)!) * MAP_SCALE
    const near = (place: RoomId, door: string) => {
      const p = doorPoint(byId.get(place)!, door)! + offsets.get(place)!
      return (byPlace.get(place) ?? []).find((room) => p * MAP_SCALE >= room.x && p * MAP_SCALE <= room.x + room.w)
    }
    const aRoom = near(link.a, link.aDoor)
    const bRoom = near(link.b, link.bDoor)
    if (!aRoom || !bRoom) continue
    const [front, back] = aRoom.y > bRoom.y ? [aRoom, bRoom] : [bRoom, aRoom]
    passages.push({ x, y: back.y + back.h, h: front.y - (back.y + back.h), from: front, to: back })
  }

  const bounds = { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  for (const room of rooms) {
    bounds.left = Math.min(bounds.left, room.x)
    bounds.top = Math.min(bounds.top, room.y)
    bounds.right = Math.max(bounds.right, room.x + room.w)
    bounds.bottom = Math.max(bounds.bottom, room.y + room.h)
  }
  return { rooms, openings, passages, offsets, rowY, bounds }
}

/**
 * How far to slide the plan so the pin sits mid-window, without showing empty space past the
 * plan's ends; a plan smaller than the window is centred instead.
 */
export function panTo(pin: number, size: number, start: number, end: number, pad: number): number {
  const length = end - start + pad * 2
  if (length <= size) return (size - (end - start)) / 2 - start
  return Math.min(pad - start, Math.max(size - pad - end, size / 2 - pin))
}

const ICONS: Partial<Record<MapTint, { d: string; stroke?: boolean }[]>> = {
  entrance: [{ d: 'M1 5 5 1.2 9 5V9H6V6.5H4V9H1Z' }],
  gallery: [{ d: 'M1.5 2.5H8.5V7.5H1.5Z', stroke: true }, { d: 'M2.5 7 4.3 4.6 5.6 6 6.6 5 7.6 7Z' }],
  cafe: [{ d: 'M1.5 3.5H7V6A2.75 2.75 0 0 1 1.5 6Z' }, { d: 'M7 4.3H8A1.1 1.1 0 0 1 8 6.5H7', stroke: true }],
  giftShop: [{ d: 'M1.8 4H8.2L7.6 9H2.4Z' }, { d: 'M3.5 4.5V3.2A1.5 1.5 0 0 1 6.5 3.2V4.5', stroke: true }],
  atelierEntrance: [{ d: 'M2 9V5A3 3 0 0 1 8 5V9Z' }],
  collection: [{ d: 'M4 2.6A1 1 0 1 1 5 3.6V4.4L8.8 7.6H1.2L5 4.4', stroke: true }],
  bruce: [{ d: 'M1.2 5Q4 1.6 7 5Q4 8.4 1.2 5ZM7 5 9 3V7Z' }],
}

const SVG = 'http://www.w3.org/2000/svg'

function svg<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number>, cls?: string): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG, tag)
  for (const [name, value] of Object.entries(attrs)) node.setAttribute(name, String(value))
  if (cls) node.setAttribute('class', cls)
  return node
}

export interface MapPlace {
  id: RoomId
  minX: number
  maxX(): number
  rooms(): readonly JoinedRoom[]
  doors: Readonly<Record<string, DoorDef>>
}

export interface Minimap {
  show(place: MapPlace): void
  hide(): void
  /** The visitor's x on the floor, in world units. */
  update(x: number): void
  dispose(): void
}

export function createMinimap(host: HTMLElement): Minimap {
  const root = document.createElement('nav')
  root.className = 'minimap'
  root.hidden = true
  root.setAttribute('aria-label', 'Map')
  const heading = document.createElement('p')
  heading.className = 'minimap-place'
  const title = document.createElement('span')
  title.className = 'minimap-title'
  const here = document.createElement('span')
  here.className = 'minimap-here'
  heading.append(title, here)
  const view = document.createElement('div')
  view.className = 'minimap-window'
  const canvas = svg('svg', { 'aria-hidden': 'true' }, 'minimap-plan')
  const layer = svg('g', {})
  canvas.append(layer)
  const you = document.createElement('span')
  you.className = 'minimap-you'
  you.setAttribute('aria-hidden', 'true')
  view.append(canvas, you)
  root.append(heading, view)
  host.append(root)

  const seen = new Map<RoomId, FloorSketch>()
  let place: MapPlace | null = null
  let plan: MapPlan | null = null
  let drawnRooms: readonly JoinedRoom[] | null = null
  let drawnMax = NaN
  let nodes = new Map<string, SVGElement>()
  let current: JoinedRoom | null = null
  let size = { w: 0, h: 0 }
  let pan = { x: NaN, y: NaN }

  function sketchOf(of: MapPlace): FloorSketch {
    return {
      id: of.id,
      rooms: of.rooms().map(({ key, label, tint, startX, endX }) => ({ key, label, tint, startX, endX })),
      doors: of.doors,
    }
  }

  function floors(): FloorSketch[] {
    return (Object.keys(MAP_PLACES) as RoomId[]).map((id) => seen.get(id) ?? MAP_PLACES[id]!.sketch())
  }

  function drawRoom(room: PlannedRoom): void {
    const theme = MAP_PLACES[room.place]!.theme
    const group = svg('g', {}, `map-room is-${theme} is-${room.tint}${room.unknown ? ' is-unknown' : ''}`)
    const inset = WALL / 2
    group.append(svg('rect', { x: room.x + inset, y: room.y + inset, width: room.w - WALL, height: room.h - WALL }, 'map-floor'))
    const icon = ICONS[room.tint]
    if (icon && !room.unknown && room.w >= 14) {
      const glyph = svg('g', { transform: `translate(${room.x + room.w / 2 - 5} ${room.y + room.h / 2 - 5})` }, 'map-icon')
      for (const part of icon) glyph.append(svg('path', { d: part.d }, part.stroke ? 'is-line' : ''))
      group.append(glyph)
    }
    if (room.label) {
      const name = svg('title', {})
      name.textContent = room.label
      group.append(name)
    }
    nodes.set(`${room.place}:${room.key}`, group)
    layer.append(group)
  }

  function draw(): void {
    if (!place) return
    drawnRooms = place.rooms()
    drawnMax = place.maxX()
    seen.set(place.id, sketchOf(place))
    plan = planMap(floors())
    nodes = new Map()
    layer.replaceChildren()
    const walls = svg('g', {}, 'map-walls')
    for (const room of plan.rooms) {
      walls.append(svg('rect', { x: room.x, y: room.y, width: room.w, height: room.h }, `map-wall is-${MAP_PLACES[room.place]!.theme}${room.unknown ? ' is-unknown' : ''}`))
    }
    for (const passage of plan.passages) {
      walls.append(svg('rect', { x: passage.x - PASSAGE / 2, y: passage.y - WALL, width: PASSAGE, height: passage.h + WALL * 2 }, `map-wall is-${MAP_PLACES[passage.from.place]!.theme}`))
    }
    layer.append(walls)
    for (const room of plan.rooms) drawRoom(room)
    for (const opening of plan.openings) {
      const half = WALL / 2 + 0.5
      const theme = (room: PlannedRoom) => `is-${MAP_PLACES[room.place]!.theme} is-${room.tint}`
      layer.append(svg('rect', { x: opening.x - half, y: opening.y, width: half, height: opening.h }, `map-gap ${theme(opening.left)}`))
      const right = opening.right.unknown ? opening.left : opening.right
      layer.append(svg('rect', { x: opening.x, y: opening.y, width: half, height: opening.h }, `map-gap ${theme(right)}`))
    }
    for (const passage of plan.passages) {
      const inner = PASSAGE - WALL * 2 + 1
      layer.append(svg('rect', { x: passage.x - inner / 2, y: passage.y - WALL, width: inner, height: passage.h + WALL * 2 }, `map-gap is-${MAP_PLACES[passage.from.place]!.theme} is-${passage.from.tint}`))
      layer.append(svg('rect', { x: passage.x - PASSAGE / 2 - 0.5, y: passage.y + passage.h / 2 - 1.25, width: PASSAGE + 1, height: 2.5, rx: 1 }, 'map-door'))
    }
    size = { w: view.clientWidth, h: view.clientHeight }
    canvas.setAttribute('viewBox', `0 0 ${size.w} ${size.h}`)
    pan = { x: NaN, y: NaN }
    current = null
  }

  function follow(x: number): void {
    if (!place || !plan) return
    const offset = plan.offsets.get(place.id)
    const rowY = plan.rowY.get(place.id)
    if (offset === undefined || rowY === undefined) return
    const pinX = (x + offset) * MAP_SCALE
    const pinY = rowY + ROOM_DEPTH / 2
    const { left, right, top, bottom } = plan.bounds
    const next = { x: panTo(pinX, size.w, left, right, 8), y: panTo(pinY, size.h, top, bottom, 8) }
    if (!(Math.abs(next.x - pan.x) <= 0.05 && Math.abs(next.y - pan.y) <= 0.05)) {
      pan = next
      layer.setAttribute('transform', `translate(${pan.x.toFixed(2)} ${pan.y.toFixed(2)})`)
    }
    you.style.transform = `translate(${(pinX + pan.x).toFixed(1)}px, ${(pinY + pan.y).toFixed(1)}px)`
  }

  const redraw = () => { if (place && !root.hidden) draw() }
  window.addEventListener('resize', redraw)

  return {
    show(next) {
      place = next
      const info = MAP_PLACES[next.id]!
      root.className = `minimap is-${info.theme}`
      title.textContent = info.title
      here.textContent = ''
      root.hidden = false
      draw()
    },
    hide() {
      if (place) seen.set(place.id, sketchOf(place))
      place = null
      plan = null
      root.hidden = true
    },
    update(x) {
      if (!place) return
      // The hall grows as paintings arrive; redraw when its rooms or length change.
      if (place.rooms() !== drawnRooms || Math.abs(place.maxX() - drawnMax) > 0.01 || view.clientWidth !== size.w) draw()
      follow(x)
      const room = roomAt(drawnRooms ?? [], x)
      if (room === current) return
      for (const [key, node] of nodes) node.classList.toggle('is-current', key === `${place.id}:${room?.key}`)
      current = room
      here.textContent = room?.label ?? ''
      const name = MAP_PLACES[place.id]!.title
      root.setAttribute('aria-label', room?.label ? `Map: ${name}, ${room.label}` : `Map: ${name}`)
    },
    dispose() {
      window.removeEventListener('resize', redraw)
      root.remove()
    },
  }
}
