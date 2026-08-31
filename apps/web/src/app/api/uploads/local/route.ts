import { MAX_UPLOAD_BYTES, getStorage, verifyUploadSignature } from '@tiny/core'

/* The local stand-in for an S3 presigned PUT, so the browser uploads directly in development exactly as it will in production. The signature is not decoration: without it this is an open write endpoint. */
export async function PUT(request: Request) {
  const url = new URL(request.url)
  const key = url.searchParams.get('key') ?? ''
  const contentType = url.searchParams.get('ct') ?? ''
  const expires = Number(url.searchParams.get('exp') ?? 0)
  const signature = url.searchParams.get('sig') ?? ''

  if (!verifyUploadSignature(key, contentType, expires, signature)) {
    return Response.json({ error: 'Expired or invalid upload URL' }, { status: 403 })
  }

  const body = Buffer.from(await request.arrayBuffer())
  if (body.length === 0) return Response.json({ error: 'Empty body' }, { status: 400 })
  if (body.length > MAX_UPLOAD_BYTES) {
    return Response.json({ error: 'Too large' }, { status: 413 })
  }

  await getStorage().put(key, body, contentType)
  return new Response(null, { status: 200 })
}
