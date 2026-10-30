const ID = 'museum-floor-transition'

/** Keep the departing floor's cover alive across the route unmount. */
export function coverFloorTransition(): void {
  let cover = document.getElementById(ID)
  if (!cover) {
    cover = document.createElement('div')
    cover.id = ID
    cover.className = 'floor-transition-cover'
    cover.setAttribute('aria-hidden', 'true')
    document.body.append(cover)
  }
  const rect = document.querySelector('.screen')?.getBoundingClientRect()
  if (rect) Object.assign(cover.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` })
}

export function revealFloorTransition(): void {
  const cover = document.getElementById(ID)
  if (!cover) return
  requestAnimationFrame(() => requestAnimationFrame(() => {
    cover.style.opacity = '0'
    window.setTimeout(() => cover.remove(), 250)
  }))
}
