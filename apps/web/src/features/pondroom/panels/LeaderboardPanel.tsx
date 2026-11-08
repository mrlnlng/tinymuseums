'use client'

import { useEffect, useState } from 'react'
import {
  fetchPondLeaderboard,
  type PondBoardId,
  type PondBoardPeriod,
  type PondBoardRow,
  type PondLeaderboard,
} from '../lib/pond-api'
import {
  catchLabel,
  fishArt,
  formatInteger,
  formatOdds,
  formatSizeCm,
  nextMondayUtc,
} from '../lib/pond-format'
import { useCountdown } from '../lib/use-countdown'

const BOARDS: { id: PondBoardId; label: string }[] = [
  { id: 'biggest', label: 'Biggest catch' },
  { id: 'haul', label: 'Pearl haul' },
  { id: 'rarest', label: 'Rarest catch' },
]

const PERIODS: { id: PondBoardPeriod; label: string }[] = [
  { id: 'week', label: 'This week' },
  { id: 'all', label: 'All time' },
]

function medalClass(rank: number): string {
  if (rank === 1) return ' is-gold'
  if (rank === 2) return ' is-silver'
  if (rank === 3) return ' is-bronze'
  return ''
}

function primaryValue(board: PondBoardId, row: PondBoardRow): string {
  if (board === 'rarest') return formatOdds(row.value)
  if (board === 'haul') return `${formatInteger(row.value)} pearls`
  return `${formatInteger(row.value)} pts`
}

function passLine(board: PondBoardId, me: PondLeaderboard['me']): string {
  if (me === null) return ''
  if (me.rank <= 1) return 'You are #1 on this board.'
  const next = me.above[me.above.length - 1]
  if (!next) return `You are #${me.rank} on this board.`
  if (board === 'rarest') {
    return `Catch rarer than ${formatOdds(next.value)} to pass ${next.name}`
  }
  const gap = Math.max(0, next.value - me.value)
  if (gap === 0) return `You are tied with ${next.name}.`
  if (board === 'haul') return `${formatInteger(gap)} ${gap === 1 ? 'pearl' : 'pearls'} to pass ${next.name}`
  return `${formatInteger(gap)} ${gap === 1 ? 'point' : 'points'} to pass ${next.name}`
}

function BoardRow({ board, row }: { board: PondBoardId; row: PondBoardRow }) {
  const showCatch = board !== 'haul' && row.species !== null
  return (
    <li className="pond-room-board-row">
      <span className={`pond-room-board-medal${medalClass(row.rank)}`} aria-label={`Rank ${row.rank}`}>
        {row.rank}
      </span>
      <span className="pond-room-board-who">
        <span className="pond-room-board-name">{row.name}</span>
        {showCatch ? (
          <span className="pond-room-board-catch">
            <img src={fishArt(row.species)} alt="" width={22} height={22} loading="lazy" />
            <span>
              {catchLabel(row.species, row.variant)} · {formatSizeCm(row.sizeCm)}
            </span>
          </span>
        ) : null}
      </span>
      <span className="pond-room-board-value">{primaryValue(board, row)}</span>
    </li>
  )
}

export default function LeaderboardPanel() {
  const [board, setBoard] = useState<PondBoardId>('biggest')
  const [period, setPeriod] = useState<PondBoardPeriod>('week')
  const [data, setData] = useState<PondLeaderboard | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [reload, setReload] = useState(0)
  const reset = nextMondayUtc()
  const resetIn = useCountdown(reset)

  useEffect(() => {
    let live = true
    setStatus('loading')
    void fetchPondLeaderboard(board, period).then((result) => {
      if (!live) return
      if (result.ok) {
        setData(result.value)
        setStatus('ready')
      } else {
        setStatus('error')
      }
    })
    return () => {
      live = false
    }
  }, [board, period, reload])

  return (
    <div className="pond-room-board">
      <div className="pond-room-tabs" role="tablist" aria-label="Leaderboard">
        {BOARDS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            role="tab"
            aria-selected={board === entry.id}
            className={`pond-room-tab${board === entry.id ? ' is-active' : ''}`}
            onClick={() => setBoard(entry.id)}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="pond-room-periods" role="group" aria-label="Time period">
        {PERIODS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            aria-pressed={period === entry.id}
            className={`pond-room-period${period === entry.id ? ' is-active' : ''}`}
            onClick={() => setPeriod(entry.id)}
          >
            {entry.label}
          </button>
        ))}
        {period === 'week' ? (
          <span className="pond-room-board-reset">Resets Monday · {resetIn}</span>
        ) : (
          <span className="pond-room-board-reset">Every catch since the pond opened</span>
        )}
      </div>

      <div className="pond-room-board-scroll">
        {status === 'loading' ? <p className="pond-room-empty">Hanging the board…</p> : null}
        {status === 'error' ? (
          <div className="pond-room-empty">
            <p>The board could not be fetched just now.</p>
            <button type="button" className="pond-room-button is-quiet" onClick={() => setReload((n) => n + 1)}>
              Try again
            </button>
          </div>
        ) : null}

        {status === 'ready' && data ? (
          data.rows.length === 0 ? (
            <p className="pond-room-empty">No catches on this board yet. The water is waiting.</p>
          ) : (
            <ol className="pond-room-board-list">
              {data.rows.map((row, index) => (
                <BoardRow key={`${row.rank}-${row.name}-${index}`} board={board} row={row} />
              ))}
            </ol>
          )
        ) : null}
      </div>

      {status === 'ready' && data ? (
        <div className="pond-room-board-you">
          {data.me ? (
            <>
              <div className="pond-room-board-you-head">
                <span className="pond-room-board-you-label">You</span>
                <span className={`pond-room-board-medal${medalClass(data.me.rank)}`} aria-label={`Your rank ${data.me.rank}`}>
                  {data.me.rank}
                </span>
                <span className="pond-room-board-you-name">{data.me.name}</span>
                <span className="pond-room-board-you-value">{primaryValue(board, data.me)}</span>
              </div>
              {data.me.above.length > 0 ? (
                <ol className="pond-room-board-above">
                  {data.me.above.map((row, index) => (
                    <li key={`${row.rank}-${row.name}-${index}`}>
                      <span className="pond-room-board-above-rank">#{row.rank}</span>
                      <span className="pond-room-board-above-name">{row.name}</span>
                      <span className="pond-room-board-above-value">{primaryValue(board, row)}</span>
                    </li>
                  ))}
                </ol>
              ) : null}
              <p className="pond-room-board-pass">{passLine(board, data.me)}</p>
            </>
          ) : (
            <p className="pond-room-board-signin">
              Sign in to join the leaderboard. Guests can fish the pond, but the boards keep pearls for members.
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
