import { AnimatePresence, motion } from 'framer-motion'
import type { Season, Meta, PayoutRow } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import styles from './ManagerHoverCard.module.css'

interface ManagerHoverCardProps {
  season: Season
  meta: Meta
  payoutRows: PayoutRow[]
}

// SCOPE NOTE: this card shows 2011-SEASON-scoped stats only (rank, points,
// HMOTW tally, drought, season net) — a real "vs the field" career comparison
// would need `career`/`h2h`, which are still deliberately untyped until
// Milestone 9 (same reasoning as Milestone 5's payouts/hmotw scope note).
// This card gets richer once that data exists; it's not a placeholder, just
// scoped to what's actually typed right now.
//
// AnimatePresence is new here: normal React can't animate an element OUT,
// because the moment you stop rendering it, it's just gone — there's no
// "fading" a thing that no longer exists in the tree. AnimatePresence solves
// this by keeping the exiting element mounted just long enough to finish its
// exit animation before actually removing it. It needs the child to have a
// stable `key` so it can tell "this is the same card leaving" apart from
// "a new card arrived."
export default function ManagerHoverCard({ season, meta, payoutRows }: ManagerHoverCardProps) {
  const { displayed } = useHoveredManagerContext()

  if (!displayed || !season.active_managers.includes(displayed)) {
    return null
  }

  const rank = season.weekly_rank[displayed][season.weeks - 1]
  const points = season.cum_points[displayed][season.weeks - 1]
  const tally = season.hmotw_tally[displayed]
  const drought = meta.hmotw.drought_snapshot[String(season.year)]?.[displayed] ?? 0
  const net = payoutRows.find((r) => r.m === displayed)?.net ?? 0
  const color = meta.manager_colors[displayed] ?? '#888'

  return (
    <AnimatePresence>
      <motion.div
        key={displayed}
        className={styles.card}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.15 }}
      >
        <div className={styles.name} style={{ color }}>
          {displayed}
        </div>
        <div className={styles.row}>
          <span>Final rank</span>
          <span className={styles.rowValue}>#{rank}</span>
        </div>
        <div className={styles.row}>
          <span>Season points</span>
          <span className={styles.rowValue}>{points.toFixed(1)}</span>
        </div>
        <div className={styles.row}>
          <span>HMOTW tally</span>
          <span className={styles.rowValue}>{tally}</span>
        </div>
        <div className={styles.row}>
          <span>Drought at end</span>
          <span className={styles.rowValue}>{drought}w</span>
        </div>
        <div className={styles.row}>
          <span>Season net</span>
          <span className={styles.rowValue}>
            {net >= 0 ? '+' : ''}
            {net.toFixed(0)}
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
