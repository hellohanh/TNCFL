import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { RecordBookData } from '../types/data'
import { computeLeagueRecords } from '../lib/computeLeagueRecords'
import { computeLowestScores } from '../lib/computeLowestScores'
import { computeHighScores } from '../lib/computeHighScores'
import { computeSeasonTotals } from '../lib/computeSeasonTotals'
import { useRowCapHeight } from '../lib/useRowCapHeight'
import LeagueRecordsGrid from './LeagueRecordsGrid'
import CumulativeCompetenceChart from './CumulativeCompetenceChart'
import ScoreExtremesList from './ScoreExtremesList'
import AtdrCard from './AtdrCard'
import SeasonTotalsCard from './SeasonTotalsCard'
import styles from './Records.module.css'

// LEAGUE sub-page. "All-Time Longest Drought" and "All-Time Season Totals"
// (added this session) are NOT new components — they're the exact same
// AtdrCard.tsx/SeasonTotalsCard.tsx already used on every SeasonPage,
// reused here with the most recent year's data (meta.years_desc[0]),
// which is already the full all-time picture (atdr_snapshots is a running
// cumulative snapshot; computeSeasonTotals with that year covers every
// season through it). Only difference from the SeasonPage usage: statusByYear
// doesn't make sense outside a specific season, so this uses each manager's
// actual current `career[m].status` instead.
export default function Records() {
  const data = useOutletContext<RecordBookData>()
  const records = computeLeagueRecords(data.career, data.payouts, data.meta.hmotw.top5_streaks, data.meta.years_desc)
  // Every real score >= 200, not just the top 21 — the premade
  // `all_time_scores` field only carries the top 25 (checked first, min
  // value 210.32), short of the 73 real weeks that actually clear 200.
  const highest = useMemo(() => computeHighScores(data.seasons, 200), [data.seasons])
  // Every real score <= 99.999, not a fixed top-21.
  const lowest = computeLowestScores(data.seasons, 99.999)

  const mostRecentYear = data.meta.years_desc[0]
  const atdrRows = (data.meta.hmotw.atdr_snapshots[mostRecentYear] || []).slice(0, 200)
  const currentStatusByManager = useMemo(() => {
    const map: Record<string, string> = {}
    for (const [m, c] of Object.entries(data.career)) map[m] = c.status
    return map
  }, [data.career])
  const { rowRef: atdrRowRef, maxHeight: atdrMaxHeight } = useRowCapHeight(15)
  const seasonTotals = useMemo(
    () => computeSeasonTotals(data.seasons, data.meta.years_desc, mostRecentYear, 200),
    [data.seasons, data.meta.years_desc, mostRecentYear],
  )

  return (
    <div>
      <div className="module-title">Records</div>
      <LeagueRecordsGrid records={records} meta={data.meta} />
      <div className={styles.row3}>
        <CumulativeCompetenceChart career={data.career} meta={data.meta} />
        <ScoreExtremesList
          title="All-Time Highest Single Week Score"
          icon="🏆"
          accent="gold"
          entries={highest}
          meta={data.meta}
          scrollable
        />
        <ScoreExtremesList
          title="All-Time Lowest Single Week Score"
          icon="💀"
          accent="blue"
          entries={lowest}
          meta={data.meta}
          scrollable
        />
      </div>
      <div className={styles.row2}>
        <AtdrCard
          rows={atdrRows}
          statusByYear={currentStatusByManager}
          meta={data.meta}
          rowRef={atdrRowRef}
          maxHeight={atdrMaxHeight}
        />
        <SeasonTotalsCard rows={seasonTotals} maxHeight={atdrMaxHeight} meta={data.meta} />
      </div>
    </div>
  )
}
