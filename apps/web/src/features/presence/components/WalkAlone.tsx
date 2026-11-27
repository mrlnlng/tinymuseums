'use client'

import { useId } from 'react'
import { presence, restamp } from '@tiny/core/slots'
import { useSlot } from '@/shared/lib/slots'

interface Props {
  /** The account sheet says "Walk alone"; the chat panel offers it as "Visit alone". */
  label?: string
}

/** Hides other visitors and stops showing this one to them; kept on this device only. */
export default function WalkAlone({ label = 'Walk alone' }: Props) {
  const [prefs, update] = useSlot(presence)
  const hintId = useId()
  const on = prefs.walkAlone.v
  return (
    <div className="walk-alone">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={hintId}
        className="walk-alone-switch"
        onClick={() => update((current) => ({ ...current, walkAlone: restamp(current.walkAlone, !on) }))}
      >
        <span className="walk-alone-track" aria-hidden="true">
          <span className="walk-alone-knob" />
        </span>
        {label}
      </button>
      <p id={hintId} className="walk-alone-hint">
        {on ? "You won't see other visitors, and they won't see you." : 'Hide other visitors, and stop showing yourself to them.'}
      </p>
    </div>
  )
}
