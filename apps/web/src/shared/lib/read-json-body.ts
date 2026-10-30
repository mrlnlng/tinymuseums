export type JsonBody = { ok: true; body: unknown } | { ok: false; error: 'too_large' | 'invalid_json' }

// Streams the body and aborts as soon as the running byte count passes the cap,
// rather than buffering everything and checking the text length afterwards.
export async function readJsonBody(request: Request, maxBytes: number): Promise<JsonBody> {
  const declared = request.headers.get('content-length')
  if (declared !== null && Number(declared) > maxBytes) return { ok: false, error: 'too_large' }

  if (!request.body) return { ok: false, error: 'invalid_json' }
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > maxBytes) {
      await reader.cancel()
      return { ok: false, error: 'too_large' }
    }
    chunks.push(value)
  }

  const decoder = new TextDecoder()
  let text = ''
  for (const chunk of chunks) text += decoder.decode(chunk, { stream: true })
  text += decoder.decode()

  try {
    return { ok: true, body: JSON.parse(text) }
  } catch {
    return { ok: false, error: 'invalid_json' }
  }
}
