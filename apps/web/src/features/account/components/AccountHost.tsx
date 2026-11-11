'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { onOpenAccount, type AccountMode } from '@/features/account/lib/account'

const AccountSheet = dynamic(() => import('@/features/account/components/AccountSheet'), { ssr: false })

export default function AccountHost() {
  const [mode, setMode] = useState<AccountMode | null>(null)

  useEffect(() => onOpenAccount(setMode), [])

  return mode ? <AccountSheet initialMode={mode} onClose={() => setMode(null)} /> : null
}
