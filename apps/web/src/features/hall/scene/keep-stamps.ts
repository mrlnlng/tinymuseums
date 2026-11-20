import { itemIdFor, priceOf } from '@tiny/core/economy'
import { allowedCharacter, owns, walletReady, type OwnedSnapshot } from '../../economy/lib/ownership.ts'
import type { Look } from './character'

/** ready: can be kept now. short: not enough stamps yet. locked: only members keep things. */
export type StampState = 'ready' | 'short' | 'locked'

export interface KeepStamp {
  itemId: string
  part: 'character' | 'costume' | 'bow'
  id: string
  price: number
  state: StampState
  /** How much of the price the purse already holds, 0 to 1. */
  progress: number
}

/** One stamp for each thing the visitor wears but hasn't kept; none until the wallet has loaded. */
export function keepStamps(look: Look, wallet: OwnedSnapshot | null): KeepStamp[] {
  if (!walletReady(wallet)) return []
  const balance = wallet!.balance ?? 0
  const stamps: KeepStamp[] = []
  const add = (part: KeepStamp['part'], id: string) => {
    const itemId = itemIdFor(part, id)
    const price = priceOf(itemId)
    if (price === null) return
    const state: StampState = !wallet!.isMember ? 'locked' : balance >= price ? 'ready' : 'short'
    stamps.push({ itemId, part, id, price, state, progress: price === 0 ? 1 : Math.min(1, balance / price) })
  }
  if (!allowedCharacter(wallet, look.kind)) add('character', look.kind)
  if (look.costume !== null && !owns(wallet, itemIdFor('costume', look.costume))) add('costume', look.costume)
  if (look.bow !== null && !owns(wallet, itemIdFor('bow', look.bow))) add('bow', look.bow)
  return stamps
}
