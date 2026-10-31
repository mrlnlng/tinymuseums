'use client'

import { useEffect, useRef, useState } from 'react'
import { EMOTES, type Emote } from '@tiny/core/presence/wire'
import { presence as presenceSlot } from '@tiny/core/slots'
import { useVisitorName } from '../lib/useVisitorName'
import { createPresence, type Presence, type Self } from '../lib/presence'
import type { RemoteVisitor } from '../lib/peers'
import { useSlot } from '@/shared/lib/slots'

// Development only: walk a strip with ← → and see who else is in the room, without the scene.
const WIDTH = 20

export default function PresencePreview() {
  const [prefs] = useSlot(presenceSlot)
  const { name } = useVisitorName()
  const [view, setView] = useState<{ status: string; instance: number; x: number; others: RemoteVisitor[] }>({ status: 'idle', instance: 0, x: 0, others: [] })
  const [heard, setHeard] = useState<string[]>([])
  const presenceRef = useRef<Presence | null>(null)
  const [room, setRoom] = useState<string | null>(null)

  useEffect(() => setRoom(new URLSearchParams(location.search).get('room') ?? 'atelier'), [])

  useEffect(() => {
    if (prefs.seed === null || room === null) return
    const self: Self = { x: WIDTH / 2, vx: 0, facing: 1, look: { kind: 'bunny', costume: null, bow: null }, sit: false, helm: false, cup: false }
    const keys = new Set<string>()
    const down = (e: KeyboardEvent) => keys.add(e.key)
    const up = (e: KeyboardEvent) => keys.delete(e.key)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    const presence = createPresence({
      room,
      seed: prefs.seed,
      self: () => self,
      visible: () => document.visibilityState === 'visible',
      onEmote: (pid, e) => setHeard((list) => [`${pid.slice(0, 6)} ${e}`, ...list].slice(0, 5)),
    })
    presenceRef.current = presence
    let previous = performance.now()
    let frame = 0
    const loop = (now: number) => {
      frame = requestAnimationFrame(loop)
      const dt = (now - previous) / 1000
      previous = now
      const dir = (keys.has('ArrowRight') ? 1 : 0) - (keys.has('ArrowLeft') ? 1 : 0)
      self.vx = dir * 3
      if (dir) self.facing = dir > 0 ? 1 : -1
      self.x = Math.max(0, Math.min(WIDTH, self.x + self.vx * dt))
      presence.tick()
      setView({ status: presence.status, instance: presence.instance, x: self.x, others: presence.visitors() })
    }
    frame = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      presence.dispose()
    }
  }, [prefs.seed, room])

  const at = (x: number) => `${(x / WIDTH) * 100}%`
  return (
    <main style={{ padding: 16, fontFamily: 'monospace', background: '#f6ead2', minHeight: '100vh' }}>
      <p data-testid="me">{name ?? '…'} · {room}-s{view.instance} · {view.status} · x {view.x.toFixed(2)}</p>
      <div style={{ position: 'relative', height: 120, margin: '24px 0', borderBottom: '2px solid #7a4b3a' }}>
        <div style={{ position: 'absolute', left: at(view.x), bottom: 0, transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div>you</div><div style={{ width: 16, height: 16, borderRadius: 8, background: '#c2185b', margin: 'auto' }} />
        </div>
        {view.others.map((other) => (
          <div key={other.pid} data-testid="other" data-name={other.name} data-x={other.x.toFixed(2)} style={{ position: 'absolute', left: at(other.x), bottom: 24, transform: 'translateX(-50%)', textAlign: 'center' }}>
            <div>{other.name}{other.emote ? ` ${other.emote.e}` : ''}</div>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: '#3a6ea5', margin: 'auto' }} />
          </div>
        ))}
      </div>
      <p>
        {EMOTES.map((e: Emote) => (
          <button key={e} type="button" onClick={() => presenceRef.current?.emote(e)} style={{ marginRight: 8 }}>{e}</button>
        ))}
      </p>
      <p data-testid="heard">{heard.join(' · ')}</p>
      <p>Hold ← → to walk. Open this page in a second window to meet yourself. ?room=hall-e1 for another room.</p>
    </main>
  )
}
