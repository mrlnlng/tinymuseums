'use client'

import Link from 'next/link'
import { useState, useTransition, type DragEvent } from 'react'
import type { LocationState } from '@tiny/core'
import { nudgeInRowAction, placePaintingAction } from '@/features/studio/actions'
import Frame, { AtelierFrame } from './Frame'

export interface HangWork {
  id: string
  title: string
  imageUrl: string | null
  aspect: number | null
  /** Where it hangs now, if somewhere other than this room. */
  elsewhere: string | null
}

const form = (entries: Record<string, string>) => {
  const data = new FormData()
  for (const [key, value] of Object.entries(entries)) data.set(key, value)
  return data
}

/** One room's wall: drag paintings along it or onto it from storage, or select one and use the buttons. */
export default function HangBoard({ state, works, tray }: { state: LocationState; works: Record<string, HangWork>; tray: HangWork[] }) {
  const back = `/studio/hang?room=${state.id}`
  const [selected, setSelected] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)
  const [over, setOver] = useState<string | null>(null)
  const [pending, start] = useTransition()

  const place = (id: string, target: string) => start(() => placePaintingAction(form({ id, target, back })))
  const nudge = (id: string, by: 'up' | 'down') => start(() => nudgeInRowAction(form({ location: state.id, id, by })))

  function dragStart(id: string) {
    return (event: DragEvent) => {
      event.dataTransfer.setData('text/plain', id)
      event.dataTransfer.effectAllowed = 'move'
      setDragging(id)
    }
  }
  function dropAt(target: string) {
    return {
      onDragOver: (event: DragEvent) => { event.preventDefault(); setOver(target) },
      onDragLeave: () => setOver((current) => (current === target ? null : current)),
      onDrop: (event: DragEvent) => {
        event.preventDefault()
        const id = event.dataTransfer.getData('text/plain')
        setOver(null)
        setDragging(null)
        if (id) dropped(id, target)
      },
    }
  }
  /** A row target is `before:<id>` or `end`; a frame target is its spot id. */
  function dropped(id: string, target: string) {
    if (state.kind === 'spots') return place(id, `${state.id}|${target}`)
    if (target === 'end') return place(id, `${state.id}|end`)
    const before = target.slice('before:'.length)
    if (before === id) return
    const others = state.row.filter((other) => other !== id)
    const at = others.indexOf(before)
    place(id, `${state.id}|${at <= 0 ? 'start' : others[at - 1]}`)
  }

  const chosen = selected ? works[selected] ?? tray.find((work) => work.id === selected) : undefined
  const inRow = selected ? state.row.indexOf(selected) : -1
  const inSpot = state.spots.find((spot) => spot.pieceId === selected)
  const fromTray = tray.some((work) => work.id === selected)
  const emptySpot = state.spots.find((spot) => !spot.pieceId)

  return (
    <div className="st-hang" aria-busy={pending}>
      <section className={`st-wall${state.id === 'atelier' ? ' atelier' : ''}`}>
        <span className="st-wall-hint">{state.kind === 'row' ? 'As visitors walk it, left to right' : 'Each frame holds one painting, cropped to the frame'}</span>
        {state.kind === 'row' ? (
          <div className="st-row">
            {state.row.map((id, index) => {
              const work = works[id]
              const live = state.liveRow[index] === id
              return (
                <div
                  key={id}
                  className={`st-slot${dragging === id ? ' is-dragging' : ''}${over === `before:${id}` && dragging !== id ? ' is-drop-before' : ''}`}
                  draggable
                  onDragStart={dragStart(id)}
                  onDragEnd={() => setDragging(null)}
                  {...dropAt(`before:${id}`)}
                >
                  <span className="st-num">{index + 1}</span>
                  <button type="button" className={`st-frame-button${selected === id ? ' is-selected' : ''}`} onClick={() => setSelected(id)} aria-pressed={selected === id} style={{ background: 'none', border: 0, padding: 0, cursor: 'grab' }}>
                    <span className={selected === id ? 'st-frame is-selected' : undefined} style={{ display: 'block' }}>
                      <Frame imageUrl={work?.imageUrl ?? null} aspect={work?.aspect ?? null} height={170} title={work?.title ?? 'A painting'} />
                    </span>
                  </button>
                  <span className="st-plaque"><b>{work?.title ?? 'untitled'}</b><span className={`st-tag ${live ? 'live' : 'new'}`}>{live ? 'live' : 'not live yet'}</span></span>
                </div>
              )
            })}
            <div className={`st-drop${over === 'end' ? ' is-over' : ''}`} {...dropAt('end')}>Drop here<br />to add at the end</div>
          </div>
        ) : (
          <div className="st-spots">
            {state.spots.map((spot) => {
              const work = spot.pieceId ? works[spot.pieceId] : undefined
              return (
                <div key={spot.id} className="st-slot" {...dropAt(spot.id)} style={over === spot.id ? { filter: 'drop-shadow(0 0 10px #ffef83)' } : undefined}>
                  <button type="button" onClick={() => setSelected(spot.pieceId ?? `spot:${spot.id}`)} aria-pressed={selected === spot.pieceId} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer' }}
                    draggable={!!spot.pieceId} onDragStart={spot.pieceId ? dragStart(spot.pieceId) : undefined}>
                    <span className={selected === (spot.pieceId ?? `spot:${spot.id}`) ? 'st-frame is-selected' : undefined} style={{ display: 'block' }}>
                      <AtelierFrame imageUrl={work?.imageUrl ?? null} side={spot.id.endsWith('left') ? 'left' : 'right'} height={200} title={work?.title ?? `${spot.label}, empty`} />
                    </span>
                  </button>
                  <span className="st-plaque"><b>{spot.label.split(' · ')[1] ?? spot.label}</b>{work ? work.title : 'empty'} {spot.pieceId !== spot.livePieceId ? <span className="st-tag new">not live yet</span> : null}</span>
                </div>
              )
            })}
          </div>
        )}
        <div className="st-wall-floor" />
      </section>

      <aside style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <section className="st-card">
          <div className="st-card-head"><h2>Selected</h2>{inRow >= 0 ? <span className="st-small st-muted">spot {inRow + 1} of {state.row.length}</span> : null}</div>
          {chosen ? (
            <>
              <div className="st-sel">
                <span className="st-pic" style={chosen.imageUrl ? { backgroundImage: `url(${chosen.imageUrl})` } : undefined} />
                <div><b>{chosen.title}</b><div className="st-small st-muted">{fromTray ? (chosen.elsewhere ? `Hangs in ${chosen.elsewhere}` : 'In storage') : 'On this wall'}</div><Link className="st-small" href={`/studio/paintings?id=${chosen.id}`}>Edit details</Link></div>
              </div>
              <div className="st-tools">
                {inRow >= 0 ? (
                  <>
                    <button className="st-btn square" type="button" aria-label="Move left" disabled={pending || inRow === 0} onClick={() => nudge(chosen.id, 'up')}>←</button>
                    <button className="st-btn square" type="button" aria-label="Move right" disabled={pending || inRow === state.row.length - 1} onClick={() => nudge(chosen.id, 'down')}>→</button>
                  </>
                ) : null}
                {fromTray && state.kind === 'row' ? <button className="st-btn small" type="button" disabled={pending} onClick={() => place(chosen.id, `${state.id}|end`)}>Hang at the end</button> : null}
                {fromTray && state.kind === 'spots' ? state.spots.map((spot) => (
                  <button key={spot.id} className="st-btn small" type="button" disabled={pending} onClick={() => place(chosen.id, `${state.id}|${spot.id}`)}>
                    Hang in the {spot.id.endsWith('left') ? 'left' : 'right'} frame{spot.pieceId ? ' (replaces)' : ''}
                  </button>
                )) : null}
                {inRow >= 0 || inSpot ? <button className="st-btn danger small" type="button" disabled={pending} onClick={() => { place(chosen.id, 'none'); setSelected(null) }}>Take down</button> : null}
              </div>
            </>
          ) : selected?.startsWith('spot:') ? (
            <p className="st-muted st-small">An empty frame. Pick a painting from storage below, or drag one onto it.</p>
          ) : (
            <p className="st-muted st-small">Click a painting on the wall or in storage.</p>
          )}
        </section>
        <section className="st-card">
          <h2>In storage</h2>
          <p className="st-small st-muted" style={{ margin: '2px 0 0' }}>
            {state.kind === 'row' ? 'Drag one onto the wall, or click it and hang it.' : emptySpot ? 'Drag one onto a frame, or click it and choose a frame.' : 'Drag one onto a frame to swap it in.'}
          </p>
          <div className="st-tray">
            {tray.map((work) => (
              <button key={work.id} type="button" className={`st-tray-item${selected === work.id ? ' is-selected' : ''}`} draggable onDragStart={dragStart(work.id)} onDragEnd={() => setDragging(null)}
                onClick={() => setSelected(work.id)} aria-pressed={selected === work.id}>
                <span className="st-pic" style={work.imageUrl ? { backgroundImage: `url(${work.imageUrl})` } : undefined} />
                <span>{work.title}{work.elsewhere ? <span className="st-muted"> · {work.elsewhere}</span> : null}</span>
              </button>
            ))}
            <Link className="st-tray-item" href="/studio/paintings?id=new" style={{ textDecoration: 'none', cursor: 'pointer' }}>
              <span className="st-pic" style={{ background: '#f6e8cc', border: '2px dashed #d8b98c', boxShadow: 'none', display: 'grid', placeItems: 'center', fontSize: 28, color: '#b18e6a' }}>+</span>
              <span>Upload new</span>
            </Link>
          </div>
        </section>
      </aside>
    </div>
  )
}
