'use client'

import { GOLD_BAND, safeBand, type ReelState } from '../lib/machine.ts'

export default function ReelMeter({ reel, easy }: { reel: ReelState; easy: boolean }) {
  const band = safeBand(easy)
  const tension = Math.max(0, Math.min(1, reel.tension))
  const showGold = reel.treasureRevealed && !reel.treasureGrabbed
  return (
    <aside className="pond-reel-meter" data-pond-ui aria-label="Reel tension">
      <div className="pond-reel-head">
        <span>Tension</span>
        <span className={tension > 0.9 ? 'is-danger' : ''}>{Math.round(tension * 100)}</span>
      </div>
      <div className="pond-reel-body">
        <div className="pond-reel-track">
          <span
            className="pond-reel-safe"
            style={{ bottom: `${band.low * 100}%`, height: `${(band.high - band.low) * 100}%` }}
          />
          {showGold ? (
            <span
              className="pond-reel-gold"
              style={{
                bottom: `${GOLD_BAND.low * 100}%`,
                height: `${(GOLD_BAND.high - GOLD_BAND.low) * 100}%`,
              }}
            />
          ) : null}
          <span className="pond-reel-fill" style={{ height: `${tension * 100}%` }} />
          <span className="pond-reel-marker" style={{ bottom: `${tension * 100}%` }} />
        </div>
        <div className="pond-reel-side">
          <div className="pond-reel-progress" aria-label={`Reel progress ${Math.round(reel.progress * 100)}%`}>
            <span style={{ height: `${Math.max(0, Math.min(1, reel.progress)) * 100}%` }} />
          </div>
          <span className="pond-reel-progress-label">{Math.round(reel.progress * 100)}%</span>
        </div>
      </div>
      <p className={reel.runActive ? 'pond-reel-status is-run' : 'pond-reel-status'}>
        {reel.runActive
          ? 'RUN — ease off!'
          : reel.treasureGrabbed
            ? 'Chest grabbed!'
            : showGold
              ? 'Hold in the gold band!'
              : reel.fight === 0
                ? 'Hold to reel'
                : `${reel.runsLeft} run${reel.runsLeft === 1 ? '' : 's'} left`}
      </p>
    </aside>
  )
}
