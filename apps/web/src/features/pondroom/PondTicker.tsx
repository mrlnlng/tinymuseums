'use client'

import { useEffect, useRef, useState } from 'react'
import { assetUrl, type AssetName } from '@/shared/lib/assets'
import { fetchPondFeed, type PondFeedItem } from './lib/pond-api'
import { catchLabel, formatSizeCm, speciesTier } from './lib/pond-format'

const POLL_MS = 15_000
const SHOW_MS = 4_000
const GAP_MS = 450
/** On arrival, one legendary this recent is worth hearing about. */
const RECENT_LEGENDARY_MS = 10 * 60_000

export interface PondTickerProps {
  className?: string
}

function isGolden(item: PondFeedItem): boolean {
  return speciesTier(item.species) === 'legendary' || item.variant === 'prismatic'
}

/** Big catches from the whole pond, one gentle toast at a time. */
export default function PondTicker({ className }: PondTickerProps) {
  const [showing, setShowing] = useState<PondFeedItem | null>(null)
  const [leaving, setLeaving] = useState(false)
  const queue = useRef<PondFeedItem[]>([])
  const known = useRef<Set<string> | null>(null)
  const busy = useRef(false)
  const timers = useRef<Set<number>>(new Set())

  useEffect(() => {
    let live = true
    const later = (fn: () => void, ms: number) => {
      const timer = window.setTimeout(() => { timers.current.delete(timer); fn() }, ms)
      timers.current.add(timer)
    }

    const next = () => {
      if (!live) return
      const item = queue.current.shift()
      if (!item) {
        busy.current = false
        return
      }
      busy.current = true
      setLeaving(false)
      setShowing(item)
      later(() => setLeaving(true), SHOW_MS)
      later(() => {
        setShowing(null)
        later(next, GAP_MS)
      }, SHOW_MS + 260)
    }

    async function load(): Promise<void> {
      const result = await fetchPondFeed()
      if (!live || !result.ok) return
      const feed = result.value
      if (known.current === null) {
        known.current = new Set(feed.map((item) => item.id))
        const recent = feed.find((item) => isGolden(item) && Date.now() - Date.parse(item.at) < RECENT_LEGENDARY_MS)
        if (recent) queue.current.push(recent)
      } else {
        const fresh = feed.filter((item) => !known.current!.has(item.id)).reverse()
        known.current = new Set(feed.map((item) => item.id))
        queue.current.push(...fresh.filter(isGolden))
        queue.current = queue.current.slice(-3)
      }
      if (!busy.current) next()
    }

    void load()
    const poll = window.setInterval(() => void load(), POLL_MS)
    return () => {
      live = false
      window.clearInterval(poll)
      for (const timer of timers.current) window.clearTimeout(timer)
      timers.current.clear()
    }
  }, [])

  return (
    <div className={`pond-room-toasts${className ? ` ${className}` : ''}`} role="status" aria-live="polite">
      {showing ? (
        <p
          key={showing.id}
          className={['pond-room-toast', isGolden(showing) ? 'is-golden' : '', leaving ? 'is-leaving' : '']
            .filter(Boolean)
            .join(' ')}
        >
          <img src={assetUrl(`pond/fish-${showing.species}` as AssetName)} alt="" width={22} height={16} />
          <span>
            <strong>{showing.name}</strong> landed a {catchLabel(showing.species, showing.variant)} ·{' '}
            {formatSizeCm(showing.sizeCm)}
            {showing.trophy ? ' 🏆' : ''}
          </span>
        </p>
      ) : null}
    </div>
  )
}
