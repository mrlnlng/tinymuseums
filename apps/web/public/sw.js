// To retire this worker, replace this file with one that calls
// self.registration.unregister() in its activate handler, then deploy.
const VERSION = 'v1'
const STATIC_CACHE = `tm-static-${VERSION}`
const ASSET_CACHE = `tm-assets-${VERSION}`
const MEDIA_CACHE = `tm-media-${VERSION}`
const MEDIA_LIMIT = 80

// Versioned, never-rewritten media paths; they are safe to serve from cache forever.
const MEDIA_PATH = /\/(pieces\/[^/]+\/(frame|sketch)\/v\d+\.\w+|artists\/[^/]+\/derivatives\/[^/]+\/w\d+\.\w+)$/

self.addEventListener('install', () => self.skipWaiting())

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const current = new Set([STATIC_CACHE, ASSET_CACHE, MEDIA_CACHE])
      for (const key of await caches.keys()) {
        if (key.startsWith('tm-') && !current.has(key)) await caches.delete(key)
      }
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET' || request.headers.has('range')) return

  const url = new URL(request.url)
  const sameOrigin = url.origin === self.location.origin

  if (sameOrigin && url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (sameOrigin && (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/fonts/'))) {
    event.respondWith(staleWhileRevalidate(event, ASSET_CACHE))
  } else if (MEDIA_PATH.test(url.pathname)) {
    event.respondWith(cacheFirst(request, MEDIA_CACHE, MEDIA_LIMIT))
  }
})

function cacheable(response) {
  return response.ok && (response.type === 'basic' || response.type === 'cors')
}

async function cacheFirst(request, cacheName, limit) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  if (cached) return cached

  const response = await fetch(request)
  if (cacheable(response)) {
    await cache.put(request, response.clone())
    if (limit) await trim(cache, limit)
  }
  return response
}

async function staleWhileRevalidate(event, cacheName) {
  const { request } = event
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  const refresh = fetch(request)
    .then(async (response) => {
      if (cacheable(response)) await cache.put(request, response.clone())
      return response
    })
    .catch(() => cached)
  if (!cached) return refresh
  event.waitUntil(refresh)
  return cached
}

async function trim(cache, limit) {
  const keys = await cache.keys()
  for (const key of keys.slice(0, Math.max(0, keys.length - limit))) await cache.delete(key)
}
