'use client'

import { useEffect } from 'react'
import { useMember } from '@/shared/lib/slots'
import { openAccount } from '@/features/account/lib/account'

export default function KeepOnOtherDevices() {
  const { member, refreshMember } = useMember()
  const email = member?.email ?? ''

  useEffect(() => {
    if (member !== null && email === '') void refreshMember()
  }, [member, email, refreshMember])

  const signedIn = member !== null && email !== ''

  return (
    <button type="button" className="keep-other-devices" onClick={openAccount}>
      {signedIn ? `Saved to ${email}` : 'Keep this on other devices'}
    </button>
  )
}
