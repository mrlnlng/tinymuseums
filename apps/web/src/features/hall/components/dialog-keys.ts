import type { KeyboardEvent } from 'react'

/** Keeps Tab inside a dialog: from the last stop it wraps to the first, and back. */
export function trapTab(event: KeyboardEvent<HTMLElement>): void {
  if (event.key !== 'Tab') return
  const stops = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not([tabindex="-1"]):not([disabled])')]
  if (stops.length === 0) return
  const at = stops.indexOf(document.activeElement as HTMLElement)
  event.preventDefault()
  const next = (at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length
  stops[at < 0 ? 0 : next].focus()
}
