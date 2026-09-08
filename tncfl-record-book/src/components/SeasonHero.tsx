import type { Season, Recap, Meta } from '../types/data'
import type { SeasonSummaryComputed } from '../lib/useSeasonSummary'
import { useManagerHover } from '../lib/useManagerHover'
import { useElementSize } from '../lib/useElementSize'
import { LOCKED_YEARS } from '../lib/lockedYears'
import AnimatedNumber from './AnimatedNumber'
import styles from './SeasonHero.module.css'

interface SeasonHeroProps {
  season: Season
  summary: SeasonSummaryComputed
  recap: Recap
  meta: Meta
}

const DOT_RADIUS = 3.4
const STROKE_WIDTH = 2.4
// Buffer must clear whichever extends furthest past a plotted point's exact
// coordinate: the dot's radius, or half the line's stroke width (relevant at
// the very first/last point, where "stroke-linecap: round" adds a rounded
// cap that extends half the stroke width beyond the endpoint). Radius (3.4)
// is the larger of the two here, so it's the binding constraint — padding
// just needs to clear it with a little room to spare, not both added
// together.
const PADDING = Math.max(DOT_RADIUS, STROKE_WIDTH / 2) + 2.6

// Same rank-to-y scaling BumpChart uses (rank 1 maps to the top), applied to
// one manager's weekly_rank array — this is the champion's ACTUAL bump chart
// line, not a cumulative-points sparkline. `width`/`height` are now REAL
// measured pixel values (from useElementSize), and both axes are INSET by
// PADDING on every side — without this, a dot plotted exactly at rank 1
// (y=0) or the first/last week (x=0 or x=width) would have half its circle
// clipped by the SVG's own edge, which is exactly the bug the user caught
// from a screenshot.
function bumpLinePoints(weeklyRank: number[], managerCount: number, width: number, height: number) {
  const plotWidth = width - PADDING * 2
  const plotHeight = height - PADDING * 2
  const stepX = plotWidth / (weeklyRank.length - 1)
  const yFor = (rank: number) =>
    managerCount > 1 ? PADDING + ((rank - 1) / (managerCount - 1)) * plotHeight : height / 2
  return weeklyRank.map((rank, i) => ({ x: PADDING + i * stepX, y: yFor(rank) }))
}

// The storytelling half of the mockup: real prose (from the hand-written
// recap, never derived), one animated hero number, and the champion's real
// bump-chart line for the season — now sized to match the stat block's own
// height exactly, rather than a fixed constant.
export default function SeasonHero({ season, summary, recap, meta }: SeasonHeroProps) {
  // statRef measures the LEFT block's real rendered height (title + label
  // stacked) — that's what the sparkline's height should match. sparkRef
  // measures the sparkline wrapper's own width (unchanged from before).
  const { ref: statRef, height: statHeight } = useElementSize<HTMLDivElement>({ width: 0, height: 60 })
  const { ref: sparkRef, width: sparkWidth } = useElementSize<HTMLDivElement>({ width: 260, height: 0 })

  const points = bumpLinePoints(season.weekly_rank[summary.championName], season.manager_count, sparkWidth, statHeight)
  const polylinePoints = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const championColor = meta.manager_colors[summary.championName] ?? '#d9a521'

  // Single, unconditional call — safe, since this component only ever shows
  // ONE manager's name (unlike ScoreTable/BumpChart/DroughtBars/SalaryDonuts,
  // which map over a list and read the context directly instead — see the
  // note in ScoreTable for why those two situations need different handling).
  const championHover = useManagerHover(summary.championName)

  return (
    <div className={styles.hero}>
      <p className={styles.eyebrow}>
        {season.year} &middot; {season.manager_count} managers &middot; {season.weeks} weeks
        {LOCKED_YEARS.has(season.year) && (
          <span className={styles.lockBadge}>{'\u{1F512}'} Locked</span>
        )}
      </p>
      <h1 className={styles.headline}>{recap.title.replace(/^\d{4}:\s*/, '')}</h1>
      <p className={styles.subLine}>{recap.subtitle}</p>
      <div className={styles.statRow}>
        <div ref={statRef}>
          <div className={styles.statNumber} style={{ color: championColor }}>
            <AnimatedNumber value={summary.championPoints} />
          </div>
          <div
            className={styles.statLabel}
            onMouseEnter={championHover.onMouseEnter}
            onMouseLeave={championHover.onMouseLeave}
            onClick={championHover.onClick}
            style={{ cursor: 'pointer' }}
          >
            {summary.championName}&rsquo;s championship total
          </div>
        </div>
        <div ref={sparkRef} className={styles.sparkWrap}>
          <svg
            width={sparkWidth}
            height={statHeight}
            viewBox={`0 0 ${sparkWidth} ${statHeight}`}
            aria-hidden="true"
          >
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={championColor}
              strokeWidth={STROKE_WIDTH}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r={DOT_RADIUS} fill={championColor} />
            ))}
          </svg>
        </div>
      </div>
    </div>
  )
}
