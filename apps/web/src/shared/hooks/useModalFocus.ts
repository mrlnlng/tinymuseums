'use client'

import { useEffect, useRef } from 'react'

/** Keep keyboard focus inside the sheet and return it to its opener on close. */
export function useModalFocus() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const siblings = Array.from(document.querySelector('.screen')?.children ?? [])
      .filter((node): node is HTMLElement => node instanceof HTMLElement && !node.contains(root))
      .map((node) => ({ node, inert: node.inert }))
    for (const { node } of siblings) node.inert = true
    const trap = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const items = Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]'))
        .filter((node) => node.getClientRects().length > 0 && !node.closest('[hidden]'))
      const first = items[0]
      const last = items.at(-1)
      if (!first || !last) { event.preventDefault(); return }
      if (!root.contains(document.activeElement) || (event.shiftKey && document.activeElement === first)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus()
      }
    }
    document.addEventListener('keydown', trap, true)
    return () => {
      document.removeEventListener('keydown', trap, true)
      for (const { node, inert } of siblings) node.inert = inert
      if (previous?.isConnected) previous.focus()
    }
  }, [])
  return ref
}
