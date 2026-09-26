import { hitForVisitor, parseVitalsReport, recordVitals } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'

const MAX_BODY_BYTES = 4096
const PER_VISITOR = { limit: 30, windowSeconds: 60 * 60 }

export async function POST(request: Request) {
  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return new Response(null, { status: 413 })

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return new Response(null, { status: 400 })
  }

  const rows = parseVitalsReport(body)
  if (rows.length === 0) return new Response(null, { status: 204 })

  const limited = await hitForVisitor('vitals', clientIp(request.headers), PER_VISITOR)
  if (limited.allowed) await recordVitals(rows)
  return new Response(null, { status: 204 })
}
