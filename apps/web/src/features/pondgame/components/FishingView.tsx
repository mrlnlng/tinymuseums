'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { refreshWalletNow, useWallet } from '@/features/economy'
import { useSound } from '@/features/sound/components/SoundProvider'
import { reportQuestEvent } from '@/features/letters/events'
import { readLocal, writeLocal } from '@/shared/lib/browser-storage'
import { assetUrl } from '@/shared/lib/assets'
import { PondIcon } from '@/features/pondroom/lib/icons'
import { setPondState as publishPondState } from '@/features/pondroom/lib/pond-state'
import { usePondState } from '@/features/pondroom/lib/use-pond-state'
import {
  buyPondBait,
  castPond,
  chainPondBait,
  fetchPondState,
  reelPond,
  scoopPond,
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
  hookTutorialNeeded,
  HOOK_TUTORIAL_COPY,
  HOOK_TUTORIAL_KEY,
  idleHint,
  idlePrompt,
  type CastStage,
} from '../lib/copy.ts'
import {
  armCast,
  createFishingState,
  DANGER_TENSION,
  releaseCast,
  startCharge,
  stepReeling,
  SWEET_HIGH,
  SWEET_LOW,
  TAP_CAST_SECONDS,
  tap,
  tick,
  tickCharge,
  type FishingState,
  type LostReason,
} from '../lib/machine.ts'
import { NET_COOLDOWN_MS } from '../lib/net.ts'
import { landedRetryDelay, reportDelay } from '../lib/reel-report.ts'
import { missWagerLabel } from '../lib/risk.ts'
import { CAST_SFX, createPondSfx, lossSfx } from '../lib/sfx.ts'
import { BAIT_BY_ID, type BaitId, type FishId, type FishTier } from '../lib/tables.ts'
import BaitTray from './BaitTray'
import Hud from './Hud'
import ReelMeter, { CastMeter } from './ReelMeter'
import RevealCard from './RevealCard'
import WagerPicker from './WagerPicker'
import Water from './Water'
import KeepsakeFound from '@/features/pondroom/keepsakes/KeepsakeFound'
import SpecialFound from '@/features/pondroom/keepsakes/SpecialFound'
import type { KeepsakeId } from '@/features/pondroom/lib/journal'

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
  snap: { message: 'Snap! The line broke', note: 'Let go when it pulls.' },
  escaped: { message: 'It got away', note: 'Hold on, but let go when it pulls.' },
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

/** Long enough to see what went wrong before a press casts again. */
const RECAST_GUARD_MS = 350
const REEL_TICK_MS = 110

function vibrate(pattern: number | number[]): void {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return
  try {
    navigator.vibrate(pattern)
  } catch {}
}

function coarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
}

/** Touch players get the gentler reel unless they have chosen otherwise. */
function initialEasyReel(): boolean {
  const chosen = readLocal('tm:pond:reel')
  if (chosen) return chosen === 'easy'
  return readLocal('tm:pond:easy-reel') === '1' || coarsePointer()
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
  const play = sound.play
  const reduced = useReducedMotion() ?? false
  const sfx = useMemo(() => createPondSfx(), [])
  const debug = useMemo(() => debugTokens(), [])
  const visualDebug = useMemo(() => debugVisuals(debug), [debug])
  const pondSnapshot = usePondState()
  const pondState = pondSnapshot.state
  // The shared pond-room store is typed before the net, so read the new field defensively.
  const ownsNet = wallet.isMember && (pondState as { ownsNet?: boolean } | null)?.ownsNet === true

  const [state, setState] = useState<FishingState>(() => createFishingState())
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-aspect-ratio: 1/1)').matches)
  const [selectedBait, setSelectedBaitState] = useState<BaitId>('worm')
  const [easyReel, setEasyReel] = useState(initialEasyReel)
  const [coarse, setCoarse] = useState(coarsePointer)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [reveal, setReveal] = useState<CatchView | null>(null)
  useEffect(() => {
    if (reveal) reportQuestEvent('finish-minigame')
  }, [reveal])
  // Cards that follow the catch card: today's special, then any keepsake.
  type Found = { kind: 'special'; species: string; variant: string; pearls: number } | { kind: 'keepsake'; keepsake: KeepsakeId }
  const [found, setFound] = useState<Found[]>([])
  const pendingFoundRef = useRef<Found[]>([])
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
  const [tapCast, setTapCast] = useState(false)
  const [pop, setPop] = useState<{ id: number; text: string } | null>(null)
  /** The fish kept this visit, oldest first: the bucket on the bank fills with them. */
  const [kept, setKept] = useState<readonly FishId[]>([])
  const [castStage, setCastStage] = useState<CastStage>('first')
  const [hookTip, setHookTip] = useState(false)
  /** Rod or net, once the member owns the net; guests never see this switch. */
  const [tool, setTool] = useState<'rod' | 'net'>('rod')
  const [netCooling, setNetCooling] = useState(false)
  const [scoopToken, setScoopToken] = useState(0)

  const stateRef = useRef(state)
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
  const castReplyAtRef = useRef(0)
  const lossPendingRef = useRef(false)
  const lostAtRef = useRef(0)
  const pressAtRef = useRef(0)
  const tapCastRef = useRef(false)
  const touchRef = useRef(false)
  const toolRef = useRef<'rod' | 'net'>('rod')
  const netModeRef = useRef(false)
  const netCooldownRef = useRef(0)
  const netTimerRef = useRef(0)
  const reelTickAtRef = useRef(0)
  const popTimerRef = useRef(0)
  const popIdRef = useRef(0)

  memberRef.current = wallet.isMember
  selectedBaitRef.current = selectedBait
  easyRef.current = easyReel
  toolRef.current = tool
  netModeRef.current = ownsNet && tool === 'net'
  // On a phone a thumb covers the button, so casting is two taps and the meter sits above it.
  const touch = coarse || narrow
  touchRef.current = touch
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

  useEffect(() => {
    const query = window.matchMedia('(pointer: coarse)')
    const update = () => setCoarse(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const frame = requestAnimationFrame(() => actionRef.current?.focus({ preventScroll: true }))
    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      event.preventDefault()
      if (settingsOpen) {
        play('close')
        setSettingsOpen(false)
      } else if (pickerOpen) {
        play('close')
        setPickerOpen(false)
      } else if (!reveal) onClose()
    }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [onClose, pickerOpen, play, reveal, settingsOpen])

  useEffect(() => {
    return () => {
      window.clearTimeout(toastTimerRef.current)
      window.clearTimeout(resetTimerRef.current)
      window.clearTimeout(chestTimerRef.current)
      window.clearTimeout(streakTimerRef.current)
      window.clearTimeout(popTimerRef.current)
      window.clearTimeout(netTimerRef.current)
    }
  }, [])

  useEffect(() => {
    // Losing the net (a sign-out or a stale state) must not leave the view holding it.
    if (!ownsNet && tool !== 'rod') setTool('rod')
  }, [ownsNet, tool])

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

  const showPop = useCallback((text: string) => {
    setPop({ id: ++popIdRef.current, text })
    window.clearTimeout(popTimerRef.current)
    popTimerRef.current = window.setTimeout(() => setPop(null), 1000)
  }, [])

  const resetToIdle = useCallback(() => {
    holdingRef.current = false
    tapCastRef.current = false
    setTapCast(false)
    setHookTip(false)
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
        play('error')
        showToast('Sign in to buy bait packs.')
        return
      }
      if (baitId === 'worm') return
      setBuying(baitId)
      const result = await buyPondBait(baitId)
      setBuying(null)
      if (!result.ok) {
        play('error')
        showToast(
          result.error === 'insufficient' ? 'Not enough pearls for that pack.' : 'That pack could not be bought just now.',
        )
        return
      }
      publishPondState(result.value)
      pondStateRef.current = result.value
      setSelectedBaitState(baitId)
      play('purchase')
      showToast(`Bought ${BAIT_BY_ID[baitId].pack} ${BAIT_BY_ID[baitId].name.toLowerCase()}.`)
    },
    [play, showToast],
  )

  const selectTool = useCallback(
    (next: 'rod' | 'net') => {
      if (next === 'net' && !ownsNet) return
      if (stateRef.current.phase !== 'idle' || next === toolRef.current) return
      play('select')
      setPickerOpen(false)
      setTool(next)
    },
    [ownsNet, play],
  )

  const attemptScoop = useCallback(() => {
    if (!netModeRef.current || stateRef.current.phase !== 'idle') return
    if (performance.now() < netCooldownRef.current) return
    sfx.unlock()
    netCooldownRef.current = performance.now() + NET_COOLDOWN_MS
    setNetCooling(true)
    window.clearTimeout(netTimerRef.current)
    netTimerRef.current = window.setTimeout(() => {
      netCooldownRef.current = 0
      setNetCooling(false)
    }, NET_COOLDOWN_MS)
    // Water owns the live shadow positions, so it judges this press and calls back.
    setScoopToken((token) => token + 1)
  }, [sfx])

  const handleNetScoop = useCallback(
    (hit: boolean) => {
      if (!netModeRef.current) return
      if (!hit) {
        sfx.play('splash')
        showToast('Missed!')
        return
      }
      sfx.play('splash')
      void scoopPond().then((result) => {
        if (!result.ok) {
          play('error')
          if (result.status === 429 || result.error === 'too_soon') {
            showToast('The water is still settling.', 'Give the shadows another moment.')
          } else if (result.status === 409 || result.error === 'no_net') {
            showToast('You need the fishing net for that.')
            void refreshState()
          } else if (result.status === 401 || result.error === 'signed_out') {
            showToast('Sign in again to scoop.')
          } else {
            showToast('The scoop slipped away.', undefined, 2600)
          }
          return
        }
        const reply = result.value
        publishPondState(reply.state)
        pondStateRef.current = reply.state
        const caught = reply.catch
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
          wager: null,
          chainPaid: null,
          guest: false,
          net: true,
        }
        commit({ ...stateRef.current, phase: 'reveal' })
        setReveal(view)
        const pending: Found[] = []
        if (reply.special) pending.push({ kind: 'special', species: caught.species, variant: caught.variant, pearls: reply.special.pearls })
        if (reply.keepsake) {
          pending.push({ kind: 'keepsake', keepsake: reply.keepsake })
          void refreshWalletNow()
        }
        pendingFoundRef.current = pending
        onCatch?.(caught.species)
      })
    },
    [commit, onCatch, play, refreshState, sfx, showToast],
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
        if (!landed) lossPendingRef.current = true
        const report = (attempt = 0) => void reelPond({ ticket, landed, perfectCast, perfectHook, treasureGrabbed }).then((result) => {
          if (!landed) lossPendingRef.current = false
          if (castSerialRef.current !== serial) return
          if (!result.ok) {
            // A landed catch is too valuable to drop on a timing hiccup or a lost signal.
            const retry = landed
              ? landedRetryDelay(result, attempt, castReplyAtRef.current, performance.now())
              : null
            if (retry !== null) {
              window.setTimeout(() => {
                if (castSerialRef.current === serial) report(attempt + 1)
              }, retry)
              return
            }
            if (landed) {
              // A retry that finds its ticket used means the first report reached the pond and the
              // fish was kept; only the reply was lost.
              const keptEarlier = attempt > 0 && result.error === 'used_ticket'
              showToast(
                keptEarlier
                  ? 'Your fish is safe in your journal!'
                  : result.error === 'too_soon' ? 'Give the fish another moment.' : 'The catch could not be landed.',
              )
              resetToIdle()
            }
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
          const pending: Found[] = []
          if (reply.special) pending.push({ kind: 'special', species: caught.species, variant: caught.variant, pearls: reply.special.pearls })
          if (reply.keepsake) {
            pending.push({ kind: 'keepsake', keepsake: reply.keepsake })
            void refreshWalletNow()
          }
          pendingFoundRef.current = pending
          onCatch?.(caught.species)
        })
        const wait = reportDelay(castReplyAtRef.current, performance.now())
        if (wait > 0) window.setTimeout(report, wait)
        else report()
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
        if (next.perfectHook) showPop('Perfect hook!')
        if (hookTutorialNeeded(readLocal(HOOK_TUTORIAL_KEY))) {
          writeLocal(HOOK_TUTORIAL_KEY, '1')
          setHookTip(true)
        }
      }
      if (next.phase === 'landing' && before.phase === 'reeling') finishReel(next, true)
      if (next.phase === 'lost' && before.phase !== 'lost') {
        setHookTip(false)
        setCastStage('again')
        lostAtRef.current = performance.now()
        if (next.lostReason === 'snap') vibrate([40, 30, 60])
        finishReel(next, false)
        const lost = LOST[next.lostReason ?? 'escaped']
        showToast(lost.message, lost.note)
        sfx.play(lossSfx(next.lostReason))
        scheduleReset()
      }
      if (next.phase === 'landing') setHookTip(false)
    },
    [finishReel, scheduleReset, sfx, showPop, showToast],
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
      if (next.nibbleActive && !before.nibbleActive) {
        sfx.play('nibble')
        vibrate(12)
      }
      if (next.reel && before.reel) {
        if (next.reel.runActive && !before.reel.runActive) vibrate([18, 40, 18])
        if (next.reel.tension >= DANGER_TENSION && before.reel.tension < DANGER_TENSION) vibrate(10)
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
        if (holdingRef.current && now - reelTickAtRef.current >= REEL_TICK_MS) {
          reelTickAtRef.current = now
          sfx.play('reelTick')
        }
      } else if (before.phase === 'flying' || before.phase === 'waiting' || before.phase === 'bite') {
        next = tick(before, dt)
      }
      if (next !== before) applyState(before, next)
      frame = window.requestAnimationFrame(loop)
    }
    frame = window.requestAnimationFrame(loop)
    return () => window.cancelAnimationFrame(frame)
  }, [applyState, sfx])

  const releaseCharge = useCallback(() => {
    const before = stateRef.current
    if (before.phase !== 'charging') return
    const next = releaseCast(before)
    applyState(before, next)
    holdingRef.current = false
    tapCastRef.current = false
    setTapCast(false)
    sfx.play(CAST_SFX)
    if (next.perfectCast) {
      showPop('Perfect cast!')
      sfx.play('plink')
      vibrate(20)
    }

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
        castReplyAtRef.current = performance.now()
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
  }, [applyState, debug, handleCastError, lockedWager, sfx, showPop])

  const beginCharge = useCallback(() => {
    const current = stateRef.current
    if (current.phase !== 'idle' || lossPendingRef.current) return
    setPickerOpen(false)
    const bait = selectedBaitRef.current
    const count = bait === 'worm' || !memberRef.current ? Infinity : pondStateRef.current?.bait[bait] ?? 0
    if (memberRef.current && bait !== 'worm' && count <= 0) {
      void buyBait(bait)
      return
    }
    sfx.unlock()
    pressAtRef.current = performance.now()
    if (touchRef.current) {
      tapCastRef.current = true
      setTapCast(true)
    }
    applyState(current, startCharge(current))
  }, [applyState, buyBait, sfx])

  const press = useCallback(() => {
    if (spotUnavailable) { onClose(); return }
    const before = stateRef.current
    if (before.phase === 'reveal' || before.phase === 'landing') return
    if (netModeRef.current) {
      attemptScoop()
      return
    }
    sfx.unlock()
    if (before.phase === 'idle') {
      beginCharge()
      return
    }
    if (before.phase === 'charging') {
      if (tapCastRef.current) releaseCharge()
      return
    }
    if (before.phase === 'lost') {
      if (lossPendingRef.current || performance.now() - lostAtRef.current < RECAST_GUARD_MS) return
      window.clearTimeout(resetTimerRef.current)
      window.clearTimeout(toastTimerRef.current)
      setToast(null)
      resetToIdle()
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
  }, [applyState, attemptScoop, beginCharge, onClose, releaseCharge, resetToIdle, sfx, spotUnavailable])

  const releasePress = useCallback(() => {
    holdingRef.current = false
    if (stateRef.current.phase !== 'charging' || tapCastRef.current) return
    if (performance.now() - pressAtRef.current < TAP_CAST_SECONDS * 1000) {
      tapCastRef.current = true
      setTapCast(true)
      return
    }
    releaseCharge()
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
    if (reveal) {
      const species = reveal.species
      setKept((fish) => [...fish, species])
    }
    setReveal(null)
    setFound(pendingFoundRef.current)
    pendingFoundRef.current = []
    setCastStage('caught')
    setHookTip(false)
    resetToIdle()
    bumpStreakChip()
  }, [bumpStreakChip, resetToIdle, reveal])

  const selectBait = useCallback((bait: BaitId) => {
    play('select')
    setSelectedBaitState(bait)
    selectedBaitRef.current = bait
  }, [play])

  const openWagerPicker = useCallback(() => {
    if (!memberRef.current) {
      showToast('Sign in to call your shot.')
      return
    }
    setSettingsOpen(false)
    setPickerOpen(true)
    play('open')
  }, [play, showToast])

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
        play('error')
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
      setCastStage('caught')
      resetToIdle()
      bumpStreakChip()
      sfx.play('coin')
      showToast('Live bait hooked — the next cast hunts bigger fish.', undefined, 2800)
      return true
    },
    [bumpStreakChip, play, resetToIdle, sfx, showToast],
  )

  const toggleSettings = useCallback(() => {
    play(settingsOpen ? 'close' : 'open')
    setSettingsOpen((open) => !open)
  }, [play, settingsOpen])
  const toggleEasyReel = useCallback(() => {
    const next = !easyRef.current
    writeLocal('tm:pond:reel', next ? 'easy' : 'normal')
    setEasyReel(next)
  }, [])
  const closePicker = useCallback(() => {
    play('close')
    setPickerOpen(false)
  }, [play])

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

  const netMode = ownsNet && tool === 'net'
  const action = (() => {
    if (spotUnavailable) return { label: 'Back to bank', sub: 'Choose another ripple' }
    if (netMode) {
      if (phase === 'reveal') return { label: 'Caught!', sub: 'Tap the card' }
      if (phase !== 'idle') return { label: 'Scoop', sub: 'Wait for the shadows' }
      if (netCooling) return { label: 'Scoop', sub: 'Let the water settle' }
      return { label: 'Scoop', sub: 'When a shadow passes' }
    }
    if (phase === 'idle') {
      if (mustBuy) return { label: `Buy ${selected.pack}`, sub: `${selected.cost} pearls` }
      return idlePrompt(touch, castStage)
    }
    if (phase === 'charging') return tapCast ? { label: 'Tap!', sub: 'In the gold zone' } : { label: 'Let go!', sub: 'In the gold zone' }
    if (phase === 'flying') return { label: 'Casting…', sub: 'Wait for it' }
    if (phase === 'waiting') return { label: state.nibbleActive ? 'Wait…' : 'Wait', sub: 'For the bite' }
    if (phase === 'bite') return { label: 'Hook!', sub: 'Tap now' }
    if (phase === 'reeling') return { label: 'Reel', sub: touch ? 'Hold anywhere' : 'Hold · let go to rest' }
    if (phase === 'landing') return { label: 'Landing…', sub: 'The line is coming in' }
    if (phase === 'reveal') return { label: 'Caught!', sub: 'Tap the card' }
    return idlePrompt(touch, 'again')
  })()

  const hint = (() => {
    if (spotUnavailable) return 'Another visitor is fishing here now.'
    if (netMode) {
      if (phase === 'reveal') return 'Tap to keep your catch'
      if (netCooling) return 'The water is settling — scoop again in a moment'
      return 'Tap Scoop when a fish shadow crosses the ring'
    }
    if (phase === 'idle') {
      if (mustBuy) return `Out of ${selected.name.toLowerCase()} — tap it to buy ${selected.pack} for ${selected.cost} pearls`
      return idleHint(touch, castStage)
    }
    if (phase === 'charging') return 'A Perfect cast hooks bigger fish'
    if (phase === 'flying') return 'Here it goes…'
    if (phase === 'waiting') return state.nibbleActive ? 'Just a nibble — wait for it…' : 'Watch the bobber…'
    if (phase === 'bite') return touch ? 'It’s biting — tap anywhere!' : 'It’s biting — tap now!'
    if (phase === 'reeling') return touch ? 'Hold anywhere to pull it in · let go when it pulls' : 'Hold to pull it in · let go when it pulls'
    if (phase === 'landing') return 'Almost in…'
    if (phase === 'reveal') return 'Tap to keep your catch'
    return idleHint(touch, 'again')
  })()

  return (
    <div
      className={[
        'pond-fishing',
        reduced ? 'is-still' : '',
        `is-${phase}`,
        phase === 'lost' && state.lostReason ? `lost-${state.lostReason}` : '',
        easyReel ? 'is-easy' : '',
        touch ? 'is-touch' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onPointerDown={(event) => {
        if (event.pointerType === 'mouse' && event.button !== 0) return
        if (stateRef.current.phase === 'reveal') return
        const target = event.target as HTMLElement | null
        if (target?.closest('[data-pond-ui]') && !target.closest('[data-pond-press]')) return
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
        pop={pop}
        kept={kept}
        netMode={netMode}
        scoopToken={scoopToken}
        onScoop={handleNetScoop}
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
        onToggleSettings={toggleSettings}
        onToggleEasyReel={toggleEasyReel}
        onClose={onClose}
      />

      {/* The pond is a wide painting; held upright, a phone is asked to turn rather than shown a cramped scene. */}
      <div className="pond-turn" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()}>
        <svg className="pond-turn-phone" viewBox="0 0 64 64" aria-hidden="true">
          <rect x="20" y="8" width="24" height="48" rx="5" />
          <circle cx="32" cy="50" r="2.2" />
        </svg>
        <p>Turn sideways to fish</p>
      </div>

      <div className="pond-bottom" data-pond-ui>
        <WagerPicker
          open={pickerOpen}
          odds={pondState?.odds ?? null}
          pearls={pondState?.pearls ?? 0}
          wageredToday={pondState?.wageredToday ?? 0}
          locked={lockedWager ? { tier: lockedWager.tier, stake: lockedWager.stake } : null}
          onLock={lockWager}
          onCancel={closePicker}
        />
        {showReel ? (
          <div className="pond-reel-stack">
            {hookTip && phase === 'reeling' ? (
              <p className="pond-hook-tip" role="status">
                <strong>{HOOK_TUTORIAL_COPY}</strong> The fish comes in while it’s green.
                <span className="pond-hook-tip-arrow" aria-hidden="true" />
              </p>
            ) : null}
            <ReelMeter reel={state.reel!} easy={easyReel} />
          </div>
        ) : null}
        {phase === 'charging' ? <CastMeter power={state.power} touch={touch} /> : null}
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
          toolToggle={ownsNet ? (
            <div className="pond-tool-toggle" role="group" aria-label="Fishing tool">
              <button
                type="button"
                className={netMode ? 'pond-tool' : 'pond-tool is-active'}
                aria-pressed={!netMode}
                disabled={phase !== 'idle'}
                title="Fish with the rod"
                onClick={() => selectTool('rod')}
              >
                <PondIcon name="rod" size={18} />
                <span>Rod</span>
              </button>
              <button
                type="button"
                className={netMode ? 'pond-tool is-active' : 'pond-tool'}
                aria-pressed={netMode}
                disabled={phase !== 'idle'}
                title="Scoop small fish with the net"
                onClick={() => selectTool('net')}
              >
                <img src={assetUrl('pond/net', { density: 2 })} alt="" draggable={false} />
                <span>Net</span>
              </button>
            </div>
          ) : null}
          extras={member && !netMode ? <button
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
                netMode ? 'is-net' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-label={action.label}
              disabled={netMode && (netCooling || phase !== 'idle')}
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
              {netMode ? (
                <img className="pond-action-net" src={assetUrl('pond/net', { density: 2 })} alt="" draggable={false} />
              ) : (
                <PondIcon name="rod" size={30} disc={false} />
              )}
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
      {found[0]?.kind === 'special' ? (
        <SpecialFound {...found[0]} onClose={() => setFound((list) => list.slice(1))} />
      ) : found[0]?.kind === 'keepsake' ? (
        <KeepsakeFound keepsake={found[0].keepsake} onClose={() => setFound((list) => list.slice(1))} />
      ) : null}
    </div>
  )
}
