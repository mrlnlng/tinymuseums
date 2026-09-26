import { preconnect } from 'react-dom'
import { env } from '@tiny/core'

export default function MediaPreconnect() {
  const media = new URL(env.mediaBaseUrl)
  if (media.origin !== new URL(env.publicBaseUrl).origin) {
    preconnect(media.origin, { crossOrigin: 'anonymous' })
  }
  return null
}
