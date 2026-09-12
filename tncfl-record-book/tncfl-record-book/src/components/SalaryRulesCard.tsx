import type { PayoutsEntry } from '../types/data'
import { money, ord } from '../lib/format'
import styles from './SalaryRulesCard.module.css'

interface SalaryRulesCardProps {
  year: number
  payouts: PayoutsEntry
}

// Ported from the old hub's real renderSalary() rules-card logic (the pools/
// fees + prizes half only — the ledger table is a separate, later piece).
// Split percentages are static DISPLAY labels next to the real dollar amount
// from `season_split`, not computed from it — matches the hub exactly (it
// hardcodes the same label strings rather than deriving them from the pot).
const SPLIT_3: Record<string, string> = { '1': '50%', '2': '30%', '3': '20%' }
const SPLIT_4: Record<string, string> = { '1': '40%', '2': '30%', '3': '20%', '4': '10%' }

// The old hub hardcodes this badge to 2015 specifically (the season buy-in
// rose and the ring voucher was introduced) — not a general "changed since
// last year" indicator for any season.
const NEW_BADGE_YEAR = 2015

export default function SalaryRulesCard({ year, payouts: P }: SalaryRulesCardProps) {
  const isOld = P.ring === 0 // 2011-2014: 3 winners, no ring bonus
  const splitLabels = isOld ? SPLIT_3 : SPLIT_4
  const showNewBadge = year === NEW_BADGE_YEAR

  return (
    <div className={styles.wrap}>
      <div className="module-title-row">
        <div className="module-title">Salary Cap Contributions</div>
      </div>
      <div className="module-subtitle">
        The season&rsquo;s franchise economics — pools, fees, and prize structure
      </div>
      <div className={styles.head}>
        <div className={styles.rules}>
          <div className={styles.grid}>
            <div>
              <div className={`${styles.row} ${styles.rowHd}`}>Pools &amp; Fees</div>
              <div className={styles.row}>
                <span className={styles.k}>Buy-in</span>
                <span className={styles.v}>
                  {money(P.buyin)}/mgr
                  {showNewBadge && <span className={styles.newBadge}>NEW</span>}
                </span>
              </div>
              <div className={styles.row}>
                <span className={styles.k}>Prize pot</span>
                <span className={styles.v}>{money(P.pot)}</span>
              </div>
              {P.ring > 0 && (
                <div className={styles.row}>
                  <span className={styles.k}>Ring voucher</span>
                  <span className={styles.v}>
                    {money(P.ring)}
                    {showNewBadge && <span className={styles.newBadge}>NEW</span>}
                  </span>
                </div>
              )}
              <div className={styles.row}>
                <span className={styles.k}>HMOTW fee</span>
                <span className={styles.v}>{money(P.hmotw_fee)}/mgr</span>
              </div>
              <div className={styles.row}>
                <span className={styles.k}>Trans / Trade fee</span>
                <span className={styles.v}>
                  {money(P.trans_fee)} / {money(P.pr_rate)}
                </span>
              </div>
              {P.sidebet_pool > 0 && (
                <div className={styles.row}>
                  <span className={styles.k}>Sidebet pool</span>
                  <span className={styles.v}>{money(P.sidebet_pool)}</span>
                </div>
              )}
              {P.playoff_pool > 0 && (
                <div className={styles.row}>
                  <span className={styles.k}>Playoff pool</span>
                  <span className={styles.v}>{money(P.playoff_pool)}</span>
                </div>
              )}
            </div>
            <div>
              <div className={`${styles.row} ${styles.rowHd}`}>
                Prizes ({isOld ? '3' : '4'}-man)
              </div>
              {Object.keys(P.season_split).map((rk) => (
                <div className={styles.row} key={rk}>
                  <span className={styles.k}>
                    {ord(Number(rk))} ({splitLabels[rk] ?? ''})
                  </span>
                  <span className={styles.v}>
                    {money(P.season_split[rk])}
                    {rk === '1' && P.ring > 0 && (
                      <span className={styles.ringNote}> + {money(P.ring)} ring</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={styles.logo}>
          <img src={import.meta.env.BASE_URL + 'salary_logo.png'} alt="Salary Cap Contributions" />
        </div>
      </div>
    </div>
  )
}
