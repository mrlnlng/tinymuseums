'use client'

/*  Where a sound's level is actually written.

    Almost everywhere that is the media element's own `volume`, and this file
    is barely involved. iOS is the exception: there the setter is a no-op —
    the level belongs to the hardware buttons alone — so the museum's slider
    had nothing to write to and moved it without changing anything. That is
    not a slider that needs a better shape; it is a slider wired to nothing.

    A gain node is something a page *is* allowed to turn down, so where the
    element's volume is locked every sound is routed through one Web Audio
    graph and the level is applied there instead.

    Only where it is locked. The graph is not free: it costs an AudioContext
    that has to be resumed on a gesture, it takes the element's output out of
    the browser's hands, and a cross-origin track routed through it comes out
    silent. It is worth that on the platform that needs it and nowhere else,
    which is why every function here is a no-op when the element's own volume
    works. */

type AudioContextCtor = new () => AudioContext

/** The master: the museum's own level, when the graph is the one carrying it. */
let context: AudioContext | null = null
let master: GainNode | null = null
let level = 1

/*  Routing is one-way — a media element cannot be given back once it is in a
    graph — so each one is routed at most once, and its own place in the mix
    hangs off it as a gain of its own. */
const routed = new WeakSet<HTMLMediaElement>()

let locked: boolean | null = null

function audioContextCtor(): AudioContextCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    AudioContext?: AudioContextCtor
    webkitAudioContext?: AudioContextCtor
  }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

/*  Whether `element.volume = x` does anything on this device, asked of the
    device rather than of its user agent string: a throwaway element is told to
    be half as loud and then asked how loud it is. Answered once and kept. */
export function isElementVolumeLocked(): boolean {
  if (locked !== null) return locked
  if (typeof window === 'undefined' || !audioContextCtor()) {
    locked = false
    return locked
  }
  try {
    const probe = new Audio()
    probe.volume = 0.5
    locked = probe.volume !== 0.5
  } catch {
    // No Audio constructor to ask. Assume the ordinary path.
    locked = false
  }
  return locked
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
  } catch {
    context = null
    master = null
  }
  return master
}

/*  A track served from somewhere else comes out of a Web Audio graph silent
    unless it was fetched with CORS, and the museum's track is configurable —
    so a cross-origin one is left on the element path, where it still plays,
    rather than routed into silence. */
function isSameOrigin(src: string): boolean {
  try {
    return new URL(src, window.location.href).origin === window.location.origin
  } catch {
    return false
  }
}

/*  Puts one element into the graph, with `mix` as its fixed place against the
    others — the balance between a footstep and the music, which does not change
    with the level. Returns false when it could not be done, and the caller
    stays on the element's own volume. */
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
    // Already attached to another graph, or the element is not routable.
    return false
  }
}

/** The museum's level, on the graph path. Ignored on the element path. */
export function setGainLevel(value: number): void {
  level = value
  if (master) master.gain.value = value
}

/*  A browser starts an AudioContext suspended and will not run it until the
    page has been touched — the same rule that keeps the track itself from
    playing — so this is called from the same gestures that try to start it. */
export function resumeGain(): void {
  if (context?.state === 'suspended') void context.resume()
}

/*  A voice's own place in the mix. On the element path that is its balance
    scaled by the museum's level; on the graph path the level is already on the
    master and the balance was set when the element was routed, so there is
    nothing to write and writing it would do nothing anyway. */
export function applyMix(element: HTMLMediaElement, mix: number, museumLevel: number): void {
  if (isElementVolumeLocked()) return
  element.volume = Math.min(1, Math.max(0, mix * museumLevel))
}
