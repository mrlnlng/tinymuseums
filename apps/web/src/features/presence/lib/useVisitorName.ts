'use client'

import { useCallback, useEffect, useState } from 'react'
import { nameFromSeed, randomSeed, type NameCheck } from '@tiny/core/presence'
import { presence } from '@tiny/core/slots'
import { useMember, useSlot } from '@/shared/lib/slots'
import { announceNameChange } from './room-events'

export type NameError = Extract<NameCheck, { ok: false }>['reason'] | 'failed'

export interface VisitorName {
  /** Null while loading. */
  name: string | null
  chosen: boolean
  /** Members only: null on success. */
  choose(name: string): Promise<NameError | null>
  reroll(): Promise<NameError | null>
}

/** The name other visitors see: a member's own, else this device's generated one. */
export function useVisitorName(): VisitorName {
  const { member } = useMember()
  const [prefs, updatePrefs] = useSlot(presence)
  const [memberName, setMemberName] = useState<{ id: string; name: string | null; chosen: boolean } | null>(null)
  const seed = prefs.seed

  useEffect(() => {
    if (seed === null) updatePrefs((current) => ({ ...current, seed: randomSeed() }))
  }, [seed, updatePrefs])

  const send = useCallback(
    async (memberId: string, body: object): Promise<NameError | null> => {
      try {
        const res = await fetch('/api/me/name', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'X-TM-Member': memberId },
          body: JSON.stringify(body),
        })
        const data = (await res.json()) as { name?: string | null; chosen?: boolean; error?: string }
        if (!res.ok || data.name === undefined) return (data.error as NameError | undefined) ?? 'failed'
        setMemberName({ id: memberId, name: data.name, chosen: data.chosen === true })
        return null
      } catch {
        return 'failed'
      }
    },
    [],
  )

  const memberId = member?.id ?? null
  useEffect(() => {
    if (memberId !== null && seed !== null) void send(memberId, { device: seed })
  }, [memberId, seed, send])

  if (memberId === null) {
    return {
      name: seed === null ? null : nameFromSeed(seed),
      chosen: false,
      choose: async () => 'failed',
      reroll: async () => 'failed',
    }
  }
  const current = memberName?.id === memberId ? memberName : null
  return {
    name: current?.name ?? null,
    chosen: current?.chosen ?? false,
    choose: async (name) => {
      const failed = await send(memberId, { name })
      if (!failed) announceNameChange()
      return failed
    },
    reroll: async () => {
      const failed = await send(memberId, { seed: randomSeed() })
      if (!failed) announceNameChange()
      return failed
    },
  }
}
