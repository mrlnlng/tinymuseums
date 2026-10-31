// One device, one visitor: of this browser's museum tabs, only the one in use joins the room.
// The others would otherwise show the same visitor twice, under the same name.

const CHANNEL = 'tiny-presence-turn'

type TurnMessage = { t: 'claim'; id: string } | { t: 'release'; id: string }

interface TurnEnv {
  channel: { postMessage(message: TurnMessage): void; onmessage: ((event: { data: TurnMessage }) => void) | null; close(): void } | null
  /** The tab is shown, and (when it can tell) has the focus. */
  inUse(): boolean
  listen(event: 'visibilitychange' | 'focus' | 'pagehide', run: () => void): () => void
}

export interface TabTurn {
  /** This tab is the one in the room. */
  active(): boolean
  dispose(): void
}

function browserEnv(): TurnEnv {
  const target = (event: string) => (event === 'visibilitychange' ? document : window)
  return {
    channel: typeof BroadcastChannel === 'undefined' ? null : (new BroadcastChannel(CHANNEL) as unknown as TurnEnv['channel']),
    inUse: () => document.visibilityState === 'visible',
    listen: (event, run) => {
      target(event).addEventListener(event, run)
      return () => target(event).removeEventListener(event, run)
    },
  }
}

export function createTabTurn(env: TurnEnv = browserEnv()): TabTurn {
  const { channel } = env
  // Without a channel there is no telling tabs apart; every tab joins, as before.
  if (!channel) return { active: () => true, dispose: () => {} }

  const id = Math.random().toString(36).slice(2)
  let active = false

  function claim(): void {
    active = true
    channel!.postMessage({ t: 'claim', id })
  }

  channel.onmessage = ({ data }) => {
    if (data.id === id) return
    if (data.t === 'claim') active = false
    // The tab in the room went away: a tab still in view takes over.
    else if (data.t === 'release' && !active && env.inUse()) claim()
  }

  const stops = [
    env.listen('visibilitychange', () => {
      if (env.inUse()) claim()
    }),
    env.listen('focus', claim),
    env.listen('pagehide', () => {
      if (active) channel.postMessage({ t: 'release', id })
    }),
  ]
  if (env.inUse()) claim()

  return {
    active: () => active,
    dispose() {
      if (active) channel.postMessage({ t: 'release', id })
      for (const stop of stops) stop()
      channel.onmessage = null
      channel.close()
    },
  }
}
