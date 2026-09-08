import { useState } from 'react'
import type { Meta } from '../types/data'
import { computeDuel } from '../lib/computeH2H'
import styles from './H2HDuelPicker.module.css'

interface H2HDuelPickerProps {
  h2h: Record<string, number>
  career: Parameters<typeof computeDuel>[1]
  meta: Meta
  allPlayers: string[]
}

// Ported from the old hub's real renderDuel() — win/loss record, win-%
// bar, and a shared-seasons table with the winner highlighted each year.
export default function H2HDuelPicker({ h2h, career, meta, allPlayers }: H2HDuelPickerProps) {
  // Matches the old hub's real default (ALL_MGRS[0] for the first select,
  // 'Randy' explicitly for the second) rather than "first two alphabetically"
  // — which on this roster is Aidan vs Bao, a pairing with zero shared
  // seasons and an empty result on first load.
  const [a, setA] = useState(allPlayers[0] ?? '')
  const [b, setB] = useState(allPlayers.includes('Randy') ? 'Randy' : (allPlayers[1] ?? ''))
  const color = (m: string) => meta.manager_colors[m] ?? '#aaa'

  if (a === b) {
    return (
      <div>
        <Pickers a={a} b={b} setA={setA} setB={setB} allPlayers={allPlayers} />
        <p className={styles.same}>Select two different managers.</p>
      </div>
    )
  }

  const duel = computeDuel(h2h, career, a, b)

  return (
    <div>
      <Pickers a={a} b={b} setA={setA} setB={setB} allPlayers={allPlayers} />
      <div className={styles.card}>
        <div className={styles.banner}>
          <div className={styles.mgr} style={{ color: color(a) }}>
            {a}
          </div>
          <div className={styles.record}>
            <div className={styles.recNum} style={{ color: duel.winsA > duel.winsB ? color(a) : '#eee' }}>
              {duel.winsA}
            </div>
            <div className={styles.dash}>&ndash;</div>
            <div className={styles.recNum} style={{ color: duel.winsB > duel.winsA ? color(b) : '#eee' }}>
              {duel.winsB}
            </div>
          </div>
          <div className={styles.mgr} style={{ color: color(b) }}>
            {b}
          </div>
        </div>
        <div className={styles.pctBar}>
          <div className={styles.pctFill} style={{ width: `${duel.pctA}%`, background: color(a) }} />
          <div className={styles.pctFill} style={{ width: `${duel.pctB}%`, background: color(b) }} />
        </div>
        <div className={styles.pctLabels}>
          <span style={{ color: color(a) }}>{duel.pctA.toFixed(1)}%</span>
          <span className={styles.pctTotal}>{duel.total} shared weeks</span>
          <span style={{ color: color(b) }}>{duel.pctB.toFixed(1)}%</span>
        </div>

        {duel.years.length > 0 ? (
          <table className={styles.yrTable}>
            <thead>
              <tr>
                <th className={styles.left}>Year</th>
                <th style={{ color: color(a) }}>{a} Pts</th>
                <th style={{ color: color(b) }}>{b} Pts</th>
                <th>Edge</th>
                <th>
                  Finish ({a}/{b})
                </th>
              </tr>
            </thead>
            <tbody>
              {duel.years.map((y) => (
                <tr key={y.year}>
                  <td className={styles.left}>{y.year}</td>
                  <td style={y.winner === 'a' ? { color: color(a), fontWeight: 700 } : undefined}>{y.ptsA.toFixed(2)}</td>
                  <td style={y.winner === 'b' ? { color: color(b), fontWeight: 700 } : undefined}>{y.ptsB.toFixed(2)}</td>
                  <td>{y.winner ? `${y.winner === 'a' ? a : b} +${y.diff.toFixed(2)}` : 'Tie'}</td>
                  <td>
                    {y.rankA ?? '\u2014'} / {y.rankB ?? '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noShared}>No shared seasons.</p>
        )}
      </div>
    </div>
  )
}

interface PickersProps {
  a: string
  b: string
  setA: (m: string) => void
  setB: (m: string) => void
  allPlayers: string[]
}

function Pickers({ a, b, setA, setB, allPlayers }: PickersProps) {
  return (
    <div className={styles.pickers}>
      <select className={styles.sel} value={a} onChange={(e) => setA(e.target.value)}>
        {allPlayers.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
      <span className={styles.vs}>vs</span>
      <select className={styles.sel} value={b} onChange={(e) => setB(e.target.value)}>
        {allPlayers.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  )
}
