import { env, getStorage } from '@tiny/core'

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  tif: 'image/tiff',
}

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params
  const storageKey = key.join('/')

  if (storageKey.includes('..')) {
    return new Response('Not found', { status: 404 })
  }

  const origin = env.mediaOriginUrl
  if (origin) {
    return new Response(null, {
      status: 308,
      headers: {
        location: `${origin.replace(/\/$/, '')}/${storageKey}`,
        'cache-control': CACHE_CONTROL,
      },
    })
  }

  try {
    const { body, size } = await getStorage().getStream(storageKey)
    const extension = storageKey.split('.').pop()?.toLowerCase() ?? ''
    const headers: Record<string, string> = {
      'content-type': CONTENT_TYPES[extension] ?? 'application/octet-stream',
      'cache-control': CACHE_CONTROL,
    }
    if (size !== null) headers['content-length'] = String(size)

    return new Response(body, { headers })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
