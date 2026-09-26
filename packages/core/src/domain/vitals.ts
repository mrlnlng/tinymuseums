import { query } from '../infra/db.ts'

const METRICS = new Set(['TTFB', 'FCP', 'LCP', 'CLS', 'INP', 'first_painting'])
const RATINGS = new Set(['good', 'needs-improvement', 'poor'])
const DEVICES = new Set(['mobile', 'desktop'])
const MAX_METRICS = 10
const MAX_VALUE_MS = 120_000
const MAX_CLS = 10
const RETENTION_DAYS = 30
const PRUNE_CHANCE = 0.01

export interface VitalRow {
  page: string
  metric: string
  value: number
  rating: string | null
  device: string
  connection: string | null
}

export function normalizePage(path: unknown): string {
  if (typeof path !== 'string') return 'other'
  if (path === '/' || path === '/museum') return path
  if (path.startsWith('/a/')) return '/a/[slug]'
  if (path.startsWith('/studio')) return '/studio'
  return 'other'
}

export function parseVitalsReport(body: unknown): VitalRow[] {
  if (!body || typeof body !== 'object') return []
  const report = body as Record<string, unknown>
  if (!Array.isArray(report.metrics)) return []

  const page = normalizePage(report.page)
  const device = DEVICES.has(report.device as string) ? (report.device as string) : 'desktop'
  const connection =
    typeof report.connection === 'string' && /^[a-z0-9-]{1,12}$/.test(report.connection)
      ? report.connection
      : null

  const rows: VitalRow[] = []
  for (const entry of report.metrics.slice(0, MAX_METRICS)) {
    if (!entry || typeof entry !== 'object') continue
    const { name, value, rating } = entry as Record<string, unknown>
    if (typeof name !== 'string' || !METRICS.has(name)) continue
    const max = name === 'CLS' ? MAX_CLS : MAX_VALUE_MS
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > max) continue
    rows.push({
      page,
      metric: name,
      value,
      rating: RATINGS.has(rating as string) ? (rating as string) : null,
      device,
      connection,
    })
  }
  return rows
}

export async function recordVitals(rows: VitalRow[]): Promise<void> {
  if (rows.length === 0) return

  const values: unknown[] = []
  const tuples = rows.map((row, i) => {
    values.push(row.page, row.metric, row.value, row.rating, row.device, row.connection)
    const o = i * 6
    return `($${o + 1}, $${o + 2}, $${o + 3}, $${o + 4}, $${o + 5}, $${o + 6})`
  })
  await query(
    `insert into vitals (page, metric, value, rating, device, connection) values ${tuples.join(', ')}`,
    values,
  )

  if (Math.random() < PRUNE_CHANCE) {
    await query(`delete from vitals where recorded_at < now() - ($1 || ' days')::interval`, [
      String(RETENTION_DAYS),
    ])
  }
}

export interface VitalSummary {
  page: string
  metric: string
  device: string
  samples: number
  p50: number
  p75: number
  goodShare: number | null
}

export async function summarizeVitals(days: number): Promise<VitalSummary[]> {
  return query<VitalSummary>(
    `select page, metric, device,
            count(*)::int as samples,
            percentile_cont(0.5)  within group (order by value) as p50,
            percentile_cont(0.75) within group (order by value) as p75,
            (count(*) filter (where rating = 'good'))::float / nullif(count(rating), 0) as "goodShare"
       from vitals
      where recorded_at > now() - ($1 || ' days')::interval
      group by page, metric, device
      order by page, metric, device`,
    [String(days)],
  )
}
