const OPEN_EVENT = 'tiny:open-account'

export type AccountMode = 'sign-in' | 'create'

function open(mode: AccountMode): void {
  window.dispatchEvent(new CustomEvent<AccountMode>(OPEN_EVENT, { detail: mode }))
}

export function openAccount(): void {
  open('sign-in')
}

export function openAccountCreation(): void {
  open('create')
}

export function onOpenAccount(listener: (mode: AccountMode) => void): () => void {
  const handle = (event: Event) => listener((event as CustomEvent<AccountMode>).detail)
  window.addEventListener(OPEN_EVENT, handle)
  return () => window.removeEventListener(OPEN_EVENT, handle)
}
