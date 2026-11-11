'use client'

import { DANGER_TENSION, GOLD_BAND, isPerfectPower, safeBand, SWEET_HIGH, SWEET_LOW, type ReelState } from '../lib/machine.ts'

export default function ReelMeter({ reel, easy }: { reel: ReelState; easy: boolean }) {
  const band = safeBand(easy)
  const tension = Math.max(0, Math.min(1, reel.tension))
  const progress = Math.max(0, Math.min(1, reel.progress))
  const showGold = reel.treasureRevealed && !reel.treasureGrabbed
  const danger = tension >= DANGER_TENSION
  const status = reel.runActive
    ? 'It’s running — let go!'
    : reel.treasureGrabbed
      ? 'Chest grabbed!'
      : showGold
        ? 'Hold the gold for the chest'
        : danger
          ? 'Too tight — ease off'
          : tension < band.low
            ? 'Slack — hold to reel'
            : 'Keep it in the green'
  return (
    <aside
      className={['pond-reel-meter', reel.runActive ? 'is-run' : '', danger ? 'is-danger' : ''].filter(Boolean).join(' ')}
      data-pond-press
      aria-label="Reel tension"
    >
      <div className="pond-reel-head">
        <span className="pond-reel-status">{status}</span>
        <span className="pond-reel-count" aria-label={`Reeled in ${Math.round(progress * 100)}%`}>
          {Math.round(progress * 100)}%
        </span>
      </div>
      <div className="pond-reel-track">
        <span
          className="pond-reel-safe"
          style={{ left: `${band.low * 100}%`, width: `${(band.high - band.low) * 100}%` }}
        />
        {showGold ? (
          <span
            className="pond-reel-gold"
            style={{ left: `${GOLD_BAND.low * 100}%`, width: `${(GOLD_BAND.high - GOLD_BAND.low) * 100}%` }}
          />
        ) : null}
        <span className="pond-reel-snap" style={{ left: `${DANGER_TENSION * 100}%` }} />
        <span className="pond-reel-marker" style={{ left: `${tension * 100}%` }} />
      </div>
      <div className="pond-reel-progress">
        <span style={{ width: `${progress * 100}%` }} />
      </div>
    </aside>
  )
}

/** The cast power sweep, shown above the button where a thumb cannot hide it. */
export function CastMeter({ power }: { power: number }) {
  const sweet = isPerfectPower(power)
  return (
    <aside className={sweet ? 'pond-reel-meter is-cast is-sweet' : 'pond-reel-meter is-cast'} data-pond-press aria-label="Cast power">
      <div className="pond-reel-head">
        <span className="pond-reel-status">{sweet ? 'Now!' : 'Tap in the gold'}</span>
      </div>
      <div className="pond-reel-track">
        <span className="pond-reel-gold" style={{ left: `${SWEET_LOW * 100}%`, width: `${(SWEET_HIGH - SWEET_LOW) * 100}%` }} />
        <span className="pond-reel-marker" style={{ left: `${power * 100}%` }} />
      </div>
    </aside>
  )
}
