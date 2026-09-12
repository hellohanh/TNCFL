import { forwardRef } from 'react'
import type { WeekExtremeRow, Meta } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import styles from './WeekExtremeCard.module.css'

interface WeekExtremeCardProps {
  title: string
  accentColor: string
  rows: WeekExtremeRow[]
  meta: Meta
  listRef?: React.Ref<HTMLDivElement>
}

// Ported from the old hub's real weeksBody() — shared markup for both
// "All-Time Highest Single Week Score" (topweeks) and "...Lowest..."
// (lowweeks); the hub uses the same tw-row/tw-name/tw-score/tw-week classes
// for both, just a different accent color and title.
function fmtWkS2(year: number, week: number): string {
  return `S${year} WK ${week < 10 ? '0' + week : week}`
}

const WeekExtremeCard = forwardRef<HTMLDivElement, WeekExtremeCardProps>(function WeekExtremeCard(
  { title, accentColor, rows, meta, listRef },
  cardRef,
) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  return (
    <div className={styles.card} style={{ borderLeftColor: accentColor }} ref={cardRef}>
      <div className={styles.title}>{title}</div>
      <div className={styles.list} ref={listRef}>
        {rows.map((r, i) => {
          const departed = r.status === 'I' || r.status === 'D'
          const rowDimmed = displayed !== null && displayed !== r.m
          return (
            <div
              key={i}
              className={`${styles.row} ${departed ? styles.dim : ''}`}
              style={{ opacity: rowDimmed ? 0.4 : undefined, cursor: 'pointer' }}
              onMouseEnter={() => setHovered(r.m)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation()
                setPinned(r.m)
              }}
            >
              <span className={styles.rank}>{r.rank}.</span>
              <span className={styles.name} style={{ color: meta.manager_colors[r.m] ?? '#ccc' }}>
                {r.m}
              </span>
              <span className={styles.score}>{r.score.toFixed(2)}</span>
              <span className={styles.week}>{fmtWkS2(r.year, r.week)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
})

export default WeekExtremeCard
