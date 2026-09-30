import type Phaser from 'phaser'
import type { HallSliceDto } from '@tiny/core'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import type { WorldPoint } from '@/features/hall/scene/hit'
import { createPixelRatioGovernor } from '@/features/hall/scene/quality'
import { routeTap } from '@/features/hall/scene/tap'
import { Traversal } from '@/features/hall/scene/traversal'
import type { OpenPiece } from '@/features/hall/hooks/useHallScene'
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
  overlayHost: HTMLElement
  characterHost: HTMLElement
  guestBoardNotes: HTMLElement | null
  isSuspended: () => boolean
  sound: () => HallSound
  onOpenPiece: (piece: OpenPiece) => void
  onLeave: () => void
  onOpenHelp: () => void
  onFindCoin: () => void
  onOpenGuestBoard: () => void
  onOpenSketchGame: () => void
  onGuestBoardHung: () => void
  onReady: () => void
  onIntroDone: () => void
  onFirstMove: () => void
}

export interface HallGameHandle {
  wake(): void
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
    world: null,
    tapWorld: null,
    character: null,
    act: null,
    dispose: null,
  }

  const traversal = new Traversal()
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
    // ScaleManager.resize skips the CSS size when it equals the backing size, leaving a stale one.
    game.canvas.style.width = `${cssWidth}px`
    game.canvas.style.height = `${cssHeight}px`
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
    overlayHost: bridge.overlayHost,
    characterHost: bridge.characterHost,
    guestBoardNotesHost: bridge.guestBoardNotes,
    traversal,
    governor,
    isSuspended: bridge.isSuspended,
    sound: bridge.sound,
    onReady: bridge.onReady,
    onIntroDone: bridge.onIntroDone,
    onFirstMove: bridge.onFirstMove,
    onOpenPiece: bridge.onOpenPiece,
    onLeave: bridge.onLeave,
    onOpenHelp: bridge.onOpenHelp,
    onFindCoin: bridge.onFindCoin,
    onOpenGuestBoard: bridge.onOpenGuestBoard,
    onOpenSketchGame: bridge.onOpenSketchGame,
    onGuestBoardHung: bridge.onGuestBoardHung,
  }

  const Scene = createHallGameScene(P, sceneDeps)
  const config: Phaser.Types.Core.GameConfig = {
    type: P.AUTO,
    parent: host,
    backgroundColor: bridge.assets.manifest.room.wallColor,
    banner: false,
    audio: { noAudio: true },
    render: { antialias: true, antialiasGL: false, roundPixels: false, mipmapFilter: 'LINEAR_MIPMAP_LINEAR' },
    input: { keyboard: false, mouse: false, touch: false, gamepad: false },
    scale: {
      mode: P.Scale.NONE,
      parent: host,
      width: Math.max(1, Math.round(initialCssWidth * runtime.density)),
      height: Math.max(1, Math.round(initialCssHeight * runtime.density)),
      zoom: 1 / runtime.density,
      autoCenter: P.Scale.NO_CENTER,
      autoRound: true,
    },
    scene: [Scene],
  }

  game = new P.Game(config)

  const canvas = game.canvas
  canvas.className = 'hall-canvas'
  canvas.style.display = 'block'

  traversal.attach(canvas)

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

    if (bridge.isSuspended() || traversal.isIntro) return
    const world = runtime.world
    if (!world) return
    const hit = world.hitTestAt(worldPoint(event.clientX, event.clientY))
    if (hit) loadArtistPieces(hit.mounted.display.slug).catch(() => {})
  }

  function handlePointerUp(event: PointerEvent): void {
    const moved = Math.hypot(event.clientX - pressX, event.clientY - pressY)
    const slop = event.pointerType === 'touch' ? TAP_SLOP_PX.touch : TAP_SLOP_PX.mouse
    const tooSlow = performance.now() - pressedAt > TAP_TIMEOUT_MS
    isTap = !(moved > slop || tooSlow || bridge.isSuspended() || traversal.isIntro)
  }

  // Taps act on click, not pointerup: on touch screens the browser's click lands on
  // whatever is under the finger afterwards, so an overlay opened on pointerup would
  // receive that click on its close-on-tap scrim and shut straight away.
  function handleClick(event: MouseEvent): void {
    if (!isTap) return
    isTap = false

    const tapWorld = runtime.tapWorld
    const act = runtime.act
    if (!tapWorld || !act) return
    const intent = routeTap(worldPoint(event.clientX, event.clientY), tapWorld)
    if (intent) act(intent)
  }

  function wake(): void {
    game?.loop.wake()
  }

  canvas.addEventListener('pointerdown', handlePointerDown)
  canvas.addEventListener('pointerup', handlePointerUp)
  canvas.addEventListener('click', handleClick)
  canvas.addEventListener('pointerdown', wake)
  canvas.addEventListener('wheel', wake, { passive: true })
  window.addEventListener('keydown', wake)

  const removeHarness = installHarness({
    engine: 'phaser',
    get cameraX() {
      return traversal.cameraX
    },
    tapIntent: (clientX, clientY) => {
      const tapWorld = runtime.tapWorld
      if (!tapWorld) return null
      return routeTap(worldPoint(clientX, clientY), tapWorld)?.kind ?? null
    },
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
      bunny: runtime.character?.bunny() ?? null,
      world: runtime.world?.stats() ?? null,
    }),
  })

  const resizeObserver = new ResizeObserver(applyResize)
  resizeObserver.observe(host)

  return {
    wake,

    destroy() {
      removeHarness()
      resizeObserver.disconnect()
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('click', handleClick)
      canvas.removeEventListener('pointerdown', wake)
      canvas.removeEventListener('wheel', wake)
      window.removeEventListener('keydown', wake)
      runtime.dispose?.()
      game?.destroy(true)
      game = null
    },
  }
}
