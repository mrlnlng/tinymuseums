// WebGL and canvas pixel reads refuse a cross-origin image served without CORS
// headers; the app serves the same object from its own origin, where CORS does
// not apply.
export function sameOriginUrl(url: string): string | null {
  try {
    const parsed = new URL(url, window.location.href)
    if (parsed.origin === window.location.origin) return null
    return `/api/media${parsed.pathname}`
  } catch {
    return null
  }
}
