import { useState } from 'react'
import type { Season, Meta } from '../types/data'
import { useElementSize } from '../lib/useElementSize'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import ChartTooltip from './ChartTooltip'
import type { ChartTooltipState } from './ChartTooltip'
import styles from './DespairDifferential.module.css'

interface DespairDifferentialProps {
  season: Season
  meta: Meta
}

const PAD_L = 44
const PAD_R = 64
const PAD_T = 14
const PAD_B = 24
const H = 320
// Uniform sizing across every manager, no Money-Circle emphasis and no
// trend line — a deliberate simplification of the old hub's real
// renderDespair() (which used 2.6/1.3px lines + 3.2/2px dots split by
// Money Circle membership, plus a dashed cubic polyfit trend line for MC
// managers), per the user's explicit call.
const LINE_WIDTH = 2
const DOT_RADIUS = 2.5
const MIN_LABEL_GAP = 13

// "Nice" gridline step, ported from the old hub's real niceStep() — picks
// 1/2/5/10 x a power of ten so gridlines land on round numbers.
function niceStep(v: number): number {
  const raw = v / 5
  const mag = Math.pow(10, Math.floor(Math.log10(raw)))
  const n = raw / mag
  const s = n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10
  return s * mag
}

export default function DespairDifferential({ season, meta }: DespairDifferentialProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const spotlit = mode === 'moneyCircle' ? new Set(season.money_circle) : null
  const isFilteredOut = (m: string) => spotlit !== null && !spotlit.has(m)
  const { ref: chartRef, width: measuredW } = useElementSize<HTMLDivElement>({ width: 500, height: 0 })
  const [tip, setTip] = useState<ChartTooltipState | null>(null)

  const mgrs = season.active_managers
  const N = season.weeks
  const PW = Math.max(360, measuredW)

  // Dynamic Y-axis: scales to the worst gap across ACTIVE (spotlit) managers
  // only, matching the hub's real behavior exactly — + 10% headroom,
  // floored at 50 so a tight/empty season still renders cleanly.
  let maxGap = 0
  for (const m of mgrs) {
    if (isFilteredOut(m)) continue
    for (const g of season.gap_behind[m]) if (g > maxGap) maxGap = g
  }
  const topVal = Math.max(maxGap * 1.1, 50)
  const step = niceStep(topVal)
  const top = Math.ceil(topVal / step) * step

  const plotW = PW - PAD_L - PAD_R
  const plotH = H - PAD_T - PAD_B
  const xOf = (w: number) => PAD_L + (N === 1 ? plotW / 2 : (w * plotW) / (N - 1))
  const yOf = (g: number) => PAD_T + plotH - (g / top) * plotH

  const gridLines: number[] = []
  for (let g = 0; g <= top; g += step) gridLines.push(g)

  // Right-edge manager-name labels at each line's final value, de-collided
  // vertically (min 13px gap) — same sequential push-down as the hub.
  const clampY = (y: number) => Math.max(PAD_T + 4, Math.min(PAD_T + plotH, y))
  const labels = mgrs
    .map((m) => ({ m, y: clampY(yOf(season.gap_behind[m][N - 1])) }))
    .sort((a, b) => a.y - b.y)
  for (let i = 1; i < labels.length; i++) {
    if (labels[i].y - labels[i - 1].y < MIN_LABEL_GAP) {
      labels[i].y = labels[i - 1].y + MIN_LABEL_GAP
    }
  }

  function showTip(e: React.MouseEvent, m: string, w: number) {
    const gap = season.gap_behind[m][w]
    setHovered(m)
    setTip({
      x: e.clientX,
      y: e.clientY,
      color: meta.manager_colors[m] ?? '#888',
      name: m,
      lines: [
        <>Week <b>{w + 1}</b></>,
        gap === 0 ? <b>Leading</b> : <><b>{gap.toFixed(1)}</b> pts behind</>,
      ],
    })
  }

  return (
    <div className={styles.wrap}>
      <div className="module-title">The Despair Differential</div>
      <div className="module-subtitle">
        Cumulative points behind the season leader, week by week — the higher the line, the deeper
        the despair (0 = leading)
      </div>
      <div ref={chartRef} className={styles.chartArea}>
        <svg viewBox={`0 0 ${PW} ${H}`} width={PW} height={H}>
          <defs>
            <clipPath id="despair-clip">
              <rect x={PAD_L - 8} y={PAD_T - 4} width={plotW + 16} height={plotH + 12} />
            </clipPath>
          </defs>
          {gridLines.map((g) => {
            const y = yOf(g)
            return (
              <g key={g}>
                <line
                  x1={PAD_L}
                  x2={PW - PAD_R}
                  y1={y}
                  y2={y}
                  stroke={`rgba(255,255,255,${g === 0 ? 0.18 : 0.06})`}
                  strokeWidth={1}
                />
                <text x={PAD_L - 6} y={y + 3} textAnchor="end" className={styles.axisLabel}>
                  {g}
                </text>
              </g>
            )
          })}
          {Array.from({ length: N }, (_, w) => (
            <text key={w} x={xOf(w)} y={H - 8} textAnchor="middle" className={styles.weekLabel}>
              {w + 1}
            </text>
          ))}
          <g clipPath="url(#despair-clip)">
            {mgrs.map((m) => {
              const color = meta.manager_colors[m] ?? '#888'
              const dimmed = (displayed !== null && displayed !== m) || isFilteredOut(m)
              let d = ''
              for (let w = 0; w < N; w++) {
                const x = xOf(w)
                const y = yOf(season.gap_behind[m][w])
                d += (w === 0 ? 'M ' : 'L ') + x + ' ' + y + ' '
              }
              return (
                <g key={m} opacity={dimmed ? 0.25 : 1}>
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={LINE_WIDTH}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  {Array.from({ length: N }, (_, w) => (
                    <circle
                      key={w}
                      cx={xOf(w)}
                      cy={yOf(season.gap_behind[m][w])}
                      r={DOT_RADIUS}
                      fill={color}
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
          </g>
          {labels.map((l) => (
            <text
              key={l.m}
              x={PW - PAD_R + 6}
              y={l.y + 3}
              className={styles.edgeLabel}
              fill={meta.manager_colors[l.m] ?? '#888'}
              opacity={(displayed !== null && displayed !== l.m) || isFilteredOut(l.m) ? 0.25 : 1}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHovered(l.m)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation()
                setPinned(l.m)
              }}
            >
              {l.m}
            </text>
          ))}
        </svg>
      </div>
      <ChartTooltip state={tip} />
    </div>
  )
}
