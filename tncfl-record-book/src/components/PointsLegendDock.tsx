import { Fragment, useRef, useState } from 'react'
import styles from './PointsLegendDock.module.css'

// The "Points per finish" legend on a pull-out handle (Entry 104), shared by
// every Cumulative Competence Chart on the site — the Records page's
// CumulativeCompetenceChart and each Season page's CompetenceChart — on
// desktop AND phones (Entry 91 started it phones-only on Records).
//
// The legend is tucked off the chart panel's right edge; only the handle shows
// — the same yellow pill as the site's nav handle (mustard, three dots),
// rounded on its left since it pulls out leftward. Tap the handle or swipe it
// left to pull the legend out; tap the handle or the legend, or swipe right,
// to tuck it back. The parent panel must be `position: relative` with
// `overflow: hidden` so the tucked legend is clipped.
const LEGEND: Array<[string, string]> = [
  ['1st', '10'],
  ['2nd', '5'],
  ['3rd', '2'],
  ['4th', '1'],
  ['5th', '0.9'],
  ['6th', '0.8'],
  ['7th', '0.7'],
  ['8th', '0.6'],
  ['9th', '0.5'],
  ['10th', '0.4'],
]

export default function PointsLegendDock() {
  const [open, setOpen] = useState(false)
  const touchX = useRef<number | null>(null)
  return (
    <div
      className={`${styles.dock} ${open ? styles.open : ''}`}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX
      }}
      onTouchEnd={(e) => {
        if (touchX.current === null) return
        const dx = e.changedTouches[0].clientX - touchX.current
        touchX.current = null
        if (dx < -20) setOpen(true)
        else if (dx > 20) setOpen(false)
      }}
    >
      <button
        type="button"
        className={styles.handle}
        aria-label={open ? 'Hide points per finish' : 'Show points per finish'}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation()
          setOpen((o) => !o)
        }}
      >
        <span className={styles.pill}>
          <i />
          <i />
          <i />
        </span>
      </button>
      <div
        className={styles.legend}
        onClick={(e) => {
          e.stopPropagation()
          setOpen(false)
        }}
      >
        <div className={styles.legTitle}>POINTS PER FINISH</div>
        <div className={styles.legGrid}>
          {LEGEND.map(([place, pts]) => (
            <Fragment key={place}>
              <span className={styles.legPl}>{place}</span>
              <span className={styles.legPt}>{pts}</span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
