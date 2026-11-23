'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOutAction } from '@/features/studio/actions'

const ICONS = {
  home: <><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>,
  hang: <><rect x="5" y="7" width="14" height="13" rx="1" /><path d="M9 7l3-4 3 4" /></>,
  door: <><path d="M6 21V5a6 6 0 0112 0v16" /><path d="M4 21h16" /><circle cx="14.5" cy="13" r=".8" /></>,
  paint: <><path d="M4 20l4-1 11-11-3-3L5 16z" /><path d="M14 6l3 3" /></>,
}

function Icon({ name }: { name: keyof typeof ICONS }) {
  return (
    <svg className="st-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  )
}

function Badge({ count }: { count: number }) {
  return count > 0 ? <span className="st-badge" aria-label={`${count} waiting`}>{count}</span> : null
}

export default function StudioNav({ waiting, openBugs }: { waiting: { hang: number; doors: number }; openBugs: number }) {
  const path = usePathname()
  const current = (href: string) => (href === '/studio' ? path === href : path.startsWith(href)) ? 'page' : undefined
  const main: [string, keyof typeof ICONS, string, number][] = [
    ['/studio', 'home', 'Overview', 0],
    ['/studio/hang', 'hang', 'Hang paintings', waiting.hang],
    ['/studio/doors', 'door', 'Doors', waiting.doors],
    ['/studio/paintings', 'paint', 'Paintings', 0],
  ]
  const minor: [string, string, number][] = [
    ['/studio/visits', 'Visits', 0],
    ['/studio/analytics', 'Visitors', 0],
    ['/studio/guestboard', 'Guest board', 0],
    ['/studio/bugs', 'Bug reports', openBugs],
    ['/studio/performance', 'Performance', 0],
  ]
  return (
    <nav className="st-side" aria-label="Studio">
      <Link className="st-brand" href="/studio">Tiny Museum<br />Studio</Link>
      {main.map(([href, icon, label, count]) => (
        <Link key={href} href={href} aria-current={current(href)}><Icon name={icon} />{label}<Badge count={count} /></Link>
      ))}
      <div className="st-sep" />
      {minor.map(([href, label, count]) => (
        <Link key={href} className="st-minor" href={href} aria-current={current(href)}>{label}<Badge count={count} /></Link>
      ))}
      <a className="st-minor" href="/museum">Open the museum ↗</a>
      <form action={signOutAction}>
        <button type="submit" className="st-link">Sign out</button>
      </form>
    </nav>
  )
}
