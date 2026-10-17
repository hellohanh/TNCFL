import { useLayoutEffect, useRef } from 'react'
import { useIsPhone } from '../lib/useIsPhone'
import type { CompetenceRow, WeekExtremeRow, Meta } from '../types/data'
import CompetenceChart from './CompetenceChart'
import WeekExtremeCard from './WeekExtremeCard'
import styles from './SeasonExtremesRow.module.css'

interface SeasonExtremesRowProps {
  competence: CompetenceRow[]
  topweeks: WeekExtremeRow[]
  lowweeks: WeekExtremeRow[]
  meta: Meta
}

// Ported from the old hub's real sumFitTopWeeks() — Competence's real
// rendered height becomes the target; each week-extremes card is stretched
// to match it exactly, then its rows are revealed one at a time (measuring
// each row's real height) until adding the next would overflow the target.
// This is a straightforward 1D "how many rows fit" problem, NOT the 2D
// masonry-placement problem that Milestone 7l fought and ultimately
// abandoned — deliberately kept imperative/DOM-measurement-based here
// because that's what the hub's own real code does and it isn't the same
// failure mode.
function fitRowsToTarget(card: HTMLDivElement | null, list: HTMLDivElement | null, target: number) {
  if (!card || !list) return
  card.style.maxHeight = `${target}px`
  card.style.minHeight = `${target}px`
  const listTop = list.getBoundingClientRect().top - card.getBoundingClientRect().top
  const rows = Array.from(list.children) as HTMLElement[]
  // reset all rows visible first — a previous pass may have hidden some,
  // and a hidden row measures 0 height, which would corrupt a re-fit after
  // e.g. a window resize made more room available.
  rows.forEach((r) => {
    r.style.display = ''
  })
  let used = listTop
  let cutoff = -1
  for (let i = 0; i < rows.length; i++) {
    const h = rows[i].getBoundingClientRect().height
    if (used + h > target - 2) {
      cutoff = i
      break
    }
    used += h
  }
  if (cutoff >= 0) {
    for (let i = cutoff; i < rows.length; i++) rows[i].style.display = 'none'
  }
}

// Phones (Entry 106, Records-tab treatment): the three panels stack (CSS), so
// there's no shared height to match — instead each list shows exactly its top
// 15 rows and scrolls for the rest, like the Records tab.
// Entry 112 (speed): all style WRITES for both lists first, then all READS —
// one page layout instead of one per list (each forced layout of a full
// season page cost ~240ms on a phone). Rows are only un-hidden if a desktop
// fit had hidden them.
function capListsToRows(pairs: Array<[HTMLDivElement | null, HTMLDivElement | null]>, n: number) {
  const lists: HTMLDivElement[] = []
  for (const [card, list] of pairs) {
    if (!card || !list) continue
    card.style.maxHeight = ''
    card.style.minHeight = ''
    for (const r of Array.from(list.children) as HTMLElement[]) if (r.style.display) r.style.display = ''
    list.style.overflowY = 'auto'
    list.style.maxHeight = ''
    lists.push(list)
  }
  const caps = lists.map((list) => {
    const rows = list.children
    if (rows.length <= n) return ''
    return `${Math.ceil((rows[n - 1] as HTMLElement).offsetTop + (rows[n - 1] as HTMLElement).offsetHeight - (rows[0] as HTMLElement).offsetTop)}px`
  })
  lists.forEach((list, i) => {
    list.style.maxHeight = caps[i]
  })
}

export default function SeasonExtremesRow({ competence, topweeks, lowweeks, meta }: SeasonExtremesRowProps) {
  const competenceCardRef = useRef<HTMLDivElement>(null)
  const topCardRef = useRef<HTMLDivElement>(null)
  const topListRef = useRef<HTMLDivElement>(null)
  const lowCardRef = useRef<HTMLDivElement>(null)
  const lowListRef = useRef<HTMLDivElement>(null)

  const isPhone = useIsPhone()

  useLayoutEffect(() => {
    function fit() {
      if (isPhone) {
        capListsToRows(
          [
            [topCardRef.current, topListRef.current],
            [lowCardRef.current, lowListRef.current],
          ],
          15,
        )
        return
      }
      for (const l of [topListRef.current, lowListRef.current]) {
        if (l) {
          l.style.maxHeight = ''
          l.style.overflowY = ''
        }
      }
      const ccCard = competenceCardRef.current
      if (!ccCard) return
      const target = ccCard.getBoundingClientRect().height
      fitRowsToTarget(topCardRef.current, topListRef.current, target)
      fitRowsToTarget(lowCardRef.current, lowListRef.current, target)
    }
    fit()
    const ro = new ResizeObserver(fit)
    if (competenceCardRef.current) ro.observe(competenceCardRef.current)
    return () => ro.disconnect()
  }, [competence, topweeks, lowweeks, isPhone])

  return (
    <div className={styles.row}>
      <div className={styles.col} ref={competenceCardRef}>
        <CompetenceChart rows={competence} meta={meta} />
      </div>
      <div className={styles.col}>
        <WeekExtremeCard
          title={`${'\u{1F3C6}'} All-Time Highest Single Week Score`}
          accentColor="#d4a017"
          rows={topweeks}
          meta={meta}
          ref={topCardRef}
          listRef={topListRef}
        />
      </div>
      <div className={styles.col}>
        <WeekExtremeCard
          title={`${'\u{1F480}'} All-Time Lowest Single Week Score`}
          accentColor="#185fa5"
          rows={lowweeks}
          meta={meta}
          ref={lowCardRef}
          listRef={lowListRef}
        />
      </div>
    </div>
  )
}
