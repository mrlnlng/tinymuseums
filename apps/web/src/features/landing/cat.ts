/** Timings and distances for the phone landing's cat, in seconds and fractions of the cat's size. */
const CAT = {
  restSeconds: 1.3,
  /** Its own widths per second: the mock's pace across the floor. */
  pace: 0.58,
  firstPeek: [5, 9],
  betweenPeeks: [6, 15],
  peekSeconds: 1.5,
  /** How much of the cat comes into view: enough for its ears and eyes. */
  peekDepth: 0.52,
} as const

type Edge = 'bottom' | 'left' | 'right'
const EDGES: readonly Edge[] = ['bottom', 'left', 'right']

function between([low, high]: readonly [number, number]): number {
  return low + Math.random() * (high - low)
}

/**
 * The otter waits at the left edge and walks off to the right once. From then on a character
 * peeks in from a random spot on the bottom or a side for about a second at a time: the otter
 * or one of the others, never the same one twice running. Returns the cleanup.
 */
export function runLandingCat(root: HTMLElement): () => void {
  const cat = root.querySelector<HTMLElement>('.landing-walker')
  const scene = cat?.offsetParent as HTMLElement | null
  if (!cat || !scene) return () => {}

  // The otter is the walker's own image; the others are stills that take its place for a peek.
  const guests = [...cat.querySelectorAll<HTMLElement>('.landing-peeker')]
  let lastPeeker = -1
  function choosePeeker(): void {
    let pick = Math.floor(Math.random() * (guests.length + 1))
    if (pick === lastPeeker) pick = (pick + 1) % (guests.length + 1)
    lastPeeker = pick
    guests.forEach((guest, index) => guest.classList.toggle('is-shown', index === pick))
    cat!.classList.toggle('is-guest', pick < guests.length)
  }

  let timer = 0
  let motion: Animation | null = null
  const wait = (seconds: number, then: () => void): void => {
    timer = window.setTimeout(then, seconds * 1000)
  }

  function walk(): void {
    const travel = scene!.clientWidth - cat!.offsetLeft
    cat!.classList.add('is-walking')
    motion = cat!.animate(
      [{ transform: 'translateX(0)' }, { transform: `translateX(${travel}px)` }],
      { duration: (travel / (cat!.offsetWidth * CAT.pace)) * 1000, easing: 'linear', fill: 'forwards' },
    )
    motion.onfinish = () => {
      cat!.classList.remove('is-walking')
      cat!.classList.add('is-away', 'is-peeking')
      motion?.cancel()
      wait(between(CAT.firstPeek), peek)
    }
  }

  function peek(): void {
    const width = cat!.offsetWidth
    const height = cat!.offsetHeight
    const sceneWidth = scene!.clientWidth
    const sceneHeight = scene!.clientHeight
    const edge = EDGES[Math.floor(Math.random() * EDGES.length)]
    const reach = height * CAT.peekDepth

    let hidden: string
    let shown: string
    if (edge === 'bottom') {
      const x = Math.random() * (sceneWidth - width)
      hidden = `translate(${x}px, ${sceneHeight}px)`
      shown = `translate(${x}px, ${sceneHeight - reach}px)`
    } else {
      // Turned on its side, the cat's head leads and the cut edge of its body stays off-screen.
      const y = sceneHeight * (0.3 + Math.random() * 0.5) - height / 2
      const out = edge === 'left' ? -(width + height) / 2 : sceneWidth - (width - height) / 2
      const into = edge === 'left' ? reach : -reach
      const turn = edge === 'left' ? 90 : -90
      hidden = `translate(${out}px, ${y}px) rotate(${turn}deg)`
      shown = `translate(${out + into}px, ${y}px) rotate(${turn}deg)`
    }

    choosePeeker()
    cat!.classList.remove('is-away')
    motion = cat!.animate(
      [
        { transform: hidden, easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)' },
        { transform: shown, offset: 0.22 },
        { transform: shown, offset: 0.78, easing: 'cubic-bezier(0.6, 0, 0.8, 0.4)' },
        { transform: hidden },
      ],
      { duration: CAT.peekSeconds * 1000 },
    )
    motion.onfinish = () => {
      cat!.classList.add('is-away')
      wait(between(CAT.betweenPeeks), peek)
    }
  }

  wait(CAT.restSeconds, walk)

  return () => {
    window.clearTimeout(timer)
    if (motion) motion.onfinish = null
    motion?.cancel()
    cat.classList.remove('is-walking', 'is-away', 'is-peeking', 'is-guest')
    for (const guest of guests) guest.classList.remove('is-shown')
  }
}
