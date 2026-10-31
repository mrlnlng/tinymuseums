import { hitForVisitor, parseVisitReport, recordVisit, visitorHash } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 4096
const PER_VISITOR = { limit: 240, windowSeconds: 60 * 60 }

export async function POST(request: Request) {
  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    if (parsed.error === 'too_large') return new Response(null, { status: 413 })
    return new Response(null, { status: 400 })
  }
  const body = parsed.body

  const report = parseVisitReport(body)
  if (!report) return new Response(null, { status: 400 })

  const ip = clientIp(request.headers)
  const limited = await hitForVisitor('visit', ip, PER_VISITOR)
  if (!limited.allowed) return new Response(null, { status: 204 })

  await recordVisit(report, await visitorHash(ip, request.headers.get('user-agent')))
  return new Response(null, { status: 204 })
}
