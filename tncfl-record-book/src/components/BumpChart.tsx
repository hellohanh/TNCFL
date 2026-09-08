import { useMemo, useRef, useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Season, Meta } from '../types/data'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import { useElementSize } from '../lib/useElementSize'
import { useInView } from '../lib/useInView'
import { computeRaceFinishTimes, pickRaceDuration } from '../lib/raceMath'
import F1Car from './F1Car'
import RaceCountdown from './RaceCountdown'
import TireSmoke from './TireSmoke'
import styles from './BumpChart.module.css'

interface BumpChartProps {
  season: Season
  meta: Meta
}

// Rebuilt to match the old hub's real renderBump() EXACTLY — geometry,
// curve math, and label placement all pulled directly from its actual JS
// source (TNCFL_hub.html), not approximated from the screenshot alone.
//
// The curve: old hub uses a cubic bezier per segment with BOTH control
// points sitting at the horizontal midpoint between the two weeks
// (`cx = (px+x)/2`) — this is what produces the smooth S-curve "hold, then
// glide" shape rather than a sharp angular bend at each week. Deliberately
// different from the hero sparkline (Milestone 7), which was told NOT to
// smooth its curve — this is the one place smoothing was always intended.
const PAD_T = 22 // top padding — room for the week-number row
const PAD_B = 10
const FINISH_W = 24 // 3 checkered columns of 8px each
const FINISH_GAP = 6 // breathing room between the last week's dots and the flag
const FINISH_SQUARE = 8
// Reserved space at the LEFT edge so a car parked at the starting line
// (whose body extends roughly half its own width behind its center point)
// never gets clipped by the SVG's own boundary — this is exactly the bug
// caught from a screenshot: the car's rear half (side pod, rear wheels)
// was rendering at a negative x-coordinate, outside the viewBox, and
// silently clipped off. Must stay ahead of CAR_CENTER_X * CAR_SCALE
// (9.9 * 1.5 = 14.85) now that the car's true size is restored — this
// margin would need revisiting again if either of those two numbers
// changes in the future.
const LEFT_MARGIN = 17

// F1Car's own internal coordinate system spans roughly x:[0,19.8], y:[-1,10.6]
// (see F1Car.tsx / the old hub's original f1CarSVG geometry) — these are its
// approximate visual center, needed to position the WHOLE car at a specific
// chart coordinate rather than just its top-left corner.
const CAR_CENTER_X = 9.9
const CAR_CENTER_Y = 4.75
// The old hub's f1CarSVG() wraps its raw path coordinates in
// `transform="scale(1.5) translate(-10,-5)"` before ever placing a car —
// a factor this port initially missed entirely, rendering cars at roughly
// 67% of the old hub's actual size (confirmed by comparing rendered car
// length against the shared H/rowH formula both versions use). The old hub
// applies this SAME fixed 1.5x regardless of manager count/row spacing —
// no adaptive scaling — so matching it exactly means a fixed multiplier
// here too, not a rowH-based heuristic.
const CAR_SCALE = 1.5
const OFFSCREEN_X = -60 // well past the left edge of any realistic chart width
// Rear-wheel centers, computed directly from F1Car's own tire rects
// (rect(2.6,-0.8,3.8,2.7) and rect(2.6,8.1,3.8,2.7) — both at the tail end,
// x=2.6-6.4, since the nose points toward +x). Not eyeballed — these are
// the exact rect centers: (2.6+3.8/2, y+2.7/2).
const REAR_WHEELS: Array<[number, number]> = [
  [4.5, 0.55],
  [4.5, 9.45],
]
const SMOKE_DURATION_MS = 700
// Race playback constants, ported directly from the old hub's real
// playRace() — same quadratic ease-in and the same 700ms global fade
// starting only once the LAST car crosses the line.
const RACE_FADE_MS = 700
const raceEase = (t: number) => t * t

export default function BumpChart({ season, meta }: BumpChartProps) {
  const { setHovered, setPinned, displayed } = useHoveredManagerContext()
  const { mode } = useManagerFilterContext()
  const spotlit = mode === 'moneyCircle' ? new Set(season.money_circle) : null
  // NOTE: only the lines/dots/edge-labels dim for a filtered-out manager —
  // the race sequence itself still includes every manager regardless of
  // the filter. Roll delays, finish times, and the animation frame loop
  // are all keyed by season.active_managers across several hooks; filtering
  // WHICH cars race would mean restructuring that carefully-tuned engine
  // (many sub-milestones to get right — 7h/7i/7m), a real risk not worth
  // taking for this pass. Flagged explicitly rather than silently partial.
  function isFilteredOut(m: string): boolean {
    return spotlit !== null && !spotlit.has(m)
  }
  const { ref: chartRef, width: PW } = useElementSize<HTMLDivElement>({ width: 500, height: 0 })
  const reduceMotion = useReducedMotion()

  // sequenceId drives the WHOLE intro+race sequence (roll-up -> wait ->
  // countdown -> smoke -> race). 0 = never started. Incrementing it (either
  // from the scroll-into-view trigger below, or from the Replay button)
  // restarts the entire chain from scratch — every effect below keys off
  // this value rather than a plain boolean, specifically so a REPLAY can
  // force a genuine restart even though the previous run already left
  // rollUpTriggered-equivalent state at "true" (a boolean staying true
  // can't itself signal "start over").
  const [sequenceId, setSequenceId] = useState(0)

  const { ref: viewRef, isInView } = useInView({ once: false, threshold: 0.2 })
  const hasBeenSeenRef = useRef(false)
  const wasInViewRef = useRef(false)

  useEffect(() => {
    // Fires exactly once per navigation to this season — the first time
    // the chart scrolls into view. `key={year}` on this component (see
    // SeasonPage.tsx) already gives it a fresh mount, and therefore a
    // fresh hasBeenSeenRef, every time a different year's link is
    // clicked, so "once per click into that year" falls out naturally
    // from that plus this guard. Deliberately NEVER auto-replays on any
    // later scroll transition, up or down — replaying is the Replay race
    // button's job alone now, not something scrolling should ever do.
    if (isInView && !wasInViewRef.current && !hasBeenSeenRef.current) {
      hasBeenSeenRef.current = true
      setSequenceId((id) => id + 1)
    }
    wasInViewRef.current = isInView
  }, [isInView])

  // Per-car stagger so the grid doesn't roll up as one rigid block —
  // re-rolled every time the sequence (re)starts, including on Replay, so
  // it doesn't look identical every run.
  const rollDelays = useMemo(() => {
    const delays: Record<string, number> = {}
    for (const m of season.active_managers) delays[m] = Math.random() * 0.4
    return delays
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately re-rolls on sequenceId change, not just when the manager list changes
  }, [season.active_managers, sequenceId])

  // Race finish times, re-rolled fresh each run too (a new random duration
  // each time, exactly like the old hub's buildFinishTimes() re-rolling on
  // every replay) — computed from each manager's REAL final season total,
  // using the formula confirmed against the user's own spreadsheet.
  const race = useMemo(() => {
    if (sequenceId === 0) return null
    const totals: Record<string, number> = {}
    for (const m of season.active_managers) {
      totals[m] = season.cum_points[m][season.weeks - 1]
    }
    const duration = pickRaceDuration()
    const finishTimes = computeRaceFinishTimes(totals, duration)
    return { duration, finishTimes }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately re-rolls on sequenceId, not on season data (which is already covered by the key={year} remount)
  }, [sequenceId])

  const [countdownActive, setCountdownActive] = useState(false)
  const [smokeActive, setSmokeActive] = useState(false)
  const [raceActive, setRaceActive] = useState(false)
  const rafRef = useRef<number | null>(null)
  const pathRefs = useRef<Record<string, SVGPathElement | null>>({})
  const carGroupRefs = useRef<Record<string, SVGGElement | null>>({})

  // Stage 2: once every car has actually finished rolling up (their own
  // longest stagger delay + the 0.9s roll duration itself), wait 500ms,
  // then start the countdown. Computed from the REAL max delay rolled for
  // this run, not a padded guess.
  useEffect(() => {
    if (sequenceId === 0) return
    setCountdownActive(false)
    setSmokeActive(false)
    setRaceActive(false)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)

    const maxDelayMs = Math.max(...Object.values(rollDelays)) * 1000
    const rollDurationMs = reduceMotion ? 0 : 900
    const timer = setTimeout(() => setCountdownActive(true), maxDelayMs + rollDurationMs + 500)
    return () => clearTimeout(timer)
  }, [sequenceId, rollDelays, reduceMotion])

  const handleCountdownComplete = () => {
    setCountdownActive(false)
    setSmokeActive(true)
    setTimeout(() => setSmokeActive(false), SMOKE_DURATION_MS)
    setRaceActive(true)
  }

  const handleReplay = () => setSequenceId((id) => id + 1)

  // Stage 4: the actual race. Ported directly from the old hub's real
  // playRace() — quadratic ease-in per car (each car eases in toward its
  // OWN finishTime independently, not a shared clock), position/rotation
  // read from a hidden per-manager <path> via getPointAtLength (a lookahead
  // point 1 unit further down the path gives the tangent angle, so the car
  // banks into curves rather than staying nose-right the whole race), and
  // a global fade that only starts once the LAST car crosses the line.
  useEffect(() => {
    if (!raceActive || !race || reduceMotion) return
    const start = performance.now()
    const lastFinish = Math.max(...Object.values(race.finishTimes))

    function frame(now: number) {
      const t = now - start
      let globalOp = 1
      if (t > lastFinish) globalOp = Math.max(0, 1 - (t - lastFinish) / RACE_FADE_MS)

      for (const manager of season.active_managers) {
        const path = pathRefs.current[manager]
        const g = carGroupRefs.current[manager]
        if (!path || !g) continue
        const dur = race!.finishTimes[manager]
        const len = path.getTotalLength()
        const p = raceEase(Math.min(1, t / dur))
        const L = p * len
        const pt = path.getPointAtLength(L)
        const ahead = path.getPointAtLength(Math.min(len, L + 1))
        const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI
        g.setAttribute(
          'transform',
          `translate(${pt.x} ${pt.y}) rotate(${angle}) translate(${-CAR_CENTER_X * CAR_SCALE} ${-CAR_CENTER_Y * CAR_SCALE}) scale(${CAR_SCALE})`
        )
        // Opacity set imperatively on the SAME element as the transform,
        // in the SAME frame — not via React state. Driving this fade
        // through setState would trigger a full component re-render every
        // frame, which would re-execute the JSX below and reset this same
        // element's transform back to its static parked position, directly
        // fighting the imperative update above. Both values need to be
        // owned by the same imperative loop, not split across React state
        // and direct DOM writes.
        g.setAttribute('opacity', String(globalOp))
      }

      if (t <= lastFinish + RACE_FADE_MS) {
        rafRef.current = requestAnimationFrame(frame)
      }
    }
    rafRef.current = requestAnimationFrame(frame)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- race/season are stable for the duration of one race run; re-running on every render would restart the rAF loop
  }, [raceActive, reduceMotion])

  const ROWS = season.manager_count
  const N = season.weeks
  const H = Math.max(240, 30 * ROWS + PAD_T + PAD_B)
  const rowH = ROWS > 1 ? (H - PAD_T - PAD_B) / (ROWS - 1) : 0

  const yOf = (rank: number) => PAD_T + (rank - 1) * rowH
  // Data now plots into a narrower width than the full SVG — LEFT_MARGIN is
  // reserved before it (for the parked car's body), and FINISH_W + GAP is
  // reserved after it (for the checkered flag), so the full car and the
  // full flag both stay within the SVG's own boundary.
  const plotWidth = PW - LEFT_MARGIN - FINISH_W - FINISH_GAP
  const xOf = (weekIndex: number) =>
    LEFT_MARGIN + (N === 1 ? plotWidth / 2 : (weekIndex * (plotWidth - 1)) / (N - 1))
  const finishX = LEFT_MARGIN + plotWidth + FINISH_GAP
  const finishRows = Math.max(1, Math.round(H / FINISH_SQUARE))

  // Edge labels: LEFT = week-1 rank order, RIGHT = final-week rank order —
  // these are genuinely different orderings (a manager can start strong and
  // fade, so their week-1 position and final position differ), matching
  // the old hub exactly rather than using the same order on both sides.
  const startOrder = [...season.active_managers].sort(
    (a, b) => season.weekly_rank[a][0] - season.weekly_rank[b][0]
  )
  const endOrder = [...season.active_managers].sort(
    (a, b) => season.weekly_rank[a][N - 1] - season.weekly_rank[b][N - 1]
  )

  return (
    <div className={styles.card} ref={viewRef}>
      <RaceCountdown active={countdownActive} onComplete={handleCountdownComplete} />
      <div className="module-title-row">
        <div className="module-title">Weekly Burnout</div>
        <button className={styles.replayBtn} onClick={handleReplay} title="Replay the race">
          &#9654; Replay race
        </button>
      </div>
      <div className={styles.row}>
        <div className={styles.gutter} style={{ height: H }}>
          {startOrder.map((manager) => (
            <div
              key={manager}
              className={styles.lblLeft}
              style={{
                top: yOf(season.weekly_rank[manager][0]),
                color: meta.manager_colors[manager] ?? '#888',
                opacity: (displayed && displayed !== manager) || isFilteredOut(manager) ? 0.25 : 1,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(manager)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation()
                setPinned(manager)
              }}
            >
              {manager}
            </div>
          ))}
        </div>

        <div ref={chartRef} className={styles.chartArea}>
          <svg width={PW} height={H} viewBox={`0 0 ${PW} ${H}`}>
            {Array.from({ length: ROWS }, (_, i) => (
              <line
                key={i}
                x1="0"
                x2={PW}
                y1={yOf(i + 1)}
                y2={yOf(i + 1)}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            ))}
            {Array.from({ length: N }, (_, w) => (
              <text
                key={w}
                x={xOf(w)}
                y="10"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill="#777"
              >
                {w + 1}
              </text>
            ))}
            {season.active_managers.map((manager) => {
              const color = meta.manager_colors[manager] ?? '#888'
              const isDimmed = (displayed !== null && displayed !== manager) || isFilteredOut(manager)
              const rank = season.weekly_rank[manager]

              let d = ''
              for (let w = 0; w < N; w++) {
                const x = xOf(w)
                const y = yOf(rank[w])
                if (w === 0) {
                  d += `M ${x} ${y}`
                } else {
                  const px = xOf(w - 1)
                  const py = yOf(rank[w - 1])
                  const cx = (px + x) / 2
                  d += ` C ${cx} ${py} ${cx} ${y} ${x} ${y}`
                }
              }

              return (
                <g
                  key={manager}
                  onMouseEnter={() => setHovered(manager)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setPinned(manager)
                  }}
                  opacity={isDimmed ? 0.12 : 0.95}
                  style={{ cursor: 'pointer' }}
                >
                  {/* Wider invisible path underneath enlarges the hoverable
                      area — the visible stroke (2.4px) is hard to point at
                      precisely otherwise. */}
                  <path d={d} fill="none" stroke="transparent" strokeWidth="14" />
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {rank.map((r, w) => (
                    <circle key={w} cx={xOf(w)} cy={yOf(r)} r="3.4" fill={color} />
                  ))}
                  {/* Hidden path purely for the race to measure/travel along
                      via getTotalLength/getPointAtLength — same technique
                      the old hub uses (a separate invisible path per car,
                      not the visible colored line itself). */}
                  <path
                    ref={(el) => {
                      pathRefs.current[manager] = el
                    }}
                    d={d}
                    fill="none"
                    stroke="none"
                  />
                </g>
              )
            })}
            {Array.from({ length: finishRows }, (_, row) =>
              Array.from({ length: 3 }, (_, col) => {
                const isBlack = (row + col) % 2 === 0
                return (
                  <rect
                    key={`${row}-${col}`}
                    x={finishX + col * FINISH_SQUARE}
                    y={row * FINISH_SQUARE}
                    width={FINISH_SQUARE}
                    height={FINISH_SQUARE}
                    fill={isBlack ? '#111' : '#eee'}
                  />
                )
              })
            )}
            {season.active_managers.map((manager) => {
              const startRank = season.weekly_rank[manager][0]
              const targetX = xOf(0) // the starting line = week 1's x position
              const targetY = yOf(startRank)
              const scale = CAR_SCALE

              return (
                <motion.g
                  key={`${manager}-${sequenceId}`}
                  initial={{ x: OFFSCREEN_X }}
                  animate={{ x: reduceMotion || sequenceId > 0 ? 0 : OFFSCREEN_X }}
                  transition={{
                    duration: reduceMotion ? 0 : 0.9,
                    delay: reduceMotion ? 0 : rollDelays[manager],
                    ease: 'easeOut',
                  }}
                >
                  <g
                    ref={(el) => {
                      carGroupRefs.current[manager] = el
                    }}
                    transform={`translate(${targetX - CAR_CENTER_X * scale} ${targetY - CAR_CENTER_Y * scale}) scale(${scale})`}
                  >
                    <F1Car managerColor={meta.manager_colors[manager] ?? '#888'} initial={manager[0]} />
                    {REAR_WHEELS.map(([wx, wy], i) => (
                      <TireSmoke key={i} active={smokeActive} cx={wx} cy={wy} />
                    ))}
                  </g>
                </motion.g>
              )
            })}
          </svg>
        </div>

        <div className={styles.gutter} style={{ height: H }}>
          {endOrder.map((manager) => (
            <div
              key={manager}
              className={styles.lblRight}
              style={{
                top: yOf(season.weekly_rank[manager][N - 1]),
                color: meta.manager_colors[manager] ?? '#888',
                opacity: (displayed && displayed !== manager) || isFilteredOut(manager) ? 0.25 : 1,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHovered(manager)}
              onMouseLeave={() => setHovered(null)}
              onClick={(e) => {
                e.stopPropagation()
                setPinned(manager)
              }}
            >
              {manager}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
