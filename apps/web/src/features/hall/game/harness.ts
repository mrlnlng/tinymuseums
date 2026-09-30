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

export function installHarness(harness: HallHarness): () => void {
  if (process.env.NODE_ENV === 'production') return () => {}
  window.__hall = harness

  return () => {
    if (window.__hall === harness) delete window.__hall
  }
}
