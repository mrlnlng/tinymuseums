import { Fragment } from 'react'
import { JOURNAL_FAMILIES, JOURNAL_GRADES, catchArt } from '../lib/journal'

export interface FishJournalProps {
  /** The dex as the server keeps it: species row, then coat. */
  entries: Record<string, Record<string, { count: number; bestCm: number }> | undefined>
  /** Today's special fish, starred in its cell. */
  special?: { species: string; variant: string } | null
}

export function journalFound(entries: FishJournalProps['entries']): number {
  return JOURNAL_FAMILIES.reduce(
    (sum, family) => sum + JOURNAL_GRADES.filter((grade) => entries[family.species]?.[grade.variant]?.count).length,
    0,
  )
}

export default function FishJournal({ entries, special = null }: FishJournalProps) {
  return (
    <div className="pond-journal">
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
              const isSpecial = special?.species === family.species && special.variant === grade.variant
              return (
                <div
                  key={item.id}
                  className={`pond-journal-cell${isFound ? ' is-found' : ''}${isSpecial ? ' is-special' : ''}`}
                  aria-label={
                    cell && isFound
                      ? `${grade.label} ${family.label}: ${item.name}, ${cell.count} caught`
                      : `${grade.label} ${family.label}: ${isSpecial ? `${item.name}, today’s special, ` : ''}not caught yet`
                  }
                >
                  {isSpecial ? <span className="pond-journal-special">★ Today</span> : null}
                  <span className="pond-journal-art" aria-hidden="true">
                    <img src={catchArt(item)} alt="" loading="lazy" />
                  </span>
                  <span className="pond-journal-stat" aria-hidden="true">
                    {isFound ? item.name : '???'}
                  </span>
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
