import { Outlet } from 'react-router-dom'
import type { CSSProperties } from 'react'
import TimelineRail from './TimelineRail'
import SiteHeader from './SiteHeader'
import { useElementSize } from '../lib/useElementSize'
import { HeaderHeightProvider } from '../lib/HeaderHeightContext'
import { useHoveredManagerContext } from '../lib/HoveredManagerContext'
import type { RecordBookData } from '../types/data'

interface LayoutProps {
  data: RecordBookData
}

// Layout is the piece that's "persistent across every /season/:year route" —
// the timeline rail always renders here, and only the <Outlet /> content
// swaps as the URL changes. This is the actual mechanism behind "a
// persistent year-timeline rail with season chapters underneath it."
//
// Milestone 8 added SiteHeader above the rail+content row (a new
// "layout-body" wrapper holds that row) — a full-width horizontal banner,
// per the user's choice, rather than squeezing the logo into the narrow
// vertical rail.
//
// Milestone 7e: both the header and the rail are now sticky (scrolling only
// moves the season content). The rail's sticky "top" offset has to equal the
// header's REAL rendered height, not a guessed constant — heights can shift
// slightly with font metrics, so this measures it live with useElementSize
// (same hook the hero sparkline uses) and feeds it to the rail via a CSS
// custom property, rather than hardcoding a pixel number that could drift
// out of sync with the actual header.
//
// `data` is fetched ONCE in App.tsx and handed down from here — this is
// "lifting state up": both TimelineRail (needs the list of years + colors)
// and whatever renders inside <Outlet /> (needs the season's own data) need
// the same fetched data, so it lives in the nearest shared ancestor (this
// component's parent, App) rather than being fetched twice.
export default function Layout({ data }: LayoutProps) {
  const { ref: headerRef, height: headerHeight } = useElementSize<HTMLDivElement>({
    width: 0,
    height: 118,
  })
  // Click-to-pin (any manager name/dot) stops propagation on its own click,
  // so only a genuine "background" click ever bubbles up to clear the pin
  // here. This lives at .layout-body, not .season-page or .layout-content —
  // the content column is capped at 1250px (Milestone 7r), so on a wide
  // screen the empty side margins are actually part of .layout-body's own
  // background, outside both of those narrower elements. Confirmed via a
  // real click-coordinate test before picking this level, not assumed.
  const { setPinned } = useHoveredManagerContext()

  return (
    <HeaderHeightProvider value={headerHeight}>
      <div className="layout">
        <SiteHeader ref={headerRef} />
        <div
          className="layout-body"
          style={{ '--header-height': `${headerHeight}px` } as CSSProperties}
          onClick={() => setPinned(null)}
        >
          {/* Milestone 16 COMPLETE — all 15 seasons (2011-2025) have been through the
              real-data verification pass (see ROADMAP.md/SESSION_LEDGER.md). The
              temporary batch-by-batch windowing filter has been removed; this now
              just renders the full year list directly. */}
          <TimelineRail years={data.meta.years_desc} />
          <main className="layout-content">
            {/* Outlet renders whichever nested route matched — SeasonPage right
                now, more route types later (e.g. a League/Hall of Fame page in
                Milestone 17). `context={data}` is how a component rendered THROUGH
                Outlet gets access to data lifted up here, via useOutletContext(). */}
            <Outlet context={data} />
          </main>
        </div>
      </div>
    </HeaderHeightProvider>
  )
}
