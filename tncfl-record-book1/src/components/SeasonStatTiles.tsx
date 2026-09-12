import type { Season, Meta } from '../types/data'
import type { SeasonSummaryComputed } from '../lib/useSeasonSummary'
import { useManagerHover } from '../lib/useManagerHover'
import styles from './SeasonStatTiles.module.css'

interface SeasonStatTilesProps {
  season: Season
  summary: SeasonSummaryComputed
  meta: Meta
}

// The dense, Baseball-Savant-flavored half of the mockup — small tiles,
// Segoe UI numbers (a deliberate exception to this project's usual
// "data stays monospace" rule — a specific request for THIS panel only,
// other data tables like ScoreTable are unaffected), no decoration beyond a
// manager-color accent on the high-week figure. Every value here is either
// a raw typed field (manager_count, weeks) or something already computed in
// useSeasonSummary — nothing new is calculated in this component itself.
export default function SeasonStatTiles({ season, summary, meta }: SeasonStatTilesProps) {
  // Single calls, safe for the same reason as SeasonHero — each of these is
  // exactly one manager name in this component, not a list being mapped.
  const leaderHover = useManagerHover(summary.hmotwLeader.manager)
  const highWeekHover = useManagerHover(summary.highestWeek.manager)
  const highWeekColor = meta.manager_colors[summary.highestWeek.manager] ?? '#d9a521'
  const leaderColor = meta.manager_colors[summary.hmotwLeader.manager] ?? '#f2f2f0'

  return (
    <div className={styles.grid}>
      <div className={styles.tile}>
        <div className={styles.label}>managers</div>
        <div className={styles.value}>{season.manager_count}</div>
      </div>
      <div className={styles.tile}>
        <div className={styles.label}>weeks</div>
        <div className={styles.value}>{season.weeks}</div>
      </div>
      <div className={styles.tile}>
        <div className={styles.label}>high week</div>
        <div
          className={styles.valueAccent}
          style={{ color: highWeekColor }}
          onMouseEnter={highWeekHover.onMouseEnter}
          onMouseLeave={highWeekHover.onMouseLeave}
        >
          {summary.highestWeek.score.toFixed(1)}; {summary.highestWeek.manager} W
          {summary.highestWeek.week}
        </div>
      </div>
      <div className={styles.tile}>
        <div className={styles.label}>hmotw leader</div>
        <div
          className={styles.valueAccent}
          style={{ color: leaderColor }}
          onMouseEnter={leaderHover.onMouseEnter}
          onMouseLeave={leaderHover.onMouseLeave}
        >
          {summary.hmotwLeader.manager}; {summary.hmotwLeader.tally}{' '}
          {summary.hmotwLeader.tally === 1 ? 'week' : 'weeks'}
        </div>
      </div>
    </div>
  )
}
