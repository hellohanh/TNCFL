import { useLayoutEffect, useRef } from 'react'
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

export default function SeasonExtremesRow({ competence, topweeks, lowweeks, meta }: SeasonExtremesRowProps) {
  const competenceCardRef = useRef<HTMLDivElement>(null)
  const topCardRef = useRef<HTMLDivElement>(null)
  const topListRef = useRef<HTMLDivElement>(null)
  const lowCardRef = useRef<HTMLDivElement>(null)
  const lowListRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    function fit() {
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
  }, [competence, topweeks, lowweeks])

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
