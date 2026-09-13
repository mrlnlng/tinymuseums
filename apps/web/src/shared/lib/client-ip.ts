/* The visitor's address, as well as it can be known behind Amplify Hosting's CloudFront. Good enough to tell visitors apart for rate limiting, and not to be trusted for anything that matters more: X-Forwarded-For is partly written by the client. */

export function clientIp(request: Request): string | null {
  // Set by CloudFront itself as "ip:port" and not spoofable, but only present
  // when the distribution forwards it — Amplify's managed one may not.
  const viewer = request.headers.get('cloudfront-viewer-address')
  if (viewer) {
    const port = viewer.lastIndexOf(':')
    const ip = port > 0 ? viewer.slice(0, port) : viewer
    return ip.replace(/^\[|\]$/g, '') || null
  }

  // CloudFront appends the address it saw to whatever the client sent, so the
  // leftmost entry can be forged. It is still taken over the rightmost: hops
  // after CloudFront inside Amplify would put an AWS address there, and every
  // visitor would share one bucket. The board-wide limit covers the forgery.
  const forwarded = request.headers.get('x-forwarded-for')
  const first = forwarded?.split(',')[0]?.trim()
  return first || null
}
