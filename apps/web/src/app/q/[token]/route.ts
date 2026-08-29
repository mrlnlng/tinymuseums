import { redirect } from 'next/navigation'
import { recordEvent, resolveQrToken } from '@tiny/core'

/**
 * A scanned QR code.
 *
 * The token is resolved, the scan is attributed to its placement — this is
 * what makes "the café poster outperforms the business card" answerable — and
 * the visitor is sent to the artist's page. Never cached: the whole point is
 * that every scan is counted.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const resolved = await resolveQrToken(token)

  if (!resolved) redirect('/?from=unknown-code')

  await recordEvent('scan', {
    artistId: resolved.artistId,
    placement: resolved.placement,
  })

  redirect(`/a/${resolved.slug}?from=qr`)
}
