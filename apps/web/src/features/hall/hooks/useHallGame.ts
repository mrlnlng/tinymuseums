'use client'

import { useEffect, useRef, useState } from 'react'
import { useSound } from '@/features/sound/components/SoundProvider'
import type { useHallScene } from './useHallScene'
import { createHallGame, type HallGameHandle } from '../game/boot'
import { loadGameAssets, type GameAssets } from '../game/assets'
import type { PhaserModule } from '../game/HallGameScene'

export type HallGameOptions = Parameters<typeof useHallScene>[0] & { enabled?: true }

export function useHallGame(options: HallGameOptions) {
  const {
    hosts,
    initialSlice,
    isSuspended,
    onOpenPiece,
    onLeave,
    onOpenHelp,
    onFindCoin,
    onOpenGuestBoard,
    onGuestBoardHung,
    onIntroDone,
    onFirstMove,
    onOpenSketchGame,
  } = options

  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isSuspendedRef = useRef(isSuspended)
  isSuspendedRef.current = isSuspended

  const sound = useSound()
  const soundRef = useRef(sound)
  soundRef.current = sound

  const onOpenPieceRef = useRef(onOpenPiece)
  onOpenPieceRef.current = onOpenPiece

  const onLeaveRef = useRef(onLeave)
  onLeaveRef.current = onLeave

  const onOpenHelpRef = useRef(onOpenHelp)
  onOpenHelpRef.current = onOpenHelp

  const onFindCoinRef = useRef(onFindCoin)
  onFindCoinRef.current = onFindCoin

  const onOpenGuestBoardRef = useRef(onOpenGuestBoard)
  onOpenGuestBoardRef.current = onOpenGuestBoard

  const onGuestBoardHungRef = useRef(onGuestBoardHung)
  onGuestBoardHungRef.current = onGuestBoardHung

  const onIntroDoneRef = useRef(onIntroDone)
  onIntroDoneRef.current = onIntroDone

  const onFirstMoveRef = useRef(onFirstMove)
  onFirstMoveRef.current = onFirstMove

  const onOpenSketchGameRef = useRef(onOpenSketchGame)
  onOpenSketchGameRef.current = onOpenSketchGame

  const handleRef = useRef<HallGameHandle | null>(null)

  // A suspended game sleeps its loop, so only a fresh prop can restart it.
  useEffect(() => {
    if (options.enabled !== true || isSuspended) return
    handleRef.current?.wake()
  }, [isSuspended, options.enabled])

  useEffect(() => {
    if (options.enabled !== true) return

    let isDisposed = false
    let teardown = () => {}

    async function buildGame(): Promise<void> {
      const canvasHost = hosts.canvas.current
      const overlayHost = hosts.overlay.current
      const characterHost = hosts.character.current
      if (!canvasHost || !overlayHost || !characterHost) return

      let phaser: PhaserModule
      try {
        phaser = await import('phaser')
      } catch (loadError) {
        if (!isDisposed) setError((loadError as Error).message)
        return
      }
      if (isDisposed) return

      let assets: GameAssets
      try {
        assets = await loadGameAssets()
      } catch (loadError) {
        if (!isDisposed) setError((loadError as Error).message)
        return
      }
      if (isDisposed) {
        assets.dispose()
        return
      }

      let handle: HallGameHandle
      try {
        handle = createHallGame(phaser, canvasHost, {
          assets,
          initialSlice,
          overlayHost,
          characterHost,
          guestBoardNotes: hosts.guestBoardNotes.current,
          isSuspended: () => isSuspendedRef.current,
          sound: () => soundRef.current,
          onOpenPiece: (piece) => onOpenPieceRef.current(piece),
          onLeave: () => onLeaveRef.current(),
          onOpenHelp: () => onOpenHelpRef.current(),
          onFindCoin: () => onFindCoinRef.current(),
          onOpenGuestBoard: () => onOpenGuestBoardRef.current(),
          onOpenSketchGame: () => onOpenSketchGameRef.current(),
          onGuestBoardHung: () => onGuestBoardHungRef.current(),
          onReady: () => setIsReady(true),
          onIntroDone: () => onIntroDoneRef.current(),
          onFirstMove: () => onFirstMoveRef.current(),
        })
      } catch (buildError) {
        assets.dispose()
        if (!isDisposed) setError((buildError as Error).message)
        return
      }
      if (isDisposed) {
        handle.destroy()
        return
      }
      handleRef.current = handle
      teardown = () => {
        handleRef.current = null
        handle.destroy()
      }
    }

    void buildGame()

    return () => {
      isDisposed = true
      teardown()
    }
  }, [])

  return { isReady, error }
}
