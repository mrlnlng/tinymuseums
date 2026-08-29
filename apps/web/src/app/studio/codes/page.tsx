import { env, listQrTokens } from '@tiny/core'
import Message from '@/components/Message'
import { requireArtist } from '@/lib/session'
import { createCodeAction } from '../actions'

export const dynamic = 'force-dynamic'

export default async function CodesPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string }>
}) {
  const { m, k } = await searchParams
  const artist = await requireArtist()
  const codes = await listQrTokens(artist.id)

  return (
    <>
      <h1 className="script" style={{ fontSize: 38 }}>
        Your codes
      </h1>
      <p className="muted">
        Make a separate code for each place you put one. That is the only way to find out
        whether the café poster does better than the business card.
      </p>

      <Message m={m} k={k} />

      <form action={createCodeAction} className="card">
        <div className="field">
          <label htmlFor="placement">Where is this one going?</label>
          <input id="placement" name="placement" placeholder="café poster" required />
        </div>
        <button className="button" type="submit">
          Make a code
        </button>
      </form>

      {codes.length === 0 ? (
        <p className="muted">No codes yet.</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Placement</th>
              <th>Link</th>
              <th>Scans</th>
            </tr>
          </thead>
          <tbody>
            {codes.map((code) => (
              <tr key={code.token}>
                <td>{code.placement}</td>
                <td>
                  <code className="token">
                    {env.publicBaseUrl}/q/{code.token}
                  </code>
                </td>
                <td className="num">{code.scans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="small muted">
        Turn a link into a QR code with whatever generator you like — the link is the part
        that matters, and it keeps working even if you rearrange your wall.
      </p>
    </>
  )
}
