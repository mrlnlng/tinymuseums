import { query, queryOne } from '../infra/db.ts'
import { hit, hitForVisitor, type RateLimit } from '../infra/rate-limit.ts'
import { MAX_BUG_CONTACT, MAX_BUG_ERRORS, MAX_BUG_MESSAGE } from '../bug-report-rules.ts'
import { cleanText } from '../infra/text.ts'

const MAX_PAGE = 300
const MAX_CONTEXT_STRING = 500
const LIST_LIMIT = 200

const PER_VISITOR: RateLimit = { limit: 5, windowSeconds: 60 * 60 }
const EVERYONE: RateLimit = { limit: 100, windowSeconds: 60 * 60 }

const CONTEXT_KEYS = new Set([
  'userAgent',
  'inApp',
  'viewport',
  'screen',
  'dpr',
  'touch',
  'language',
  'connection',
  'online',
  'referrer',
  'errors',
])

export class BugReportRejected extends Error {}

export class BugReportRateLimited extends Error {
  readonly retryAfterSeconds: number

  constructor(retryAfterSeconds: number) {
    super('Thanks — we have plenty from you for now. Try again a little later.')
    this.retryAfterSeconds = retryAfterSeconds
  }
}

export type BugContext = Record<string, string | number | boolean | string[]>

export interface BugReport {
  message: string
  contact: string | null
  page: string
  context: BugContext
}

export interface BugReportDto extends BugReport {
  id: string
  createdAt: string
  resolvedAt: string | null
}

export function parseBugReport(input: unknown): BugReport {
  const body = input && typeof input === 'object' ? (input as Record<string, unknown>) : {}

  const message = cleanText(body.message, { multiline: true })
  if (!message) throw new BugReportRejected('Tell us what went wrong')
  if ([...message].length > MAX_BUG_MESSAGE) {
    throw new BugReportRejected(`Reports can be up to ${MAX_BUG_MESSAGE} characters`)
  }

  const contact = cleanText(body.contact, { multiline: false }).slice(0, MAX_BUG_CONTACT) || null

  return { message, contact, page: normalizeBugPage(body.page), context: parseContext(body.context) }
}

export function normalizeBugPage(page: unknown): string {
  if (typeof page !== 'string' || !page.startsWith('/')) return '/'
  const path = page.split(/[?#]/)[0]!.slice(0, MAX_PAGE)
  return path.startsWith('/q/') ? '/q/[token]' : path
}

function parseContext(value: unknown): BugContext {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  const context: BugContext = {}
  for (const [key, raw] of Object.entries(value)) {
    if (!CONTEXT_KEYS.has(key)) continue
    if (typeof raw === 'string') context[key] = raw.slice(0, MAX_CONTEXT_STRING)
    else if (typeof raw === 'number' && Number.isFinite(raw)) context[key] = raw
    else if (typeof raw === 'boolean') context[key] = raw
    else if (Array.isArray(raw)) {
      context[key] = raw
        .filter((item): item is string => typeof item === 'string')
        .slice(-MAX_BUG_ERRORS)
        .map((item) => item.slice(0, MAX_CONTEXT_STRING))
    }
  }
  return context
}

export async function postBugReport(input: unknown, visitor: { ip: string | null }): Promise<void> {
  const report = parseBugReport(input)

  const mine = await hitForVisitor('bugs', visitor.ip, PER_VISITOR)
  if (!mine.allowed) throw new BugReportRateLimited(mine.retryAfterSeconds)
  const all = await hit('bugs:all', EVERYONE)
  if (!all.allowed) throw new BugReportRateLimited(all.retryAfterSeconds)

  await query(`insert into bug_reports (message, contact, page, context) values ($1, $2, $3, $4)`, [
    report.message,
    report.contact,
    report.page,
    JSON.stringify(report.context),
  ])
}

interface BugRow {
  id: string
  message: string
  contact: string | null
  page: string
  context: BugContext
  created_at: Date
  resolved_at: Date | null
}

export async function listBugReports({ resolved }: { resolved: boolean }): Promise<BugReportDto[]> {
  const rows = await query<BugRow>(
    `select id, message, contact, page, context, created_at, resolved_at
       from bug_reports
      where (resolved_at is null) = $1
      order by created_at desc
      limit $2`,
    [!resolved, LIST_LIMIT],
  )
  return rows.map((row) => ({
    id: row.id,
    message: row.message,
    contact: row.contact,
    page: row.page,
    context: row.context,
    createdAt: row.created_at.toISOString(),
    resolvedAt: row.resolved_at?.toISOString() ?? null,
  }))
}

export async function countOpenBugReports(): Promise<number> {
  const row = await queryOne<{ n: number }>(
    `select count(*)::int as n from bug_reports where resolved_at is null`,
  )
  return row?.n ?? 0
}

export async function setBugReportResolved(id: string, resolved: boolean): Promise<void> {
  if (!/^[0-9a-f-]{36}$/i.test(id)) return
  await query(
    `update bug_reports set resolved_at = case when $2 then coalesce(resolved_at, now()) end where id = $1`,
    [id, resolved],
  )
}
