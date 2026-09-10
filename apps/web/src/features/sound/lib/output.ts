'use client'

/*  Where a sound's level is actually written.

    Every sound the museum makes goes through one Web Audio graph: a gain of
    its own for its balance against the others, and a master carrying the
    level the visitor chose. The element's own `volume` is the fallback, used
    only for a sound the graph would not take.

    It is the other way round from how this started, and iOS is why. There the
    volume setter is a no-op — the level belongs to the hardware buttons alone
    — so a slider writing to it moves nothing. That was known, and the graph
    was built for it, but it was reached through a probe: set a throwaway
    element to half volume, read it back, and route through the graph only if
    the answer disagreed. On an iPhone that probe came back saying the volume
    was writable. It is not, and two things followed. The museum's slider
    governed nothing, and the music would not stop when the phone went to its
    home screen, because what was playing was an ordinary media element and
    iOS keeps those going in the background by design, script frozen, nothing
    left running that could pause it.

    A graph answers both, and the second one without this page having to be
    awake for it: iOS suspends an AudioContext when the page is backgrounded.
    So the graph is no longer a special case for a platform a probe has to
    recognise. It is simply where the sound goes.

    What it costs is an AudioContext that has to be resumed on a gesture,
    which the callers already do, and it will not take a cross-origin track —
    that comes out of a graph silent, so a track from somewhere else is left
    on the element, where it plays as it always did. */

type AudioContextCtor = new () => AudioContext

/** The master: the museum's own level, when the graph is the one carrying it. */
let context: AudioContext | null = null
let master: GainNode | null = null
let level = 1

/*  Routing is one-way — a media element cannot be given back once it is in a
    graph — so each one is routed at most once, and its own place in the mix
    hangs off it as a gain of its own. */
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

/*  Whether this element's sound is coming out of the graph rather than out of
    the element itself. That, and not what the volume probe once decided, is
    what says where its level has to be written: routing can fail — a track
    from another origin is deliberately left alone — and a caller that guessed
    wrong writes the level somewhere nobody is listening. */
export function isRouted(element: HTMLMediaElement | null | undefined): boolean {
  return !!element && routed.has(element)
}

/** The museum's level, on the graph path. Ignored on the element path. */
export function setGainLevel(value: number): void {
  level = value
  if (master) master.gain.value = value
}

/*  A browser starts an AudioContext suspended and will not run it until the
    page has been touched — the same rule that keeps the track itself from
    playing — so this is called from the same gestures that try to start it.

    Anything that is not running is woken, rather than only what calls itself
    `suspended`. WebKit has a third state the specification does not: a context
    that was playing when the page went to the background comes back
    `interrupted`, and a check for `suspended` alone walks straight past it.
    That is the museum coming back from another application silent — the track
    resumes, the element reports itself playing, and every sample it produces
    goes into a graph that is not running. */
export function resumeGain(): void {
  const state = context?.state as string | undefined
  if (!context || state === 'running' || state === 'closed') return
  void context.resume().catch(() => {
    // Refused because there has been no gesture yet. `wakeOnGesture` is
    // waiting for one.
  })
}

/*  The gesture that gets it going again.

    Resuming is not something a page may simply decide to do: on iOS it takes
    a real touch, and coming back from another application is not one. The
    museum asks anyway on the way in, because on every other platform that is
    enough — and where it is refused, the visitor's next touch is what carries
    it. Bound once, for the life of the page, and cheap: it does nothing at all
    unless the context has stopped running.

    It cannot be `{ once: true }`. A visitor may leave and come back many times
    in a visit, and a listener spent on the first return is not there for the
    second. */
function wakeOnGesture(): void {
  if (typeof document === 'undefined') return
  const wake = () => resumeGain()
  for (const event of ['pointerdown', 'touchend', 'keydown'] as const) {
    document.addEventListener(event, wake, { passive: true })
  }
}

/*  Stops the graph outright, for the moment the visitor leaves the page.

    On the platform that uses the graph, every sound in the museum is flowing
    through this context, so suspending it is a guarantee that pausing each
    element one by one is not: a context that is not running cannot be the
    thing anybody is still hearing. Harmless where the graph was never built,
    which is everywhere the element's own volume works. */
export function suspendGain(): void {
  if (context?.state === 'running') void context.suspend()
}

/*  A voice's own place in the mix. On the element path that is its balance
    scaled by the museum's level; on the graph path the level is already on the
    master and the balance was set when the element was routed, so there is
    nothing to write and writing it would do nothing anyway. */
export function applyMix(element: HTMLMediaElement, mix: number, museumLevel: number): void {
  if (isRouted(element)) return
  element.volume = Math.min(1, Math.max(0, mix * museumLevel))
}
