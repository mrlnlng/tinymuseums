import Link from 'next/link'

/** A follow outcome page: a title, a body, and the way back into the museum. */
export default function FollowNotice({ title, body }: { title: string; body: string }) {
  return (
    <main className="page">
      <h1 className="script page-title">{title}</h1>
      <p>{body}</p>
      <Link className="button" href="/">
        Walk the museum
      </Link>
    </main>
  )
}
