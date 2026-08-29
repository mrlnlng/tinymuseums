import { getStorage } from '@tiny/core'

/**
 * Local stand-in for the CloudFront distribution.
 *
 * Objects are content-addressed or version-keyed, so they are immutable and
 * can be cached forever. That is the same header CloudFront will serve, which
 * means the caching behaviour we develop against is the caching behaviour we
 * ship.
 */

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  avif: 'image/avif',
  tif: 'image/tiff',
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string[] }> },
) {
  const { key } = await params
  const storageKey = key.join('/')

  // The storage layer refuses keys that escape the root, but reject the
  // obvious traversal here too rather than relying on one check.
  if (storageKey.includes('..')) {
    return new Response('Not found', { status: 404 })
  }

  try {
    const body = await getStorage().get(storageKey)
    const extension = storageKey.split('.').pop()?.toLowerCase() ?? ''
    return new Response(new Uint8Array(body), {
      headers: {
        'content-type': CONTENT_TYPES[extension] ?? 'application/octet-stream',
        'cache-control': 'public, max-age=31536000, immutable',
        'content-length': String(body.length),
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
