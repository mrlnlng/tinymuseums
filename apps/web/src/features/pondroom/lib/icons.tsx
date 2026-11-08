import type { ReactNode } from 'react'

/** Glyphs drawn on a 24-unit grid, white on the museum's crimson disc (see public/assets/icon-home.png). */
const GLYPHS = {
  trophy: (
    <>
      <path d="M8 5h8v4.5a4 4 0 0 1-8 0Z" />
      <path d="M8 6.5H5.6a2.4 2.4 0 0 0 2.6 3.9M16 6.5h2.4a2.4 2.4 0 0 1-2.6 3.9" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M11 13.2h2v2.6h-2zM8.6 16.2h6.8a.8.8 0 0 1 .8.8v1.4H7.8V17a.8.8 0 0 1 .8-.8Z" />
    </>
  ),
  scroll: (
    <>
      <path d="M7.5 5.5h9a2 2 0 0 1 2 2v.5h-2.2v9a2.5 2.5 0 0 1-2.5 2.5H7.8A2.3 2.3 0 0 1 5.5 17v-.5h2V7.5a2 2 0 0 1 0-2Z" />
      <path d="M9.6 9.6h4.6M9.6 12.2h4.6M9.6 14.8h3" stroke="#c22252" strokeWidth="1.3" strokeLinecap="round" />
    </>
  ),
  basket: (
    <>
      <path d="M8.2 10.2 11 5.6M15.8 10.2 13 5.6" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4.8 10h14.4a.7.7 0 0 1 .68.86l-1.7 6.9a2 2 0 0 1-1.94 1.52H7.76a2 2 0 0 1-1.94-1.52l-1.7-6.9A.7.7 0 0 1 4.8 10Z" />
      <path d="M9.4 12.6v3.8M12 12.6v3.8M14.6 12.6v3.8" stroke="#c22252" strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  book: (
    <>
      <path d="M5 6.4c2.3-.9 4.6-.8 6.4.5v11.4c-1.8-1.2-4.1-1.3-6.4-.5ZM19 6.4c-2.3-.9-4.6-.8-6.4.5v11.4c1.8-1.2 4.1-1.3 6.4-.5Z" />
      <path d="M14.4 10.4c.9-.6 1.8-.6 2.7 0-.9.6-1.8.6-2.7 0Z" fill="#c22252" />
    </>
  ),
  gear: (
    <path
      fillRule="evenodd"
      d="M10.6 4h2.8l.4 2.1 1.5.8 2-.8 1.4 2.4-1.6 1.4v1.8l1.6 1.4-1.4 2.4-2-.8-1.5.8-.4 2.1h-2.8l-.4-2.1-1.5-.8-2 .8-1.4-2.4 1.6-1.4v-1.8L5.3 8.5l1.4-2.4 2 .8 1.5-.8ZM12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Z"
    />
  ),
  close: <path d="M8 8l8 8M16 8l-8 8" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />,
  target: (
    <>
      <circle cx="12" cy="12" r="6.6" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.4" fill="none" stroke="#fff" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="1.2" />
    </>
  ),
  rod: (
    <>
      <path d="M6 18.5 17.5 5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round" />
      <path d="M17.5 5c.6 4.4.4 7.6-.6 10.2" fill="none" stroke="#fff" strokeWidth="1.1" strokeLinecap="round" />
      <circle cx="8.6" cy="15.6" r="1.7" />
      <path d="M15.6 16.4a1.4 1.4 0 0 1 2.6 0v1.4a1.3 1.3 0 0 1-2.6 0Z" />
    </>
  ),
} as const satisfies Record<string, ReactNode>

export type PondIconName = keyof typeof GLYPHS

export const POND_CRIMSON = '#c22252'

/** A museum chrome icon: a crimson disc with a white glyph, sized by its container (default 32px). */
export function PondIcon({
  name,
  size = 32,
  title,
  disc = true,
}: {
  name: PondIconName
  size?: number
  title?: string
  /** False draws only the white glyph, for use on a coloured button. */
  disc?: boolean
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {disc ? <circle cx="12" cy="12" r="12" fill={POND_CRIMSON} /> : null}
      <g fill="#fff">{GLYPHS[name]}</g>
    </svg>
  )
}

/** A pearl, for counters and prices: a soft cream sphere with a highlight. */
export function PearlIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <defs>
        <radialGradient id="pond-pearl-shade" cx="38%" cy="34%" r="70%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#f3ead8" />
          <stop offset="1" stopColor="#cdbb9c" />
        </radialGradient>
      </defs>
      <circle cx="10" cy="10" r="8.4" fill="url(#pond-pearl-shade)" stroke="#8f6a4c" strokeWidth="1.2" />
      <ellipse cx="7.4" cy="6.8" rx="2.2" ry="1.4" fill="#fff" opacity="0.9" />
    </svg>
  )
}
