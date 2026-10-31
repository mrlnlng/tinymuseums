import { BugReportRateLimited, BugReportRejected, postBugReport } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'
import { rateLimitedResponse, rejectedResponse } from '@/shared/lib/domain-error'
import { readJsonBody } from '@/shared/lib/read-json-body'

const MAX_BODY_BYTES = 16_384

export async function POST(request: Request) {
  const parsed = await readJsonBody(request, MAX_BODY_BYTES)
  if (!parsed.ok) {
    if (parsed.error === 'too_large') return Response.json({ error: 'That report is too long' }, { status: 413 })
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const body = parsed.body

  try {
    await postBugReport(body, { ip: clientIp(request.headers) })
    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof BugReportRejected) {
      return rejectedResponse(error)
    }
    if (error instanceof BugReportRateLimited) {
      return rateLimitedResponse(error)
    }
    throw error
  }
}
