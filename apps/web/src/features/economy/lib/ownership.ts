import { FREE_CHARACTERS, itemIdFor } from '@tiny/core/economy'

export interface OwnedSnapshot {
  isMember: boolean
  balance: number | null
  items: readonly string[]
}

export function owns(snapshot: OwnedSnapshot | null, itemId: string): boolean {
  return snapshot !== null && snapshot.items.includes(itemId)
}

export function allowedCharacter(snapshot: OwnedSnapshot | null, kind: string): boolean {
  return (
    (FREE_CHARACTERS as readonly string[]).includes(kind) ||
    owns(snapshot, itemIdFor('character', kind))
  )
}

export function walletReady(snapshot: OwnedSnapshot | null): boolean {
  return snapshot !== null && (!snapshot.isMember || snapshot.balance !== null)
}
