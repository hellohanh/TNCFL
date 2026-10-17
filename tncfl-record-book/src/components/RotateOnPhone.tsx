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
const MAX_SCALE = 1.6

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
      // Entry 106 — EQUAL-HEIGHT FILL (Hanh's rule for every flipped panel):
      // 1) every flipped panel is scaled so its height fills the turned screen
      //    height (= the phone's content width) exactly, so all flipped panels
      //    share one height, set by the device — and nothing is left under them;
      // 2) its layout length is chosen so that, at that scale, it fills the
      //    visible length below the header; a panel that NEEDS more length (a
      //    wide table) keeps its natural width and simply runs longer — you
      //    scroll along it.
      // Repeats a few passes because a panel's height can depend on its width
      // (charts, donuts). Scale is capped at MAX_SCALE for very short panels.
      const wrapW = wrap.clientWidth
      const visibleLong = window.innerHeight - headerHeight - 24
      // The narrowest the content can go (tables' natural width; charts ~0):
      // lay the panel out at 1px and read how wide it and its tables insist on
      // being. Entry 112 (speed): only the panel and its <table>s are read —
      // was every element + getComputedStyle, the single biggest cost of
      // opening a season page on a phone.
      unit.style.width = '1px'
      let minW = Math.max(1, unit.scrollWidth)
      unit.querySelectorAll('table').forEach((t) => {
        minW = Math.max(minW, t.offsetWidth)
      })
      let Wd = Math.max(minW, Math.ceil(Math.min(Math.max(window.innerHeight, window.screen?.height || 0) - 24, 900)))
      let H = 0
      let s = 1
      for (let pass = 0; pass < 3; pass++) {
        unit.style.width = `${Wd}px`
        H = unit.offsetHeight
        s = Math.min(wrapW / H, MAX_SCALE)
        // Layout length that fills the visible length at this scale — never
        // narrower than the content needs.
        const target = Math.max(minW, Math.floor(visibleLong / s))
        if (Math.abs(target - Wd) <= 2) break
        Wd = target
      }
      unit.style.width = `${Wd}px`
      H = unit.offsetHeight
      s = Math.min(wrapW / H, MAX_SCALE)
      setGeo((g) => (g && g.Wd === Wd && g.H === H && Math.abs(g.s - s) < 0.001 ? g : { Wd, H, s }))
    }
    // Entry 112 (speed): measure only when the panel is within about a screen
    // of the viewport — not all 9 flipped panels the moment a season page
    // opens. Until then it reserves the usual flipped height (see below), so
    // the page doesn't jump. Re-measures on resize once it has been seen.
    let ro: ResizeObserver | null = null
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        measure()
        ro = new ResizeObserver(() => {
          cancelAnimationFrame(raf)
          raf = requestAnimationFrame(measure)
        })
        ro.observe(unit)
        ro.observe(wrap)
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(wrap)
    return () => {
      io.disconnect()
      ro?.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [upright, headerHeight])

  if (!upright) return <>{children}</>

  const s = geo?.s ?? 1
  const Wd = geo?.Wd ?? 0
  const H = geo?.H ?? 0
  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      <div
        style={{
          position: 'relative',
          width: H * s,
          // Before it's measured, hold the usual flipped length (the visible
          // screen height below the header) so nothing below jumps.
          height: geo ? Wd * s : Math.max(0, window.innerHeight - headerHeight - 24),
        }}
      >
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
