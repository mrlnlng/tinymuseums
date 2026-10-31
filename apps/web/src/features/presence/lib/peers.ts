import type { Look, Peer } from '@tiny/core/presence/wire'

/** How far behind the latest update other visitors are drawn, so motion stays smooth. */
export const INTERPOLATION_DELAY_MS = 200
const MAX_EXTRAPOLATION_MS = 300
export const PEER_TIMEOUT_MS = 12_000
const SAMPLES = 4
/** Updates further apart than this mean the visitor was standing still in between. */
const QUIET_GAP_MS = 600
const RESUME_MS = 200

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
  sit: boolean
  helm: boolean
  cup: boolean
  seq: number
  heardAt: number
  samples: Sample[]
  said: { text: string; at: number } | null
}

export interface RemoteVisitor {
  pid: string
  name: string
  look: Look
  facing: 1 | -1
  sit: boolean
  helm: boolean
  cup: boolean
  /** Where to draw them now. */
  x: number
  /** Their walking speed, for the walk cycle. */
  vx: number
  said: { text: string; at: number } | null
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
        pid: peer.pid, name: peer.name, look: peer.look, facing: peer.facing,
        sit: peer.sit, helm: peer.helm, cup: peer.cup, seq: peer.seq,
        heardAt: now, samples: [sample], said: null,
      })
      return
    }
    entry.name = peer.name
    entry.look = peer.look
    entry.facing = peer.facing
    entry.sit = peer.sit
    entry.helm = peer.helm
    entry.cup = peer.cup
    entry.seq = peer.seq
    entry.heardAt = now
    // After a quiet spell, they were standing where they were until just before this update;
    // without this the walk would start from a point seconds back and lurch forward.
    const last = entry.samples[entry.samples.length - 1]
    if (now - last.at > QUIET_GAP_MS) entry.samples.push({ at: now - RESUME_MS, x: last.x, vx: 0 })
    entry.samples.push(sample)
    while (entry.samples.length > SAMPLES) entry.samples.shift()
  }

  /** Their latest message; false when they are not (yet) known here. */
  said(pid: string, text: string, now: number): boolean {
    const entry = this.entries.get(pid)
    if (!entry) return false
    entry.said = { text, at: now }
    return true
  }

  nameOf(pid: string): string | null {
    return this.entries.get(pid)?.name ?? null
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
      return {
        pid: entry.pid, name: entry.name, look: entry.look, facing: entry.facing,
        sit: entry.sit, helm: entry.helm, cup: entry.cup, x, vx, said: entry.said,
      }
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
