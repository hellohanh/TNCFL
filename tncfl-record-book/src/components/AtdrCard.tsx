import type { RefObject } from 'react'
import type { AtdrRow, Meta } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import styles from './AtdrCard.module.css'

interface AtdrCardProps {
  rows: AtdrRow[]
  statusByYear: Record<string, string>
  meta: Meta
  rowRef: RefObject<HTMLDivElement | null>
  maxHeight: number
}

// Ported from the old hub's real atdrBody() geometry (rank-color gradient,
// drought-severity icons, "S2011 WK04" week-label format) — NOT its real
// row-count behavior. The hub renders every row hidden and reveals only as
// many as fit the Dancing Shoes sibling card's real height (sumFitAtdr());
// this port originally had NO cap at all (a real gap — 2014-2016 render 37-
// 60 rows unbounded). Per explicit user decision: rows are capped to the
// top 50 by the caller (SeasonPage.tsx), with only 15 visible at once via a
// real-measured scrollable window — not a re-attempt at the hub's
// sibling-height-matching mechanism, and not a hard "top 10" (an earlier,
// inaccurate comment here claimed that; the hub doesn't actually cap at any
// fixed number either).
//
// `rowRef`/`maxHeight` now come from the parent (SeasonPage.tsx), not a
// local `useRowCapHeight` call — this card is the height SOURCE (its own
// 15-row measurement), and SeasonTotalsCard is the height CONSUMER (reuses
// this same value rather than measuring its own rows), per explicit user
// request that both cards share one height, with ATDR's 15-entry height as
// the reference and however many rows that fits in Season Totals being
// whatever it is.
const RANK_COLORS = ['#D4A017', '#aaa', '#CD7F32', '#888', '#666', '#555', '#444', '#3a3a3a', '#333', '#2e2e2e']

function droughtIcon(len: number): string {
  if (len >= 25) return '\u{1F525}' // fire
  if (len >= 17) return '\u2600\uFE0F' // scorching sun
  if (len >= 9) return '\u{1F321}\uFE0F' // thermometer
  return '\u{1F335}' // cactus (1-8)
}

function fmtWkLabel(label: string | null): string {
  if (!label) return ''
  const m = label.match(/^(\d{4})-W(\d{2})$/)
  return m ? `S${m[1]} WK${m[2]}` : label
}

export default function AtdrCard({ rows, statusByYear, meta, rowRef, maxHeight }: AtdrCardProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  return (
    <div className={styles.card}>
      <div className={styles.title}>{'\u{1F525}'} All-Time Longest Drought</div>
      <div className={styles.scrollWrap} style={{ maxHeight, overflowY: 'auto' }}>
        <div className={styles.list}>
          {rows.map((r, i) => {
            const departed = statusByYear[r.m] === 'I' || statusByYear[r.m] === 'D'
            const rowDimmed = displayed !== null && displayed !== r.m
            const span = `${fmtWkLabel(r.start)} \u2192 ${r.ongoing ? 'ongoing' : fmtWkLabel(r.end)}`
            return (
              <div
                key={i}
                ref={i === 0 ? rowRef : undefined}
                className={`${styles.rec} ${departed ? styles.dim : ''}`}
                style={{ opacity: rowDimmed ? 0.4 : undefined, cursor: 'pointer' }}
                onMouseEnter={() => setHovered(r.m)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setPinned(r.m)
                }}
              >
                <span className={styles.icon}>{droughtIcon(r.length)}</span>
                <span className={styles.rank} style={{ color: RANK_COLORS[Math.min(i, RANK_COLORS.length - 1)] }}>
                  {r.rank}
                </span>
                <span className={styles.name} style={{ color: meta.manager_colors[r.m] ?? '#ccc' }}>
                  {r.m}
                </span>
                <span className={styles.val}>{r.length} wks</span>
                <span className={r.ongoing ? styles.tagOn : styles.tagEnd}>{r.ongoing ? 'ongoing' : 'ended'}</span>
                <span className={styles.span}>{span}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
