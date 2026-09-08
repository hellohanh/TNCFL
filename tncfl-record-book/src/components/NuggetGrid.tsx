import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { Nugget } from '../types/data'
import { useInView } from '../lib/useInView'
import styles from './NuggetGrid.module.css'

interface NuggetGridProps {
  nuggets: Nugget[]
}

// Real accent hex values pulled directly from the old hub's actual
// .nugget.<accent> CSS rules (confirmed in Milestone 7k).
const ACCENT_COLORS: Record<string, string> = {
  gold: '#d4a017',
  blue: '#185fa5',
  green: '#0f6e56',
  red: '#f87171',
  brand: '#c0252b',
  teal: '#00b894',
  purple: '#8854d0',
  orange: '#ee5a24',
}
const FALLBACK_ACCENT = '#888'

// Fixed canvas geometry — matches the nugget-panel-sandbox tool exactly,
// since that tool is where every season's layout is authored before being
// exported into site_data.json. A fixed, non-responsive width was a
// deliberate choice (confirmed directly, not assumed) over the previous
// fluid CSS-grid layout, matching how the layout is actually designed.
const N_COLS = 4
const GAP = 12
const RECT_WIDTH = 1200
const COL_WIDTH = (RECT_WIDTH - (N_COLS - 1) * GAP) / N_COLS

function colLeft(colStart: number): number {
  return (colStart - 1) * (COL_WIDTH + GAP)
}
function colRight(colEnd: number): number {
  return colLeft(colEnd) + COL_WIDTH
}
function panelLeft(n: Nugget): number {
  return colLeft(n.colStart)
}
function panelWidth(n: Nugget): number {
  return colRight(n.colStart + n.colSpan - 1) - colLeft(n.colStart)
}

// Ported directly from the nugget-panel-sandbox tool's (already
// bug-fixed) version: a panel only stretches if it has genuinely clear
// space below it in EVERY column it covers, capped at whichever other
// column-overlapping panel sits closest below it — never blindly
// stretched to the full container height. A per-column-in-isolation
// version of this check was tried and fails for wide, multi-column
// panels (it can judge a panel "clear to stretch" based on just one of
// its columns while a different panel occupies one of its OTHER columns
// below it) — this per-panel version was the fix for that, confirmed
// against the sandbox's own real usage before porting it here.
function computeLayout(nuggets: Nugget[]): { containerHeight: number; stretchTo: Map<string, number> } {
  let containerHeight = 0
  for (const n of nuggets) containerHeight = Math.max(containerHeight, n.top + n.ownHeight)

  const stretchTo = new Map<string, number>()
  for (const p of nuggets) {
    let cap = containerHeight
    for (const q of nuggets) {
      if (q === p) continue
      const colOverlap = p.colStart <= q.colStart + q.colSpan - 1 && q.colStart <= p.colStart + p.colSpan - 1
      if (!colOverlap) continue
      if (q.top >= p.top + p.ownHeight - 0.5) {
        cap = Math.min(cap, q.top - GAP)
      }
    }
    const target = Math.max(p.ownHeight, cap - p.top)
    if (target > p.ownHeight + 0.5) {
      stretchTo.set(p.title, target)
    }
  }
  return { containerHeight, stretchTo }
}

// Nugget grid layout: each nugget is independently positioned by its own
// authored colStart/colSpan/top/ownHeight (see the Nugget type) — no more
// row-letter grid-cell strings, no more `stack`/`stackWidth` nesting.
// Replaces the previous CSS-grid row-track system (`gridTemplateRows:
// repeat(rows, auto)`), which forced every column sharing a row letter to
// match that row's tallest occupant — the actual cause of the dead-space
// and alignment problems `stack` was built to work around. Positions are
// authored, not measured or estimated at render time. Heights start from
// the authored `ownHeight`, then get auto-stretched to fill dead space
// (see computeStretch below) — ported directly from the sandbox tool,
// after discovering the sandbox had been applying this the whole time
// while the user was arranging Final Layout, invisibly, since the
// exported data only ever captured the unstretched authored heights.
export default function NuggetGrid({ nuggets }: NuggetGridProps) {
  const { ref, isInView } = useInView({ once: false, threshold: 0.1 })

  const { containerHeight, stretchTo } = useMemo(() => computeLayout(nuggets), [nuggets])

  // Rule 3: each nugget's page-turn animation is independently randomized —
  // axis (left-edge or top-edge), stagger delay, and a 1500-3000ms
  // duration — re-rolled every time this panel scrolls into view.
  const flipsByTitle = useMemo(() => {
    const map = new Map<string, { axis: 'X' | 'Y'; delay: number; duration: number }>()
    for (const n of nuggets) {
      map.set(n.title, {
        axis: Math.random() < 0.5 ? 'Y' : 'X',
        delay: Math.random() * 0.5,
        duration: 1.5 + Math.random() * 1.5,
      })
    }
    return map
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deliberately re-rolls every time isInView flips true, not just when nuggets change
  }, [nuggets, isInView])

  function renderCardContent(nugget: Nugget) {
    const flip = flipsByTitle.get(nugget.title)!
    const accentColor = ACCENT_COLORS[nugget.accent] ?? FALLBACK_ACCENT
    return (
      <motion.div
        key={nugget.title}
        className={styles.card}
        style={{
          position: 'absolute',
          left: panelLeft(nugget),
          top: nugget.top,
          width: panelWidth(nugget),
          height: stretchTo.get(nugget.title) ?? nugget.ownHeight,
          borderLeftColor: accentColor,
          transformOrigin: flip.axis === 'Y' ? 'left center' : 'top center',
        }}
        initial={{
          opacity: 0,
          rotateX: flip.axis === 'X' ? 90 : 0,
          rotateY: flip.axis === 'Y' ? 90 : 0,
        }}
        animate={
          isInView
            ? { opacity: 1, rotateX: 0, rotateY: 0 }
            : {
                opacity: 0,
                rotateX: flip.axis === 'X' ? 90 : 0,
                rotateY: flip.axis === 'Y' ? 90 : 0,
              }
        }
        transition={{ duration: flip.duration, delay: flip.delay, ease: 'easeOut' }}
      >
        <div className={styles.title}>{nugget.title}</div>
        <div className={styles.text} dangerouslySetInnerHTML={{ __html: nugget.body }} />
      </motion.div>
    )
  }

  return (
    <div
      ref={ref}
      className={styles.grid}
      style={{ width: RECT_WIDTH, height: containerHeight }}
    >
      {nuggets.map((nugget) => renderCardContent(nugget))}
    </div>
  )
}
