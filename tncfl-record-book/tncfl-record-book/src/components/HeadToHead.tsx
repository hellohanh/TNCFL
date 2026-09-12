import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { RecordBookData } from '../types/data'
import H2HMatrix from './H2HMatrix'
import H2HDuelPicker from './H2HDuelPicker'
import styles from './HeadToHead.module.css'

// LEAGUE sub-page. Career-scoped H2H (distinct from Milestone 12's
// season-scoped matrix, which — checked — was never actually built; this is
// the first H2H component in this app). Two sub-tabs matching the old
// hub's real h2hTab(): All-vs-All Matrix (default) and Duel Picker. Local
// tab state, not URL-driven — matches the old hub's own behavior for this
// internal toggle (unlike Manager Profiles' manager selection, which IS
// URL-driven per that earlier decision).
export default function HeadToHead() {
  const data = useOutletContext<RecordBookData>()
  const [tab, setTab] = useState<'matrix' | 'duel'>('matrix')

  return (
    <div>
      <div className="module-title">Head-to-Head</div>
      <div className={styles.tabs}>
        <button type="button" className={tab === 'matrix' ? styles.tabActive : styles.tab} onClick={() => setTab('matrix')}>
          All-vs-All Matrix
        </button>
        <button type="button" className={tab === 'duel' ? styles.tabActive : styles.tab} onClick={() => setTab('duel')}>
          Duel Picker
        </button>
      </div>

      {tab === 'matrix' ? (
        <H2HMatrix h2h={data.h2h} career={data.career} meta={data.meta} />
      ) : (
        <H2HDuelPicker h2h={data.h2h} career={data.career} meta={data.meta} allPlayers={data.meta.hmotw.all_players} />
      )}
    </div>
  )
}
