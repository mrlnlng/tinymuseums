export function rejectedResponse(error: { message: string }): Response {
  return Response.json({ error: error.message }, { status: 400 })
}

export function rateLimitedResponse(error: { message: string; retryAfterSeconds: number }): Response {
  return Response.json(
    { error: error.message },
    { status: 429, headers: { 'retry-after': String(error.retryAfterSeconds) } },
  )
}
