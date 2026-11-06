'use client'

import Link from 'next/link'
import { openAccount } from '@/features/account/lib/account'

export default function HomeSignIn() {
  return (
    <main className="personal-home">
      <div className="personal-home-card">
        <p className="personal-home-kicker">Tiny Museum</p>
        <h1 className="personal-home-title">Sign in to get your own room</h1>
        <p className="personal-home-copy">
          Your room is a cozy corner of the museum for the things you collect. Sign in or make an account to open it.
        </p>
        <div className="personal-home-actions">
          <button type="button" className="button" onClick={openAccount}>
            Open account
          </button>
          <Link className="personal-home-back" href="/museum">
            Back to the museum
          </Link>
        </div>
      </div>
    </main>
  )
}
