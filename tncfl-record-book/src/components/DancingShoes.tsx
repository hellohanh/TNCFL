import type { DanceCard, Meta } from '../types/data'
import { useManagerHover } from '../lib/useManagerHover'
import styles from './DancingShoes.module.css'

interface DancingShoesProps {
  dance: DanceCard
  meta: Meta
}

// Rebuilt to match the old hub's real markup — Dancing Shoes is actually
// rendered through the SAME nugget-card system as the regular nugget cards
// (`<div class="nugget purple"><h4>💃 You Need Your Dancing Shoes</h4>...`),
// not a bespoke standalone card. The purple accent stripe, the divider under
// the name, and the pink "WEEKS DRY" badge all come from that real markup —
// confirmed against TNCFL_hub.html, not approximated from a screenshot.
//
// Single manager reference (the drought "victim") — safe to call
// useManagerHover directly here, same reasoning as SeasonHero/SeasonStatTiles
// (no loop, so no Rules-of-Hooks risk).
export default function DancingShoes({ dance, meta }: DancingShoesProps) {
  const victimHover = useManagerHover(dance.victim)
  const color = meta.manager_colors[dance.victim] ?? '#888'

  return (
    <div className={styles.card}>
      <div className={styles.title}>{'\u{1F483}'} You Need Your Dancing Shoes</div>
      <div className={styles.victimRow}>
        <span
          className={styles.name}
          style={{ color }}
          onMouseEnter={victimHover.onMouseEnter}
          onMouseLeave={victimHover.onMouseLeave}
        >
          {dance.victim}
        </span>
        <span className={styles.weeks}>{dance.weeks} weeks dry</span>
      </div>
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: dance.body }} />
    </div>
  )
}

