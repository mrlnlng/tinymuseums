'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import type { PieceDto } from '@tiny/core'
import { frameFor, isFrameReady, markFrameReady } from '@/features/artwork/lib/frame'
import { useSound } from '@/features/sound/components/SoundProvider'
import { reportQuestEvent } from '@/features/letters/events'
import { loadArtistPieces } from '@/features/artwork/lib/pieces'
import { pictureSources } from '@/shared/lib/assets'
import AssetImage from '@/shared/components/AssetImage'

/** What the closeup needs of a work: an artist's piece from the museum, or art the game ships. */
export type Work = Pick<PieceDto, 'id' | 'title' | 'description' | 'imageUrl' | 'shopUrl' | 'wallpaperUrl' | 'frameWidth' | 'frameHeight'> & {
  /** Where to find the artist, shown as buttons under the plaque. */
  artistLinks?: readonly { label: string; href: string }[]
}

type Props = { onClose: () => void } & (
  /** An artist's wall: every piece they have, opening on one. */
  | { slug: string; artistId: string; initialPieceId: string; works?: never }
  /** A fixed set of works, such as the paintings in one atelier room. */
  | { works: readonly Work[]; initialIndex: number; slug?: never }
)

const SLIDE: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
}

const BACKDROP_STYLE = {
  '--wt-wall': `url(${pictureSources('hall/wallpaper').src})`,
  '--wt-valance': `url(${pictureSources('hall/curtain').src})`,
} as React.CSSProperties

function NavArrow() {
  return (
    <svg viewBox="0 0 68 100" aria-hidden="true" focusable="false">
      <polygon
        points="12,16 54,50 12,84"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MoreArrow() {
  return (
    <svg viewBox="0 0 100 68" aria-hidden="true" focusable="false">
      <polygon
        points="16,12 50,54 84,12"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="22"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <line x1="24" y1="24" x2="76" y2="76" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
      <line x1="76" y1="24" x2="24" y2="76" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
    </svg>
  )
}

export default function Walkthrough(props: Props) {
  const { onClose } = props
  const slug = props.works ? null : props.slug
  const artistId = props.works ? null : props.artistId
  const initialPieceId = props.works ? null : props.initialPieceId
  const [pieces, setPieces] = useState<readonly Work[] | null>(props.works ?? null)
  const [index, setIndex] = useState(props.works ? props.initialIndex : 0)
  const [direction, setDirection] = useState(0)

  // The screen chrome can then hide the chat dock while a closeup is open.
  useEffect(() => {
    document.body.classList.add('walkthrough-open')
    return () => document.body.classList.remove('walkthrough-open')
  }, [])

  useEffect(() => {
    if (slug === null) return
    let cancelled = false
    loadArtistPieces(slug)
      .then((ordered) => {
        if (cancelled) return
        setPieces(ordered)
        const found = ordered.findIndex((p) => p.id === initialPieceId)
        setIndex(found >= 0 ? found : 0)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [slug, initialPieceId])

  const piece = pieces?.[index] ?? null

  const { play } = useSound()

  const step = useCallback(
    (stepDir: number) => {
      if (!pieces || pieces.length === 0) return
      play('click')
      setDirection(stepDir)
      setIndex((i) => (i + stepDir + pieces.length) % pieces.length)
    },
    [pieces, play],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'ArrowRight') step(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, step])

  useEffect(() => {
    if (!pieces || pieces.length < 2) return

    const around = [index + 1, index - 1].map((i) => (i + pieces.length) % pieces.length)
    for (const i of new Set(around)) {
      if (i === index) continue
      const url = pieces[i]?.imageUrl
      if (!url) continue
      const image = new Image()
      image.fetchPriority = 'low'
      image.decoding = 'async'
      image.src = url
    }
  }, [pieces, index])

  // Views count for an artist's own pieces; art the game ships has no artist record to credit.
  useEffect(() => {
    if (!piece || artistId === null) return
    reportQuestEvent('view-artwork', piece.id)
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'piece_view', artistId, pieceId: piece.id }),
    }).catch(() => {})
  }, [piece, artistId])

  const framedAspect =
    piece?.frameWidth && piece?.frameHeight ? piece.frameWidth / piece.frameHeight : null

  const [probedAspect, setProbedAspect] = useState<number | null>(null)

  useEffect(() => {
    const url = piece?.imageUrl
    if (!url || framedAspect !== null) return

    let cancelled = false
    const probe = new Image()
    probe.onload = () => {
      if (!cancelled && probe.naturalHeight > 0) {
        setProbedAspect(probe.naturalWidth / probe.naturalHeight)
      }
    }
    probe.src = url
    return () => {
      cancelled = true
    }
  }, [piece?.imageUrl, framedAspect])

  const frame = useMemo(
    () => frameFor(framedAspect ?? probedAspect),
    [framedAspect, probedAspect],
  )

  const wide = frame.ratio > 1

  const bodyRef = useRef<HTMLParagraphElement>(null)
  const [more, setMore] = useState(false)

  useEffect(() => {
    const body = bodyRef.current
    if (!body) return

    const update = () => {
      setMore(body.scrollTop + body.clientHeight < body.scrollHeight - 2)
    }

    update()
    body.addEventListener('scroll', update, { passive: true })
    const sizes = new ResizeObserver(update)
    sizes.observe(body)
    return () => {
      body.removeEventListener('scroll', update)
      sizes.disconnect()
    }
  }, [piece?.description])

  const artworkStyle = useMemo(
    () => ({
      ...frame.window,
      backgroundImage: piece?.imageUrl ? `url(${piece.imageUrl})` : undefined,
    }),
    [piece, frame],
  )

  const [isOrnamentReady, setIsOrnamentReady] = useState(() => isFrameReady(frame.src))

  useEffect(() => {
    setIsOrnamentReady(isFrameReady(frame.src))
  }, [frame.src])

  const revealArtwork = useCallback(() => {
    markFrameReady(frame.src)
    setIsOrnamentReady(true)
  }, [frame.src])

  return (
    <motion.div
      className="wt"
      role="dialog"
      aria-modal="true"
      aria-label="Artwork"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ type: "spring", bounce: 0, duration: 0.4 }}
      style={{ '--frame-aspect': frame.ratio } as React.CSSProperties}
      data-wide={wide ? '' : undefined}
    >
      <div className="wt-backdrop" aria-hidden="true" style={BACKDROP_STYLE}>
        <div className="wt-beam" />
        <div className="wt-valance" />
      </div>

      <div className="wt-top">
        <button className="wt-icon" onClick={onClose} aria-label="Close">
          <XIcon />
        </button>
      </div>

      {!piece ? (
        <p className="wt-loading">Fetching the rest of the wall…</p>
      ) : (
        <>
          <h2 className="script wt-title">{piece.title}</h2>

          <div className="wt-stage">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={index}
                custom={direction}
                variants={SLIDE}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
                className="wt-frame"
                style={{ '--frame-aspect': frame.ratio } as React.CSSProperties}
              >
                <div
                  className="wt-artwork"
                  style={artworkStyle}
                  data-waiting={isOrnamentReady ? undefined : ''}
                />
                <AssetImage
                  name={frame.name}
                  className="wt-frame-art"
                  aria-hidden="true"
                  onLoad={revealArtwork}
                  onError={revealArtwork}
                />
                <AssetImage name="icon-no-photos" className="wt-no-photos" aria-hidden="true" />
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="wt-nav prev" data-track="walkthrough_step" onClick={() => step(-1)} aria-label="Previous work">
            <NavArrow />
          </button>
          <button className="wt-nav next" data-track="walkthrough_step" onClick={() => step(1)} aria-label="Next work">
            <NavArrow />
          </button>

          <div className="wt-plaque">
            <p ref={bodyRef}>{piece.description}</p>
            {more ? (
              <span className="wt-plaque-more" aria-hidden="true">
                <MoreArrow />
              </span>
            ) : null}
          </div>

          {piece.shopUrl || piece.wallpaperUrl || piece.artistLinks?.length ? (
            <div className="wt-actions">
              {piece.shopUrl ? (
                <a
                  className="button secondary wt-shop"
                  data-track="shop_link"
                  href={piece.shopUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <AssetImage name="icon-basket" className="wt-shop-icon" aria-hidden="true" />
                  Shop print
                </a>
              ) : null}
              {piece.wallpaperUrl ? (
                <a
                  className="button wt-wallpaper"
                  data-track="wallpaper_link"
                  href={piece.wallpaperUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Get wallpaper
                </a>
              ) : null}
              {piece.artistLinks?.map((link, i) => (
                <a
                  key={link.href}
                  className={`button ${i === 0 ? 'secondary' : ''} wt-artist-link`}
                  data-track="artist_link"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}

          <div className="wt-rope" aria-hidden="true" />

          <AssetImage name="pedestal" className="wt-column" aria-hidden="true" />
        </>
      )}
    </motion.div>
  )
}
