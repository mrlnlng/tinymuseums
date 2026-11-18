'use client'

import { useEffect, useState } from 'react'
import { undoAdminUnlock, unlockEverything, useWallet } from '@/features/economy'
import { ADMIN_STAMPS } from '@/shared/lib/admin-mode'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { defaultStore } from '@/shared/lib/slots'

/** Set while a tester has switched admin mode off on this browser, to play as anyone else would. */
const OFF_KEY = 'tm_admin_off'

async function startOverInCloset(): Promise<string> {
  const memberId = defaultStore().getMemberSnapshot()?.id
  const response = await fetch('/api/rooms/closet', {
    method: 'POST',
    headers: memberId ? { 'X-TM-Member': memberId } : {},
  })
  const body = (await response.json().catch(() => null)) as { slug?: unknown } | null
  if (!response.ok || typeof body?.slug !== 'string') throw new Error('closet')
  return body.slug
}

/** Gamma's admin mode: unlocks every room item, wallpaper, costume and character for free. */
export default function AdminTools() {
  const wallet = useWallet()
  const [off, setOff] = useState(false)
  const [state, setState] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const [closet, setCloset] = useState<'idle' | 'confirm' | 'working' | 'error'>('idle')
  const [leaving, setLeaving] = useState<'idle' | 'confirm' | 'working' | 'error'>('idle')

  useEffect(() => {
    setOff(readLocal(OFF_KEY) === '1')
  }, [])

  async function unlock(): Promise<void> {
    setState('working')
    setState((await unlockEverything()) === 'ok' ? 'done' : 'error')
  }

  /** Resets the room to a new closet; asks for a second tap, since the arrangement is lost. */
  async function restartInCloset(): Promise<void> {
    if (closet !== 'confirm') {
      setCloset('confirm')
      return
    }
    setCloset('working')
    try {
      window.location.assign(`/museum/r/${await startOverInCloset()}`)
    } catch {
      setCloset('error')
    }
  }

  /**
   * Back to playing as anyone else would: a new closet (refunding knock-throughs and cleaning), then
   * everything the unlocks gave taken back. Asks for a second tap first.
   */
  async function turnOff(): Promise<void> {
    if (!wallet.isMember) {
      writeLocal(OFF_KEY, '1')
      setOff(true)
      return
    }
    if (leaving !== 'confirm') {
      setLeaving('confirm')
      return
    }
    setLeaving('working')
    try {
      const slug = await startOverInCloset()
      if ((await undoAdminUnlock()) !== 'ok') throw new Error('undo')
      writeLocal(OFF_KEY, '1')
      window.location.assign(`/museum/r/${slug}`)
    } catch {
      setLeaving('error')
    }
  }

  function turnOn(): void {
    writeLocal(OFF_KEY, '0')
    setOff(false)
    setLeaving('idle')
  }

  if (off) {
    return (
      <div className="settings-admin">
        <p className="settings-admin-heading">
          Admin mode <span className="settings-state">off</span>
        </p>
        <button type="button" className="settings-row settings-admin-unlock" onClick={turnOn}>
          Turn admin mode back on
        </button>
        <p className="settings-admin-note">You are playing as anyone else would.</p>
      </div>
    )
  }

  return (
    <div className="settings-admin">
      <p className="settings-admin-heading">
        Admin mode <span className="settings-state">gamma</span>
      </p>
      <button
        type="button"
        className="settings-row settings-admin-unlock"
        onClick={() => void unlock()}
        disabled={!wallet.isMember || state === 'working'}
      >
        {state === 'working' ? 'Unlocking…' : `Unlock everything + ${ADMIN_STAMPS.toLocaleString()} stamps`}
      </button>
      <button
        type="button"
        className={`settings-row settings-admin-unlock${closet === 'confirm' ? ' is-confirming' : ''}`}
        onClick={() => void restartInCloset()}
        disabled={!wallet.isMember || closet === 'working'}
      >
        {closet === 'working'
          ? 'Starting over…'
          : closet === 'confirm'
            ? 'Tap again: your room resets'
            : closet === 'error'
              ? 'That did not work; try again'
              : 'Start over in the closet'}
      </button>
      <button
        type="button"
        className={`settings-row settings-admin-unlock${leaving === 'confirm' ? ' is-confirming' : ''}`}
        onClick={() => void turnOff()}
        disabled={leaving === 'working'}
      >
        {leaving === 'working'
          ? 'Turning off…'
          : leaving === 'confirm'
            ? 'Tap again: unlocks and room reset'
            : leaving === 'error'
              ? 'That did not work; try again'
              : 'Turn off admin mode'}
      </button>
      <p className="settings-admin-note" role="status">
        {leaving === 'confirm'
          ? 'Takes back everything unlocked and the admin stamps, and starts your room over in the closet.'
          : !wallet.isMember
            ? 'Sign in first; everything is added to your account.'
            : state === 'done'
              ? 'Everything is yours. Find it in Decorate and the wardrobe.'
              : state === 'error'
                ? 'That did not work just now.'
                : 'Every room item, wallpaper, costume and character, free. Spend the stamps knocking your room through.'}
      </p>
    </div>
  )
}
