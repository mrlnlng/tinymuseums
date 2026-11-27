import { staticUrl } from '@/shared/lib/static'
import { POND_SIGN_NAME } from '../lib/identity'
import { catchArt, gradeLabel, journalCatch, journalFamily } from '../lib/journal'

const RULES = [
  ['Click the pond to throw your line in the water.'],
  ['Watch the bobber. When it dips down, click fast!'],
  ['Keep the fish inside the green box to reel it in.'],
  // The mock breaks this rule after its first sentence.
  ['Every fish has 5 varieties, from Basic to Sashimi.', 'Can you catch them all?'],
]

interface PondRulesProps {
  onJournal(): void
  onStartFishing(): void
  onNoticeboard(): void
  onClose(): void
  special?: { species: string; variant: string } | null
}

// The artist's painted pond sign (pond/notice-sign) with its old lettering painted out.
const BOARD_ART = staticUrl('/assets/pond/rules-board.png')

/** The pond rules sign from the 2026-11-26 mock; the noticeboard sits behind the link under it. */
export default function PondRules({ onJournal, onStartFishing, onNoticeboard, onClose, special = null }: PondRulesProps) {
  const today = special ? journalCatch(special.species, special.variant) : null
  return (
    <div className="pond-rules">
      <p className="pond-rules-place">{POND_SIGN_NAME}</p>
      <div className="pond-rules-sign">
        <img className="pond-rules-art" src={BOARD_ART} alt="" draggable={false} />
        <div className="pond-rules-board">
          <h2 id="pond-room-panel-title" className="pond-rules-title">
            Pond rules
          </h2>
          <ol className="pond-rules-list">
            {RULES.map((rule, index) => (
              <li key={rule[0]} style={{ top: `${[26.35, 40.94, 55.53, 70.59][index]}%` }}>
                <span className="pond-rules-number" aria-hidden="true">
                  {index + 1}
                </span>
                <span>
                  {rule.map((line, at) => (
                    <span key={line} className="pond-rules-line">
                      {at > 0 ? ' ' : null}
                      {line}
                    </span>
                  ))}
                </span>
              </li>
            ))}
          </ol>
          <p className="pond-rules-special">
            <span aria-hidden="true">★</span> Catch today’s special fish to win a prize!
          </p>
          {today && special ? (
            <p className="pond-rules-today">
              Today: <img src={catchArt(today)} alt="" /> <strong>{today.name}</strong>
              <span>
                · {gradeLabel(special.variant)} {journalFamily(special.species).label.toLowerCase()}
              </span>
            </p>
          ) : null}
        </div>
        <button type="button" className="pond-rules-button is-journal" onClick={onJournal}>
          Fish journal
        </button>
        <button type="button" className="pond-rules-button is-start" onClick={onStartFishing}>
          Start fishing
        </button>
      </div>
      <button type="button" className="pond-rules-notice" onClick={onNoticeboard}>
        Bounties &amp; pond records
      </button>
      <button type="button" className="pond-rules-close" onClick={onClose}>
        Close the pond rules
      </button>
    </div>
  )
}
