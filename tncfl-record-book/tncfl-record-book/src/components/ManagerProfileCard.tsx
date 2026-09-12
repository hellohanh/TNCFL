import type { CareerEntry, Meta, PayoutsEntry, StreakEntry } from '../types/data'
import { trophyImageSrc } from '../lib/computeTrophyCabinet'
import { MANAGER_BIOS } from '../lib/managerBios'
import { money } from '../lib/format'
import ManagerAvatar from './ManagerAvatar'
import AnimatedNumber from './AnimatedNumber'
import styles from './ManagerProfileCard.module.css'

interface ManagerProfileCardProps {
  name: string
  career: CareerEntry
  meta: Meta
  streaks: StreakEntry[] // ALL streaks — this component filters to this manager + 5+ weeks
  payouts: Record<string, PayoutsEntry>
}

const STATUS_LABEL: Record<string, string> = {
  A: 'Active',
  I: 'Inactive',
  D: 'Moved on from League',
  F: 'Future',
}

// Ported from the old hub's leagueShowProfile() (TNCFL_hub.html) — same
// derived stats (champion years, career totals, best season, rival,
// year-by-year rows), same 5+ week #1-streak filter. The bio text is new
// (2-paragraph rewrite, confirmed with the user — see managerBios.ts),
// everything else is the same real computation, just as JSX instead of
// string-built HTML.
export default function ManagerProfileCard({ name, career, meta, streaks, payouts }: ManagerProfileCardProps) {
  const color = meta.manager_colors[name] ?? '#aaa'
  const years = Object.keys(career.pts).sort()
  const champYears = Object.entries(career.rank)
    .filter(([, rk]) => rk === 1)
    .map(([y]) => y)
    .sort()
  const totalNet = Object.values(career.net).reduce((s, v) => s + v, 0)
  const totalTally = Object.values(career.tally).reduce((s, v) => s + v, 0)
  const totalPts = Object.values(career.pts).reduce((s, v) => s + v, 0)
  const bestYear = years.reduce((best, y) => ((career.pts[y] ?? 0) > (career.pts[best] ?? 0) ? y : best), years[0])
  const myStreaks = streaks.filter((s) => s.m === name && s.len >= 5).sort((a, b) => b.len - a.len)
  const bio = MANAGER_BIOS[name]

  function transactionsFor(year: string): { trans: number; trades: number } {
    const row = payouts[year]?.rows.find((r) => r.m === name)
    return { trans: row?.trans ?? 0, trades: row?.trades ?? 0 }
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <ManagerAvatar name={name} color={color} rings={champYears.length} status={career.status} size={72} />
        <div>
          <div className={styles.name} style={{ color }}>
            {name}
          </div>
          <span className={`${styles.statusPill} ${styles[`status${career.status}`] ?? ''}`}>
            {STATUS_LABEL[career.status] ?? career.status}
          </span>
        </div>
      </div>

      {bio && (
        <div className={styles.bio}>
          <p>{bio[0]}</p>
          <p>{bio[1]}</p>
        </div>
      )}

      <div className={styles.ringsRow}>
        {champYears.length > 0 ? (
          <>
            <img src={trophyImageSrc(champYears.length)} alt="" className={styles.ringsImg} />
            <span>
              {champYears.length} {champYears.length === 1 ? 'title' : 'titles'}: {champYears.join(', ')}
            </span>
          </>
        ) : (
          <span>No championship</span>
        )}
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <div className={styles.statVal}>
            <AnimatedNumber value={years.length} decimals={0} />
          </div>
          <div className={styles.statLbl}>Seasons</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal} style={{ color: totalNet >= 0 ? '#3ecf7e' : '#f87171' }}>
            {money(totalNet)}
          </div>
          <div className={styles.statLbl}>Career Net</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>
            <AnimatedNumber value={totalTally} decimals={1} />
          </div>
          <div className={styles.statLbl}>HMOTW Tally</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>
            <AnimatedNumber value={totalPts} decimals={0} />
          </div>
          <div className={styles.statLbl}>Career Pts</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statVal}>{bestYear && career.pts[bestYear] ? career.pts[bestYear].toFixed(1) : '—'}</div>
          <div className={styles.statLbl}>Best Season ({bestYear ?? '—'})</div>
        </div>
      </div>

      <div className={styles.streaksBlock}>
        <div className="module-title">5+ Week Reigns at #1</div>
        {myStreaks.length > 0 ? (
          <ul className={styles.streaksList}>
            {myStreaks.map((s, i) => {
              let span = `${s.sy} W${s.sw}`
              if (s.sy !== s.ey || s.sw !== s.ew) {
                span += s.cross ? ` \u2192 ${s.ey} W${s.ew} (cross-season)` : ` \u2192 W${s.ew}`
              }
              return (
                <li key={i}>
                  <strong>{s.len}w</strong> — {span}
                </li>
              )
            })}
          </ul>
        ) : (
          <div className={styles.streaksEmpty}>No streaks of 5+ weeks at the #1 position.</div>
        )}
      </div>

      <div className={styles.extraRow}>
        <div className={styles.extraItem}>
          <span className={styles.extraLbl}>Best Week</span>
          <span className={styles.extraVal}>
            {career.best_week ? `S${career.best_week.yr} Wk${String(career.best_week.wk).padStart(2, '0')} (${career.best_week.sc.toFixed(2)})` : '—'}
          </span>
        </div>
        <div className={styles.extraItem}>
          <span className={styles.extraLbl}>Worst Week</span>
          <span className={styles.extraVal}>
            {career.worst_week ? `S${career.worst_week.yr} Wk${String(career.worst_week.wk).padStart(2, '0')} (${career.worst_week.sc.toFixed(2)})` : '—'}
          </span>
        </div>
        <div className={styles.extraItem}>
          <span className={styles.extraLbl}>Transactions</span>
          <span className={styles.extraVal}>{career.trans}</span>
        </div>
        <div className={styles.extraItem}>
          <span className={styles.extraLbl}>Trades</span>
          <span className={styles.extraVal}>{career.trades}</span>
        </div>
        <div className={`${styles.extraItem} ${styles.extraWide}`}>
          <span className={styles.extraLbl}>Biggest Rivalry</span>
          <span className={styles.extraVal}>
            {career.rival ? (
              <>
                <span style={{ color: meta.manager_colors[career.rival.name] ?? '#aaa' }}>{career.rival.name}</span> (
                {name} {career.rival.my_wins}–{career.rival.their_wins} vs them)
              </>
            ) : (
              '—'
            )}
          </span>
        </div>
      </div>

      {years.length > 0 && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.left}>Year</th>
                <th>Pts</th>
                <th>Finish</th>
                <th>Net</th>
                <th>HMOTW Tally</th>
                <th>Transactions</th>
                <th>Trades</th>
              </tr>
            </thead>
            <tbody>
              {years.map((y) => {
                const rk = career.rank[y]
                const net = career.net[y]
                const tal = career.tally[y] ?? 0
                const { trans, trades } = transactionsFor(y)
                const champ = rk === 1
                return (
                  <tr key={y} className={champ ? styles.champYr : undefined}>
                    <td className={styles.left}>{y}</td>
                    <td>{career.pts[y] != null ? career.pts[y].toFixed(2) : '—'}</td>
                    <td>
                      {rk ?? '—'}
                      {champ ? ' 🏆' : ''}
                    </td>
                    <td style={{ color: net >= 0 ? '#3ecf7e' : '#f87171' }}>{money(net)}</td>
                    <td>{tal}</td>
                    <td>{trans}</td>
                    <td>{trades}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
