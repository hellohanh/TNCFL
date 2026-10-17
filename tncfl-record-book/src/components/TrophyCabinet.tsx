import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { motion } from 'framer-motion'
import type { Meta, PayoutsEntry } from '../types/data'
import { computeTrophyCabinet, trophyImageSrc } from '../lib/computeTrophyCabinet'
import { ord } from '../lib/format'
import { useIsPhone } from '../lib/useIsPhone'
import styles from './TrophyCabinet.module.css'

interface TrophyCabinetProps {
  payouts: Record<string, PayoutsEntry>
  yearsDesc: number[]
  meta: Meta
}

interface Flare {
  id: string
  xOffset: number // px from stage center
  yOffset: number // px from stage center
  size: number // px, base circle diameter
}

// Replaces the old hub's per-manager `.hof-rings-grid` (a static grid of
// "N rings side by side" cards) entirely — see ROADMAP.md Milestone 17.
// Instead of one card per manager, this is one card per CHAMPIONSHIP YEAR,
// most-recent-first, and the "art" is that champion's career trophy pile as
// of that year — so a repeat champion's art visibly grows across their
// entries (Randy: 1LT in 2014 -> 2LT in 2018 -> 3LT in 2024). Confirmed with
// the user this fully replaces the old cabinet, not a second view alongside
// it.
//
// Only the current + up to 2 neighbors on each side actually render (see
// WINDOW below) — with 15 years today this is cheap either way, but caps the
// DOM/animation work if the league runs another decade.
const WINDOW = 2

// Carousel geometry. Desktop is the locked Milestone 17 coverflow, unchanged.
// Phones (<=820px, Entry 88, per Hanh): the trophy is sized to the screen and
// ONLY that year's trophy is visible at rest — neighbors sit off to the sides
// at opacity 0, so on a year change the old trophy glides out one side while
// the new one glides in from the other, and nothing else stays on screen.
const LAYOUT = {
  desktop: { o1: 225, o2: 375, s1: 0.625, s2: 0.25, a1: 0.25, a2: 0.1, flareSpread: 300 },
  phone: { o1: 190, o2: 320, s1: 0.55, s2: 0.32, a1: 0, a2: 0, flareSpread: 195 },
}

export default function TrophyCabinet({ payouts, yearsDesc, meta }: TrophyCabinetProps) {
  const entries = useMemo(() => computeTrophyCabinet(payouts, yearsDesc), [payouts, yearsDesc])
  const [current, setCurrent] = useState(0)
  const [flares, setFlares] = useState<Flare[]>([])
  const n = entries.length
  const isPhone = useIsPhone()
  const L = isPhone ? LAYOUT.phone : LAYOUT.desktop
  // Phones: live finger offset while swiping the stage (the focal trophy follows
  // the finger). The <img>s have pointer-events:none, so their own framer-motion
  // `drag` never receives a touch — swipes have to be read off the stage itself.
  const [swipeX, setSwipeX] = useState(0)

  function go(delta: number) {
    setCurrent((c) => Math.max(0, Math.min(n - 1, c + delta)))
  }

  // One lens flare per trophy in the newly-focused year (a 3rd-title year
  // fires 3 flares), each at a random spot in the stage — re-fires on every
  // transition (buttons, keyboard, or drag all funnel through `current`).
  // Keyed with a timestamp so re-visiting a year with the same title count
  // still replays the CSS animation instead of no-opping on identical keys.
  useEffect(() => {
    const count = entries[current]?.titleNum ?? 0
    const batchId = Date.now()
    const batch: Flare[] = Array.from({ length: count }, (_, i) => ({
      id: `${batchId}-${i}`,
      xOffset: (Math.random() - 0.5) * L.flareSpread, // within the focal image's own footprint, not the full (much wider) stage
      yOffset: (Math.random() - 0.5) * L.flareSpread,
      size: 16 + Math.random() * 22, // 16-38px
    }))
    setFlares(batch)
    const t = setTimeout(() => setFlares([]), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-fire on year change, not on every render
  }, [current])

  const visible = entries
    .map((entry, i) => ({ entry, i, d: i - current }))
    .filter(({ d }) => Math.abs(d) <= WINDOW)

  const active = entries[current]
  const activeColor = meta.manager_colors[active.m] ?? '#888'

  return (
    <div className={styles.card}>
      <motion.div
        className={styles.stage}
        onPan={(_, info) => { if (isPhone) setSwipeX(info.offset.x * 0.6) }}
        onPanEnd={(_, info) => {
          if (!isPhone) return
          setSwipeX(0)
          // Swipe left brings in the trophy on the right (older year).
          if (info.offset.x < -50) go(1)
          else if (info.offset.x > 50) go(-1)
        }}
        tabIndex={0}
        role="group"
        aria-label={`Championship trophy cabinet, ${current + 1} of ${n}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1) // right = older, matches the swapped nav buttons below
          if (e.key === 'ArrowLeft') go(-1)
        }}
      >
        {visible.map(({ entry, d }) => {
          const absD = Math.abs(d)
          // Focal->Immediate offset (225px) and Immediate->Far offset (150px
          // more, so 375px total from focal) are two independently-set
          // steps now, not one uniform d*step formula.
          const offset = d === 0 ? swipeX : Math.sign(d) * (absD === 1 ? L.o1 : L.o2)
          return (
            <motion.img
              key={entry.year}
              src={trophyImageSrc(entry.titleNum)}
              alt={d === 0 ? `${entry.m}'s ${ord(entry.titleNum)} championship trophy, ${entry.year}` : ''}
              aria-hidden={d !== 0}
              className={styles.trophyImg}
              drag={d === 0 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(-1)
                else if (info.offset.x > 60) go(1)
              }}
              animate={{
                x: `calc(-50% + ${offset}px)`,
                y: '-50%',
                scale: d === 0 ? 1 : absD === 1 ? L.s1 : L.s2,
                opacity: d === 0 ? 1 : absD === 1 ? L.a1 : L.a2,
              }}
              initial={false}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ zIndex: 10 - absD }}
            />
          )
        })}

        {flares.map((f) => (
          <span
            key={f.id}
            className={styles.flare}
            aria-hidden="true"
            style={
              {
                left: `calc(50% + ${f.xOffset}px)`,
                top: `calc(50% + ${f.yOffset}px)`,
                '--flare-size': `${f.size}px`,
              } as CSSProperties
            }
          />
        ))}
      </motion.div>

      <div className={styles.caption}>
        <div className={styles.year} style={{ color: activeColor }}>
          {active.year}
        </div>
        <div className={styles.champ} style={{ color: activeColor }}>
          {active.m}
        </div>
        <div className={styles.meta}>
          {active.titleNum} {active.titleNum === 1 ? 'title' : 'titles'}: {active.titleYears.join(', ')}
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => go(-1)}
          disabled={current <= 0}
          aria-label="More recent year"
        >
          &lsaquo;
        </button>
        <span className={styles.pos}>
          {current + 1} of {n}
        </span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => go(1)}
          disabled={current >= n - 1}
          aria-label="Older year"
        >
          &rsaquo;
        </button>
      </div>
    </div>
  )
}
