import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { GuestNoteDto } from '@tiny/core'
import StickyNote from '@/features/guestboard/components/StickyNote'

const LOAD_AHEAD = 3

interface ReadScreenProps {
  notes: GuestNoteDto[]
  startIndex: number
  hasMore: boolean
  onNeedMore: () => void
  onBack: () => void
}

export default function ReadScreen({ notes, startIndex, hasMore, onNeedMore, onBack }: ReadScreenProps) {
  const [viewportRef, embla] = useEmblaCarousel({ startIndex, align: 'center', duration: 22 })
  const [selected, setSelected] = useState(startIndex)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const sync = useCallback(() => {
    if (!embla) return
    setSelected(embla.selectedScrollSnap())
    setCanPrev(embla.canScrollPrev())
    setCanNext(embla.canScrollNext())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    sync()
    embla.on('select', sync).on('reInit', sync)
    return () => {
      embla.off('select', sync).off('reInit', sync)
    }
  }, [embla, sync])

  useEffect(() => {
    if (hasMore && selected >= notes.length - LOAD_AHEAD) onNeedMore()
  }, [selected, notes.length, hasMore, onNeedMore])

  useEffect(() => {
    if (!embla) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') embla.scrollPrev()
      if (e.key === 'ArrowRight') embla.scrollNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [embla])

  return (
    <div className="guestboard-stage">
      <div className="guestboard-board guestboard-board--close">
        <img className="guestboard-board-art" src="/assets/guestboard/board.webp" alt="" />
      </div>

      <div
        className="guestboard-carousel"
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Notes from visitors"
      >
        <ul className="guestboard-carousel-track">
          {notes.map((note, index) => (
            <li
              key={note.id}
              className="guestboard-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${notes.length}`}
            >
              <StickyNote
                className="guestboard-held guestboard-held--read"
                color={note.color}
                message={note.message}
                text={note.message}
                name={note.name}
              />
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        className="guestboard-arrow guestboard-arrow--prev"
        onClick={() => embla?.scrollPrev()}
        disabled={!canPrev}
        aria-label="Previous note"
      />
      <button
        type="button"
        className="guestboard-arrow guestboard-arrow--next"
        onClick={() => embla?.scrollNext()}
        disabled={!canNext}
        aria-label="Next note"
      />

      <button type="button" className="guestboard-button guestboard-button--foot" onClick={onBack}>
        Back
      </button>
    </div>
  )
}
