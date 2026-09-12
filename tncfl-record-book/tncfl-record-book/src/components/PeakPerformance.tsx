import { useEffect, useRef, useState } from 'react'
import type { Season, Meta } from '../types/data'
import { drawPeakChart, PEAK_WINDOW } from '../lib/drawPeakChart'
import type { PeakHit } from '../lib/drawPeakChart'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import ChartTooltip from './ChartTooltip'
import type { ChartTooltipState } from './ChartTooltip'
import styles from './PeakPerformance.module.css'

interface PeakPerformanceProps {
  season: Season
  meta: Meta
}

// Ported from the old hub's real renderPeak() — a genuinely cross-season
// feature (needs meta.hmotw.season_tally/status_by_year/all_players, not
// just this one season). For 2011 specifically — the first season ever —
// every manager is active and nobody has departed yet, so the "Inactive
// Managers" panel legitimately renders its real empty state, not a bug.
// Built here in full (both panels, TOTAL column, expand/collapse) per the
// user's explicit "build exactly like in the hub" call, minus the
// peak-card's background/border (also explicit — the RB's established
// borderless-panel convention).
export default function PeakPerformance({ season, meta }: PeakPerformanceProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const year = season.year
  const statusByYear = meta.hmotw.status_by_year[String(year)] || {}
  const active = meta.hmotw.all_players.filter((m) => statusByYear[m] === 'A')
  const departed = meta.hmotw.all_players.filter((m) => statusByYear[m] === 'I' || statusByYear[m] === 'D')
  const yearsThrough = meta.years_desc.filter((y) => y <= year)
  const depWithTally = departed.filter((m) => yearsThrough.some((y) => (meta.hmotw.season_tally[String(y)] || {})[m]))
  const total = yearsThrough.length

  const [expanded, setExpanded] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const activeCanvasRef = useRef<HTMLCanvasElement>(null)
  const inactiveCanvasRef = useRef<HTMLCanvasElement>(null)
  const activeHits = useRef<PeakHit[]>([])
  const inactiveHits = useRef<PeakHit[]>([])
  const [tip, setTip] = useState<ChartTooltipState | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function draw() {
      const containerW = Math.max(360, container?.clientWidth ?? 360)
      const DPR = Math.max(1, window.devicePixelRatio || 1)
      const spotlit =
        mode === 'moneyCircle' ? new Set(season.money_circle) : new Set(meta.hmotw.all_players)

      if (activeCanvasRef.current) {
        activeHits.current = drawPeakChart({
          canvas: activeCanvasRef.current,
          containerW,
          DPR,
          year,
          candidateManagers: active,
          seasonTally: meta.hmotw.season_tally,
          yearsDesc: meta.years_desc,
          expanded,
          isActive: true,
          spotlit,
          hoverDisplayed: displayed,
          managerColors: meta.manager_colors,
        })
      }
      if (depWithTally.length && inactiveCanvasRef.current) {
        inactiveHits.current = drawPeakChart({
          canvas: inactiveCanvasRef.current,
          containerW,
          DPR,
          year,
          candidateManagers: departed,
          seasonTally: meta.hmotw.season_tally,
          yearsDesc: meta.years_desc,
          expanded,
          isActive: false,
          spotlit,
          hoverDisplayed: displayed,
          managerColors: meta.manager_colors,
        })
      }
    }

    draw()
    const observer = new ResizeObserver(draw)
    observer.observe(container)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-draws on season/expand/hover change via the deps below
  }, [year, expanded, active.join(','), departed.join(','), depWithTally.length, meta, displayed, mode, season.money_circle])

  function hitTest(hitsRef: React.RefObject<PeakHit[]>, e: React.MouseEvent<HTMLCanvasElement>): PeakHit | null {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    let best: PeakHit | null = null
    let bd = 1e9
    for (const h of hitsRef.current) {
      const dx = cx - h.x
      const dy = cy - h.y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < h.r && d < bd) {
        bd = d
        best = h
      }
    }
    return best
  }

  function handleMove(hitsRef: React.RefObject<PeakHit[]>, e: React.MouseEvent<HTMLCanvasElement>) {
    const best = hitTest(hitsRef, e)
    e.currentTarget.style.cursor = best ? 'pointer' : 'default'
    if (best) {
      setHovered(best.m)
      const color = meta.manager_colors[best.m] ?? '#888'
      setTip({
        x: e.clientX,
        y: e.clientY,
        color,
        name: best.m,
        lines: [
          best.col === 'Career' ? <><b>Career</b> total</> : <><b>{best.col}</b> season</>,
          <><b>{best.val}</b> HMOTW {best.val === 1 ? 'win' : 'wins'}</>,
        ],
      })
    } else {
      setHovered(null)
      setTip(null)
    }
  }

  function handleClick(hitsRef: React.RefObject<PeakHit[]>, e: React.MouseEvent<HTMLCanvasElement>) {
    const best = hitTest(hitsRef, e)
    if (best) {
      e.stopPropagation()
      setPinned(best.m)
    }
  }

  const subExtra = total > PEAK_WINDOW ? ` \u00b7 ${expanded ? `all ${total} seasons` : `last ${PEAK_WINDOW} seasons`}` : ''

  return (
    <div className={styles.wrap}>
      <div className="module-title-row">
        <div className="module-title">Peak Performance Distribution</div>
        {total > PEAK_WINDOW && (
          <button className={styles.expandBtn} onClick={() => setExpanded((v) => !v)}>
            {expanded ? `\u2212 Show last ${PEAK_WINDOW}` : `\u2295 Show all ${total} seasons`}
          </button>
        )}
      </div>
      <div className="module-subtitle">
        HMOTW wins by season — weekly high-score titles through {year}
        {subExtra}
      </div>
      <div className={styles.card} ref={containerRef}>
        <div className={styles.secLabel} style={{ marginTop: 2 }}>
          Active Managers
        </div>
        <canvas
          ref={activeCanvasRef}
          className={styles.canvas}
          onMouseMove={(e) => handleMove(activeHits, e)}
          onMouseLeave={() => {
            setHovered(null)
            setTip(null)
          }}
          onClick={(e) => handleClick(activeHits, e)}
        />
        <div className={styles.secLabel}>Inactive Managers</div>
        {depWithTally.length ? (
          <canvas
            ref={inactiveCanvasRef}
            className={styles.canvas}
            onMouseMove={(e) => handleMove(inactiveHits, e)}
            onMouseLeave={() => {
              setHovered(null)
              setTip(null)
            }}
            onClick={(e) => handleClick(inactiveHits, e)}
          />
        ) : (
          <div className={styles.empty}>No inactive managers with HMOTW wins through {year}.</div>
        )}
      </div>
      <ChartTooltip state={tip} />
    </div>
  )
}
