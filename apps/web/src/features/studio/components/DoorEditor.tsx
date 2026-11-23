'use client'

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import {
  addPassage, DOOR_HEIGHT, DOOR_ROOMS, DOOR_STYLES, doorRoom, doorWidth, editDoor, isFixedDoor, MAX_DOOR_SCALE, MIN_DOOR_SCALE, removeDoor,
  type DoorRoom, type DoorStyle, type MuseumDoor,
} from '@tiny/core/rooms'
import { CONFIG } from '@/features/hall/scene/config'
import { computeLayout } from '@/features/hall/scene/layout'
import { doorArtUrl } from '@/features/rooms/door-art'
import { discardDoorsAction, publishDoorsAction, saveDoorsAction } from '@/features/studio/actions'

/** A painting in the hall as it is published: its picture and its canvas size before the hall's scale. */
export interface HallPainting {
  title: string
  imageUrl: string
  w: number
  h: number
}

/** Pixels per world unit on each room's wall: the hall is long and scrolls, the others fit. */
const PIXELS: Record<DoorRoom, number> = { hall: 46, atelier: 64, pond: 54 }
/** Where a painting's foot hangs above the floor, in world units, as near as the editor needs. */
const PAINTING_FOOT = 0.7

/** Things already standing in the entrance, drawn faintly so a door is not put in front of them. */
const ENTRANCE: { x: number; label: string; height: number }[] = [
  { x: -1.84, label: 'pillar', height: 2.4 },
  { x: -0.09, label: 'front door', height: 2.81 },
  { x: 2.02, label: 'tree', height: 2.7 },
  { x: 4.39, label: 'desk', height: 3.47 },
]

const REASONS: Record<string, string> = {
  too_close: 'Doors need a little space between them. Try a spot further along, or make one smaller.',
  no_room: 'There is no free place on that wall for another door.',
  too_many: 'That is as many doors as the museum can hold.',
  bad_door: 'That is not quite right: a door needs a sign and has to stay on its wall.',
  fixed_door: "The pond's forest gate is part of the scenery and stays where it is.",
}

const roomLabel = (room: DoorRoom) => doorRoom(room)!.label

export default function DoorEditor({ initial, published, startRoom, paintings }: {
  initial: MuseumDoor[]
  published: MuseumDoor[]
  startRoom: DoorRoom
  paintings: HallPainting[]
}) {
  const [doors, setDoors] = useState(initial)
  const [room, setRoom] = useState<DoorRoom>(startRoom)
  const [selected, setSelected] = useState<string | null>(initial.find((door) => door.room === startRoom)?.id ?? null)
  const [problem, setProblem] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [newTo, setNewTo] = useState<DoorRoom>(DOOR_ROOMS.find((r) => r.id !== startRoom)!.id)
  const [removing, setRemoving] = useState(false)
  const [drag, setDrag] = useState<{ id: string; x: number } | null>(null)
  /** A slider being moved: shown on the wall straight away, saved when it is let go. */
  const [slide, setSlide] = useState<{ id: string; field: 'x' | 'scale'; value: number } | null>(null)
  const wall = useRef<HTMLDivElement>(null)

  // Discarding or publishing changes the saved copy under the editor; take it up when it does.
  const saved = JSON.stringify(initial)
  useEffect(() => { setDoors(JSON.parse(saved) as MuseumDoor[]) }, [saved])

  const spec = doorRoom(room)!
  const placed = (door: MuseumDoor) => {
    if (drag?.id === door.id) return { ...door, x: drag.x }
    if (slide?.id === door.id) return { ...door, [slide.field]: slide.value }
    return door
  }
  // Saved once the slider is let go, or when the keys have rested a moment, not at every step.
  const sliding = useRef<{ id: string; field: 'x' | 'scale'; value: number } | null>(null)
  const settle = useRef<number | undefined>(undefined)
  function commitSlide() {
    window.clearTimeout(settle.current)
    const moved = sliding.current
    sliding.current = null
    setSlide(null)
    const target = moved && doors.find((d) => d.id === moved.id)
    if (moved && target && target[moved.field] !== moved.value) apply(editDoor(doors, moved.id, { [moved.field]: moved.value }))
  }
  function slider(target: MuseumDoor, field: 'x' | 'scale') {
    return {
      value: slide?.id === target.id && slide.field === field ? slide.value : target[field],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        sliding.current = { id: target.id, field, value: Number(event.target.value) }
        setSlide(sliding.current)
        window.clearTimeout(settle.current)
        settle.current = window.setTimeout(commitSlide, 700)
      },
      onPointerUp: commitSlide,
      onBlur: commitSlide,
    }
  }
  const here = doors.filter((door) => door.room === room).map(placed)
  // The hall's paintings make room for its doors, so they move as a door is dragged between them.
  const hall = computeLayout(
    paintings.map((painting) => painting.w * CONFIG.piece.scale),
    true,
    doors.filter((door) => door.room === 'hall').map(placed).map((door) => ({ x: door.x, width: doorWidth(door) })),
  )
  const range = room === 'hall'
    ? { min: spec.minX, max: Math.max(hall.totalLength, ...here.map((door) => door.x + doorWidth(door))) + 2 }
    : { min: spec.minX, max: spec.maxX }
  const ppu = PIXELS[room]
  const left = (x: number) => `${(x - range.min) * ppu}px`
  const door = doors.find((d) => d.id === selected) ?? null
  const live = (id: string) => published.find((d) => d.id === id)
  const changed = JSON.stringify(doors) !== JSON.stringify(published)

  async function save(next: MuseumDoor[], before = doors) {
    setDoors(next)
    setSaving(true)
    const { ok } = await saveDoorsAction(next).catch(() => ({ ok: false }))
    setSaving(false)
    if (!ok) {
      setDoors(before)
      setProblem('That change could not be saved. Try again.')
    }
  }

  function apply(check: ReturnType<typeof editDoor>) {
    if (!check.ok) return setProblem(REASONS[check.reason] ?? 'That change is not allowed.')
    setProblem(null)
    void save(check.doors)
  }

  function pick(id: string) {
    const target = doors.find((d) => d.id === id)
    if (!target) return
    setRoom(target.room)
    setSelected(id)
    setRemoving(false)
    setProblem(null)
  }

  function switchRoom(next: DoorRoom) {
    setRoom(next)
    setSelected(doors.find((d) => d.room === next)?.id ?? null)
    setNewTo(DOOR_ROOMS.find((r) => r.id !== next)!.id)
    setRemoving(false)
    setProblem(null)
  }

  // The wall's own box moves as it scrolls, so the pointer's place along it is read from that box.
  const xFromPointer = (clientX: number) => {
    const box = wall.current!.getBoundingClientRect()
    const x = range.min + (clientX - box.left) / ppu
    return Math.round(Math.min(range.max, spec.maxX, Math.max(spec.minX, x)) * 20) / 20
  }
  function pointerDown(target: MuseumDoor) {
    return (event: PointerEvent) => {
      pick(target.id)
      if (isFixedDoor(target)) return
      event.currentTarget.setPointerCapture(event.pointerId)
      setDrag({ id: target.id, x: target.x })
    }
  }
  function pointerMove(event: PointerEvent) {
    if (drag) setDrag({ ...drag, x: xFromPointer(event.clientX) })
  }
  function pointerUp() {
    if (!drag) return
    const moved = drag
    setDrag(null)
    if (moved.x !== doors.find((d) => d.id === moved.id)?.x) apply(editDoor(doors, moved.id, { x: moved.x }))
  }
  function nudge(target: MuseumDoor) {
    return (event: KeyboardEvent) => {
      if (isFixedDoor(target) || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')) return
      event.preventDefault()
      const x = Math.round((target.x + (event.key === 'ArrowLeft' ? -0.2 : 0.2)) * 100) / 100
      apply(editDoor(doors, target.id, { x: Math.min(range.max, spec.maxX, Math.max(spec.minX, x)) }))
    }
  }

  function add() {
    // New doors start near the left of what is in view, where the owner is looking.
    const scrolled = wall.current?.parentElement?.scrollLeft ?? 0
    const wanted = range.min + (scrolled + 300) / ppu
    const result = addPassage(doors, room, newTo, wanted)
    if (!result.ok) return setProblem(REASONS[result.reason] ?? 'That door could not be added.')
    const made = result.doors.find((d) => !doors.some((old) => old.id === d.id) && d.room === room)
    setProblem(null)
    void save(result.doors)
    if (made) setSelected(made.id)
  }

  function remove() {
    if (!door) return
    if (!removing) return setRemoving(true)
    setRemoving(false)
    setSelected(null)
    void save(removeDoor(doors, door.id))
  }

  // Keep the chosen door in view when it is picked from the table or a tab.
  useEffect(() => {
    const node = wall.current?.querySelector<HTMLElement>('.st-door.is-selected')
    node?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [selected, room])

  const fixed = door ? isFixedDoor(door) : false
  const partner = door?.toDoor ? doors.find((d) => d.id === door.toDoor) : null
  const was = door ? live(door.id) : undefined
  const shown = door ? placed(door) : null
  const along = (x: number) => (room === 'hall' ? `${(x - spec.minX).toFixed(1)} m from the left end` : `${Math.round(((x - spec.minX) / (spec.maxX - spec.minX)) * 100)}% along`)

  return (
    <>
      <div className="st-top">
        <div>
          <h1>Doors</h1>
          <p>Drag a door anywhere along the wall; paintings move aside to make room. Every door you add gets a way back.</p>
        </div>
        <div className="st-actions">
          <form action={discardDoorsAction}><button className="st-btn quiet" type="submit" disabled={!changed || saving}>Discard changes</button></form>
          <form action={publishDoorsAction}><button className="st-btn primary" type="submit" disabled={!changed || saving}>Publish doors</button></form>
        </div>
      </div>

      <nav className="st-tabs" aria-label="Rooms">
        {DOOR_ROOMS.map((r) => {
          const roomChanged = JSON.stringify(doors.filter((d) => d.room === r.id)) !== JSON.stringify(published.filter((d) => d.room === r.id))
          return (
            <button key={r.id} type="button" className="st-tab" aria-current={r.id === room ? 'page' : undefined} onClick={() => switchRoom(r.id)}>
              {r.label}{roomChanged ? <span className="st-dot" aria-label="changes waiting" /> : null}
            </button>
          )
        })}
      </nav>

      {problem ? <p className="notice bad" role="alert">{problem}</p> : null}

      <section className={`st-wall ${room}`}>
        <span className="st-wall-hint">
          {room === 'hall' ? 'The whole hall, entrance on the left. Scroll along it; paintings step aside for a door.' : room === 'pond' ? 'The bank of the pond, the forest gate at the left end.' : 'The fashion area, door end on the left.'}
        </span>
        <div className="st-doorscroll">
          <div
            className="st-doorwall"
            ref={wall}
            style={{ width: (range.max - range.min) * ppu, height: 4.6 * ppu }}
            onPointerMove={pointerMove}
            onPointerUp={pointerUp}
            onPointerCancel={pointerUp}
          >
            {room === 'hall' ? (
              <>
                {ENTRANCE.map((fixture) => (
                  <span key={fixture.label} className="st-fixture" style={{ left: left(fixture.x) }} aria-hidden="true">
                    <span style={{ height: fixture.height * ppu * 0.8 }} />
                    <span>{fixture.label}</span>
                  </span>
                ))}
                {hall.centerX.map((x, i) => {
                  const painting = paintings[i]
                  return (
                    <span
                      key={i}
                      className="st-wall-painting"
                      style={{ left: left(x), width: painting.w * CONFIG.piece.scale * ppu, height: painting.h * CONFIG.piece.scale * ppu, bottom: PAINTING_FOOT * ppu }}
                      title={painting.title}
                    >
                      <img src={painting.imageUrl} alt="" draggable={false} />
                    </span>
                  )
                })}
                {([[hall.cafeX, 'café'], [hall.guestBoardX, 'guest board'], [hall.comingSoonX, 'coming soon'], [hall.giftShopX, 'gift shop']] as const).map(([x, label]) => x === null ? null : (
                  <span key={label} className="st-fixture" style={{ left: left(x) }} aria-hidden="true">
                    <span style={{ height: 2.6 * ppu * 0.8, width: 90 }} />
                    <span>{label}</span>
                  </span>
                ))}
              </>
            ) : null}
            {was && was.room === room && shown && was.x !== shown.x ? (
              <span className="st-was" style={{ left: left(was.x), width: doorWidth(was) * ppu, height: DOOR_HEIGHT * was.scale * ppu * 0.9 }} aria-hidden="true" />
            ) : null}
            {here.map((d) => (
              <button
                key={d.id}
                type="button"
                className={`st-door${d.id === selected ? ' is-selected' : ''}${isFixedDoor(d) ? ' is-fixed' : ''}`}
                style={{ left: left(d.x) }}
                onPointerDown={pointerDown(d)}
                onKeyDown={nudge(d)}
                onClick={() => pick(d.id)}
                aria-pressed={d.id === selected}
                aria-label={`${d.label}, to ${roomLabel(d.to)}${isFixedDoor(d) ? '' : '. Arrow keys move it.'}`}
              >
                <span className="st-sign">{d.label}</span>
                <img src={doorArtUrl(d.style)} alt="" draggable={false} style={{ height: DOOR_HEIGHT * d.scale * ppu }} />
              </button>
            ))}
          </div>
        </div>
        <div className="st-wall-floor" />
      </section>

      <div className="st-two" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)' }}>
        <section className="st-card">
          {door && shown ? (
            <>
              <h2>{door.label}</h2>
              <p className="st-small st-muted" style={{ marginTop: 0 }}>
                {fixed
                  ? "The pond's forest gate is painted into the hedge, so it stays where it is. It leads back to the hall's front door."
                  : partner
                    ? `Opens into ${roomLabel(door.to).replace(/^The /, 'the ')}, coming out at “${partner.label}”.`
                    : `Opens into ${roomLabel(door.to).replace(/^The /, 'the ')} at its front door.`}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="st-field">
                  <label htmlFor="door-sign">Sign above it</label>
                  <input
                    id="door-sign"
                    key={`${door.id}-label`}
                    defaultValue={door.label}
                    maxLength={40}
                    onBlur={(event) => { if (event.target.value.trim() !== door.label) apply(editDoor(doors, door.id, { label: event.target.value })) }}
                    onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur() }}
                  />
                </div>
                {fixed ? null : (
                  <>
                    <div className="st-field">
                      <label htmlFor="door-style">Door style</label>
                      <select id="door-style" value={door.style} onChange={(event) => apply(editDoor(doors, door.id, { style: event.target.value as DoorStyle }))}>
                        {DOOR_STYLES.map((style) => <option key={style.id} value={style.id}>{style.label}</option>)}
                      </select>
                    </div>
                    <div className="st-field">
                      <label htmlFor="door-scale">Size</label>
                      <input id="door-scale" type="range" min={MIN_DOOR_SCALE} max={MAX_DOOR_SCALE} step={0.05} {...slider(door, 'scale')} />
                      <span className="st-hint"><span>Smaller</span><span>{Math.round(shown.scale * 100)}%{was && was.scale !== door.scale ? ` · was ${Math.round(was.scale * 100)}%` : ''}</span><span>Bigger</span></span>
                    </div>
                    <div className="st-field">
                      <label htmlFor="door-x">Where on the wall</label>
                      <input id="door-x" type="range" min={spec.minX} max={Math.min(range.max, spec.maxX)} step={0.05} {...slider(door, 'x')} />
                      <span className="st-hint">
                        <span>{room === 'pond' ? 'Gate' : 'Left end'}</span>
                        <span>{along(shown.x)}{was && was.x !== door.x ? ` · was ${along(was.x)}` : ''}</span>
                        <span>{room === 'hall' ? 'Gift shop' : 'Far end'}</span>
                      </span>
                    </div>
                    <button className="st-btn danger" type="button" onClick={remove} disabled={saving}>
                      {removing ? `Tap again: removes this door${partner ? ' and its way back' : ''}` : 'Remove door'}
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              <h2>No door chosen</h2>
              <p className="st-muted st-small">Click a door on the wall, or add one below.</p>
            </>
          )}
          <div style={{ borderTop: '2px solid #ecd7b2', marginTop: 18, paddingTop: 16, display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="st-field" style={{ flex: 1, minWidth: 180 }}>
              <label htmlFor="door-to">Add a door here to</label>
              <select id="door-to" value={newTo} onChange={(event) => setNewTo(event.target.value as DoorRoom)}>
                {DOOR_ROOMS.filter((r) => r.id !== room).map((r) => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
            <button className="st-btn" type="button" onClick={add} disabled={saving}>+ Add door</button>
          </div>
        </section>

        <section className="st-card">
          <h2>Every door</h2>
          <div className="st-scroll">
            <table className="st-table">
              <thead><tr><th>Door</th><th>In</th><th>Opens into</th><th>Size</th><th /></tr></thead>
              <tbody>
                {doors.map((d) => {
                  const before = live(d.id)
                  const status = !before ? 'new' : JSON.stringify(before) !== JSON.stringify(d) ? 'changed' : 'live'
                  return (
                    <tr key={d.id} className={d.id === selected ? 'is-selected' : undefined}>
                      <td><button type="button" onClick={() => pick(d.id)}><img src={doorArtUrl(d.style)} alt="" />{d.label}</button></td>
                      <td>{roomLabel(d.room)}</td>
                      <td>{roomLabel(d.to)}</td>
                      <td>{Math.round(d.scale * 100)}%</td>
                      <td><span className={`st-tag ${status === 'live' ? 'live' : 'new'}`}>{status}</span></td>
                    </tr>
                  )
                })}
                {published.filter((p) => !doors.some((d) => d.id === p.id)).map((p) => (
                  <tr key={p.id}><td><img src={doorArtUrl(p.style)} alt="" style={{ opacity: 0.4 }} /><s>{p.label}</s></td><td>{roomLabel(p.room)}</td><td>{roomLabel(p.to)}</td><td>{Math.round(p.scale * 100)}%</td><td><span className="st-tag warn">removed</span></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  )
}
