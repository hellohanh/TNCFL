import { Fragment } from 'react'
import type { Meta } from '../types/data'
import { computeCumulativeCompetence } from '../lib/computeCumulativeCompetence'
import MedalIcon from './MedalIcon'
import styles from './CumulativeCompetenceChart.module.css'

interface CumulativeCompetenceChartProps {
  career: Parameters<typeof computeCumulativeCompetence>[0]
  meta: Meta
}

// New all-time panel for the Records page — see computeCumulativeCompetence.ts
// for how the underlying numbers differ from the existing per-season
// CompetenceChart.tsx. The PRESENTATION here is a deliberate match to that
// existing component, not a new design: same title/emoji, same row layout
// and column widths, same "points per finish" legend box, same real
// MedalIcon at the same size — CumulativeCompetenceChart.module.css is
// CompetenceChart.module.css's rules verbatim (border-left color already
// matched, no changes needed there).
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

export default function CumulativeCompetenceChart({ career, meta }: CumulativeCompetenceChartProps) {
  const rows = computeCumulativeCompetence(career)
  return (
    <div className={styles.card}>
      <div className={styles.title}>{'\u{1F3C5}'} Cumulative Competence Chart</div>
      <div className={styles.list}>
        {rows.map((r) => {
          const dim = r.status === 'I' || r.status === 'D'
          return (
            <div key={r.m} className={`${styles.row} ${dim ? styles.dim : ''}`}>
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
