import { hitForVisitor, parseVitalsReport, recordVitals } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 4096
const PER_VISITOR = { limit: 30, windowSeconds: 60 * 60 }

export async function POST(request: Request) {
  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    if (parsed.error === 'too_large') return new Response(null, { status: 413 })
    return new Response(null, { status: 400 })
  }
  const body = parsed.body

  const rows = parseVitalsReport(body)
  if (rows.length === 0) return new Response(null, { status: 204 })

  const limited = await hitForVisitor('vitals', clientIp(request.headers), PER_VISITOR)
  if (limited.allowed) await recordVitals(rows)
  return new Response(null, { status: 204 })
}
