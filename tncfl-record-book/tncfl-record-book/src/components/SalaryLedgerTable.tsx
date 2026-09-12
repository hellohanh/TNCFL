import { Fragment, useState } from 'react'
import type { Meta } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import { money, money2, ord } from '../lib/format'
import styles from './SalaryLedgerTable.module.css'

// Shared shape covering both PayoutRow (season-scoped, Milestone 10) and
// CumulativeRow (career-scoped CSCC) — every field this table actually
// reads. `active` is CumulativeRow-only; season rows are always active.
interface LedgerRowLike {
  m: string
  rk: number
  tal: number
  trans: number
  trades: number
  buyin: number
  sbi: number
  poi: number
  hmcost: number
  trans_fee: number
  trade_fee: number
  hm: number
  sbo: number
  poo: number
  season_purse: number
  net: number
  active?: boolean
}

interface SalaryLedgerTableProps {
  rows: LedgerRowLike[]
  meta: Meta
  /** season.money_circle — needed for the manager filter's Money Circle
   * mode. Same set works for both the season-scoped SCC table and the
   * career-scoped CSCC table (the hub applies the CURRENT season's money
   * circle to both, not a per-year-in-the-ledger concept). */
  moneyCircle: string[]
  /** "Season" for the per-season SCC table (Milestone 10), "Career" for the
   * cumulative CSCC table — matches the hub's real renderCSCC() label swap. */
  seasonPurseLabel?: string
}

// Ported from the old hub's real renderSalary() ledger-table logic (the
// 16-column itemized table — the rules card above is a separate piece).
type ColKey =
  | 'm'
  | 'rk'
  | 'tal'
  | 'trans'
  | 'trades'
  | 'buyin'
  | 'sbi'
  | 'poi'
  | 'hmcost'
  | 'trans_fee'
  | 'trade_fee'
  | 'hm'
  | 'sbo'
  | 'poo'
  | 'season_purse'
  | 'net'

// Column order, labels, and pixel widths all pulled directly from the hub's
// real SAL_COLS / salColgroup() — not re-derived or eyeballed from a
// screenshot.
const SAL_COLS: { key: ColKey; label: string; width: number }[] = [
  { key: 'm', label: 'Manager', width: 78 },
  { key: 'rk', label: 'Finish', width: 50 },
  { key: 'tal', label: 'HMOTW', width: 48 },
  { key: 'trans', label: 'Trans', width: 48 },
  { key: 'trades', label: 'Trades', width: 50 },
  { key: 'buyin', label: 'Buy In', width: 60 },
  { key: 'sbi', label: 'Sidebet', width: 66 },
  { key: 'poi', label: 'Playoff', width: 62 },
  { key: 'hmcost', label: 'HMOTW', width: 68 },
  { key: 'trans_fee', label: 'Trans Fee', width: 68 },
  { key: 'trade_fee', label: 'Trade Fee', width: 68 },
  { key: 'hm', label: 'HMOTW', width: 76 },
  { key: 'sbo', label: 'Side Bet', width: 70 },
  { key: 'poo', label: 'Playoff', width: 66 },
  { key: 'season_purse', label: 'Season', width: 82 },
  { key: 'net', label: 'Net', width: 92 },
]

// Net + Season Purse always show 2 decimals (money2); every other money
// column drops decimals when the value is whole (money). Every column that
// reaches the generic branch below (i.e. not m/rk/tal/trans/trades/net)
// shows an em-dash instead of $0 when the value is zero.
const TWO_DECIMAL_COLS = new Set<ColKey>(['net', 'season_purse'])

function valueFor(row: LedgerRowLike, key: ColKey): number | string {
  if (key === 'm') return row.m
  return row[key]
}

export default function SalaryLedgerTable({ rows, meta, moneyCircle, seasonPurseLabel = 'Season' }: SalaryLedgerTableProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const spotlit = mode === 'moneyCircle' ? new Set(moneyCircle) : null
  const [sortCol, setSortCol] = useState<ColKey>('net')
  const [sortDir, setSortDir] = useState<1 | -1>(-1) // default: Net high -> low

  function handleHeaderClick(key: ColKey) {
    if (key === sortCol) {
      setSortDir((d) => (d === 1 ? -1 : 1) as 1 | -1)
    } else {
      setSortCol(key)
      setSortDir(key === 'm' ? 1 : -1)
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = valueFor(a, sortCol)
    const bv = valueFor(b, sortCol)
    if (typeof av === 'string' && typeof bv === 'string') {
      return sortDir * av.localeCompare(bv)
    }
    return sortDir * ((Number(av) || 0) - (Number(bv) || 0))
  })

  function renderCell(row: LedgerRowLike, key: ColKey) {
    if (key === 'm') {
      return (
        <td className={styles.left} key={key}>
          <span className={styles.dot} style={{ background: meta.manager_colors[row.m] }} />
          {row.m}
        </td>
      )
    }
    if (key === 'rk') return <td key={key}>{ord(row.rk)}</td>
    if (key === 'tal') return <td key={key}>{row.tal}</td>
    if (key === 'trans' || key === 'trades') return <td key={key}>{row[key]}</td>
    if (key === 'net') {
      const departed = row.active === false
      return (
        <td key={key} className={row.net >= 0 ? (departed ? styles.gpDeparted : styles.gp) : departed ? styles.rpDeparted : styles.rp}>
          {money2(row.net)}
        </td>
      )
    }
    const v = row[key] || 0
    const formatted = TWO_DECIMAL_COLS.has(key) ? money2(v) : money(v)
    return <td key={key}>{v ? formatted : '\u2014'}</td>
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <colgroup>
          {SAL_COLS.map((c) => (
            <Fragment key={c.key}>
              <col style={{ width: c.width }} />
              {(c.key === 'trade_fee' || c.key === 'season_purse') && <col style={{ width: 10 }} />}
            </Fragment>
          ))}
        </colgroup>
        <thead>
          <tr>
            <th colSpan={5} className={styles.grpBlank} />
            <th colSpan={6} className={`${styles.grp} ${styles.grpFee}`}>
              Franchise Fee
            </th>
            <th className={styles.grpGap} />
            <th colSpan={4} className={`${styles.grp} ${styles.grpPurse}`}>
              Purse
            </th>
            <th className={styles.grpGap} />
            <th className={`${styles.grp} ${styles.grpNet}`}>Net</th>
          </tr>
          <tr>
            {SAL_COLS.map((c) => (
              <Fragment key={c.key}>
                <th
                  className={`${styles.sortable} ${c.key === 'm' ? styles.left : ''}`}
                  onClick={() => handleHeaderClick(c.key)}
                >
                  {c.key === 'season_purse' ? seasonPurseLabel : c.label}
                  {sortCol === c.key && (sortDir === 1 ? ' \u25b2' : ' \u25bc')}
                </th>
                {(c.key === 'trade_fee' || c.key === 'season_purse') && (
                  <th className={styles.grpGap} />
                )}
              </Fragment>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => {
            const rowDimmed = displayed !== null && displayed !== row.m
            const filteredOut = spotlit !== null && !spotlit.has(row.m)
            return (
              <tr
                key={row.m}
                className={`${row.active === false ? styles.departed : ''} ${filteredOut ? styles.faded : ''}`}
                style={{ opacity: rowDimmed && !filteredOut ? 0.4 : undefined, cursor: 'pointer' }}
                onMouseEnter={() => setHovered(row.m)}
                onMouseLeave={() => setHovered(null)}
                onClick={(e) => {
                  e.stopPropagation()
                  setPinned(row.m)
                }}
              >
                {SAL_COLS.map((c) => (
                  <Fragment key={c.key}>
                    {renderCell(row, c.key)}
                    {(c.key === 'trade_fee' || c.key === 'season_purse') && (
                      <td className={styles.grpGap} />
                    )}
                  </Fragment>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
