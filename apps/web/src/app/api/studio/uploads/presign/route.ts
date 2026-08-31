import { UploadRejected, presignUpload } from '@tiny/core'
import { currentArtist } from '@/shared/lib/session'

/* Step one of an upload: hand the browser somewhere to PUT the file. The key derives from the session, never the request, so a signed URL writes only inside the caller's namespace. */
export async function POST(request: Request) {
  const artist = await currentArtist()
  if (!artist) return Response.json({ error: 'Sign in first' }, { status: 401 })

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
