'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { openAccount } from '@/features/account/lib/account'
import { defaultStore } from '@/shared/lib/slots'

interface RoomNoticeProps {
  variant?: 'home' | 'private'
  isSignedIn?: boolean
}

const COPY = {
  home: {
    title: 'Sign in to get your own room',
    body: 'Your room is a cozy corner of the museum for the things you collect. Sign in or make an account to open it.',
  },
  private: {
    title: 'This room is private',
    body: 'Its owner keeps it to themselves for now. If they shared a link with you, open that link to visit.',
  },
}

export default function HomeSignIn({ variant = 'home', isSignedIn = false }: RoomNoticeProps) {
  const copy = COPY[variant]
  const router = useRouter()

  // This page is decided on the server; once the visitor signs in, ask it again so it can open their room.
  useEffect(() => {
    if (isSignedIn) return
    const store = defaultStore()
    let refreshed = false
    const check = () => {
      if (refreshed || !store.getMemberSnapshot()) return
      refreshed = true
      router.refresh()
    }
    check()
    return store.subscribeMember(check)
  }, [isSignedIn, router])

  return (
    <main className="personal-home">
      <div className="personal-home-card">
        <p className="personal-home-kicker">Tiny Museum</p>
        <h1 className="personal-home-title">{copy.title}</h1>
        <p className="personal-home-copy">{copy.body}</p>
        <div className="personal-home-actions">
          {isSignedIn ? (
            <Link className="button" href="/museum/home">
              Go to my room
            </Link>
          ) : (
            <button type="button" className="button" onClick={openAccount}>
              {variant === 'private' ? 'Sign in' : 'Open account'}
            </button>
          )}
          <Link className="personal-home-back" href="/museum">
            Back to the museum
          </Link>
        </div>
      </div>
    </main>
  )
}
