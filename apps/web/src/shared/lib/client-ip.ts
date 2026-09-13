export function clientIp(headers: Headers): string | null {
  const viewer = headers.get('cloudfront-viewer-address')
  if (viewer) {
    const port = viewer.lastIndexOf(':')
    const ip = port > 0 ? viewer.slice(0, port) : viewer
    return ip.replace(/^\[|\]$/g, '') || null
  }

  // The leftmost entry is client-supplied and can be forged, so limits keyed on it need a global backstop.
  const forwarded = headers.get('x-forwarded-for')
  return forwarded?.split(',')[0]?.trim() || null
}
