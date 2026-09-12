import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Meta } from '../types/data'
import { computePieHeight, drawExtrudedPie, type PieDatum } from '../lib/drawExtrudedPie'
import styles from './SalaryDonuts.module.css'

interface SalaryDonutsProps {
  rows: Array<{ m: string; net: number }>
  meta: Meta
  title?: string
  subtitle?: string
  winnersTitle?: string
  losersTitle?: string
}

const RADIUS_FRACTION = 0.22

// One pie panel: its own canvas, its own rotation slider, sized to its own
// wrapper's real width (matching the old hub's own `wrap.clientWidth`-driven
// sizing) via ResizeObserver so it redraws correctly if the layout reflows.
function PieBox({
  title,
  data,
  isLosers,
  defaultRotation,
  colors,
}: {
  title: string
  data: PieDatum[]
  isLosers: boolean
  defaultRotation: number
  colors: Record<string, string>
}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [width, setWidth] = useState(0)
  const [rotation, setRotation] = useState(defaultRotation)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width
      if (w) setWidth(w)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const height = width > 0 ? computePieHeight(width, RADIUS_FRACTION) : 0

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || width === 0 || height === 0) return
    const DPR = window.devicePixelRatio || 1
    canvas.width = Math.round(width * DPR)
    canvas.height = Math.round(height * DPR)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
    drawExtrudedPie(ctx, width, height, data, rotation, isLosers, colors, RADIUS_FRACTION)
  }, [width, height, data, rotation, isLosers, colors])

  return (
    <div className={styles.pieBox}>
      <div className={styles.pieTitle}>{title}</div>
      <div className={styles.canvasWrap} ref={wrapRef} style={{ height }}>
        <canvas ref={canvasRef} />
      </div>
      <div className={styles.pieSlider}>
        <span className={styles.pieRot}>&#8634;</span>
        <input
          type="range"
          min={0}
          max={359}
          step={1}
          value={rotation}
          onChange={(e) => setRotation(Number(e.target.value))}
        />
        <span className={styles.pieDeg}>{rotation}&deg;</span>
      </div>
    </div>
  )
}

// Salary cap contributions, split by sign of net payout — winners (positive)
// and losers (negative), each its own 3D-extruded canvas donut. Rebuilt in
// Milestone 7 (cont.) as a faithful port of the old hub's real canvas engine
// (drawExtrudedPie.ts) after the user shared a reference screenshot — the
// earlier flat 2D SVG version didn't match the old hub's actual look at all.
// Default rotation changed to 80° for both pies per the user's explicit
// request (was the old hub's own hardcoded 20°/90°) — the same 80° default
// should also be used for the future CSCC cumulative donuts (Milestone 14)
// once those are built.
export default function SalaryDonuts({
  rows,
  meta,
  title = 'Salary Cap Contributions \u2014 Winners & Losers',
  subtitle = "This season\u2019s net gains and losses, shown as a share of the money won and the money lost",
  winnersTitle = 'Season Winners',
  losersTitle = 'Season Losers',
}: SalaryDonutsProps) {
  const winners: PieDatum[] = rows
    .filter((r) => r.net > 0)
    .sort((a, b) => b.net - a.net)
    .map((r) => ({ name: r.m, val: r.net }))

  const losers: PieDatum[] = rows
    .filter((r) => r.net < 0)
    .sort((a, b) => a.net - b.net)
    .map((r) => ({ name: r.m, val: Math.abs(r.net) }))

  return (
    <div className={styles.wrap}>
      <div className="module-title">{title}</div>
      <div className="module-subtitle" style={{ marginBottom: 10 }}>
        {subtitle}
      </div>
      <div className={styles.pieRow}>
        <PieBox
          title={winnersTitle}
          data={winners}
          isLosers={false}
          defaultRotation={80}
          colors={meta.manager_colors}
        />
        <PieBox
          title={losersTitle}
          data={losers}
          isLosers={true}
          defaultRotation={80}
          colors={meta.manager_colors}
        />
      </div>
    </div>
  )
}
