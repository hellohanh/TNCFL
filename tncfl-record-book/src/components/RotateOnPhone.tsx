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
// clockwise shows it the right way up. "Fit" (the Tracker's FIT tabs): the
// panel is scaled down only if needed so ALL of it is visible on the turned
// screen — its height within the phone's width and its length within the
// visible screen height below the site header. Never scaled up.
//
// In landscape, or above 820px, children render normally (untouched).
// While rotated, the inner unit carries `data-rotated` so a child can tune
// its own layout for the turned screen (e.g. H2HMatrix stretches its table).
const QUERY = '(max-width: 820px) and (orientation: portrait)'

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
      const longSide = Math.max(window.innerHeight, window.screen?.height || 0) - 24
      const Wd = Math.ceil(Math.min(longSide, 900))
      unit.style.width = `${Wd}px`
      const need = Math.max(Wd, unit.scrollWidth)
      const H = unit.offsetHeight
      const wrapW = wrap.clientWidth
      const visibleLong = window.innerHeight - headerHeight - 24
      const s = Math.min(1, wrapW / H, visibleLong / need)
      setGeo((g) => (g && g.Wd === need && g.H === H && Math.abs(g.s - s) < 0.001 ? g : { Wd: need, H, s }))
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
