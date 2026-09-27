import Link from 'next/link'
import { listBugReports, type BugContext } from '@tiny/core'
import Message from '@/shared/components/Message'
import { requireHallOwner } from '@/shared/lib/session'
import { setBugReportResolvedAction } from '@/features/studio/actions'

export const dynamic = 'force-dynamic'

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })

function summary(context: BugContext): string {
  return [
    context.inApp ? `${context.inApp} in-app browser` : null,
    context.viewport ? `viewport ${context.viewport}` : null,
    context.dpr ? `${context.dpr}x` : null,
    context.touch ? 'touch' : null,
    context.connection,
    context.online === false ? 'offline' : null,
  ]
    .filter(Boolean)
    .join(' · ')
}

export default async function BugReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string; k?: string; show?: string }>
}) {
  const { m, k, show } = await searchParams
  await requireHallOwner()

  const resolved = show === 'fixed'
  const reports = await listBugReports({ resolved })

  return (
    <>
      <h1 className="script page-title">Bug reports</h1>
      <p className="muted lead">
        {resolved ? 'Reports marked fixed, newest first.' : 'Problems visitors have reported, newest first.'}{' '}
        <Link href={resolved ? '/studio/bugs' : '/studio/bugs?show=fixed'}>
          {resolved ? 'Show open' : 'Show fixed'}
        </Link>
      </p>

      <Message m={m} k={k} />

      {reports.length === 0 ? (
        <p className="muted">{resolved ? 'Nothing marked fixed yet.' : 'No open reports.'}</p>
      ) : (
        reports.map((report) => (
          <div key={report.id} className="card guest-note-row">
            <div className="piece-fields">
              <p className="guest-note-meta">
                <strong>{report.page}</strong>{' '}
                <span className="small muted">{dateFormat.format(new Date(report.createdAt))}</span>
                {report.contact ? <span className="small"> · {report.contact}</span> : null}
              </p>
              <p className="guest-note-message flush">{report.message}</p>
              <p className="small muted flush">{summary(report.context)}</p>
              <details className="small">
                <summary>Details</summary>
                <pre className="bug-context">{JSON.stringify(report.context, null, 2)}</pre>
              </details>
            </div>
            <form action={setBugReportResolvedAction}>
              <input type="hidden" name="id" value={report.id} />
              <input type="hidden" name="resolved" value={resolved ? 'false' : 'true'} />
              <button className="button quiet" type="submit">
                {resolved ? 'Reopen' : 'Mark fixed'}
              </button>
            </form>
          </div>
        ))
      )}
    </>
  )
}
