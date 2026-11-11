'use client'

import { useMember } from '@/shared/lib/slots'
import { openAccount, openAccountCreation } from '@/features/account/lib/account'

export default function LandingAccount() {
  const { member } = useMember()
  if (member !== null) {
    return (
      <button type="button" className="landing-button is-create" onClick={openAccount} data-track="your_account">
        Your account
      </button>
    )
  }

  return (
    <>
      <button
        type="button"
        className="landing-button is-create"
        onClick={openAccountCreation}
        data-track="create_account"
      >
        Create an account
      </button>
      <button type="button" className="landing-login" onClick={openAccount} data-track="member_login">
        Already a member? Login.
      </button>
    </>
  )
}
