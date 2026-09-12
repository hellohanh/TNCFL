import type { Season, Meta } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import styles from './DroughtBars.module.css'

interface DroughtBarsProps {
  season: Season
  meta: Meta
}

// Bar FILL color is threshold-based on the drought length itself, NOT the
// manager's identity color — confirmed from the old hub's actual
// renderThirst()/barColor() source, not guessed from the screenshot's
// red/orange/green pattern. The manager's own color is still used for the
// NAME label (unchanged) — only the bar fill follows this separate rule.
function barColor(weeks: number): string {
  if (weeks >= 15) return '#E24B4A'
  if (weeks >= 8) return '#BA7517'
  return '#1D9E75'
}

// Straightforward horizontal bar chart — plain divs sized by percentage,
// no SVG needed for something this simple. Data comes from
// meta.hmotw.drought_snapshot[year], the one slice of the cross-season HMOTW
// data typed specifically for this milestone (see the note in types/data.ts).
export default function DroughtBars({ season, meta }: DroughtBarsProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const spotlit = mode === 'moneyCircle' ? new Set(season.money_circle) : null
  const snapshot = meta.hmotw.drought_snapshot[String(season.year)] ?? {}

  const sorted = [...season.active_managers].sort(
    (a, b) => (snapshot[b] ?? 0) - (snapshot[a] ?? 0)
  )
  // Bar scale is the max drought among ACTIVE managers only, matching the
  // real hub's renderThirst() exactly (`maxD=Math.max(1,...rows.map(r=>r.d))`
  // where `rows` is already filtered to status_by_year[year]==='A'). A real
  // bug: this previously took Math.max over the whole raw snapshot object,
  // which includes every manager who's EVER played, active or departed —
  // e.g. 2016's snapshot includes Bao at 59 weeks (long departed, never
  // shown in this chart at all), so the real active max (Tony, 23wks) was
  // scaling against 59 instead of 23, rendering at ~39% width instead of
  // the ~100% a lone-highest active manager should show. Caught from a
  // real screenshot, not assumed.
  const maxDrought = Math.max(...sorted.map((m) => snapshot[m] ?? 0), 1)

  return (
    <div className={styles.wrap}>
      <div className="module-title">Thirsting for a W</div>
      <div className="module-subtitle" style={{ marginBottom: 10 }}>
        Weeks since each active manager&rsquo;s last HMOTW win, as of season&rsquo;s end &mdash;
        the curse, quantified
      </div>
      {sorted.map((manager) => {
        const weeks = snapshot[manager] ?? 0
        const pct = (weeks / maxDrought) * 100
        const nameColor = meta.manager_colors[manager] ?? '#888'
        const isDimmed = (displayed !== null && displayed !== manager) || (spotlit !== null && !spotlit.has(manager))
        return (
          <div
            className={styles.row}
            key={manager}
            onMouseEnter={() => setHovered(manager)}
            onMouseLeave={() => setHovered(null)}
            onClick={(e) => {
              e.stopPropagation()
              setPinned(manager)
            }}
            style={{ opacity: isDimmed ? 0.5 : 1, cursor: 'pointer' }}
          >
            <div className={styles.name} style={{ color: nameColor }}>
              {manager}
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${pct}%`, background: barColor(weeks) }}
              />
            </div>
            <div className={styles.value}>
              {weeks} <span className={styles.wk}>{weeks === 1 ? 'wk' : 'wks'}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
