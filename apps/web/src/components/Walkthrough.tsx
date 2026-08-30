'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PieceDto } from '@tiny/core'

/**
 * The enlarged view: one work at a time, in the artist's order, with the
 * description they wrote.
 *
 * This is where someone actually looks at art — the hall is for discovering
 * artists. Laid out against mockup 4: title, framed work, plaque, and the two
 * actions. Inquiry replaces checkout: the message goes to the artist and the
 * museum stays out of the transaction.
 */

/**
 * Where "Shop print" goes.
 *
 * The whole catalogue for now; the intent is a per-piece product link later,
 * at which point this becomes a lookup and the button does not change.
 */
const SHOP_URL = 'https://www.inspiratiq.art/'

interface Props {
  slug: string
  artistId: string
  initialPieceId: string
  onClose: () => void
}

import { frameFor } from '@/lib/frame'
import { motion, AnimatePresence, type Variants } from 'motion/react'

/**
 * Directional slide between works.
 *
 * These have to be *variants* rather than inline `initial`/`exit` objects:
 * only a variant may be a function, and that function is what receives the
 * `custom` value carrying the step direction. Passing a function straight to
 * `initial`/`exit` does not typecheck and does not animate.
 */
const SLIDE: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
}

/**
 * The navigation arrow: a triangle with generously rounded corners.
 *
 * Drawn with a stroke of the same colour and `stroke-linejoin: round` rather
 * than a `clip-path`, because clip-path has no way to round a corner — the
 * previous version came out sharp. The polygon is inset by half the stroke
 * width so the rounded silhouette still fills the box.
 *
 * `currentColor` for both fill and stroke, so the colour stays in the
 * stylesheet with everything else.
 */
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

export default function Walkthrough({ slug, artistId, initialPieceId, onClose }: Props) {
  const [pieces, setPieces] = useState<PieceDto[] | null>(null)
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const response = await fetch(`/api/artists/${slug}/pieces`)
      if (!response.ok || cancelled) return
      const data = (await response.json()) as { pieces: PieceDto[] }
      const ordered = [...data.pieces].sort((a, b) => a.orderIndex - b.orderIndex)
      if (cancelled) return
      setPieces(ordered)
      const found = ordered.findIndex((p) => p.id === initialPieceId)
      setIndex(found >= 0 ? found : 0)
    })()
    return () => {
      cancelled = true
    }
  }, [slug, initialPieceId])

  const piece = pieces?.[index] ?? null

  const step = useCallback(
    (stepDir: number) => {
      if (!pieces || pieces.length === 0) return
      setDirection(stepDir)
      setIndex((i) => (i + stepDir + pieces.length) % pieces.length)
    },
    [pieces],
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

  // Report the view once per work, so the artist's dashboard is meaningful.
  useEffect(() => {
    if (!piece) return
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'piece_view', artistId, pieceId: piece.id }),
    }).catch(() => {})
  }, [piece, artistId])

  /**
   * The artwork's own proportions, measured rather than declared.
   *
   * PieceDto carries `dimensions` only as free text ("60 x 40cm"), which is
   * for reading, not parsing. Loading the image and asking it is the one
   * reliable source — and it is already being fetched for display, so this
   * costs nothing but a moment's wait for the decoded header.
   */
  const [aspect, setAspect] = useState<number | null>(null)

  useEffect(() => {
    setAspect(null)
    const url = piece?.imageUrl
    if (!url) return

    let cancelled = false
    const probe = new Image()
    probe.onload = () => {
      if (!cancelled && probe.naturalHeight > 0) {
        setAspect(probe.naturalWidth / probe.naturalHeight)
      }
    }
    probe.src = url
    return () => {
      cancelled = true
    }
  }, [piece?.imageUrl])

  const frame = useMemo(() => frameFor(aspect), [aspect])

  const artworkStyle = useMemo(
    () => ({
      ...frame.window,
      backgroundImage: piece?.imageUrl ? `url(${piece.imageUrl})` : undefined,
    }),
    [piece, frame],
  )

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
    >
      {/*
        Home and sound live in the screen's top-right chrome now, so this is
        the one control that belongs to the enlarged view itself: back to the
        hall, on the left, where back belongs.
      */}
      <div className="wt-top">
        <button className="wt-icon" onClick={onClose} aria-label="Back to the hall">
          ←
        </button>
      </div>

      {!piece ? (
        <p className="wt-loading">Fetching the rest of the wall…</p>
      ) : (
        <>
          <h2 className="script wt-title">
            <span>{piece.title}</span>
          </h2>

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
                // The stylesheet needs the ratio as a number to size the frame
                // against both axes of the stage; grid placement is in CSS.
                style={{ '--frame-aspect': frame.ratio } as React.CSSProperties}
              >
                <div className="wt-artwork" style={artworkStyle} />
                <img className="wt-frame-art" src={frame.src} alt="" aria-hidden="true" />
                {/*
                  Inside the frame element so it tracks the artwork's real
                  corner. Anchored to the stage instead, it would drift away
                  from the frame whenever the aspect changed.
                */}
                <img
                  className="wt-no-photos"
                  src="/assets/icon-no-photos.png"
                  alt=""
                  aria-hidden="true"
                />
              </motion.div>
            </AnimatePresence>

          </div>

          {/*
            The arrows flank the plaque rather than the frame, which is where
            the mockup puts them and what lets the frame run the full width.
            They are drawn entirely in CSS, so they carry no text of their own —
            the accessible name is the aria-label.
          */}
          <div className="wt-plaque-row">
            <button className="wt-nav prev" onClick={() => step(-1)} aria-label="Previous work">
              <NavArrow />
            </button>
            <div className="wt-plaque">
              <p>{piece.description}</p>
            </div>
            <button className="wt-nav next" onClick={() => step(1)} aria-label="Next work">
              <NavArrow />
            </button>
          </div>

          <div className="wt-actions">
            {/*
              One shop for the whole catalogue for now. When each piece has its
              own product this becomes a per-piece URL and nothing else here
              changes. rel="noreferrer" because it leaves the site.
            */}
            <a
              className="button secondary wt-shop"
              href={SHOP_URL}
              target="_blank"
              rel="noreferrer"
            >
              <img className="wt-shop-icon" src="/assets/icon-basket.svg" alt="" aria-hidden="true" />
              Shop print
            </a>
            <button className="button" onClick={onClose}>
              Keep exploring
            </button>
          </div>

          {/*
            The rope closes the composition along the bottom, as in mockups 4
            and 8. Decorative and inert — it must never take a tap meant for
            the buttons above it.
          */}
          <img className="wt-rope" src="/assets/rope.png" alt="" aria-hidden="true" />
        </>
      )}
    </motion.div>
  )
}
