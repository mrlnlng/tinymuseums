import { redirect } from 'next/navigation'
import { recordEvent, resolveQrToken } from '@tiny/core'

/* A scanned QR code: resolved, attributed to its placement (what makes "the café poster outperforms the business card" answerable), then redirected to the artist's page. Never cached. */
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
