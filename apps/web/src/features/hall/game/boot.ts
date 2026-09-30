import type Phaser from 'phaser'
import type { HallSliceDto } from '@tiny/core'
import type { Assets } from '@/features/hall/scene/assets'
import { createCharacter } from '@/features/hall/scene/character'
import type { WorldPoint } from '@/features/hall/scene/hit'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { routeTap, type TapWorld } from '@/features/hall/scene/tap'
import { Traversal } from '@/features/hall/scene/traversal'
import type { OpenPiece } from '@/features/hall/hooks/useHallScene'
import { track } from '@/shared/lib/visit'
import { installHarness } from './harness'
import {
  createHallGameScene,
  type HallRuntime,
  type HallSceneDeps,
  type HallSound,
  type PhaserModule,
} from './HallGameScene'
import type { GameAssets } from './assets'
import { computeView, ViewProjector } from './view'

const TAP_SLOP_PX = { touch: 12, mouse: 6 }
const TAP_TIMEOUT_MS = 600

export interface HallGameBridge {
  assets: GameAssets
  initialSlice: HallSliceDto
  characterHost: HTMLElement
  isSuspended: () => boolean
  sound: () => HallSound
  onOpenPiece: (piece: OpenPiece) => void
  onLeave: () => void
  onOpenHelp: () => void
  onFindCoin: () => void
  onOpenGuestBoard: () => void
  onOpenSketchGame: () => void
  onReady: () => void
  onIntroDone: () => void
  onFirstMove: () => void
}

export interface HallGameHandle {
  destroy(): void
}

export function createHallGame(
  P: PhaserModule,
  host: HTMLElement,
  bridge: HallGameBridge,
): HallGameHandle {
  const initialRect = host.getBoundingClientRect()
  const initialCssWidth = Math.max(1, Math.round(initialRect.width))
  const initialCssHeight = Math.max(1, Math.round(initialRect.height))

  const runtime: HallRuntime = {
    cssWidth: initialCssWidth,
    cssHeight: initialCssHeight,
    density: window.devicePixelRatio,
    view: computeView(initialCssWidth, initialCssHeight),
    viewport: { width: initialCssWidth, height: initialCssHeight, left: 0, top: 0 },
    ready: false,
    known: 0,
  }

  const traversal = new Traversal()
  const character = createCharacter(bridge.assets as unknown as Assets, bridge.characterHost)
  let game: Phaser.Game | null = null

  function applyResize(): void {
    const rect = host.getBoundingClientRect()
    const cssWidth = Math.max(1, Math.round(rect.width))
    const cssHeight = Math.max(1, Math.round(rect.height))
    runtime.cssWidth = cssWidth
    runtime.cssHeight = cssHeight
    runtime.view = computeView(cssWidth, cssHeight)
    runtime.viewport = { width: cssWidth, height: cssHeight, left: 0, top: 0 }
    traversal.setWorldPerPixel(runtime.view.viewWidth / cssWidth)

    if (!game) return
    game.scale.setZoom(1 / runtime.density)
    game.scale.resize(
      Math.max(1, Math.round(cssWidth * runtime.density)),
      Math.max(1, Math.round(cssHeight * runtime.density)),
    )
  }

  const governor = createPixelRatioGovernor(
    {
      setPixelRatio(ratio: number): void {
        runtime.density = ratio
        applyResize()
      },
    },
    window.devicePixelRatio,
  )

  const sceneDeps: HallSceneDeps = {
    runtime,
    assets: bridge.assets,
    initialSlice: bridge.initialSlice,
    character,
    traversal,
    governor,
    isSuspended: bridge.isSuspended,
    sound: bridge.sound,
    onReady: bridge.onReady,
    onIntroDone: bridge.onIntroDone,
    onFirstMove: bridge.onFirstMove,
  }

  const Scene = createHallGameScene(P, sceneDeps)
  const config: Phaser.Types.Core.GameConfig = {
    type: P.AUTO,
    parent: host,
    backgroundColor: bridge.assets.manifest.room.wallColor,
    banner: false,
    audio: { noAudio: true },
    render: { antialias: false, roundPixels: false, mipmapFilter: 'LINEAR_MIPMAP_LINEAR' },
    input: { keyboard: false, mouse: false, touch: false, gamepad: false },
    scale: {
      mode: P.Scale.NONE,
      parent: host,
      width: Math.max(1, Math.round(initialCssWidth * runtime.density)),
      height: Math.max(1, Math.round(initialCssHeight * runtime.density)),
      zoom: 1 / runtime.density,
      autoCenter: P.Scale.NO_CENTER,
    },
    scene: [Scene],
  }

  try {
    game = new P.Game(config)
  } catch (error) {
    character.dispose()
    throw error
  }

  const canvas = game.canvas
  canvas.className = 'hall-canvas'
  canvas.style.display = 'block'

  traversal.attach(canvas)

  const resizeObserver = new ResizeObserver(applyResize)
  resizeObserver.observe(host)

  const tapWorld: TapWorld = {
    hitDoor: () => false,
    hitLobbyCat: () => false,
    hitCoin: () => false,
    hitPainting: () => null,
    hitPedestal: () => null,
    acceptsHelm: () => false,
    hitMatcha: () => false,
    hitCafeCat: () => false,
    hitDesktop: () => false,
    hitBeanbag: () => false,
    hitGuestBoard: () => false,
  }

  function worldPoint(clientX: number, clientY: number): WorldPoint {
    const rect = canvas.getBoundingClientRect()
    return new ViewProjector(traversal.cameraX, runtime.view, runtime.viewport).toWorld(
      clientX - rect.left,
      clientY - rect.top,
    )
  }

  let pressX = 0
  let pressY = 0
  let pressedAt = 0
  let isTap = false

  function handlePointerDown(event: PointerEvent): void {
    isTap = false
    bridge.sound().prepare('jump')
    pressX = event.clientX
    pressY = event.clientY
    pressedAt = performance.now()
  }

  function handlePointerUp(event: PointerEvent): void {
    const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
    const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
    const tooSlow = performance.now() - pressedAt > TAP_TIMEOUT_MS
    isTap = !(moved > slop || tooSlow || bridge.isSuspended() || traversal.isIntro)
  }

  function handleClick(event: MouseEvent): void {
    if (!isTap) return
    isTap = false

    const intent = routeTap(worldPoint(event.clientX, event.clientY), tapWorld)
    if (!intent) return

    switch (intent.kind) {
      case 'leave':
        track('leave')
        bridge.sound().play('click')
        bridge.onLeave()
        return

      case 'help':
        track('help')
        bridge.sound().play('click')
        bridge.onOpenHelp()
        return

      case 'coin':
        track('coin')
        bridge.sound().play('coin')
        bridge.onFindCoin()
        return

      case 'painting':
        track('painting')
        bridge.sound().play('painting-open')
        bridge.onOpenPiece({
          slug: intent.slug,
          artistId: intent.artistId,
          pieceId: intent.pieceId,
        })
        return

      case 'helm':
        track('helm')
        return

      case 'statue':
        track('statue')
        if (intent.pedestal.voice) bridge.sound().play(intent.pedestal.voice)
        return

      case 'matcha':
        track('matcha')
        bridge.sound().play('click')
        return

      case 'cafe-cat':
        track('cafe_cat')
        bridge.sound().play('cafe-hello')
        return

      case 'sketch':
        track('sketch_open')
        bridge.sound().play('click')
        bridge.onOpenSketchGame()
        return

      case 'beanbag':
        track('beanbag')
        bridge.sound().play('click')
        return

      case 'guest-board':
        track('guest_board')
        bridge.sound().play('click')
        bridge.onOpenGuestBoard()
        return
    }
  }

  canvas.addEventListener('pointerdown', handlePointerDown)
  canvas.addEventListener('pointerup', handlePointerUp)
  canvas.addEventListener('click', handleClick)

  const removeHarness = installHarness({
    engine: 'phaser',
    get cameraX() {
      return traversal.cameraX
    },
    tapIntent: (clientX, clientY) =>
      routeTap(worldPoint(clientX, clientY), tapWorld)?.kind ?? null,
    stats: () => ({
      ready: runtime.ready,
      cameraX: traversal.cameraX,
      density: runtime.density,
      cssWidth: runtime.cssWidth,
      cssHeight: runtime.cssHeight,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
      slices: runtime.known,
      isIntro: traversal.isIntro,
    }),
  })

  return {
    destroy() {
      removeHarness()
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('click', handleClick)
      character.dispose()
      game?.destroy(true)
      game = null
    },
  }
}
