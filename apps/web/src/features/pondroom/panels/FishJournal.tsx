import { Fragment } from 'react'
import { formatShortSizeCm } from '../lib/pond-format'
import { JOURNAL_FAMILIES, JOURNAL_GRADES, JOURNAL_SIZE, KEEPSAKES, catchArt, type KeepsakeId } from '../lib/journal'

export interface FishJournalProps {
  /** The dex as the server keeps it: species row, then coat. */
  entries: Record<string, Record<string, { count: number; bestCm: number }> | undefined>
  keepsakes?: readonly KeepsakeId[]
  onUseKeepsake?(id: KeepsakeId): void
}

export default function FishJournal({ entries, keepsakes = [], onUseKeepsake }: FishJournalProps) {
  const found = JOURNAL_FAMILIES.reduce(
    (sum, family) => sum + JOURNAL_GRADES.filter((grade) => entries[family.species]?.[grade.variant]?.count).length,
    0,
  )

  return (
    <div className="pond-journal">
      <div className="pond-journal-progress">
        <span>
          <strong>{found}</strong> / {JOURNAL_SIZE} found
        </span>
        <span className="pond-journal-bar" aria-hidden="true">
          <span style={{ width: `${(found / JOURNAL_SIZE) * 100}%` }} />
        </span>
      </div>

      <div className="pond-journal-grid" role="group" aria-label="Fish journal">
        <span aria-hidden="true" />
        {JOURNAL_GRADES.map((grade) => (
          <span className={`pond-journal-pill is-${grade.variant}`} key={grade.variant}>
            {grade.label}
          </span>
        ))}
        {JOURNAL_FAMILIES.map((family) => (
          <Fragment key={family.species}>
            <span className="pond-journal-family">
              <span className="pond-journal-family-name">{family.label}</span>
              <span className={`pond-journal-pill is-small is-${family.rarity}`}>{family.rarity}</span>
            </span>
            {family.catches.map((item, index) => {
              const grade = JOURNAL_GRADES[index]
              const cell = entries[family.species]?.[grade.variant]
              const isFound = Boolean(cell?.count)
              return (
                <div
                  key={item.id}
                  className={`pond-journal-cell${isFound ? ' is-found' : ''}`}
                  aria-label={
                    cell && isFound
                      ? `${grade.label} ${family.label}: ${item.name}, ${cell.count} caught, best ${formatShortSizeCm(cell.bestCm)}`
                      : `${grade.label} ${family.label}: not caught yet`
                  }
                >
                  <span className="pond-journal-art" aria-hidden="true">
                    <img src={catchArt(item)} alt="" loading="lazy" />
                  </span>
                  <span className="pond-journal-stat" aria-hidden="true">
                    {cell && isFound ? `×${cell.count} · ${formatShortSizeCm(cell.bestCm)}` : '???'}
                  </span>
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>

      <section className="pond-journal-keepsakes" aria-labelledby="pond-journal-keepsakes-title">
        <span className="pond-journal-family">
          <h3 id="pond-journal-keepsakes-title" className="pond-journal-family-name">Keepsakes</h3>
          <span className="pond-journal-pill is-small is-keepsake">Rare finds</span>
        </span>
        {KEEPSAKES.map((item) => {
          const owned = keepsakes.includes(item.id)
          return owned ? (
            <button
              type="button"
              key={item.id}
              className="pond-journal-cell is-found is-keepsake"
              onClick={() => onUseKeepsake?.(item.id)}
              aria-label={`${item.action} the ${item.name}`}
            >
              <span className="pond-journal-art" aria-hidden="true">
                <img src={catchArt(item)} alt="" loading="lazy" />
              </span>
              <span className="pond-journal-stat">{item.action} ▸</span>
            </button>
          ) : (
            <div key={item.id} className="pond-journal-cell is-keepsake" aria-label="A keepsake not found yet">
              <span className="pond-journal-art" aria-hidden="true">
                <img src={catchArt(item)} alt="" loading="lazy" />
              </span>
              <span className="pond-journal-stat" aria-hidden="true">???</span>
            </div>
          )
        })}
      </section>
    </div>
  )
}
