import type { Meta } from '../types/data'
import styles from './SeasonTotalsCard.module.css'

export interface SeasonTotalEntry {
  rank: number
  m: string
  total: number
  year: number
}

interface SeasonTotalsCardProps {
  rows: SeasonTotalEntry[]
  maxHeight: number
  meta: Meta
}

// Unlike every other card this session, this one has no real hub markup to
// port — it only ever existed as a one-off authored nugget (static prose,
// not a live computed feature) the one time it appeared in the real hub
// data (around 2025). Per the user's explicit request, this is rebuilt here
// as a genuinely dynamic leaderboard: every manager-season's final point
// total, across every season through the selected year, ranked. Derived
// client-side from season.cum_points since no engine field already
// computes this (checked all_time_scores and cumulative first — neither is
// it). Visual style follows the reference screenshot rather than a ported
// hub rule, since none exists for this as a standalone card.
//
// Row-count handling (revisited twice during Milestone 16 batch 2): first a
// flat unscrollable top-15, then each card independently capped/scrolled to
// its own 15-row height (which surfaced a real cross-card stretch bug — see
// SESSION_LEDGER Entry 49). Per the user's final explicit call: this card no
// longer measures its own rows at all — it takes `maxHeight` as a prop,
// the SAME value AtdrCard computes from its own 15-entry height (the
// reference), so both cards are always exactly the same height. However
// many Season Totals rows actually fit in that height is fine/expected —
// no attempt is made to also show exactly 15 here.
//
// Manager name color (added this session, site-wide — every place this
// card is used, not just Records): was plain default text; now uses
// meta.manager_colors[m], matching the color convention every other
// manager-name display in this app already follows.
export default function SeasonTotalsCard({ rows, maxHeight, meta }: SeasonTotalsCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.title}>{'\u{1F947}'} All-Time Season Totals</div>
      <div className={styles.scrollWrap} style={{ maxHeight, overflowY: 'auto' }}>
        <div className={styles.list}>
          {rows.map((r) => (
            <div key={`${r.m}-${r.year}`} className={styles.row}>
              <span className={styles.rank}>#{r.rank}</span>
              <span className={styles.name} style={{ color: meta.manager_colors[r.m] ?? '#e8e8e8' }}>
                {r.m}
              </span>
              <span className={styles.total}>
                {r.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={styles.year}>({r.year})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
