import { useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useHeaderHeight } from '../lib/HeaderHeightContext'

// Auto-rotate for wide panels on an upright phone (Entry 95) — the 2026
// Tracker's "rotate wide sections" treatment (TNCFL_2026_Tracker.html,
// MOBILE LAYOUT, applyRotation), ported to React.
//
// While the phone is upright (<=820px wide, portrait), the panel is laid out
// at landscape width (the phone's long side, capped at 900px — same as the
// Tracker) and drawn rotated 90° counter-clockwise, so turning the phone 90°
// clockwise shows it the right way up. "Fill" (the Tracker's fill panels,
// Entry 103): the layout length is chosen so the panel, scaled, fills the
// turned screen's height (the phone's width) exactly while ALL of its length
// stays visible below the site header — no dead band under it. Scale-up is
// capped at 1.3x.
//
// In landscape, or above 820px, children render normally (untouched).
// While rotated, the inner unit carries `data-rotated` so a child can tune
// its own layout for the turned screen (e.g. H2HMatrix stretches its table).
const QUERY = '(max-width: 820px) and (orientation: portrait)'
// Upper bound when scaling a short panel UP to fill the turned height.
const MAX_SCALE = 1.3

export default function RotateOnPhone({ children }: { children: ReactNode }) {
  const [upright, setUpright] = useState(() => typeof window !== 'undefined' && window.matchMedia(QUERY).matches)
  const headerHeight = useHeaderHeight()
  const wrapRef = useRef<HTMLDivElement>(null)
  const unitRef = useRef<HTMLDivElement>(null)
  const [geo, setGeo] = useState<{ Wd: number; H: number; s: number } | null>(null)

  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY)
    const onChange = () => setUpright(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useLayoutEffect(() => {
    if (!upright) {
      setGeo(null)
      return
    }
    const wrap = wrapRef.current
    const unit = unitRef.current
    if (!wrap || !unit) return
    let raf = 0
    const measure = () => {
      // Entry 103: FILL the turned screen, not just fit it. Lay out at the
      // phone's long side, measure the panel's height H, then pick the layout
      // length so that, scaled to fill the turned height (phone width) exactly,
      // its length still fits the visible height below the header. Two passes
      // (shorter layout length -> remeasure), since H can change with width.
      // Before this, a long layout made the length the limit, so the panel was
      // shrunk and left a dead band under it on the turned screen.
      const longSide = Math.max(window.innerHeight, window.screen?.height || 0) - 24
      const wrapW = wrap.clientWidth
      const visibleLong = window.innerHeight - headerHeight - 24
      let Wd = Math.ceil(Math.min(longSide, 900))
      let H = 0
      let s = 1
      for (let pass = 0; pass < 3; pass++) {
        unit.style.width = `${Wd}px`
        Wd = Math.max(Wd, unit.scrollWidth)
        H = unit.offsetHeight
        s = Math.min(wrapW / H, visibleLong / Wd, MAX_SCALE)
        // Length is the limit -> shorten the layout so the fill scale fits.
        const target = Math.floor((visibleLong * H) / wrapW)
        if (wrapW / H <= MAX_SCALE && visibleLong / Wd < wrapW / H && target < Wd) Wd = target
        else break
      }
      setGeo((g) => (g && g.Wd === Wd && g.H === H && Math.abs(g.s - s) < 0.001 ? g : { Wd, H, s }))
    }
    measure()
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(measure)
    })
    ro.observe(unit)
    ro.observe(wrap)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [upright, headerHeight])

  if (!upright) return <>{children}</>

  const s = geo?.s ?? 1
  const Wd = geo?.Wd ?? 0
  const H = geo?.H ?? 0
  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: H * s, height: Wd * s }}>
        <div
          ref={unitRef}
          data-rotated=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: Wd || undefined,
            transformOrigin: '0 0',
            transform: `translateY(${Wd * s}px) rotate(-90deg)${Math.abs(s - 1) > 0.001 ? ` scale(${s})` : ''}`,
            visibility: geo ? 'visible' : 'hidden',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
