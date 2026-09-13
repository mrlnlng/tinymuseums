'use client'

type AudioContextCtor = new () => AudioContext

let context: AudioContext | null = null
let master: GainNode | null = null
let level = 1

const routed = new WeakSet<HTMLMediaElement>()

function audioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    AudioContext?: AudioContextCtor
    webkitAudioContext?: AudioContextCtor
  }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

function ensureMaster(): GainNode | null {
  if (master) return master
  const Ctor = audioContextCtor()
  if (!Ctor) return null
  try {
    context = new Ctor()
    master = context.createGain()
    master.gain.value = level
    master.connect(context.destination)
    wakeOnGesture()
  } catch {
    context = null
    master = null
  }
  return master
}

function isSameOrigin(src: string): boolean {
  try {
    return new URL(src, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

// iOS ignores HTMLMediaElement.volume, so levels are set through Web Audio instead.
// Routing cannot be undone, and a cross-origin source without CORS would play silent.
export function routeThroughGain(element: HTMLMediaElement, mix = 1): boolean {
  if (routed.has(element)) return true

  const src = element.currentSrc || element.src
  if (!src || !isSameOrigin(src)) return false

  const target = ensureMaster()
  if (!target || !context) return false

  try {
    const voice = context.createGain()
    voice.gain.value = mix
    context.createMediaElementSource(element).connect(voice)
    voice.connect(target)
    routed.add(element)
    return true
  } catch {
    return false
  }
}

export function isRouted(element: HTMLMediaElement | null | undefined): boolean {
  return !!element && routed.has(element)
}

export function setGainLevel(value: number): void {
  level = value
  if (master) master.gain.value = value
}

export function resumeGain(): void {
  // WebKit adds a non-standard 'interrupted' state, so check for running rather than suspended.
  const state = context?.state as string | undefined
  if (!context || state === 'running' || state === 'closed') return
  void context.resume().catch(() => {})
}

// resume() only succeeds inside a user gesture, and a visitor can leave and return many times.
function wakeOnGesture(): void {
  if (typeof document === 'undefined') return
  const wake = () => resumeGain()
  for (const event of ['pointerdown', 'touchend', 'keydown'] as const) {
    document.addEventListener(event, wake, { passive: true })
  }
}

export function suspendGain(): void {
  if (context?.state === 'running') void context.suspend()
}

export function applyMix(element: HTMLMediaElement, mix: number, museumLevel: number): void {
  if (isRouted(element)) return
  element.volume = Math.min(1, Math.max(0, mix * museumLevel))
}
