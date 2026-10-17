import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import styles from './MobileTabDrawer.module.css'

interface MobileTabDrawerProps {
  years: number[] // meta.years_desc — newest first
}

const LEAGUE_LINKS = [
  { to: '/league/hof', label: 'Hall of Fame' },
  { to: '/league/profiles', label: 'Manager Profiles' },
  { to: '/league/records', label: 'Records' },
  { to: '/league/h2h', label: 'Head-to-Head' },
  { to: '/league/how-it-works', label: 'How Our League Works' },
]

const TRACKER_URL = 'https://hellohanh.github.io/TNCFL_TRACKER/TNCFL_2026_Tracker.html'

// Mobile tab drawer (phones/narrow screens only, <=820px — same breakpoint as
// the 2026 Tracker's). Ported from the Tracker's yellow edge-handle drawer
// (TNCFL_2026_Tracker.html, "MOBILE LAYOUT", tdw-*), MIRRORED to the LEFT
// edge per Hanh — the Record Book's year rail already lives on the left, so
// the handle sits where the rail used to be. On phones TimelineRail is hidden
// (index.css) and this drawer is the only navigation.
//
// Interaction, matching the Tracker's (mirrored):
// - tap the handle, or drag it right, to open; the panel follows the finger
// - drag the open panel left, tap the dim scrim, or press Escape to close
// - a drag past 30% of the panel width, or a quick flick, decides open/closed
// - choosing a link closes the drawer and scrolls back to the top
export default function MobileTabDrawer({ years }: MobileTabDrawerProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<{ x0: number; t0: number; dx: number; fromOpen: boolean; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)
  const location = useLocation()

  const clearInline = () => {
    if (panelRef.current) panelRef.current.style.transform = ''
    if (scrimRef.current) scrimRef.current.style.opacity = ''
  }
  const doOpen = useCallback(() => { setOpen(true); clearInline() }, [])
  const doClose = useCallback(() => { setOpen(false); clearInline() }, [])

  // Close on any route change (covers the browser back button too).
  useEffect(() => { doClose() }, [location.pathname, doClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') doClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [doClose])

  const panelWidth = () => panelRef.current?.getBoundingClientRect().width || 250

  function startDrag(x: number, fromOpen: boolean) {
    dragRef.current = { x0: x, t0: Date.now(), dx: 0, fromOpen, moved: false }
    setDragging(true)
  }
  function moveDrag(x: number) {
    const d = dragRef.current
    if (!d) return
    d.moved = true
    d.dx = x - d.x0
    const w = panelWidth()
    // How far the panel is pushed off-screen to the LEFT (0 = fully open, w = fully closed).
    const off = d.fromOpen ? Math.max(0, Math.min(w, -d.dx)) : Math.max(0, Math.min(w, w - d.dx))
    if (panelRef.current) panelRef.current.style.transform = `translateX(${-off}px)`
    if (scrimRef.current) scrimRef.current.style.opacity = String(1 - off / w)
  }
  function endDrag(tapOpens: boolean) {
    const d = dragRef.current
    dragRef.current = null
    setDragging(false)
    if (!d) return
    if (!d.moved) {
      if (tapOpens) doOpen()
      return
    }
    const w = panelWidth()
    const v = d.dx / Math.max(1, Date.now() - d.t0)
    const willOpen = d.fromOpen ? !(d.dx < -w * 0.3 || v < -0.5) : d.dx > w * 0.3 || v > 0.5
    if (willOpen) doOpen()
    else doClose()
  }

  // Entry 111 (Hanh): like the Tracker, the tapped tab lights up the moment
  // it's tapped (same .active look: white text, #222, red left bar) and stays
  // lit while the drawer slides away — the highlight moves off the old tab at
  // once, so the tap visibly registers before the page changes.
  const navigate = useNavigate()
  const [pending, setPending] = useState<string | null>(null)
  useEffect(() => { setPending(null) }, [location.pathname])
  const linkClass = (to: string) => ({ isActive }: { isActive: boolean }) =>
    (pending ? pending === to : isActive) ? `${styles.item} ${styles.active}` : styles.item
  const pick = (to: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    setPending(to)
    window.setTimeout(() => {
      doClose()
      navigate(to)
      window.scrollTo({ top: 0 })
    }, 160)
  }

  const rootClass = [styles.root, open ? styles.open : '', dragging ? styles.dragging : ''].join(' ')

  return (
    <div className={rootClass}>
      <div ref={scrimRef} className={styles.scrim} onClick={doClose} />
      <div
        className={styles.handle}
        role="button"
        aria-label="Open page menu"
        aria-expanded={open}
        onTouchStart={(e) => startDrag(e.touches[0].clientX, false)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={(e) => {
          // Stop the browser's follow-up "click": the drawer is already opening, and
          // that click would otherwise land on the scrim (which slides in over the
          // handle) and immediately close it again.
          e.preventDefault()
          endDrag(true)
        }}
        onClick={() => { if (!open) doOpen() }}
      >
        <div className={styles.pill}>
          <i />
          <i />
          <i />
        </div>
      </div>
      <nav
        ref={panelRef}
        className={styles.panel}
        aria-label="Record Book pages"
        aria-hidden={!open}
        onTouchStart={(e) => startDrag(e.touches[0].clientX, true)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={() => endDrag(false)}
      >
        <div className={styles.head}>League</div>
        {LEAGUE_LINKS.map((link) => (
          <NavLink key={link.to} to={link.to} className={linkClass(link.to)} onClick={pick(link.to)}>
            {link.label}
          </NavLink>
        ))}
        <div className={styles.head}>Seasons</div>
        <a className={styles.item} href={TRACKER_URL} target="_blank" rel="noopener noreferrer" onClick={doClose}>
          2026 ↗
        </a>
        {years.map((year) => (
          <NavLink key={year} to={`/season/${year}`} className={linkClass(`/season/${year}`)} onClick={pick(`/season/${year}`)}>
            {year}
          </NavLink>
        ))}
        <div className={styles.foot}>Swipe left or tap outside to close</div>
      </nav>
    </div>
  )
}
