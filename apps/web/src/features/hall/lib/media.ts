// WebGL and canvas pixel reads refuse a cross-origin image served without CORS
// headers; the app serves the same object from its own origin, where CORS does
// not apply.
export function sameOriginUrl(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.origin === window.location.origin) return null
    // A media URL on another address of this same app already carries the /api/media prefix.
    return parsed.pathname.startsWith('/api/media/') ? parsed.pathname : `/api/media${parsed.pathname}`
  } catch {
    return null
  }
}
