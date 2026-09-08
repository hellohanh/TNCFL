import { useEffect, useState } from 'react'
import type { Season } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import styles from './ScoreTable.module.css'

interface ScoreTableProps {
  season: Season
  championName: string
}

// Determines which pill (if any) a score cell gets. Derived and fully
// clarified with the user, including the two real edge cases that came up:
// a score of exactly 200.0 counts as "≥200" (goes in the red/red-mustard
// bucket, confirmed against 5 real occurrences across the dataset), and a
// weekly winner scoring under 100 would take the blue branch — confirmed
// via the real data that this has never actually happened in 15 seasons,
// so it's a moot case, not a guessed default.
type PillType = 'blue' | 'mustard' | 'red' | 'diag' | null

function getPillType(score: number, isWeeklyHigh: boolean): PillType {
  if (score < 100) return 'blue'
  if (score >= 200) return isWeeklyHigh ? 'diag' : 'red'
  if (isWeeklyHigh) return 'mustard' // 100 <= score < 200
  return null
}

const PILL_CLASS: Record<Exclude<PillType, null>, string> = {
  blue: styles.pillBlue,
  mustard: styles.pillMustard,
  red: styles.pillRed,
  diag: styles.pillDiag,
}

// Milestone 7p: click-to-sort columns. 'manager' and 'total' are their own
// sort keys; a week column sorts by its own index (0 = W1). Default state is
// alphabetical by manager name — confirmed with the user, along with every
// other behavior below (first click on a Week/Total column sorts
// highest-first; clicking the same header again flips direction; no sort
// indicator glyph; switching seasons resets back to the alphabetical
// default rather than carrying the sort over).
type SortKey = 'manager' | 'total' | number
type SortDir = 'asc' | 'desc'

// Real score table, replacing the placeholder text from Milestone 2.
//
// NOTE on hover wiring: this reads useHoveredManagerContext() ONCE, at the
// top of the component — not useManagerHover() per row inside the .map()
// below. Hooks must be called the same number of times, in the same order,
// on every render (the "Rules of Hooks"); calling one inside a loop breaks
// that guarantee the moment the manager list's length or order ever changes.
// Reading the context once and building each row's handlers as plain
// functions gets the same behavior without that risk.
export default function ScoreTable({ season, championName }: ScoreTableProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const spotlit = mode === 'moneyCircle' ? new Set(season.money_circle) : null

  const [sortKey, setSortKey] = useState<SortKey>('manager')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  // Reset to the alphabetical default on every season change, per the
  // user's explicit call — sort state does NOT carry over across seasons.
  useEffect(() => {
    setSortKey('manager')
    setSortDir('asc')
  }, [season.year])

  function handleHeaderClick(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      // Manager defaults to A→Z on first click of that column; Week/Total
      // columns default to highest-first — both per the user's confirmed
      // answers, not a single shared default.
      setSortDir(key === 'manager' ? 'asc' : 'desc')
    }
  }

  function valueFor(manager: string, key: SortKey): number | string {
    if (key === 'manager') return manager
    if (key === 'total') return season.cum_points[manager][season.weeks - 1]
    return season.scores[manager][key]
  }

  const sortedManagers = [...season.active_managers]
    .filter((m) => !spotlit || spotlit.has(m))
    .sort((a, b) => {
      const va = valueFor(a, sortKey)
      const vb = valueFor(b, sortKey)
      let cmp: number
      if (typeof va === 'string' && typeof vb === 'string') {
        cmp = va.localeCompare(vb)
      } else {
        cmp = (va as number) - (vb as number)
      }
      if (cmp === 0) cmp = a.localeCompare(b) // stable tie-break on ties
      return sortDir === 'asc' ? cmp : -cmp
    })

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={styles.sortable} onClick={() => handleHeaderClick('manager')}>
              Manager
              {sortKey === 'manager' && (sortDir === 'asc' ? ' \u25b2' : ' \u25bc')}
            </th>
            <th className={styles.sortable} onClick={() => handleHeaderClick('total')}>
              Total
              {sortKey === 'total' && (sortDir === 'asc' ? ' \u25b2' : ' \u25bc')}
            </th>
            {Array.from({ length: season.weeks }, (_, i) => (
              <th key={i} className={styles.sortable} onClick={() => handleHeaderClick(i)}>
                W{i + 1}
                {sortKey === i && (sortDir === 'asc' ? ' \u25b2' : ' \u25bc')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedManagers.map((manager) => {
            const isChampion = manager === championName
            return (
              <tr key={manager} className={isChampion ? styles.championRow : undefined}>
                <td
                  className={styles.managerCell}
                  onMouseEnter={() => setHovered(manager)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setPinned(manager)
                  }}
                  style={{ opacity: displayed === manager ? 1 : undefined, cursor: 'pointer' }}
                >
                  {manager}
                </td>
                <td className={styles.totalCell}>
                  {season.cum_points[manager][season.weeks - 1].toFixed(1)}
                </td>
                {season.scores[manager].map((score, weekIndex) => {
                  const isWeeklyHigh = score === season.weekly_high[weekIndex]
                  const pill = getPillType(score, isWeeklyHigh)
                  return (
                    <td key={weekIndex}>
                      {pill ? (
                        <span className={`${styles.pill} ${PILL_CLASS[pill]}`}>
                          {score.toFixed(1)}
                        </span>
                      ) : (
                        score.toFixed(1)
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
