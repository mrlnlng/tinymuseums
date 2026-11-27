'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { onOpenAccount, type AccountMode } from '@/features/account/lib/account'
import { useSound } from '@/features/sound/components/SoundProvider'

const AccountSheet = dynamic(() => import('@/features/account/components/AccountSheet'), { ssr: false })

export default function AccountHost() {
  const [mode, setMode] = useState<AccountMode | null>(null)
  const { play } = useSound()

  useEffect(
    () =>
      onOpenAccount((next) => {
        setMode(next)
        play('open')
      }),
    [play],
  )

  return mode ? (
    <AccountSheet
      initialMode={mode}
      onClose={() => {
        play('close')
        setMode(null)
      }}
    />
  ) : null
}
