import { Fragment } from 'react'
import type { CompetenceRow, Meta } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import MedalIcon from './MedalIcon'
import styles from './CompetenceChart.module.css'

interface CompetenceChartProps {
  rows: CompetenceRow[]
  meta: Meta
}

// Ported from the old hub's real competenceBody() — a ranked points-per-
// finish leaderboard (already computed by the engine, summary[year].competence
// — never re-derived client-side) with medal icons and a "points per finish"
// legend. Rendered as its own standalone nugget-styled card (left accent
// stripe, rounded corners — same treatment as Dancing Shoes), per the user's
// explicit call, rather than folded into NuggetGrid's own rendering loop.
const LEGEND: Array<[string, string]> = [
  ['1st', '10'],
  ['2nd', '5'],
  ['3rd', '2'],
  ['4th', '1'],
  ['5th', '0.9'],
  ['6th', '0.8'],
  ['7th', '0.7'],
  ['8th', '0.6'],
  ['9th', '0.5'],
  ['10th', '0.4'],
]
const MEDAL_TYPES = ['gold', 'silver', 'bronze', 'nickel'] as const

export default function CompetenceChart({ rows, meta }: CompetenceChartProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  return (
    <div className={styles.card}>
      <div className={styles.title}>{'\u{1F3C5}'} Cumulative Competence Chart</div>
      <div className={styles.list}>
        {rows.map((r) => {
          const departed = r.status === 'I' || r.status === 'D'
          const rowDimmed = displayed !== null && displayed !== r.m
          return (
            <div
              key={r.m}
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
              <span className={styles.pts}>{r.pts.toFixed(1)}</span>
              <span className={styles.name} style={{ color: meta.manager_colors[r.m] ?? '#ccc' }}>
                {r.m}
              </span>
              <span className={styles.medals}>
                {MEDAL_TYPES.flatMap((type) =>
                  Array.from({ length: r.medals[type] || 0 }, (_, i) => (
                    <MedalIcon key={`${type}-${i}`} type={type} size={18} />
                  )),
                )}
              </span>
            </div>
          )
        })}
      </div>
      <div className={styles.legend}>
        <div className={styles.legTitle}>POINTS PER FINISH</div>
        <div className={styles.legGrid}>
          {LEGEND.map(([place, pts]) => (
            <Fragment key={place}>
              <span className={styles.legPl}>{place}</span>
              <span className={styles.legPt}>{pts}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
