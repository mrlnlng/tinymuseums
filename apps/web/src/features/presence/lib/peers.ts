import type { Emote, Look, Peer } from '@tiny/core/presence/wire'

/** How far behind the latest update other visitors are drawn, so motion stays smooth. */
export const INTERPOLATION_DELAY_MS = 200
const MAX_EXTRAPOLATION_MS = 300
export const PEER_TIMEOUT_MS = 12_000
const SAMPLES = 4

interface Sample {
  at: number
  x: number
  vx: number
}

interface Entry {
  pid: string
  name: string
  look: Look
  facing: 1 | -1
  seq: number
  heardAt: number
  samples: Sample[]
  emote: { e: Emote; at: number } | null
}

export interface RemoteVisitor {
  pid: string
  name: string
  look: Look
  facing: 1 | -1
  /** Where to draw them now. */
  x: number
  /** Their walking speed, for the walk cycle. */
  vx: number
  emote: { e: Emote; at: number } | null
}

export class PeerTable {
  private entries = new Map<string, Entry>()

  get size(): number {
    return this.entries.size
  }

  has(pid: string): boolean {
    return this.entries.has(pid)
  }

  clear(): void {
    this.entries.clear()
  }

  /** A state from the room; stale or repeated updates are dropped. */
  heard(peer: Peer, now: number): void {
    const entry = this.entries.get(peer.pid)
    if (entry && peer.seq <= entry.seq) return
    const sample = { at: now, x: peer.x, vx: peer.vx }
    if (!entry) {
      this.entries.set(peer.pid, {
        pid: peer.pid, name: peer.name, look: peer.look, facing: peer.facing, seq: peer.seq,
        heardAt: now, samples: [sample], emote: null,
      })
      return
    }
    entry.name = peer.name
    entry.look = peer.look
    entry.facing = peer.facing
    entry.seq = peer.seq
    entry.heardAt = now
    entry.samples.push(sample)
    if (entry.samples.length > SAMPLES) entry.samples.shift()
  }

  emoted(pid: string, e: Emote, now: number): boolean {
    const entry = this.entries.get(pid)
    if (!entry) return false
    entry.emote = { e, at: now }
    return true
  }

  left(pid: string): void {
    this.entries.delete(pid)
  }

  /** Forgets anyone silent for longer than the heartbeat allows. */
  expire(now: number): void {
    for (const [pid, entry] of this.entries) if (now - entry.heardAt > PEER_TIMEOUT_MS) this.entries.delete(pid)
  }

  visitors(now: number): RemoteVisitor[] {
    const at = now - INTERPOLATION_DELAY_MS
    return [...this.entries.values()].map((entry) => {
      const { x, vx } = positionAt(entry.samples, at)
      return { pid: entry.pid, name: entry.name, look: entry.look, facing: entry.facing, x, vx, emote: entry.emote }
    })
  }
}

function positionAt(samples: Sample[], at: number): { x: number; vx: number } {
  const first = samples[0]
  if (at <= first.at) return { x: first.x, vx: first.vx }
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1]
    const b = samples[i]
    if (at <= b.at) {
      const t = (at - a.at) / (b.at - a.at)
      return { x: a.x + (b.x - a.x) * t, vx: a.vx + (b.vx - a.vx) * t }
    }
  }
  const last = samples[samples.length - 1]
  const ahead = Math.min(at - last.at, MAX_EXTRAPOLATION_MS) / 1000
  return { x: last.x + last.vx * ahead, vx: last.vx }
}
