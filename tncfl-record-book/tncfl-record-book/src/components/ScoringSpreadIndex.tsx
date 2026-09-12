import { useState } from 'react'
import type { Season, Meta } from '../types/data'
import { useElementSize } from '../lib/useElementSize'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import ChartTooltip from './ChartTooltip'
import type { ChartTooltipState } from './ChartTooltip'
import styles from './ScoringSpreadIndex.module.css'

interface ScoringSpreadIndexProps {
  season: Season
  meta: Meta
}

const PAD_L = 44
const PAD_R = 52
const PAD_T = 14
const PAD_B = 26
const H = 340
const DOT_RADIUS = 2.5
const CAP = 5
// Ported from the old hub's real renderSpread() color, changed to the RB's
// established mustard (#d9a521, same hex as ScoreTable's mustard pill) per
// the user's explicit request — the hub's original was brand red
// (#C0252B).
const AVG_LINE_COLOR = '#d9a521'

export default function ScoringSpreadIndex({ season, meta }: ScoringSpreadIndexProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const spotlit = mode === 'moneyCircle' ? new Set(season.money_circle) : null
  const isFilteredOut = (m: string) => spotlit !== null && !spotlit.has(m)
  const { ref: chartRef, width: measuredW } = useElementSize<HTMLDivElement>({ width: 500, height: 0 })
  const [tip, setTip] = useState<ChartTooltipState | null>(null)

  const mgrs = season.active_managers
  const W = season.weeks
  const PW = Math.max(360, measuredW)

  // No week filter exists yet (Milestone 9 deferred) — this always renders
  // "All Weeks" (weeks 1..W), the same fallback BumpChart/DroughtBars
  // already use without a filter UI. The hub's "No weeks selected" empty
  // state is unreachable right now but the real behavior it would need
  // isn't built here since there's nothing to trigger it.
  const weeks = Array.from({ length: W }, (_, i) => i + 1)

  let lo = Infinity
  let hi = -Infinity
  for (const w of weeks) {
    for (const m of mgrs) {
      const v = season.scores[m][w - 1]
      if (v < lo) lo = v
      if (v > hi) hi = v
    }
  }
  const padY = (hi - lo) * 0.08 || 10
  lo -= padY
  hi += padY

  let sum = 0
  let cnt = 0
  for (const w of weeks) {
    for (const m of mgrs) {
      sum += season.scores[m][w - 1]
      cnt++
    }
  }
  const avg = sum / cnt

  const N = weeks.length
  const plotW = PW - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const xOf = (i: number) => PAD_L + (N === 1 ? plotW / 2 : (i * plotW) / (N - 1))
  const yOf = (v: number) => PAD_T + plotH - ((v - lo) / (hi - lo)) * plotH

  const span = hi - lo
  const step = span <= 120 ? 20 : span <= 260 ? 40 : span <= 520 ? 80 : 100
  const gstart = Math.ceil(lo / step) * step
  const gridValues: number[] = []
  for (let v = gstart; v <= hi; v += step) gridValues.push(v)

  function showTip(e: React.MouseEvent, m: string, w: number) {
    setHovered(m)
    setTip({
      x: e.clientX,
      y: e.clientY,
      color: meta.manager_colors[m] ?? '#888',
      name: m,
      lines: [
        <>Week <b>{w}</b></>,
        <><b>{season.scores[m][w - 1].toFixed(1)}</b> pts</>,
      ],
    })
  }

  return (
    <div className={styles.wrap}>
      <div className="module-title">Scoring Spread Index</div>
      <div className="module-subtitle">
        Each week&rsquo;s high-to-low scoring range — how tightly or widely the league scored, week
        by week
      </div>
      <div ref={chartRef} className={styles.chartArea}>
        <svg viewBox={`0 0 ${PW} ${H}`} width={PW} height={H}>
          {gridValues.map((v) => {
            const y = yOf(v)
            return (
              <g key={v}>
                <line
                  x1={PAD_L}
                  x2={PW - PAD_R}
                  y1={y}
                  y2={y}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth={1}
                />
                <text x={PAD_L - 6} y={y + 3} textAnchor="end" className={styles.axisLabel}>
                  {v}
                </text>
              </g>
            )
          })}
          <line
            x1={PAD_L}
            x2={PW - PAD_R}
            y1={yOf(avg)}
            y2={yOf(avg)}
            stroke={AVG_LINE_COLOR}
            strokeWidth={1.5}
            strokeDasharray="6 4"
            opacity={0.8}
          />
          <text
            x={PW - PAD_R + 4}
            y={yOf(avg) + 3}
            className={styles.avgLabel}
            fill={AVG_LINE_COLOR}
          >
            avg {avg.toFixed(1)}
          </text>
          {weeks.map((w, i) => {
            const x = xOf(i)
            const weekScores = mgrs.map((m) => season.scores[m][w - 1])
            const wHi = Math.max(...weekScores)
            const wLo = Math.min(...weekScores)
            const yH = yOf(wHi)
            const yL = yOf(wLo)
            return (
              <g key={w}>
                <line x1={x} x2={x} y1={yH} y2={yL} stroke="rgba(200,200,200,0.22)" strokeWidth={1.5} />
                <line
                  x1={x - CAP}
                  x2={x + CAP}
                  y1={yH}
                  y2={yH}
                  stroke="rgba(200,200,200,0.5)"
                  strokeWidth={2}
                />
                <line
                  x1={x - CAP}
                  x2={x + CAP}
                  y1={yL}
                  y2={yL}
                  stroke="rgba(200,200,200,0.5)"
                  strokeWidth={2}
                />
                <text x={x} y={H - 8} textAnchor="middle" className={styles.weekLabel}>
                  {w}
                </text>
                {mgrs.map((m) => (
                  <circle
                    key={m}
                    cx={x}
                    cy={yOf(season.scores[m][w - 1])}
                    r={DOT_RADIUS}
                    fill={meta.manager_colors[m] ?? '#888'}
                    opacity={(displayed !== null && displayed !== m) || isFilteredOut(m) ? 0.25 : 1}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => showTip(e, m, w)}
                    onMouseMove={(e) => showTip(e, m, w)}
                    onMouseLeave={() => {
                      setHovered(null)
                      setTip(null)
                    }}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPinned(m)
                    }}
                  />
                ))}
              </g>
            )
          })}
        </svg>
      </div>
      <ChartTooltip state={tip} />
    </div>
  )
}
