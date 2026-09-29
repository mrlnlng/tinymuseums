import { createHash, randomBytes } from 'node:crypto'
import { query, queryOne } from '../infra/db.ts'
import { normalizePage } from './vitals.ts'
import {
  VISIT_LANDMARKS,
  isVisitFeature,
  type VisitFeature,
  type VisitLandmark,
} from '../visit-features.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
const DEVICES = new Set(['mobile', 'desktop'])
const MAX_DURATION_MS = 12 * 60 * 60 * 1000
const MAX_COUNT = 100_000
const MAX_PAINTINGS = 10_000

export interface VisitReport {
  id: string
  page: string
  device: string
  durationMs: number
  interactions: number
  paintings: number
  furthest: VisitLandmark
  features: Partial<Record<VisitFeature, number>>
}

function count(value: unknown, max: number): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return null
  return Math.min(max, Math.floor(value))
}

export function parseVisitReport(body: unknown): VisitReport | null {
  if (!body || typeof body !== 'object') return null
  const report = body as Record<string, unknown>
  if (typeof report.id !== 'string' || !UUID.test(report.id)) return null

  const durationMs = count(report.durationMs, MAX_DURATION_MS)
  const interactions = count(report.interactions, MAX_COUNT)
  const paintings = count(report.paintings, MAX_PAINTINGS)
  if (durationMs === null || interactions === null || paintings === null) return null

  const features: Partial<Record<VisitFeature, number>> = {}
  if (report.features && typeof report.features === 'object') {
    for (const [name, value] of Object.entries(report.features)) {
      const n = count(value, MAX_COUNT)
      if (isVisitFeature(name) && n) features[name] = n
    }
  }

  return {
    id: report.id,
    page: normalizePage(report.page),
    device: DEVICES.has(report.device as string) ? (report.device as string) : 'desktop',
    durationMs,
    interactions,
    paintings,
    furthest: VISIT_LANDMARKS.includes(report.furthest as VisitLandmark)
      ? (report.furthest as VisitLandmark)
      : 'entrance',
    features,
  }
}

// Plausible's scheme: the salt is random, kept only for the day it covers, then deleted,
// so a stored hash can never be traced back to an address once the day is over.
// The period salt works the same way over 90 days, so the range total can recognise a returning visitor.
const SALT_PERIOD_DAYS = 90
const CURRENT_PERIOD = `date '2000-01-01' + ((current_date - date '2000-01-01') / ${SALT_PERIOD_DAYS}) * ${SALT_PERIOD_DAYS}`

interface Salts {
  day: string
  daily: string
  period: string
}

async function loadSalts(): Promise<Salts> {
  // "do update" to the same value makes the insert return the existing salt when one is already there.
  const row = await queryOne<Salts>(
    `with old_daily as (delete from visit_salts where day < current_date - 1),
          old_period as (delete from visit_period_salts where period < ${CURRENT_PERIOD}),
          daily as (
            insert into visit_salts (day, salt) values (current_date, $1)
            on conflict (day) do update set salt = visit_salts.salt
            returning day::text as day, salt
          ),
          period as (
            insert into visit_period_salts (period, salt) values (${CURRENT_PERIOD}, $2)
            on conflict (period) do update set salt = visit_period_salts.salt
            returning salt
          )
     select daily.day, daily.salt as daily, period.salt as period from daily, period`,
    [randomBytes(32).toString('hex'), randomBytes(32).toString('hex')],
  )
  if (!row) throw new Error('No visit salts for today')
  return row
}

let cachedSalts: { utcDay: string; salts: Promise<Salts> } | null = null

// Cached per process for the UTC day; a database whose current_date disagrees is simply asked again.
function currentSalts(): Promise<Salts> {
  const utcDay = new Date().toISOString().slice(0, 10)
  if (cachedSalts?.utcDay !== utcDay) {
    const salts = loadSalts()
    const entry = { utcDay, salts }
    cachedSalts = entry
    salts.then(
      (loaded) => {
        if (loaded.day !== utcDay && cachedSalts === entry) cachedSalts = null
      },
      () => {
        if (cachedSalts === entry) cachedSalts = null
      },
    )
  }
  return cachedSalts!.salts
}

function hash(salt: string, ip: string | null, userAgent: string | null): string {
  return createHash('sha256')
    .update(`${salt}|${ip ?? ''}|${userAgent ?? ''}`)
    .digest('base64url')
    .slice(0, 22)
}

export interface Visitor {
  day: string
  visitor: string
  periodVisitor: string
}

export async function visitorHash(ip: string | null, userAgent: string | null): Promise<Visitor> {
  const { day, daily, period } = await currentSalts()
  return { day, visitor: hash(daily, ip, userAgent), periodVisitor: hash(period, ip, userAgent) }
}

export async function recordVisit(report: VisitReport, who: Visitor): Promise<void> {
  const rank = VISIT_LANDMARKS.indexOf(report.furthest)
  await query(
    `insert into visits (id, day, visitor, page, device, duration_ms, interactions, paintings, furthest_rank, features, period_visitor)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     on conflict (id) do update set
       updated_at    = now(),
       duration_ms   = greatest(visits.duration_ms, excluded.duration_ms),
       interactions  = greatest(visits.interactions, excluded.interactions),
       paintings     = greatest(visits.paintings, excluded.paintings),
       furthest_rank = greatest(visits.furthest_rank, excluded.furthest_rank),
       features      = (
         select coalesce(jsonb_object_agg(key, greatest(
                  coalesce((visits.features ->> key)::int, 0),
                  coalesce((excluded.features ->> key)::int, 0))), '{}'::jsonb)
           from (select jsonb_object_keys(visits.features) as key
                 union
                 select jsonb_object_keys(excluded.features)) keys
       )`,
    [
      report.id,
      who.day,
      who.visitor,
      report.page,
      report.device,
      report.durationMs,
      report.interactions,
      report.paintings,
      rank,
      JSON.stringify(report.features),
      who.periodVisitor,
    ],
  )
}

export interface VisitSummary {
  visitors: number
  visits: number
  medianDurationMs: number | null
  averageDurationMs: number | null
  medianInteractions: number | null
  averageInteractions: number | null
  averagePaintings: number | null
  byDay: Array<{ day: string; visitors: number; visits: number }>
  byLanding: Array<{ page: string; visits: number }>
  reach: Array<{ landmark: VisitLandmark; visits: number }>
  paintings: Array<{ paintings: number; visits: number }>
  features: Array<{ feature: VisitFeature; uses: number; visits: number }>
}

export async function summarizeVisits(days: number): Promise<VisitSummary> {
  const since = `recorded_at > now() - ($1 || ' days')::interval`
  const range = [String(days)]
  const [totals, byDay, byLanding, reach, paintings, features] = await Promise.all([
    queryOne<Omit<VisitSummary, 'byDay' | 'byLanding' | 'reach' | 'paintings' | 'features'>>(
      // Visits recorded before period_visitor existed can only be told apart per day.
      `select count(distinct coalesce(period_visitor, day || '|' || visitor))::int as visitors,
              count(*)::int as visits,
              percentile_cont(0.5) within group (order by duration_ms) as "medianDurationMs",
              avg(duration_ms)::float as "averageDurationMs",
              percentile_cont(0.5) within group (order by interactions) as "medianInteractions",
              avg(interactions)::float as "averageInteractions",
              avg(paintings)::float as "averagePaintings"
         from visits where ${since}`,
      range,
    ),
    query<{ day: string; visitors: number; visits: number }>(
      `select day::text as day, count(distinct visitor)::int as visitors, count(*)::int as visits
         from visits where ${since}
        group by day order by day desc`,
      range,
    ),
    query<{ page: string; visits: number }>(
      `select page, count(*)::int as visits from visits where ${since} group by page order by visits desc`,
      range,
    ),
    query<{ rank: number; visits: number }>(
      `select r.rank, count(v.id)::int as visits
         from generate_series(0, $2) as r(rank)
         left join visits v on v.furthest_rank >= r.rank and v.${since}
        group by r.rank order by r.rank`,
      [...range, VISIT_LANDMARKS.length - 1],
    ),
    query<{ paintings: number; visits: number }>(
      `select paintings, count(*)::int as visits from visits where ${since} group by paintings order by paintings`,
      range,
    ),
    query<{ feature: string; uses: number; visits: number }>(
      `select f.key as feature, sum(f.value::int)::int as uses, count(*)::int as visits
         from visits, jsonb_each_text(features) as f(key, value)
        where ${since}
        group by f.key order by uses desc`,
      range,
    ),
  ])

  return {
    visitors: totals?.visitors ?? 0,
    visits: totals?.visits ?? 0,
    medianDurationMs: totals?.medianDurationMs ?? null,
    averageDurationMs: totals?.averageDurationMs ?? null,
    medianInteractions: totals?.medianInteractions ?? null,
    averageInteractions: totals?.averageInteractions ?? null,
    averagePaintings: totals?.averagePaintings ?? null,
    byDay,
    byLanding,
    reach: reach.map((row) => ({ landmark: VISIT_LANDMARKS[row.rank], visits: row.visits })),
    paintings,
    features: features.filter((row) => isVisitFeature(row.feature)) as VisitSummary['features'],
  }
}
