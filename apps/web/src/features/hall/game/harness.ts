export interface HallHarnessStats {
  ready: boolean
  cameraX: number
  density: number
  cssWidth: number
  cssHeight: number
  canvasWidth: number
  canvasHeight: number
  slices: number
  isIntro: boolean
  frames?: string[]
  bunny?: { x: number; y: number; width: number; height: number; src: string } | null
  carried?: Array<{
    name: string
    x: number
    y: number
    width: number
    height: number
    angle: number
    visible: boolean
  }>
  world?: { mounted: number; loaded: number; total: number } | null
}

export interface HallHarness {
  engine: 'phaser'
  readonly cameraX: number
  tapIntent(clientX: number, clientY: number): string | null
  stats(): HallHarnessStats
}

declare global {
  interface Window {
    __hall?: HallHarness
  }
}

let entranceFrames: string[] = []

export function setEntranceFrames(frames: readonly string[]): void {
  entranceFrames = [...frames]
}

export function installHarness(harness: HallHarness): () => void {
  if (process.env.NODE_ENV === 'production') return () => {}

  const wrapped: HallHarness = {
    engine: harness.engine,
    get cameraX() {
      return harness.cameraX
    },
    tapIntent: (clientX, clientY) => harness.tapIntent(clientX, clientY),
    stats: () => ({ ...harness.stats(), frames: entranceFrames }),
  }
  window.__hall = wrapped

  return () => {
    if (window.__hall === wrapped) delete window.__hall
  }
}
