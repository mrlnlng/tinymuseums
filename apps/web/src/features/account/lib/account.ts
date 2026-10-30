const OPEN_EVENT = 'tiny:open-account'

export function openAccount(): void {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onOpenAccount(listener: () => void): () => void {
  window.addEventListener(OPEN_EVENT, listener)
  return () => window.removeEventListener(OPEN_EVENT, listener)
}
