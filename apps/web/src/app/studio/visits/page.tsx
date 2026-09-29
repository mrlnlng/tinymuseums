import Link from 'next/link'
import { VISIT_FEATURES, summarizeVisits, type VisitLandmark } from '@tiny/core'
import { requireHallOwner } from '@/shared/lib/session'

export const dynamic = 'force-dynamic'

const RANGES = [
  { days: 1, label: '24 hours' },
  { days: 7, label: '7 days' },
  { days: 30, label: '30 days' },
]

const PAGES: Record<string, string> = {
  '/': 'Landing',
  '/museum': 'Museum',
  '/a/[slug]': 'Artist wall',
  other: 'Other',
}

const LANDMARKS: Record<VisitLandmark, string> = {
  entrance: 'Came in',
  cafe: 'Reached the café',
  guest_board: 'Reached the guest board',
  gift_shop: 'Reached the gift shop',
}

function duration(ms: number | null): string {
  if (ms === null) return '—'
  const seconds = Math.round(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, '0')}s`
}

function amount(value: number | null, digits = 1): string {
  return value === null ? '—' : value.toFixed(digits).replace(/\.0$/, '')
}

function share(part: number, whole: number): string {
  return whole === 0 ? '—' : `${Math.round((part / whole) * 100)}%`
}

export default async function VisitsPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireHallOwner()
  const { days: daysParam } = await searchParams
  const days = RANGES.find((range) => String(range.days) === daysParam)?.days ?? 7
  const stats = await summarizeVisits(days)

  return (
    <>
      <h1 className="script page-title">Visits</h1>
      <p className="muted lead">
        Unique visitors are counted without cookies, from a hash whose salt is discarded every 90
        days. The total counts a returning visitor once; the daily table counts them once per day.
        A visitor whose network or browser changes is counted again. Time is how long the page
        was on screen.
      </p>

      <p className="small">
        {RANGES.map((range, i) => (
          <span key={range.days}>
            {i > 0 ? ' · ' : null}
            {range.days === days ? (
              <strong>{range.label}</strong>
            ) : (
              <Link href={`/studio/visits?days=${range.days}`}>{range.label}</Link>
            )}
          </span>
        ))}
      </p>

      {stats.visits === 0 ? (
        <p className="muted">No visits in this period yet.</p>
      ) : (
        <>
          <div className="grid two">
            {[
              ['Unique visitors', String(stats.visitors)],
              ['Visits', String(stats.visits)],
              ['Time on page (median)', duration(stats.medianDurationMs)],
              ['Time on page (average)', duration(stats.averageDurationMs)],
              ['Interactions (median)', amount(stats.medianInteractions)],
              ['Interactions (average)', amount(stats.averageInteractions)],
            ].map(([label, value]) => (
              <div key={label} className="plaque-card">
                <div className="stat-value">{value}</div>
                <div className="small">{label}</div>
              </div>
            ))}
          </div>

          <h2 className="stat-section">How far they got</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Point in the hall</th>
                <th>Visits</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {stats.reach.map((row) => (
                <tr key={row.landmark}>
                  <td>{LANDMARKS[row.landmark]}</td>
                  <td className="num">{row.visits}</td>
                  <td className="num">{share(row.visits, stats.visits)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="small muted">
            On average a visit reached {amount(stats.averagePaintings)} paintings in.
          </p>

          <table className="data">
            <thead>
              <tr>
                <th>Paintings reached</th>
                <th>Visits</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {stats.paintings.map((row) => (
                <tr key={row.paintings}>
                  <td>{row.paintings === 0 ? 'None' : row.paintings}</td>
                  <td className="num">{row.visits}</td>
                  <td className="num">{share(row.visits, stats.visits)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="stat-section">Features used</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Times used</th>
                <th>Visits that used it</th>
              </tr>
            </thead>
            <tbody>
              {stats.features.map((row) => (
                <tr key={row.feature}>
                  <td>{VISIT_FEATURES[row.feature]}</td>
                  <td className="num">{row.uses}</td>
                  <td className="num">
                    {row.visits} ({share(row.visits, stats.visits)})
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="stat-section">By day</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Day (UTC)</th>
                <th>Unique visitors</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.byDay.map((row) => (
                <tr key={row.day}>
                  <td>{row.day}</td>
                  <td className="num">{row.visitors}</td>
                  <td className="num">{row.visits}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="stat-section">Landing page</h2>
          <table className="data">
            <thead>
              <tr>
                <th>Page</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {stats.byLanding.map((row) => (
                <tr key={row.page}>
                  <td>{PAGES[row.page] ?? row.page}</td>
                  <td className="num">{row.visits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  )
}
