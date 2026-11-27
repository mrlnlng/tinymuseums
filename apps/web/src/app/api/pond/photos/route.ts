import { POND_PHOTO_MAX_BYTES, addPondPhoto, hit, listPondPhotos } from '@tiny/core'
import { currentMember, setMemberCookie } from '@/shared/lib/member-session'
import { empty, json, limited, memberMutation } from '@/shared/lib/member-route'

const READS = { limit: 120, windowSeconds: 60 }
const UPLOADS = { limit: 30, windowSeconds: 60 * 60 }

export async function GET() {
  const session = await currentMember()
  if (!session) return json({ error: 'signed_out' }, 401)
  if (session.renewed) await setMemberCookie(session.token, session.expiresAt)

  const rate = await hit(`pond-photos:${session.member.id}`, READS)
  if (!rate.allowed) return limited(rate)

  return json({ photos: await listPondPhotos(session.member.id) })
}

// Streams the JPEG and stops reading once it passes the cap.
async function readCapped(request: Request): Promise<Buffer | null> {
  const declared = request.headers.get('content-length')
  if (declared !== null && Number(declared) > POND_PHOTO_MAX_BYTES) return null
  if (!request.body) return Buffer.alloc(0)
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let total = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.byteLength
    if (total > POND_PHOTO_MAX_BYTES) {
      await reader.cancel()
      return null
    }
    chunks.push(value)
  }
  return Buffer.concat(chunks)
}

export async function POST(request: Request) {
  const guard = await memberMutation(request, false)
  if (!guard.ok) return guard.response
  if ((request.headers.get('content-type') ?? '').split(';')[0].trim() !== 'image/jpeg') return json({ error: 'invalid' }, 415)

  const rate = await hit(`pond-photo-upload:${guard.member.id}`, UPLOADS)
  if (!rate.allowed) return limited(rate)

  const body = await readCapped(request)
  if (body === null) return empty(413)

  const result = await addPondPhoto(guard.member.id, body)
  if (!result.ok) {
    const status = { no_camera: 403, invalid: 400, too_large: 413, album_full: 409 }[result.error]
    return json({ error: result.error }, status)
  }
  return json({ photo: result.photo }, 201)
}
