import { BugReportRateLimited, BugReportRejected, postBugReport } from '@tiny/core'
import { clientIp } from '@/shared/lib/client-ip'

const MAX_BODY_BYTES = 16_384

export async function POST(request: Request) {
  const text = await request.text()
  if (text.length > MAX_BODY_BYTES) return Response.json({ error: 'That report is too long' }, { status: 413 })

  let body: unknown
  try {
    body = JSON.parse(text)
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    await postBugReport(body, { ip: clientIp(request.headers) })
    return new Response(null, { status: 204 })
  } catch (error) {
    if (error instanceof BugReportRejected) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    if (error instanceof BugReportRateLimited) {
      return Response.json(
        { error: error.message },
        { status: 429, headers: { 'retry-after': String(error.retryAfterSeconds) } },
      )
    }
    throw error
  }
}
