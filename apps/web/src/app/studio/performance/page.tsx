import Link from 'next/link'
import { summarizeVitals, type VitalSummary } from '@tiny/core'
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
  '/a/[slug]': 'Artist walls',
  '/studio': 'Studio',
  other: 'Other',
}

// Google's published good / poor boundaries for each Core Web Vital.
// Google's published good / poor boundaries for each Core Web Vital.
const METRICS: { name: string; label: string; short?: string; good?: number; poor?: number }[] = [
  { name: 'first_painting', label: 'First painting' },
  { name: 'LCP', label: 'Largest paint', short: 'LCP', good: 2500, poor: 4000 },
  { name: 'FCP', label: 'First paint', short: 'FCP', good: 1800, poor: 3000 },
  { name: 'INP', label: 'Tap response', short: 'INP', good: 200, poor: 500 },
  { name: 'CLS', label: 'Layout shift', short: 'CLS', good: 0.1, poor: 0.25 },
  { name: 'TTFB', label: 'Server response', short: 'TTFB', good: 800, poor: 1800 },
]

function format(metric: string, value: number): string {
  if (metric === 'CLS') return value.toFixed(3)
  return value < 1000 ? `${Math.round(value)} ms` : `${(value / 1000).toFixed(2)} s`
}

function grade(metric: (typeof METRICS)[number], value: number): string | undefined {
  if (metric.good === undefined || metric.poor === undefined) return undefined
  if (value <= metric.good) return 'vital-good'
  return value > metric.poor ? 'vital-poor' : 'vital-fair'
}

export default async function PerformancePage({
  searchParams,
}: {
  searchParams: Promise<{ days?: string }>
}) {
  await requireHallOwner()
  const { days: daysParam } = await searchParams
  const days = RANGES.find((range) => String(range.days) === daysParam)?.days ?? 7
  const rows = await summarizeVitals(days)

  const byPage = new Map<string, VitalSummary[]>()
  for (const row of rows) byPage.set(row.page, [...(byPage.get(row.page) ?? []), row])

  return (
    <>
      <h1 className="script page-title">Performance</h1>
      <p className="muted lead">
        Measured on real visits, one in four sampled. p75 is the figure Google grades pages on.
      </p>

      <p className="small">
        {RANGES.map((range, i) => (
          <span key={range.days}>
            {i > 0 ? ' · ' : null}
            {range.days === days ? (
              <strong>{range.label}</strong>
            ) : (
              <Link href={`/studio/performance?days=${range.days}`}>{range.label}</Link>
            )}
          </span>
        ))}
      </p>

      {byPage.size === 0 ? <p className="muted">No visits measured in this period yet.</p> : null}

      {[...byPage].map(([page, pageRows]) => (
        <section key={page}>
          <h2 className="stat-section">{PAGES[page] ?? page}</h2>
          <table className="data vitals">
            <thead>
              <tr>
                <th>Metric</th>
                <th>Device</th>
                <th>p50</th>
                <th>p75</th>
                <th>Good</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {METRICS.flatMap((metric) => {
                const metricRows = pageRows.filter((row) => row.metric === metric.name)
                return metricRows.map((row, i) => (
                  <tr key={`${row.metric}-${row.device}`}>
                    {i === 0 ? (
                      <td rowSpan={metricRows.length}>
                        {metric.label}
                        {metric.short ? <span className="vitals-short">{metric.short}</span> : null}
                      </td>
                    ) : null}
                    <td>{row.device === 'mobile' ? 'Phone' : 'Desktop'}</td>
                    <td className={`num ${grade(metric, row.p50) ?? ''}`}>{format(row.metric, row.p50)}</td>
                    <td className={`num ${grade(metric, row.p75) ?? ''}`}>{format(row.metric, row.p75)}</td>
                    <td className="num">
                      {row.goodShare === null ? '—' : `${Math.round(row.goodShare * 100)}%`}
                    </td>
                    <td className="num">{row.samples}</td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </section>
      ))}
    </>
  )
}
