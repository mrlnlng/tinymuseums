import { THEMES, parsePlacements, type Placement } from '@tiny/core/rooms'
import { cozyLevel } from '@/features/rooms/decorate/logic'
import { cozyFinishImageUrl } from '@/features/rooms/themes/cozy'

/** What the card shows about someone's room: its wallpaper and hearts when Open, nothing when Closed. */
interface Door {
  open: boolean
  wallpaper: string | null
  hearts: number
  maxHearts: number
}

function wallpaperOf(placements: Placement[]): string | null {
  const zone = 'wallpaper'
  const ref = placements.find((p) => p.kind === 'finish' && p.zone === zone)?.ref ?? THEMES.cozy.finishes?.[zone]?.default
  return ref ? cozyFinishImageUrl(ref) : null
}

/** Asked again each time the card opens, since the sign can turn at any moment. */
async function doorOf(slug: string): Promise<Door> {
  const closed = { open: false, wallpaper: null, hearts: 0, maxHearts: 5 }
  try {
    const response = await fetch(`/api/rooms/${slug}`, { credentials: 'same-origin' })
    if (!response.ok) return closed
    const body = (await response.json()) as { open?: unknown; published?: unknown }
    if (body.open !== true) return closed
    const placements = parsePlacements(body.published) ?? []
    const level = cozyLevel(placements)
    return { open: true, wallpaper: wallpaperOf(placements), hearts: level.hearts, maxHearts: level.maxHearts }
  } catch {
    return closed
  }
}

const DOOR_ICON =
  '<svg viewBox="-12 -14 24 26" aria-hidden="true"><path class="door-frame" d="M-7 10v-17a7 7 0 0 1 14 0v17z"/>' +
  '<path class="door-leaf" d="M-7 10v-17a7 7 0 0 1 7-7v26z"/><circle class="door-knob" cx="3.5" cy="2" r="1.3"/></svg>'

export interface PlayerCard {
  /** Shows the card for this visitor, or hides it when they are already shown. */
  toggle(pid: string, name: string, home: string): void
  /** Keeps the card over its visitor's head; hides it when they have gone. */
  place(pid: string, x: number, headY: number, viewportWidth: number): void
  shownFor(): string | null
  hide(): void
  dispose(): void
}

export function createPlayerCard(host: HTMLElement): PlayerCard {
  const card = document.createElement('div')
  card.className = 'player-card'
  card.hidden = true
  card.innerHTML =
    '<span class="player-card-window"></span>' +
    '<span class="player-card-text"><span class="player-card-name"></span><span class="player-card-hearts"></span></span>' +
    `<button type="button" class="player-card-door">${DOOR_ICON}</button>`
  host.appendChild(card)
  const windowPane = card.querySelector<HTMLElement>('.player-card-window')!
  const nameLine = card.querySelector<HTMLElement>('.player-card-name')!
  const hearts = card.querySelector<HTMLElement>('.player-card-hearts')!
  const doorButton = card.querySelector<HTMLButtonElement>('.player-card-door')!

  let pid: string | null = null
  let slug: string | null = null
  let ask = 0

  function show(door: Door | null, name: string): void {
    card.classList.toggle('is-open', door?.open === true)
    card.classList.toggle('is-closed', door !== null && !door.open)
    windowPane.style.backgroundImage = door?.wallpaper ? `url(${door.wallpaper})` : ''
    hearts.replaceChildren()
    if (door?.open) {
      for (let i = 0; i < door.maxHearts; i++) {
        const heart = document.createElement('span')
        heart.className = i < door.hearts ? 'is-full' : ''
        heart.textContent = '♥'
        hearts.append(heart)
      }
    }
    hearts.setAttribute('aria-label', door?.open ? `${door.hearts} of ${door.maxHearts} hearts` : '')
    doorButton.disabled = door?.open !== true
    doorButton.setAttribute('aria-label', door === null ? `Checking ${name}'s room` : door.open ? `Visit ${name}'s room` : `${name}'s room is closed`)
  }

  doorButton.addEventListener('click', () => {
    if (slug && !doorButton.disabled) window.location.assign(`/museum/r/${slug}`)
  })

  function onPointerDown(event: PointerEvent): void {
    if (pid && event.target instanceof Node && !card.contains(event.target) && !(event.target as Element).closest?.('.visitor-hit')) hide()
  }
  window.addEventListener('pointerdown', onPointerDown, true)

  function hide(): void {
    pid = null
    slug = null
    ask++
    card.hidden = true
  }

  return {
    toggle(nextPid, name, home) {
      if (pid === nextPid) return hide()
      pid = nextPid
      slug = home
      nameLine.textContent = name
      show(null, name)
      card.hidden = false
      const mine = ++ask
      void doorOf(home).then((door) => {
        if (mine === ask) show(door, name)
      })
    },
    place(forPid, x, headY, viewportWidth) {
      if (pid !== forPid) return
      const width = card.offsetWidth
      const left = Math.min(viewportWidth - 8 - width / 2, Math.max(8 + width / 2, x))
      card.style.setProperty('--tail', `${Math.max(16 - width / 2, Math.min(width / 2 - 16, x - left)).toFixed(1)}px`)
      card.style.transform = `translate3d(${left.toFixed(1)}px, ${(headY - 30).toFixed(1)}px, 0) translate(-50%, -100%)`
    },
    shownFor: () => pid,
    hide,
    dispose() {
      window.removeEventListener('pointerdown', onPointerDown, true)
      card.remove()
    },
  }
}
