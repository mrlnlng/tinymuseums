'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useWallet } from '@/features/economy'
import { useSound } from '@/features/sound/components/SoundProvider'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { PondIcon } from '@/features/pondroom/lib/icons'
import { setPondState as publishPondState } from '@/features/pondroom/lib/pond-state'
import { usePondState } from '@/features/pondroom/lib/use-pond-state'
import {
  buyPondBait,
  castPond,
  chainPondBait,
  fetchPondState,
  reelPond,
  type PondWagerView,
} from '../lib/api.ts'
import {
  debugTokens,
  debugVisuals,
  guestTreasure,
  rollGuest,
  type CatchView,
  type GuestRoll,
} from '../lib/guest.ts'
import {
  armCast,
  createFishingState,
  releaseCast,
  startCharge,
  stepReeling,
  SWEET_HIGH,
  SWEET_LOW,
  tap,
  tick,
  tickCharge,
  type FishingState,
  type LostReason,
} from '../lib/machine.ts'
import { missWagerLabel } from '../lib/risk.ts'
import { createPondSfx } from '../lib/sfx.ts'
import { BAIT_BY_ID, type BaitId, type FishId, type FishTier } from '../lib/tables.ts'
import BaitTray from './BaitTray'
import Hud from './Hud'
import ReelMeter from './ReelMeter'
import RevealCard from './RevealCard'
import WagerPicker from './WagerPicker'
import Water from './Water'

export interface PondGameProps {
  onClose: () => void
  spotUnavailable?: boolean
  onCatch?: (species: FishId) => void
}

interface Toast {
  message: string
  note?: string
}

const LOST: Record<Exclude<LostReason, null>, Toast> = {
  spooked: { message: 'Too early — it got spooked', note: 'Tap only when the bobber plunges.' },
  missed: { message: 'It got away', note: 'You missed the hook window.' },
  snap: { message: 'Snap! The line broke', note: 'Ease off when a run starts.' },
  escaped: { message: 'It got away', note: 'Keep some line in hand.' },
}

const CAST_ERRORS: Record<string, string> = {
  no_bait: 'You’re out of that bait.',
  insufficient: 'Not enough pearls for that.',
  wager_cap: 'That wager is over today’s cap.',
  no_chain: 'There is no live-bait chain to use.',
  invalid_bait: 'That bait is not available.',
  signed_out: 'Sign in again to fish with pond pearls.',
  offline: 'The pond could not be reached.',
}

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  try {
    navigator.vibrate(pattern)
  } catch {}
}

function isTyping(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.tagName === 'SELECT' ||
      target.isContentEditable)
  )
}

export default function FishingView({ onClose, onCatch, spotUnavailable = false }: PondGameProps) {
  const wallet = useWallet()
  const sound = useSound()
  const reduced = useReducedMotion() ?? false
  const sfx = useMemo(() => createPondSfx(), [])
  const debug = useMemo(() => debugTokens(), [])
  const visualDebug = useMemo(() => debugVisuals(debug), [debug])
  const pondSnapshot = usePondState()
  const pondState = pondSnapshot.state

  const [state, setState] = useState<FishingState>(() => createFishingState())
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-aspect-ratio: 1/1)').matches)
  const [selectedBait, setSelectedBaitState] = useState<BaitId>('worm')
  const [easyReel, setEasyReel] = useState(() => readLocal('tm:pond:easy-reel') === '1')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [reveal, setReveal] = useState<CatchView | null>(null)
  const [buying, setBuying] = useState<BaitId | null>(null)
  const [chest, setChest] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const actionRef = useRef<HTMLButtonElement>(null)
  const [lockedWager, setLockedWager] = useState<{ tier: FishTier; stake: number; multiplier: number } | null>(
    null,
  )
  const [serverWager, setServerWager] = useState<PondWagerView | null>(null)
  const [streakFresh, setStreakFresh] = useState(false)
  const [streakLost, setStreakLost] = useState(false)

  const stateRef = useRef(state)
  const narrowRef = useRef(false)
  const pondStateRef = useRef(pondState)
  const memberRef = useRef(wallet.isMember)
  const selectedBaitRef = useRef<BaitId>('worm')
  const easyRef = useRef(false)
  const holdingRef = useRef(false)
  const castSerialRef = useRef(0)
  const ticketRef = useRef<{ serial: number; ticket: string | null }>({ serial: 0, ticket: null })
  const guestRollRef = useRef<GuestRoll | null>(null)
  const memberCastRef = useRef(false)
  const reelSentRef = useRef(false)
  const keyboardHoldingRef = useRef(false)
  const guestSpeciesSeenRef = useRef(new Set<FishId>())
  const guestVariantsSeenRef = useRef(new Set<string>())
  const guestBestRef = useRef(new Map<FishId, number>())
  const toastTimerRef = useRef(0)
  const resetTimerRef = useRef(0)
  const chestTimerRef = useRef(0)
  const streakTimerRef = useRef(0)
  const activeWagerRef = useRef<PondWagerView | null>(null)
  const chainAtCastRef = useRef(0)
  const streakBumpRef = useRef(false)

  memberRef.current = wallet.isMember
  selectedBaitRef.current = selectedBait
  easyRef.current = easyReel
  narrowRef.current = narrow
  pondStateRef.current = pondState

  useEffect(() => {
    const query = window.matchMedia('(max-aspect-ratio: 1/1)')
    const update = () => setNarrow(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    sfx.setEnabled(sound.isEnabled)
    sfx.setVolume(sound.volume)
  }, [sfx, sound.isEnabled, sound.volume])

  useEffect(() => () => sfx.dispose(), [sfx])

  useEffect(() => { writeLocal('tm:pond:easy-reel', easyReel ? '1' : '0') }, [easyReel])

  useEffect(() => {
    const frame = requestAnimationFrame(() => actionRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      if (settingsOpen) setSettingsOpen(false)
      else if (pickerOpen) setPickerOpen(false)
      else if (!reveal) onClose()
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [onClose, pickerOpen, reveal, settingsOpen])

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimerRef.current)
      window.clearTimeout(resetTimerRef.current)
      window.clearTimeout(chestTimerRef.current)
      window.clearTimeout(streakTimerRef.current)
    }
  }, [])

  // The selected bait and any live-bait chain change the server odds, so ask the
  // same shared store the room HUD reads to refresh them.
  useEffect(() => {
    if (!wallet.isMember) return
    let alive = true
    const chain = (pondStateRef.current?.chain.level ?? 0) > 0
    void fetchPondState(selectedBait, chain).then((next) => {
      // A stale odds reply must never roll back a cast, reel or chain that landed meanwhile.
      if (!alive || !next || stateRef.current.phase !== 'idle') return
      publishPondState(next)
      pondStateRef.current = next
    })
    return () => {
      alive = false
    }
  }, [wallet.isMember, selectedBait, pondState?.chain.level, pickerOpen])

  const commit = useCallback((next: FishingState) => {
    stateRef.current = next
    setState(next)
  }, [])

  const showToast = useCallback((message: string, note?: string, ms = 2300) => {
    setToast({ message, note })
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setToast(null), ms)
  }, [])

  const resetToIdle = useCallback(() => {
    holdingRef.current = false
    reelSentRef.current = false
    guestRollRef.current = null
    activeWagerRef.current = null
    chainAtCastRef.current = 0
    setServerWager(null)
    ticketRef.current = { serial: castSerialRef.current, ticket: null }
    commit(createFishingState(selectedBaitRef.current))
  }, [commit])

  useEffect(() => {
    if (!spotUnavailable) return
    // Ignore an in-flight reply after giving up a spot on reconnect.
    castSerialRef.current += 1
    setReveal(null)
    setToast(null)
    resetToIdle()
  }, [resetToIdle, spotUnavailable])

  const refreshState = useCallback(async () => {
    if (!memberRef.current) return
    const chain = (pondStateRef.current?.chain.level ?? 0) > 0
    const next = await fetchPondState(selectedBaitRef.current, chain)
    if (!next) return
    publishPondState(next)
    pondStateRef.current = next
  }, [])

  const handleCastError = useCallback(
    (error: string) => {
      showToast(CAST_ERRORS[error] ?? 'The cast slipped away.', undefined, 2600)
      resetToIdle()
      if (error === 'no_bait' || error === 'insufficient' || error === 'no_chain') void refreshState()
    },
    [refreshState, resetToIdle, showToast],
  )

  const buyBait = useCallback(
    async (baitId: BaitId) => {
      if (!memberRef.current) {
        showToast('Sign in to buy bait packs.')
        return
      }
      if (baitId === 'worm') return
      setBuying(baitId)
      const result = await buyPondBait(baitId)
      setBuying(null)
      if (!result.ok) {
        showToast(
          result.error === 'insufficient' ? 'Not enough pearls for that pack.' : 'That pack could not be bought just now.',
        )
        return
      }
      publishPondState(result.value)
      pondStateRef.current = result.value
      setSelectedBaitState(baitId)
      sfx.play('coin')
      showToast(`Bought ${BAIT_BY_ID[baitId].pack} ${BAIT_BY_ID[baitId].name.toLowerCase()}.`)
    },
    [sfx, showToast],
  )

  const finishReel = useCallback(
    (finalState: FishingState, landed: boolean) => {
      if (reelSentRef.current) return
      reelSentRef.current = true
      const serial = ticketRef.current.serial
      const ticket = ticketRef.current.ticket
      const perfectCast = finalState.perfectCast
      const perfectHook = finalState.perfectHook
      const treasureGrabbed = finalState.reel?.treasureGrabbed ?? false
      const beforeStreak = pondStateRef.current?.streak ?? 0
      const chainAtCast = chainAtCastRef.current
      const castWager = activeWagerRef.current
      const lostReason = finalState.lostReason ?? 'escaped'

      if (memberCastRef.current) {
        if (!ticket) {
          if (landed) {
            showToast('The pond went quiet — try that cast again.')
            resetToIdle()
          }
          return
        }
        void reelPond({ ticket, landed, perfectCast, perfectHook, treasureGrabbed }).then((result) => {
          if (castSerialRef.current !== serial) return
          if (!result.ok) {
            showToast(result.error === 'too_soon' ? 'Give the fish another moment.' : 'The catch could not be landed.')
            if (landed) resetToIdle()
            void refreshState()
            return
          }
          const reply = result.value
          publishPondState(reply.state)
          pondStateRef.current = reply.state
          if ('lost' in reply) {
            const lost = LOST[lostReason]
            let message = lost.message
            let note = lost.note
            if (chainAtCast > 0) {
              message = 'The big one got away — and your bait with it.'
              note = treasureGrabbed ? 'The chest sank with it.' : 'Your live bait is gone.'
            } else if (castWager) {
              message = missWagerLabel(castWager.stake)
              note = treasureGrabbed ? 'The chest sank with it.' : lost.message
            } else if (treasureGrabbed) {
              message = 'The chest sank with it'
              note = lost.message
            }
            showToast(message, note, 2900)
            if (beforeStreak >= 2) {
              setStreakLost(true)
              window.clearTimeout(streakTimerRef.current)
              streakTimerRef.current = window.setTimeout(() => setStreakLost(false), 2700)
            }
            setServerWager(null)
            activeWagerRef.current = null
            chainAtCastRef.current = 0
            if (landed) resetToIdle()
            return
          }
          const caught = reply.catch
          const wager: CatchView['wager'] =
            castWager && reply.wagerWon !== null
              ? {
                  tier: castWager.tier,
                  stake: castWager.stake,
                  multiplier: castWager.multiplier,
                  won: reply.wagerWon,
                }
              : null
          const view: CatchView = {
            id: caught.id,
            species: caught.species,
            tier: caught.tier,
            variant: caught.variant,
            sizeCm: caught.sizeCm,
            trophy: caught.trophy,
            pearls: caught.pearls,
            breakdown: caught.breakdown,
            isNewSpecies: caught.isNewSpecies,
            isNewVariant: caught.isNewVariant,
            personalBest: caught.personalBest,
            treasure: reply.treasure,
            trophyCollected: reply.trophyCollected,
            wager,
            chainPaid: reply.chainPaid,
            guest: false,
          }
          if (reply.state.streak > beforeStreak && reply.state.streak >= 2) {
            streakBumpRef.current = true
          }
          setServerWager(null)
          activeWagerRef.current = null
          chainAtCastRef.current = 0
          commit({ ...stateRef.current, phase: 'reveal' })
          setReveal(view)
          onCatch?.(caught.species)
        })
        return
      }

      if (!landed) return
      const roll = guestRollRef.current
      if (!roll) return
      const treasure = treasureGrabbed && roll.treasure ? guestTreasure() : null
      const isNewSpecies = !guestSpeciesSeenRef.current.has(roll.species)
      guestSpeciesSeenRef.current.add(roll.species)
      const variantKey = `${roll.species}:${roll.variant}`
      const isNewVariant = !guestVariantsSeenRef.current.has(variantKey)
      guestVariantsSeenRef.current.add(variantKey)
      const best = guestBestRef.current.get(roll.species) ?? 0
      const personalBest = roll.sizeCm > best
      if (personalBest) guestBestRef.current.set(roll.species, roll.sizeCm)
      const view: CatchView = {
        id: `guest-${serial}-${Date.now()}`,
        species: roll.species,
        tier: roll.tier,
        variant: roll.variant,
        sizeCm: roll.sizeCm,
        trophy: roll.trophy,
        pearls: roll.pearls,
        breakdown: roll.breakdown,
        isNewSpecies,
        isNewVariant,
        personalBest,
        treasure,
        trophyCollected: false,
        wager: null,
        chainPaid: null,
        guest: true,
      }
      commit({ ...stateRef.current, phase: 'reveal' })
      setReveal(view)
      onCatch?.(roll.species)
    },
    [commit, onCatch, refreshState, resetToIdle, sfx, showToast],
  )

  const scheduleReset = useCallback(() => {
    window.clearTimeout(resetTimerRef.current)
    resetTimerRef.current = window.setTimeout(() => {
      if (stateRef.current.phase === 'lost') resetToIdle()
    }, 1900)
  }, [resetToIdle])

  const handlePhaseChange = useCallback(
    (before: FishingState, next: FishingState) => {
      if (next.phase === 'waiting' && before.phase === 'flying') sfx.play('splash')
      if (next.phase === 'bite') {
        sfx.play('bite')
        vibrate(60)
      }
      if (next.phase === 'reeling' && before.phase === 'bite') {
        sfx.play('hook')
        vibrate(30)
      }
      if (next.phase === 'landing' && before.phase === 'reeling') finishReel(next, true)
      if (next.phase === 'lost' && before.phase !== 'lost') {
        finishReel(next, false)
        const lost = LOST[next.lostReason ?? 'escaped']
        showToast(lost.message, lost.note)
        sfx.play(next.lostReason === 'snap' ? 'snap' : 'lost')
        scheduleReset()
      }
    },
    [finishReel, scheduleReset, sfx, showToast],
  )

  const applyState = useCallback(
    (before: FishingState, next: FishingState) => {
      stateRef.current = next
      setState(next)
      if (
        before.reel?.treasureGrabbed !== true &&
        next.reel?.treasureGrabbed === true
      ) {
        setChest(true)
        sfx.play('coin')
        window.clearTimeout(chestTimerRef.current)
        chestTimerRef.current = window.setTimeout(() => setChest(false), 1200)
      }
      if (next.phase !== before.phase) handlePhaseChange(before, next)
    },
    [handlePhaseChange, sfx],
  )

  useEffect(() => {
    let frame = 0
    let last = performance.now()
    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, (now - last) / 1000))
      last = now
      const before = stateRef.current
      let next = before
      if (before.phase === 'charging') next = tickCharge(before, dt)
      else if (before.phase === 'reeling') {
        next = stepReeling(before, { holding: holdingRef.current, easy: easyRef.current }, dt)
      } else if (before.phase === 'flying' || before.phase === 'waiting' || before.phase === 'bite') {
        next = tick(before, dt)
      }
      if (next !== before) applyState(before, next)
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [applyState])

  const releaseCharge = useCallback(() => {
    const before = stateRef.current
    if (before.phase !== 'charging') return
    const next = releaseCast(before, narrowRef.current)
    applyState(before, next)
    holdingRef.current = false
    sfx.play('cast')

    const serial = castSerialRef.current + 1
    castSerialRef.current = serial
    reelSentRef.current = false
    guestRollRef.current = null
    ticketRef.current = { serial, ticket: null }
    const bait = (before.bait as BaitId) ?? 'worm'
    memberCastRef.current = memberRef.current
    const chainLevel = pondStateRef.current?.chain.level ?? 0
    chainAtCastRef.current = chainLevel
    const wager = lockedWager ? { tier: lockedWager.tier, stake: lockedWager.stake } : null

    if (memberCastRef.current) {
      void castPond(bait, { wager, chain: chainLevel > 0 }).then((result) => {
        if (castSerialRef.current !== serial) return
        if (!result.ok) {
          activeWagerRef.current = null
          chainAtCastRef.current = 0
          handleCastError(result.error)
          return
        }
        publishPondState(result.value.state)
        pondStateRef.current = result.value.state
        setServerWager(result.value.wager)
        activeWagerRef.current = result.value.wager
        setLockedWager(null)
        setPickerOpen(false)
        ticketRef.current = { serial, ticket: result.value.ticket }
        applyState(stateRef.current, armCast(stateRef.current, result.value))
      })
      return
    }

    const roll = rollGuest({
      bait,
      perfectCast: next.perfectCast,
      streak: 0,
      debug,
    })
    guestRollRef.current = roll
    applyState(
      stateRef.current,
      armCast(stateRef.current, {
        shadow: roll.shadow,
        nibbles: roll.nibbles,
        fight: roll.fight,
        treasure: roll.treasure,
      }),
    )
  }, [applyState, debug, handleCastError, lockedWager, sfx, showToast])

  const beginCharge = useCallback(() => {
    const current = stateRef.current
    if (current.phase !== 'idle') return
    setPickerOpen(false)
    const bait = selectedBaitRef.current
    const count = bait === 'worm' || !memberRef.current ? Infinity : pondStateRef.current?.bait[bait] ?? 0
    if (memberRef.current && bait !== 'worm' && count <= 0) {
      void buyBait(bait)
      return
    }
    sfx.unlock()
    applyState(current, startCharge(current))
  }, [applyState, buyBait, sfx])

  const press = useCallback(() => {
    if (spotUnavailable) { onClose(); return }
    const before = stateRef.current
    if (before.phase === 'reveal' || before.phase === 'landing') return
    sfx.unlock()
    if (before.phase === 'idle') {
      beginCharge()
      return
    }
    if (before.phase === 'waiting' || before.phase === 'bite') {
      const next = tap(before)
      if (next.phase === 'reeling') holdingRef.current = true
      if (next !== before) applyState(before, next)
      return
    }
    if (before.phase === 'reeling') holdingRef.current = true
  }, [applyState, beginCharge, onClose, sfx, spotUnavailable])

  const releasePress = useCallback(() => {
    holdingRef.current = false
    if (stateRef.current.phase === 'charging') releaseCharge()
  }, [releaseCharge])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (stateRef.current.phase === 'reveal') return
      if (isTyping(event.target)) return
      if (event.target instanceof Element && event.target.closest('summary, button:not(.pond-action), [role="dialog"] .pond-settings')) return
      const castEnter = event.key === 'Enter' && event.target instanceof Element && event.target.closest('.pond-action')
      if (event.code !== 'Space' && event.key !== ' ' && !castEnter) return
      if (event.repeat) return
      event.preventDefault()
      keyboardHoldingRef.current = true
      press()
    }
    const onKeyUp = (event: KeyboardEvent) => {
      if (!keyboardHoldingRef.current || (event.code !== 'Space' && event.key !== ' ' && event.key !== 'Enter')) return
      event.preventDefault()
      keyboardHoldingRef.current = false
      releasePress()
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [press, releasePress])

  useEffect(() => {
    const onUp = () => releasePress()
    const onBlur = () => {
      holdingRef.current = false
      keyboardHoldingRef.current = false
    }
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onBlur)
    return () => {
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onBlur)
    }
  }, [releasePress])

  const bumpStreakChip = useCallback(() => {
    if (!streakBumpRef.current) return
    streakBumpRef.current = false
    setStreakFresh(true)
    sfx.play('streak')
    window.clearTimeout(streakTimerRef.current)
    streakTimerRef.current = window.setTimeout(() => setStreakFresh(false), 2400)
  }, [sfx])

  const dismissReveal = useCallback(() => {
    setReveal(null)
    resetToIdle()
    bumpStreakChip()
  }, [bumpStreakChip, resetToIdle])

  const selectBait = useCallback((bait: BaitId) => {
    setSelectedBaitState(bait)
    selectedBaitRef.current = bait
  }, [])

  const openWagerPicker = useCallback(() => {
    if (!memberRef.current) {
      showToast('Sign in to call your shot.')
      return
    }
    setSettingsOpen(false)
    setPickerOpen(true)
  }, [showToast])

  const lockWager = useCallback(
    (wager: { tier: FishTier; stake: number }) => {
      const payout = pondStateRef.current?.odds.payouts[wager.tier] ?? 0
      setLockedWager({ ...wager, multiplier: payout })
      setPickerOpen(false)
      sfx.play('coin')
    },
    [sfx],
  )

  const useAsBait = useCallback(
    async (catchId: string) => {
      const result = await chainPondBait(catchId)
      if (!result.ok) {
        showToast(
          result.error === 'not_chainable'
            ? 'That catch cannot be used as live bait.'
            : 'The live bait slipped away — try again.',
        )
        return false
      }
      publishPondState(result.value)
      pondStateRef.current = result.value
      setReveal(null)
      resetToIdle()
      bumpStreakChip()
      sfx.play('coin')
      showToast('Live bait hooked — the next cast hunts bigger fish.', undefined, 2800)
      return true
    },
    [bumpStreakChip, resetToIdle, sfx, showToast],
  )

  const phase = state.phase
  const member = wallet.isMember
  const selected = BAIT_BY_ID[selectedBait]
  const selectedCount =
    selectedBait === 'worm' || !member ? Infinity : pondState?.bait[selectedBait] ?? 0
  const mustBuy = member && selectedBait !== 'worm' && selectedCount <= 0
  const baitDisabled = phase !== 'idle'
  const showReel = (phase === 'reeling' || phase === 'landing') && state.reel !== null
  const chainLevel = member ? pondState?.chain.level ?? 0 : visualDebug.chain?.level ?? 0
  const chainPot = member ? pondState?.chain.pot ?? 0 : visualDebug.chain?.pot ?? 0
  const hudStreak = member ? pondState?.streak ?? 0 : visualDebug.streak
  const hudChain = member ? pondState?.chain ?? null : visualDebug.chain
  const hudWager = member
    ? serverWager
      ? { tier: serverWager.tier, payout: serverWager.multiplier, stake: serverWager.stake }
      : lockedWager
        ? { tier: lockedWager.tier, payout: lockedWager.multiplier, stake: lockedWager.stake }
        : null
    : visualDebug.wager
      ? { tier: visualDebug.wager.tier, payout: visualDebug.wager.multiplier, stake: visualDebug.wager.stake }
      : null

  const action = (() => {
    if (spotUnavailable) return { label: 'Back to bank', sub: 'Choose another ripple' }
    if (phase === 'idle') {
      if (mustBuy) return { label: `Buy ${selected.pack}`, sub: `${selected.cost} pearls` }
      return { label: 'Cast', sub: 'Hold to charge' }
    }
    if (phase === 'charging') return { label: 'Let go!', sub: 'In the gold zone' }
    if (phase === 'flying') return { label: 'Casting…', sub: 'Wait for it' }
    if (phase === 'waiting') return { label: state.nibbleActive ? 'Wait…' : 'Wait', sub: 'For the bite' }
    if (phase === 'bite') return { label: 'Hook!', sub: 'Tap now' }
    if (phase === 'reeling') return { label: 'Reel', sub: 'Hold · let go to rest' }
    if (phase === 'landing') return { label: 'Landing…', sub: 'The line is coming in' }
    if (phase === 'reveal') return { label: 'Caught!', sub: 'Tap the card' }
    return { label: 'Cast again', sub: 'Wait a moment' }
  })()

  const hint = (() => {
    if (spotUnavailable) return 'Another visitor is fishing here now.'
    if (phase === 'idle') {
      if (mustBuy) return `Out of ${selected.name.toLowerCase()} — tap it to buy ${selected.pack} for ${selected.cost} pearls`
      return 'Hold to charge, let go in the gold zone'
    }
    if (phase === 'charging') return 'Let go in the gold zone for a Perfect cast'
    if (phase === 'flying') return 'Here it goes…'
    if (phase === 'waiting') return state.nibbleActive ? 'Just a nibble — wait for it…' : 'Watch the bobber…'
    if (phase === 'bite') return 'It’s biting — tap now!'
    if (phase === 'reeling') {
      if (state.reel?.runActive) return 'It’s running — let go!'
      if ((state.reel?.tension ?? 0) > 0.8) return 'Easy, the line’s tight…'
      return 'Hold to reel it in'
    }
    if (phase === 'landing') return 'Almost in…'
    if (phase === 'reveal') return 'Tap to keep your catch'
    return 'Cast again when you’re ready'
  })()

  return (
    <div
      className={[
        'pond-fishing',
        reduced ? 'is-still' : '',
        `is-${phase}`,
        easyReel ? 'is-easy' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
        if (stateRef.current.phase === 'reveal') return
        const target = event.target as HTMLElement | null
        if (target?.closest('[data-pond-ui]')) return
        event.preventDefault()
        press()
      }}
    >
      <Water
        phase={phase}
        power={state.power}
        elapsed={state.elapsed}
        landing={state.landing}
        shadow={state.shadow}
        armed={state.armed}
        nibbleActive={state.nibbleActive}
        reel={state.reel}
        chest={chest}
        reduced={reduced}
        narrow={narrow}
      />

      <Hud
        pearls={member ? pondState?.pearls ?? null : null}
        lucky={member ? pondState?.lucky ?? 0 : 0}
        streak={hudStreak}
        streakFresh={streakFresh}
        streakLost={streakLost}
        chain={hudChain}
        wager={hudWager}
        isMember={member}
        settingsOpen={settingsOpen}
        easyReel={easyReel}
        onToggleSettings={() => setSettingsOpen((open) => !open)}
        onToggleEasyReel={() => setEasyReel((value) => !value)}
        onClose={onClose}
      />

      {showReel ? <ReelMeter reel={state.reel!} easy={easyReel} /> : null}

      <div className="pond-bottom" data-pond-ui>
        <WagerPicker
          open={pickerOpen}
          odds={pondState?.odds ?? null}
          pearls={pondState?.pearls ?? 0}
          wageredToday={pondState?.wageredToday ?? 0}
          locked={lockedWager ? { tier: lockedWager.tier, stake: lockedWager.stake } : null}
          onLock={lockWager}
          onCancel={() => setPickerOpen(false)}
        />
        <BaitTray
          counts={pondState?.bait ?? {}}
          selected={selectedBait}
          isMember={member}
          pearls={pondState?.pearls ?? null}
          disabled={spotUnavailable || baitDisabled || buying !== null}
          buying={buying}
          onSelect={selectBait}
          onBuy={(bait) => void buyBait(bait)}
          hint={hint}
          warning={Boolean(state.reel?.runActive && phase === 'reeling')}
          notice={toast}
          extras={member ? <button
            type="button"
            className={['pond-shot', lockedWager ? 'is-locked' : ''].filter(Boolean).join(' ')}
            aria-expanded={pickerOpen}
            disabled={phase !== 'idle'}
            onClick={openWagerPicker}
          ><PondIcon name="target" size={22} /><span>{lockedWager ? 'Change call' : 'Call your shot'}</span></button> : null}
        >
          <div className="pond-actions">
            <button
              ref={actionRef}
              type="button"
              className={[
                'pond-action',
                phase === 'bite' ? 'is-bite' : '',
                phase === 'reeling' ? 'is-reel' : '',
                phase === 'charging' ? 'is-charging' : '',
                phase === 'charging' && state.power >= SWEET_LOW && state.power <= SWEET_HIGH ? 'is-sweet' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={action.label}
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
                press()
              }}
              onPointerUp={(event) => {
                event.stopPropagation()
                releasePress()
              }}
              onContextMenu={(event) => event.preventDefault()}
            >
              {phase === 'charging' ? (
                <span className="pond-action-meter" aria-hidden="true">
                  <span
                    className="pond-action-sweet"
                    style={{ left: `${SWEET_LOW * 100}%`, width: `${(SWEET_HIGH - SWEET_LOW) * 100}%` }}
                  />
                  <span className="pond-action-fill" style={{ width: `${state.power * 100}%` }} />
                  <span className="pond-action-tick" style={{ left: `${state.power * 100}%` }} />
                </span>
              ) : null}
              <PondIcon name="rod" size={24} disc={false} />
              <span className="pond-action-text">
                <span className="pond-action-label">{action.label}</span>
                <span className="pond-action-sub">{action.sub}</span>
              </span>
            </button>
          </div>
        </BaitTray>
      </div>

      {reveal ? (
        <RevealCard
          caught={reveal}
          reduced={reduced}
          sfx={sfx}
          chainLevel={chainLevel}
          chainPot={chainPot}
          onUseAsBait={useAsBait}
          onDismiss={dismissReveal}
        />
      ) : null}
    </div>
  )
}
