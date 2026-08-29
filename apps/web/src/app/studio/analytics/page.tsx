import { analyticsFor } from '@tiny/core'
import { requireArtist } from '@/lib/session'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const artist = await requireArtist()
  const stats = await analyticsFor(artist.id)

  return (
    <>
      <h1 className="script" style={{ fontSize: 38 }}>
        Who came by
      </h1>

      <div className="grid two">
        {[
          ['Wall views', stats.displayViews],
          ['Works looked at', stats.pieceViews],
          ['Enquiries', stats.inquiries],
          ['Followers', stats.followers],
        ].map(([label, value]) => (
          <div key={String(label)} className="plaque-card">
            <div style={{ fontSize: 30, fontWeight: 800 }}>{value}</div>
            <div className="small">{label}</div>
          </div>
        ))}
      </div>

      <h2 style={{ fontSize: 18, marginTop: 28 }}>Scans by placement</h2>
      {stats.scansByPlacement.length === 0 ? (
        <p className="muted">No scans yet. Codes live under Codes.</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Placement</th>
              <th>Scans</th>
            </tr>
          </thead>
          <tbody>
            {stats.scansByPlacement.map((row) => (
              <tr key={row.placement}>
                <td>{row.placement}</td>
                <td className="num">{row.scans}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ fontSize: 18, marginTop: 28 }}>Most looked at</h2>
      {stats.topPieces.length === 0 ? (
        <p className="muted">Nothing yet.</p>
      ) : (
        <table className="data">
          <thead>
            <tr>
              <th>Work</th>
              <th>Views</th>
            </tr>
          </thead>
          <tbody>
            {stats.topPieces.map((row) => (
              <tr key={row.pieceId}>
                <td>{row.title}</td>
                <td className="num">{row.views}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
