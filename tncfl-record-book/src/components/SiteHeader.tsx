import { forwardRef } from 'react'
import styles from './SiteHeader.module.css'

// Structure lifted directly from the old hub's real .site-brand markup
// (logo + two-line title + subtitle), not guessed — the only deliberate
// change is "Hub" -> "Record Book", matching this project's actual rename.
// This sits ABOVE the rail+content row (see Layout.tsx), not squeezed into
// the rail itself — the user's call, since the old header's horizontal
// shape doesn't fit the narrow vertical rail.
//
// forwardRef (Milestone 7e): Layout needs to measure this header's real
// height so the sticky rail can offset itself to sit just below it. The ref
// has to land on the actual <header> element — NOT a wrapping div around
// it — because position:sticky needs room within its own PARENT's height to
// stick at all; a wrapper div sized exactly to the header's height would
// give the sticky header nowhere to go, and it would just scroll away
// immediately (a real bug caught by testing, not a hypothetical).
const SiteHeader = forwardRef<HTMLElement>(function SiteHeader(_props, ref) {
  return (
    <header ref={ref} className={styles.header}>
      <div className={styles.brand}>
        <img className={styles.logo} src={import.meta.env.BASE_URL + 'header_logo.png'} alt="TNCFL logo" />
        <div className={styles.titleWrap}>
          <div className={styles.title}>Thursday Night Curse</div>
          <div className={styles.title}>
            <span className={styles.accent}>Fantasy Football League</span> Record Book
          </div>
          <div className={styles.sub}>Est. 2011 &middot; 15 Seasons</div>
        </div>
      </div>
    </header>
  )
})

export default SiteHeader
