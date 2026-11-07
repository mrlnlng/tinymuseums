import type { LocationState } from '@tiny/core'
import { placePaintingAction } from '@/features/studio/actions'

interface PlacePickerProps {
  pieceId: string
  states: readonly LocationState[]
  /** Painting titles by id, to say what a frame holds now. */
  titles: ReadonlyMap<string, string>
  back: string
  label?: string
}

/** Where a painting hangs: every location's spots, each saying what it holds in the draft now. */
export default function PlacePicker({ pieceId, states, titles, back, label = 'Hang it in' }: PlacePickerProps) {
  const current = (() => {
    for (const state of states) {
      const spot = state.spots.find((s) => s.pieceId === pieceId)
      if (spot) return `${state.id}|${spot.id}`
      if (state.row.includes(pieceId)) return `${state.id}|here`
    }
    return 'none'
  })()
  return (
    <form action={placePaintingAction} className="place-picker">
      <input type="hidden" name="id" value={pieceId} />
      <input type="hidden" name="back" value={back} />
      <label className="field">
        <span>{label}</span>
        <select name="target" defaultValue={current}>
          <option value="none">Not hung anywhere</option>
          {states.map((state) => (
            <optgroup key={state.id} label={state.label}>
              {state.kind === 'row' ? (
                <>
                  {current === `${state.id}|here` ? <option value={`${state.id}|here`} disabled>Here now</option> : null}
                  <option value={`${state.id}|end`}>At the end of the row</option>
                  {state.row.filter((id) => id !== pieceId).map((id) => (
                    <option key={id} value={`${state.id}|${id}`}>After “{titles.get(id) ?? 'untitled'}”</option>
                  ))}
                </>
              ) : (
                state.spots.map((spot) => (
                  <option key={spot.id} value={`${state.id}|${spot.id}`}>
                    {spot.label}
                    {spot.pieceId && spot.pieceId !== pieceId ? ` — replaces “${titles.get(spot.pieceId) ?? 'untitled'}”` : spot.pieceId ? '' : ' — empty'}
                  </option>
                ))
              )}
            </optgroup>
          ))}
        </select>
      </label>
      <button className="button secondary" type="submit">Place</button>
    </form>
  )
}
