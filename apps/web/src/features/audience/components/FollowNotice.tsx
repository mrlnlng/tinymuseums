import Link from 'next/link'

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
