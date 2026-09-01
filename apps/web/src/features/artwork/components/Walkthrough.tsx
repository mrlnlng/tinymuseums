'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import type { PieceDto } from '@tiny/core'
import { frameFor } from '@/features/artwork/lib/frame'
import { useSound } from '@/features/sound/components/SoundProvider'

/* The enlarged view: one work at a time in the artist's order, with the description they wrote. The hall is for discovery; inquiry replaces checkout — the message goes to the artist. */

interface Props {
  slug: string
  artistId: string
  initialPieceId: string
  onClose: () => void
}

/*  Directional slide between works. Variants rather than inline values: only a variant may be a function, and that function receives the `custom` value carrying the step direction. */
const SLIDE: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
}

/* The navigation arrow: a triangle with generously rounded corners, drawn with a stroke and round join rather than a clip-path, which cannot round a corner. */
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

/* The same triangle as `NavArrow`, turned to point down the plaque: it means
   the same thing the side arrows do — there is more this way. */
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

  const { play } = useSound()

  const step = useCallback(
    (stepDir: number) => {
      if (!pieces || pieces.length === 0) return
      // The click, not the painting-open sound — stepping between works is an
      // ordinary button press. Played here rather than left to the
      // document-level handler, which never sees keyboard presses.
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

  // Report the view once per work, so the artist's dashboard is meaningful.
  useEffect(() => {
    if (!piece) return
    void fetch('/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kind: 'piece_view', artistId, pieceId: piece.id }),
    }).catch(() => {})
  }, [piece, artistId])

  /* The artwork's own proportions, measured from the loaded image rather than parsed from the free-text dimensions string. */
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

  /*  Wide enough to leave the floor to the rope. A tall work takes that floor
      for itself — see `.wt-stage` — and the rope gives way to the column mock 4
      stands there instead. */
  const wide = frame.ratio > 1

  /*  Whether the description runs past the bottom of the plaque, and whether
      the reader has already got there. The board is a fixed size, so a long
      description scrolls inside it; without a mark saying so, text that stops
      mid-sentence at the board's edge reads as text that was cut. Measured
      rather than guessed from the length, because how much fits depends on the
      screen, the font once it has loaded, and where the lines happen to break —
      hence the observer as well as the scroll handler. */
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
      /* On the root rather than on the frame alone: the stage sizes itself from
         the same number, so that the height it asks for is the height its frame
         could actually use. */
      style={{ '--frame-aspect': frame.ratio } as React.CSSProperties}
      /* One flag for the three things that differ between the two mockups of
         this screen: how wide a frame may grow, whether the floor carries the
         rope, and whether the column stands on it. */
      data-wide={wide ? '' : undefined}
    >
      {/* Home and sound live in the top-right chrome now, so this is the one
          control that belongs to the enlarged view: back to the hall, on the
          left, where back belongs. */}
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
                // The ratio it is sized against is inherited from the root,
                // where the stage reads it too; grid placement is in CSS.
                className="wt-frame"
              >
                <div className="wt-artwork" style={artworkStyle} />
                <img className="wt-frame-art" src={frame.src} alt="" aria-hidden="true" />
                {/* Inside the frame element so it tracks the artwork's real
                    corner — anchored to the stage it would drift away whenever
                    the aspect changed. */}
                <img
                  className="wt-no-photos"
                  src="/assets/icon-no-photos.png"
                  alt=""
                  aria-hidden="true"
                />
              </motion.div>
            </AnimatePresence>

          </div>

          {/* The arrows flank the plaque rather than the frame, which is where the mockup puts them and what lets the frame run the full width. */}
          <div className="wt-plaque-row">
            <button className="wt-nav prev" onClick={() => step(-1)} aria-label="Previous work">
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
            <button className="wt-nav next" onClick={() => step(1)} aria-label="Next work">
              <NavArrow />
            </button>
          </div>

          <div className="wt-actions">
            {/* The artist's own shop link, when they set one. rel="noreferrer"
                because it leaves the site. No link, no button — a placeholder
                shop is worse than none. */}
            {piece.shopUrl ? (
              <a
                className="button secondary wt-shop"
                href={piece.shopUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img className="wt-shop-icon" src="/assets/icon-basket.svg" alt="" aria-hidden="true" />
                Shop print
              </a>
            ) : null}
            <button className="button" onClick={onClose}>
              Keep exploring
            </button>
          </div>

          {/* The rope closes the composition along the bottom, as in mock 8.
              Decorative and inert — it must never take a tap meant for the
              buttons above it. An element rather than an image because it is
              the floor the painting left over: the stylesheet gives the row
              whatever height remains and hangs the sprite from the top of it,
              so below a tall work the row is bare floor and the rope is gone. */}
          <div className="wt-rope" aria-hidden="true" />

          {/* The scenery that stands in the rope's place under a tall work, as
              mock 4 has it. Decorative, and behind everything else. */}
          {wide ? null : (
            <img className="wt-column" src="/assets/pedestal.png" alt="" aria-hidden="true" />
          )}
        </>
      )}
    </motion.div>
  )
}
