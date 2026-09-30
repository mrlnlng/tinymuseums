import type Phaser from 'phaser'

export const MOTION = {
  quick: { duration: 180, ease: 'Sine.easeOut' },
  settle: { duration: 320, ease: 'Sine.easeInOut' },
  pop: { duration: 260, ease: 'Back.easeOut' },
} as const

export type MotionPreset = (typeof MOTION)[keyof typeof MOTION]

export type MotionProps = Omit<
  Phaser.Types.Tweens.TweenBuilderConfig,
  'targets' | 'duration' | 'ease'
>

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function tween(
  scene: Phaser.Scene,
  targets: Phaser.Types.Tweens.TweenBuilderConfig['targets'],
  preset: MotionPreset,
  props: MotionProps,
): Phaser.Tweens.Tween | null {
  if (!prefersReducedMotion()) {
    return scene.tweens.add({ targets, ...preset, ...props })
  }

  const list = (Array.isArray(targets) ? targets : [targets]) as Array<Record<string, unknown>>
  for (const target of list) {
    for (const [key, value] of Object.entries(props)) {
      if (typeof value === 'number') target[key] = value
    }
  }
  props.onComplete?.()
  return null
}
