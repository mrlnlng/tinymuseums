'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { onOpenAccount } from '@/features/account/lib/account'

const AccountSheet = dynamic(() => import('@/features/account/components/AccountSheet'), { ssr: false })

export default function AccountHost() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => onOpenAccount(() => setIsOpen(true)), [])

  return isOpen ? <AccountSheet onClose={() => setIsOpen(false)} /> : null
}
