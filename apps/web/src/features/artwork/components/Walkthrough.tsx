'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'motion/react'
import type { PieceDto } from '@tiny/core'
import { frameFor, isFrameReady, markFrameReady } from '@/features/artwork/lib/frame'
import { useSound } from '@/features/sound/components/SoundProvider'

interface Props {
  slug: string
  artistId: string
  initialPieceId: string
  onClose: () => void
}

const SLIDE: Variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction > 0 ? -50 : 50, opacity: 0 }),
}

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

  useEffect(() => {
    if (!piece) return
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
      <div className="wt-top">
        <button className="wt-icon" onClick={onClose} aria-label="Back to the hall">
          ←
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
                <picture>
                  {frame.avif ? <source srcSet={frame.avif} type="image/avif" /> : null}
                  <img
                    className="wt-frame-art"
                    src={frame.src}
                    alt=""
                    aria-hidden="true"
                    onLoad={revealArtwork}
                    onError={revealArtwork}
                  />
                </picture>
                <img
                  className="wt-no-photos"
                  src="/assets/icon-no-photos.webp"
                  alt=""
                  aria-hidden="true"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <button className="wt-nav prev" onClick={() => step(-1)} aria-label="Previous work">
            <NavArrow />
          </button>
          <button className="wt-nav next" onClick={() => step(1)} aria-label="Next work">
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

          <div className="wt-actions">
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

          <div className="wt-rope" aria-hidden="true" />

          <img className="wt-column" src="/assets/pedestal.webp" alt="" aria-hidden="true" />
        </>
      )}
    </motion.div>
  )
}
