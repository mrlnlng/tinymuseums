'use client'

import { useModalFocus } from '@/shared/hooks/useModalFocus'
import { useEffect, useRef, useState } from 'react'
import { useMember } from '@/shared/lib/slots'

type Mode = 'sign-in' | 'create'
type View = 'menu' | 'password' | 'delete'

type Pending = { action: 'sign-out' } | { action: 'delete'; password: string }

const FAILED = "Couldn't do that — try again in a moment."
const PASSWORD_FAILED = "That didn't work — check the current password, and make the new one 8–72 characters."
const DELETE_FAILED = "That password doesn't match."
const DIRTY_WARNING = "Some of your saved things haven't reached the server yet — continuing would lose them."

export default function AccountSheet({ onClose }: { onClose: () => void }) {
  const dialogRef = useModalFocus()
  const { member, refreshMember, signUp, signIn, changePassword, signOut, deleteAccount } = useMember()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [view, setView] = useState<View>('menu')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [pending, setPending] = useState<Pending | null>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    emailRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (member !== null) void refreshMember()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (member === null) {
      setMode('sign-in')
      setView('menu')
      setPending(null)
      setError(null)
      setNotice(null)
    }
  }, [member])

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      if (mode === 'create') {
        const result = await signUp(email, password)
        if (result === null) {
          setPassword('')
        } else {
          setError(
            result === 'email_taken'
              ? 'That email already has an account — sign in instead.'
              : 'Use a real email and a password of 8–72 characters.',
          )
        }
      } else {
        const ok = await signIn(email, password)
        if (ok) setPassword('')
        else setError("That email and password don't match.")
      }
    } catch {
      setError(FAILED)
    } finally {
      setBusy(false)
    }
  }

  async function submitPassword(event: React.FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const ok = await changePassword(current, next)
      if (ok) {
        setView('menu')
        setCurrent('')
        setNext('')
        setNotice('Password changed.')
      } else {
        setError(PASSWORD_FAILED)
      }
    } catch {
      setError(FAILED)
    } finally {
      setBusy(false)
    }
  }

  async function doSignOut(force: boolean) {
    setBusy(true)
    setError(null)
    try {
      const result = await signOut({ force })
      if (result === 'dirty') setPending({ action: 'sign-out' })
    } catch {
      setError(FAILED)
    } finally {
      setBusy(false)
    }
  }

  async function runDelete(passwordValue: string, force: boolean) {
    setBusy(true)
    setError(null)
    try {
      const result = await deleteAccount(passwordValue, { force })
      if (result === 'dirty') {
        setPending({ action: 'delete', password: passwordValue })
      } else if (result === true) {
        setDeletePassword('')
      } else {
        setError(DELETE_FAILED)
      }
    } catch {
      setError(FAILED)
    } finally {
      setBusy(false)
    }
  }

  function submitDelete(event: React.FormEvent) {
    event.preventDefault()
    void runDelete(deletePassword, false)
  }

  function continueAnyway() {
    const p = pending
    if (p === null) return
    setPending(null)
    setError(null)
    if (p.action === 'sign-out') void doSignOut(true)
    else void runDelete(p.password, true)
  }

  return (
    <div ref={dialogRef} className="bug-report" role="dialog" aria-modal="true" aria-labelledby="account-title">
      <button type="button" className="bug-report-scrim" onClick={onClose} aria-label="Close" />

      {member === null ? (
        <form className="bug-report-card" onSubmit={submit}>
          <h2 id="account-title" className="script bug-report-title">
            {mode === 'create' ? 'Create account' : 'Sign in'}
          </h2>

          <input
            ref={emailRef}
            className="bug-report-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            aria-label="Email"
            required
          />
          <input
            className="bug-report-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === 'create' ? 'new-password' : 'current-password'}
            aria-label="Password"
            required
          />

          {mode === 'create' ? (
            <>
              <p className="bug-report-note">
                There&apos;s no password reset yet — if you forget it, this account can&apos;t be
                recovered.
              </p>
              <p className="bug-report-note">
                Your email and the things you save here. Nothing about where you walk.
              </p>
            </>
          ) : null}

          {error ? (
            <p className="bug-report-error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="bug-report-actions">
            <button type="button" className="button quiet" onClick={onClose}>
              Close
            </button>
            <button type="submit" className="button" disabled={busy}>
              {mode === 'create' ? 'Create account' : 'Sign in'}
            </button>
          </div>

          <button
            type="button"
            className="account-switch"
            onClick={() => {
              setMode(mode === 'create' ? 'sign-in' : 'create')
              setError(null)
            }}
          >
            {mode === 'create' ? 'Have an account? Sign in' : 'New here? Create account'}
          </button>
        </form>
      ) : pending !== null ? (
        <div className="bug-report-card">
          <h2 id="account-title" className="script bug-report-title">
            Not saved yet
          </h2>
          <p className="bug-report-note">{DIRTY_WARNING}</p>
          <div className="bug-report-actions">
            <button
              type="button"
              className="button quiet"
              disabled={busy}
              onClick={() => setPending(null)}
            >
              Cancel
            </button>
            <button type="button" className="button" disabled={busy} onClick={continueAnyway}>
              Continue anyway
            </button>
          </div>
        </div>
      ) : (
        <div className="bug-report-card">
          <h2 id="account-title" className="script bug-report-title">
            Your account
          </h2>

          {member.email !== '' ? <p className="account-email">{member.email}</p> : null}
          {notice ? <p className="bug-report-note">{notice}</p> : null}
          {error ? (
            <p className="bug-report-error" role="alert">
              {error}
            </p>
          ) : null}

          {view === 'menu' ? (
            <div className="account-actions">
              <button
                type="button"
                className="button quiet"
                disabled={busy}
                onClick={() => {
                  setView('password')
                  setError(null)
                }}
              >
                Change password
              </button>
              <button
                type="button"
                className="button quiet"
                disabled={busy}
                onClick={() => void doSignOut(false)}
              >
                Sign out
              </button>
              <button
                type="button"
                className="button quiet account-danger"
                disabled={busy}
                onClick={() => {
                  setView('delete')
                  setError(null)
                }}
              >
                Delete account
              </button>
              <button type="button" className="account-switch" onClick={onClose}>
                Close
              </button>
            </div>
          ) : view === 'password' ? (
            <form onSubmit={submitPassword}>
              <input
                className="bug-report-input"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="Current password"
                autoComplete="current-password"
                aria-label="Current password"
                required
              />
              <input
                className="bug-report-input"
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                placeholder="New password"
                autoComplete="new-password"
                aria-label="New password"
                required
              />
              <div className="bug-report-actions">
                <button
                  type="button"
                  className="button quiet"
                  disabled={busy}
                  onClick={() => {
                    setView('menu')
                    setError(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="button" disabled={busy}>
                  Save
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={submitDelete}>
              <p className="bug-report-note">
                This deletes your account and everything saved to it, for good.
              </p>
              <input
                className="bug-report-input"
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your password"
                autoComplete="current-password"
                aria-label="Your password"
                required
              />
              <div className="bug-report-actions">
                <button
                  type="button"
                  className="button quiet"
                  disabled={busy}
                  onClick={() => {
                    setView('menu')
                    setError(null)
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="button quiet account-danger" disabled={busy}>
                  Delete account
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
