import type { CSSProperties } from 'react'

/** A painting in the hall's gold frame, landscape or portrait to match the picture. */
export default function Frame({ imageUrl, aspect, height, title, empty }: {
  imageUrl: string | null
  aspect: number | null
  height: number
  title: string
  /** What an empty frame says. */
  empty?: string
}) {
  const land = (aspect ?? 0.75) > 1.05
  const size: CSSProperties = land ? { width: height * 1.413, height } : { width: height / 1.413, height }
  return (
    <span className={`st-frame${land ? ' land' : ''}`} style={size} role="img" aria-label={title}>
      <span className="st-art" style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined} />
      {imageUrl ? null : <span className="st-empty">{empty ?? ''}</span>}
      <img className="st-fr" src={land ? '/assets/frame-landscape.png' : '/assets/frame.png'} alt="" />
    </span>
  )
}

/** One of the fashion area's frames: blue on the left wall, cream on the right. */
export function AtelierFrame({ imageUrl, side, height, title }: { imageUrl: string | null; side: string; height: number; title: string }) {
  return (
    <span className="st-frame" style={{ width: height * 0.75, height }} role="img" aria-label={title}>
      <span className="st-art" style={{ inset: side === 'left' ? '12% 14%' : '16% 18%', ...(imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}) }} />
      {imageUrl ? null : <span className="st-empty">empty</span>}
      <img className="st-fr" src={`/assets/atelier/bruce-frame-${side === 'left' ? 'blue' : 'cream'}.png`} alt="" />
    </span>
  )
}
