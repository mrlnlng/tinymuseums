const STATIC_BASE = (process.env.NEXT_PUBLIC_STATIC_BASE_URL ?? '').replace(/\/$/, '')

export function staticUrl(path: string): string {
  return `${STATIC_BASE}${path}`
}
