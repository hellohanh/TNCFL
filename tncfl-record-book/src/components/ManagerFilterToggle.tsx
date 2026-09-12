import { useManagerFilterContext } from '../lib/ManagerFilterContext'
import styles from './ManagerFilterToggle.module.css'

// A deliberately simplified version of the hub's real "Filter Managers" bar
// (which also had Clear All + one pill per individual manager) — per the
// user's explicit call, since hover/click-to-pin already covers picking an
// individual manager. Just the two pills that remain: "All Managers" and
// "Money Circle", both styled with the hub's real `.fpill.money` treatment
// (both pills share that green tint in the actual hub markup — Money Circle
// isn't a visually distinct "special" pill, both states use the same class).
export default function ManagerFilterToggle() {
  const { mode, setMode } = useManagerFilterContext()
  return (
    <div className={styles.row}>
      <button
        className={`${styles.pill} ${mode === 'all' ? styles.active : ''}`}
        onClick={() => setMode('all')}
      >
        All Managers
      </button>
      <button
        className={`${styles.pill} ${mode === 'moneyCircle' ? styles.active : ''}`}
        onClick={() => setMode('moneyCircle')}
      >
        Money Circle
      </button>
    </div>
  )
}
