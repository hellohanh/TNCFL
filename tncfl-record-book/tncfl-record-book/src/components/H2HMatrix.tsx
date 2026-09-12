import type { Meta } from '../types/data'
import { computeH2HMatrixManagers, h2hGet } from '../lib/computeH2H'
import styles from './H2HMatrix.module.css'

interface H2HMatrixProps {
  h2h: Record<string, number>
  career: Parameters<typeof computeH2HMatrixManagers>[0]
  meta: Meta
}

// Ported from the old hub's real matrixCell()/matrixMgrs — active managers
// only, sorted by career net descending, cell color by win-dominance
// (green >=60%, red <=40%, neutral between), "N/A" for pairs who've never
// played each other.
export default function H2HMatrix({ h2h, career, meta }: H2HMatrixProps) {
  const managers = computeH2HMatrixManagers(career)

  function cellStyle(a: string, b: string) {
    const wa = h2hGet(h2h, a, b)
    const wb = h2hGet(h2h, b, a)
    const total = wa + wb
    if (!total) return { bg: undefined, txt: '#666', label: 'N/A' }
    const pct = wa / total
    const bg =
      pct >= 0.6 ? `rgba(15, 110, 86, ${0.3 + pct * 0.3})` : pct <= 0.4 ? `rgba(163, 45, 45, ${0.3 + (1 - pct) * 0.3})` : 'rgba(40, 40, 40, 0.6)'
    const txt = pct >= 0.6 ? '#9fd4a0' : pct <= 0.4 ? '#ffb3b3' : '#ccc'
    return { bg, txt, label: `${wa}-${wb}` }
  }

  return (
    <div>
      <p className={styles.note}>
        Active managers only &middot; W-L record (row manager vs column manager) &middot; Green = dominant (&gt;60%) &middot; Red = losing
        (&lt;40%)
      </p>
      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.corner}>vs &rarr;</th>
              {managers.map((m) => (
                <th key={m} className={styles.colHdr} style={{ color: meta.manager_colors[m] ?? '#aaa' }}>
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {managers.map((a) => (
              <tr key={a}>
                <th className={styles.rowHdr} style={{ color: meta.manager_colors[a] ?? '#aaa' }}>
                  {a}
                </th>
                {managers.map((b) => {
                  if (a === b) return <td key={b} className={styles.self}>&mdash;</td>
                  const { bg, txt, label } = cellStyle(a, b)
                  return (
                    <td key={b} className={styles.cell} style={{ background: bg, color: txt }} title={`${a} vs ${b}: ${label}`}>
                      {label}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
