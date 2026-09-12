import type { Meta } from '../types/data'
import { type LeagueRecords } from '../lib/computeLeagueRecords'
import { money } from '../lib/format'
import AnimatedNumber from './AnimatedNumber'
import styles from './LeagueRecordsGrid.module.css'

interface LeagueRecordsGridProps {
  records: LeagueRecords
  meta: Meta
}

// Ported from the old hub's real 9-card "League Records" grid
// (`.hof-rec-grid`/`.hof-rec-card`, TNCFL_hub.html) — same 9 cards, same
// numbers (all independently re-derived from real data in
// computeLeagueRecords.ts). Styled to this app's existing SeasonStatTiles
// grid convention (hairline-border tile grid) rather than the old hub's
// filled `.hof-rec-card` boxes — but the per-card VALUE color is ported
// exactly from the hub's real `data-color` attributes, not left plain
// white as an earlier pass here had it: Seasons Played and Money Through
// League use the site's brand red, Total Managers uses the site's lock
// green, Champions uses the MOST RECENT champion's color (not a fixed
// manager), and the 5 record cards use the record-holder's own color on
// the number itself (not just the sub-line, which was this component's
// original mistake).
const BRAND_RED = '#c0252b'
const LOCK_GREEN = '#4ec79e'

export default function LeagueRecordsGrid({ records: r, meta }: LeagueRecordsGridProps) {
  const color = (m: string) => meta.manager_colors[m] ?? '#aaa'

  return (
    <div className={styles.grid}>
      <div className={styles.tile}>
        <div className={styles.val} style={{ color: BRAND_RED }}>
          <AnimatedNumber value={r.seasonsPlayed} decimals={0} />
        </div>
        <div className={styles.lbl}>Seasons Played</div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: LOCK_GREEN }}>
          <AnimatedNumber value={r.totalManagers} decimals={0} />
        </div>
        <div className={styles.lbl}>Total Managers</div>
        <div className={styles.sub}>
          {r.activeCount} active &middot; {r.inactiveCount} inactive &middot; {r.departedCount} moved on from league
        </div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: color(r.mostRecentChampion) }}>
          <AnimatedNumber value={r.championCount} decimals={0} />
        </div>
        <div className={styles.lbl}>Champions</div>
        <div className={styles.sub}>{r.championNames.join(' \u00b7 ')}</div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: BRAND_RED }}>
          {money(r.moneyThroughLeague)}
        </div>
        <div className={styles.lbl}>Money Through League</div>
        <div className={styles.sub}>{r.seasonsPlayed} seasons &middot; all pools</div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: color(r.netLeader.m) }}>
          {r.netLeader.m}
        </div>
        <div className={styles.lbl}>All-Time Net Leader</div>
        <div className={styles.sub}>
          {money(r.netLeader.net)} &middot; {r.netLeader.rings} {r.netLeader.rings === 1 ? 'ring' : 'rings'}
        </div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: color(r.hmotwLeader.m) }}>
          {r.hmotwLeader.m}
        </div>
        <div className={styles.lbl}>All-Time HMOTW Leader</div>
        <div className={styles.sub}>
          {r.hmotwLeader.tally.toFixed(1)} tally &middot; {r.hmotwLeader.seasons} seasons
        </div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: color(r.seasonPointsRecord.m) }}>
          <AnimatedNumber value={r.seasonPointsRecord.pts} decimals={0} />
        </div>
        <div className={styles.lbl}>Season Points Record</div>
        <div className={styles.sub}>
          {r.seasonPointsRecord.m} &middot; {r.seasonPointsRecord.year}
        </div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: color(r.singleWeekRecord.m) }}>
          <AnimatedNumber value={r.singleWeekRecord.sc} decimals={2} />
        </div>
        <div className={styles.lbl}>Single Week Record</div>
        <div className={styles.sub}>
          {r.singleWeekRecord.m} &middot; S{r.singleWeekRecord.year} Wk{r.singleWeekRecord.wk}
        </div>
      </div>

      <div className={styles.tile}>
        <div className={styles.val} style={{ color: color(r.longestDrought.m) }}>
          <AnimatedNumber value={r.longestDrought.weeks} decimals={0} /> wks
        </div>
        <div className={styles.lbl}>Longest Drought</div>
        <div className={styles.sub}>
          {r.longestDrought.m} &middot; {r.longestDrought.startYear} &ndash; {r.longestDrought.endYear}
        </div>
      </div>
    </div>
  )
}
