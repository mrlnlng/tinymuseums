import { MAX_BUG_ERRORS } from '@tiny/core/bugs'

const OPEN_EVENT = 'tiny:report-bug'

const recentErrors: string[] = []

export function openBugReport(): void {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onOpenBugReport(listener: () => void): () => void {
  window.addEventListener(OPEN_EVENT, listener)
  return () => window.removeEventListener(OPEN_EVENT, listener)
}

function remember(entry: string): void {
  recentErrors.push(`${new Date().toISOString().slice(11, 19)} ${entry}`)
  if (recentErrors.length > MAX_BUG_ERRORS) recentErrors.shift()
}

export function watchErrors(): () => void {
  const onError = (event: ErrorEvent) => {
    const where = event.filename ? ` (${event.filename.split('/').pop()}:${event.lineno})` : ''
    remember(`${event.message}${where}`)
  }
  const onRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason instanceof Error ? event.reason.message : String(event.reason)
    remember(`Unhandled rejection: ${reason}`)
  }
  window.addEventListener('error', onError)
  window.addEventListener('unhandledrejection', onRejection)
  return () => {
    window.removeEventListener('error', onError)
    window.removeEventListener('unhandledrejection', onRejection)
  }
}

function inAppBrowser(ua: string): string | undefined {
  if (/Instagram/i.test(ua)) return 'instagram'
  if (/FBAN|FBAV|FB_IAB/.test(ua)) return 'facebook'
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return 'tiktok'
  if (/Snapchat/i.test(ua)) return 'snapchat'
  if (/Twitter/i.test(ua)) return 'twitter'
  if (/\bLine\//.test(ua)) return 'line'
  return undefined
}

function referrerHost(): string | undefined {
  try {
    return document.referrer ? new URL(document.referrer).host : undefined
  } catch {
    return undefined
  }
}

export function collectContext(): Record<string, unknown> {
  const ua = navigator.userAgent
  const connection = (navigator as Navigator & { connection?: { effectiveType?: string } }).connection
  return {
    userAgent: ua,
    inApp: inAppBrowser(ua),
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    screen: `${screen.width}x${screen.height}`,
    dpr: window.devicePixelRatio,
    touch: matchMedia('(pointer: coarse)').matches,
    language: navigator.language,
    connection: connection?.effectiveType,
    online: navigator.onLine,
    referrer: referrerHost(),
    errors: [...recentErrors],
  }
}
