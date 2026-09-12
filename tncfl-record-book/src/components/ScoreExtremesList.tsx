import type { Meta } from '../types/data'
import styles from './RecordsExtraPanels.module.css'

interface ScoreEntry {
  sc: number
  m: string
  yr: string
  wk: number
}

interface ScoreExtremesListProps {
  title: string
  icon: string
  accent: 'gold' | 'blue'
  entries: ScoreEntry[]
  meta: Meta
  scrollable?: boolean // when the list is long (e.g. "every score >= 200"), cap height and scroll instead of showing everything at once — same scrollWrap pattern as AtdrCard
}

// Shared row shape for the Records page's "All-Time Highest/Lowest Single
// Week Score" panels (screenshot reference from the user) — same component,
// different data/title/accent color per instance.
export default function ScoreExtremesList({ title, icon, accent, entries, meta, scrollable }: ScoreExtremesListProps) {
  const rows = entries.map((s, i) => (
    <div className={styles.hlRow} key={`${s.m}-${s.yr}-${s.wk}`}>
      <span className={styles.hlRank}>{i + 1}.</span>
      <span className={styles.hlName} style={{ color: meta.manager_colors[s.m] ?? '#ccc' }}>
        {s.m}
      </span>
      <span className={styles.hlVal}>{s.sc.toFixed(2)}</span>
      <span className={styles.hlCtx}>
        S{s.yr} WK{String(s.wk).padStart(2, '0')}
      </span>
    </div>
  ))

  return (
    <div className={`${styles.card} ${accent === 'gold' ? styles.accentGold : styles.accentBlue}`}>
      <div className={styles.cardTitle}>
        {icon} {title}
      </div>
      {scrollable ? <div className={styles.scrollWrap}>{rows}</div> : rows}
    </div>
  )
}
