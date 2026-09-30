import { UploadRejected, hit, presignUpload } from '@tiny/core'
import { currentArtist } from '@/shared/lib/session'

const UPLOADS_PER_ARTIST = { limit: 60, windowSeconds: 60 * 60 }

export async function POST(request: Request) {
  const artist = await currentArtist()
  if (!artist) return Response.json({ error: 'Sign in first' }, { status: 401 })

  const limited = await hit(`presign:artist:${artist.id}`, UPLOADS_PER_ARTIST)
  if (!limited.allowed) {
    return Response.json(
      { error: 'Too many uploads for now. Try again a little later.' },
      { status: 429, headers: { 'retry-after': String(limited.retryAfterSeconds) } },
    )
  }

  let body: { contentType?: string; digest?: string; bytes?: number }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  try {
    const presigned = await presignUpload(
      artist.id,
      String(body.contentType ?? ''),
      String(body.digest ?? ''),
      Number(body.bytes ?? 0),
    )
    return Response.json(presigned)
  } catch (error) {
    if (error instanceof UploadRejected) {
      return Response.json({ error: error.message }, { status: 400 })
    }
    throw error
  }
}
